package edu.cit.migallos.techlend.service;

import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.cit.migallos.techlend.dto.CreateLoanTransactionRequest;
import edu.cit.migallos.techlend.dto.LoanDetailResponse;
import edu.cit.migallos.techlend.dto.LoanTransactionResponse;
import edu.cit.migallos.techlend.entity.EquipmentItem;
import edu.cit.migallos.techlend.entity.LoanDetail;
import edu.cit.migallos.techlend.entity.LoanTransaction;
import edu.cit.migallos.techlend.enums.EquipmentItemStatus;
import edu.cit.migallos.techlend.enums.LoanItemStatus;
import edu.cit.migallos.techlend.enums.LoanTransactionStatus;
import edu.cit.migallos.techlend.repository.EquipmentItemRepository;
import edu.cit.migallos.techlend.repository.LoanDetailRepository;
import edu.cit.migallos.techlend.repository.LoanTransactionRepository;

@Service
public class LoanService {

    private final EquipmentItemRepository equipmentItemRepository;
    private final LoanTransactionRepository loanTransactionRepository;
    private final LoanDetailRepository loanDetailRepository;

    public LoanService(EquipmentItemRepository equipmentItemRepository,
                       LoanTransactionRepository loanTransactionRepository,
                       LoanDetailRepository loanDetailRepository) {
        this.equipmentItemRepository = equipmentItemRepository;
        this.loanTransactionRepository = loanTransactionRepository;
        this.loanDetailRepository = loanDetailRepository;
    }

    @Transactional
    public LoanTransactionResponse createLoanRequest(UUID borrowerId, CreateLoanTransactionRequest request) {
        Set<UUID> uniqueIds = new LinkedHashSet<>(request.getEquipmentIds());
        if (uniqueIds.isEmpty()) {
            throw new IllegalArgumentException("At least one equipment item is required");
        }

        List<EquipmentItem> equipmentItems = equipmentItemRepository.findAllById(uniqueIds);
        if (equipmentItems.size() != uniqueIds.size()) {
            throw new NoSuchElementException("One or more selected equipment items were not found");
        }

        for (EquipmentItem item : equipmentItems) {
            if (item.getStatus() != EquipmentItemStatus.AVAILABLE) {
                throw new IllegalArgumentException("Equipment item is not available: " + item.getPropertyTag());
            }
        }

        LoanTransaction transaction = new LoanTransaction();
        transaction.setBorrowerId(borrowerId);
        transaction.setStatus(LoanTransactionStatus.PENDING);
        transaction.setBorrowerNote(request.getBorrowerNote().trim());
        transaction.setRequestedTime(LocalDateTime.now());
        transaction.setExpectedReturnTime(request.getRequestDate().atStartOfDay());

        LoanTransaction savedTransaction = loanTransactionRepository.save(transaction);

        equipmentItems.forEach(item -> item.setStatus(EquipmentItemStatus.RESERVED));
        equipmentItemRepository.saveAll(equipmentItems);

        List<LoanDetail> details = equipmentItems.stream().map(item -> {
            LoanDetail detail = new LoanDetail();
            detail.setTransaction(savedTransaction);
            detail.setEquipment(item);
            detail.setItemStatus(LoanItemStatus.REQUESTED);
            return detail;
        }).toList();

        List<LoanDetail> savedDetails = loanDetailRepository.saveAll(details);
        savedTransaction.setDetails(savedDetails);

        return toResponse(savedTransaction, savedDetails);
    }

    @Transactional(readOnly = true)
    public List<LoanTransactionResponse> getBorrowerLoans(UUID borrowerId) {
        return loanTransactionRepository.findByBorrowerIdOrderByRequestedTimeDesc(borrowerId).stream()
                .map(transaction -> toResponse(transaction, transaction.getDetails()))
                .toList();
    }

    private LoanTransactionResponse toResponse(LoanTransaction transaction, List<LoanDetail> details) {
        LoanTransactionResponse response = new LoanTransactionResponse();
        response.setTransactionId(transaction.getTransactionId());
        response.setBorrowerId(transaction.getBorrowerId());
        response.setStatus(transaction.getStatus().name());
        response.setBorrowerNote(transaction.getBorrowerNote());
        response.setStaffRemark(transaction.getStaffRemark());
        response.setRequestedTime(transaction.getRequestedTime());
        response.setExpectedReturnTime(transaction.getExpectedReturnTime());
        response.setItems(details.stream().map(this::toDetailResponse).toList());
        return response;
    }

    private LoanDetailResponse toDetailResponse(LoanDetail detail) {
        LoanDetailResponse response = new LoanDetailResponse();
        response.setDetailId(detail.getDetailId());
        response.setEquipmentId(detail.getEquipment().getEquipmentId());
        response.setEquipmentName(detail.getEquipment().getModel().getName());
        response.setPropertyTag(detail.getEquipment().getPropertyTag());
        response.setItemStatus(detail.getItemStatus().name());
        response.setActualReturnTime(detail.getActualReturnTime());
        response.setItemRemarks(detail.getRemarks());
        return response;
    }
}

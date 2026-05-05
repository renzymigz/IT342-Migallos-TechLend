package edu.cit.migallos.techlend.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.cit.migallos.techlend.dto.CreateLoanTransactionRequest;
import edu.cit.migallos.techlend.dto.CreatePenaltyRequest;
import edu.cit.migallos.techlend.dto.LoanDetailResponse;
import edu.cit.migallos.techlend.dto.LoanTransactionResponse;
import edu.cit.migallos.techlend.dto.ProcessLoanReturnRequest;
import edu.cit.migallos.techlend.dto.UpdateLoanDecisionRequest;
import edu.cit.migallos.techlend.entity.EquipmentItem;
import edu.cit.migallos.techlend.entity.LoanDetail;
import edu.cit.migallos.techlend.entity.LoanTransaction;
import edu.cit.migallos.techlend.entity.User;
import edu.cit.migallos.techlend.enums.EquipmentItemStatus;
import edu.cit.migallos.techlend.enums.LoanItemStatus;
import edu.cit.migallos.techlend.enums.LoanTransactionStatus;
import edu.cit.migallos.techlend.enums.PenaltyType;
import edu.cit.migallos.techlend.repository.EquipmentItemRepository;
import edu.cit.migallos.techlend.repository.LoanDetailRepository;
import edu.cit.migallos.techlend.repository.LoanTransactionRepository;
import edu.cit.migallos.techlend.repository.UserRepository;

@Service
public class LoanService {

    private static final String LOAN_NOT_FOUND_MESSAGE = "Loan transaction not found";

    private final EquipmentItemRepository equipmentItemRepository;
    private final LoanTransactionRepository loanTransactionRepository;
    private final LoanDetailRepository loanDetailRepository;
    private final UserRepository userRepository;
    private final PenaltyService penaltyService;

    public LoanService(EquipmentItemRepository equipmentItemRepository,
                       LoanTransactionRepository loanTransactionRepository,
                       LoanDetailRepository loanDetailRepository,
                       UserRepository userRepository,
                       PenaltyService penaltyService) {
        this.equipmentItemRepository = equipmentItemRepository;
        this.loanTransactionRepository = loanTransactionRepository;
        this.loanDetailRepository = loanDetailRepository;
        this.userRepository = userRepository;
        this.penaltyService = penaltyService;
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

    @Transactional(readOnly = true)
    public List<LoanTransactionResponse> getPendingLoansForApproval() {
        return loanTransactionRepository.findByStatusOrderByRequestedTimeAsc(LoanTransactionStatus.PENDING).stream()
                .map(transaction -> toResponse(transaction, transaction.getDetails()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<LoanTransactionResponse> getApprovedLoansForPickup() {
        return loanTransactionRepository.findByStatusOrderByRequestedTimeAsc(LoanTransactionStatus.APPROVED).stream()
                .map(transaction -> toResponse(transaction, transaction.getDetails()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<LoanTransactionResponse> getActiveLoans() {
        return loanTransactionRepository.findByStatusOrderByRequestedTimeAsc(LoanTransactionStatus.ACTIVE).stream()
                .map(transaction -> toResponse(transaction, transaction.getDetails()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<LoanTransactionResponse> getCompletedLoans() {
        return loanTransactionRepository.findByStatusOrderByRequestedTimeAsc(LoanTransactionStatus.COMPLETED).stream()
                .map(transaction -> toResponse(transaction, transaction.getDetails()))
                .toList();
    }

    @Transactional
    public LoanTransactionResponse decideLoanRequest(UUID transactionId,
                                                     UUID approverId,
                                                     UpdateLoanDecisionRequest request) {
        LoanTransaction transaction = loanTransactionRepository.findById(transactionId)
            .orElseThrow(() -> new NoSuchElementException(LOAN_NOT_FOUND_MESSAGE));

        if (transaction.getStatus() != LoanTransactionStatus.PENDING) {
            throw new IllegalArgumentException("Only pending requests can be decided");
        }

        LoanTransactionStatus nextStatus = parseDecisionStatus(request.getStatus());
        transaction.setStatus(nextStatus);
        transaction.setApprovedById(approverId);
        transaction.setApprovedTime(LocalDateTime.now());
        transaction.setStaffRemark(trimToNull(request.getStaffRemark()));

        if (nextStatus == LoanTransactionStatus.REJECTED) {
            for (LoanDetail detail : transaction.getDetails()) {
                EquipmentItem equipment = detail.getEquipment();
                if (equipment != null && equipment.getStatus() == EquipmentItemStatus.RESERVED) {
                    equipment.setStatus(EquipmentItemStatus.AVAILABLE);
                    equipmentItemRepository.save(equipment);
                }
            }
        }

        LoanTransaction saved = loanTransactionRepository.save(transaction);
        return toResponse(saved, saved.getDetails());
    }

    @Transactional
    public LoanTransactionResponse processCheckout(UUID transactionId) {
        LoanTransaction transaction = loanTransactionRepository.findById(transactionId)
            .orElseThrow(() -> new NoSuchElementException(LOAN_NOT_FOUND_MESSAGE));

        if (transaction.getStatus() != LoanTransactionStatus.APPROVED) {
            throw new IllegalArgumentException("Only approved requests can be checked out");
        }

        LocalDateTime checkoutTime = LocalDateTime.now();
        transaction.setStatus(LoanTransactionStatus.ACTIVE);
        transaction.setCheckoutTime(checkoutTime);

        for (LoanDetail detail : transaction.getDetails()) {
            detail.setItemStatus(LoanItemStatus.BORROWED);
            EquipmentItem equipment = detail.getEquipment();
            if (equipment != null) {
                equipment.setStatus(EquipmentItemStatus.BORROWED);
            }
        }

        LoanTransaction saved = loanTransactionRepository.save(transaction);
        return toResponse(saved, saved.getDetails());
    }

    @Transactional
    public LoanTransactionResponse processReturns(UUID transactionId, ProcessLoanReturnRequest request) {
        LoanTransaction transaction = loanTransactionRepository.findById(transactionId)
                .orElseThrow(() -> new NoSuchElementException(LOAN_NOT_FOUND_MESSAGE));

        if (transaction.getStatus() != LoanTransactionStatus.ACTIVE) {
            throw new IllegalArgumentException("Only active transactions can be returned");
        }

        List<LoanDetail> details = transaction.getDetails();
        if (details == null || details.isEmpty()) {
            throw new IllegalArgumentException("No loan items found for this transaction");
        }

        Map<UUID, ProcessLoanReturnRequest.ReturnedItem> returnedByEquipmentId =
                mapAndValidateReturnedItems(request, details.size());

        LocalDateTime returnedAt = LocalDateTime.now();
        for (LoanDetail detail : details) {
            applyReturnedItem(detail, returnedByEquipmentId, returnedAt);
        }

        transaction.setStatus(LoanTransactionStatus.COMPLETED);
        LoanTransaction saved = loanTransactionRepository.save(transaction);
        return toResponse(saved, saved.getDetails());
    }

    private Map<UUID, ProcessLoanReturnRequest.ReturnedItem> mapAndValidateReturnedItems(
            ProcessLoanReturnRequest request,
            int detailCount
    ) {
        List<ProcessLoanReturnRequest.ReturnedItem> returnedItems = request.getItems();
        if (returnedItems == null || returnedItems.isEmpty()) {
            throw new IllegalArgumentException("items is required");
        }

        if (returnedItems.size() != detailCount) {
            throw new IllegalArgumentException("All items in the transaction must be selected for return processing");
        }

        Map<UUID, ProcessLoanReturnRequest.ReturnedItem> returnedByEquipmentId = new HashMap<>();
        for (ProcessLoanReturnRequest.ReturnedItem item : returnedItems) {
            if (returnedByEquipmentId.put(item.getEquipmentId(), item) != null) {
                throw new IllegalArgumentException("Duplicate equipmentId found in return request");
            }
        }
        return returnedByEquipmentId;
    }

    private void applyReturnedItem(
            LoanDetail detail,
            Map<UUID, ProcessLoanReturnRequest.ReturnedItem> returnedByEquipmentId,
            LocalDateTime returnedAt
    ) {
        EquipmentItem equipment = detail.getEquipment();
        UUID equipmentId = equipment.getEquipmentId();
        ProcessLoanReturnRequest.ReturnedItem returnedItem = returnedByEquipmentId.get(equipmentId);

        if (returnedItem == null) {
            throw new IllegalArgumentException("All items in the transaction must be selected for return processing");
        }

        LoanItemStatus returnedStatus = parseReturnItemStatus(returnedItem.getItemStatus());
        detail.setItemStatus(returnedStatus);
        detail.setActualReturnTime(returnedAt);
        detail.setStaffRemarks(trimToNull(returnedItem.getStaffRemarks()));
        applyEquipmentStatusForReturnedItem(equipment, returnedStatus);
        // Create a penalty record when item is DAMAGED or LOST
        if (returnedStatus == LoanItemStatus.DAMAGED || returnedStatus == LoanItemStatus.LOST) {
            CreatePenaltyRequest req = new CreatePenaltyRequest();
            req.setUserId(detail.getTransaction().getBorrowerId());
            req.setDetailId(detail.getDetailId());
            req.setType(returnedStatus == LoanItemStatus.DAMAGED ? PenaltyType.DAMAGED_GEAR.name() : PenaltyType.LOST_GEAR.name());
            req.setRemarks(trimToNull(returnedItem.getStaffRemarks()));
            try {
                penaltyService.createPenalty(req);
            } catch (Exception ex) {
                // intentionally ignore to avoid blocking return processing
            }
        }
    }

    private void applyEquipmentStatusForReturnedItem(EquipmentItem equipment, LoanItemStatus returnedStatus) {
        switch (returnedStatus) {
            case RETURNED -> equipment.setStatus(EquipmentItemStatus.AVAILABLE);
            case DAMAGED -> equipment.setStatus(EquipmentItemStatus.MAINTENANCE);
            case LOST -> equipment.setStatus(EquipmentItemStatus.LOST);
            default -> throw new IllegalArgumentException("itemStatus must be RETURNED, DAMAGED, or LOST");
        }
    }

    private LoanTransactionResponse toResponse(LoanTransaction transaction, List<LoanDetail> details) {
        LoanTransactionResponse response = new LoanTransactionResponse();
        response.setTransactionId(transaction.getTransactionId());
        response.setBorrowerId(transaction.getBorrowerId());

        User borrower = userRepository.findById(transaction.getBorrowerId()).orElse(null);
        if (borrower != null) {
            response.setBorrowerName(String.format("%s %s", borrower.getFirstName(), borrower.getLastName()));
            response.setBorrowerRole(borrower.getRole().name());
        }

        response.setStatus(transaction.getStatus().name());
        response.setBorrowerNote(transaction.getBorrowerNote());
        response.setStaffRemark(transaction.getStaffRemark());
        response.setRequestedTime(transaction.getRequestedTime());
        response.setApprovedTime(transaction.getApprovedTime());
        response.setCheckoutTime(transaction.getCheckoutTime());
        response.setExpectedReturnTime(transaction.getExpectedReturnTime());
        response.setItems(details.stream().map(this::toDetailResponse).toList());
        return response;
    }

    private LoanTransactionStatus parseDecisionStatus(String rawStatus) {
        if (rawStatus == null || rawStatus.isBlank()) {
            throw new IllegalArgumentException("status is required");
        }

        String normalized = rawStatus.trim().toUpperCase();
        if ("APPROVED".equals(normalized)) {
            return LoanTransactionStatus.APPROVED;
        }
        if ("REJECTED".equals(normalized)) {
            return LoanTransactionStatus.REJECTED;
        }

        throw new IllegalArgumentException("status must be APPROVED or REJECTED");
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private LoanItemStatus parseReturnItemStatus(String value) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("itemStatus is required");
        }

        String normalized = value.trim().toUpperCase();
        return switch (normalized) {
            case "RETURNED" -> LoanItemStatus.RETURNED;
            case "DAMAGED" -> LoanItemStatus.DAMAGED;
            case "LOST" -> LoanItemStatus.LOST;
            default -> throw new IllegalArgumentException("itemStatus must be RETURNED, DAMAGED, or LOST");
        };
    }

    private LoanDetailResponse toDetailResponse(LoanDetail detail) {
        LoanDetailResponse response = new LoanDetailResponse();
        response.setDetailId(detail.getDetailId());
        response.setEquipmentId(detail.getEquipment().getEquipmentId());
        response.setEquipmentName(detail.getEquipment().getModel().getName());
        response.setPropertyTag(detail.getEquipment().getPropertyTag());
        response.setItemStatus(detail.getItemStatus().name());
        response.setActualReturnTime(detail.getActualReturnTime());
        response.setStaffRemarks(detail.getStaffRemarks());
        return response;
    }
}

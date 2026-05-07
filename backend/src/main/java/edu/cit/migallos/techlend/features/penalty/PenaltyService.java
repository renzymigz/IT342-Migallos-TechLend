package edu.cit.migallos.techlend.features.penalty;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.cit.migallos.techlend.features.loan.LoanDetail;
import edu.cit.migallos.techlend.features.loan.LoanDetailRepository;
import edu.cit.migallos.techlend.features.penalty.dto.CreatePenaltyRequest;
import edu.cit.migallos.techlend.features.penalty.dto.PenaltyResponse;
import edu.cit.migallos.techlend.features.penalty.enums.PenaltyStatus;
import edu.cit.migallos.techlend.features.penalty.enums.PenaltyType;
import edu.cit.migallos.techlend.features.user.User;
import edu.cit.migallos.techlend.features.user.UserRepository;
import edu.cit.migallos.techlend.features.user.enums.UserStatus;

@Service
public class PenaltyService {

    private final PenaltyRepository penaltyRepository;
    private final UserRepository userRepository;
    private final LoanDetailRepository loanDetailRepository;

    public PenaltyService(PenaltyRepository penaltyRepository,
                          UserRepository userRepository,
                          LoanDetailRepository loanDetailRepository) {
        this.penaltyRepository = penaltyRepository;
        this.userRepository = userRepository;
        this.loanDetailRepository = loanDetailRepository;
    }

    @Transactional
    public PenaltyResponse createPenalty(CreatePenaltyRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        LoanDetail loanDetail = loanDetailRepository.findById(request.getDetailId())
                .orElseThrow(() -> new NoSuchElementException("Loan detail not found"));

        PenaltyType type = parsePenaltyType(request.getType());

        Penalty penalty = new Penalty();
        penalty.setPenaltyId(UUID.randomUUID());
        penalty.setUser(user);
        penalty.setLoanDetail(loanDetail);
        penalty.setType(type);
        penalty.setStatus(PenaltyStatus.PENDING);
        penalty.setRemarks(trimToNull(request.getRemarks()));
        penalty.setCreatedAt(LocalDateTime.now());

        Penalty saved = penaltyRepository.save(penalty);

        long pendingPenalties = penaltyRepository.countByUser_UserIdAndStatus(user.getUserId(), PenaltyStatus.PENDING);
        if (pendingPenalties >= 3) {
            user.setStatus(UserStatus.SUSPENDED);
            user.setSuspensionReason("Automatically suspended due to 3 or more pending penalties");
            userRepository.save(user);
        }

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<PenaltyResponse> getAllPenalties() {
        return penaltyRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public PenaltyResponse resolvePenalty(UUID penaltyId) {
        Penalty penalty = penaltyRepository.findById(penaltyId)
                .orElseThrow(() -> new NoSuchElementException("Penalty not found"));

        penalty.setStatus(PenaltyStatus.RESOLVED);
        Penalty saved = penaltyRepository.save(penalty);

        // Auto-unsuspend if no more pending penalties
        User user = saved.getUser();
        long remaining = penaltyRepository.countByUser_UserIdAndStatus(user.getUserId(), PenaltyStatus.PENDING);
        if (remaining == 0 && user.getStatus() == UserStatus.SUSPENDED) {
            user.setStatus(UserStatus.ACTIVE);
            user.setSuspensionReason(null);
            userRepository.save(user);
        }

        return toResponse(saved);
    }

    private PenaltyType parsePenaltyType(String value) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("type is required");
        }
        String normalized = value.trim().replace('-', '_').replace(' ', '_').toUpperCase();
        try {
            return PenaltyType.valueOf(normalized);
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Invalid penalty type: " + value);
        }
    }

    private String trimToNull(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private PenaltyResponse toResponse(Penalty penalty) {
        PenaltyResponse response = new PenaltyResponse();
        response.setPenaltyId(penalty.getPenaltyId());
        response.setCreatedAt(penalty.getCreatedAt());
        response.setRemarks(penalty.getRemarks());
        response.setStatus(penalty.getStatus().name());
        response.setPenaltyType(penalty.getType().name());

        User user = penalty.getUser();
        if (user != null) {
            response.setUserId(user.getUserId());
            response.setUserName(user.getFirstName() + " " + user.getLastName());
            response.setUserEmail(user.getEmail());
            response.setSuspensionReason(user.getSuspensionReason());
        }

        LoanDetail loanDetail = penalty.getLoanDetail();
        if (loanDetail != null) {
            response.setDetailId(loanDetail.getDetailId());
            if (loanDetail.getEquipment() != null) {
                response.setEquipmentId(loanDetail.getEquipment().getEquipmentId());
                if (loanDetail.getEquipment().getModel() != null) {
                    response.setEquipmentName(loanDetail.getEquipment().getModel().getName());
                }
            }
        }
        return response;
    }
}

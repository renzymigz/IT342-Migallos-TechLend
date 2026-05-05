package edu.cit.migallos.techlend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.cit.migallos.techlend.dto.CreatePenaltyRequest;
import edu.cit.migallos.techlend.dto.PenaltyResponse;
import edu.cit.migallos.techlend.entity.LoanDetail;
import edu.cit.migallos.techlend.entity.Penalty;
import edu.cit.migallos.techlend.entity.User;
import edu.cit.migallos.techlend.enums.PenaltyStatus;
import edu.cit.migallos.techlend.enums.PenaltyType;
import edu.cit.migallos.techlend.enums.UserStatus;
import edu.cit.migallos.techlend.repository.LoanDetailRepository;
import edu.cit.migallos.techlend.repository.PenaltyRepository;
import edu.cit.migallos.techlend.repository.UserRepository;

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

    @Transactional(readOnly = true)
    public List<PenaltyResponse> getAllPenalties() {
        return penaltyRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<PenaltyResponse> getAllIncidents() {
        // Get all penalties
        List<PenaltyResponse> incidents = new java.util.ArrayList<>(penaltyRepository.findAll().stream().map(this::toResponse).toList());
        
        // Track user IDs that already have penalties
        java.util.Set<UUID> usersWithPenalties = penaltyRepository.findAll().stream()
            .map(p -> p.getUser().getUserId())
            .collect(java.util.stream.Collectors.toSet());
        
        // Add suspended users (those with SUSPENDED status but no penalty)
        List<User> suspendedUsers = userRepository.findAll().stream()
            .filter(u -> u.getStatus() == UserStatus.SUSPENDED && !usersWithPenalties.contains(u.getUserId()))
            .toList();
        
        suspendedUsers.forEach(user -> incidents.add(userToIncidentResponse(user)));
        
        return incidents;
    }

    private PenaltyResponse userToIncidentResponse(User user) {
        PenaltyResponse r = new PenaltyResponse();
        r.setPenaltyId(UUID.randomUUID());
        r.setUserId(user.getUserId());
        r.setUserName(user.getFirstName() + " " + user.getLastName());
        r.setUserEmail(user.getEmail());
        r.setPenaltyType("MANUAL_SUSPENSION");
        r.setStatus("PENDING");
        r.setRemarks(null);
        r.setCreatedAt(LocalDateTime.now());
        r.setSuspensionReason(user.getSuspensionReason());
        return r;
    }

    @Transactional
    public PenaltyResponse createPenalty(CreatePenaltyRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new NoSuchElementException("User not found"));
        LoanDetail detail = loanDetailRepository.findById(request.getDetailId())
                .orElseThrow(() -> new NoSuchElementException("Loan detail not found"));

        Penalty penalty = new Penalty();
        penalty.setPenaltyId(UUID.randomUUID());
        penalty.setUser(user);
        penalty.setLoanDetail(detail);
        penalty.setType(PenaltyType.valueOf(request.getType()));
        penalty.setStatus(PenaltyStatus.PENDING);
        penalty.setRemarks(request.getRemarks());
        penalty.setCreatedAt(LocalDateTime.now());

        Penalty saved = penaltyRepository.save(penalty);
        return toResponse(saved);
    }

    @Transactional
    public PenaltyResponse resolvePenalty(UUID penaltyId) {
        Penalty penalty = penaltyRepository.findById(penaltyId)
                .orElseThrow(() -> new NoSuchElementException("Penalty not found"));
        penalty.setStatus(PenaltyStatus.RESOLVED);
        Penalty saved = penaltyRepository.save(penalty);
        return toResponse(saved);
    }

    private PenaltyResponse toResponse(Penalty p) {
        PenaltyResponse r = new PenaltyResponse();
        r.setPenaltyId(p.getPenaltyId());
        if (p.getUser() != null) {
            r.setUserId(p.getUser().getUserId());
            r.setUserName(p.getUser().getFirstName() + " " + p.getUser().getLastName());
            r.setUserEmail(p.getUser().getEmail());
        }
        if (p.getLoanDetail() != null) {
            r.setDetailId(p.getLoanDetail().getDetailId());
            if (p.getLoanDetail().getEquipment() != null) {
                r.setEquipmentId(p.getLoanDetail().getEquipment().getEquipmentId());
                r.setEquipmentName(p.getLoanDetail().getEquipment().getModel().getName());
            }
        }
        if (p.getUser() != null) {
            r.setSuspensionReason(p.getUser().getSuspensionReason());
        }
        r.setPenaltyType(p.getType() == null ? null : p.getType().name());
        r.setStatus(p.getStatus() == null ? null : p.getStatus().name());
        r.setRemarks(p.getRemarks());
        r.setCreatedAt(p.getCreatedAt());
        return r;
    }
}

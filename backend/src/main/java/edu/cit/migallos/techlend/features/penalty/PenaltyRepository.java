package edu.cit.migallos.techlend.features.penalty;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.cit.migallos.techlend.features.penalty.enums.PenaltyStatus;

public interface PenaltyRepository extends JpaRepository<Penalty, UUID> {
    long countByUser_UserIdAndStatus(UUID userId, PenaltyStatus status);
}

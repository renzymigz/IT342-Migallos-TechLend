package edu.cit.migallos.techlend.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.cit.migallos.techlend.entity.Penalty;

public interface PenaltyRepository extends JpaRepository<Penalty, UUID> {
	long countByUser_UserIdAndStatus(java.util.UUID userId, edu.cit.migallos.techlend.enums.PenaltyStatus status);

}

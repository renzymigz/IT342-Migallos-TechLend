package edu.cit.migallos.techlend.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.cit.migallos.techlend.entity.LoanDetail;

public interface LoanDetailRepository extends JpaRepository<LoanDetail, UUID> {
}

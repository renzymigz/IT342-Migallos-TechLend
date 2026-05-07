package edu.cit.migallos.techlend.features.loan;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface LoanDetailRepository extends JpaRepository<LoanDetail, UUID> {
}

package edu.cit.migallos.techlend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import edu.cit.migallos.techlend.entity.LoanTransaction;
import edu.cit.migallos.techlend.enums.LoanTransactionStatus;

public interface LoanTransactionRepository extends JpaRepository<LoanTransaction, UUID> {

	@EntityGraph(attributePaths = {"details", "details.equipment", "details.equipment.model"})
	List<LoanTransaction> findByBorrowerIdOrderByRequestedTimeDesc(UUID borrowerId);

	@EntityGraph(attributePaths = {"details", "details.equipment", "details.equipment.model"})
	List<LoanTransaction> findByStatusOrderByRequestedTimeAsc(LoanTransactionStatus status);

	@EntityGraph(attributePaths = {"details", "details.equipment", "details.equipment.model"})
	List<LoanTransaction> findByStatusInOrderByRequestedTimeDesc(List<LoanTransactionStatus> statuses);
}

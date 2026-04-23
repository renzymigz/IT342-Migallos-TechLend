package edu.cit.migallos.techlend.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import edu.cit.migallos.techlend.enums.LoanTransactionStatus;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "loan_transactions")
public class LoanTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "transaction_id", updatable = false, nullable = false)
    private UUID transactionId;

    @Column(name = "borrower_id", nullable = false)
    private UUID borrowerId;

    @Column(name = "approved_by_id")
    private UUID approvedById;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private LoanTransactionStatus status;

    @Column(name = "borrower_note")
    private String borrowerNote;

    @Column(name = "staff_remark")
    private String staffRemark;

    @Column(name = "requested_time", nullable = false)
    private LocalDateTime requestedTime;

    @Column(name = "approved_time")
    private LocalDateTime approvedTime;

    @Column(name = "checkout_time")
    private LocalDateTime checkoutTime;

    @Column(name = "expected_return_time")
    private LocalDateTime expectedReturnTime;

    @OneToMany(mappedBy = "transaction", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LoanDetail> details = new ArrayList<>();

    public UUID getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(UUID transactionId) {
        this.transactionId = transactionId;
    }

    public UUID getBorrowerId() {
        return borrowerId;
    }

    public void setBorrowerId(UUID borrowerId) {
        this.borrowerId = borrowerId;
    }

    public UUID getApprovedById() {
        return approvedById;
    }

    public void setApprovedById(UUID approvedById) {
        this.approvedById = approvedById;
    }

    public LoanTransactionStatus getStatus() {
        return status;
    }

    public void setStatus(LoanTransactionStatus status) {
        this.status = status;
    }

    public String getBorrowerNote() {
        return borrowerNote;
    }

    public void setBorrowerNote(String borrowerNote) {
        this.borrowerNote = borrowerNote;
    }

    public String getStaffRemark() {
        return staffRemark;
    }

    public void setStaffRemark(String staffRemark) {
        this.staffRemark = staffRemark;
    }

    public LocalDateTime getRequestedTime() {
        return requestedTime;
    }

    public void setRequestedTime(LocalDateTime requestedTime) {
        this.requestedTime = requestedTime;
    }

    public LocalDateTime getApprovedTime() {
        return approvedTime;
    }

    public void setApprovedTime(LocalDateTime approvedTime) {
        this.approvedTime = approvedTime;
    }

    public LocalDateTime getCheckoutTime() {
        return checkoutTime;
    }

    public void setCheckoutTime(LocalDateTime checkoutTime) {
        this.checkoutTime = checkoutTime;
    }

    public LocalDateTime getExpectedReturnTime() {
        return expectedReturnTime;
    }

    public void setExpectedReturnTime(LocalDateTime expectedReturnTime) {
        this.expectedReturnTime = expectedReturnTime;
    }

    public List<LoanDetail> getDetails() {
        return details;
    }

    public void setDetails(List<LoanDetail> details) {
        this.details = details;
    }
}

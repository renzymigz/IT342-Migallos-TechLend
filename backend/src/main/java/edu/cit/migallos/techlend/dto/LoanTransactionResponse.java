package edu.cit.migallos.techlend.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class LoanTransactionResponse {

    private UUID transactionId;
    private UUID borrowerId;
    private String status;
    private String borrowerNote;
    private String staffRemark;
    private LocalDateTime requestedTime;
    private LocalDateTime expectedReturnTime;
    private List<LoanDetailResponse> items;

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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
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

    public LocalDateTime getExpectedReturnTime() {
        return expectedReturnTime;
    }

    public void setExpectedReturnTime(LocalDateTime expectedReturnTime) {
        this.expectedReturnTime = expectedReturnTime;
    }

    public List<LoanDetailResponse> getItems() {
        return items;
    }

    public void setItems(List<LoanDetailResponse> items) {
        this.items = items;
    }
}

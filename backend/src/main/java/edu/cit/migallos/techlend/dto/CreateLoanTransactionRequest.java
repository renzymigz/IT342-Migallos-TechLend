package edu.cit.migallos.techlend.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CreateLoanTransactionRequest {

    @NotEmpty(message = "At least one equipment item is required")
    private List<UUID> equipmentIds;

    @NotNull(message = "requestDate is required")
    @FutureOrPresent(message = "requestDate must be today or a future date")
    private LocalDate requestDate;

    @NotBlank(message = "borrowerNote is required")
    @Size(max = 500, message = "borrowerNote must not exceed 500 characters")
    private String borrowerNote;

    public List<UUID> getEquipmentIds() {
        return equipmentIds;
    }

    public void setEquipmentIds(List<UUID> equipmentIds) {
        this.equipmentIds = equipmentIds;
    }

    public LocalDate getRequestDate() {
        return requestDate;
    }

    public void setRequestDate(LocalDate requestDate) {
        this.requestDate = requestDate;
    }

    public String getBorrowerNote() {
        return borrowerNote;
    }

    public void setBorrowerNote(String borrowerNote) {
        this.borrowerNote = borrowerNote;
    }
}

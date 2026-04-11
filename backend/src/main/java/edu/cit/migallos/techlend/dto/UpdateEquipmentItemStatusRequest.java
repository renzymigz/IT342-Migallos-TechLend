package edu.cit.migallos.techlend.dto;

import jakarta.validation.constraints.NotBlank;

public class UpdateEquipmentItemStatusRequest {

    @NotBlank(message = "status is required")
    private String status;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
package edu.cit.migallos.techlend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UpdateLoanDecisionRequest {

    @NotBlank(message = "status is required")
    private String status;

    @Size(max = 500, message = "staffRemark must not exceed 500 characters")
    private String staffRemark;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStaffRemark() {
        return staffRemark;
    }

    public void setStaffRemark(String staffRemark) {
        this.staffRemark = staffRemark;
    }
}

package edu.cit.migallos.techlend.dto;

import jakarta.validation.constraints.NotBlank;

public class SuspendUserRequest {

    @NotBlank(message = "Suspension reason is required")
    private String suspensionReason;

    public SuspendUserRequest() {
    }

    public SuspendUserRequest(String suspensionReason) {
        this.suspensionReason = suspensionReason;
    }

    public String getSuspensionReason() {
        return suspensionReason;
    }

    public void setSuspensionReason(String suspensionReason) {
        this.suspensionReason = suspensionReason;
    }
}

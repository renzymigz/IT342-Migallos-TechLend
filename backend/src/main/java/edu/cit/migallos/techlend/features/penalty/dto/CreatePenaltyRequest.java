package edu.cit.migallos.techlend.features.penalty.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;

public class CreatePenaltyRequest {

    @NotNull
    private UUID userId;

    @NotNull
    private UUID detailId;

    @NotNull
    private String type;

    private String remarks;

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public UUID getDetailId() {
        return detailId;
    }

    public void setDetailId(UUID detailId) {
        this.detailId = detailId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}

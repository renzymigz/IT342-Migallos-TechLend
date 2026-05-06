package edu.cit.migallos.techlend.features.loan.dto;

import java.util.List;
import java.util.UUID;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ProcessLoanReturnRequest {

    @NotEmpty(message = "items is required")
    @Valid
    private List<ReturnedItem> items;

    public List<ReturnedItem> getItems() {
        return items;
    }

    public void setItems(List<ReturnedItem> items) {
        this.items = items;
    }

    public static class ReturnedItem {

        @NotNull(message = "equipmentId is required")
        private UUID equipmentId;

        @NotBlank(message = "itemStatus is required")
        private String itemStatus;

        @Size(max = 500, message = "staffRemarks must not exceed 500 characters")
        private String staffRemarks;

        public UUID getEquipmentId() {
            return equipmentId;
        }

        public void setEquipmentId(UUID equipmentId) {
            this.equipmentId = equipmentId;
        }

        public String getItemStatus() {
            return itemStatus;
        }

        public void setItemStatus(String itemStatus) {
            this.itemStatus = itemStatus;
        }

        public String getStaffRemarks() {
            return staffRemarks;
        }

        public void setStaffRemarks(String staffRemarks) {
            this.staffRemarks = staffRemarks;
        }
    }
}

package edu.cit.migallos.techlend.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

public class RegisterEquipmentItemsRequest {

    @Valid
    @NotEmpty(message = "At least one item is required")
    private List<ItemPayload> items;

    public List<ItemPayload> getItems() {
        return items;
    }

    public void setItems(List<ItemPayload> items) {
        this.items = items;
    }

    public static class ItemPayload {

        @NotBlank(message = "property_tag is required")
        private String propertyTag;

        public String getPropertyTag() {
            return propertyTag;
        }

        public void setPropertyTag(String propertyTag) {
            this.propertyTag = propertyTag;
        }
    }
}
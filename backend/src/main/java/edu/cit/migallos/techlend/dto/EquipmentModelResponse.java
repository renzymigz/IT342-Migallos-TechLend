package edu.cit.migallos.techlend.dto;

import java.util.List;
import java.util.UUID;

public class EquipmentModelResponse {

    private UUID modelId;
    private String category;
    private String name;
    private String description;
    private String imageUrl;
    private long availableCount;
    private List<EquipmentItemResponse> physicalItems;

    public UUID getModelId() {
        return modelId;
    }

    public void setModelId(UUID modelId) {
        this.modelId = modelId;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public long getAvailableCount() {
        return availableCount;
    }

    public void setAvailableCount(long availableCount) {
        this.availableCount = availableCount;
    }

    public List<EquipmentItemResponse> getPhysicalItems() {
        return physicalItems;
    }

    public void setPhysicalItems(List<EquipmentItemResponse> physicalItems) {
        this.physicalItems = physicalItems;
    }
}
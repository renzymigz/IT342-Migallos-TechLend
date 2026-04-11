package edu.cit.migallos.techlend.dto;

import java.util.UUID;

public class EquipmentCatalogItemResponse {

    private UUID id;
    private UUID modelId;
    private String image;
    private String propertyTag;
    private String name;
    private String category;
    private String status;
    private String description;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getModelId() {
        return modelId;
    }

    public void setModelId(UUID modelId) {
        this.modelId = modelId;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getPropertyTag() {
        return propertyTag;
    }

    public void setPropertyTag(String propertyTag) {
        this.propertyTag = propertyTag;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
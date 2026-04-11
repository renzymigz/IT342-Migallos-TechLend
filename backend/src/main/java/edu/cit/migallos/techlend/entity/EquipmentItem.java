package edu.cit.migallos.techlend.entity;

import java.util.UUID;

import edu.cit.migallos.techlend.enums.EquipmentItemStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "equipment_items")
public class EquipmentItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "equipment_id", updatable = false, nullable = false)
    private UUID equipmentId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "model_id", nullable = false)
    private EquipmentModel model;

    @Column(name = "property_tag", nullable = false, unique = true)
    private String propertyTag;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private EquipmentItemStatus status;

    @Column(name = "added_by_id")
    private UUID addedById;

    public UUID getEquipmentId() {
        return equipmentId;
    }

    public void setEquipmentId(UUID equipmentId) {
        this.equipmentId = equipmentId;
    }

    public EquipmentModel getModel() {
        return model;
    }

    public void setModel(EquipmentModel model) {
        this.model = model;
    }

    public String getPropertyTag() {
        return propertyTag;
    }

    public void setPropertyTag(String propertyTag) {
        this.propertyTag = propertyTag;
    }

    public EquipmentItemStatus getStatus() {
        return status;
    }

    public void setStatus(EquipmentItemStatus status) {
        this.status = status;
    }

    public UUID getAddedById() {
        return addedById;
    }

    public void setAddedById(UUID addedById) {
        this.addedById = addedById;
    }
}
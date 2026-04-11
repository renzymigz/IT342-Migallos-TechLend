package edu.cit.migallos.techlend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.cit.migallos.techlend.entity.EquipmentItem;
import edu.cit.migallos.techlend.enums.EquipmentItemStatus;

@Repository
public interface EquipmentItemRepository extends JpaRepository<EquipmentItem, UUID> {

    boolean existsByPropertyTag(String propertyTag);

    List<EquipmentItem> findByModel_ModelId(UUID modelId);

    long countByModel_ModelIdAndStatus(UUID modelId, EquipmentItemStatus status);
}
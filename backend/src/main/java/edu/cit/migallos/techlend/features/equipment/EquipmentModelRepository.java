package edu.cit.migallos.techlend.features.equipment;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EquipmentModelRepository extends JpaRepository<EquipmentModel, UUID> {
}

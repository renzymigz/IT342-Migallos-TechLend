package edu.cit.migallos.techlend.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.cit.migallos.techlend.entity.EquipmentModel;

@Repository
public interface EquipmentModelRepository extends JpaRepository<EquipmentModel, UUID> {
}
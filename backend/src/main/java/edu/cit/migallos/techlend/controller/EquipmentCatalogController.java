package edu.cit.migallos.techlend.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.cit.migallos.techlend.dto.ApiResponse;
import edu.cit.migallos.techlend.dto.EquipmentCatalogItemResponse;
import edu.cit.migallos.techlend.dto.EquipmentModelResponse;
import edu.cit.migallos.techlend.service.EquipmentService;

@RestController
@RequestMapping("/api/v1/equipment-models")
public class EquipmentCatalogController {

    private final EquipmentService equipmentService;

    public EquipmentCatalogController(EquipmentService equipmentService) {
        this.equipmentService = equipmentService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<EquipmentModelResponse>>> listCatalogModels() {
        return ResponseEntity.ok(ApiResponse.success(equipmentService.getCatalogModels()));
    }

    @GetMapping("/catalog-items")
    public ResponseEntity<ApiResponse<List<EquipmentCatalogItemResponse>>> listCatalogItems() {
        return ResponseEntity.ok(ApiResponse.success(equipmentService.getCatalogItemsForStudents()));
    }

    @GetMapping("/{modelId}")
    public ResponseEntity<ApiResponse<EquipmentModelResponse>> getCatalogModel(@PathVariable UUID modelId) {
        return ResponseEntity.ok(ApiResponse.success(equipmentService.getCatalogModelById(modelId)));
    }
}
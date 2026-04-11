package edu.cit.migallos.techlend.controller;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import edu.cit.migallos.techlend.dto.ApiResponse;
import edu.cit.migallos.techlend.dto.CreateEquipmentModelRequest;
import edu.cit.migallos.techlend.dto.EquipmentItemResponse;
import edu.cit.migallos.techlend.dto.EquipmentModelResponse;
import edu.cit.migallos.techlend.dto.RegisterEquipmentItemsRequest;
import edu.cit.migallos.techlend.dto.UpdateEquipmentItemStatusRequest;
import edu.cit.migallos.techlend.service.EquipmentService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/admin/equipment-models")
public class AdminEquipmentController {

    private final EquipmentService equipmentService;

    public AdminEquipmentController(EquipmentService equipmentService) {
        this.equipmentService = equipmentService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<EquipmentModelResponse>>> listAdminModels() {
        return ResponseEntity.ok(ApiResponse.success(equipmentService.getAdminModels()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<EquipmentModelResponse>> createModel(
            @Valid @RequestBody CreateEquipmentModelRequest request,
            Authentication authentication
    ) {
        UUID userId = (UUID) authentication.getPrincipal();
        EquipmentModelResponse response = equipmentService.createModel(request, userId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/{modelId}/items")
    public ResponseEntity<ApiResponse<List<EquipmentItemResponse>>> registerItems(
            @PathVariable UUID modelId,
            @Valid @RequestBody RegisterEquipmentItemsRequest request,
            Authentication authentication
    ) {
        UUID userId = (UUID) authentication.getPrincipal();
        List<EquipmentItemResponse> response = equipmentService.registerItems(modelId, request, userId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PatchMapping("/items/{equipmentId}/status")
    public ResponseEntity<ApiResponse<EquipmentItemResponse>> updateItemStatus(
            @PathVariable UUID equipmentId,
            @Valid @RequestBody UpdateEquipmentItemStatusRequest request
    ) {
        EquipmentItemResponse response = equipmentService.updateItemStatus(equipmentId, request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/{modelId}/upload-image")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadImage(
            @PathVariable UUID modelId,
            @RequestPart("file") MultipartFile file
    ) {
        String imageUrl = equipmentService.uploadModelImage(modelId, file);
        return ResponseEntity.ok(ApiResponse.success(Map.of("image_url", imageUrl)));
    }
}
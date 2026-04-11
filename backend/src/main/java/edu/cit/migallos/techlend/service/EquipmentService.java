package edu.cit.migallos.techlend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import edu.cit.migallos.techlend.dto.CreateEquipmentModelRequest;
import edu.cit.migallos.techlend.dto.EquipmentCatalogItemResponse;
import edu.cit.migallos.techlend.dto.EquipmentItemResponse;
import edu.cit.migallos.techlend.dto.EquipmentModelResponse;
import edu.cit.migallos.techlend.dto.RegisterEquipmentItemsRequest;
import edu.cit.migallos.techlend.dto.UpdateEquipmentItemStatusRequest;
import edu.cit.migallos.techlend.entity.EquipmentItem;
import edu.cit.migallos.techlend.entity.EquipmentModel;
import edu.cit.migallos.techlend.enums.EquipmentCategory;
import edu.cit.migallos.techlend.enums.EquipmentItemStatus;
import edu.cit.migallos.techlend.repository.EquipmentItemRepository;
import edu.cit.migallos.techlend.repository.EquipmentModelRepository;

@Service
public class EquipmentService {

    private static final String EQUIPMENT_MODEL_NOT_FOUND = "Equipment model not found";
    private static final String IMAGE_UPLOAD_FAILED = "Failed to upload image";

    private final EquipmentModelRepository equipmentModelRepository;
    private final EquipmentItemRepository equipmentItemRepository;
    private final Cloudinary cloudinary;

    public EquipmentService(EquipmentModelRepository equipmentModelRepository,
                            EquipmentItemRepository equipmentItemRepository,
                            Cloudinary cloudinary) {
        this.equipmentModelRepository = equipmentModelRepository;
        this.equipmentItemRepository = equipmentItemRepository;
        this.cloudinary = cloudinary;
    }

    public List<EquipmentModelResponse> getCatalogModels() {
        List<EquipmentModel> models = equipmentModelRepository.findAll();
        return models.stream()
                .map(this::toCatalogResponse)
                .toList();
    }

    public List<EquipmentCatalogItemResponse> getCatalogItemsForStudents() {
        return equipmentItemRepository.findAllByOrderByPropertyTagAsc().stream()
                .map(this::toCatalogItemResponse)
                .toList();
    }

    public EquipmentModelResponse getCatalogModelById(UUID modelId) {
        EquipmentModel model = equipmentModelRepository.findById(modelId)
                .orElseThrow(() -> new NoSuchElementException(EQUIPMENT_MODEL_NOT_FOUND));
        return toCatalogResponse(model);
    }

    public List<EquipmentModelResponse> getAdminModels() {
        List<EquipmentModel> models = equipmentModelRepository.findAll();
        return models.stream()
                .map(this::toAdminResponse)
                .toList();
    }

    public EquipmentModelResponse createModel(CreateEquipmentModelRequest request, UUID adminUserId) {
        EquipmentModel model = new EquipmentModel();
        model.setCategory(parseCategory(request.getCategory()));
        model.setName(request.getName().trim());
        model.setDescription(trimToNull(request.getDescription()));
        model.setImageUrl(null);
        model.setCreatedById(adminUserId);

        model = equipmentModelRepository.save(model);
        return toAdminResponse(model);
    }

    public List<EquipmentItemResponse> registerItems(UUID modelId,
                                                     RegisterEquipmentItemsRequest request,
                                                     UUID adminUserId) {
        EquipmentModel model = equipmentModelRepository.findById(modelId)
            .orElseThrow(() -> new NoSuchElementException(EQUIPMENT_MODEL_NOT_FOUND));

        List<EquipmentItem> toSave = new ArrayList<>();
        for (RegisterEquipmentItemsRequest.ItemPayload payload : request.getItems()) {
            String propertyTag = normalizePropertyTag(payload.getPropertyTag());
            if (equipmentItemRepository.existsByPropertyTag(propertyTag)) {
                throw new IllegalArgumentException("Property tag already exists: " + propertyTag);
            }

            EquipmentItem item = new EquipmentItem();
            item.setModel(model);
            item.setPropertyTag(propertyTag);
            item.setStatus(EquipmentItemStatus.AVAILABLE);
            item.setAddedById(adminUserId);
            toSave.add(item);
        }

        return equipmentItemRepository.saveAll(toSave).stream()
                .map(this::toItemResponse)
                .toList();
    }

    public EquipmentItemResponse updateItemStatus(UUID equipmentId,
                                                  UpdateEquipmentItemStatusRequest request) {
        EquipmentItem item = equipmentItemRepository.findById(equipmentId)
                .orElseThrow(() -> new NoSuchElementException("Equipment item not found"));

        item.setStatus(parseItemStatus(request.getStatus()));
        item = equipmentItemRepository.save(item);
        return toItemResponse(item);
    }

    public String uploadModelImage(UUID modelId, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Image file is required");
        }

        EquipmentModel model = equipmentModelRepository.findById(modelId)
            .orElseThrow(() -> new NoSuchElementException(EQUIPMENT_MODEL_NOT_FOUND));

        String imageUrl;
        try {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "techlend/equipment-models",
                            "public_id", modelId.toString() + "-" + System.currentTimeMillis(),
                            "resource_type", "image",
                            "overwrite", true
                    )
            );
            imageUrl = (String) uploadResult.get("secure_url");
        } catch (Exception ex) {
            String reason = ex.getMessage() == null ? "Unknown error" : ex.getMessage();
            throw new IllegalArgumentException(IMAGE_UPLOAD_FAILED + ": " + reason);
        }

        if (imageUrl == null || imageUrl.isBlank()) {
            throw new IllegalArgumentException(IMAGE_UPLOAD_FAILED);
        }

        model.setImageUrl(imageUrl);
        equipmentModelRepository.save(model);

        return imageUrl;
    }

    private EquipmentModelResponse toCatalogResponse(EquipmentModel model) {
        EquipmentModelResponse response = new EquipmentModelResponse();
        response.setModelId(model.getModelId());
        response.setCategory(model.getCategory().name());
        response.setName(model.getName());
        response.setDescription(model.getDescription());
        response.setImageUrl(model.getImageUrl());
        response.setAvailableCount(
                equipmentItemRepository.countByModel_ModelIdAndStatus(
                        model.getModelId(),
                        EquipmentItemStatus.AVAILABLE
                )
        );
        response.setPhysicalItems(null);
        return response;
    }

    private EquipmentModelResponse toAdminResponse(EquipmentModel model) {
        EquipmentModelResponse response = toCatalogResponse(model);
        response.setPhysicalItems(
                equipmentItemRepository.findByModel_ModelId(model.getModelId()).stream()
                        .map(this::toItemResponse)
                        .toList()
        );
        return response;
    }

    private EquipmentItemResponse toItemResponse(EquipmentItem item) {
        EquipmentItemResponse response = new EquipmentItemResponse();
        response.setEquipmentId(item.getEquipmentId());
        response.setModelId(item.getModel().getModelId());
        response.setPropertyTag(item.getPropertyTag());
        response.setStatus(item.getStatus().name());
        response.setBorrowerName(null);
        return response;
    }

    private EquipmentCatalogItemResponse toCatalogItemResponse(EquipmentItem item) {
        EquipmentCatalogItemResponse response = new EquipmentCatalogItemResponse();
        response.setId(item.getEquipmentId());
        response.setModelId(item.getModel().getModelId());
        response.setImage(item.getModel().getImageUrl());
        response.setPropertyTag(item.getPropertyTag());
        response.setName(item.getModel().getName());
        response.setCategory(item.getModel().getCategory().name());
        response.setStatus(item.getStatus().name());
        response.setDescription(item.getModel().getDescription());
        return response;
    }

    private EquipmentCategory parseCategory(String rawValue) {
        String normalized = normalizeEnum(rawValue);
        try {
            return EquipmentCategory.valueOf(normalized);
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Invalid category: " + rawValue);
        }
    }

    private EquipmentItemStatus parseItemStatus(String rawValue) {
        String normalized = normalizeEnum(rawValue);
        try {
            return EquipmentItemStatus.valueOf(normalized);
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Invalid equipment status: " + rawValue);
        }
    }

    private String normalizeEnum(String value) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("Enum value is required");
        }

        return value.trim()
                .replace('-', '_')
                .replace(' ', '_')
                .toUpperCase(Locale.ROOT);
    }

    private String normalizePropertyTag(String value) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("property_tag is required");
        }
        return value.trim().toUpperCase(Locale.ROOT);
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
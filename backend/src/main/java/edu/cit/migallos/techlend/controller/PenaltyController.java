package edu.cit.migallos.techlend.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.cit.migallos.techlend.dto.ApiResponse;
import edu.cit.migallos.techlend.dto.CreatePenaltyRequest;
import edu.cit.migallos.techlend.dto.PenaltyResponse;
import edu.cit.migallos.techlend.service.PenaltyService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/incidents")
public class PenaltyController {

    private final PenaltyService penaltyService;

    public PenaltyController(PenaltyService penaltyService) {
        this.penaltyService = penaltyService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PenaltyResponse>>> getAll() {
        List<PenaltyResponse> list = penaltyService.getAllIncidents();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PenaltyResponse>> create(@Valid @RequestBody CreatePenaltyRequest request) {
        PenaltyResponse created = penaltyService.createPenalty(request);
        return ResponseEntity.ok(ApiResponse.success(created));
    }

    @PostMapping("/{id}/resolve")
    public ResponseEntity<ApiResponse<PenaltyResponse>> resolve(@PathVariable UUID id) {
        PenaltyResponse resolved = penaltyService.resolvePenalty(id);
        return ResponseEntity.ok(ApiResponse.success(resolved));
    }
}

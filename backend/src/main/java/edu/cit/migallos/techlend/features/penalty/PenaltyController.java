package edu.cit.migallos.techlend.features.penalty;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.cit.migallos.techlend.features.penalty.dto.CreatePenaltyRequest;
import edu.cit.migallos.techlend.features.penalty.dto.PenaltyResponse;
import edu.cit.migallos.techlend.shared.response.ApiResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/incidents")
public class PenaltyController {

    private final PenaltyService penaltyService;

    public PenaltyController(PenaltyService penaltyService) {
        this.penaltyService = penaltyService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PenaltyResponse>>> getAllPenalties() {
        return ResponseEntity.ok(ApiResponse.success(penaltyService.getAllPenalties()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PenaltyResponse>> createPenalty(
            @Valid @RequestBody CreatePenaltyRequest request) {
        PenaltyResponse response = penaltyService.createPenalty(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(response));
    }

    @PatchMapping("/{penaltyId}/resolve")
    public ResponseEntity<ApiResponse<PenaltyResponse>> resolvePenalty(@PathVariable UUID penaltyId) {
        PenaltyResponse response = penaltyService.resolvePenalty(penaltyId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}

package edu.cit.migallos.techlend.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.cit.migallos.techlend.dto.ApiResponse;
import edu.cit.migallos.techlend.dto.CreateLoanTransactionRequest;
import edu.cit.migallos.techlend.dto.LoanTransactionResponse;
import edu.cit.migallos.techlend.service.LoanService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/loans")
public class LoanController {

    private final LoanService loanService;

    public LoanController(LoanService loanService) {
        this.loanService = loanService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<LoanTransactionResponse>> createLoanRequest(
            @Valid @RequestBody CreateLoanTransactionRequest request,
            Authentication authentication
    ) {
        UUID borrowerId = (UUID) authentication.getPrincipal();
        LoanTransactionResponse response = loanService.createLoanRequest(borrowerId, request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/mine")
    public ResponseEntity<ApiResponse<List<LoanTransactionResponse>>> getMyLoans(Authentication authentication) {
        UUID borrowerId = (UUID) authentication.getPrincipal();
        List<LoanTransactionResponse> response = loanService.getBorrowerLoans(borrowerId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}

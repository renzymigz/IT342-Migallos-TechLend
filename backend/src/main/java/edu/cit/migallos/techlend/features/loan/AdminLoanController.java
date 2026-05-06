package edu.cit.migallos.techlend.features.loan;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.cit.migallos.techlend.features.loan.dto.LoanTransactionResponse;
import edu.cit.migallos.techlend.features.loan.dto.ProcessLoanReturnRequest;
import edu.cit.migallos.techlend.features.loan.dto.UpdateLoanDecisionRequest;
import edu.cit.migallos.techlend.shared.response.ApiResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/admin/loans")
public class AdminLoanController {

    private final LoanService loanService;

    public AdminLoanController(LoanService loanService) {
        this.loanService = loanService;
    }

    @GetMapping("/pending")
    public ResponseEntity<ApiResponse<List<LoanTransactionResponse>>> getPendingLoans() {
        return ResponseEntity.ok(ApiResponse.success(loanService.getPendingLoansForApproval()));
    }

    @GetMapping("/approved")
    public ResponseEntity<ApiResponse<List<LoanTransactionResponse>>> getApprovedLoans() {
        return ResponseEntity.ok(ApiResponse.success(loanService.getApprovedLoansForPickup()));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<LoanTransactionResponse>>> getActiveLoans() {
        return ResponseEntity.ok(ApiResponse.success(loanService.getActiveLoans()));
    }

    @GetMapping("/completed")
    public ResponseEntity<ApiResponse<List<LoanTransactionResponse>>> getCompletedLoans() {
        return ResponseEntity.ok(ApiResponse.success(loanService.getCompletedLoans()));
    }

    @PatchMapping("/{transactionId}/decision")
    public ResponseEntity<ApiResponse<LoanTransactionResponse>> decideLoan(
            @PathVariable UUID transactionId,
            @Valid @RequestBody UpdateLoanDecisionRequest request,
            Authentication authentication
    ) {
        UUID approverId = (UUID) authentication.getPrincipal();
        LoanTransactionResponse response = loanService.decideLoanRequest(transactionId, approverId, request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PatchMapping("/{transactionId}/checkout")
    public ResponseEntity<ApiResponse<LoanTransactionResponse>> processCheckout(@PathVariable UUID transactionId) {
        LoanTransactionResponse response = loanService.processCheckout(transactionId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/{transactionId}/return")
    public ResponseEntity<ApiResponse<LoanTransactionResponse>> processReturns(
            @PathVariable UUID transactionId,
            @Valid @RequestBody ProcessLoanReturnRequest request
    ) {
        LoanTransactionResponse response = loanService.processReturns(transactionId, request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}

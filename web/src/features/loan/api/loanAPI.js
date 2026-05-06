import api from "@/shared/api/axios"

export const loanAPI = {
  createLoanRequest: (payload) => api.post("/loans", payload),
  getMyLoans: () => api.get("/loans/mine"),
  getPendingLoansForApproval: () => api.get("/admin/loans/pending"),
  getApprovedLoansForPickup: () => api.get("/admin/loans/approved"),
  getActiveLoans: () => api.get("/admin/loans/active"),
  getCompletedLoans: () => api.get("/admin/loans/completed"),
  decideLoanRequest: (transactionId, status, staffRemark) =>
    api.patch(`/admin/loans/${transactionId}/decision`, { status, staffRemark }),
  processCheckout: (transactionId) =>
    api.patch(`/admin/loans/${transactionId}/checkout`),
  processReturns: (transactionId, payload) =>
    api.patch(`/admin/loans/${transactionId}/returns`, payload),
}

import api from "./axios"

export const loanAPI = {
  createLoanRequest: (payload) => api.post("/loans", payload),
  getMyLoans: () => api.get("/loans/mine"),
}

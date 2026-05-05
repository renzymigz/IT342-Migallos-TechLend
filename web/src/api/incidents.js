import axios from "./axios"

export const incidentsAPI = {
  // Fetch incidents (replace endpoint if backend available)
  async getAll() {
    const res = await axios.get("/incidents").catch(() => null)
    const payload = res?.data?.data || []
    // map backend PenaltyResponse to frontend incident shape
    return payload.map((p) => ({
      id: p.penaltyId,
      userId: p.userId,
      userName: p.userName,
      email: p.userEmail,
      equipment: p.equipmentName,
      penaltyType: p.penaltyType ? p.penaltyType.toLowerCase() : null,
      remarks: p.remarks,
      reportedAt: p.createdAt,
      resolved: p.status === "RESOLVED",
      suspensionReason: p.suspensionReason || null,
    }))
  },

  async resolveIncident(incidentId) {
    const res = await axios.post(`/incidents/${incidentId}/resolve`).catch(() => null)
    return res?.data?.data || null
  },

  // Unsuspend a user by id (if backend endpoint exists)
  async unsuspendUser(userId) {
    const res = await axios.post(`/users/${userId}/unsuspend`).catch(() => null)
    return res?.data?.data || null
  },
}

import axios from "./axios"

export const incidentsAPI = {
  // Fetch incidents (replace endpoint if backend available)
  async getAll() {
    const res = await axios.get("/api/v1/incidents").catch(() => null)
    return res?.data || []
  },

  async resolveIncident(incidentId) {
    const res = await axios.post(`/api/v1/incidents/${incidentId}/resolve`).catch(() => null)
    return res?.data || null
  },

  // Unsuspend a user by id (if backend endpoint exists)
  async unsuspendUser(userId) {
    const res = await axios.post(`/api/v1/users/${userId}/unsuspend`).catch(() => null)
    return res?.data || null
  },
}

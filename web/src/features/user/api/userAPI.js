import axios from "@/shared/api/axios"

export const userAPI = {
  getAllUsers: async () => {
    try {
      const response = await axios.get("/users")
      return response.data.data
    } catch (error) {
      console.error("Error fetching users:", error)
      throw error
    }
  },

  getUserById: async (userId) => {
    try {
      const response = await axios.get(`/users/${userId}`)
      return response.data.data
    } catch (error) {
      console.error("Error fetching user:", error)
      throw error
    }
  },

  updateUserRole: async (userId, role) => {
    try {
      const response = await axios.put(`/users/${userId}/role`, { role })
      return response.data.data
    } catch (error) {
      console.error("Error updating user role:", error)
      throw error
    }
  },

  suspendUser: async (userId, suspensionReason) => {
    try {
      const response = await axios.post(`/users/${userId}/suspend`, {
        suspensionReason,
      })
      return response.data.data
    } catch (error) {
      console.error("Error suspending user:", error)
      throw error
    }
  },

  unsuspendUser: async (userId) => {
    try {
      const response = await axios.post(`/users/${userId}/unsuspend`)
      return response.data.data
    } catch (error) {
      console.error("Error unsuspending user:", error)
      throw error
    }
  },
}

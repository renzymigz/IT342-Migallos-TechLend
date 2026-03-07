import api from "./axios"

export const authAPI = {
  /**
   * POST /auth/register
   * Body: { firstName, lastName, email, password, schoolId?, contactNumber? }
   * Returns: { success, data: { user, tokens } }
   */
  register: (data) => api.post("/auth/register", data),

  /**
   * POST /auth/login
   * Body: { identifier, password }
   * Returns: { success, data: { user, tokens } }
   */
  login: (data) => api.post("/auth/login", data),

  /**
   * POST /auth/logout
   * Header: Authorization Bearer <token>
   */
  logout: () => api.post("/auth/logout"),

  /**
   * GET /users/me
   * Header: Authorization Bearer <token>
   * Returns: { success, data: UserProfileResponse }
   */
  getMe: () => api.get("/users/me"),
}

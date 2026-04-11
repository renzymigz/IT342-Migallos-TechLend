import axios from "axios"

const api = axios.create({
  baseURL: "/api/v1",
  headers: { "Content-Type": "application/json" },
})

// Attach access token to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// On 401, clear stored auth and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("user")
      // Only redirect if not already on an auth page
      if (
        !globalThis.location.pathname.startsWith("/login") &&
        !globalThis.location.pathname.startsWith("/register") &&
        !globalThis.location.pathname.startsWith("/admin/login")
      ) {
        if (globalThis.location.pathname.startsWith("/admin")) {
          globalThis.location.href = "/admin/login"
        } else {
          globalThis.location.href = "/login"
        }
      }
    }
    return Promise.reject(error)
  },
)

export default api
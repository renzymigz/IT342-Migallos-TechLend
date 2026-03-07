import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import "./App.css"
import { AuthProvider } from "@/context/AuthContext"
import { ProtectedRoute, GuestRoute } from "@/components/route-guards"
import { Navbar } from "@/components/navbar"
import Login from "@/pages/Login"
import Register from "@/pages/Register"
import Dashboard from "@/pages/Dashboard"
import Profile from "@/pages/Profile"

// Pages where Navbar should be hidden (they have their own layout)
const noNavbarPaths = new Set(["/login", "/register"])

function AppRoutes() {
  const location = useLocation()
  const showNavbar = !noNavbarPaths.has(location.pathname)

  return (
    <div className="min-h-screen bg-background">
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App

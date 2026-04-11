import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import "./App.css"
import { AuthProvider } from "@/context/AuthContext"
import { ProtectedRoute, GuestRoute } from "@/components/route-guards"
import { Navbar } from "@/components/navbar"
import Login from "@/pages/student-instructor/Login"
import Register from "@/pages/student-instructor/Register"
import Dashboard from "@/pages/student-instructor/Dashboard"
import Profile from "@/pages/student-instructor/Profile"
import AdminLogin from "@/pages/admin-lab-staff/AdminLogin"
import AdminApprovalQueue from "@/pages/admin-lab-staff/AdminApprovalQueue"
import AdminActiveLoans from "@/pages/admin-lab-staff/AdminActiveLoans"
import AdminInventory from "@/pages/admin-lab-staff/AdminInventory"
import AdminUsers from "@/pages/admin-lab-staff/AdminUsers"
import AdminIncidents from "@/pages/admin-lab-staff/AdminIncidents"

// Pages where Navbar should be hidden (they have their own layout)
const noNavbarPaths = new Set(["/login", "/register"])

function AppRoutes() {
  const location = useLocation()
  const showNavbar =
    !noNavbarPaths.has(location.pathname) && !location.pathname.startsWith("/admin")

  return (
    <div className="min-h-screen bg-background">
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="/admin/login" element={<GuestRoute><AdminLogin /></GuestRoute>} />
        <Route path="/admin/approval-queue" element={<AdminApprovalQueue />} />
        <Route path="/admin/active-loans" element={<AdminActiveLoans />} />
        <Route path="/admin/inventory" element={<AdminInventory />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/incidents" element={<AdminIncidents />} />
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

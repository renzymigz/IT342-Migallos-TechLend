import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import "./App.css"
import { AuthProvider } from "@/shared/context/AuthContext"
import { CartProvider } from "@/shared/context/CartContext"
import {
  AdminProtectedRoute,
  GuestRoute,
  StudentProtectedRoute,
} from "@/shared/components/RouteGuards"
import { Navbar } from "@/shared/components/Navbar"
import { CartSheet } from "@/features/equipment/components/CartSheet"
import Login from "@/features/auth/pages/Login"
import Register from "@/features/auth/pages/Register"
import Dashboard from "@/features/equipment/pages/Dashboard"
import MyLoans from "@/features/loan/pages/MyLoans"
import EquipmentDetail from "@/features/equipment/pages/EquipmentDetail"
import Profile from "@/features/user/pages/Profile"
import AdminLogin from "@/features/admin/pages/AdminLogin"
import AdminApprovalQueue from "@/features/loan/pages/AdminApprovalQueue"
import AdminActiveLoans from "@/features/loan/pages/AdminActiveLoans"
import AdminInventory from "@/features/equipment/pages/AdminInventory"
import AdminUsers from "@/features/user/pages/AdminUsers"
import AdminIncidents from "@/features/penalty/pages/AdminIncidents"

// Pages where Navbar should be hidden (they have their own layout)
const noNavbarPaths = new Set(["/login", "/register"])

function AppRoutes() {
  const location = useLocation()
  const showNavbar =
    !noNavbarPaths.has(location.pathname) && !location.pathname.startsWith("/admin")

  return (
    <div className="min-h-screen bg-background">
      {showNavbar && <Navbar />}
      {showNavbar && <CartSheet />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="/admin/login" element={<GuestRoute><AdminLogin /></GuestRoute>} />
        <Route path="/admin/approval-queue" element={<AdminProtectedRoute><AdminApprovalQueue /></AdminProtectedRoute>} />
        <Route path="/admin/active-loans" element={<AdminProtectedRoute><AdminActiveLoans /></AdminProtectedRoute>} />
        <Route path="/admin/inventory" element={<AdminProtectedRoute><AdminInventory /></AdminProtectedRoute>} />
        <Route path="/admin/users" element={<AdminProtectedRoute><AdminUsers /></AdminProtectedRoute>} />
        <Route path="/admin/incidents" element={<AdminProtectedRoute><AdminIncidents /></AdminProtectedRoute>} />
        <Route path="/dashboard" element={<StudentProtectedRoute><Dashboard /></StudentProtectedRoute>} />
        <Route path="/my-loans" element={<StudentProtectedRoute><MyLoans /></StudentProtectedRoute>} />
        <Route path="/catalog/item/:equipmentId" element={<StudentProtectedRoute><EquipmentDetail /></StudentProtectedRoute>} />
        <Route path="/profile" element={<StudentProtectedRoute><Profile /></StudentProtectedRoute>} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </AuthProvider>
  )
}

export default App

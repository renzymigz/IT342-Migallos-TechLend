import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import "./App.css"
import { Navbar } from "@/components/navbar"
import Login from "@/pages/Login"
import Register from "@/pages/Register"
import Dashboard from "@/pages/Dashboard"
import Profile from "@/pages/Profile"

// Pages where Navbar should be hidden (they have their own layout)
const noNavbarPaths = new Set(["/login", "/register"])

function App() {
  const location = useLocation()
  const showNavbar = !noNavbarPaths.has(location.pathname)

  return (
    <div className="min-h-screen bg-background">
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  )
}

export default App

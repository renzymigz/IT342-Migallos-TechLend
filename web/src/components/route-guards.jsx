/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Loader2 } from "lucide-react"

function FullScreenLoader() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  )
}

/**
 * Wraps routes that require authentication.
 * Redirects to /login if user is not logged in.
 */
export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <FullScreenLoader />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

/**
 * Wraps routes for student/instructor area.
 * Redirects admins to /admin/approval-queue.
 */
export function StudentProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <FullScreenLoader />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role === "ADMIN") {
    return <Navigate to="/admin/approval-queue" replace />
  }

  return children
}

/**
 * Wraps routes for admin area only.
 * Redirects non-admin users to /dashboard.
 */
export function AdminProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <FullScreenLoader />
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  if (user.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

/**
 * Wraps routes that should only be accessible when NOT authenticated.
 * Redirects to /dashboard if user is already logged in.
 */
export function GuestRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <FullScreenLoader />
  }

  if (user) {
    if (user.role === "ADMIN") {
      return <Navigate to="/admin/approval-queue" replace />
    }
    return <Navigate to="/dashboard" replace />
  }

  return children
}

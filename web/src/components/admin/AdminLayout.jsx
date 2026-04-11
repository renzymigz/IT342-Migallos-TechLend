import { useState } from "react"
import AdminSidebar from "@/components/admin/AdminSidebar"

export default function AdminLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed((prev) => !prev)}
      />
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}

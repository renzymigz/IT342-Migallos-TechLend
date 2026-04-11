import { useMemo, useState } from "react"
import { useLocation } from "react-router-dom"
import { Menu, X } from "lucide-react"
import AdminSidebar, { navItems } from "@/components/admin/AdminSidebar"

// eslint-disable-next-line react/prop-types
export default function AdminLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const activeTitle = useMemo(() => {
    return navItems.find((item) => location.pathname.startsWith(item.to))?.label || "Admin"
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:block">
        <AdminSidebar
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed((prev) => !prev)}
        />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          />
          <div className="relative z-50 h-full w-72">
            <AdminSidebar
              isCollapsed={false}
              onToggle={() => {}}
              showToggle={false}
              className="h-full"
              onNavigate={() => setSidebarOpen(false)}
            />
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="absolute right-3 top-3 rounded-md p-2 text-white/80 hover:bg-white/10 hover:text-white"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card px-4 lg:px-6">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="text-foreground lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">{activeTitle}</h1>
        </header>
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}

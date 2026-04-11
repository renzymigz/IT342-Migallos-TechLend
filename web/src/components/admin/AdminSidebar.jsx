/* eslint-disable react/prop-types */
import { NavLink } from "react-router-dom"
import {
  ClipboardCheck,
  Timer,
  Boxes,
  Users,
  AlertTriangle,
  Shield,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

export const navItems = [
  { label: "Approval Queue", icon: ClipboardCheck, to: "/admin/approval-queue" },
  { label: "Active Loans", icon: Timer, to: "/admin/active-loans" },
  { label: "Inventory", icon: Boxes, to: "/admin/inventory" },
  { label: "Users", icon: Users, to: "/admin/users" },
  { label: "Incidents", icon: AlertTriangle, to: "/admin/incidents" },
]

export default function AdminSidebar({
  isCollapsed,
  onToggle,
  showToggle = true,
  className = "",
  onNavigate,
}) {
  return (
    <aside
      className={[
        "relative shrink-0 bg-[#091b31] text-white transition-all duration-300",
        isCollapsed ? "w-20" : "w-72",
        className,
      ].join(" ")}
    >
      {showToggle && (
        <button
          type="button"
          onClick={onToggle}
          className={[
            "z-100 absolute -right-3 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-[#091b31] text-white shadow-md ring-1 ring-white/10",
            "hover:bg-[#0c2646]",
          ].join(" ")}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      )}

      <div className="px-4 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
            <Shield className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <div className="text-lg font-semibold leading-none">TechLend</div>
              <div className="text-xs text-white/70 mt-1">Admin Panel</div>
            </div>
          )}
        </div>
      </div>

      <div className="flex h-[calc(100vh)] flex-col justify-between">
        <nav className="px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={onNavigate}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive ? "bg-white/10" : "hover:bg-white/5",
                    isCollapsed ? "justify-center" : "",
                  ].join(" ")
                }
              >
                <Icon className="h-4 w-4 text-white/80" />
                {!isCollapsed && <span>{item.label}</span>}
              </NavLink>
            )
          })}
        </nav>

        <div className="px-3 pb-4">
          <button
            type="button"
            className={[
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/5",
              isCollapsed ? "justify-center" : "",
            ].join(" ")}
          >
            <LogOut className="h-4 w-4" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </div>
    </aside>
  )
}

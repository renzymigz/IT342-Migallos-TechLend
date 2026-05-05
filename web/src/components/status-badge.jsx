/* eslint-disable react/prop-types */
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const statusConfig = {
  available: { className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400", label: "Available" },
  reserved: { className: "bg-amber-500/15 text-amber-700 dark:text-amber-400", label: "Reserved" },
  borrowed: { className: "bg-primary/15 text-primary", label: "Borrowed" },
  maintenance: { className: "bg-muted text-muted-foreground", label: "Maintenance" },
  lost: { className: "bg-destructive/15 text-destructive", label: "Lost" },
  pending: { className: "bg-amber-500/15 text-amber-700 dark:text-amber-400", label: "Pending" },
  open: { className: "bg-destructive/15 text-destructive", label: "Open" },
  requested: { className: "bg-amber-500/15 text-amber-700 dark:text-amber-400", label: "Requested" },
  approved: { className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400", label: "Approved" },
  active: { className: "bg-emerald-600 text-white", label: "Active" },
  suspended: { className: "bg-destructive text-white", label: "Suspended" },
  completed: { className: "bg-muted text-muted-foreground", label: "Completed" },
  rejected: { className: "bg-destructive/15 text-destructive", label: "Rejected" },
  returned: { className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400", label: "Returned" },
  damaged: { className: "bg-amber-500/15 text-amber-700 dark:text-amber-400", label: "Damaged" },
  student: { className: "bg-primary/15 text-primary", label: "Student" },
  instructor: { className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400", label: "Instructor" },
  lab_staff: { className: "bg-muted text-muted-foreground", label: "Lab Staff" },
  admin: { className: "bg-muted text-muted-foreground", label: "Admin" },
  damaged_gear: { className: "bg-amber-500/15 text-amber-700 dark:text-amber-400", label: "Damaged Gear" },
  lost_gear: { className: "bg-destructive/15 text-destructive", label: "Lost Gear" },
  resolved: { className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400", label: "Resolved" },
  overdue_return: { className: "bg-orange-500/15 text-orange-700 dark:text-orange-400", label: "Overdue Return" },
  manual_suspension: { className: "bg-destructive text-white", label: "Manual Suspension" },
}

export function StatusBadge({ status, className }) {
  const config = statusConfig[status] || { className: "bg-muted text-muted-foreground", label: status }
  return (
    <Badge className={cn("border-0 font-medium", config.className, className)}>
      {config.label}
    </Badge>
  )
}

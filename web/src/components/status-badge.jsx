import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const statusConfig = {
  available: { className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400", label: "Available" },
  reserved: { className: "bg-amber-500/15 text-amber-700 dark:text-amber-400", label: "Reserved" },
  borrowed: { className: "bg-primary/15 text-primary", label: "Borrowed" },
  maintenance: { className: "bg-muted text-muted-foreground", label: "Maintenance" },
  lost: { className: "bg-destructive/15 text-destructive", label: "Lost" },
  pending: { className: "bg-amber-500/15 text-amber-700 dark:text-amber-400", label: "Pending" },
  approved: { className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400", label: "Approved" },
  active: { className: "bg-primary/15 text-primary", label: "Active" },
  completed: { className: "bg-muted text-muted-foreground", label: "Completed" },
  rejected: { className: "bg-destructive/15 text-destructive", label: "Rejected" },
}

export function StatusBadge({ status, className }) {
  const config = statusConfig[status] || { className: "bg-muted text-muted-foreground", label: status }
  return (
    <Badge className={cn("border-0 font-medium", config.className, className)}>
      {config.label}
    </Badge>
  )
}

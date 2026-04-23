import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { StatusBadge } from "@/components/status-badge"
import { Separator } from "@/components/ui/separator"
import {
  ChevronDown,
  ChevronUp,
  FileText,
  MessageSquare,
  Package,
  CalendarClock,
  CircleDot,
} from "lucide-react"

export function BorrowerHistory({ transactions }) {
  const [expandedId, setExpandedId] = useState(null)

  if (!transactions || transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <FileText className="mb-3 h-10 w-10 text-muted-foreground/40" />
        <p className="text-sm font-medium text-foreground">No loan history yet</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Your borrowing transactions will appear here
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {transactions.map((txn) => {
        const isExpanded = expandedId === txn.id
        const returnedCount = txn.items.filter((item) => item.returned).length
        const totalCount = txn.items.length

        return (
          <Card key={txn.id} className="overflow-hidden border-border">
            <button
              type="button"
              onClick={() => setExpandedId(isExpanded ? null : txn.id)}
              className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-accent/50"
              aria-expanded={isExpanded}
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                <span className="font-mono text-sm font-semibold text-foreground">{txn.id}</span>
                <span className="text-xs text-muted-foreground">{txn.date}</span>
                <span className="text-xs text-muted-foreground">
                  {totalCount} item{totalCount !== 1 ? "s" : ""}
                  {txn.status === "active" || txn.status === "completed"
                    ? ` · ${returnedCount}/${totalCount} returned`
                    : ""}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={txn.status} />
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </button>

            {isExpanded && (
              <CardContent className="border-t border-border bg-secondary/30 px-0 pb-0 pt-0">
                <div className="px-4 pb-3 pt-4">
                  <div className="mb-2.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    <Package className="h-3.5 w-3.5" />
                    Loan Items
                  </div>

                  <div className="hidden rounded-t-md border border-b-0 border-border bg-muted/60 px-3 py-2 sm:grid sm:grid-cols-[1fr_auto_auto_auto] sm:items-center sm:gap-3">
                    <span className="text-xs font-medium text-muted-foreground">Equipment</span>
                    <span className="w-20 text-center text-xs font-medium text-muted-foreground">Status</span>
                    <span className="w-28 text-center text-xs font-medium text-muted-foreground">Returned On</span>
                    <span className="w-20 text-center text-xs font-medium text-muted-foreground">Condition</span>
                  </div>

                  <div className="flex flex-col">
                    {txn.items.map((item, idx) => (
                      <div
                        key={item.equipmentId}
                        className={`flex flex-col gap-2 border border-border bg-card px-3 py-2.5 sm:grid sm:grid-cols-[1fr_auto_auto_auto] sm:items-center sm:gap-3 ${
                          idx < txn.items.length - 1 ? "border-b-0" : ""
                        } ${idx === 0 ? "rounded-t-md sm:rounded-t-none" : ""} ${
                          idx === txn.items.length - 1 ? "rounded-b-md" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <CircleDot
                            className={`h-3 w-3 shrink-0 ${
                              item.returned
                                ? item.condition === "damaged"
                                  ? "text-amber-600"
                                  : item.condition === "lost"
                                    ? "text-destructive"
                                    : "text-emerald-600"
                                : "text-primary"
                            }`}
                          />
                          <div>
                            <span className="text-sm font-medium text-foreground">{item.equipmentName}</span>
                            <span className="ml-2 font-mono text-xs text-muted-foreground">{item.propertyTag}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 pl-5 sm:contents">
                          <div className="sm:flex sm:w-20 sm:justify-center">
                            <StatusBadge status={item.itemStatus} />
                          </div>

                          <div className="sm:flex sm:w-28 sm:justify-center">
                            {item.actualReturnTime ? (
                              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                <CalendarClock className="h-3 w-3" />
                                {item.actualReturnTime}
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground/50">--</span>
                            )}
                          </div>

                          <div className="sm:flex sm:w-20 sm:justify-center">
                            {item.condition ? (
                              <StatusBadge status={item.condition} />
                            ) : (
                              <span className="text-xs text-muted-foreground/50">--</span>
                            )}
                          </div>
                        </div>

                        {item.itemRemarks && (
                          <div className="col-span-full mt-1 rounded bg-muted/50 px-2.5 py-1.5 pl-5 sm:pl-5">
                            <p className="text-xs italic leading-relaxed text-muted-foreground">
                              {item.itemRemarks}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="px-4 pb-3 pt-3">
                  <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    <MessageSquare className="h-3.5 w-3.5" />
                    Your Note
                  </div>
                  <p className="rounded-md border border-border bg-card px-3 py-2 text-sm leading-relaxed text-foreground">
                    {txn.borrowerNote || "No note provided."}
                  </p>
                </div>

                {txn.staffRemarks && (
                  <div className="px-4 pb-4">
                    <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-primary">
                      <MessageSquare className="h-3.5 w-3.5" />
                      Staff Remarks
                    </div>
                    <p className="rounded-md border border-primary/20 bg-primary/5 px-3 py-2 text-sm leading-relaxed text-foreground">
                      {txn.staffRemarks}
                    </p>
                  </div>
                )}

                {!txn.staffRemarks && <div className="pb-1" />}
              </CardContent>
            )}
          </Card>
        )
      })}
    </div>
  )
}

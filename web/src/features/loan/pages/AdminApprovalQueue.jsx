import { useEffect, useMemo, useState } from "react"
import AdminLayout from "@/features/admin/components/AdminLayout"
import { loanAPI } from "@/features/loan/api/loanAPI"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Separator } from "@/shared/components/ui/separator"
import { StatusBadge } from "@/shared/components/StatusBadge"
import { CheckCircle2, XCircle, Calendar, User, Loader2 } from "lucide-react"

function formatDate(value) {
  if (!value) return "--"
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return "--"
  return parsed.toLocaleDateString("en-CA")
}

export default function AdminApprovalQueue() {
  const [pendingTransactions, setPendingTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [blockedEquipmentIds, setBlockedEquipmentIds] = useState(new Set())

  const [selectedTxn, setSelectedTxn] = useState(null)
  const [staffRemark, setStaffRemark] = useState("")
  const [deciding, setDeciding] = useState(false)

  const loadPendingLoans = async () => {
    setLoading(true)
    try {
      const [pendingRes, approvedRes, activeRes] = await Promise.all([
        loanAPI.getPendingLoansForApproval(),
        loanAPI.getApprovedLoansForPickup(),
        loanAPI.getActiveLoans(),
      ])

      const pending = pendingRes.data.data || []
      setPendingTransactions(pending)

      const approved = approvedRes.data.data || []
      const active = activeRes.data.data || []

      // Build set of equipment IDs that are either awaiting pickup (approved) or currently borrowed
      const blocked = new Set()
      ;[...approved, ...active].forEach((txn) => {
        ;(txn.items || []).forEach((it) => {
          if (it.equipmentId) blocked.add(it.equipmentId)
        })
      })
      setBlockedEquipmentIds(blocked)
      setError("")
    } catch (err) {
      setError(err.response?.data?.error?.message || "Failed to load pending requests.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPendingLoans()
  }, [])

  const pendingOnly = useMemo(
    () =>
      pendingTransactions.filter(
        (transaction) => (transaction.status || "").toUpperCase() === "PENDING"
      ),
    [pendingTransactions]
  )

  const openReview = (transaction) => {
    setSelectedTxn(transaction)
    setStaffRemark(transaction.staffRemark || "")
  }

  const closeReview = () => {
    if (deciding) return
    setSelectedTxn(null)
    setStaffRemark("")
  }

  const selectedIsBlocked = selectedTxn && (selectedTxn.items || []).some((it) => blockedEquipmentIds.has(it.equipmentId))

  const handleDecision = async (status) => {
    if (!selectedTxn) return

    setDeciding(true)
    try {
      await loanAPI.decideLoanRequest(selectedTxn.transactionId, status, staffRemark)
      closeReview()
      await loadPendingLoans()
    } catch (err) {
      setError(err.response?.data?.error?.message || "Failed to update request status.")
    } finally {
      setDeciding(false)
    }
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-4">
        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading pending requests...
          </div>
        )}

        {!loading && pendingOnly.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <CheckCircle2 className="mb-3 h-10 w-10 text-emerald-600/40" />
            <p className="text-sm font-medium text-foreground">All caught up!</p>
            <p className="mt-1 text-xs text-muted-foreground">No pending requests to review.</p>
          </div>
        )}

        {!loading &&
          pendingOnly.map((transaction) => {
            const isInstructor = (transaction.borrowerRole || "").toUpperCase() === "INSTRUCTOR"

            return (
              <Card
                key={transaction.transactionId}
                className={`cursor-pointer border-border transition-all hover:shadow-md ${
                  isInstructor ? "border-l-4 border-l-primary" : ""
                }`}
                onClick={() => openReview(transaction)}
              >
                  <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        {transaction.borrowerName || "Unknown borrower"}
                      </span>
                      {transaction.borrowerRole && (
                        <StatusBadge status={transaction.borrowerRole.toLowerCase()} />
                      )}
                      {isInstructor && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                          Priority
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(transaction.requestedTime)}
                      </span>
                      <span>
                        {(transaction.items || []).length} item
                        {(transaction.items || []).length === 1 ? "" : "s"}
                      </span>
                    </div>

                    {/* show if this pending txn contains any blocked equipment */}
                    {((transaction.items || []).some((it) => blockedEquipmentIds.has(it.equipmentId))) && (
                      <p className="text-xs text-destructive">Contains item already awaiting pickup or borrowed — approval disabled</p>
                    )}

                    <p className="line-clamp-1 text-xs italic text-muted-foreground">
                      &quot;{transaction.borrowerNote || "No borrower note."}&quot;
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusBadge status="pending" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
      </div>

      {selectedTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-lg border border-border bg-card shadow-lg">
            <div className="flex items-start justify-between border-b border-border px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Review Request</h2>
                <p className="font-mono text-xs text-muted-foreground">{selectedTxn.transactionId}</p>
              </div>
              <Button type="button" variant="ghost" onClick={closeReview} disabled={deciding}>
                Close
              </Button>
            </div>

                <div className="space-y-4 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">
                      {selectedTxn.borrowerName || "Unknown borrower"}
                    </span>
                    {selectedTxn.borrowerRole && (
                      <StatusBadge status={selectedTxn.borrowerRole.toLowerCase()} />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Requested on {formatDate(selectedTxn.requestedTime)}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Requested Items
                </p>
                <div className="mt-2 flex flex-col gap-1.5">
                  {(selectedTxn.items || []).map((item) => (
                    <div
                      key={item.equipmentId}
                      className="flex items-center justify-between rounded-md bg-secondary px-3 py-2"
                    >
                      <span className="text-sm text-foreground">{item.equipmentName}</span>
                      <span className="font-mono text-xs text-muted-foreground">{item.propertyTag}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Borrower Note
                </p>
                <p className="mt-1 rounded-md bg-secondary px-3 py-2 text-sm leading-relaxed text-foreground">
                  {selectedTxn.borrowerNote || "No borrower note."}
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <label htmlFor="staff-remarks" className="text-sm font-medium text-foreground">
                  Staff Remarks
                </label>
                <textarea
                  id="staff-remarks"
                  value={staffRemark}
                  onChange={(e) => setStaffRemark(e.target.value)}
                  placeholder="Add pickup instructions or notes for the borrower..."
                  rows={3}
                  className="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={() => handleDecision("APPROVED")}
                  disabled={deciding || selectedIsBlocked}
                >
                  {deciding ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                  )}
                  Approve Request
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                  onClick={() => handleDecision("REJECTED")}
                  disabled={deciding}
                >
                  {deciding ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <XCircle className="mr-2 h-5 w-5" />
                  )}
                  Reject
                </Button>
              </div>
              {selectedTxn && (selectedTxn.items || []).some((it) => blockedEquipmentIds.has(it.equipmentId)) && (
                <p className="mt-2 text-xs text-destructive">This request contains equipment that is already awaiting pickup or currently borrowed. Approving it is disabled to prevent conflicts.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

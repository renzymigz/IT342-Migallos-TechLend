/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react"
import AdminLayout from "@/components/admin/AdminLayout"
import { loanAPI } from "@/api/loan"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { StatusBadge } from "@/components/status-badge"
import {
  AlertTriangle,
  ArrowRightLeft,
  CalendarClock,
  Clock,
  History,
  Loader2,
  PackageCheck,
  User,
} from "lucide-react"

function formatDateTime(value) {
  if (!value) return "--"
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return "--"
  return parsed.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

function EmptyState({ label }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <PackageCheck className="mb-3 h-10 w-10 text-muted-foreground/40" />
      <p className="text-sm font-medium text-foreground">{label}</p>
    </div>
  )
}

function PickupCard({ transaction, processing, onCheckout }) {
  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-foreground">
                {transaction.borrowerName || "Unknown borrower"}
              </CardTitle>
              <p className="font-mono text-xs text-muted-foreground">{transaction.transactionId}</p>
            </div>
          </div>
          <StatusBadge status="approved" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span>Requested: {formatDateTime(transaction.requestedTime)}</span>
          <span>Due: {formatDateTime(transaction.expectedReturnTime)}</span>
        </div>

        <div className="flex flex-col gap-1.5">
          {(transaction.items || []).map((item) => (
            <div
              key={item.equipmentId}
              className="flex items-center justify-between rounded-md bg-secondary px-3 py-2"
            >
              <span className="text-sm text-foreground">{item.equipmentName}</span>
              <span className="font-mono text-xs text-muted-foreground">{item.propertyTag}</span>
            </div>
          ))}
        </div>

        {transaction.staffRemark && (
          <p className="rounded-md bg-secondary px-3 py-2 text-xs italic text-muted-foreground">
            {transaction.staffRemark}
          </p>
        )}

        <Button className="w-full sm:w-auto sm:self-end" onClick={() => onCheckout(transaction.transactionId)} disabled={processing}>
          {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PackageCheck className="mr-2 h-4 w-4" />}
          Process Checkout
        </Button>
      </CardContent>
    </Card>
  )
}

function ReturnCard({ transaction, processing, onProcessReturns }) {
  const [checkedItems, setCheckedItems] = useState({})
  const [conditions, setConditions] = useState({})
  const [remarks, setRemarks] = useState({})

  const toggleItem = (id) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const checkedCount = Object.values(checkedItems).filter(Boolean).length
  const totalItems = (transaction.items || []).length
  const allSelected = totalItems > 0 && checkedCount === totalItems
  const isOverdue =
    transaction.expectedReturnTime &&
    new Date(transaction.expectedReturnTime) < new Date() &&
    (transaction.status || "").toUpperCase() === "ACTIVE"

  const submitReturns = () => {
    const payload = {
      items: (transaction.items || []).map((item) => ({
        equipmentId: item.equipmentId,
        itemStatus: (conditions[item.equipmentId] || "returned").toUpperCase(),
        staffRemarks: remarks[item.equipmentId] || "",
      })),
    }
    onProcessReturns(transaction.transactionId, payload)
  }

  return (
    <Card className={`border-border ${isOverdue ? "border-l-4 border-l-destructive" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-foreground">
                {transaction.borrowerName || "Unknown borrower"}
              </CardTitle>
              <p className="font-mono text-xs text-muted-foreground">{transaction.transactionId}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarClock className="h-3 w-3" />
              Due: {formatDateTime(transaction.expectedReturnTime)}
            </div>
            {isOverdue && (
              <div className="flex items-center gap-1 rounded-md bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                <AlertTriangle className="h-3 w-3" />
                Overdue
              </div>
            )}
            <StatusBadge status="active" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          {(transaction.items || []).map((item) => {
            const isChecked = !!checkedItems[item.equipmentId]
            return (
              <div
                key={item.equipmentId}
                className={`overflow-hidden rounded-lg border transition-colors ${
                  isChecked ? "border-primary/40 bg-primary/5" : "border-border bg-card"
                }`}
              >
                <div className="flex items-center gap-3 p-3">
                  <input
                    id={`return-${transaction.transactionId}-${item.equipmentId}`}
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleItem(item.equipmentId)}
                    className="h-4 w-4 rounded border-input"
                  />

                  <button
                    type="button"
                    onClick={() => toggleItem(item.equipmentId)}
                    className="flex flex-1 cursor-pointer items-center justify-between text-left"
                    aria-label={`Select ${item.equipmentName} for return processing`}
                  >
                    <div>
                      <span className="text-sm font-medium text-foreground">{item.equipmentName}</span>
                      <span className="ml-2 font-mono text-xs text-muted-foreground">{item.propertyTag}</span>
                    </div>
                  </button>

                  {isChecked && (
                    <select
                      value={conditions[item.equipmentId] || "returned"}
                      onChange={(e) =>
                        setConditions((prev) => ({
                          ...prev,
                          [item.equipmentId]: e.target.value,
                        }))
                      }
                      className="h-8 w-28 rounded-md border border-input bg-background px-2 text-xs"
                    >
                      <option value="returned">Returned</option>
                      <option value="damaged">Damaged</option>
                      <option value="lost">Lost</option>
                    </select>
                  )}
                </div>

                {isChecked && (
                  <div className="border-t border-border/60 bg-muted/30 px-3 py-2.5">
                    <Input
                      placeholder={`Staff remarks for ${item.equipmentName}`}
                      value={remarks[item.equipmentId] || ""}
                      onChange={(e) =>
                        setRemarks((prev) => ({
                          ...prev,
                          [item.equipmentId]: e.target.value,
                        }))
                      }
                      className="h-8 text-xs"
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <Separator />

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-muted-foreground">
            {checkedCount > 0 ? (
              <span>
                <span className="font-medium text-foreground">{checkedCount}</span> of {totalItems} item
                {totalItems === 1 ? "" : "s"} selected
              </span>
            ) : (
              <span>Select all items to process this return transaction</span>
            )}
          </div>

          <Button
            disabled={!allSelected || processing}
            className="w-full sm:w-auto"
            onClick={submitReturns}
          >
            {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRightLeft className="mr-2 h-4 w-4" />}
            Process Selected Returns
          </Button>
        </div>

        {!allSelected && checkedCount > 0 && (
          <p className="text-xs text-amber-700 dark:text-amber-400">
            You must select all items in this transaction before processing returns.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

function HistoryCard({ transaction }) {
  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-sm font-semibold text-foreground">
              {transaction.borrowerName || "Unknown borrower"}
            </CardTitle>
            <p className="font-mono text-xs text-muted-foreground">{transaction.transactionId}</p>
          </div>
          <StatusBadge status="completed" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span>Checkout: {formatDateTime(transaction.checkoutTime)}</span>
          <span>Due: {formatDateTime(transaction.expectedReturnTime)}</span>
        </div>

        {transaction.staffRemark && (
          <p className="rounded-md bg-secondary px-3 py-2 text-xs text-muted-foreground">
            {transaction.staffRemark}
          </p>
        )}

        <div className="flex flex-col gap-1.5">
          {(transaction.items || []).map((item) => (
            <div key={item.equipmentId} className="rounded-md bg-secondary px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-foreground">{item.equipmentName}</span>
                <div className="flex items-center gap-2">
                  <StatusBadge status={(item.itemStatus || "returned").toLowerCase()} />
                  <span className="font-mono text-xs text-muted-foreground">{item.propertyTag}</span>
                </div>
              </div>
              {item.staffRemarks && (
                <p className="mt-1 text-xs italic text-muted-foreground">{item.staffRemarks}</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function AdminActiveLoans() {
  const [awaitingPickup, setAwaitingPickup] = useState([])
  const [currentlyBorrowed, setCurrentlyBorrowed] = useState([])
  const [historyTransactions, setHistoryTransactions] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [processingKey, setProcessingKey] = useState("")

  const loadTransactions = async () => {
    setLoading(true)
    try {
      const [approvedRes, activeRes, completedRes] = await Promise.all([
        loanAPI.getApprovedLoansForPickup(),
        loanAPI.getActiveLoans(),
        loanAPI.getCompletedLoans(),
      ])

      setAwaitingPickup(approvedRes.data.data || [])
      setCurrentlyBorrowed(activeRes.data.data || [])
      setHistoryTransactions(completedRes.data.data || [])
      setError("")
    } catch (err) {
      setError(err.response?.data?.error?.message || "Failed to load active loan transactions.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTransactions()
  }, [])

  const counts = useMemo(
    () => ({
      pickup: awaitingPickup.length,
      borrowed: currentlyBorrowed.length,
      history: historyTransactions.length,
    }),
    [awaitingPickup.length, currentlyBorrowed.length, historyTransactions.length]
  )

  const processCheckout = async (transactionId) => {
    setProcessingKey(`checkout-${transactionId}`)
    try {
      await loanAPI.processCheckout(transactionId)
      await loadTransactions()
    } catch (err) {
      setError(err.response?.data?.error?.message || "Failed to process checkout.")
    } finally {
      setProcessingKey("")
    }
  }

  const processReturns = async (transactionId, payload) => {
    setProcessingKey(`return-${transactionId}`)
    try {
      await loanAPI.processReturns(transactionId, payload)
      await loadTransactions()
    } catch (err) {
      setError(err.response?.data?.error?.message || "Failed to process returns.")
    } finally {
      setProcessingKey("")
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

        {loading ? (
          <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading transactions...
          </div>
        ) : (
          <Tabs defaultValue="pickup">
            <TabsList>
              <TabsTrigger value="pickup">
                <Clock className="mr-1.5 h-3.5 w-3.5" />
                Awaiting Pickup ({counts.pickup})
              </TabsTrigger>
              <TabsTrigger value="borrowed">
                <ArrowRightLeft className="mr-1.5 h-3.5 w-3.5" />
                Currently Borrowed ({counts.borrowed})
              </TabsTrigger>
              <TabsTrigger value="history">
                <History className="mr-1.5 h-3.5 w-3.5" />
                History ({counts.history})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pickup" className="mt-4">
              <div className="flex flex-col gap-4">
                {awaitingPickup.length === 0 ? (
                  <EmptyState label="No items awaiting pickup" />
                ) : (
                  awaitingPickup.map((txn) => (
                    <PickupCard
                      key={txn.transactionId}
                      transaction={txn}
                      processing={processingKey === `checkout-${txn.transactionId}`}
                      onCheckout={processCheckout}
                    />
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="borrowed" className="mt-4">
              <div className="flex flex-col gap-4">
                {currentlyBorrowed.length === 0 ? (
                  <EmptyState label="No active loans" />
                ) : (
                  currentlyBorrowed.map((txn) => (
                    <ReturnCard
                      key={txn.transactionId}
                      transaction={txn}
                      processing={processingKey === `return-${txn.transactionId}`}
                      onProcessReturns={processReturns}
                    />
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-4">
              <div className="flex flex-col gap-4">
                {historyTransactions.length === 0 ? (
                  <EmptyState label="No completed loan transactions yet" />
                ) : (
                  historyTransactions.map((txn) => (
                    <HistoryCard key={txn.transactionId} transaction={txn} />
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </AdminLayout>
  )
}

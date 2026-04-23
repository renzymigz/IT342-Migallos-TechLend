import { useEffect, useMemo, useState } from "react"
import { loanAPI } from "@/api/loan"
import { BorrowerHistory } from "@/components/borrower-history"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

function formatDateOnly(value) {
  if (!value) return "--"
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return "--"
  return parsed.toLocaleDateString("en-CA")
}

function formatDateTime(value) {
  if (!value) return ""
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return ""

  return parsed.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

export default function MyLoans() {
  const [rawTransactions, setRawTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadMyLoans = async () => {
      setLoading(true)
      try {
        const res = await loanAPI.getMyLoans()
        setRawTransactions(res.data.data || [])
        setError("")
      } catch (err) {
        setError(err.response?.data?.error?.message || "Failed to load your loans.")
      } finally {
        setLoading(false)
      }
    }

    loadMyLoans()
  }, [])

  const myTransactions = useMemo(
    () =>
      rawTransactions.map((transaction) => ({
        id: transaction.transactionId,
        status: (transaction.status || "PENDING").toLowerCase(),
        date: formatDateOnly(transaction.requestedTime),
        dueDate: formatDateOnly(transaction.expectedReturnTime),
        borrowerNote: transaction.borrowerNote || "",
        staffRemarks: transaction.staffRemark || "",
        items: (transaction.items || []).map((item) => {
          const itemStatus = (item.itemStatus || "REQUESTED").toLowerCase()
          return {
            equipmentId: item.equipmentId,
            equipmentName: item.equipmentName || "Unnamed equipment",
            propertyTag: item.propertyTag || "--",
            itemStatus,
            actualReturnTime: formatDateTime(item.actualReturnTime),
            itemRemarks: item.itemRemarks || "",
            returned: itemStatus === "returned",
            condition:
              itemStatus === "damaged" || itemStatus === "lost" || itemStatus === "returned"
                ? itemStatus
                : null,
          }
        }),
      })),
    [rawTransactions]
  )

  return (
    <div className="pt-16">
      <main>
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="mb-4">
            <h1 className="text-xl font-semibold text-foreground sm:text-2xl">My Loans</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Review your borrowing history, item statuses, and staff remarks.
            </p>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading your loans...
            </div>
          )}

          {!loading && error && (
            <Card className="border-destructive/40">
              <CardContent className="p-3 text-sm text-destructive">{error}</CardContent>
            </Card>
          )}

          {!loading && !error && <BorrowerHistory transactions={myTransactions} />}
        </div>
      </main>
    </div>
  )
}

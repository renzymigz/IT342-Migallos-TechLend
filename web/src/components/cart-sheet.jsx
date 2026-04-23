import { useEffect, useMemo, useState } from "react"
import { useCart } from "@/context/CartContext"
import { loanAPI } from "@/api/loan"
import { getUpcomingHolidays } from "@/api/googleCalendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { X, ShoppingCart, SendHorizontal, Loader2 } from "lucide-react"

function toMinDate() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
}

export function CartSheet() {
  const googleCalendarApiKey = import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY
  const holidayCalendarId =
    import.meta.env.VITE_GOOGLE_HOLIDAY_CALENDAR_ID || "en.philippines#holiday@group.v.calendar.google.com"

  const { items, cartCount, isCartOpen, removeItem, clearItems, closeCart } = useCart()
  const [requestDate, setRequestDate] = useState("")
  const [borrowerNote, setBorrowerNote] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [submitSuccess, setSubmitSuccess] = useState("")
  const [holidays, setHolidays] = useState([])
  const [loadingHolidays, setLoadingHolidays] = useState(true)
  const [holidayError, setHolidayError] = useState("")
  const [requestDateError, setRequestDateError] = useState("")

  const holidayDateMap = useMemo(() => {
    const map = new Map()

    holidays.forEach((holiday) => {
      const raw = String(holiday.rawDate || "")
      if (!raw) return

      const dateKey = raw.length >= 10 ? raw.slice(0, 10) : raw
      if (!dateKey) return
      map.set(dateKey, holiday.name)
    })

    return map
  }, [holidays])

  const isSubmitDisabled = useMemo(() => {
    return submitting || items.length === 0 || !requestDate || !borrowerNote.trim() || Boolean(requestDateError)
  }, [submitting, items.length, requestDate, borrowerNote, requestDateError])

  useEffect(() => {
    const loadHolidays = async () => {
      setLoadingHolidays(true)
      try {
        const holidayRows = await getUpcomingHolidays({
          apiKey: googleCalendarApiKey,
          calendarId: holidayCalendarId,
          monthsAhead: 12,
          maxResults: 30,
        })
        setHolidays(holidayRows)
        setHolidayError("")
      } catch (err) {
        setHolidayError(err.message || "Unable to load holiday calendar.")
      } finally {
        setLoadingHolidays(false)
      }
    }

    loadHolidays()
  }, [googleCalendarApiKey, holidayCalendarId])

  const handleRequestDateChange = (value) => {
    if (!value) {
      setRequestDate("")
      setRequestDateError("")
      return
    }

    const holidayName = holidayDateMap.get(value)
    if (holidayName) {
      setRequestDate("")
      setRequestDateError(`${holidayName} is a holiday. Please choose a non-holiday date.`)
      return
    }

    setRequestDate(value)
    setRequestDateError("")
  }

  const handleSubmit = async () => {
    if (isSubmitDisabled) return

    setSubmitting(true)
    setSubmitError("")
    setSubmitSuccess("")

    try {
      await loanAPI.createLoanRequest({
        equipmentIds: items.map((item) => item.id),
        requestDate,
        borrowerNote: borrowerNote.trim(),
      })

      clearItems()
      setRequestDate("")
      setBorrowerNote("")
      setSubmitSuccess("Loan request submitted successfully.")
    } catch (err) {
      setSubmitError(err.response?.data?.error?.message || "Failed to submit loan request.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {isCartOpen && (
        <button
          type="button"
          aria-label="Close cart"
          className="fixed inset-0 z-70 bg-background/70 backdrop-blur-[1px]"
          onClick={closeCart}
        />
      )}

      <aside
        className={`fixed right-0 top-0 z-80 flex h-full w-full max-w-md flex-col border-l border-border bg-card shadow-2xl transition-transform duration-300 sm:max-w-lg ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Your cart"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Your Cart</h2>
            <p className="text-xs text-muted-foreground">{cartCount} item{cartCount === 1 ? "" : "s"} selected for borrowing</p>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={closeCart} aria-label="Close cart sheet">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
          <div className="space-y-2">
            {items.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
                No equipment in cart yet.
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="rounded-lg border border-border bg-background p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
                      <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">{item.propertyTag}</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      aria-label={`Remove ${item.name} from cart`}
                      onClick={() => removeItem(item.id)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  {item.category && (
                    <Badge variant="outline" className="mt-2 text-[10px]">
                      {item.category}
                    </Badge>
                  )}
                </div>
              ))
            )}
          </div>

          <Separator />

          <div className="space-y-2">
            <label htmlFor="requestDate" className="text-sm font-semibold text-foreground">
              Request Date *
            </label>
            <p className="text-xs text-muted-foreground">Select when you&apos;d like to use the equipment.</p>
            <Input
              id="requestDate"
              type="date"
              min={toMinDate()}
              value={requestDate}
              onChange={(e) => handleRequestDateChange(e.target.value)}
            />
            {requestDateError && <p className="text-xs text-destructive">{requestDateError}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="borrowerNote" className="text-sm font-semibold text-foreground">
              Borrower Note *
            </label>
            <p className="text-xs text-muted-foreground">Why do you need this/these equipments?</p>
            <textarea
              id="borrowerNote"
              value={borrowerNote}
              onChange={(e) => setBorrowerNote(e.target.value)}
              rows={4}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              placeholder="Enter your reason for borrowing..."
            />
          </div>

          {submitError && <p className="text-xs text-destructive">{submitError}</p>}
          {submitSuccess && <p className="text-xs text-emerald-600">{submitSuccess}</p>}
        </div>

        <div className="border-t border-border px-5 py-4">
          <div className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={clearItems} disabled={items.length === 0 || submitting}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Clear Cart
            </Button>
            <Button type="button" className="flex-1" onClick={handleSubmit} disabled={isSubmitDisabled}>
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <SendHorizontal className="mr-2 h-4 w-4" />}
              Submit Request
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}

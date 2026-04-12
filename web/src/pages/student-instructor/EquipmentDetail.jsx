import { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { equipmentAPI } from "@/api/equipment"
import { getUpcomingHolidays } from "@/api/googleCalendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { StatusBadge } from "@/components/status-badge"
import {
  Loader2,
  ArrowLeft,
  Cpu,
  Wifi,
  Thermometer,
  Monitor,
  Cable,
  ServerCog,
  ShoppingCart,
} from "lucide-react"

const categoryLabels = {
  MICROCONTROLLERS: "Microcontrollers",
  COMPUTERS_AND_LAPTOPS: "Computers and Laptops",
  PERIPHERALS: "Peripherals",
  NETWORKING: "Networking",
  SENSORS_AND_MODULES: "Sensors and Modules",
  CABLES_AND_ADAPTERS: "Cables and Adapters",
  ROBOTICS: "Robotics",
  AR_VR: "AR/VR",
  AUDIO_VISUAL: "Audio Visual",
  TOOLS_AND_TESTING: "Tools and Testing",
  STORAGE_DEVICES: "Storage Devices",
  OTHERS: "Others",
}

export default function EquipmentDetail() {
  const googleCalendarApiKey = import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY
  const holidayCalendarId =
    import.meta.env.VITE_GOOGLE_HOLIDAY_CALENDAR_ID || "en.philippines#holiday@group.v.calendar.google.com"

  const { equipmentId } = useParams()
  const [equipment, setEquipment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [holidays, setHolidays] = useState([])
  const [loadingHolidays, setLoadingHolidays] = useState(true)
  const [holidayError, setHolidayError] = useState("")

  const categoryIcons = useMemo(
    () => ({
      MICROCONTROLLERS: <Cpu className="h-16 w-16" />,
      NETWORKING: <Wifi className="h-16 w-16" />,
      SENSORS_AND_MODULES: <Thermometer className="h-16 w-16" />,
      COMPUTERS_AND_LAPTOPS: <ServerCog className="h-16 w-16" />,
      PERIPHERALS: <Monitor className="h-16 w-16" />,
      CABLES_AND_ADAPTERS: <Cable className="h-16 w-16" />,
    }),
    []
  )

  const statusText = {
    available: "Ready for borrowing",
    borrowed: "Currently on loan",
    reserved: "Reserved for pickup",
    maintenance: "Under maintenance",
    lost: "Reported lost",
  }

  useEffect(() => {
    const loadDetail = async () => {
      setLoading(true)
      try {
        const res = await equipmentAPI.getCatalogItemDetail(equipmentId)
        const payload = res.data.data
        setEquipment({
          ...payload,
          status: (payload.status || "AVAILABLE").toLowerCase(),
        })
        setError("")
      } catch (err) {
        setError(err.response?.data?.error?.message || "Failed to load equipment details.")
      } finally {
        setLoading(false)
      }
    }

    if (equipmentId) {
      loadDetail()
    }
  }, [equipmentId])

  useEffect(() => {
    const loadHolidays = async () => {
      setLoadingHolidays(true)
      try {
        const holidayRows = await getUpcomingHolidays({
          apiKey: googleCalendarApiKey,
          calendarId: holidayCalendarId,
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

  return (
    <div className="mx-auto max-w-6xl px-4 pb-10 pt-20">
      <Button asChild variant="ghost" className="mb-4">
        <Link to="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Catalog
        </Link>
      </Button>

      {loading && (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading equipment details...
        </div>
      )}

      {!loading && error && (
        <Card className="border-destructive/40">
          <CardContent className="p-4 text-sm text-destructive">{error}</CardContent>
        </Card>
      )}

      {!loading && !error && equipment && (
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="min-w-0 flex-1">
            <Card className="overflow-hidden border-border">
              <div className="flex h-64 items-center justify-center bg-secondary sm:h-80">
                {equipment.imageUrl ? (
                  <img
                    src={equipment.imageUrl}
                    alt={equipment.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-muted-foreground/30">
                    {categoryIcons[equipment.category] || <Cpu className="h-16 w-16" />}
                  </div>
                )}
              </div>
            </Card>

            <div className="mt-6">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {equipment.name}
                </h1>
                <StatusBadge status={equipment.status} />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <code className="rounded bg-muted px-2 py-0.5 font-mono text-sm text-muted-foreground">
                  {equipment.propertyTag}
                </code>
                <Badge variant="outline" className="font-normal">
                  {categoryLabels[equipment.category] || equipment.category}
                </Badge>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-base font-semibold text-foreground">Description</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {equipment.description || "No description available for this item."}
              </p>
            </div>

            <Separator className="my-8" />

            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Current Record</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between rounded-md border border-border bg-card p-3">
                  <span className="text-muted-foreground">Equipment ID</span>
                  <span className="font-mono text-xs text-muted-foreground">{equipment.equipmentId}</span>
                </div>
                <div className="flex items-center justify-between rounded-md border border-border bg-card p-3">
                  <span className="text-muted-foreground">Model ID</span>
                  <span className="font-mono text-xs text-muted-foreground">{equipment.modelId}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="w-full lg:w-80 xl:w-96">
            <div className="sticky top-20">
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-foreground">Availability</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 rounded-lg bg-secondary p-3">
                    <StatusBadge status={equipment.status} className="text-sm" />
                    <span className="text-sm text-muted-foreground">
                      {statusText[equipment.status] || "Status unavailable"}
                    </span>
                  </div>

                  <div className="rounded-lg border border-border bg-card p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Upcoming Holidays
                    </p>

                    {loadingHolidays && (
                      <div className="mt-2 flex items-center text-xs text-muted-foreground">
                        <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                        Loading Google Calendar holidays...
                      </div>
                    )}

                    {!loadingHolidays && holidayError && (
                      <p className="mt-2 text-xs text-destructive">{holidayError}</p>
                    )}

                    {!loadingHolidays && !holidayError && holidays.length === 0 && (
                      <p className="mt-2 text-xs text-muted-foreground">No upcoming holidays found.</p>
                    )}

                    {!loadingHolidays && !holidayError && holidays.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {holidays.map((holiday) => (
                          <div
                            key={holiday.id}
                            className="flex items-center justify-between rounded-md border border-border bg-secondary/40 px-2.5 py-2"
                          >
                            <span className="truncate pr-2 text-xs font-medium text-foreground">
                              {holiday.name}
                            </span>
                            <span className="whitespace-nowrap text-[11px] text-muted-foreground">
                              {holiday.date}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Separator />

                  <Button size="lg" className="w-full text-base" disabled={equipment.status !== "available"}>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {equipment.status === "available" ? "Add to Cart" : "Currently Unavailable"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

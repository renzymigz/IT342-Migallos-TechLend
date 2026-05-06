const GOOGLE_CALENDAR_BASE_URL = "https://www.googleapis.com/calendar/v3/calendars"
const DEFAULT_PH_HOLIDAY_CALENDAR_ID = "en.philippines#holiday@group.v.calendar.google.com"

function normalizeCalendarId(rawCalendarId) {
  let cleaned = String(rawCalendarId || "").trim()

  const hasWrappingDoubleQuotes = cleaned.startsWith('"') && cleaned.endsWith('"')
  const hasWrappingSingleQuotes = cleaned.startsWith("'") && cleaned.endsWith("'")
  if (hasWrappingDoubleQuotes || hasWrappingSingleQuotes) {
    cleaned = cleaned.slice(1, -1)
  }

  if (!cleaned) {
    return DEFAULT_PH_HOLIDAY_CALENDAR_ID
  }

  // In dotenv files, unquoted '#' starts a comment, which truncates this value to "en.philippines".
  if (cleaned === "en.philippines") {
    return DEFAULT_PH_HOLIDAY_CALENDAR_ID
  }

  return cleaned
}

function toIsoDateTime(date) {
  return date.toISOString()
}

function formatHolidayDate(rawDate) {
  if (!rawDate) return "Date unavailable"

  const parsed = new Date(rawDate)
  if (Number.isNaN(parsed.getTime())) {
    return "Date unavailable"
  }

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export async function getUpcomingHolidays({
  apiKey,
  calendarId,
  monthsAhead = 6,
  maxResults = 8,
}) {
  if (!apiKey) {
    throw new Error("Google Calendar API key is missing.")
  }

  const startDate = new Date()
  const endDate = new Date()
  endDate.setMonth(endDate.getMonth() + monthsAhead)
  const resolvedCalendarId = normalizeCalendarId(calendarId)

  const params = new URLSearchParams({
    key: apiKey,
    singleEvents: "true",
    orderBy: "startTime",
    timeMin: toIsoDateTime(startDate),
    timeMax: toIsoDateTime(endDate),
    maxResults: String(maxResults),
  })

  const endpoint = `${GOOGLE_CALENDAR_BASE_URL}/${encodeURIComponent(resolvedCalendarId)}/events?${params.toString()}`
  const response = await fetch(endpoint)

  if (!response.ok) {
    throw new Error(`Failed to load holidays (${response.status}).`)
  }

  const payload = await response.json()
  const items = payload.items || []

  return items.map((item) => {
    const dateValue = item.start?.date || item.start?.dateTime || null
    return {
      id: item.id,
      name: item.summary || "Unnamed holiday",
      date: formatHolidayDate(dateValue),
      rawDate: dateValue,
    }
  })
}

"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { DayPicker, type DateRange } from "react-day-picker"
import { format, addMonths, differenceInDays, parseISO } from "date-fns"
import { CalendarDays, ChevronLeft, ChevronRight, Loader2, Info, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RequestInfoDrawer } from "@/components/request-info-drawer"
import type { CalendarDay } from "@/lib/hostaway"

interface VillaAvailabilityCalendarProps {
  externalId: string
  villaTitle: string
  basePricePerDay?: number
}

type LoadState = "idle" | "loading" | "loaded" | "error"

const MONTHS_TO_FETCH = 3

function formatDateISO(d: Date): string {
  return format(d, "yyyy-MM-dd")
}

export function VillaAvailabilityCalendar({
  externalId,
  villaTitle,
  basePricePerDay,
}: VillaAvailabilityCalendarProps) {
  const [range, setRange] = useState<DateRange | undefined>(undefined)
  const [calendarData, setCalendarData] = useState<Map<string, CalendarDay>>(new Map())
  const [loadState, setLoadState] = useState<LoadState>("idle")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const fetchedRangesRef = useRef<Set<string>>(new Set())

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const fetchCalendar = useCallback(
    async (monthStart: Date) => {
      const startStr = formatDateISO(monthStart)
      const end = addMonths(monthStart, MONTHS_TO_FETCH)
      const endStr = formatDateISO(end)
      const key = `${startStr}|${endStr}`

      if (fetchedRangesRef.current.has(key)) return

      setLoadState("loading")
      setErrorMsg(null)

      try {
        const res = await fetch(
          `/api/hostaway/calendar?listingId=${encodeURIComponent(externalId)}&from=${startStr}&to=${endStr}`
        )
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body.error || `HTTP ${res.status}`)
        }
        const data: { days: CalendarDay[] } = await res.json()
        fetchedRangesRef.current.add(key)

        setCalendarData((prev) => {
          const next = new Map(prev)
          for (const day of data.days) {
            next.set(day.date, day)
          }
          return next
        })
        setLoadState("loaded")
      } catch (err) {
        console.error("Calendar fetch error:", err)
        setErrorMsg(err instanceof Error ? err.message : "Failed to load availability")
        setLoadState("error")
      }
    },
    [externalId]
  )

  useEffect(() => {
    const start = new Date(today.getFullYear(), today.getMonth(), 1)
    fetchCalendar(start)
  }, [fetchCalendar])

  const handleMonthChange = useCallback(
    (month: Date) => {
      const start = new Date(month.getFullYear(), month.getMonth(), 1)
      fetchCalendar(start)
    },
    [fetchCalendar]
  )

  const isRangeValid = useCallback(
    (r: DateRange): boolean => {
      if (!r.from || !r.to) return true
      const curr = new Date(r.from)
      while (curr <= r.to) {
        const dateStr = formatDateISO(curr)
        const day = calendarData.get(dateStr)
        if (day && !day.isAvailable) return false
        curr.setDate(curr.getDate() + 1)
      }
      return true
    },
    [calendarData]
  )

  const handleRangeSelect = useCallback(
    (newRange: DateRange | undefined) => {
      if (!newRange) {
        setRange(undefined)
        return
      }
      if (newRange.from && newRange.to && !isRangeValid(newRange)) {
        setRange({ from: newRange.from })
        return
      }
      setRange(newRange)
    },
    [isRangeValid]
  )

  const nights =
    range?.from && range?.to ? differenceInDays(range.to, range.from) : 0

  const computeTotal = (): { total: number; perNight: number } | null => {
    if (!range?.from || !range?.to || nights <= 0) return null

    let total = 0
    let count = 0
    const curr = new Date(range.from)
    while (curr < range.to) {
      const dateStr = formatDateISO(curr)
      const day = calendarData.get(dateStr)
      const price = day?.price ?? basePricePerDay ?? 0
      total += price
      count++
      curr.setDate(curr.getDate() + 1)
    }

    return {
      total,
      perNight: count > 0 ? Math.round(total / count) : basePricePerDay ?? 0,
    }
  }

  const pricing = computeTotal()

  const prefilledMessage =
    range?.from && range?.to && nights > 0
      ? `Check-in: ${format(range.from, "MMMM d, yyyy")}\nCheck-out: ${format(range.to, "MMMM d, yyyy")}\nNights: ${nights}${pricing ? `\nEstimated total: $${pricing.total.toLocaleString()}` : ""}\n\nI'm interested in booking this property.`
      : ""

  const disabledDays = [
    { before: today },
    ...Array.from(calendarData.values())
      .filter((d) => !d.isAvailable)
      .map((d) => parseISO(d.date)),
  ]

  return (
    <div className="bg-charcoal/50 rounded-2xl border border-[#ECAC36]/20 overflow-hidden">
      <div className="px-6 pt-6 pb-2">
        <h3 className="text-xl font-heading font-bold text-white flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-[#ECAC36]" />
          Availability &amp; Pricing
        </h3>
        <p className="text-sm text-gray-400 mt-1">
          Select your dates to check availability and see pricing.
        </p>
      </div>

      {loadState === "error" && (
        <div className="mx-6 mb-4 mt-3 bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-center gap-2 text-sm text-red-400">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{errorMsg || "Failed to load calendar"}</span>
        </div>
      )}

      <div className="relative">
        {loadState === "loading" && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
            <Loader2 className="h-6 w-6 text-[#ECAC36] animate-spin" />
          </div>
        )}

        <DayPicker
          mode="range"
          selected={range}
          onSelect={handleRangeSelect}
          onMonthChange={handleMonthChange}
          startMonth={today}
          endMonth={addMonths(today, 18)}
          disabled={disabledDays}
          numberOfMonths={1}
          className="w-full px-6 py-4"
          classNames={{
            months: "flex flex-col",
            month: "space-y-3",
            month_caption: "flex justify-center relative items-center mb-2 h-8",
            caption_label: "text-sm font-semibold text-white",
            nav: "flex items-center gap-1",
            button_previous:
              "absolute left-0 h-7 w-7 p-0 flex items-center justify-center rounded border border-[#333333] text-gray-400 hover:text-white hover:border-[#ECAC36]/50 transition-colors",
            button_next:
              "absolute right-0 h-7 w-7 p-0 flex items-center justify-center rounded border border-[#333333] text-gray-400 hover:text-white hover:border-[#ECAC36]/50 transition-colors",
            month_grid: "w-full border-collapse",
            weekdays: "flex mb-1",
            weekday: "text-gray-500 w-10 text-center text-xs font-normal pb-1",
            weeks: "space-y-0",
            week: "flex w-full",
            day: "w-10 h-10 text-center text-sm p-0 relative",
            day_button:
              "h-10 w-10 p-0 font-normal text-white hover:bg-[#1a1a1a] rounded-md transition-colors",
            selected:
              "bg-[#ECAC36] text-black hover:bg-[#ECAC36]/90 hover:text-black rounded-md font-semibold",
            today: "text-[#ECAC36] font-semibold",
            outside: "text-gray-700 opacity-40",
            disabled: "text-gray-700 opacity-25 cursor-not-allowed line-through",
            range_middle:
              "bg-[#ECAC36]/15 text-white rounded-none [&>button]:rounded-none",
            range_start: "rounded-l-md [&>button]:rounded-l-md",
            range_end: "rounded-r-md [&>button]:rounded-r-md",
            hidden: "invisible",
          }}
          components={{
            Chevron: ({ orientation }) =>
              orientation === "left" ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              ),
          }}
        />
      </div>

      <div className="px-6 pb-6 space-y-4">
        <div className="flex gap-3 text-xs text-gray-500 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ECAC36]" /> Selected
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-gray-700 opacity-30" />{" "}
            Unavailable
          </span>
          {basePricePerDay ? (
            <span className="flex items-center gap-1.5 text-[#ECAC36] font-semibold">
              From ${basePricePerDay.toLocaleString()}/night
            </span>
          ) : null}
        </div>

        {range?.from && range?.to && nights > 0 ? (
          <div className="bg-[#0A0A0A] rounded-xl p-4 border border-[#ECAC36]/20 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Check-in</span>
              <span className="text-white font-medium">
                {format(range.from, "MMM d, yyyy")}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Check-out</span>
              <span className="text-white font-medium">
                {format(range.to, "MMM d, yyyy")}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Duration</span>
              <span className="text-white font-medium">
                {nights} night{nights !== 1 ? "s" : ""}
              </span>
            </div>
            {pricing && pricing.total > 0 && (
              <div className="border-t border-[#333333] pt-3">
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">
                    ~${pricing.perNight.toLocaleString()} &times; {nights} night
                    {nights !== 1 ? "s" : ""}
                  </span>
                  <span className="text-[#ECAC36] font-bold text-lg">
                    ${pricing.total.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Estimated total before taxes and fees
                </p>
              </div>
            )}

            <RequestInfoDrawer
              itemTitle={villaTitle}
              itemCategory="villa"
              prefilledMessage={prefilledMessage}
            >
              <Button className="w-full cut-corner bg-[#ECAC36] text-black font-semibold hover:bg-[#ECAC36]/90 min-h-[48px]">
                <Info className="mr-2 h-4 w-4" />
                Request to Book These Dates
              </Button>
            </RequestInfoDrawer>
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-2">
            {range?.from
              ? "Now select your check-out date"
              : "Select a check-in date to get started"}
          </p>
        )}

        {(!range?.from || !range?.to || nights <= 0) && (
          <RequestInfoDrawer
            itemTitle={villaTitle}
            itemCategory="villa"
            prefilledMessage=""
          >
            <Button
              variant="outline"
              className="w-full cut-corner border-[#ECAC36]/40 text-[#ECAC36] hover:bg-[#ECAC36]/10 min-h-[44px]"
            >
              <Info className="mr-2 h-4 w-4" />
              Request Information
            </Button>
          </RequestInfoDrawer>
        )}
      </div>
    </div>
  )
}

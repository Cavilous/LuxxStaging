"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { differenceInDays, format, parseISO, isValid } from "date-fns"
import { formatInTimeZone } from "date-fns-tz"
import { Calendar, AlertCircle } from "lucide-react"

interface DateRangePickerProps {
  category: "car" | "yacht" | "villa"
  startDate: string
  endDate: string
  onStartDateChange: (date: string) => void
  onEndDateChange: (date: string) => void
  error?: string
  className?: string
}

export function DateRangePicker({
  category,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  error,
  className = "",
}: DateRangePickerProps) {
  const [validationError, setValidationError] = useState<string | null>(null)

  const getLabels = () => {
    switch (category) {
      case "villa":
        return { start: "Check-in Date", end: "Check-out Date", unit: "night" }
      case "yacht":
        return { start: "Charter Start", end: "Charter End", unit: "day" }
      case "car":
      default:
        return { start: "Pickup Date", end: "Drop-off Date", unit: "day" }
    }
  }

  const labels = getLabels()

  useEffect(() => {
    if (startDate && endDate) {
      const start = parseISO(startDate)
      const end = parseISO(endDate)
      
      if (isValid(start) && isValid(end)) {
        if (end <= start) {
          setValidationError(`${labels.end} must be after ${labels.start}`)
        } else {
          setValidationError(null)
        }
      }
    } else {
      setValidationError(null)
    }
  }, [startDate, endDate, labels.end, labels.start])

  const getDuration = (): string | null => {
    if (!startDate || !endDate) return null
    
    const start = parseISO(startDate)
    const end = parseISO(endDate)
    
    if (!isValid(start) || !isValid(end)) return null
    if (end <= start) return null
    
    const days = differenceInDays(end, start)
    
    if (category === "villa") {
      return `${days} ${days === 1 ? "night" : "nights"}`
    }
    return `${days} ${days === 1 ? "day" : "days"}`
  }

  const duration = getDuration()
  const displayError = error || validationError

  const today = format(new Date(), "yyyy-MM-dd")

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-white text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#ECAC36]" />
            {labels.start}
          </Label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            min={today}
            className="bg-charcoal border-gray-700 text-white focus:border-[#ECAC36] [&::-webkit-calendar-picker-indicator]:invert"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-white text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#ECAC36]" />
            {labels.end}
          </Label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            min={startDate || today}
            className="bg-charcoal border-gray-700 text-white focus:border-[#ECAC36] [&::-webkit-calendar-picker-indicator]:invert"
          />
        </div>
      </div>

      {duration && !displayError && (
        <div className="flex items-center gap-2 text-[#ECAC36] text-sm font-medium">
          <span className="bg-[#ECAC36]/10 px-3 py-1 rounded-full border border-[#ECAC36]/30">
            {duration}
          </span>
        </div>
      )}

      {displayError && (
        <div className="flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{displayError}</span>
        </div>
      )}
    </div>
  )
}

export function formatDateRangeForEmail(
  startDate: string,
  endDate: string,
  category: "car" | "yacht" | "villa"
): { formatted: string; duration: string } {
  const start = parseISO(startDate)
  const end = parseISO(endDate)
  
  if (!isValid(start) || !isValid(end)) {
    return { formatted: "Dates not specified", duration: "" }
  }
  
  const etTimezone = "America/New_York"
  const startFormatted = formatInTimeZone(start, etTimezone, "EEEE, MMMM d, yyyy")
  const endFormatted = formatInTimeZone(end, etTimezone, "EEEE, MMMM d, yyyy")
  
  const days = differenceInDays(end, start)
  
  let labels: { start: string; end: string; unit: string }
  switch (category) {
    case "villa":
      labels = { start: "Check-in", end: "Check-out", unit: days === 1 ? "night" : "nights" }
      break
    case "yacht":
      labels = { start: "Charter Start", end: "Charter End", unit: days === 1 ? "day" : "days" }
      break
    default:
      labels = { start: "Pickup", end: "Drop-off", unit: days === 1 ? "day" : "days" }
  }
  
  return {
    formatted: `${labels.start}: ${startFormatted} (ET)\n${labels.end}: ${endFormatted} (ET)`,
    duration: `${days} ${labels.unit}`
  }
}

export function validateDateRange(startDate: string, endDate: string): { valid: boolean; error?: string } {
  if (!startDate || !endDate) {
    return { valid: true }
  }
  
  const start = parseISO(startDate)
  const end = parseISO(endDate)
  
  if (!isValid(start) || !isValid(end)) {
    return { valid: false, error: "Invalid date format" }
  }
  
  if (end <= start) {
    return { valid: false, error: "End date must be after start date" }
  }
  
  return { valid: true }
}

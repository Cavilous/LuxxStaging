import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const carId = searchParams.get("carId")
    const date = searchParams.get("date")
    const duration = searchParams.get("duration") || "1h"

    if (!carId || !date) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const supabase = createClient()

    // Get car's operating hours
    const { data: car, error: carError } = await supabase
      .from("inventory")
      .select("tour_operating_hours, tour_blackouts")
      .eq("id", carId)
      .eq("tour_enabled", true)
      .single()

    if (carError || !car) {
      return NextResponse.json({ error: "Car not found or tours not enabled" }, { status: 404 })
    }

    // Get day of week for operating hours
    const dayOfWeek = new Date(date).toLocaleDateString("en-US", { weekday: "lowercase" })
    const operatingHours = car.tour_operating_hours?.[dayOfWeek]

    if (!operatingHours) {
      return NextResponse.json({ slots: [] })
    }

    // Generate time slots
    const slots = generateTimeSlots(
      operatingHours.start,
      operatingHours.end,
      duration === "2h" ? 120 : 60,
      15, // 15-minute buffer
    )

    // Get existing bookings for this car and date
    const { data: existingBookings } = await supabase
      .from("tour_bookings")
      .select("start_time, duration_minutes, status, hold_expires_at")
      .eq("car_id", carId)
      .eq("date", date)
      .in("status", ["pending", "confirmed"])

    // Filter out unavailable slots
    const availableSlots = slots.filter((slot) => {
      return !isSlotConflicting(slot, existingBookings || [], duration === "2h" ? 120 : 60)
    })

    // Check for blackouts
    const blackouts = car.tour_blackouts || []
    const filteredSlots = availableSlots.filter((slot) => {
      return !isSlotBlackedOut(slot, date, blackouts)
    })

    return NextResponse.json({ slots: filteredSlots })
  } catch (error) {
    console.error('[Tour Slots API Error]:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function generateTimeSlots(startTime: string, endTime: string, durationMinutes: number, bufferMinutes: number) {
  const slots = []
  const start = timeToMinutes(startTime)
  const end = timeToMinutes(endTime)
  const slotDuration = durationMinutes + bufferMinutes

  for (let time = start; time + durationMinutes <= end; time += slotDuration) {
    slots.push(minutesToTime(time))
  }

  return slots
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`
}

function isSlotConflicting(slot: string, existingBookings: any[], durationMinutes: number): boolean {
  const slotStart = timeToMinutes(slot)
  const slotEnd = slotStart + durationMinutes

  return existingBookings.some((booking) => {
    // Check if booking is still valid (not expired hold)
    if (booking.status === "pending" && booking.hold_expires_at) {
      const holdExpiry = new Date(booking.hold_expires_at)
      if (holdExpiry < new Date()) {
        return false // Expired hold, doesn't conflict
      }
    }

    const bookingStart = timeToMinutes(booking.start_time)
    const bookingEnd = bookingStart + booking.duration_minutes

    // Check for overlap
    return slotStart < bookingEnd && slotEnd > bookingStart
  })
}

function isSlotBlackedOut(slot: string, date: string, blackouts: any[]): boolean {
  return blackouts.some((blackout) => {
    const blackoutDate = blackout.date
    const blackoutStartTime = blackout.start_time
    const blackoutEndTime = blackout.end_time

    if (blackoutDate === date) {
      const slotTime = timeToMinutes(slot)
      const blackoutStart = timeToMinutes(blackoutStartTime)
      const blackoutEnd = timeToMinutes(blackoutEndTime)

      return slotTime >= blackoutStart && slotTime < blackoutEnd
    }

    return false
  })
}

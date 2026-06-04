import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { bookingReference, paymentIntentId } = body

    if (!bookingReference) {
      return NextResponse.json({ error: "Missing booking reference" }, { status: 400 })
    }

    const supabase = createClient()

    // Find the booking
    const { data: booking, error: bookingError } = await supabase
      .from("tour_bookings")
      .select("*, inventory(*), tour_routes(*)")
      .eq("booking_reference", bookingReference)
      .single()

    if (bookingError || !booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Update booking status to confirmed
    const { error: updateError } = await supabase
      .from("tour_bookings")
      .update({
        status: "confirmed",
        payment_intent_id: paymentIntentId,
        hold_expires_at: null, // Clear the hold
        updated_at: new Date().toISOString(),
      })
      .eq("id", booking.id)

    if (updateError) {
      console.error("Booking update error:", updateError)
      return NextResponse.json({ error: "Failed to confirm booking" }, { status: 500 })
    }

    // Send confirmation notifications
    await sendConfirmationNotifications(booking)

    return NextResponse.json({
      success: true,
      booking: {
        ...booking,
        status: "confirmed",
        payment_intent_id: paymentIntentId,
      },
    })
  } catch (error) {
    console.error("Confirmation API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function sendConfirmationNotifications(booking: any) {
  try {
    // Generate calendar invite
    const calendarInvite = generateCalendarInvite(booking)

    // In a real implementation, send email with calendar invite
    console.log("Sending confirmation email to:", booking.contact.email)
    console.log("Calendar invite:", calendarInvite)

    // Send SMS if opted in
    if (booking.contact.smsOptIn && booking.contact.phone) {
      console.log("Sending SMS confirmation to:", booking.contact.phone)
    }

    // Send WhatsApp if opted in
    if (booking.contact.whatsappOptIn && booking.contact.phone) {
      console.log("Sending WhatsApp confirmation to:", booking.contact.phone)
    }
  } catch (error) {
    console.error("Notification error:", error)
  }
}

function generateCalendarInvite(booking: any): string {
  const startDateTime = new Date(`${booking.date}T${booking.start_time}:00`)
  const endDateTime = new Date(startDateTime.getTime() + booking.duration_minutes * 60000)

  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
  }

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Luxx Miami//Tour Booking//EN",
    "BEGIN:VEVENT",
    `UID:${booking.booking_reference}@luxxmiami.com`,
    `DTSTART:${formatDate(startDateTime)}`,
    `DTEND:${formatDate(endDateTime)}`,
    `SUMMARY:Luxx Miami Tour - ${booking.inventory.title}`,
    `DESCRIPTION:Your luxury car tour with ${booking.inventory.make} ${booking.inventory.model}\\n\\nRoute: ${booking.tour_routes.title}\\nPassengers: ${booking.passengers}\\nBooking Reference: ${booking.booking_reference}`,
    `LOCATION:${booking.inventory.tour_pickup_location || "Luxx Brickell, Miami, FL"}`,
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "TRIGGER:-PT30M",
    "ACTION:DISPLAY",
    "DESCRIPTION:Tour starts in 30 minutes",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n")

  return icsContent
}

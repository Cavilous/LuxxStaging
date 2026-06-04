import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { logFormSubmission } from "@/lib/analytics-helpers"
import { performSecurityChecks } from "@/lib/security"
import { logRentalInquiry } from "@/lib/google-sheets"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const securityCheck = await performSecurityChecks(request, {
      turnstileToken: body.turnstileToken,
      honeypot: body._website,
      formLoadedAt: body._formLoadedAt,
      name: body.leadPassenger?.name,
      email: body.leadPassenger?.email,
      phone: body.leadPassenger?.phone,
    }, 'tours-book')

    if (!securityCheck.passed) {
      return NextResponse.json({ error: securityCheck.error }, { status: securityCheck.statusCode || 400 })
    }

    const {
      carId,
      date,
      time,
      duration,
      passengers,
      routeId,
      selectedAddOns,
      leadPassenger,
      additionalPassengers,
      basePrice,
      addOnPrice,
      totalPrice,
      smsOptIn,
      whatsappOptIn,
      waiverSigned,
    } = body

    // Validate required fields
    if (!carId || !date || !time || !routeId || !leadPassenger.name || !leadPassenger.email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createClient()

    // Check if car is available for tours
    const { data: car, error: carError } = await supabase
      .from("inventory")
      .select("*")
      .eq("id", carId)
      .eq("tour_enabled", true)
      .single()

    if (carError || !car) {
      return NextResponse.json({ error: "Car not available for tours" }, { status: 400 })
    }

    // Check for existing bookings at the same time (double-booking prevention)
    const durationMinutes = duration === "2h" ? 120 : 60
    const { data: existingBookings } = await (supabase
      .from("tour_bookings")
      .select("*")
      .eq("car_id", carId)
      .eq("date", date)
      .eq("start_time", time)
      .in("status", ["pending", "confirmed"]) as unknown as Promise<{ data: any[]; error: any }>)

    // Check for valid existing bookings (not expired holds)
    const validBookings = existingBookings?.filter((booking: any) => {
      if (booking.status === "confirmed") return true
      if (booking.status === "pending" && booking.hold_expires_at) {
        return new Date(booking.hold_expires_at) > new Date()
      }
      return false
    })

    if (validBookings && validBookings.length > 0) {
      return NextResponse.json({ error: "Time slot not available" }, { status: 409 })
    }

    // Generate booking reference
    const bookingReference = `TB${Date.now().toString().slice(-8)}`

    // Create booking record with 10-minute hold
    const holdExpiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now

    const { data: booking, error: bookingError } = await supabase
      .from("tour_bookings")
      .insert({
        booking_reference: bookingReference,
        car_id: carId,
        route_id: routeId,
        date,
        start_time: time,
        duration_minutes: durationMinutes,
        passengers,
        base_price: basePrice,
        addon_price: addOnPrice,
        total_price: totalPrice,
        addons: selectedAddOns,
        status: "pending",
        hold_expires_at: holdExpiresAt.toISOString(),
        contact: {
          name: leadPassenger.name,
          phone: leadPassenger.phone,
          email: leadPassenger.email,
          passengers: additionalPassengers,
          smsOptIn,
          whatsappOptIn,
        },
        waiver_signed: waiverSigned,
        waiver_signed_at: waiverSigned ? new Date().toISOString() : null,
      })
      .select()
      .single()

    if (bookingError) {
      console.error('[Booking Creation Error]:', bookingError)
      return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
    }

    // Log for analytics
    await logFormSubmission({
      formType: 'tour_booking_checkout',
      pageRoute: '/tours/cars',
      customerName: leadPassenger.name,
      customerEmail: leadPassenger.email,
      customerPhone: leadPassenger.phone,
      payload: { carId, date, time, duration, passengers, routeId, selectedAddOns, leadPassenger, basePrice, addOnPrice, totalPrice },
    })

    // Log to Google Sheets
    try {
      const carData = car as any
      await logRentalInquiry({
        name: leadPassenger.name,
        phone: leadPassenger.phone,
        email: leadPassenger.email,
        itemTitle: carData?.title || `Car Tour - ${carData?.make || ''} ${carData?.model || ''}`,
        itemCategory: 'Car Tour',
        startDate: date,
        message: `Duration: ${duration}, Passengers: ${passengers}, Total: $${totalPrice}`,
        source: 'tour_booking',
      })
      console.log('📊 Tour booking logged to Google Sheets')
    } catch (sheetsError) {
      console.error('⚠️ Failed to log to Google Sheets:', sheetsError)
    }

    // In a real implementation, integrate with Stripe Checkout here
    // For now, simulate payment processing
    const checkoutUrl = createStripeCheckoutSession(booking, car)

    return NextResponse.json({
      bookingId: booking.id,
      bookingReference,
      checkoutUrl,
      holdExpiresAt: holdExpiresAt.toISOString(),
    })
  } catch (error) {
    console.error('[Tour Booking API Error]:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function createStripeCheckoutSession(booking: any, car: any): string {
  // In a real implementation, this would create a Stripe Checkout session
  // and return the actual checkout URL

  // For demo purposes, redirect to a success page
  return `/tours/cars/booking-success?ref=${booking.booking_reference}`
}

"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Calendar, MapPin, Clock, Users, Car, Download, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface BookingDetails {
  booking_reference: string
  car: {
    make: string
    model: string
    images: string[]
  }
  route: {
    title: string
    description: string
  }
  date: string
  start_time: string
  duration_minutes: number
  passengers: number
  total_price: number
  contact: {
    name: string
    email: string
  }
  pickup_location: string
}

export default function BookingSuccessPage() {
  const searchParams = useSearchParams()
  const bookingRef = searchParams.get("ref")
  const [booking, setBooking] = useState<BookingDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (bookingRef) {
      fetchBookingDetails(bookingRef)
    }
  }, [bookingRef])

  const fetchBookingDetails = async (reference: string) => {
    try {
      // In a real implementation, fetch from API
      // For demo, use mock data
      const mockBooking: BookingDetails = {
        booking_reference: reference,
        car: {
          make: "Ferrari",
          model: "SF90 Stradale",
          images: ["/ferrari-sf90.png"],
        },
        route: {
          title: "Miami Icons - 1 Hour",
          description: "South Beach → Mansions → Key Biscayne Bridge",
        },
        date: "2024-12-15",
        start_time: "15:00",
        duration_minutes: 60,
        passengers: 2,
        total_price: 650,
        contact: {
          name: "John Doe",
          email: "john@example.com",
        },
        pickup_location: "Luxx Brickell, Miami, FL",
      }

      // Simulate API call delay
      setTimeout(() => {
        setBooking(mockBooking)
        setLoading(false)

        // Confirm the booking via API
        confirmBooking(reference)
      }, 1000)
    } catch (error) {
      console.error("Error fetching booking:", error)
      setLoading(false)
    }
  }

  const confirmBooking = async (reference: string) => {
    try {
      await fetch("/api/tours/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingReference: reference,
          paymentIntentId: `pi_${Date.now()}`, // Mock payment intent
        }),
      })
    } catch (error) {
      console.error("Error confirming booking:", error)
    }
  }

  const downloadCalendarInvite = () => {
    if (!booking) return

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
      `SUMMARY:Luxx Miami Tour - ${booking.car.make} ${booking.car.model}`,
      `DESCRIPTION:Your luxury car tour\\n\\nRoute: ${booking.route.title}\\nPassengers: ${booking.passengers}\\nBooking Reference: ${booking.booking_reference}`,
      `LOCATION:${booking.pickup_location}`,
      "STATUS:CONFIRMED",
      "BEGIN:VALARM",
      "TRIGGER:-PT30M",
      "ACTION:DISPLAY",
      "DESCRIPTION:Tour starts in 30 minutes",
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n")

    const blob = new Blob([icsContent], { type: "text/calendar" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `luxx-tour-${booking.booking_reference}.ics`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ECAC36] mx-auto mb-4"></div>
          <p className="text-gray-400">Processing your booking...</p>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Booking Not Found</h1>
          <p className="text-gray-400 mb-6">We couldn't find your booking details.</p>
          <Link href="/tours/cars">
            <Button className="bg-[#ECAC36] hover:bg-[#B8860B] text-black font-bold cut-corner">Back to Tours</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-[#ECAC36] to-[#e6c766] rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-black" />
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-[#ECAC36] to-white bg-clip-text text-transparent">
              Booking Confirmed!
            </h1>
            <p className="text-xl text-gray-300">Your luxury car tour has been successfully booked</p>
            <p className="text-[#ECAC36] font-semibold mt-2">Booking Reference: {booking.booking_reference}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Tour Details */}
            <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border border-[#ECAC36]/20 cut-corner">
              <CardHeader>
                <CardTitle className="text-[#ECAC36] flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Tour Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={booking.car.images[0] || "/placeholder.svg"}
                    alt={`${booking.car.make} ${booking.car.model}`}
                    className="w-20 h-12 object-cover rounded cut-corner"
                  />
                  <div>
                    <h3 className="font-semibold text-white">
                      {booking.car.make} {booking.car.model}
                    </h3>
                    <p className="text-sm text-gray-400">{booking.route.title}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Calendar className="h-4 w-4 text-[#ECAC36]" />
                    <span>
                      {new Date(booking.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-300">
                    <Clock className="h-4 w-4 text-[#ECAC36]" />
                    <span>
                      {booking.start_time} ({booking.duration_minutes} minutes)
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-300">
                    <Users className="h-4 w-4 text-[#ECAC36]" />
                    <span>
                      {booking.passengers} {booking.passengers === 1 ? "passenger" : "passengers"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-300">
                    <MapPin className="h-4 w-4 text-[#ECAC36]" />
                    <span>{booking.pickup_location}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#ECAC36]/20">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total Paid:</span>
                    <span className="text-2xl font-bold text-[#ECAC36]">${booking.total_price}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Important Information */}
            <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border border-[#ECAC36]/20 cut-corner">
              <CardHeader>
                <CardTitle className="text-[#ECAC36]">Important Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-white mb-2">What to Bring</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Valid ID for all passengers</li>
                    <li>• Comfortable clothing</li>
                    <li>• Camera or phone for photos</li>
                    <li>• Sunglasses (recommended)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">Pickup Details</h4>
                  <p className="text-sm text-gray-300 mb-2">Please arrive 15 minutes before your scheduled time at:</p>
                  <p className="text-sm text-[#ECAC36] font-medium">{booking.pickup_location}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">Cancellation Policy</h4>
                  <p className="text-sm text-gray-300">
                    Free cancellation up to 24 hours before your tour. Contact us for any changes or cancellations.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">Contact Information</h4>
                  <p className="text-sm text-gray-300">
                    Phone: (305) 605-5899
                    <br />
                    Email: luxxmiamigroup@gmail.com
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Confirmation Email Notice */}
          <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border border-[#ECAC36]/20 cut-corner mt-8">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-white mb-2">Confirmation Sent</h3>
              <p className="text-gray-300 mb-4">
                A confirmation email with all details and calendar invite has been sent to{" "}
                <span className="text-[#ECAC36] font-medium">{booking.contact.email}</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={downloadCalendarInvite}
                  className="bg-[#ECAC36] hover:bg-[#B8860B] text-black font-semibold cut-corner"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Calendar Invite
                </Button>

                <Link href="/tours/cars">
                  <Button
                    variant="outline"
                    className="border-[#ECAC36]/30 text-[#ECAC36] hover:bg-[#ECAC36]/10 cut-corner bg-transparent"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Book Another Tour
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, Users, MapPin, Camera, CreditCard, CheckCircle, X, AlertCircle } from "lucide-react"

interface TourCar {
  id: string
  make: string
  model: string
  images: string[]
  tour_category: string
  tour_max_passengers: number
  tour_pricing: any
}

interface TourRoute {
  id: string
  title: string
  description: string
  duration: string
}

interface TourAddOn {
  id: string
  title: string
  price: number
  per_booking: boolean
  per_passenger: boolean
}

interface BookingDrawerProps {
  isOpen: boolean
  onClose: () => void
  selectedCar: TourCar | null
  routes: TourRoute[]
  addOns: TourAddOn[]
}

export function TourBookingDrawer({ isOpen, onClose, selectedCar, routes, addOns }: BookingDrawerProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [holdExpiry, setHoldExpiry] = useState<Date | null>(null)
  const [bookingData, setBookingData] = useState({
    date: "",
    time: "",
    duration: "1h",
    passengers: 1,
    routeId: "",
    selectedAddOns: [] as string[],
    leadPassenger: {
      name: "",
      phone: "",
      email: "",
    },
    additionalPassengers: [] as string[],
    smsOptIn: false,
    whatsappOptIn: false,
    waiverSigned: false,
  })
  const [loading, setLoading] = useState(false)

  const steps = [
    { number: 1, title: "Choose Details", icon: Calendar },
    { number: 2, title: "Add-ons", icon: Camera },
    { number: 3, title: "Guest Info", icon: Users },
    { number: 4, title: "Payment", icon: CreditCard },
    { number: 5, title: "Confirmation", icon: CheckCircle },
  ]

  // Reset when drawer opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1)
      setHoldExpiry(null)
      setBookingData({
        date: "",
        time: "",
        duration: "1h",
        passengers: 1,
        routeId: "",
        selectedAddOns: [],
        leadPassenger: { name: "", phone: "", email: "" },
        additionalPassengers: [],
        smsOptIn: false,
        whatsappOptIn: false,
        waiverSigned: false,
      })
    }
  }, [isOpen])

  useEffect(() => {
    if (selectedCar && bookingData.date && bookingData.duration) {
      fetchAvailableSlots()
    }
  }, [selectedCar, bookingData.date, bookingData.duration])

  useEffect(() => {
    if (holdExpiry && currentStep === 4) {
      const interval = setInterval(() => {
        const now = new Date()
        if (now >= holdExpiry) {
          // Hold expired, go back to step 1
          setCurrentStep(1)
          setHoldExpiry(null)
          alert("Your booking hold has expired. Please select a new time slot.")
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [holdExpiry, currentStep])

  const fetchAvailableSlots = async () => {
    if (!selectedCar) return

    setLoadingSlots(true)
    try {
      const response = await fetch(
        `/api/tours/slots?carId=${selectedCar.id}&date=${bookingData.date}&duration=${bookingData.duration}`,
      )
      const data = await response.json()
      setAvailableSlots(data.slots || [])
    } catch (error) {
      console.error("Error fetching slots:", error)
      setAvailableSlots([])
    } finally {
      setLoadingSlots(false)
    }
  }

  const calculatePrice = () => {
    if (!selectedCar) return 0
    const pricing = selectedCar.tour_pricing?.perHour || { pax1: 300, pax2: 225, pax3: 175, pax4: 150 }
    const hours = bookingData.duration === "2h" ? 2 : 1
    const passengerKey = `pax${bookingData.passengers}` as keyof typeof pricing
    const ratePerHour = pricing[passengerKey] || pricing.pax1
    return ratePerHour * hours
  }

  const calculateAddOnPrice = () => {
    return addOns
      .filter((addon) => bookingData.selectedAddOns.includes(addon.id))
      .reduce((total, addon) => {
        const multiplier = addon.per_passenger ? bookingData.passengers : 1
        return total + addon.price * multiplier
      }, 0)
  }

  const getTotalPrice = () => {
    const basePrice = calculatePrice()
    const addOnPrice = calculateAddOnPrice()
    const taxRate = 0.08875 // Miami tax rate
    const subtotal = basePrice + addOnPrice
    const taxes = subtotal * taxRate
    return subtotal + taxes
  }

  const getSelectedRoute = () => {
    return routes.find((route) => route.id === bookingData.routeId)
  }

  const getTimeRemaining = () => {
    if (!holdExpiry) return null
    const now = new Date()
    const remaining = holdExpiry.getTime() - now.getTime()
    if (remaining <= 0) return null

    const minutes = Math.floor(remaining / 60000)
    const seconds = Math.floor((remaining % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleBooking = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/tours/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carId: selectedCar?.id,
          ...bookingData,
          basePrice: calculatePrice(),
          addOnPrice: calculateAddOnPrice(),
          totalPrice: getTotalPrice(),
        }),
      })

      const result = await response.json()

      if (response.ok) {
        // Set hold expiry for countdown
        if (result.holdExpiresAt) {
          setHoldExpiry(new Date(result.holdExpiresAt))
        }

        // Redirect to payment (in real implementation, this would be Stripe Checkout)
        window.location.href = result.checkoutUrl
      } else {
        alert(result.error || "Booking failed")
      }
    } catch (error) {
      console.error("Booking error:", error)
      alert("An error occurred while booking")
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-[#ECAC36] mb-4">Selected Car</h3>
              {selectedCar && (
                <div className="flex items-center gap-4 p-4 bg-gray-900/50 rounded-lg border border-[#ECAC36]/20">
                  <img
                    src={selectedCar.images?.[0] || `/placeholder.svg?height=80&width=120&query=${selectedCar.make}`}
                    alt={`${selectedCar.make} ${selectedCar.model}`}
                    className="w-20 h-12 object-cover rounded"
                  />
                  <div>
                    <div className="font-semibold text-white">
                      {selectedCar.make} {selectedCar.model}
                    </div>
                    <div className="text-sm text-gray-400">Up to {selectedCar.tour_max_passengers} passengers</div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date" className="text-white">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={bookingData.date}
                  onChange={(e) => setBookingData((prev) => ({ ...prev, date: e.target.value, time: "" }))}
                  className="bg-black/50 border-[#ECAC36]/30 text-white"
                />
              </div>

              <div>
                <Label htmlFor="duration" className="text-white">
                  Duration
                </Label>
                <Select
                  value={bookingData.duration}
                  onValueChange={(value) => setBookingData((prev) => ({ ...prev, duration: value, time: "" }))}
                >
                  <SelectTrigger className="bg-black/50 border-[#ECAC36]/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">1 Hour</SelectItem>
                    <SelectItem value="2h">2 Hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="time" className="text-white">
                Available Time Slots
              </Label>
              {loadingSlots ? (
                <div className="text-center py-4 text-gray-400">Loading available times...</div>
              ) : availableSlots.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {availableSlots.map((slot) => (
                    <Button
                      key={slot}
                      variant={bookingData.time === slot ? "default" : "outline"}
                      size="sm"
                      onClick={() => setBookingData((prev) => ({ ...prev, time: slot }))}
                      className={`cut-corner ${
                        bookingData.time === slot
                          ? "bg-[#ECAC36] text-black"
                          : "border-[#ECAC36]/30 text-white hover:bg-[#ECAC36]/10"
                      }`}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              ) : bookingData.date ? (
                <div className="text-center py-4 text-gray-400">
                  <AlertCircle className="h-6 w-6 mx-auto mb-2" />
                  No available time slots for this date
                </div>
              ) : (
                <div className="text-center py-4 text-gray-400">Please select a date to see available times</div>
              )}
            </div>

            <div>
              <Label htmlFor="passengers" className="text-white">
                Passengers
              </Label>
              <Select
                value={bookingData.passengers.toString()}
                onValueChange={(value) => setBookingData((prev) => ({ ...prev, passengers: Number.parseInt(value) }))}
              >
                <SelectTrigger className="bg-black/50 border-[#ECAC36]/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: selectedCar?.tour_max_passengers || 1 }, (_, i) => i + 1).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? "Person" : "People"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="route" className="text-white">
                Route
              </Label>
              <Select
                value={bookingData.routeId}
                onValueChange={(value) => setBookingData((prev) => ({ ...prev, routeId: value }))}
              >
                <SelectTrigger className="bg-black/50 border-[#ECAC36]/30 text-white">
                  <SelectValue placeholder="Select route" />
                </SelectTrigger>
                <SelectContent>
                  {routes.map((route) => (
                    <SelectItem key={route.id} value={route.id}>
                      {route.title} ({route.duration})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {getSelectedRoute() && (
              <div className="p-4 bg-gray-900/50 rounded-lg border border-[#ECAC36]/20">
                <h4 className="font-semibold text-[#ECAC36] mb-2">{getSelectedRoute()?.title}</h4>
                <p className="text-sm text-gray-300">{getSelectedRoute()?.description}</p>
              </div>
            )}

            {/* Real-time Price Display */}
            {bookingData.passengers > 0 && bookingData.duration && (
              <div className="mt-6 p-4 bg-gradient-to-r from-[#ECAC36]/10 to-transparent rounded-lg border border-[#ECAC36]/30">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">Estimated Price</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#ECAC36]">
                      ${calculatePrice().toLocaleString()}
                    </div>
                    <p className="text-xs text-gray-400">
                      {bookingData.passengers} {bookingData.passengers === 1 ? 'passenger' : 'passengers'} × {bookingData.duration}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[#ECAC36]">Optional Add-ons</h3>
            <div className="space-y-4">
              {addOns.map((addon) => (
                <div
                  key={addon.id}
                  className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-[#ECAC36]/20"
                >
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id={addon.id}
                      checked={bookingData.selectedAddOns.includes(addon.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setBookingData((prev) => ({
                            ...prev,
                            selectedAddOns: [...prev.selectedAddOns, addon.id],
                          }))
                        } else {
                          setBookingData((prev) => ({
                            ...prev,
                            selectedAddOns: prev.selectedAddOns.filter((id) => id !== addon.id),
                          }))
                        }
                      }}
                      className="border-[#ECAC36]/30"
                    />
                    <div>
                      <Label htmlFor={addon.id} className="text-white font-medium cursor-pointer">
                        {addon.title}
                      </Label>
                      <div className="text-sm text-gray-400">
                        {addon.per_passenger ? "Per passenger" : "Per booking"}
                      </div>
                    </div>
                  </div>
                  <div className="text-[#ECAC36] font-semibold">
                    ${addon.price}
                    {addon.per_passenger && bookingData.passengers > 1 && (
                      <span className="text-sm text-gray-400"> x{bookingData.passengers}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[#ECAC36]">Guest Information</h3>

            <div>
              <h4 className="font-medium text-white mb-4">Lead Passenger</h4>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="leadName" className="text-white">
                    Full Name
                  </Label>
                  <Input
                    id="leadName"
                    value={bookingData.leadPassenger.name}
                    onChange={(e) =>
                      setBookingData((prev) => ({
                        ...prev,
                        leadPassenger: { ...prev.leadPassenger, name: e.target.value },
                      }))
                    }
                    className="bg-black/50 border-[#ECAC36]/30 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="leadPhone" className="text-white">
                    Phone Number
                  </Label>
                  <Input
                    id="leadPhone"
                    type="tel"
                    value={bookingData.leadPassenger.phone}
                    onChange={(e) =>
                      setBookingData((prev) => ({
                        ...prev,
                        leadPassenger: { ...prev.leadPassenger, phone: e.target.value },
                      }))
                    }
                    className="bg-black/50 border-[#ECAC36]/30 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="leadEmail" className="text-white">
                    Email Address
                  </Label>
                  <Input
                    id="leadEmail"
                    type="email"
                    value={bookingData.leadPassenger.email}
                    onChange={(e) =>
                      setBookingData((prev) => ({
                        ...prev,
                        leadPassenger: { ...prev.leadPassenger, email: e.target.value },
                      }))
                    }
                    className="bg-black/50 border-[#ECAC36]/30 text-white"
                  />
                </div>
              </div>
            </div>

            {bookingData.passengers > 1 && (
              <div>
                <h4 className="font-medium text-white mb-4">Additional Passengers</h4>
                <div className="space-y-3">
                  {Array.from({ length: bookingData.passengers - 1 }, (_, i) => (
                    <Input
                      key={i}
                      placeholder={`Passenger ${i + 2} Full Name`}
                      value={bookingData.additionalPassengers[i] || ""}
                      onChange={(e) => {
                        const newPassengers = [...bookingData.additionalPassengers]
                        newPassengers[i] = e.target.value
                        setBookingData((prev) => ({ ...prev, additionalPassengers: newPassengers }))
                      }}
                      className="bg-black/50 border-[#ECAC36]/30 text-white"
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="smsOptIn"
                  checked={bookingData.smsOptIn}
                  onCheckedChange={(checked) => setBookingData((prev) => ({ ...prev, smsOptIn: !!checked }))}
                  className="border-[#ECAC36]/30"
                />
                <Label htmlFor="smsOptIn" className="text-white text-sm cursor-pointer">
                  Send SMS updates about my booking
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="whatsappOptIn"
                  checked={bookingData.whatsappOptIn}
                  onCheckedChange={(checked) => setBookingData((prev) => ({ ...prev, whatsappOptIn: !!checked }))}
                  className="border-[#ECAC36]/30"
                />
                <Label htmlFor="whatsappOptIn" className="text-white text-sm cursor-pointer">
                  Send WhatsApp updates about my booking
                </Label>
              </div>
            </div>

            <div className="p-4 bg-gray-900/50 rounded-lg border border-[#ECAC36]/20">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="waiver"
                  checked={bookingData.waiverSigned}
                  onCheckedChange={(checked) => setBookingData((prev) => ({ ...prev, waiverSigned: !!checked }))}
                  className="border-[#ECAC36]/30 mt-1"
                />
                <div>
                  <Label htmlFor="waiver" className="text-white text-sm cursor-pointer">
                    I agree to the terms and conditions and liability waiver
                  </Label>
                  <p className="text-xs text-gray-400 mt-1">
                    By checking this box, you acknowledge that you understand the risks involved in this activity and
                    agree to hold Luxx Miami harmless.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#ECAC36]">Payment Summary</h3>
              {holdExpiry && (
                <div className="flex items-center gap-2 text-orange-400">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-mono">{getTimeRemaining()}</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-white">
                <span>Base Tour Price ({bookingData.duration})</span>
                <span>${calculatePrice()}</span>
              </div>

              {bookingData.selectedAddOns.length > 0 && (
                <div>
                  <div className="text-sm text-gray-400 mb-2">Add-ons:</div>
                  {addOns
                    .filter((addon) => bookingData.selectedAddOns.includes(addon.id))
                    .map((addon) => (
                      <div key={addon.id} className="flex justify-between text-white text-sm ml-4">
                        <span>{addon.title}</span>
                        <span>${addon.price * (addon.per_passenger ? bookingData.passengers : 1)}</span>
                      </div>
                    ))}
                </div>
              )}

              <Separator className="bg-[#ECAC36]/20" />

              <div className="flex justify-between text-white">
                <span>Subtotal</span>
                <span>${(calculatePrice() + calculateAddOnPrice()).toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-white">
                <span>Taxes & Fees</span>
                <span>${((calculatePrice() + calculateAddOnPrice()) * 0.08875).toFixed(2)}</span>
              </div>

              <Separator className="bg-[#ECAC36]/20" />

              <div className="flex justify-between text-xl font-bold text-[#ECAC36]">
                <span>Total</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>

            <div className="p-4 bg-gray-900/50 rounded-lg border border-[#ECAC36]/20">
              <h4 className="font-medium text-white mb-2">Payment Policy</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Full payment required at booking</li>
                <li>• No license or insurance required</li>
                <li>• No security deposit needed</li>
                <li>• Free cancellation up to 24 hours before tour</li>
              </ul>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#ECAC36] to-[#e6c766] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-black" />
            </div>

            <h3 className="text-2xl font-bold text-[#ECAC36]">Booking Confirmed!</h3>

            <div className="text-left space-y-4">
              <div className="p-4 bg-gray-900/50 rounded-lg border border-[#ECAC36]/20">
                <h4 className="font-semibold text-white mb-2">Tour Details</h4>
                <div className="space-y-1 text-sm text-gray-300">
                  <div>
                    Car: {selectedCar?.make} {selectedCar?.model}
                  </div>
                  <div>Date: {bookingData.date}</div>
                  <div>Time: {bookingData.time}</div>
                  <div>Duration: {bookingData.duration}</div>
                  <div>Passengers: {bookingData.passengers}</div>
                  <div>Route: {getSelectedRoute()?.title}</div>
                </div>
              </div>

              <div className="p-4 bg-gray-900/50 rounded-lg border border-[#ECAC36]/20">
                <h4 className="font-semibold text-white mb-2">Pickup Location</h4>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <MapPin className="h-4 w-4 text-[#ECAC36]" />
                  Luxx Brickell, Miami, FL
                </div>
              </div>

              <div className="p-4 bg-gray-900/50 rounded-lg border border-[#ECAC36]/20">
                <h4 className="font-semibold text-white mb-2">What to Bring</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Valid ID for all passengers</li>
                  <li>• Comfortable clothing</li>
                  <li>• Camera or phone for photos</li>
                  <li>• Sunglasses (recommended)</li>
                </ul>
              </div>
            </div>

            <p className="text-sm text-gray-400">
              A confirmation email with calendar invite has been sent to {bookingData.leadPassenger.email}
            </p>
          </div>
        )

      default:
        return null
    }
  }

  if (!selectedCar) return null

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg bg-black/95 backdrop-blur-sm border-l border-[#ECAC36]/20 overflow-y-auto"
      >
        <SheetHeader className="pb-6">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold text-[#ECAC36]">Book Your Tour</SheetTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:text-[#ECAC36]">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mt-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentStep >= step.number
                      ? "bg-gradient-to-br from-[#ECAC36] to-[#e6c766] text-black"
                      : "bg-gray-700 text-gray-400"
                  }`}
                >
                  {currentStep > step.number ? <CheckCircle className="h-4 w-4" /> : step.number}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-1 ${currentStep > step.number ? "bg-[#ECAC36]" : "bg-gray-700"}`} />
                )}
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="text-sm text-gray-400">{steps[currentStep - 1]?.title}</div>
          </div>
        </SheetHeader>

        <div className="py-6">{renderStepContent()}</div>

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-6 border-t border-[#ECAC36]/20">
          {currentStep > 1 && currentStep < 5 && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1 cut-corner border-[#ECAC36]/30 text-white hover:bg-[#ECAC36]/10 bg-transparent"
            >
              Back
            </Button>
          )}

          {currentStep < 4 && (
            <Button
              onClick={handleNext}
              disabled={
                (currentStep === 1 && (!bookingData.date || !bookingData.time || !bookingData.routeId)) ||
                (currentStep === 3 &&
                  (!bookingData.leadPassenger.name || !bookingData.leadPassenger.email || !bookingData.waiverSigned))
              }
              className="flex-1 cut-corner bg-gradient-to-r from-[#ECAC36] to-[#e6c766] hover:from-[#e6c766] hover:to-[#ECAC36] text-black font-semibold"
            >
              Continue
            </Button>
          )}

          {currentStep === 4 && (
            <Button
              onClick={handleBooking}
              disabled={loading}
              className="flex-1 cut-corner bg-gradient-to-r from-[#ECAC36] to-[#e6c766] hover:from-[#e6c766] hover:to-[#ECAC36] text-black font-semibold"
            >
              {loading ? "Processing..." : `Pay $${getTotalPrice().toFixed(2)}`}
            </Button>
          )}

          {currentStep === 5 && (
            <Button
              onClick={onClose}
              className="flex-1 cut-corner bg-gradient-to-r from-[#ECAC36] to-[#e6c766] hover:from-[#e6c766] hover:to-[#ECAC36] text-black font-semibold"
            >
              Close
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

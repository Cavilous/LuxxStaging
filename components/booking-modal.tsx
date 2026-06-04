"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Calendar, Check, Phone, MessageCircle, Users, Loader2 } from "lucide-react"
import { formatPhoneNumber, validatePhoneNumber } from "@/lib/phone-utils"
import { submitBooking } from "@/lib/pricing-actions"

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  item: {
    id?: string
    type: "car" | "yacht" | "villa" | "jet"
    title: string
    price: string
    priceUnit: string
    image?: string
    specs?: any
    yachtPricing?: {
      "4h": number
      "6h": number
      "8h": number
      "full-day"?: number
    }
  }
}

type BookingStep = "essentials" | "contact" | "quick-inquiry" | "confirmation"

export function BookingModal({ isOpen, onClose, item }: BookingModalProps) {
  const [currentStep, setCurrentStep] = useState<BookingStep>("essentials")
  const [isQuickInquiry, setIsQuickInquiry] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  const [bookingNumber, setBookingNumber] = useState<string | null>(null)
  const [bookingData, setBookingData] = useState({
    startDate: "",
    endDate: "",
    startTime: "",
    duration: "",
    durationPrice: 0,
    guests: "",
    name: "",
    phone: "",
    email: "",
    whatsappOptIn: false,
    specialRequests: "",
    agreeToTerms: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const resetModalState = () => {
    setCurrentStep("essentials")
    setIsQuickInquiry(false)
    setIsSubmitting(false)
    setSubmissionError(null)
    setBookingNumber(null)
    setBookingData({
      startDate: "",
      endDate: "",
      startTime: "",
      duration: "",
      durationPrice: 0,
      guests: "",
      name: "",
      phone: "",
      email: "",
      whatsappOptIn: false,
      specialRequests: "",
      agreeToTerms: false,
    })
    setErrors({})
  }

  const handleClose = () => {
    resetModalState()
    onClose()
  }

  const steps = [
    { id: "essentials", title: "Reservation Details", icon: Calendar },
    { id: "contact", title: "Contact & Confirm", icon: Check },
  ]

  const validateStep = (step: BookingStep): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case "essentials":
        if (!bookingData.startDate) newErrors.startDate = "Start date is required"
        if ((item.type === "villa" || item.type === "car") && !bookingData.endDate) {
          newErrors.endDate = "End date is required"
        } else if ((item.type === "villa" || item.type === "car") && bookingData.startDate && bookingData.endDate) {
          const start = new Date(bookingData.startDate)
          const end = new Date(bookingData.endDate)
          if (end <= start) {
            newErrors.endDate = item.type === "villa" ? "Check-out must be after check-in" : "Return date must be after pickup date"
          }
        }
        if (item.type === "yacht" && !bookingData.startTime) newErrors.startTime = "Start time is required"
        if (item.type === "yacht" && !bookingData.duration) newErrors.duration = "Duration is required"
        if (item.type === "yacht" && !bookingData.guests) newErrors.guests = "Number of guests is required"
        if (item.type === "villa" && !bookingData.guests) newErrors.guests = "Number of guests is required"
        break
      case "contact":
        if (!bookingData.name) newErrors.name = "Name is required"
        if (!bookingData.phone) newErrors.phone = "Phone number is required"
        if (!bookingData.email) newErrors.email = "Email is required"
        if (!bookingData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms"
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      const stepOrder: BookingStep[] = ["essentials", "contact"]
      const currentIndex = stepOrder.indexOf(currentStep)
      if (currentIndex < stepOrder.length - 1) {
        setCurrentStep(stepOrder[currentIndex + 1])
      }
    }
  }

  const prevStep = () => {
    const stepOrder: BookingStep[] = ["essentials", "contact"]
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1])
    }
  }

  const handleSubmit = async () => {
    if (!isQuickInquiry && !validateStep("contact")) {
      return
    }

    setIsSubmitting(true)
    setSubmissionError(null)

    try {
      const pricing = isQuickInquiry ? { subtotal: 0, total: 0 } : calculatePricing()
      
      const result = await submitBooking({
        itemId: item.id || `temp-${Date.now()}`,
        itemCategory: item.type,
        itemTitle: item.title,
        bookingDetails: {
          name: bookingData.name,
          email: bookingData.email,
          phone: bookingData.phone,
          startDate: isQuickInquiry ? null : (bookingData.startDate || null),
          endDate: isQuickInquiry ? null : (bookingData.endDate || null),
          startTime: isQuickInquiry ? null : (bookingData.startTime || null),
          duration: isQuickInquiry ? null : (bookingData.duration || null),
          guests: isQuickInquiry ? null : (bookingData.guests || null),
          specialRequests: bookingData.specialRequests || null,
          whatsappOptIn: bookingData.whatsappOptIn,
          selectedPackage: isQuickInquiry ? null : (bookingData.duration || null),
        },
        selectedAddOns: [],
        pricingBreakdown: {
          baseTotal: pricing.subtotal,
          totalDiscount: 0,
          addOnsTotal: 0,
          finalTotal: pricing.total,
        }
      })

      if (result.success) {
        setBookingNumber(result.bookingNumber || null)
        setCurrentStep("confirmation")
      } else {
        setSubmissionError(result.error || 'Failed to submit booking. Please try again.')
      }
    } catch (error) {
      console.error('Booking submission error:', error)
      setSubmissionError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const calculateDays = () => {
    if ((item.type === "villa" || item.type === "car") && bookingData.startDate && bookingData.endDate) {
      const start = new Date(bookingData.startDate)
      const end = new Date(bookingData.endDate)
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      return days > 0 ? days : 0
    }
    return 1
  }

  const calculatePricing = () => {
    let basePrice = Number.parseInt(item.price.replace(/[$,]/g, "")) || 0
    const days = calculateDays()
    
    if (item.type === "yacht" && bookingData.durationPrice > 0) {
      basePrice = bookingData.durationPrice
    }
    
    const subtotal = (item.type === "villa" || item.type === "car") ? basePrice * days : basePrice
    
    const addOnTotal = 0

    const taxRate = 0.12
    const processingFeeRate = 0.03
    
    const itemsTotal = subtotal + addOnTotal
    const tax = itemsTotal * taxRate
    const processingFee = itemsTotal * processingFeeRate
    const total = itemsTotal + tax + processingFee

    return {
      basePrice,
      days,
      subtotal,
      addOnTotal,
      tax,
      processingFee,
      total,
    }
  }

  const pricing = calculatePricing()

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose() }}>
      <DialogContent className="bg-black border-[#ECAC36]/20 text-white max-w-full sm:max-w-md md:max-w-lg lg:max-w-2xl max-h-[85vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-heading font-bold text-[#ECAC36]">Reserve {item.title}</DialogTitle>
          <DialogDescription className="sr-only">
            Complete your booking reservation for {item.title}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps - Hide in Quick Inquiry and Confirmation modes */}
        {currentStep !== "quick-inquiry" && currentStep !== "confirmation" && (
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  currentStep === step.id
                    ? "bg-[#ECAC36] border-[#ECAC36] text-black"
                    : steps.findIndex((s) => s.id === currentStep) > index
                      ? "bg-[#ECAC36]/20 border-[#ECAC36] text-[#ECAC36]"
                      : "border-gray-600 text-gray-400"
                }`}
              >
                <step.icon className="h-5 w-5" />
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 h-0.5 mx-2 ${
                    steps.findIndex((s) => s.id === currentStep) > index ? "bg-[#ECAC36]" : "bg-gray-600"
                  }`}
                />
              )}
              </div>
            ))}
          </div>
        )}

        {/* Step Content */}
        <div className="space-y-6">
          {currentStep === "essentials" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-heading font-semibold">Reservation Details</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsQuickInquiry(true)
                    setCurrentStep("quick-inquiry")
                  }}
                  className="text-[#ECAC36] hover:text-[#e6c766] hover:bg-[#ECAC36]/10 min-h-[40px]"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Quick Inquiry Instead
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">
                    {item.type === "villa" ? "Check-in Date" : item.type === "yacht" ? "Charter Date" : "Pickup Date"}
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#ECAC36] pointer-events-none z-10" />
                    <Input
                      id="startDate"
                      type="date"
                      value={bookingData.startDate}
                      onChange={(e) => setBookingData({ ...bookingData, startDate: e.target.value })}
                      className="bg-charcoal border-[#ECAC36]/30 text-white pl-11"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  {errors.startDate && <p className="text-red-400 text-sm mt-1">{errors.startDate}</p>}
                </div>
                {(item.type === "villa" || item.type === "car") && (
                  <div>
                    <Label htmlFor="endDate">{item.type === "villa" ? "Check-out Date" : "Return Date"}</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#ECAC36] pointer-events-none z-10" />
                      <Input
                        id="endDate"
                        type="date"
                        value={bookingData.endDate}
                        onChange={(e) => setBookingData({ ...bookingData, endDate: e.target.value })}
                        className="bg-charcoal border-[#ECAC36]/30 text-white pl-11"
                        min={bookingData.startDate || new Date().toISOString().split("T")[0]}
                      />
                    </div>
                    {errors.endDate && <p className="text-red-400 text-sm mt-1">{errors.endDate}</p>}
                  </div>
                )}
                {item.type === "yacht" && (
                  <div>
                    <Label htmlFor="startTime">Start Time</Label>
                    <Select
                      value={bookingData.startTime}
                      onValueChange={(value) => setBookingData({ ...bookingData, startTime: value })}
                    >
                      <SelectTrigger className="bg-charcoal border-[#ECAC36]/30 text-white">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="08:00">8:00 AM</SelectItem>
                        <SelectItem value="09:00">9:00 AM</SelectItem>
                        <SelectItem value="10:00">10:00 AM</SelectItem>
                        <SelectItem value="12:00">12:00 PM</SelectItem>
                        <SelectItem value="14:00">2:00 PM</SelectItem>
                        <SelectItem value="15:00">3:00 PM</SelectItem>
                        <SelectItem value="16:00">4:00 PM</SelectItem>
                        <SelectItem value="18:00">6:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.startTime && <p className="text-red-400 text-sm mt-1">{errors.startTime}</p>}
                  </div>
                )}
              </div>
              {item.type === "yacht" && (
                <div>
                  <Label htmlFor="duration">Charter Duration</Label>
                  <Select
                    value={bookingData.duration}
                    onValueChange={(value) => {
                      const prices = item.yachtPricing || {
                        "4h": 8595,
                        "6h": 12000,
                        "8h": 15500,
                        "full-day": 18000
                      }
                      setBookingData({ 
                        ...bookingData, 
                        duration: value,
                        durationPrice: prices[value as keyof typeof prices] || 0
                      })
                    }}
                  >
                    <SelectTrigger className="bg-charcoal border-[#ECAC36]/30 text-white">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {item.yachtPricing ? (
                        <>
                          <SelectItem value="4h">4 Hours - ${item.yachtPricing["4h"].toLocaleString()}</SelectItem>
                          <SelectItem value="6h">6 Hours - ${item.yachtPricing["6h"].toLocaleString()}</SelectItem>
                          <SelectItem value="8h">8 Hours - ${item.yachtPricing["8h"].toLocaleString()}</SelectItem>
                          {item.yachtPricing["full-day"] && (
                            <SelectItem value="full-day">Full Day (10h) - ${item.yachtPricing["full-day"].toLocaleString()}</SelectItem>
                          )}
                        </>
                      ) : (
                        <>
                          <SelectItem value="4h">4 Hours - $8,595</SelectItem>
                          <SelectItem value="6h">6 Hours - $12,000</SelectItem>
                          <SelectItem value="8h">8 Hours - $15,500</SelectItem>
                          <SelectItem value="full-day">Full Day (10h) - $18,000</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  {errors.duration && <p className="text-red-400 text-sm mt-1">{errors.duration}</p>}
                </div>
              )}

              {(item.type === "yacht" || item.type === "villa") && (
                <div>
                  <Label htmlFor="guests">Number of Guests</Label>
                  <Select
                    value={bookingData.guests}
                    onValueChange={(value) => setBookingData({ ...bookingData, guests: value })}
                  >
                    <SelectTrigger className="bg-charcoal border-[#ECAC36]/30 text-white">
                      <SelectValue placeholder="Select number of guests" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: item.type === "yacht" ? 12 : 10 }, (_, i) => i + 1).map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} Guest{num > 1 ? "s" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.guests && <p className="text-red-400 text-sm mt-1">{errors.guests}</p>}
                </div>
              )}

              <div className="bg-charcoal/50 border border-[#ECAC36]/20 rounded-lg p-4 mt-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Estimated Total</span>
                  <span className="text-2xl font-bold text-[#ECAC36]">${pricing.total.toLocaleString()}</span>
                </div>
                {(item.type === "car" || item.type === "villa") && bookingData.startDate && bookingData.endDate && pricing.days > 0 && (
                  <p className="text-xs text-gray-400 mt-1">${pricing.basePrice.toLocaleString()}/{item.priceUnit} × {pricing.days} {item.type === "villa" ? "night" : "day"}{pricing.days !== 1 ? "s" : ""}</p>
                )}
                <p className="text-xs text-gray-500 mt-2">Includes taxes and fees</p>
              </div>
            </div>
          )}

          {currentStep === "contact" && (
            <div className="space-y-4">
              <h3 className="text-xl font-heading font-semibold">Contact & Confirm</h3>
              
              <div className="bg-charcoal/50 border border-[#ECAC36]/20 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-[#ECAC36] mb-3">Booking Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">{item.title}</span>
                    <span className="text-white">${pricing.basePrice.toLocaleString()}/{item.priceUnit}</span>
                  </div>
                  {(item.type === "car" || item.type === "villa") && bookingData.startDate && bookingData.endDate && pricing.days > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">{pricing.days} {item.type === "villa" ? "night" : "day"}{pricing.days !== 1 ? "s" : ""}</span>
                      <span className="text-white">${pricing.subtotal.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Taxes & Fees (15%)</span>
                    <span className="text-gray-500">${(pricing.tax + pricing.processingFee).toLocaleString()}</span>
                  </div>
                  <div className="border-t border-gray-700 pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-white">Total</span>
                      <span className="text-2xl font-bold text-[#ECAC36]">${pricing.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={bookingData.name}
                    onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                    className="bg-charcoal border-[#ECAC36]/30 text-white"
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={bookingData.phone}
                    onChange={(e) => setBookingData({ ...bookingData, phone: formatPhoneNumber(e.target.value) })}
                    onBlur={() => {
                      if (bookingData.phone && !validatePhoneNumber(bookingData.phone)) {
                        setErrors({ ...errors, phone: "Please enter a valid 10-digit phone number" })
                      } else {
                        const { phone, ...rest } = errors
                        setErrors(rest)
                      }
                    }}
                    className="bg-charcoal border-[#ECAC36]/30 text-white"
                    placeholder="(305) 555-0123"
                  />
                  {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={bookingData.email}
                  onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                  className="bg-charcoal border-[#ECAC36]/30 text-white"
                  placeholder="your@email.com"
                />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                <Textarea
                  id="specialRequests"
                  value={bookingData.specialRequests}
                  onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                  className="bg-charcoal border-[#ECAC36]/30 text-white min-h-[80px]"
                  placeholder="Any special requests, dietary restrictions, or requirements..."
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="whatsapp"
                    checked={bookingData.whatsappOptIn}
                    onCheckedChange={(checked) => setBookingData({ ...bookingData, whatsappOptIn: !!checked })}
                    className="border-[#ECAC36] data-[state=checked]:bg-[#ECAC36] data-[state=checked]:border-[#ECAC36]"
                  />
                  <Label htmlFor="whatsapp" className="text-sm text-gray-300">
                    I agree to receive booking updates via WhatsApp
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="terms"
                    checked={bookingData.agreeToTerms}
                    onCheckedChange={(checked) => setBookingData({ ...bookingData, agreeToTerms: !!checked })}
                    className="border-[#ECAC36] data-[state=checked]:bg-[#ECAC36] data-[state=checked]:border-[#ECAC36]"
                  />
                  <Label htmlFor="terms" className="text-sm text-gray-300">
                    I agree to the <span className="text-[#ECAC36] underline cursor-pointer">Terms & Conditions</span>{" "}
                    and <span className="text-[#ECAC36] underline cursor-pointer">Privacy Policy</span> *
                  </Label>
                </div>
                {errors.agreeToTerms && <p className="text-red-400 text-sm">{errors.agreeToTerms}</p>}
              </div>

              {submissionError && (
                <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
                  <p className="text-red-400 text-sm">{submissionError}</p>
                </div>
              )}
            </div>
          )}

          {currentStep === "confirmation" && (
            <div className="space-y-6 py-4">
              {/* Success Message */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-[#ECAC36] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-white mb-2">Reservation Request Submitted!</h3>
                <p className="text-gray-400">
                  Thank you for your reservation request. Our team will contact you shortly to confirm your booking.
                </p>
              </div>

              {/* Booking Summary */}
              <div className="bg-[#0A0A0A] border border-[#ECAC36]/20 rounded-lg p-6 space-y-4">
                <h4 className="text-lg font-heading font-semibold text-[#ECAC36] mb-4">Reservation Details</h4>
                
                {/* Vehicle/Property Details */}
                <div className="pb-4 border-b border-gray-800">
                  <p className="text-sm text-gray-400 mb-1">
                    {item.type === "car" ? "Vehicle" : item.type === "yacht" ? "Yacht" : item.type === "villa" ? "Property" : "Jet"}
                  </p>
                  <p className="text-white font-medium">{item.title}</p>
                </div>

                {/* Date Details - Only show if dates are provided */}
                {bookingData.startDate && (
                  <div className="pb-4 border-b border-gray-800">
                    {item.type === "yacht" ? (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-400 mb-1">Date</p>
                            <p className="text-white">{new Date(bookingData.startDate).toLocaleDateString()}</p>
                          </div>
                          {bookingData.startTime && (
                            <div>
                              <p className="text-sm text-gray-400 mb-1">Time</p>
                              <p className="text-white">{bookingData.startTime}</p>
                            </div>
                          )}
                        </div>
                        {bookingData.duration && (
                          <div className="mt-3">
                            <p className="text-sm text-gray-400 mb-1">Duration</p>
                            <p className="text-white">{bookingData.duration}</p>
                          </div>
                        )}
                        {bookingData.guests && (
                          <div className="mt-3">
                            <p className="text-sm text-gray-400 mb-1">Guests</p>
                            <p className="text-white">{bookingData.guests} guests</p>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-400 mb-1">
                              {item.type === "villa" ? "Check-in" : "Pickup"}
                            </p>
                            <p className="text-white">{new Date(bookingData.startDate).toLocaleDateString()}</p>
                          </div>
                          {bookingData.endDate && (
                            <div>
                              <p className="text-sm text-gray-400 mb-1">
                                {item.type === "villa" ? "Check-out" : "Return"}
                              </p>
                              <p className="text-white">{new Date(bookingData.endDate).toLocaleDateString()}</p>
                            </div>
                          )}
                        </div>
                        {item.type === "villa" && bookingData.guests && (
                          <div className="mt-3">
                            <p className="text-sm text-gray-400 mb-1">Guests</p>
                            <p className="text-white">{bookingData.guests} guests</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* Contact Details */}
                <div className="pb-4 border-b border-gray-800">
                  <p className="text-sm text-gray-400 mb-2">Contact Information</p>
                  <div className="space-y-1">
                    <p className="text-white text-sm">{bookingData.name}</p>
                    <p className="text-white text-sm">{bookingData.phone}</p>
                    <p className="text-white text-sm">{bookingData.email}</p>
                  </div>
                </div>

                {/* Total Price - Only show for full bookings, not quick inquiries */}
                {bookingData.startDate && (
                  <div className="pt-2">
                    <div className="flex justify-between items-center">
                      <p className="text-gray-400">Estimated Total</p>
                      <p className="text-2xl font-bold text-[#ECAC36]">${Math.round(pricing.total).toLocaleString()}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Includes taxes and fees</p>
                  </div>
                )}
              </div>

              {/* Special Requests */}
              {bookingData.specialRequests && (
                <div className="bg-[#0A0A0A] border border-[#ECAC36]/20 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-2">Special Requests</p>
                  <p className="text-white text-sm">{bookingData.specialRequests}</p>
                </div>
              )}

              {/* Confirmation Number */}
              {bookingNumber && (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-400 mb-1">Confirmation Number</p>
                  <p className="text-lg font-mono text-[#ECAC36]">#{bookingNumber}</p>
                </div>
              )}

              {/* Done Button */}
              <Button
                onClick={handleClose}
                className="w-full min-h-[48px] bg-[#ECAC36] hover:bg-[#ECAC36]/80 text-black font-semibold"
              >
                Done
              </Button>
            </div>
          )}

          {currentStep === "quick-inquiry" && (
            <div className="space-y-3 sm:space-y-4">
              <div className="text-center mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-heading font-semibold text-white mb-2">Quick Inquiry</h3>
                <p className="text-xs sm:text-sm text-gray-400">
                  Not ready to book? Leave your contact info and we'll get back to you within 1 hour.
                </p>
              </div>
              <div>
                <Label htmlFor="quick-name" className="text-sm">Full Name *</Label>
                <Input
                  id="quick-name"
                  type="text"
                  value={bookingData.name}
                  onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                  className="bg-charcoal border-[#ECAC36]/30 text-white min-h-[48px] text-base"
                  placeholder="John Doe"
                />
                {errors.name && <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <Label htmlFor="quick-phone" className="text-sm">Phone Number *</Label>
                <Input
                  id="quick-phone"
                  type="tel"
                  value={bookingData.phone}
                  onChange={(e) => setBookingData({ ...bookingData, phone: formatPhoneNumber(e.target.value) })}
                  onBlur={() => {
                    if (bookingData.phone && !validatePhoneNumber(bookingData.phone)) {
                      setErrors({ ...errors, phone: "Please enter a valid 10-digit phone number" })
                    } else {
                      const { phone, ...rest } = errors
                      setErrors(rest)
                    }
                  }}
                  className="bg-charcoal border-[#ECAC36]/30 text-white min-h-[48px] text-base"
                  placeholder="(305) 555-1234"
                />
                {errors.phone && <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.phone}</p>}
              </div>
              <div>
                <Label htmlFor="quick-email" className="text-sm">Email Address *</Label>
                <Input
                  id="quick-email"
                  type="email"
                  value={bookingData.email}
                  onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                  className="bg-charcoal border-[#ECAC36]/30 text-white min-h-[48px] text-base"
                  placeholder="john@example.com"
                />
                {errors.email && <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <Label htmlFor="quick-message" className="text-sm">Message (Optional)</Label>
                <Textarea
                  id="quick-message"
                  value={bookingData.specialRequests}
                  onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                  className="bg-charcoal border-[#ECAC36]/30 text-white min-h-[80px] sm:min-h-[100px] text-base"
                  placeholder="Tell us about your needs..."
                  rows={3}
                />
              </div>
              <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsQuickInquiry(false)
                    setCurrentStep("essentials")
                  }}
                  className="w-full sm:flex-1 min-h-[48px] border-gray-600 text-gray-400 hover:bg-gray-800"
                >
                  Back to Booking
                </Button>
                <Button
                  onClick={() => {
                    const newErrors: Record<string, string> = {}
                    if (!bookingData.name) newErrors.name = "Name is required"
                    if (!bookingData.phone) {
                      newErrors.phone = "Phone is required"
                    } else if (!validatePhoneNumber(bookingData.phone)) {
                      newErrors.phone = "Please enter a valid 10-digit phone number"
                    }
                    if (!bookingData.email) newErrors.email = "Email is required"
                    setErrors(newErrors)
                    
                    if (Object.keys(newErrors).length === 0) {
                      handleSubmit()
                    }
                  }}
                  disabled={isSubmitting}
                  className="w-full sm:flex-1 min-h-[48px] bg-[#ECAC36] hover:bg-[#ECAC36]/80 text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Inquiry'
                  )}
                </Button>
              </div>

              {submissionError && (
                <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3">
                  <p className="text-red-400 text-xs sm:text-sm">{submissionError}</p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Price Summary - Show on all steps except quick-inquiry and confirmation */}
        {currentStep !== "quick-inquiry" && currentStep !== "confirmation" && (
          <div className="sticky bottom-0 bg-gradient-to-t from-black via-black to-transparent pt-4 pb-2 -mx-6 px-6">
            <div className="bg-[#ECAC36]/10 border border-[#ECAC36]/30 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Estimated Total</p>
                  <p className="text-2xl font-bold text-[#ECAC36]">${Math.round(pricing.total).toLocaleString()}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="text-white">{item.title}</p>
                  <p className="text-gray-400 text-xs mt-1">Includes tax & fees</p>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === "essentials" || isSubmitting}
                className="min-h-[48px] border-[#ECAC36]/30 text-[#ECAC36] hover:bg-[#ECAC36] hover:text-black bg-transparent disabled:opacity-50"
              >
                Previous
              </Button>
              <Button
                onClick={currentStep === "contact" ? handleSubmit : nextStep}
                disabled={isSubmitting}
                className="min-h-[48px] bg-[#ECAC36] hover:bg-[#ECAC36]/80 text-black font-semibold px-8 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  currentStep === "contact" ? "Confirm Booking" : "Next"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

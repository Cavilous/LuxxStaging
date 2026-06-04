"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Calendar, Check, Phone, MessageCircle, Users, ArrowLeft, Clock } from "lucide-react"
import { differenceInDays } from "date-fns"
import { formatPhoneNumber, validatePhoneNumber } from "@/lib/phone-utils"
import { type SelectedAddOn } from "@/components/booking/add-ons-selector"
import { PricingDisplay } from "@/components/booking/pricing-display"
import { calculatePricing, type CartItem, type AddOn as PricingAddOn, type PricingRule } from "@/lib/pricing-calculator"
import { toast } from "sonner"

interface BookingModalEnhancedProps {
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
    pricing?: {
      "4h": string
      "6h": string
      "8h": string
    }
    pricePer4Hr?: number
    pricePer6Hr?: number
    pricePer8Hr?: number
    pricePerDay?: number
    pricePerNight?: number
  }
}

type BookingStep = "essentials" | "contact" | "quick-inquiry" | "confirmation"

export function BookingModalEnhanced({ isOpen, onClose, item }: BookingModalEnhancedProps) {
  const [currentStep, setCurrentStep] = useState<BookingStep>("essentials")
  const [isQuickInquiry, setIsQuickInquiry] = useState(false)
  const [bookingData, setBookingData] = useState({
    startDate: "",
    endDate: "",
    startTime: "",
    duration: "",
    packageType: "" as '4hr' | '6hr' | '8hr' | '',
    guests: "",
    name: "",
    phone: "",
    email: "",
    whatsappOptIn: false,
    specialRequests: "",
    agreeToTerms: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [selectedAddOns, setSelectedAddOns] = useState<SelectedAddOn[]>([])
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetch('/api/bookings/pricing-rules')
        .then(res => res.json())
        .then(setPricingRules)
        .catch(err => console.error('Error fetching pricing rules:', err))
    }
  }, [isOpen, item.type])

  const resetModalState = () => {
    setCurrentStep("essentials")
    setIsQuickInquiry(false)
    setBookingData({
      startDate: "",
      endDate: "",
      startTime: "",
      duration: "",
      packageType: "",
      guests: "",
      name: "",
      phone: "",
      email: "",
      whatsappOptIn: false,
      specialRequests: "",
      agreeToTerms: false,
    })
    setSelectedAddOns([])
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
        if (item.type === "yacht" && !bookingData.packageType) newErrors.duration = "Package duration is required"
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
    if (!validateStep("contact")) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/bookings/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          itemId: item.id || item.title,
          itemCategory: item.type,
          itemTitle: item.title,
          bookingDetails: bookingData,
          selectedAddOns,
          pricingBreakdown: pricing
        })
      })

      const result = await response.json()

      if (result.success) {
        setCurrentStep("confirmation")
        toast.success("Booking request submitted successfully!")
      } else {
        toast.error(result.error || "Failed to submit booking")
      }
    } catch (error) {
      console.error("Booking submission error:", error)
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleQuickInquiry = async () => {
    const newErrors: Record<string, string> = {}
    if (!bookingData.name.trim()) newErrors.name = "Name is required"
    if (!bookingData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!bookingData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(bookingData.email)) newErrors.email = "Invalid email format"
    
    setErrors(newErrors)
    
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    try {
      console.log('📧 Submitting quick inquiry...')
      const response = await fetch('/api/request-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: bookingData.name,
          phone: bookingData.phone,
          email: bookingData.email,
          message: bookingData.specialRequests || `Quick inquiry about ${item.title}`,
          itemTitle: item.title,
          itemCategory: item.type
        })
      })

      const result = await response.json()
      console.log('📧 Quick inquiry response:', result)
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit inquiry')
      }

      if (result.success) {
        setCurrentStep("confirmation")
        toast.success("Inquiry submitted successfully! We'll contact you soon.")
      } else {
        throw new Error(result.error || "Failed to submit inquiry")
      }
    } catch (error) {
      console.error("❌ Quick inquiry error:", error)
      const errorMessage = error instanceof Error ? error.message : "An error occurred. Please try again."
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const cartItems: CartItem[] = useMemo(() => {
    const items: CartItem[] = []
    
    if (item.type === 'yacht' && bookingData.packageType) {
      items.push({
        id: item.id || item.title,
        category: 'yacht',
        title: item.title,
        pricePer4Hr: item.pricePer4Hr ? item.pricePer4Hr.toString() : (item.pricing?.["4h"] ? item.pricing["4h"].replace(/[$,]/g, '') : undefined),
        pricePer6Hr: item.pricePer6Hr ? item.pricePer6Hr.toString() : (item.pricing?.["6h"] ? item.pricing["6h"].replace(/[$,]/g, '') : undefined),
        pricePer8Hr: item.pricePer8Hr ? item.pricePer8Hr.toString() : (item.pricing?.["8h"] ? item.pricing["8h"].replace(/[$,]/g, '') : undefined),
        packageType: bookingData.packageType
      })
    } else if ((item.type === 'car' || item.type === 'villa') && bookingData.startDate && bookingData.endDate) {
      const basePrice = item.type === 'car' 
        ? (item.pricePerDay || Number.parseInt(item.price.replace(/[$,]/g, ""))) 
        : (item.pricePerNight || Number.parseInt(item.price.replace(/[$,]/g, "")))
      
      items.push({
        id: item.id || item.title,
        category: item.type,
        title: item.title,
        pricePerDay: basePrice.toString(),
        startDate: new Date(bookingData.startDate),
        endDate: new Date(bookingData.endDate)
      })
    }
    
    return items
  }, [item, bookingData.startDate, bookingData.endDate, bookingData.packageType])

  const pricingAddOns: PricingAddOn[] = useMemo(() => {
    return selectedAddOns.map(addon => ({
      id: addon.id,
      name: addon.name,
      description: addon.description,
      category: addon.category,
      priceType: addon.priceType,
      basePrice: addon.basePrice,
      pricePerUnit: addon.pricePerUnit,
      minimumQuantity: addon.minimumQuantity,
      maximumQuantity: addon.maximumQuantity,
      unit: addon.unit,
      quantity: addon.quantity
    }))
  }, [selectedAddOns])

  const pricing = useMemo(() => {
    if (cartItems.length === 0) {
      return {
        baseTotal: 0,
        durationDiscount: 0,
        durationDiscountPercent: 0,
        bundleDiscount: 0,
        bundleDiscountPercent: 0,
        addOnsTotal: 0,
        subtotal: 0,
        totalDiscount: 0,
        finalTotal: 0,
        breakdown: [],
        addOnsBreakdown: []
      }
    }
    
    return calculatePricing(cartItems, pricingAddOns, pricingRules)
  }, [cartItems, pricingAddOns, pricingRules])

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose() }}>
      <DialogContent className="bg-black border-[#ECAC36]/20 text-white max-w-full sm:max-w-md md:max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-heading font-bold text-[#ECAC36]">Reserve {item.title}</DialogTitle>
          <DialogDescription className="sr-only">
            Complete your booking reservation for {item.title}
          </DialogDescription>
        </DialogHeader>

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

        <div className={`grid ${currentStep === "quick-inquiry" ? "lg:grid-cols-1" : "lg:grid-cols-3"} gap-6 lg:gap-8`}>
          <div className={`${currentStep === "quick-inquiry" ? "lg:col-span-1 max-w-2xl mx-auto" : "lg:col-span-2"} space-y-6`}>
            {currentStep === "essentials" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-700/50">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="startDate" className="text-sm font-medium text-gray-300">
                      {item.type === "villa" ? "Check-in Date" : item.type === "yacht" ? "Charter Date" : "Pickup Date"}
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#ECAC36] pointer-events-none z-10" />
                      <Input
                        id="startDate"
                        type="date"
                        value={bookingData.startDate}
                        onChange={(e) => {
                          const newStartDate = e.target.value
                          const updates: Partial<typeof bookingData> = { startDate: newStartDate }
                          if (bookingData.endDate && newStartDate >= bookingData.endDate) {
                            updates.endDate = ""
                          }
                          setBookingData({ ...bookingData, ...updates })
                        }}
                        className="bg-charcoal border-[#ECAC36]/30 text-white pl-11 h-12"
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                    {errors.startDate && <p className="text-red-400 text-sm mt-1.5">{errors.startDate}</p>}
                  </div>
                  {(item.type === "villa" || item.type === "car") && (
                    <div className="space-y-2">
                      <Label htmlFor="endDate" className="text-sm font-medium text-gray-300">{item.type === "villa" ? "Check-out Date" : "Return Date"}</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#ECAC36] pointer-events-none z-10" />
                        <Input
                          id="endDate"
                          type="date"
                          value={bookingData.endDate}
                          onChange={(e) => setBookingData({ ...bookingData, endDate: e.target.value })}
                          className="bg-charcoal border-[#ECAC36]/30 text-white pl-11 h-12"
                          min={bookingData.startDate || new Date().toISOString().split("T")[0]}
                        />
                      </div>
                      {errors.endDate && <p className="text-red-400 text-sm mt-1.5">{errors.endDate}</p>}
                      {bookingData.startDate && bookingData.endDate && (() => {
                        const days = differenceInDays(new Date(bookingData.endDate), new Date(bookingData.startDate))
                        if (days > 0) {
                          const unit = item.type === "villa" ? "night" : "day"
                          return (
                            <div className="flex items-center gap-1.5 mt-2 text-sm text-[#ECAC36]">
                              <Clock className="h-4 w-4" />
                              <span>{days} {unit}{days > 1 ? 's' : ''} selected</span>
                            </div>
                          )
                        }
                        return null
                      })()}
                    </div>
                  )}
                  {item.type === "yacht" && (
                    <div className="space-y-2">
                      <Label htmlFor="startTime" className="text-sm font-medium text-gray-300">Start Time</Label>
                      <Select
                        value={bookingData.startTime}
                        onValueChange={(value) => setBookingData({ ...bookingData, startTime: value })}
                      >
                        <SelectTrigger className="bg-charcoal border-[#ECAC36]/30 text-white h-12">
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
                      {errors.startTime && <p className="text-red-400 text-sm mt-1.5">{errors.startTime}</p>}
                    </div>
                  )}
                </div>
                {item.type === "yacht" && (
                  <div className="space-y-2">
                    <Label htmlFor="duration" className="text-sm font-medium text-gray-300">Charter Package</Label>
                    <Select
                      value={bookingData.packageType}
                      onValueChange={(value) => {
                        setBookingData({ 
                          ...bookingData, 
                          packageType: value as '4hr' | '6hr' | '8hr'
                        })
                      }}
                    >
                      <SelectTrigger className="bg-charcoal border-[#ECAC36]/30 text-white h-12">
                        <SelectValue placeholder="Select package" />
                      </SelectTrigger>
                      <SelectContent>
                        {item.pricePer4Hr && (
                          <SelectItem value="4hr">4 Hours - ${item.pricePer4Hr.toLocaleString()}</SelectItem>
                        )}
                        {item.pricePer6Hr && (
                          <SelectItem value="6hr">6 Hours - ${item.pricePer6Hr.toLocaleString()} <span className="text-green-400 text-xs">(Save 10%)</span></SelectItem>
                        )}
                        {item.pricePer8Hr && (
                          <SelectItem value="8hr">8 Hours - ${item.pricePer8Hr.toLocaleString()} <span className="text-green-400 text-xs">(Save 15%)</span></SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {errors.duration && <p className="text-red-400 text-sm mt-1.5">{errors.duration}</p>}
                  </div>
                )}

                {(item.type === "yacht" || item.type === "villa") && (
                  <div className="space-y-2">
                    <Label htmlFor="guests" className="text-sm font-medium text-gray-300">Number of Guests</Label>
                    <Select
                      value={bookingData.guests}
                      onValueChange={(value) => setBookingData({ ...bookingData, guests: value })}
                    >
                      <SelectTrigger className="bg-charcoal border-[#ECAC36]/30 text-white h-12">
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
                    {errors.guests && <p className="text-red-400 text-sm mt-1.5">{errors.guests}</p>}
                  </div>
                )}
              </div>
            )}

            {currentStep === "quick-inquiry" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-700/50">
                  <h3 className="text-xl font-heading font-semibold">Quick Inquiry</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsQuickInquiry(false)
                      setCurrentStep("essentials")
                    }}
                    className="text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Booking
                  </Button>
                </div>

                <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Not ready to book yet? Leave your contact details and we'll get back to you within 2 hours to discuss availability, pricing, and answer any questions about <strong className="text-[#ECAC36]">{item.title}</strong>.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-300">Full Name *</Label>
                    <Input
                      id="name"
                      value={bookingData.name}
                      onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                      className="bg-charcoal border-[#ECAC36]/30 text-white h-12"
                      placeholder="Enter your full name"
                    />
                    {errors.name && <p className="text-red-400 text-sm mt-1.5">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-300">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={bookingData.phone}
                      onChange={(e) => setBookingData({ ...bookingData, phone: formatPhoneNumber(e.target.value) })}
                      className="bg-charcoal border-[#ECAC36]/30 text-white h-12"
                      placeholder="(305) 555-0123"
                    />
                    {errors.phone && <p className="text-red-400 text-sm mt-1.5">{errors.phone}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-300">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={bookingData.email}
                    onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                    className="bg-charcoal border-[#ECAC36]/30 text-white h-12"
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="text-red-400 text-sm mt-1.5">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialRequests" className="text-sm font-medium text-gray-300">Message (Optional)</Label>
                  <Textarea
                    id="specialRequests"
                    value={bookingData.specialRequests}
                    onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                    className="bg-charcoal border-[#ECAC36]/30 text-white min-h-[100px]"
                    placeholder="Tell us about your requirements, preferred dates, or any questions..."
                    rows={4}
                  />
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="whatsapp-inquiry"
                    checked={bookingData.whatsappOptIn}
                    onCheckedChange={(checked) =>
                      setBookingData({ ...bookingData, whatsappOptIn: checked as boolean })
                    }
                    className="border-[#ECAC36] data-[state=checked]:bg-[#ECAC36] data-[state=checked]:border-[#ECAC36] mt-0.5"
                  />
                  <Label htmlFor="whatsapp-inquiry" className="text-sm text-gray-300 leading-relaxed">
                    I prefer to be contacted via WhatsApp
                  </Label>
                </div>

                <div className="mt-6">
                  <Button
                    onClick={handleQuickInquiry}
                    disabled={isSubmitting}
                    className="w-full bg-[#ECAC36] hover:bg-[#e6c766] text-black font-semibold min-h-[48px]"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Inquiry"}
                  </Button>
                </div>
              </div>
            )}

            {currentStep === "contact" && (
              <div className="space-y-6">
                <h3 className="text-xl font-heading font-semibold mb-4">Contact & Confirm</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-300">Full Name *</Label>
                    <Input
                      id="name"
                      value={bookingData.name}
                      onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                      className="bg-charcoal border-[#ECAC36]/30 text-white h-12"
                      placeholder="Enter your full name"
                    />
                    {errors.name && <p className="text-red-400 text-sm mt-1.5">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-300">Phone Number *</Label>
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
                      className="bg-charcoal border-[#ECAC36]/30 text-white h-12"
                      placeholder="(305) 555-0123"
                    />
                    {errors.phone && <p className="text-red-400 text-sm mt-1.5">{errors.phone}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-300">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={bookingData.email}
                    onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                    className="bg-charcoal border-[#ECAC36]/30 text-white h-12"
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="text-red-400 text-sm mt-1.5">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialRequests" className="text-sm font-medium text-gray-300">Special Requests (Optional)</Label>
                  <Textarea
                    id="specialRequests"
                    value={bookingData.specialRequests}
                    onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                    className="bg-charcoal border-[#ECAC36]/30 text-white min-h-[90px]"
                    placeholder="Any special requests or requirements..."
                    rows={3}
                  />
                </div>
                <div className="flex items-start space-x-3 pt-2">
                  <Checkbox
                    id="whatsapp"
                    checked={bookingData.whatsappOptIn}
                    onCheckedChange={(checked) =>
                      setBookingData({ ...bookingData, whatsappOptIn: checked as boolean })
                    }
                    className="border-[#ECAC36] data-[state=checked]:bg-[#ECAC36] data-[state=checked]:border-[#ECAC36] mt-0.5"
                  />
                  <Label htmlFor="whatsapp" className="text-sm text-gray-300 leading-relaxed">
                    Send me booking updates via WhatsApp
                  </Label>
                </div>
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={bookingData.agreeToTerms}
                    onCheckedChange={(checked) =>
                      setBookingData({ ...bookingData, agreeToTerms: checked as boolean })
                    }
                    className="border-[#ECAC36] data-[state=checked]:bg-[#ECAC36] data-[state=checked]:border-[#ECAC36] mt-0.5"
                  />
                  <Label htmlFor="terms" className="text-sm text-gray-300 leading-relaxed">
                    I agree to the rental terms, cancellation policy, and authorize the 50% deposit charge *
                  </Label>
                </div>
                {errors.agreeToTerms && <p className="text-red-400 text-sm mt-2">{errors.agreeToTerms}</p>}
              </div>
            )}

            {currentStep === "confirmation" && (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-[#ECAC36]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="h-10 w-10 text-[#ECAC36]" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-white mb-3">
                  {isQuickInquiry ? "Inquiry Received!" : "Booking Request Received!"}
                </h3>
                <p className="text-gray-300 mb-4 max-w-md mx-auto">
                  {isQuickInquiry 
                    ? "Thank you for your inquiry. Our team will contact you within 2 hours to discuss availability, pricing, and answer any questions."
                    : "Thank you for your reservation request. Our team will contact you within 2 hours to confirm availability and finalize your booking."
                  }
                </p>
                <div className="bg-charcoal/50 rounded-lg p-6 max-w-md mx-auto mb-4">
                  <p className="text-sm text-gray-300 mb-2">
                    <strong className="text-white">Confirmation sent to:</strong><br />
                    {bookingData.email}
                  </p>
                  <p className="text-sm text-gray-300">
                    <strong className="text-white">Phone:</strong> {bookingData.phone}
                  </p>
                </div>
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4 max-w-md mx-auto mb-6">
                  <p className="text-xs text-gray-400 text-center leading-relaxed">
                    <strong className="text-gray-300">Please Note:</strong> Pricing and availability are subject to final confirmation. Our team will verify all details and provide final pricing based on your specific requirements.
                  </p>
                </div>
                <div className="flex gap-3 justify-center">
                  <Button onClick={handleClose} className="bg-[#ECAC36] hover:bg-[#e6c766] text-black">
                    Close
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open(`https://wa.me/13056055899?text=Hi! I just submitted a booking request for ${item.title}`, "_blank")}
                    className="border-[#ECAC36] text-[#ECAC36] hover:bg-[#ECAC36] hover:text-black"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Chat on WhatsApp
                  </Button>
                </div>
              </div>
            )}
          </div>

          {currentStep !== "confirmation" && currentStep !== "quick-inquiry" && (
            <div className="lg:col-span-1">
              <PricingDisplay
                baseTotal={pricing.baseTotal}
                durationDiscount={pricing.durationDiscount}
                durationDiscountPercent={pricing.durationDiscountPercent}
                bundleDiscount={pricing.bundleDiscount}
                bundleDiscountPercent={pricing.bundleDiscountPercent}
                addOnsTotal={pricing.addOnsTotal}
                totalDiscount={pricing.totalDiscount}
                finalTotal={pricing.finalTotal}
                breakdown={pricing.breakdown}
                addOnsBreakdown={pricing.addOnsBreakdown}
              />
            </div>
          )}
        </div>

        {currentStep !== "confirmation" && (
          <div className="flex justify-between mt-8 pt-8 border-t border-gray-700">
            {currentStep !== "essentials" && currentStep !== "quick-inquiry" && (
              <Button
                onClick={prevStep}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}
            {currentStep === "essentials" && (
              <div></div>
            )}
            <div className="flex gap-2">
              {currentStep !== "contact" ? (
                <Button
                  onClick={nextStep}
                  className="bg-[#ECAC36] hover:bg-[#e6c766] text-black font-semibold min-w-[120px]"
                >
                  Continue
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-[#ECAC36] hover:bg-[#e6c766] text-black font-semibold min-w-[120px]"
                >
                  {isSubmitting ? "Submitting..." : "Confirm Booking"}
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

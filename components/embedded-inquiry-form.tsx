"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, CheckCircle2, Send, ShieldCheck } from "lucide-react"
import { formatPhoneNumber, validatePhoneNumber } from "@/lib/phone-utils"
import { DateRangePicker, validateDateRange } from "@/components/date-range-picker"
import { Turnstile } from "@/components/turnstile"

interface EmbeddedInquiryFormProps {
  itemTitle: string
  itemCategory: "car" | "yacht" | "villa"
  pricingNote?: string
  initialRentalDays?: number
}

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next.toISOString().split("T")[0]
}

export function EmbeddedInquiryForm({ itemTitle, itemCategory, pricingNote, initialRentalDays }: EmbeddedInquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState("")
  const formLoadedAtRef = useRef(Date.now())
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    startDate: initialRentalDays ? addDays(new Date(), 0) : "",
    endDate: initialRentalDays ? addDays(new Date(), initialRentalDays) : "",
    location: "",
    message: pricingNote || "",
    _website: "",
  })
  const [hasDriversLicense, setHasDriversLicense] = useState(false)
  const [hasInsurance, setHasInsurance] = useState(false)
  const [travelType, setTravelType] = useState<"" | "domestic" | "international">("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  useEffect(() => {
    formLoadedAtRef.current = Date.now()
  }, [])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required"
    } else if (!validatePhoneNumber(formData.phone)) {
      newErrors.phone = "Enter a valid phone number"
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address"
    }

    if (itemCategory === "car" && !travelType) {
      newErrors.travelType = "Please select Domestic or International"
    }

    const dateValidation = validateDateRange(formData.startDate, formData.endDate)
    if (!dateValidation.valid && dateValidation.error) {
      newErrors.dates = dateValidation.error
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/request-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          startDate: formData.startDate,
          endDate: formData.endDate,
          location: formData.location,
          message: formData.message,
          pricingNote,
          selectedRentalDays: initialRentalDays || null,
          itemTitle,
          itemCategory,
          ...(itemCategory === "car" && {
            hasDriversLicense,
            hasInsurance,
            travelType,
          }),
          source: "embedded_form",
          turnstileToken,
          _website: formData._website,
          _formLoadedAt: formLoadedAtRef.current,
        }),
      })

      if (response.ok) {
        setIsSuccess(true)
      } else {
        const data = await response.json()
        setErrors({ submit: data.error || "Failed to submit request" })
      }
    } catch (error) {
      console.error("Error submitting request:", error)
      setErrors({ submit: "Network error. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    if (field === "phone") {
      value = formatPhoneNumber(value)
    }
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
    if (field === "startDate" || field === "endDate") {
      if (errors.dates) {
        setErrors((prev) => ({ ...prev, dates: "" }))
      }
    }
  }

  const getLocationLabel = () => {
    if (itemCategory === "yacht") return "Departure Marina / Itinerary"
    if (itemCategory === "villa") return "Preferred Location"
    return "Delivery / Pickup Location"
  }

  if (isSuccess) {
    return (
      <div className="bg-charcoal/50 rounded-2xl p-8 border border-[#ECAC36]/20">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mb-4 animate-scale-in" />
          <h3 className="text-xl font-bold text-white mb-2">Request Submitted!</h3>
          <p className="text-gray-400">
            We'll contact you shortly about the {itemTitle}.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-charcoal/50 rounded-2xl p-6 border border-[#ECAC36]/20">
      <h3 className="text-xl font-heading font-bold text-white mb-2 flex items-center">
        <span className="w-1 h-6 bg-[#ECAC36] rounded-full mr-3"></span>
        Request Information
      </h3>
      <p className="text-gray-400 text-sm mb-6">
        Interested in the {itemTitle}? Fill out the form below and we'll respond within 1 hour.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={`bg-black/50 border-[#ECAC36]/30 text-white focus:border-[#ECAC36] min-h-[48px] ${
                errors.name ? "border-red-500" : ""
              }`}
              placeholder="John Doe"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className={`bg-black/50 border-[#ECAC36]/30 text-white focus:border-[#ECAC36] min-h-[48px] ${
                errors.phone ? "border-red-500" : ""
              }`}
              placeholder="(305) 555-1234"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className={`bg-black/50 border-[#ECAC36]/30 text-white focus:border-[#ECAC36] min-h-[48px] ${
              errors.email ? "border-red-500" : ""
            }`}
            placeholder="john@example.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        {itemCategory === "car" && (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="driversLicense"
                checked={hasDriversLicense}
                onChange={(e) => setHasDriversLicense(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-[#ECAC36]/50 bg-black/50 accent-[#ECAC36] cursor-pointer flex-shrink-0"
              />
              <label htmlFor="driversLicense" className="text-sm text-gray-300 cursor-pointer">
                Do you have a valid driver's license?
              </label>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="insurance"
                checked={hasInsurance}
                onChange={(e) => setHasInsurance(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-[#ECAC36]/50 bg-black/50 accent-[#ECAC36] cursor-pointer flex-shrink-0"
              />
              <div>
                <label htmlFor="insurance" className="text-sm text-gray-300 cursor-pointer">
                  Auto Insurance: Do you have comprehensive/full rental car coverage?
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  If you don't have this, we will explain how to get it for the duration of your rental.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Are you: <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="travelType"
                    value="domestic"
                    checked={travelType === "domestic"}
                    onChange={() => {
                      setTravelType("domestic")
                      if (errors.travelType) setErrors((prev) => ({ ...prev, travelType: "" }))
                    }}
                    className="h-4 w-4 accent-[#ECAC36]"
                  />
                  <span className="text-sm text-gray-300">Domestic</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="travelType"
                    value="international"
                    checked={travelType === "international"}
                    onChange={() => {
                      setTravelType("international")
                      if (errors.travelType) setErrors((prev) => ({ ...prev, travelType: "" }))
                    }}
                    className="h-4 w-4 accent-[#ECAC36]"
                  />
                  <span className="text-sm text-gray-300">International</span>
                </label>
              </div>
              {errors.travelType && <p className="text-red-500 text-xs mt-1">{errors.travelType}</p>}
            </div>
          </div>
        )}

        <div className="bg-black/30 rounded-xl p-4 border border-[#ECAC36]/10">
          {pricingNote && (
            <div className="mb-4 rounded-lg border border-[#ECAC36]/25 bg-[#ECAC36]/10 p-3 text-sm text-gray-200">
              <span className="font-semibold text-[#ECAC36]">Selected pricing:</span> {pricingNote}
            </div>
          )}
          <DateRangePicker
            category={itemCategory}
            startDate={formData.startDate}
            endDate={formData.endDate}
            onStartDateChange={(date) => handleInputChange("startDate", date)}
            onEndDateChange={(date) => handleInputChange("endDate", date)}
            error={errors.dates}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {getLocationLabel()} <span className="text-gray-500">(optional)</span>
          </label>
          <Input
            type="text"
            value={formData.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            className="bg-black/50 border-[#ECAC36]/30 text-white focus:border-[#ECAC36] min-h-[48px]"
            placeholder={itemCategory === "yacht" ? "e.g., Miami Beach Marina" : "e.g., Miami Beach"}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Message <span className="text-gray-500">(optional)</span>
          </label>
          <Textarea
            value={formData.message}
            onChange={(e) => handleInputChange("message", e.target.value)}
            className="bg-black/50 border-[#ECAC36]/30 text-white focus:border-[#ECAC36] min-h-[100px]"
            placeholder="Any special requests or questions..."
            rows={3}
          />
        </div>

        <input
          type="text"
          name="_website"
          value={formData._website}
          onChange={(e) => handleInputChange("_website", e.target.value)}
          className="absolute -left-[9999px] opacity-0 pointer-events-none"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        <div className="flex justify-center">
          <Turnstile
            onVerify={setTurnstileToken}
            onError={() => setErrors({ captcha: "Verification failed. Please refresh." })}
            onExpire={() => setTurnstileToken("")}
            theme="dark"
            size="normal"
          />
        </div>
        {errors.captcha && <p className="text-red-500 text-xs text-center">{errors.captcha}</p>}

        {errors.submit && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            <p className="text-red-400 text-sm text-center">{errors.submit}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting || !turnstileToken}
          className="w-full bg-gradient-to-r from-[#ECAC36] to-[#e6c766] hover:from-[#e6c766] hover:to-[#ECAC36] text-black font-semibold min-h-[52px] text-base disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="mr-2 h-5 w-5" />
              Send Inquiry
            </>
          )}
        </Button>

        <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1">
          <ShieldCheck className="h-3 w-3" />
          Protected by Cloudflare Turnstile
        </p>
      </form>
    </div>
  )
}

"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Loader2, CheckCircle2, Info, ShieldCheck } from "lucide-react"
import { formatPhoneNumber, validatePhoneNumber } from "@/lib/phone-utils"
import { Turnstile } from "@/components/turnstile"

interface RequestInfoDrawerProps {
  children: React.ReactNode
  itemTitle?: string
  itemCategory?: string
  prefilledMessage?: string
}

export function RequestInfoDrawer({ children, itemTitle, itemCategory, prefilledMessage }: RequestInfoDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState("")
  const formLoadedAtRef = useRef(Date.now())
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: prefilledMessage || "",
    _website: "",
  })
  const [hasDriversLicense, setHasDriversLicense] = useState(false)
  const [hasInsurance, setHasInsurance] = useState(false)
  const [travelType, setTravelType] = useState<"" | "domestic" | "international">("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isOpen) {
      formLoadedAtRef.current = Date.now()
      if (prefilledMessage !== undefined) {
        setFormData((prev) => ({ ...prev, message: prefilledMessage }))
      }
    }
  }, [isOpen, prefilledMessage])

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
      newErrors.email = "Invalid email format"
    }

    if (itemCategory === "car" && !travelType) {
      newErrors.travelType = "Please select Domestic or International"
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
          message: formData.message,
          itemTitle,
          itemCategory,
          ...(itemCategory === "car" && {
            hasDriversLicense,
            hasInsurance,
            travelType,
          }),
          turnstileToken,
          _website: formData._website,
          _formLoadedAt: formLoadedAtRef.current,
        }),
      })

      if (response.ok) {
        setIsSuccess(true)
        setTimeout(() => {
          setIsOpen(false)
          setIsSuccess(false)
          setFormData({
            name: "",
            phone: "",
            email: "",
            message: "",
            _website: "",
          })
          setHasDriversLicense(false)
          setHasInsurance(false)
          setTravelType("")
          setTurnstileToken("")
        }, 2000)
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
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <div onClick={() => setIsOpen(true)} className="cursor-pointer">
        {children}
      </div>

      <SheetContent side="right" className="bg-black/95 border-l border-[#ECAC36]/30 backdrop-blur-md overflow-y-auto">
        <SheetHeader className="mb-8">
          <SheetTitle className="text-2xl font-heading font-black text-white flex items-center gap-2">
            <Info className="h-6 w-6 text-[#ECAC36]" />
            Request Information
          </SheetTitle>
          <SheetDescription className="text-gray-400">
            {itemTitle 
              ? `Get details about the ${itemTitle}` 
              : "We'll get back to you within 1 hour"}
          </SheetDescription>
        </SheetHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4 animate-scale-in" />
            <h3 className="text-xl font-bold text-white mb-2">Request Submitted!</h3>
            <p className="text-gray-400">
              We'll contact you shortly with more information.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Full Name <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`cut-corner bg-black/50 border-[#ECAC36]/30 text-white focus:border-[#ECAC36] min-h-[48px] ${
                  errors.name ? "border-red-500" : ""
                }`}
                placeholder="John Doe"
              />
              {errors.name && <p className="text-red-500 text-xs mt-2">{errors.name}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={`cut-corner bg-black/50 border-[#ECAC36]/30 text-white focus:border-[#ECAC36] min-h-[48px] ${
                  errors.phone ? "border-red-500" : ""
                }`}
                placeholder="(305) 555-1234"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-2">{errors.phone}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Email Address <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`cut-corner bg-black/50 border-[#ECAC36]/30 text-white focus:border-[#ECAC36] min-h-[48px] ${
                  errors.email ? "border-red-500" : ""
                }`}
                placeholder="john@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-2">{errors.email}</p>}
            </div>

            {/* Car Rental Qualification Fields */}
            {itemCategory === "car" && (
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="driversLicenseDrawer"
                    checked={hasDriversLicense}
                    onChange={(e) => setHasDriversLicense(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-[#ECAC36]/50 bg-black/50 accent-[#ECAC36] cursor-pointer flex-shrink-0"
                  />
                  <label htmlFor="driversLicenseDrawer" className="text-sm text-gray-300 cursor-pointer">
                    Do you have a valid driver's license?
                  </label>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="insuranceDrawer"
                    checked={hasInsurance}
                    onChange={(e) => setHasInsurance(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-[#ECAC36]/50 bg-black/50 accent-[#ECAC36] cursor-pointer flex-shrink-0"
                  />
                  <div>
                    <label htmlFor="insuranceDrawer" className="text-sm text-gray-300 cursor-pointer">
                      Auto Insurance: Do you have comprehensive/full rental car coverage?
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      If you don't have this, we will explain how to get it for the duration of your rental.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Are you: <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="travelTypeDrawer"
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
                        name="travelTypeDrawer"
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
                  {errors.travelType && <p className="text-red-500 text-xs mt-2">{errors.travelType}</p>}
                </div>
              </div>
            )}

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Message <span className="text-gray-500">(Optional)</span>
              </label>
              <Textarea
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                className="cut-corner bg-black/50 border-[#ECAC36]/30 text-white focus:border-[#ECAC36] min-h-[100px]"
                placeholder="Tell us what you're looking for..."
                rows={4}
              />
            </div>

            {/* Honeypot  -  hidden from real users, catches bots */}
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

            {/* Turnstile CAPTCHA */}
            <div className="flex justify-center">
              <Turnstile
                onVerify={setTurnstileToken}
                onError={() => setErrors((prev) => ({ ...prev, captcha: "Verification failed. Please refresh." }))}
                onExpire={() => setTurnstileToken("")}
                theme="dark"
                size="normal"
              />
            </div>
            {errors.captcha && <p className="text-red-500 text-xs text-center">{errors.captcha}</p>}

            {/* Submit error */}
            {errors.submit && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-400 text-sm text-center">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isSubmitting || !turnstileToken}
                className="w-full cut-corner bg-gradient-to-r from-[#ECAC36] to-[#e6c766] hover:from-[#e6c766] hover:to-[#ECAC36] text-black font-semibold min-h-[48px] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Request"
                )}
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1 pt-2">
              <ShieldCheck className="h-3 w-3" />
              Protected by Cloudflare Turnstile
            </p>
          </form>
        )}
      </SheetContent>
    </Sheet>
  )
}

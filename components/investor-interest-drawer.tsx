"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { CheckCircle, Loader2, Download } from "lucide-react"
import { analytics } from "@/lib/analytics" // Import analytics utility

interface InvestorInterestDrawerProps {
  children: React.ReactNode
}

export default function InvestorInterestDrawer({ children }: InvestorInterestDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [deckDownloadUrl, setDeckDownloadUrl] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    interests: [] as string[],
    aumRange: "",
    message: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const interestOptions = [
    { id: "cars", label: "Luxury & Exotic Cars" },
    { id: "yachts", label: "Yachts & Boats" },
    { id: "villas", label: "Villas & Real Estate" },
    { id: "fund", label: "Luxx Investment Fund" },
    { id: "revenue-share", label: "Revenue Share Programs" },
  ]

  const aumOptions = [
    "Under $1M",
    "$1M - $5M",
    "$5M - $10M",
    "$10M - $25M",
    "$25M - $50M",
    "$50M+",
    "Prefer not to disclose",
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.phone.trim()) newErrors.phone = "Phone is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format"
    if (formData.interests.length === 0) newErrors.interests = "Please select at least one interest"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/buy-sell/investor-interest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          // Add UTM parameters if available
          utmSource: new URLSearchParams(window.location.search).get("utm_source"),
          utmMedium: new URLSearchParams(window.location.search).get("utm_medium"),
          utmCampaign: new URLSearchParams(window.location.search).get("utm_campaign"),
        }),
      })

      if (response.ok) {
        const result = await response.json()

        analytics.trackInvestorInterestSubmitted(formData.interests, formData.aumRange)

        setDeckDownloadUrl(result.deckDownloadUrl || "")
        setIsSuccess(true)
        // Reset form after 5 seconds
        setTimeout(() => {
          setIsOpen(false)
          setIsSuccess(false)
          setDeckDownloadUrl("")
          setFormData({
            name: "",
            phone: "",
            email: "",
            company: "",
            interests: [],
            aumRange: "",
            message: "",
          })
        }, 5000)
      } else {
        throw new Error("Failed to submit investor interest")
      }
    } catch (error) {
      console.error("Error submitting investor interest:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleInterestChange = (interest: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      interests: checked ? [...prev.interests, interest] : prev.interests.filter((i) => i !== interest),
    }))
    if (errors.interests) {
      setErrors((prev) => ({ ...prev, interests: "" }))
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="bg-[#1a1a1a] border-[#333] text-white w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-white text-xl">Request Investor Deck</SheetTitle>
          <p className="text-gray-400 text-sm">Learn about investment opportunities with Luxx</p>
        </SheetHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle className="h-16 w-16 text-green-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Interest Submitted!</h3>
            <p className="text-gray-400 mb-6">
              Thank you for your interest. Our investment team will contact you within 24 hours.
            </p>
            {deckDownloadUrl && (
              <Button
                className="cut-corner bg-gradient-to-r from-[#ECAC36] to-[#e6c766] hover:from-[#e6c766] hover:to-[#ECAC36] text-black font-semibold mb-4"
                onClick={() => window.open(deckDownloadUrl, "_blank")}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Investor Deck
              </Button>
            )}
            <p className="text-sm text-gray-500">This window will close automatically...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Contact Information</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Full Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="bg-[#222] border-[#333] text-white cut-corner"
                    placeholder="Your full name"
                  />
                  {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <Label className="text-gray-300">Phone Number *</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="bg-[#222] border-[#333] text-white cut-corner"
                    placeholder="(555) 123-4567"
                  />
                  {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <Label className="text-gray-300">Email Address *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="bg-[#222] border-[#333] text-white cut-corner"
                  placeholder="your@email.com"
                />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label className="text-gray-300">Company/Organization</Label>
                <Input
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  className="bg-[#222] border-[#333] text-white cut-corner"
                  placeholder="Your company name (optional)"
                />
              </div>
            </div>

            {/* Investment Interests */}
            <div>
              <Label className="text-gray-300">Investment Interests *</Label>
              <div className="grid grid-cols-1 gap-3 mt-2">
                {interestOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.id}
                      checked={formData.interests.includes(option.id)}
                      onCheckedChange={(checked) => handleInterestChange(option.id, checked as boolean)}
                      className="border-[#333] data-[state=checked]:bg-[#ECAC36] data-[state=checked]:border-[#ECAC36]"
                    />
                    <Label htmlFor={option.id} className="text-sm text-gray-300 cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
              {errors.interests && <p className="text-red-400 text-sm mt-1">{errors.interests}</p>}
            </div>

            {/* AUM Range */}
            <div>
              <Label className="text-gray-300">Assets Under Management (Optional)</Label>
              <Select value={formData.aumRange} onValueChange={(value) => handleInputChange("aumRange", value)}>
                <SelectTrigger className="bg-[#222] border-[#333] text-white cut-corner">
                  <SelectValue placeholder="Select AUM range" />
                </SelectTrigger>
                <SelectContent className="bg-[#222] border-[#333]">
                  {aumOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Message */}
            <div>
              <Label className="text-gray-300">Message</Label>
              <Textarea
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                className="bg-[#222] border-[#333] text-white cut-corner"
                placeholder="Tell us about your investment goals and interests..."
                rows={3}
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full cut-corner bg-gradient-to-r from-[#ECAC36] to-[#e6c766] hover:from-[#e6c766] hover:to-[#ECAC36] text-black font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Request Investor Deck"
              )}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              By submitting, you agree to be contacted about investment opportunities.
            </p>
          </form>
        )}
      </SheetContent>
    </Sheet>
  )
}

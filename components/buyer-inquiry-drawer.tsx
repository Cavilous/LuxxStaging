"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { CheckCircle, Loader2, Phone, Mail, User } from "lucide-react"
import { analytics } from "@/lib/analytics"

interface BuyerInquiryDrawerProps {
  assetId: string
  assetTitle: string
  children: React.ReactNode
}

export default function BuyerInquiryDrawer({ assetId, assetTitle, children }: BuyerInquiryDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    purchaseType: "",
    message: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open) {
      analytics.trackInquiryStarted(assetId, assetTitle)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.phone.trim()) newErrors.phone = "Phone is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format"
    if (!formData.purchaseType) newErrors.purchaseType = "Purchase type is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/buy-sell/buyer-inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assetId,
          assetTitle,
          ...formData,
        }),
      })

      if (response.ok) {
        analytics.trackInquirySubmitted(assetId, assetTitle, formData.purchaseType)

        setIsSuccess(true)
        // Reset form after 3 seconds
        setTimeout(() => {
          setIsOpen(false)
          setIsSuccess(false)
          setFormData({
            name: "",
            phone: "",
            email: "",
            purchaseType: "",
            message: "",
          })
        }, 3000)
      } else {
        throw new Error("Failed to submit inquiry")
      }
    } catch (error) {
      console.error("Error submitting inquiry:", error)
      // Handle error (could show toast notification)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="bg-[#1a1a1a] border-[#333] text-white w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-white text-xl">Inquire About Purchase</SheetTitle>
          <p className="text-gray-400 text-sm">{assetTitle}</p>
        </SheetHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle className="h-16 w-16 text-green-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Inquiry Submitted!</h3>
            <p className="text-gray-400 mb-4">
              Thank you for your interest. Our team will contact you within 24 hours.
            </p>
            <p className="text-sm text-gray-500">This window will close automatically...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="space-y-4">
              <div>
                <Label className="text-gray-300 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name *
                </Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="bg-[#222] border-[#333] text-white cut-corner"
                  placeholder="Your full name"
                />
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label className="text-gray-300 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number *
                </Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="bg-[#222] border-[#333] text-white cut-corner"
                  placeholder="(555) 123-4567"
                />
                {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <Label className="text-gray-300 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address *
                </Label>
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
                <Label className="text-gray-300">Purchase Type *</Label>
                <Select
                  value={formData.purchaseType}
                  onValueChange={(value) => handleInputChange("purchaseType", value)}
                >
                  <SelectTrigger className="bg-[#222] border-[#333] text-white cut-corner">
                    <SelectValue placeholder="Select purchase type" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#222] border-[#333]">
                    <SelectItem value="direct">Direct Purchase</SelectItem>
                    <SelectItem value="managed">Managed Asset Program</SelectItem>
                    <SelectItem value="both">Interested in Both Options</SelectItem>
                  </SelectContent>
                </Select>
                {errors.purchaseType && <p className="text-red-400 text-sm mt-1">{errors.purchaseType}</p>}
              </div>

              <div>
                <Label className="text-gray-300">Message (Optional)</Label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  className="bg-[#222] border-[#333] text-white cut-corner"
                  placeholder="Any specific questions or requirements..."
                  rows={3}
                />
              </div>
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
                "Submit Inquiry"
              )}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              By submitting, you agree to be contacted about this asset.
            </p>
          </form>
        )}
      </SheetContent>
    </Sheet>
  )
}

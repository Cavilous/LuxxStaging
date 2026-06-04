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
import { CheckCircle, Loader2, Upload } from "lucide-react"
import { analytics } from "@/lib/analytics" // Import analytics utility

interface SellIntakeDrawerProps {
  children: React.ReactNode
}

export default function SellIntakeDrawer({ children }: SellIntakeDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    assetCategory: "",
    brand: "",
    model: "",
    year: "",
    condition: "",
    photos: [] as string[],
    targetPrice: "",
    availableDocs: [] as string[],
    message: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const documentOptions = [
    "Title/Registration",
    "Service Records",
    "Inspection Reports",
    "Insurance Records",
    "Purchase Documentation",
    "Warranty Information",
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.phone.trim()) newErrors.phone = "Phone is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format"
    if (!formData.assetCategory) newErrors.assetCategory = "Asset category is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/buy-sell/sell-intake", {
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
        analytics.trackSellIntakeSubmitted(formData.assetCategory, formData.brand, formData.model)

        setIsSuccess(true)
        // Reset form after 3 seconds
        setTimeout(() => {
          setIsOpen(false)
          setIsSuccess(false)
          setFormData({
            name: "",
            phone: "",
            email: "",
            assetCategory: "",
            brand: "",
            model: "",
            year: "",
            condition: "",
            photos: [],
            targetPrice: "",
            availableDocs: [],
            message: "",
          })
        }, 3000)
      } else {
        throw new Error("Failed to submit sell intake")
      }
    } catch (error) {
      console.error("Error submitting sell intake:", error)
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

  const handleDocumentChange = (doc: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      availableDocs: checked ? [...prev.availableDocs, doc] : prev.availableDocs.filter((d) => d !== doc),
    }))
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="bg-[#1a1a1a] border-[#333] text-white w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-white text-xl">Get Your Asset Valued</SheetTitle>
          <p className="text-gray-400 text-sm">Tell us about your luxury asset</p>
        </SheetHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle className="h-16 w-16 text-green-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Submission Received!</h3>
            <p className="text-gray-400 mb-4">
              Thank you for your interest in selling. Our valuation team will contact you within 48 hours.
            </p>
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
            </div>

            {/* Asset Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Asset Information</h3>

              <div>
                <Label className="text-gray-300">Asset Category *</Label>
                <Select
                  value={formData.assetCategory}
                  onValueChange={(value) => handleInputChange("assetCategory", value)}
                >
                  <SelectTrigger className="bg-[#222] border-[#333] text-white cut-corner">
                    <SelectValue placeholder="Select asset type" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#222] border-[#333]">
                    <SelectItem value="car">Luxury/Exotic Car</SelectItem>
                    <SelectItem value="yacht">Yacht/Boat</SelectItem>
                    <SelectItem value="villa">Villa/Real Estate</SelectItem>
                  </SelectContent>
                </Select>
                {errors.assetCategory && <p className="text-red-400 text-sm mt-1">{errors.assetCategory}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-300">Brand/Make</Label>
                  <Input
                    value={formData.brand}
                    onChange={(e) => handleInputChange("brand", e.target.value)}
                    className="bg-[#222] border-[#333] text-white cut-corner"
                    placeholder="e.g., Ferrari"
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Model</Label>
                  <Input
                    value={formData.model}
                    onChange={(e) => handleInputChange("model", e.target.value)}
                    className="bg-[#222] border-[#333] text-white cut-corner"
                    placeholder="e.g., SF90"
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Year</Label>
                  <Input
                    type="number"
                    value={formData.year}
                    onChange={(e) => handleInputChange("year", e.target.value)}
                    className="bg-[#222] border-[#333] text-white cut-corner"
                    placeholder="2022"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Condition</Label>
                  <Select value={formData.condition} onValueChange={(value) => handleInputChange("condition", value)}>
                    <SelectTrigger className="bg-[#222] border-[#333] text-white cut-corner">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#222] border-[#333]">
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="very-good">Very Good</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-gray-300">Target Price</Label>
                  <Input
                    type="number"
                    value={formData.targetPrice}
                    onChange={(e) => handleInputChange("targetPrice", e.target.value)}
                    className="bg-[#222] border-[#333] text-white cut-corner"
                    placeholder="Expected value"
                  />
                </div>
              </div>
            </div>

            {/* Photos */}
            <div>
              <Label className="text-gray-300">Photos</Label>
              <div className="border-2 border-dashed border-[#333] cut-corner p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400 text-sm mb-2">Upload photos of your asset</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="cut-corner border-[#333] text-gray-300 bg-transparent"
                >
                  Choose Files
                </Button>
              </div>
            </div>

            {/* Available Documents */}
            <div>
              <Label className="text-gray-300">Available Documents</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                {documentOptions.map((doc) => (
                  <div key={doc} className="flex items-center space-x-2">
                    <Checkbox
                      id={doc}
                      checked={formData.availableDocs.includes(doc)}
                      onCheckedChange={(checked) => handleDocumentChange(doc, checked as boolean)}
                      className="border-[#333] data-[state=checked]:bg-[#ECAC36] data-[state=checked]:border-[#ECAC36]"
                    />
                    <Label htmlFor={doc} className="text-sm text-gray-300 cursor-pointer">
                      {doc}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <Label className="text-gray-300">Additional Information</Label>
              <Textarea
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                className="bg-[#222] border-[#333] text-white cut-corner"
                placeholder="Any additional details about your asset..."
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
                "Submit for Valuation"
              )}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              By submitting, you agree to be contacted about your asset valuation.
            </p>
          </form>
        )}
      </SheetContent>
    </Sheet>
  )
}

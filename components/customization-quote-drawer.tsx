"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Upload, X, CheckCircle } from "lucide-react"
import { analytics } from "@/lib/analytics"

interface CustomizationQuoteDrawerProps {
  isOpen: boolean
  onClose: () => void
  preselectedService?: string
}

export function CustomizationQuoteDrawer({ isOpen, onClose, preselectedService }: CustomizationQuoteDrawerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    // Contact
    name: "",
    mobile: "",
    email: "",
    // Vehicle
    year: "",
    make: "",
    model: "",
    // Services
    services: {
      ppf: { selected: preselectedService === "ppf", areas: [] as string[] },
      wrap: { selected: preselectedService === "wrap", finish: "", color: "" },
      tint: { selected: preselectedService === "tint", percent: "" },
      wheels: preselectedService === "wheels",
      aero: preselectedService === "aero",
      interior: preselectedService === "interior",
      ceramic: false,
    },
    // Timeline
    desiredDateWindow: "",
    // Additional
    notes: "",
  })
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([])

  const ppfAreas = [
    "Full Vehicle",
    "Front End",
    "Hood",
    "Bumpers",
    "Mirrors",
    "Door Handles",
    "Rocker Panels",
    "Rear Bumper",
    "Headlights",
    "Custom Areas",
  ]

  const wrapFinishes = ["Gloss", "Matte", "Satin", "Carbon Fiber", "Chrome", "Metallic", "Pearl"]

  const tintPercentages = ["70%", "50%", "35%", "20%", "15%", "5%"]

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleServiceChange = (service: string, field: string, value: any) => {
    setFormData((prev) => {
      const currentService = prev.services[service as keyof typeof prev.services]
      
      return {
        ...prev,
        services: {
          ...prev.services,
          [service]:
            typeof currentService === "object" && currentService !== null
              ? { ...(currentService as Record<string, any>), [field]: value }
              : value,
        },
      }
    })
  }

  const handlePPFAreaToggle = (area: string) => {
    const currentAreas = formData.services.ppf.areas
    const newAreas = currentAreas.includes(area) ? currentAreas.filter((a) => a !== area) : [...currentAreas, area]
    handleServiceChange("ppf", "areas", newAreas)
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedPhotos((prev) => [...prev, ...files].slice(0, 5)) // Max 5 photos
  }

  const removePhoto = (index: number) => {
    setUploadedPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const formDataToSend = new FormData()

      // Add form fields
      formDataToSend.append(
        "contact",
        JSON.stringify({
          name: formData.name,
          mobile: formData.mobile,
          email: formData.email,
        }),
      )

      formDataToSend.append(
        "vehicle",
        JSON.stringify({
          year: formData.year,
          make: formData.make,
          model: formData.model,
        }),
      )

      formDataToSend.append("services", JSON.stringify(formData.services))
      formDataToSend.append("desiredDateWindow", formData.desiredDateWindow)
      formDataToSend.append("notes", formData.notes)

      // Add photos
      uploadedPhotos.forEach((photo, index) => {
        formDataToSend.append(`photo_${index}`, photo)
      })

      const response = await fetch("/api/repair/custom-quote", {
        method: "POST",
        body: formDataToSend,
      })

      if (response.ok) {
        const selectedServices: string[] = []
        Object.entries(formData.services).forEach(([service, data]) => {
          if (typeof data === "boolean" && data) {
            selectedServices.push(service)
          } else if (typeof data === "object" && (data as any).selected) {
            selectedServices.push(service)
          }
        })

        analytics.trackCustomQuoteSubmitted(formData.make, formData.model, selectedServices)
        setIsSubmitted(true)
      } else {
        throw new Error("Submission failed")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("There was an error submitting your quote request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = () => {
    const hasContact = formData.name && formData.mobile && formData.email
    const hasVehicle = formData.year && formData.make && formData.model
    const hasServices = Object.values(formData.services).some((service) =>
      typeof service === "boolean" ? service : service.selected,
    )
    return hasContact && hasVehicle && hasServices
  }

  if (isSubmitted) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right" className="w-full sm:max-w-2xl bg-black border-l border-gray-800">
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-[#ECAC36] to-[#e6c766] cut-corner mx-auto flex items-center justify-center mb-6">
              <CheckCircle className="h-10 w-10 text-black" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Quote Request Submitted</h2>
            <p className="text-gray-300 mb-4 max-w-md">
              Your customization quote request has been received. Our specialists will review your requirements and
              contact you within 24 hours with a detailed estimate.
            </p>
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4 max-w-md mx-auto mb-6">
              <p className="text-xs text-gray-400 text-center leading-relaxed">
                <strong className="text-gray-300">Please Note:</strong> Estimates are subject to change based on final vehicle inspection and specific customization requirements. Final pricing will be confirmed before any work begins.
              </p>
            </div>
            <Button
              onClick={onClose}
              className="cut-corner bg-gradient-to-r from-[#ECAC36] to-[#e6c766] text-black font-semibold"
            >
              Close
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-2xl bg-black border-l border-gray-800 overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold text-white">Customization Quote Request</SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-[#ECAC36]">Contact Information</h3>

            <div>
              <Label htmlFor="name" className="text-white">
                Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="bg-gray-900 border-gray-700 text-white cut-corner"
                placeholder="Your name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mobile" className="text-white">
                  Mobile *
                </Label>
                <Input
                  id="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => handleInputChange("mobile", e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white cut-corner"
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-white">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white cut-corner"
                  placeholder="your@email.com"
                />
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-[#ECAC36]">Vehicle Information</h3>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="year" className="text-white">
                  Year *
                </Label>
                <Input
                  id="year"
                  value={formData.year}
                  onChange={(e) => handleInputChange("year", e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white cut-corner"
                  placeholder="2024"
                />
              </div>
              <div>
                <Label htmlFor="make" className="text-white">
                  Make *
                </Label>
                <Input
                  id="make"
                  value={formData.make}
                  onChange={(e) => handleInputChange("make", e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white cut-corner"
                  placeholder="Ferrari"
                />
              </div>
              <div>
                <Label htmlFor="model" className="text-white">
                  Model *
                </Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => handleInputChange("model", e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white cut-corner"
                  placeholder="SF90"
                />
              </div>
            </div>
          </div>

          {/* Service Selection */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-[#ECAC36]">Services Requested *</h3>

            {/* PPF */}
            <div className="bg-gray-900/50 p-4 cut-corner">
              <div className="flex items-center space-x-2 mb-3">
                <Checkbox
                  id="ppf"
                  checked={formData.services.ppf.selected}
                  onCheckedChange={(checked) => handleServiceChange("ppf", "selected", checked)}
                  className="border-gray-600"
                />
                <Label htmlFor="ppf" className="text-white font-semibold">
                  Paint Protection Film (PPF)
                </Label>
              </div>

              {formData.services.ppf.selected && (
                <div className="ml-6 space-y-2">
                  <Label className="text-sm text-gray-300">Areas to protect:</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {ppfAreas.map((area) => (
                      <div key={area} className="flex items-center space-x-2">
                        <Checkbox
                          id={`ppf-${area}`}
                          checked={formData.services.ppf.areas.includes(area)}
                          onCheckedChange={() => handlePPFAreaToggle(area)}
                          className="border-gray-600"
                        />
                        <Label htmlFor={`ppf-${area}`} className="text-xs text-gray-300">
                          {area}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Wrap */}
            <div className="bg-gray-900/50 p-4 cut-corner">
              <div className="flex items-center space-x-2 mb-3">
                <Checkbox
                  id="wrap"
                  checked={formData.services.wrap.selected}
                  onCheckedChange={(checked) => handleServiceChange("wrap", "selected", checked)}
                  className="border-gray-600"
                />
                <Label htmlFor="wrap" className="text-white font-semibold">
                  Vehicle Wrap
                </Label>
              </div>

              {formData.services.wrap.selected && (
                <div className="ml-6 grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-300">Finish:</Label>
                    <div className="grid grid-cols-2 gap-1 mt-1">
                      {wrapFinishes.map((finish) => (
                        <div key={finish} className="flex items-center space-x-1">
                          <Checkbox
                            id={`wrap-${finish}`}
                            checked={formData.services.wrap.finish === finish}
                            onCheckedChange={(checked) => checked && handleServiceChange("wrap", "finish", finish)}
                            className="border-gray-600"
                          />
                          <Label htmlFor={`wrap-${finish}`} className="text-xs text-gray-300">
                            {finish}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="wrap-color" className="text-sm text-gray-300">
                      Color/Pattern:
                    </Label>
                    <Input
                      id="wrap-color"
                      value={formData.services.wrap.color}
                      onChange={(e) => handleServiceChange("wrap", "color", e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white text-sm mt-1"
                      placeholder="Specify color"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Tint */}
            <div className="bg-gray-900/50 p-4 cut-corner">
              <div className="flex items-center space-x-2 mb-3">
                <Checkbox
                  id="tint"
                  checked={formData.services.tint.selected}
                  onCheckedChange={(checked) => handleServiceChange("tint", "selected", checked)}
                  className="border-gray-600"
                />
                <Label htmlFor="tint" className="text-white font-semibold">
                  Window Tint
                </Label>
              </div>

              {formData.services.tint.selected && (
                <div className="ml-6">
                  <Label className="text-sm text-gray-300">Tint percentage:</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {tintPercentages.map((percent) => (
                      <div key={percent} className="flex items-center space-x-1">
                        <Checkbox
                          id={`tint-${percent}`}
                          checked={formData.services.tint.percent === percent}
                          onCheckedChange={(checked) => checked && handleServiceChange("tint", "percent", percent)}
                          className="border-gray-600"
                        />
                        <Label htmlFor={`tint-${percent}`} className="text-xs text-gray-300">
                          {percent}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Other Services */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: "wheels", label: "Custom Wheels" },
                { key: "aero", label: "Aerodynamic Kit" },
                { key: "interior", label: "Interior Upgrade" },
                { key: "ceramic", label: "Ceramic Coating" },
              ].map((service) => (
                <div key={service.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={service.key}
                    checked={formData.services[service.key as keyof typeof formData.services] as boolean}
                    onCheckedChange={(checked) => handleServiceChange(service.key, "", checked)}
                    className="border-gray-600"
                  />
                  <Label htmlFor={service.key} className="text-white">
                    {service.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div>
            <Label htmlFor="timeline" className="text-white">
              Desired Completion Date
            </Label>
            <Input
              id="timeline"
              type="date"
              value={formData.desiredDateWindow}
              onChange={(e) => handleInputChange("desiredDateWindow", e.target.value)}
              className="bg-gray-900 border-gray-700 text-white cut-corner"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* Photos */}
          <div>
            <Label className="text-white">Vehicle Photos (Optional)</Label>
            <div className="mt-2">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-600 cut-corner cursor-pointer hover:border-[#ECAC36] transition-colors"
              >
                <div className="text-center">
                  <Upload className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                  <p className="text-sm text-gray-400">Upload photos</p>
                </div>
              </label>
            </div>

            {uploadedPhotos.length > 0 && (
              <div className="grid grid-cols-5 gap-2 mt-4">
                {uploadedPhotos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(photo) || "/placeholder.svg"}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-16 object-cover cut-corner"
                    />
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 cut-corner flex items-center justify-center"
                    >
                      <X className="h-3 w-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes" className="text-white">
              Additional Notes
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              className="bg-gray-900 border-gray-700 text-white cut-corner"
              placeholder="Any specific requirements, preferences, or questions..."
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-gray-800">
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid() || isSubmitting}
              className="w-full cut-corner bg-gradient-to-r from-[#ECAC36] to-[#e6c766] text-black font-semibold disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Request Quote"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

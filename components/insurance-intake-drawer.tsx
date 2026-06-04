"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Upload, X, CheckCircle, AlertCircle } from "lucide-react"
import { analytics } from "@/lib/analytics"

interface InsuranceIntakeDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function InsuranceIntakeDrawer({ isOpen, onClose }: InsuranceIntakeDrawerProps) {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    // Contact
    fullName: "",
    mobile: "",
    email: "",
    // Vehicle
    vin: "",
    year: "",
    make: "",
    model: "",
    trim: "",
    mileage: "",
    // Damage
    dateOfLoss: "",
    damageAreas: [] as string[],
    isDrivable: "",
    airbagDeployed: "",
    // Insurance
    carrier: "",
    claimNumber: "",
    deductible: "",
    // Logistics
    pickupLocation: "",
    needEnclosedTow: "",
    // Consent
    consentSigned: false,
  })
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([])

  const insuranceCarriers = [
    "State Farm",
    "GEICO",
    "Progressive",
    "Allstate",
    "USAA",
    "Liberty Mutual",
    "Farmers",
    "Nationwide",
    "American Family",
    "Travelers",
    "Other",
  ]

  const damageAreaOptions = [
    "Front End",
    "Rear End",
    "Driver Side",
    "Passenger Side",
    "Roof",
    "Hood",
    "Trunk",
    "Doors",
    "Windows",
    "Bumpers",
    "Lights",
    "Interior",
  ]

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleDamageAreaToggle = (area: string) => {
    const currentAreas = formData.damageAreas
    const newAreas = currentAreas.includes(area) ? currentAreas.filter((a) => a !== area) : [...currentAreas, area]
    handleInputChange("damageAreas", newAreas)
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedPhotos((prev) => [...prev, ...files].slice(0, 10)) // Max 10 photos
  }

  const removePhoto = (index: number) => {
    setUploadedPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const formDataToSend = new FormData()

      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formDataToSend.append(key, JSON.stringify(value))
        } else {
          formDataToSend.append(key, String(value))
        }
      })

      // Add photos
      uploadedPhotos.forEach((photo, index) => {
        formDataToSend.append(`photo_${index}`, photo)
      })

      const response = await fetch("/api/repair/insurance-intake", {
        method: "POST",
        body: formDataToSend,
      })

      if (response.ok) {
        analytics.trackInsuranceIntakeSubmitted(formData.make, formData.model, formData.carrier, formData.damageAreas)
        setIsSubmitted(true)
      } else {
        throw new Error("Submission failed")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("There was an error submitting your claim. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4))
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1))

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.fullName && formData.mobile && formData.email
      case 2:
        return formData.vin && formData.year && formData.make && formData.model
      case 3:
        return formData.dateOfLoss && formData.damageAreas.length > 0 && formData.isDrivable && formData.airbagDeployed
      case 4:
        return formData.carrier && formData.deductible && uploadedPhotos.length >= 5 && formData.consentSigned
      default:
        return false
    }
  }

  if (isSubmitted) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right" className="w-full sm:max-w-2xl bg-black border-l border-gray-800">
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-[#ECAC36] to-[#e6c766] cut-corner mx-auto flex items-center justify-center mb-6">
              <CheckCircle className="h-10 w-10 text-black" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Claim Submitted Successfully</h2>
            <p className="text-gray-300 mb-4 max-w-md">
              Your insurance claim has been submitted and prioritized. Our team will contact you within 2 hours to
              coordinate next steps.
            </p>
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4 max-w-md mx-auto mb-6">
              <p className="text-xs text-gray-400 text-center leading-relaxed">
                <strong className="text-gray-300">Please Note:</strong> All repair estimates and timelines are subject to insurance approval and final damage assessment. We will work directly with your insurance carrier to finalize coverage and pricing.
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
          <SheetTitle className="text-2xl font-bold text-white">Insurance Claim Intake</SheetTitle>
          <div className="flex items-center space-x-2 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-2 flex-1 cut-corner ${
                  i <= step ? "bg-gradient-to-r from-[#ECAC36] to-[#e6c766]" : "bg-gray-700"
                }`}
              />
            ))}
          </div>
        </SheetHeader>

        <div className="space-y-6">
          {/* Step 1: Contact Information */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[#ECAC36]">Contact Information</h3>

              <div>
                <Label htmlFor="fullName" className="text-white">
                  Full Name *
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white cut-corner"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <Label htmlFor="mobile" className="text-white">
                  Mobile Phone *
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
                  Email Address *
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
          )}

          {/* Step 2: Vehicle Information */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[#ECAC36]">Vehicle Information</h3>

              <div>
                <Label htmlFor="vin" className="text-white">
                  VIN *
                </Label>
                <Input
                  id="vin"
                  value={formData.vin}
                  onChange={(e) => handleInputChange("vin", e.target.value.toUpperCase())}
                  className="bg-gray-900 border-gray-700 text-white cut-corner"
                  placeholder="17-character VIN"
                  maxLength={17}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="model" className="text-white">
                    Model *
                  </Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => handleInputChange("model", e.target.value)}
                    className="bg-gray-900 border-gray-700 text-white cut-corner"
                    placeholder="SF90 Stradale"
                  />
                </div>
                <div>
                  <Label htmlFor="trim" className="text-white">
                    Trim
                  </Label>
                  <Input
                    id="trim"
                    value={formData.trim}
                    onChange={(e) => handleInputChange("trim", e.target.value)}
                    className="bg-gray-900 border-gray-700 text-white cut-corner"
                    placeholder="Base, Spider, etc."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="mileage" className="text-white">
                  Current Mileage
                </Label>
                <Input
                  id="mileage"
                  value={formData.mileage}
                  onChange={(e) => handleInputChange("mileage", e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white cut-corner"
                  placeholder="12,500"
                />
              </div>
            </div>
          )}

          {/* Step 3: Damage Information */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[#ECAC36]">Damage Information</h3>

              <div>
                <Label htmlFor="dateOfLoss" className="text-white">
                  Date of Loss *
                </Label>
                <Input
                  id="dateOfLoss"
                  type="date"
                  value={formData.dateOfLoss}
                  onChange={(e) => handleInputChange("dateOfLoss", e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white cut-corner"
                />
              </div>

              <div>
                <Label className="text-white">Damage Areas * (Select all that apply)</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {damageAreaOptions.map((area) => (
                    <div key={area} className="flex items-center space-x-2">
                      <Checkbox
                        id={area}
                        checked={formData.damageAreas.includes(area)}
                        onCheckedChange={() => handleDamageAreaToggle(area)}
                        className="border-gray-600"
                      />
                      <Label htmlFor={area} className="text-sm text-gray-300">
                        {area}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Is vehicle drivable? *</Label>
                  <Select value={formData.isDrivable} onValueChange={(value) => handleInputChange("isDrivable", value)}>
                    <SelectTrigger className="bg-gray-900 border-gray-700 text-white cut-corner">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white">Airbag deployed? *</Label>
                  <Select
                    value={formData.airbagDeployed}
                    onValueChange={(value) => handleInputChange("airbagDeployed", value)}
                  >
                    <SelectTrigger className="bg-gray-900 border-gray-700 text-white cut-corner">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Insurance & Photos */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[#ECAC36]">Insurance & Documentation</h3>

              <div>
                <Label className="text-white">Insurance Carrier *</Label>
                <Select value={formData.carrier} onValueChange={(value) => handleInputChange("carrier", value)}>
                  <SelectTrigger className="bg-gray-900 border-gray-700 text-white cut-corner">
                    <SelectValue placeholder="Select your carrier..." />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    {insuranceCarriers.map((carrier) => (
                      <SelectItem key={carrier} value={carrier}>
                        {carrier}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="claimNumber" className="text-white">
                    Claim Number
                  </Label>
                  <Input
                    id="claimNumber"
                    value={formData.claimNumber}
                    onChange={(e) => handleInputChange("claimNumber", e.target.value)}
                    className="bg-gray-900 border-gray-700 text-white cut-corner"
                    placeholder="Optional if not opened yet"
                  />
                </div>
                <div>
                  <Label htmlFor="deductible" className="text-white">
                    Deductible Amount *
                  </Label>
                  <Input
                    id="deductible"
                    value={formData.deductible}
                    onChange={(e) => handleInputChange("deductible", e.target.value)}
                    className="bg-gray-900 border-gray-700 text-white cut-corner"
                    placeholder="$1,000"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="pickupLocation" className="text-white">
                  Pickup Location
                </Label>
                <Input
                  id="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={(e) => handleInputChange("pickupLocation", e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white cut-corner"
                  placeholder="Address where vehicle is located"
                />
              </div>

              <div>
                <Label className="text-white">Need enclosed tow?</Label>
                <Select
                  value={formData.needEnclosedTow}
                  onValueChange={(value) => handleInputChange("needEnclosedTow", value)}
                >
                  <SelectTrigger className="bg-gray-900 border-gray-700 text-white cut-corner">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white">Photos * (Minimum 5 required)</Label>
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
                    className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 cut-corner cursor-pointer hover:border-[#ECAC36] transition-colors"
                  >
                    <div className="text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400">Click to upload photos</p>
                      <p className="text-xs text-gray-500">Front, rear, sides, close-ups of damage</p>
                    </div>
                  </label>
                </div>

                {uploadedPhotos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {uploadedPhotos.map((photo, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(photo) || "/placeholder.svg"}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-20 object-cover cut-corner"
                        />
                        <button
                          onClick={() => removePhoto(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 cut-corner flex items-center justify-center"
                        >
                          <X className="h-3 w-3 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {uploadedPhotos.length < 5 && (
                  <div className="flex items-center mt-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />
                    <span className="text-sm text-yellow-500">{5 - uploadedPhotos.length} more photos required</span>
                  </div>
                )}
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="consent"
                  checked={formData.consentSigned}
                  onCheckedChange={(checked) => handleInputChange("consentSigned", checked as boolean)}
                  className="border-gray-600 mt-1"
                />
                <Label htmlFor="consent" className="text-sm text-gray-300 leading-relaxed">
                  I authorize Luxx Miami to communicate with my insurance carrier regarding this claim and to proceed
                  with damage assessment and repair estimates. I understand that final repair authorization is subject
                  to insurance approval.
                </Label>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-800">
            {step > 1 && (
              <Button
                onClick={prevStep}
                variant="outline"
                className="cut-corner border-gray-600 text-gray-300 hover:border-[#ECAC36] hover:text-[#ECAC36] bg-transparent"
              >
                Previous
              </Button>
            )}

            <div className="ml-auto">
              {step < 4 ? (
                <Button
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className="cut-corner bg-gradient-to-r from-[#ECAC36] to-[#e6c766] text-black font-semibold disabled:opacity-50"
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!isStepValid() || isSubmitting}
                  className="cut-corner bg-gradient-to-r from-[#ECAC36] to-[#e6c766] text-black font-semibold disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit Claim"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

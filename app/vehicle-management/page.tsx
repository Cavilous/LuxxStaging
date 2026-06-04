"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  CheckCircle,
  Shield,
  Calendar,
  Wrench,
  Phone,
  Send,
  Loader2,
  DollarSign,
  Car,
  Clock,
  Sparkles,
  Users,
} from "lucide-react"
import { toast } from "sonner"

export default function VehicleManagementPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    vehicleCount: "",
    currentStorage: "",
    message: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill in all required fields")
      return
    }

    setSubmitting(true)
    
    try {
      const response = await fetch("/api/contact/vehicle-management", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          source: "vehicle-management-page",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit")
      }

      setSuccess(true)
      setFormData({ name: "", email: "", phone: "", vehicleCount: "", currentStorage: "", message: "" })
      toast.success("Your inquiry has been submitted! We'll be in touch soon.")
      
      setTimeout(() => setSuccess(false), 10000)
    } catch (error) {
      console.error("Form submission error:", error)
      toast.error("Something went wrong. Please try again or call us directly.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A]" />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#0A0A0A]" />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#ECAC36] to-transparent" />
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-black text-white mb-6 tracking-tight">
            VEHICLE MANAGEMENT
            <span className="block text-[#ECAC36]">BY LUXX MIAMI</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Let your exotic vehicle work for you. Our comprehensive management program handles everything 
            from rentals and scheduling to maintenance and detailing - generating revenue while you're not driving.
          </p>
        </div>
      </section>

      {/* What Is Vehicle Management */}
      <section className="py-16 md:py-20 px-6 border-b border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
              What Is <span className="text-[#ECAC36]">Vehicle Management</span>?
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto text-lg">
              Luxx Miami's Vehicle Management program allows exotic car owners to place their vehicles in our 
              professional rental fleet. We handle all aspects of rental operations, maintenance, and care - transforming 
              your car from a depreciating asset into a revenue-generating investment.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-[#111111] border-[#333333] cut-corner text-center">
              <CardContent className="pt-8 pb-6">
                <div className="w-16 h-16 bg-[#ECAC36]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-8 w-8 text-[#ECAC36]" />
                </div>
                <h3 className="text-white text-xl font-semibold mb-3">Passive Income</h3>
                <p className="text-gray-400">
                  Earn rental revenue while your vehicle is in our fleet. Typical owners see 60-70% of gross rental income.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#111111] border-[#333333] cut-corner text-center">
              <CardContent className="pt-8 pb-6">
                <div className="w-16 h-16 bg-[#ECAC36]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wrench className="h-8 w-8 text-[#ECAC36]" />
                </div>
                <h3 className="text-white text-xl font-semibold mb-3">Full Maintenance</h3>
                <p className="text-gray-400">
                  We handle all routine maintenance, inspections, and repairs. Your vehicle stays in pristine condition.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#111111] border-[#333333] cut-corner text-center">
              <CardContent className="pt-8 pb-6">
                <div className="w-16 h-16 bg-[#ECAC36]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-[#ECAC36]" />
                </div>
                <h3 className="text-white text-xl font-semibold mb-3">Full Insurance</h3>
                <p className="text-gray-400">
                  Comprehensive commercial insurance coverage on all rentals. Your asset is protected at all times.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-20 px-6 border-b border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
              How It <span className="text-[#ECAC36]">Works</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#ECAC36] text-black text-xl font-bold rounded-full flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="text-white font-semibold mb-2">Consultation</h3>
              <p className="text-gray-400 text-sm">
                We evaluate your vehicle and discuss your goals, usage preferences, and blackout dates.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-[#ECAC36] text-black text-xl font-bold rounded-full flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="text-white font-semibold mb-2">Onboarding</h3>
              <p className="text-gray-400 text-sm">
                Professional photos, condition report, and listing creation. We prep your vehicle for our fleet.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-[#ECAC36] text-black text-xl font-bold rounded-full flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="text-white font-semibold mb-2">Rent & Earn</h3>
              <p className="text-gray-400 text-sm">
                We market your vehicle to our clientele, handle bookings, and manage all logistics.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-[#ECAC36] text-black text-xl font-bold rounded-full flex items-center justify-center mx-auto mb-4">
                4
              </div>
              <h3 className="text-white font-semibold mb-2">Get Paid</h3>
              <p className="text-gray-400 text-sm">
                Receive monthly statements and payouts. Access your vehicle whenever you need it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-20 px-6 border-b border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
              Owner <span className="text-[#ECAC36]">Benefits</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 p-6 bg-[#111111] border border-[#333333] cut-corner">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Revenue Share (60-70%)</h3>
                <p className="text-gray-400 text-sm">Competitive owner payout based on rental income after operating costs</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-[#111111] border border-[#333333] cut-corner">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Flexible Blackout Dates</h3>
                <p className="text-gray-400 text-sm">Reserve your vehicle for personal use anytime - just let us know in advance</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-[#111111] border border-[#333333] cut-corner">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Detailing & Care</h3>
                <p className="text-gray-400 text-sm">Professional detailing after every rental. Your car returns to you immaculate</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-[#111111] border border-[#333333] cut-corner">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">24/7 Fleet Monitoring</h3>
                <p className="text-gray-400 text-sm">GPS tracking, usage monitoring, and immediate response to any issues</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-[#111111] border border-[#333333] cut-corner">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Vetted Renters Only</h3>
                <p className="text-gray-400 text-sm">Strict qualification process, ID verification, and security deposits on every rental</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-[#111111] border border-[#333333] cut-corner">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Car className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Secure Storage</h3>
                <p className="text-gray-400 text-sm">Climate-controlled facility with security monitoring when not in use</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 md:py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left - Info */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-heading font-bold text-white mb-4">
                  Interested in Joining?
                </h2>
                <p className="text-gray-400">
                  Tell us about your vehicle(s) and we'll prepare a custom management proposal 
                  including projected earnings and program details.
                </p>
              </div>
              
              <div className="bg-[#111111] border border-[#333333] p-6 cut-corner">
                <h3 className="text-white font-semibold mb-4">Vehicles We Accept</h3>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#ECAC36]" />
                    Exotic & luxury sports cars (Ferrari, Lamborghini, McLaren, etc.)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#ECAC36]" />
                    Premium sedans & SUVs (Rolls-Royce, Bentley, G-Wagon, etc.)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#ECAC36]" />
                    Recent model years (typically 2020+)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#ECAC36]" />
                    Low mileage, excellent condition
                  </li>
                </ul>
              </div>

              <div className="pt-4">
                <p className="text-gray-400 mb-3">Have questions? Speak with our fleet manager:</p>
                <a 
                  href="tel:+13056055899" 
                  className="inline-flex items-center text-[#ECAC36] hover:text-[#d4992e] font-semibold text-lg"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  (305) 605-5899
                </a>
              </div>
            </div>

            {/* Right - Form */}
            <Card className="bg-[#111111] border-[#333333] cut-corner">
              <CardHeader>
                <CardTitle className="text-white text-xl">Request a Management Proposal</CardTitle>
              </CardHeader>
              <CardContent>
                {success ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Thank You!</h3>
                    <p className="text-gray-400">Our fleet manager will contact you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-300">Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          placeholder="Your name"
                          required
                          className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-gray-300">Phone *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleChange("phone", e.target.value)}
                          placeholder="(555) 555-5555"
                          required
                          className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-300">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vehicleCount" className="text-gray-300">Number of Vehicles</Label>
                      <Select 
                        value={formData.vehicleCount} 
                        onValueChange={(value) => handleChange("vehicleCount", value)}
                      >
                        <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700">
                          <SelectItem value="1" className="text-white hover:bg-gray-800">1 vehicle</SelectItem>
                          <SelectItem value="2-3" className="text-white hover:bg-gray-800">2-3 vehicles</SelectItem>
                          <SelectItem value="4+" className="text-white hover:bg-gray-800">4+ vehicles</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-gray-300">
                        Tell us about your vehicle(s)
                      </Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleChange("message", e.target.value)}
                        placeholder="Year, make, model, mileage, current storage situation, etc."
                        rows={4}
                        className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full cut-corner bg-[#ECAC36] hover:bg-[#d4992e] text-black font-semibold py-3"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Request Proposal
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 bg-black border-t border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 mb-4">
            Looking to rent an exotic car instead?
          </p>
          <a 
            href="/cars-listing" 
            className="inline-flex items-center text-[#ECAC36] hover:text-[#d4992e] font-semibold text-lg"
          >
            Browse Our Rental Fleet →
          </a>
        </div>
      </section>
    </main>
  )
}

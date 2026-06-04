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
  Camera,
  Users,
  Phone,
  Send,
  Loader2,
  DollarSign,
  Handshake,
  TrendingUp,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function SellConsignPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    assetType: "",
    intent: "",
    message: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.phone || !formData.assetType || !formData.intent) {
      toast.error("Please fill in all required fields")
      return
    }

    setSubmitting(true)
    
    try {
      const response = await fetch("/api/contact/sell-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          source: "sell-consign-page",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit")
      }

      setSuccess(true)
      setFormData({ name: "", email: "", phone: "", assetType: "", intent: "", message: "" })
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
            SELL & CONSIGN
            <span className="block text-[#ECAC36]">YOUR LUXURY ASSET</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Partner with Miami's premier luxury rental platform to sell or consign your exotic car, yacht, or villa. 
            Access our exclusive network of high-net-worth buyers and renters.
          </p>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 md:py-20 px-6 border-b border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
              Why Partner With <span className="text-[#ECAC36]">Luxx Miami</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We offer two flexible options to help you maximize the value of your luxury asset
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Sell Option */}
            <Card className="bg-[#111111] border-[#333333] cut-corner">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#ECAC36]/20 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-[#ECAC36]" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-xl">Direct Sale</CardTitle>
                    <p className="text-gray-400 text-sm">Sell your asset outright</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300">
                  Get a competitive offer for your luxury asset. We handle the entire sales process, 
                  from marketing to buyer qualification to closing, ensuring a seamless transaction.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Quick, hassle-free sale
                  </li>
                  <li className="flex items-center gap-2 text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Competitive market pricing
                  </li>
                  <li className="flex items-center gap-2 text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Professional photography & marketing
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Consignment Option */}
            <Card className="bg-[#111111] border-[#333333] cut-corner">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#ECAC36]/20 rounded-lg flex items-center justify-center">
                    <Handshake className="h-6 w-6 text-[#ECAC36]" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-xl">Consignment</CardTitle>
                    <p className="text-gray-400 text-sm">Let your asset earn while you wait</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300">
                  List your asset with us and earn rental income while we market it for sale. 
                  The perfect option if you're flexible on timing and want to maximize returns.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Earn rental income while listed
                  </li>
                  <li className="flex items-center gap-2 text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Access to qualified buyer network
                  </li>
                  <li className="flex items-center gap-2 text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Professional asset management included
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-14 h-14 bg-[#ECAC36]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-7 w-7 text-[#ECAC36]" />
              </div>
              <h3 className="text-white font-semibold mb-2">Vetted Buyers</h3>
              <p className="text-gray-400 text-sm">Pre-qualified, serious buyers only</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-[#ECAC36]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="h-7 w-7 text-[#ECAC36]" />
              </div>
              <h3 className="text-white font-semibold mb-2">Pro Marketing</h3>
              <p className="text-gray-400 text-sm">Studio-quality photos & listings</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-[#ECAC36]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-7 w-7 text-[#ECAC36]" />
              </div>
              <h3 className="text-white font-semibold mb-2">Maximum Value</h3>
              <p className="text-gray-400 text-sm">Expert pricing strategies</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-[#ECAC36]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-7 w-7 text-[#ECAC36]" />
              </div>
              <h3 className="text-white font-semibold mb-2">Quick Response</h3>
              <p className="text-gray-400 text-sm">Evaluation within 24 hours</p>
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
                  Ready to Get Started?
                </h2>
                <p className="text-gray-400">
                  Tell us about your asset and your goals. A luxury asset specialist will 
                  reach out within 24 hours to discuss your options and provide a valuation.
                </p>
              </div>
              
              <div className="bg-[#111111] border border-[#333333] p-6 cut-corner">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#ECAC36]" />
                  What Happens Next?
                </h3>
                <ol className="space-y-3 text-gray-400">
                  <li className="flex gap-3">
                    <span className="w-6 h-6 bg-[#ECAC36] text-black text-sm font-bold rounded-full flex items-center justify-center flex-shrink-0">1</span>
                    <span>We review your submission and research market comparables</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 bg-[#ECAC36] text-black text-sm font-bold rounded-full flex items-center justify-center flex-shrink-0">2</span>
                    <span>A specialist contacts you to discuss your goals and options</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 bg-[#ECAC36] text-black text-sm font-bold rounded-full flex items-center justify-center flex-shrink-0">3</span>
                    <span>We schedule a professional photo shoot (if needed)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 bg-[#ECAC36] text-black text-sm font-bold rounded-full flex items-center justify-center flex-shrink-0">4</span>
                    <span>Your asset goes live on our platform and marketing begins</span>
                  </li>
                </ol>
              </div>

              <div className="pt-4">
                <p className="text-gray-400 mb-3">Prefer to speak with someone directly?</p>
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
                <CardTitle className="text-white text-xl">Submit Your Asset</CardTitle>
              </CardHeader>
              <CardContent>
                {success ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Thank You!</h3>
                    <p className="text-gray-400">We've received your inquiry and will be in touch within 24 hours.</p>
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
                      <Label htmlFor="assetType" className="text-gray-300">Asset Type *</Label>
                      <Select 
                        value={formData.assetType} 
                        onValueChange={(value) => handleChange("assetType", value)}
                      >
                        <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                          <SelectValue placeholder="Select asset type" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700">
                          <SelectItem value="car" className="text-white hover:bg-gray-800">Exotic Car</SelectItem>
                          <SelectItem value="yacht" className="text-white hover:bg-gray-800">Yacht</SelectItem>
                          <SelectItem value="villa" className="text-white hover:bg-gray-800">Villa / Property</SelectItem>
                          <SelectItem value="other" className="text-white hover:bg-gray-800">Other Luxury Asset</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="intent" className="text-gray-300">I'm interested in *</Label>
                      <Select 
                        value={formData.intent} 
                        onValueChange={(value) => handleChange("intent", value)}
                      >
                        <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                          <SelectValue placeholder="Select your goal" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700">
                          <SelectItem value="sell" className="text-white hover:bg-gray-800">Selling my asset</SelectItem>
                          <SelectItem value="consign" className="text-white hover:bg-gray-800">Consignment (sell + earn rental income)</SelectItem>
                          <SelectItem value="both" className="text-white hover:bg-gray-800">Exploring both options</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-gray-300">
                        Tell us about your asset
                      </Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleChange("message", e.target.value)}
                        placeholder="Year, make, model, condition, asking price, or any other details..."
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
                          Submit Inquiry
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

      {/* Browse For Sale CTA */}
      <section className="py-12 bg-black border-t border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 mb-4">
            Looking to purchase a luxury asset instead?
          </p>
          <Link 
            href="/buy-sell" 
            className="inline-flex items-center text-[#ECAC36] hover:text-[#d4992e] font-semibold text-lg"
          >
            Browse Vehicles for Sale →
          </Link>
        </div>
      </section>
    </main>
  )
}

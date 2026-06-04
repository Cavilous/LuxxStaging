"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, CheckCircle } from "lucide-react"
import { toast } from "sonner"

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    serviceInterest: "General Inquiry",
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
      const response = await fetch("/api/contact/general", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to submit")
      }

      setSuccess(true)
      setFormData({ name: "", phone: "", email: "", serviceInterest: "General Inquiry", message: "" })
      toast.success("Your message has been sent! We'll be in touch soon.")
      
      setTimeout(() => setSuccess(false), 10000)
    } catch (error) {
      console.error("Form submission error:", error)
      toast.error("Something went wrong. Please try again or call us directly.")
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Message Sent!</h3>
        <p className="text-gray-400">We'll get back to you within 1-2 hours.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-gray-300">Name *</Label>
          <Input
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="bg-[#222] border-[#333] text-white cut-corner"
            placeholder="Your name"
            required
          />
        </div>
        <div>
          <Label className="text-gray-300">Phone *</Label>
          <Input
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="bg-[#222] border-[#333] text-white cut-corner"
            placeholder="(555) 123-4567"
            required
          />
        </div>
      </div>

      <div>
        <Label className="text-gray-300">Email *</Label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className="bg-[#222] border-[#333] text-white cut-corner"
          placeholder="your@email.com"
          required
        />
      </div>

      <div>
        <Label className="text-gray-300">Service Interest</Label>
        <select 
          value={formData.serviceInterest}
          onChange={(e) => handleChange("serviceInterest", e.target.value)}
          className="w-full bg-[#222] border border-[#333] text-white rounded px-3 py-2 cut-corner"
        >
          <option>Exotic Cars</option>
          <option>Yachts & Boats</option>
          <option>Villas & Houses</option>
          <option>Car Tours</option>
          <option>Buy/Sell/Invest</option>
          <option>Repair & Customization</option>
          <option>General Inquiry</option>
        </select>
      </div>

      <div>
        <Label className="text-gray-300">Message *</Label>
        <Textarea
          value={formData.message}
          onChange={(e) => handleChange("message", e.target.value)}
          className="bg-[#222] border-[#333] text-white cut-corner min-h-[120px]"
          placeholder="Tell us about your needs..."
          required
        />
      </div>

      <Button 
        type="submit"
        disabled={submitting}
        className="w-full cut-corner bg-gradient-to-r from-[#ECAC36] to-[#e6c766] hover:from-[#e6c766] hover:to-[#ECAC36] text-black font-semibold"
      >
        {submitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </Button>
    </form>
  )
}

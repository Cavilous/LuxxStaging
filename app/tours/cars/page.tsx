"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Clock, Shield, CheckCircle, Camera, Car, Phone, Mail, User, Calendar, Star } from "lucide-react"
import { toast } from "sonner"
import dynamic from "next/dynamic"
import { TourCarSelectCard } from "@/components/tour-car-select-card"

const TourRouteMap = dynamic(() => import("@/components/tour-route-map"), { 
  ssr: false,
  loading: () => <div className="h-[400px] bg-gray-900 animate-pulse rounded-lg" />
})

interface TourCar {
  id: string
  make: string
  model: string
  images: string[]
  specifications: any
  tourCategory: string
  tourMaxPassengers: number
  tourPricing: any
}

export default function ToursPage() {
  const [cars, setCars] = useState<TourCar[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [duration, setDuration] = useState<"1h" | "2h">("1h")
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    notes: "",
  })

  useEffect(() => {
    fetchTourCars()
  }, [])

  const fetchTourCars = async () => {
    try {
      const response = await fetch("/api/tours/cars")
      if (!response.ok) throw new Error("Failed to fetch")
      const data = await response.json()
      setCars(data)
    } catch (error) {
      console.error("Error fetching tour cars:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculatePrice = (car: TourCar) => {
    const pricing = car.tourPricing?.perHour || { pax1: 300 }
    const hours = duration === "2h" ? 2 : 1
    return (pricing.pax1 || 300) * hours
  }

  const durationLabel = duration === "2h" ? "2h tour" : "1h tour"

  const selectedCar = cars.find(c => c.id === selectedCarId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedCarId) {
      toast.error("Please select a car for your tour")
      return
    }

    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill in all required fields")
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch("/api/leads/tour", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carId: selectedCarId,
          carName: selectedCar ? `${selectedCar.make} ${selectedCar.model}` : "",
          duration,
          ...formData,
        }),
      })

      if (response.ok) {
        toast.success("Tour request submitted! We'll contact you shortly.")
        setFormData({ name: "", email: "", phone: "", preferredDate: "", preferredTime: "", notes: "" })
        setSelectedCarId(null)
      } else {
        toast.error("Failed to submit request. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting tour request:", error)
      toast.error("An error occurred. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative py-24 md:py-32 flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DSC09371.jpg-O5HNBgv5aKL6h2eBmJofJr3ZkGM5Nd.jpeg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Luxury & Exotic Car <span className="text-gold">Ride-Along Tours</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            No license, no insurance, no deposit - just book your seat and enjoy the ride through Miami's most iconic destinations.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-900/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Your Miami <span className="text-gold">Tour Route</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Cruise through Miami's most iconic destinations in a luxury exotic car
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <TourRouteMap />
            
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white mb-4">Tour Highlights</h3>
              {[
                { name: "Ocean Drive", icon: "🌴", desc: "Art Deco architecture & vibrant nightlife district" },
                { name: "Brickell Skyline", icon: "🏙️", desc: "Miami's impressive financial district" },
                { name: "Venetian Causeway", icon: "🌊", desc: "Scenic bridge with stunning bay views" },
                { name: "Star Island", icon: "⭐", desc: "Celebrity mansions & luxury waterfront estates" },
                { name: "South Beach", icon: "📸", desc: "Perfect photo stops at Miami's iconic beach" },
              ].map((spot, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-black/50 border border-gray-800 rounded-lg hover:border-gold/30 transition-colors">
                  <span className="text-2xl">{spot.icon}</span>
                  <div>
                    <div className="font-semibold text-white">{spot.name}</div>
                    <div className="text-sm text-gray-400">{spot.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              The <span className="text-gold">Experience</span>
            </h2>
            <p className="text-gray-400">What awaits you on your Miami ride-along adventure</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "Luxury Supercars", desc: "Lamborghini, Ferrari & more" },
              { title: "Scenic Routes", desc: "Miami's best views" },
              { title: "Photo Moments", desc: "Instagram-worthy stops" },
              { title: "Expert Drivers", desc: "Local knowledge included" },
            ].map((item, i) => (
              <div key={i} className="relative aspect-square bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-lg overflow-hidden group hover:border-gold/50 transition-all">
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                  <Star className="h-8 w-8 text-gold mb-3" />
                  <h3 className="font-bold text-white text-sm md:text-base">{item.title}</h3>
                  <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4" id="book">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Book Your Tour</h2>
            <p className="text-gray-400">Three simple steps to your Miami adventure</p>
          </div>

          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-gold text-black font-bold flex items-center justify-center text-sm">1</div>
              <h3 className="text-xl font-bold text-white">Choose Your Duration</h3>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setDuration("1h")}
                className={`flex-1 max-w-xs p-6 border-2 transition-all duration-300 cut-corner ${
                  duration === "1h"
                    ? "border-gold bg-gold/10"
                    : "border-gray-700 hover:border-gray-500"
                }`}
              >
                <Clock className={`h-8 w-8 mb-3 ${duration === "1h" ? "text-gold" : "text-gray-400"}`} />
                <div className="text-xl font-bold text-white">1 Hour Tour</div>
                <p className="text-sm text-gray-400 mt-1">Express Miami highlights</p>
              </button>
              <button
                onClick={() => setDuration("2h")}
                className={`flex-1 max-w-xs p-6 border-2 transition-all duration-300 cut-corner ${
                  duration === "2h"
                    ? "border-gold bg-gold/10"
                    : "border-gray-700 hover:border-gray-500"
                }`}
              >
                <Clock className={`h-8 w-8 mb-3 ${duration === "2h" ? "text-gold" : "text-gray-400"}`} />
                <div className="text-xl font-bold text-white">2 Hour Tour</div>
                <p className="text-sm text-gray-400 mt-1">Extended coastal experience</p>
              </button>
            </div>
          </div>

          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-gold text-black font-bold flex items-center justify-center text-sm">2</div>
              <h3 className="text-xl font-bold text-white">Select Your Car</h3>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-900 h-64 animate-pulse rounded-lg" />
                ))}
              </div>
            ) : cars.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No tour cars available at this time.</p>
            ) : (
              <div className="fleet-grid tour-cars-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.map((car) => (
                  <TourCarSelectCard
                    key={car.id}
                    id={car.id}
                    make={car.make}
                    model={car.model}
                    image={car.images?.[0]}
                    maxPassengers={car.tourMaxPassengers}
                    price={calculatePrice(car)}
                    durationLabel={durationLabel}
                    selected={selectedCarId === car.id}
                    onSelect={() => setSelectedCarId(car.id)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-gold text-black font-bold flex items-center justify-center text-sm">3</div>
              <h3 className="text-xl font-bold text-white">Your Details</h3>
            </div>

            <form onSubmit={handleSubmit} className="max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-gray-300 mb-2 block">
                    <User className="h-4 w-4 inline mr-2" />
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-gray-900 border-gray-700 text-white"
                    placeholder="John Smith"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-gray-300 mb-2 block">
                    <Phone className="h-4 w-4 inline mr-2" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="bg-gray-900 border-gray-700 text-white"
                    placeholder="(305) 555-0123"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-gray-300 mb-2 block">
                    <Mail className="h-4 w-4 inline mr-2" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-gray-900 border-gray-700 text-white"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="preferredDate" className="text-gray-300 mb-2 block">
                    <Calendar className="h-4 w-4 inline mr-2" />
                    Preferred Date
                  </Label>
                  <Input
                    id="preferredDate"
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, preferredDate: e.target.value }))}
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="preferredTime" className="text-gray-300 mb-2 block">
                    <Clock className="h-4 w-4 inline mr-2" />
                    Preferred Time
                  </Label>
                  <Input
                    id="preferredTime"
                    type="time"
                    value={formData.preferredTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, preferredTime: e.target.value }))}
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>
              </div>
              <div className="mt-6">
                <Label htmlFor="notes" className="text-gray-300 mb-2 block">
                  Additional Notes
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="bg-gray-900 border-gray-700 text-white"
                  placeholder="Any special requests or questions?"
                  rows={3}
                />
              </div>

              {selectedCar && (
                <div className="mt-6 p-4 bg-gray-900 border border-gold/30 cut-corner">
                  <div className="text-sm text-gray-400 mb-1">Your Selection</div>
                  <div className="text-lg font-bold text-white">
                    {selectedCar.make} {selectedCar.model} - {duration === "1h" ? "1 Hour" : "2 Hour"} Tour
                  </div>
                  <div className="text-gold font-bold text-xl mt-1">
                    From ${calculatePrice(selectedCar)} per person
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={submitting || !selectedCarId}
                className="mt-6 w-full md:w-auto bg-gold hover:bg-gold-light text-black font-bold py-3 px-8 cut-corner disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Request Tour Booking"}
              </Button>
            </form>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">What's Included</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: "Professional Driver", desc: "Expert local knowledge" },
              { icon: CheckCircle, title: "Fuel Included", desc: "No hidden costs" },
              { icon: Car, title: "Curated Routes", desc: "Best Miami highlights" },
              { icon: Camera, title: "Photo Stops", desc: "Perfect Instagram moments" },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Why Ride-Along?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { title: "No License Required", desc: "Just bring yourself and enjoy the ride" },
              { title: "Zero Insurance Hassle", desc: "We handle all the coverage" },
              { title: "No Security Deposit", desc: "Book with confidence, no holds on your card" },
            ].map((item, index) => (
              <div key={index}>
                <h3 className="text-xl font-bold text-gold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Share2, Heart, ChevronLeft, ChevronRight, Phone, Send, Loader2, CheckCircle } from "lucide-react"
import Link from "next/link"
import { AssetDetailSchema } from "@/components/json-ld-schema"
import { analytics } from "@/lib/analytics"
import { toast } from "sonner"

interface ForSaleAsset {
  id: string
  slug: string
  title: string
  category: "car" | "yacht" | "villa"
  brand?: string
  model?: string
  year?: number
  specs: Record<string, any>
  heroImage: string
  images: string[]
  advertisedPrice?: number | null
  managedAssetPrice?: number | null
  managementTerms?: Record<string, any>
  status: string
  location: string
  description?: string
  badges: string[]
  metaTitle?: string
  metaDescription?: string
}

export default function AssetDetailPage() {
  const params = useParams()
  const [asset, setAsset] = useState<ForSaleAsset | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [inquirySubmitting, setInquirySubmitting] = useState(false)
  const [inquirySuccess, setInquirySuccess] = useState(false)

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/buy-sell/${params.slug}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            setError("Asset not found")
          } else {
            setError("Failed to load asset")
          }
          return
        }

        const data = await response.json()
        setAsset(data)
        analytics.trackAssetView(data.id, data.title, data.category)
      } catch (err) {
        console.error("Error fetching asset:", err)
        setError("Failed to load asset")
      } finally {
        setLoading(false)
      }
    }

    if (params.slug) {
      fetchAsset()
    }
  }, [params.slug])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US").format(value)
  }

  const allImages = asset ? [asset.heroImage, ...asset.images.filter(img => img !== asset.heroImage)] : []

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
  }

  const getSpecLabel = (key: string): string => {
    const labels: Record<string, string> = {
      horsepower: "Horsepower",
      miles: "Mileage",
      transmission: "Transmission",
      topSpeed: "Top Speed",
      engine: "Engine",
      drivetrain: "Drivetrain",
      exteriorColor: "Exterior Color",
      interiorColor: "Interior Color",
      lengthFt: "Length",
      guests: "Guest Capacity",
      crew: "Crew",
      cabins: "Cabins",
      builder: "Builder",
      bedrooms: "Bedrooms",
      bathrooms: "Bathrooms",
      sqft: "Square Feet",
      waterfront: "Waterfront",
      pool: "Pool",
      garage: "Garage",
    }
    return labels[key] || key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
  }

  const formatSpecValue = (key: string, value: any): string => {
    if (value === null || value === undefined || value === "") return ""
    if (typeof value === "boolean") return value ? "Yes" : "No"
    if (key === "miles") return `${formatNumber(Number(value))} mi`
    if (key === "sqft") return `${formatNumber(Number(value))} sqft`
    if (key === "horsepower") return `${formatNumber(Number(value))} hp`
    if (key === "topSpeed") return `${formatNumber(Number(value))} mph`
    if (key === "lengthFt") return `${value}'`
    return String(value)
  }

  const hasValidSpecs = (specs: Record<string, any>) => {
    return Object.entries(specs).some(([_, value]) => 
      value !== null && value !== undefined && value !== ""
    )
  }

  const handleInquiryChange = (field: string, value: string) => {
    setInquiryForm(prev => ({ ...prev, [field]: value }))
  }

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!inquiryForm.name || !inquiryForm.email || !inquiryForm.phone) {
      toast.error("Please fill in all required fields")
      return
    }

    if (!asset) return

    setInquirySubmitting(true)
    
    try {
      const response = await fetch("/api/buy-sell/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetId: asset.id,
          assetTitle: asset.title,
          ...inquiryForm,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit")
      }

      setInquirySuccess(true)
      setInquiryForm({ name: "", email: "", phone: "", message: "" })
      toast.success("Your inquiry has been submitted! We'll be in touch soon.")
      
      setTimeout(() => setInquirySuccess(false), 5000)
    } catch (error) {
      console.error("Inquiry error:", error)
      toast.error("Something went wrong. Please try again or call us directly.")
    } finally {
      setInquirySubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading asset...
        </div>
      </div>
    )
  }

  if (error || !asset) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6">
        <p className="text-xl text-gray-400">{error || "Asset not found"}</p>
        <Link href="/buy-sell">
          <Button className="cut-corner bg-[#ECAC36] text-black font-semibold">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Assets
          </Button>
        </Link>
      </div>
    )
  }

  const hasSpecs = hasValidSpecs(asset.specs) || asset.year || asset.brand || asset.model
  const hasManagementTerms = asset.managementTerms && Object.keys(asset.managementTerms).length > 0

  return (
    <>
      <AssetDetailSchema asset={asset} />

      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/buy-sell">
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Assets
              </Button>
            </Link>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="relative h-96 md:h-[600px] group">
          <img
            src={allImages[currentImageIndex] || "/placeholder.svg"}
            alt={`${asset.title} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {allImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {allImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentImageIndex ? "bg-[#ECAC36] w-4" : "bg-white/50"
                    }`}
                    aria-label={`View image ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}

          {asset.badges.length > 0 && (
            <div className="absolute bottom-8 left-8">
              {asset.badges.map((badge) => (
                <Badge key={badge} className="bg-[#ECAC36] text-black cut-corner mr-2">
                  {badge}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{asset.title}</h1>
                <p className="text-xl text-gray-400 mb-6">{asset.location}</p>

                {asset.description && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 flex items-center">
                      <span className="w-1 h-6 bg-[#ECAC36] mr-3"></span>
                      About This {asset.category === "car" ? "Vehicle" : asset.category === "yacht" ? "Yacht" : "Property"}
                    </h2>
                    <p className="text-gray-300 leading-relaxed">{asset.description}</p>
                  </div>
                )}

                {hasSpecs && (
                  <>
                    <h2 className="text-2xl font-semibold mb-4 flex items-center">
                      <span className="w-1 h-6 bg-[#ECAC36] mr-3"></span>
                      Specifications
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      {asset.year && (
                        <div className="flex justify-between py-3 border-b border-gray-800">
                          <span className="text-gray-400">Year</span>
                          <span className="text-white font-medium">{asset.year}</span>
                        </div>
                      )}
                      {asset.brand && (
                        <div className="flex justify-between py-3 border-b border-gray-800">
                          <span className="text-gray-400">Brand</span>
                          <span className="text-white font-medium">{asset.brand}</span>
                        </div>
                      )}
                      {asset.model && (
                        <div className="flex justify-between py-3 border-b border-gray-800">
                          <span className="text-gray-400">Model</span>
                          <span className="text-white font-medium">{asset.model}</span>
                        </div>
                      )}
                      {Object.entries(asset.specs).map(([key, value]) => {
                        const formattedValue = formatSpecValue(key, value)
                        if (!formattedValue) return null
                        return (
                          <div key={key} className="flex justify-between py-3 border-b border-gray-800">
                            <span className="text-gray-400">{getSpecLabel(key)}</span>
                            <span className="text-white font-medium">{formattedValue}</span>
                          </div>
                        )
                      })}
                    </div>
                  </>
                )}
              </div>

              {allImages.length > 1 && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4 flex items-center">
                    <span className="w-1 h-6 bg-[#ECAC36] mr-3"></span>
                    Gallery
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {allImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`relative aspect-video overflow-hidden rounded-lg ${
                          idx === currentImageIndex ? "ring-2 ring-[#ECAC36]" : ""
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${asset.title} - Gallery ${idx + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1 space-y-6">
              {/* Pricing Card */}
              <Card className="bg-gray-900/50 border-gray-800 cut-corner">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {asset.advertisedPrice && (
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Direct purchase for personal use</p>
                        <p className="text-3xl font-bold text-white">{formatPrice(asset.advertisedPrice)}</p>
                      </div>
                    )}
                    {asset.managedAssetPrice && (
                      <div>
                        <p className="text-sm text-gray-500 mb-2">
                          Lower price when Luxx manages rentals & experiences
                        </p>
                        <div className="flex items-center gap-3 mb-2">
                          <p className="text-3xl font-bold text-[#ECAC36]">{formatPrice(asset.managedAssetPrice)}</p>
                        </div>
                        {asset.advertisedPrice && (
                          <p className="text-sm text-green-400">
                            Save {formatPrice(asset.advertisedPrice - asset.managedAssetPrice)}
                          </p>
                        )}
                      </div>
                    )}

                    {hasManagementTerms && (
                      <div className="pt-4 border-t border-gray-800">
                        <h3 className="font-semibold mb-3">Management Terms</h3>
                        <div className="space-y-2 text-sm">
                          {asset.managementTerms?.ownerUseAllotment && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">Owner Use</span>
                              <span>{asset.managementTerms.ownerUseAllotment} days/year</span>
                            </div>
                          )}
                          {asset.managementTerms?.revSharePctOwner && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">Revenue Share</span>
                              <span>{asset.managementTerms.revSharePctOwner}% to owner</span>
                            </div>
                          )}
                          {asset.managementTerms?.maintenanceIncluded !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">Maintenance</span>
                              <span>{asset.managementTerms.maintenanceIncluded ? "Included" : "Not Included"}</span>
                            </div>
                          )}
                          {asset.managementTerms?.insuranceIncluded !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">Insurance</span>
                              <span>{asset.managementTerms.insuranceIncluded ? "Included" : "Not Included"}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Embedded Inquiry Form */}
              <Card className="bg-gray-900/50 border-gray-800 cut-corner sticky top-8">
                <CardHeader className="pb-4">
                  <CardTitle className="text-white text-xl">Inquire About This Asset</CardTitle>
                </CardHeader>
                <CardContent>
                  {inquirySuccess ? (
                    <div className="text-center py-6">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-white mb-2">Thank You!</h3>
                      <p className="text-gray-400 text-sm">We've received your inquiry and will be in touch within 24 hours.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleInquirySubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="inquiry-name" className="text-gray-300">Name *</Label>
                        <Input
                          id="inquiry-name"
                          value={inquiryForm.name}
                          onChange={(e) => handleInquiryChange("name", e.target.value)}
                          placeholder="Your name"
                          required
                          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="inquiry-email" className="text-gray-300">Email *</Label>
                        <Input
                          id="inquiry-email"
                          type="email"
                          value={inquiryForm.email}
                          onChange={(e) => handleInquiryChange("email", e.target.value)}
                          placeholder="your@email.com"
                          required
                          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="inquiry-phone" className="text-gray-300">Phone *</Label>
                        <Input
                          id="inquiry-phone"
                          type="tel"
                          value={inquiryForm.phone}
                          onChange={(e) => handleInquiryChange("phone", e.target.value)}
                          placeholder="(555) 555-5555"
                          required
                          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="inquiry-message" className="text-gray-300">Message</Label>
                        <Textarea
                          id="inquiry-message"
                          value={inquiryForm.message}
                          onChange={(e) => handleInquiryChange("message", e.target.value)}
                          placeholder="Questions or specific requirements..."
                          rows={3}
                          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={inquirySubmitting}
                        className="w-full cut-corner bg-[#ECAC36] hover:bg-[#d4992e] text-black font-semibold py-3"
                      >
                        {inquirySubmitting ? (
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
                  
                  <div className="pt-4 mt-4 border-t border-gray-800">
                    <p className="text-xs text-gray-500 text-center">
                      Or call us at{" "}
                      <a href="tel:+13056055899" className="text-[#ECAC36] hover:underline font-medium">
                        (305) 605-5899
                      </a>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

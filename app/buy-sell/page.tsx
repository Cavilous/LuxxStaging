"use client"

import { useState, useEffect, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  Search,
  ChevronRight,
  CheckCircle,
  Shield,
  Camera,
  Users,
  Phone,
  Car,
  Anchor,
  Home,
  Send,
  Loader2,
  Grid3X3,
} from "lucide-react"
import Link from "next/link"
import BuyerInquiryDrawer from "@/components/buyer-inquiry-drawer"
import { AssetListSchema, OrganizationSchema } from "@/components/json-ld-schema"
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
  advertisedPrice?: number
  managedAssetPrice?: number
  managementTerms?: Record<string, any>
  status: string
  location: string
  badges: string[]
}

export default function BuySellPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [assets, setAssets] = useState<ForSaleAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  const [sellForm, setSellForm] = useState({
    name: "",
    email: "",
    phone: "",
    assetType: "",
    message: "",
  })
  const [sellFormSubmitting, setSellFormSubmitting] = useState(false)
  const [sellFormSuccess, setSellFormSuccess] = useState(false)

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/buy-sell")
        if (!response.ok) throw new Error("Failed to fetch assets")
        
        const data = await response.json()
        setAssets(data)
      } catch (error) {
        console.error("Error fetching assets:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAssets()
  }, [])

  const filteredAssets = assets.filter((asset) => {
    const matchesCategory = selectedCategory === "all" || asset.category === selectedCategory
    const matchesSearch =
      asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.model?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getSpecLine = (asset: ForSaleAsset) => {
    if (asset.category === "car") {
      const parts = []
      if (asset.year) parts.push(asset.year)
      if (asset.specs.horsepower) parts.push(`${asset.specs.horsepower.toLocaleString()} hp`)
      if (asset.specs.miles) parts.push(`${asset.specs.miles.toLocaleString()} mi`)
      return parts.join(" | ") || "View Details"
    } else if (asset.category === "yacht") {
      const parts = []
      if (asset.specs.lengthFt) parts.push(`${asset.specs.lengthFt}'`)
      if (asset.specs.guests) parts.push(`${asset.specs.guests} Guests`)
      if (asset.specs.crew) parts.push(`${asset.specs.crew} Crew`)
      return parts.join(" | ") || "View Details"
    } else {
      const parts = []
      if (asset.specs.bedrooms) parts.push(`${asset.specs.bedrooms} Bed`)
      if (asset.specs.bathrooms) parts.push(`${asset.specs.bathrooms} Bath`)
      if (asset.specs.sqft) parts.push(`${asset.specs.sqft.toLocaleString()} sqft`)
      return parts.join(" | ") || "View Details"
    }
  }

  const handleAssetView = (asset: ForSaleAsset) => {
    analytics.trackAssetView(asset.id, asset.title, asset.category)
  }

  const handleSellFormChange = (field: string, value: string) => {
    setSellForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSellFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!sellForm.name || !sellForm.email || !sellForm.phone || !sellForm.assetType) {
      toast.error("Please fill in all required fields")
      return
    }

    setSellFormSubmitting(true)
    
    try {
      const response = await fetch("/api/contact/sell-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...sellForm,
          source: "buy-sell-page",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit")
      }

      setSellFormSuccess(true)
      setSellForm({ name: "", email: "", phone: "", assetType: "", message: "" })
      toast.success("Your inquiry has been submitted! We'll be in touch soon.")
      
      setTimeout(() => setSellFormSuccess(false), 5000)
    } catch (error) {
      console.error("Sell form error:", error)
      toast.error("Something went wrong. Please try again or call us directly.")
    } finally {
      setSellFormSubmitting(false)
    }
  }

  const categories = [
    { value: "all", label: "All Assets", icon: Grid3X3 },
    { value: "car", label: "Cars", icon: Car },
    { value: "yacht", label: "Yachts", icon: Anchor },
    { value: "villa", label: "Villas", icon: Home },
  ]

  return (
    <>
      <AssetListSchema assets={filteredAssets} />
      <OrganizationSchema />

      <div className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <section
          className="relative h-[70vh] md:h-[80vh] flex items-center justify-center overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DSC09371.jpg-O5HNBgv5aKL6h2eBmJofJr3ZkGM5Nd.jpeg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white">
              Buy or Sell <span className="text-[#ECAC36]">Luxury Assets</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
              Browse our curated collection of exotic cars, yachts, and villas for sale. Or consign your asset with us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => document.getElementById("assets-section")?.scrollIntoView({ behavior: "smooth" })}
                className="cut-corner bg-[#ECAC36] hover:bg-[#d4992e] text-black font-semibold text-lg px-8 py-4"
              >
                Browse Assets
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => document.getElementById("sell-section")?.scrollIntoView({ behavior: "smooth" })}
                className="cut-corner border-white text-white hover:bg-white hover:text-black text-lg px-8 py-4 bg-transparent"
              >
                Sell Your Asset
              </Button>
            </div>
          </div>
        </section>

        {/* Why Buy from Luxx - Simplified */}
        <section className="py-16 bg-gray-950">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
              Why Buy from <span className="text-[#ECAC36]">Luxx</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Shield,
                  title: "Verified Inventory",
                  description: "Every asset undergoes thorough inspection and verification",
                },
                {
                  icon: Camera,
                  title: "Professional Media",
                  description: "High-quality photos and videos of every listing",
                },
                {
                  icon: Users,
                  title: "Concierge Service",
                  description: "White-glove support throughout your purchase journey",
                },
                {
                  icon: Phone,
                  title: "Expert Advisors",
                  description: "Speak directly with our luxury asset specialists",
                },
              ].map((item, index) => (
                <Card
                  key={index}
                  className="bg-gray-900 border-gray-800 cut-corner hover:border-[#ECAC36]/50 transition-all duration-300"
                >
                  <CardContent className="p-6 text-center">
                    <item.icon className="h-10 w-10 text-[#ECAC36] mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2 text-white">{item.title}</h3>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Assets for Sale */}
        <section id="assets-section" className="py-16 bg-black">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Assets <span className="text-[#ECAC36]">For Sale</span>
              </h2>
              <div className="relative w-full lg:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, brand, or model..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 cut-corner"
                />
              </div>
            </div>

            {/* Filter Pills - Fixed Styling */}
            <div className="flex flex-wrap gap-3 mb-10">
              {categories.map((category) => {
                const isActive = selectedCategory === category.value
                const Icon = category.icon
                return (
                  <Button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`cut-corner transition-all duration-200 ${
                      isActive
                        ? "bg-[#ECAC36] text-black hover:bg-[#d4992e] font-semibold"
                        : "bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-white border border-gray-700"
                    }`}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {category.label}
                  </Button>
                )
              })}
            </div>

            {/* Asset Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {loading ? (
                <div className="col-span-full text-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-[#ECAC36] mx-auto mb-4" />
                  <p className="text-gray-400">Loading assets...</p>
                </div>
              ) : filteredAssets.length === 0 ? (
                <div className="col-span-full text-center py-16">
                  <p className="text-gray-300 text-lg mb-2">No assets found</p>
                  <p className="text-gray-500">Check back soon for new listings or adjust your filters</p>
                </div>
              ) : (
                filteredAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="group bg-[#0A0A0A] overflow-hidden transition-all duration-300 rounded-lg hover:shadow-[0_0_30px_rgba(236,172,54,0.15)] hover:-translate-y-1"
                  >
                    <Link href={`/buy-sell/${asset.slug}`} onClick={() => handleAssetView(asset)} className="block">
                      <div className="relative aspect-[3/2] overflow-hidden">
                        <img
                          src={asset.heroImage || "/placeholder.svg"}
                          alt={asset.title}
                          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                        {asset.badges.length > 0 && (
                          <div className="absolute top-3 left-3 z-10">
                            <div className="bg-[#ECAC36] px-3 py-1 text-xs font-bold text-black shadow-lg rounded">
                              {asset.badges[0]}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-4 space-y-2">
                        <div className="mb-3">
                          {asset.advertisedPrice ? (
                            <div className="font-bold text-2xl md:text-3xl leading-none text-[#ECAC36] tracking-tight">
                              {formatPrice(asset.advertisedPrice)}
                            </div>
                          ) : (
                            <div className="font-semibold text-lg text-[#ECAC36]">
                              Call for pricing
                            </div>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-white truncate leading-tight group-hover:text-[#ECAC36] transition-colors duration-300">
                          {asset.title}
                        </h3>
                        <p className="text-sm truncate text-gray-500">{getSpecLine(asset)}</p>
                        
                        {asset.managedAssetPrice && asset.advertisedPrice && asset.managedAssetPrice < asset.advertisedPrice && (
                          <div className="mt-2 text-xs text-green-400">
                            Managed price: {formatPrice(asset.managedAssetPrice)}
                          </div>
                        )}
                      </div>
                    </Link>
                    
                    <div className="px-4 pb-4">
                      <BuyerInquiryDrawer assetId={asset.id} assetTitle={asset.title}>
                        <Button className="w-full rounded-lg bg-[#ECAC36] hover:bg-[#d4992e] text-black font-semibold">
                          Inquire Now
                        </Button>
                      </BuyerInquiryDrawer>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Sell or Consign - With Embedded Form */}
        <section id="sell-section" className="py-16 bg-gray-950">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left - Info */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                  Sell or Consign with <span className="text-[#ECAC36]">Luxx</span>
                </h2>
                <p className="text-gray-300 text-lg mb-8">
                  Ready to sell your luxury asset? We offer competitive valuations, professional marketing, 
                  and access to our network of qualified buyers.
                </p>
                <div className="space-y-4 mb-8">
                  {[
                    "Fast, no-obligation valuation",
                    "Professional photography and video",
                    "Nationwide network of qualified buyers",
                    "Secure transaction support",
                  ].map((bullet, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[#ECAC36] mr-3 flex-shrink-0" />
                      <span className="text-gray-300">{bullet}</span>
                    </div>
                  ))}
                </div>
                <p className="text-gray-400">
                  Questions? Call us at{" "}
                  <a href="tel:+13056055899" className="text-[#ECAC36] hover:underline font-semibold">
                    (305) 605-5899
                  </a>
                </p>
              </div>

              {/* Right - Embedded Form */}
              <Card className="bg-gray-900 border-gray-800 cut-corner">
                <CardHeader>
                  <CardTitle className="text-white text-xl">Submit Your Asset</CardTitle>
                </CardHeader>
                <CardContent>
                  {sellFormSuccess ? (
                    <div className="text-center py-8">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">Thank You!</h3>
                      <p className="text-gray-400">We've received your inquiry and will be in touch within 24 hours.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSellFormSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="sell-name" className="text-gray-300">Name *</Label>
                          <Input
                            id="sell-name"
                            value={sellForm.name}
                            onChange={(e) => handleSellFormChange("name", e.target.value)}
                            placeholder="Your name"
                            required
                            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="sell-phone" className="text-gray-300">Phone *</Label>
                          <Input
                            id="sell-phone"
                            type="tel"
                            value={sellForm.phone}
                            onChange={(e) => handleSellFormChange("phone", e.target.value)}
                            placeholder="(555) 555-5555"
                            required
                            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sell-email" className="text-gray-300">Email *</Label>
                        <Input
                          id="sell-email"
                          type="email"
                          value={sellForm.email}
                          onChange={(e) => handleSellFormChange("email", e.target.value)}
                          placeholder="your@email.com"
                          required
                          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sell-asset-type" className="text-gray-300">Asset Type *</Label>
                        <Select 
                          value={sellForm.assetType} 
                          onValueChange={(value) => handleSellFormChange("assetType", value)}
                        >
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                            <SelectValue placeholder="Select asset type" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            <SelectItem value="car" className="text-white hover:bg-gray-700">Exotic Car</SelectItem>
                            <SelectItem value="yacht" className="text-white hover:bg-gray-700">Yacht</SelectItem>
                            <SelectItem value="villa" className="text-white hover:bg-gray-700">Villa / Property</SelectItem>
                            <SelectItem value="other" className="text-white hover:bg-gray-700">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sell-message" className="text-gray-300">
                          Tell us about your asset
                        </Label>
                        <Textarea
                          id="sell-message"
                          value={sellForm.message}
                          onChange={(e) => handleSellFormChange("message", e.target.value)}
                          placeholder="Year, make, model, condition, asking price, or any other details..."
                          rows={4}
                          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={sellFormSubmitting}
                        className="w-full cut-corner bg-[#ECAC36] hover:bg-[#d4992e] text-black font-semibold py-3"
                      >
                        {sellFormSubmitting ? (
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

        {/* Simple Footer CTA */}
        <section className="py-12 bg-black border-t border-gray-800">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-400 mb-4">
              Have questions? Speak with a luxury asset specialist.
            </p>
            <a 
              href="tel:+13056055899" 
              className="inline-flex items-center text-[#ECAC36] hover:text-[#d4992e] font-semibold text-lg"
            >
              <Phone className="mr-2 h-5 w-5" />
              (305) 605-5899
            </a>
          </div>
        </section>
      </div>
    </>
  )
}

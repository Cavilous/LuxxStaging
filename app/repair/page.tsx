"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Wrench, Clock, CheckCircle, Camera, FileText, Truck, Award, ChevronRight, Star } from "lucide-react"
import { InsuranceIntakeDrawer } from "@/components/insurance-intake-drawer"
import { CustomizationQuoteDrawer } from "@/components/customization-quote-drawer"
import { RepairSchema } from "@/components/repair-schema"
import { analytics } from "@/lib/analytics"

interface ServicePackage {
  id: string
  title: string
  category: string
  startingPrice: number
  estimatedTurnaroundDays: number
  badges: string[]
  heroImage: string
  description?: string
}

interface CollisionCapability {
  id: string
  title: string
  description: string
  oemBrands: string[]
  services: string[]
}

export default function RepairPage() {
  const [servicePackages, setServicePackages] = useState<ServicePackage[]>([])
  const [capabilities, setCapabilities] = useState<CollisionCapability[]>([])
  const [showInsuranceForm, setShowInsuranceForm] = useState(false)
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [selectedService, setSelectedService] = useState<string>("")

  useEffect(() => {
    analytics.trackRepairView()

    // Fetch service packages and capabilities from API
    const fetchData = async () => {
      try {
        const [packagesRes, capabilitiesRes] = await Promise.all([
          fetch("/api/repair/packages"),
          fetch("/api/repair/capabilities"),
        ])

        if (packagesRes.ok) {
          const { packages } = await packagesRes.json()
          setServicePackages(packages || [])
        }

        if (capabilitiesRes.ok) {
          const { capabilities } = await capabilitiesRes.json()
          setCapabilities(capabilities || [])
        }
      } catch (error) {
        console.error("Error fetching repair data:", error)
        // Fallback to mock data
        setServicePackages([
          {
            id: "1",
            title: "Full-Body PPF – Track Gloss",
            category: "ppf",
            startingPrice: 8500,
            estimatedTurnaroundDays: 7,
            badges: ["Featured"],
            heroImage: "/car-paint-protection.png",
            description:
              "Complete paint protection film coverage with high-gloss finish for maximum durability and clarity.",
          },
          {
            id: "2",
            title: "Carbon Fiber Wrap",
            category: "wrap",
            startingPrice: 4500,
            estimatedTurnaroundDays: 5,
            badges: ["New"],
            heroImage: "/carbon-fiber-texture.png",
            description: "Premium 3M carbon fiber vinyl wrap with authentic texture and deep gloss finish.",
          },
          {
            id: "3",
            title: "Ceramic Window Tint",
            category: "tint",
            startingPrice: 800,
            estimatedTurnaroundDays: 1,
            badges: [],
            heroImage: "/car-window-tint.png",
            description: "High-performance ceramic tint for maximum heat rejection and UV protection.",
          },
          {
            id: "4",
            title: "Forged Wheel Package",
            category: "wheels",
            startingPrice: 12000,
            estimatedTurnaroundDays: 14,
            badges: ["Featured"],
            heroImage: "/placeholder-fpan4.png",
            description: "Lightweight forged wheels with custom finishes and performance tires.",
          },
        ])

        setCapabilities([
          {
            id: "1",
            title: "Aluminum Chassis Repair",
            description: "Specialized aluminum frame straightening and repair for exotic vehicles",
            oemBrands: ["Ferrari", "Lamborghini", "McLaren", "Aston Martin", "Porsche GT"],
            services: ["Frame straightening", "Aluminum welding", "Structural analysis", "Geometry correction"],
          },
          {
            id: "2",
            title: "Carbon Fiber Restoration",
            description: "Expert carbon fiber panel repair and refinishing",
            oemBrands: ["McLaren", "Lamborghini", "Ferrari", "Bugatti"],
            services: ["Carbon repair", "Clear coat refinishing", "Structural integrity testing"],
          },
          {
            id: "3",
            title: "ADAS Calibration",
            description: "Advanced driver assistance system recalibration after collision repair",
            oemBrands: ["Ferrari", "Lamborghini", "McLaren", "Porsche", "Bentley", "Rolls-Royce"],
            services: ["Camera calibration", "Radar alignment", "Sensor testing", "System validation"],
          },
        ])
      }
    }

    fetchData()
  }, [])

  const handleGetQuote = (serviceCategory: string) => {
    setSelectedService(serviceCategory)
    setShowCustomForm(true)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <RepairSchema packages={servicePackages} capabilities={capabilities} />

      {/* Hero Section - Angled */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DSC09371.jpg-O5HNBgv5aKL6h2eBmJofJr3ZkGM5Nd.jpeg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50" />

        {/* Angled bottom edge */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16 bg-black"
          style={{ clipPath: "polygon(0 100%, 100% 0%, 100% 100%)" }}
        />

        <div className="relative container mx-auto px-4 py-32">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Customization, PPF &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ECAC36] to-[#e6c766]">
                Insurance-Backed
              </span>{" "}
              Collision Repair
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
              Exotic & ultra-luxury specialists. OEM parts. Pre-loss restorations. Priority for insured claims.
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              <Button
                onClick={() => setShowInsuranceForm(true)}
                className="cut-corner bg-gradient-to-r from-[#ECAC36] to-[#e6c766] hover:from-[#e6c766] hover:to-[#ECAC36] text-black font-semibold text-lg px-8 py-4 shadow-luxury-rest hover:shadow-luxury-hover transition-all duration-300"
              >
                <Shield className="mr-2 h-5 w-5" />
                Start Collision Repair (Insurance)
              </Button>
              <Button
                onClick={() => setShowCustomForm(true)}
                variant="outline"
                className="cut-corner border-2 border-[#ECAC36] text-[#ECAC36] hover:bg-[#ECAC36] hover:text-black font-semibold text-lg px-8 py-4 transition-all duration-300"
              >
                <Wrench className="mr-2 h-5 w-5" />
                Get Customization Quote
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Collision Repair Section */}
      <section className="py-20 relative">
        <div
          className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black to-gray-900"
          style={{ clipPath: "polygon(0 0, 100% 100%, 100% 0)" }}
        />

        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Collision Repair{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ECAC36] to-[#e6c766]">
                (Insurance Priority)
              </span>
            </h2>

            <div className="grid md:grid-cols-2 gap-8 text-left mt-12">
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#ECAC36] rotate-45 mr-4" />
                  <span className="text-lg">OEM parts & factory specifications</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#ECAC36] rotate-45 mr-4" />
                  <span className="text-lg">Aluminum & carbon fiber repairs</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#ECAC36] rotate-45 mr-4" />
                  <span className="text-lg">ADAS calibration & diagnostics</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#ECAC36] rotate-45 mr-4" />
                  <span className="text-lg">Factory paint matching</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#ECAC36] rotate-45 mr-4" />
                  <span className="text-lg">Direct insurer coordination</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#ECAC36] rotate-45 mr-4" />
                  <span className="text-lg">Enclosed transport available</span>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setShowInsuranceForm(true)}
              className="cut-corner bg-gradient-to-r from-[#ECAC36] to-[#e6c766] hover:from-[#e6c766] hover:to-[#ECAC36] text-black font-semibold text-lg px-8 py-4 mt-8"
            >
              Start Insurance Claim
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Customization & Protection Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Customization &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ECAC36] to-[#e6c766]">
                Protection
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {servicePackages.map((pkg) => (
              <Card
                key={pkg.id}
                className="bg-black/50 border-gray-800 cut-corner overflow-hidden group hover:border-[#ECAC36]/50 transition-all duration-300"
              >
                <div className="relative">
                  <img src={pkg.heroImage || "/placeholder.svg"} alt={pkg.title} className="w-full h-48 object-cover" />
                  {pkg.badges.length > 0 && (
                    <div className="absolute top-4 left-4">
                      {pkg.badges.map((badge) => (
                        <Badge key={badge} className="bg-[#ECAC36] text-black font-semibold">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{pkg.title}</h3>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-[#ECAC36]">
                      Starting at ${pkg.startingPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-400 mb-6">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Turnaround ~{pkg.estimatedTurnaroundDays} days</span>
                  </div>
                  <Button
                    onClick={() => handleGetQuote(pkg.category)}
                    className="w-full cut-corner bg-gradient-to-r from-[#ECAC36] to-[#e6c766] hover:from-[#e6c766] hover:to-[#ECAC36] text-black font-semibold"
                  >
                    Get Quote
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Capabilities Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ECAC36] to-[#e6c766]">
                Capabilities
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {capabilities.map((capability) => (
              <Card key={capability.id} className="bg-gradient-to-br from-gray-900 to-black border-gray-800 cut-corner">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4">{capability.title}</h3>
                  <p className="text-gray-300 mb-6">{capability.description}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {capability.oemBrands.map((brand) => (
                      <Badge key={brand} variant="outline" className="border-[#ECAC36] text-[#ECAC36]">
                        {brand}
                      </Badge>
                    ))}
                  </div>

                  <div className="space-y-2">
                    {capability.services.map((service) => (
                      <div key={service} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-[#ECAC36] mr-2" />
                        <span className="text-sm">{service}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              How it{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ECAC36] to-[#e6c766]">Works</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Submit Photos & VIN",
                description: "Upload damage photos and vehicle details for initial assessment",
                icon: Camera,
              },
              {
                step: "02",
                title: "Same-Day Estimate",
                description: "Receive detailed estimate and insurer coordination within hours",
                icon: FileText,
              },
              {
                step: "03",
                title: "OEM Parts & Repair",
                description: "Factory parts sourcing and expert repair/customization work",
                icon: Wrench,
              },
              {
                step: "04",
                title: "Delivery + Warranty",
                description: "Quality inspection, delivery, and comprehensive warranty coverage",
                icon: Award,
              },
            ].map((step) => (
              <div key={step.step} className="text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#ECAC36] to-[#e6c766] cut-corner mx-auto flex items-center justify-center">
                    <step.icon className="h-8 w-8 text-black" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-black cut-corner flex items-center justify-center">
                    <span className="text-[#ECAC36] font-bold text-sm">{step.step}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Logistics & Loaners Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Logistics &{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ECAC36] to-[#e6c766]">
                  Loaners
                </span>
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <Truck className="h-6 w-6 text-[#ECAC36] mr-4 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Enclosed Transport</h3>
                    <p className="text-gray-300">
                      Coordinated pickup and delivery with our enclosed transport partners. Your vehicle is protected
                      throughout the entire process.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Star className="h-6 w-6 text-[#ECAC36] mr-4 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Luxury Loaner Upgrade</h3>
                    <p className="text-gray-300">
                      Optional luxury rental upgrade available during repair period. Stay mobile in style while your
                      vehicle is being restored.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="/luxury-car-transport.png"
                alt="Enclosed transport"
                className="w-full h-80 object-cover cut-corner"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ & Compliance Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16">
              FAQ &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ECAC36] to-[#e6c766]">
                Compliance
              </span>
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {[
                {
                  question: "How do you handle deductibles?",
                  answer:
                    "We work directly with your insurance carrier to minimize out-of-pocket costs and can often arrange deductible assistance programs.",
                },
                {
                  question: "OEM vs aftermarket parts?",
                  answer:
                    "We exclusively use OEM parts for exotic and luxury vehicles to maintain value, warranty, and performance standards.",
                },
                {
                  question: "ADAS calibration process?",
                  answer:
                    "Our certified technicians use OEM-approved equipment to recalibrate all safety systems to factory specifications.",
                },
                {
                  question: "Insurance claim timelines?",
                  answer:
                    "Most estimates are provided within 24 hours, with repair timelines coordinated directly with your insurance adjuster.",
                },
              ].map((faq, index) => (
                <div key={index} className="bg-black/50 p-6 cut-corner">
                  <h3 className="text-lg font-semibold mb-3 text-[#ECAC36]">{faq.question}</h3>
                  <p className="text-gray-300">{faq.answer}</p>
                </div>
              ))}
            </div>

            <div className="text-center text-sm text-gray-400 bg-black/30 p-6 cut-corner">
              <p>
                We work with most carriers; final approvals subject to insurer inspection. Licensed and insured
                collision repair facility. All work backed by comprehensive warranty.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Drawer Components */}
      <InsuranceIntakeDrawer isOpen={showInsuranceForm} onClose={() => setShowInsuranceForm(false)} />

      <CustomizationQuoteDrawer
        isOpen={showCustomForm}
        onClose={() => setShowCustomForm(false)}
        preselectedService={selectedService}
      />
    </div>
  )
}

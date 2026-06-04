"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Loader2, MapPin, Clock, DollarSign } from "lucide-react"
import Link from "next/link"
import { updateInventoryItem, toggleFeaturedStatus } from "@/lib/inventory-actions"
import { ImageUpload } from "@/components/image-upload"
import { FocalPointPicker } from "@/components/admin/focal-point-picker"
import { AIReviewPanel } from "@/components/admin/ai-review-panel"
import { SeoPreviewPanel } from "@/components/admin/seo-preview-panel"
import { ImageSourceLinks, ImageSourceUrl, addImageSourceUrl, removeImageSourceUrl } from "@/components/image-source-links"
import type { ImageEntry } from "@/lib/image-types"
import { parseImageArray, getImageUrl } from "@/lib/image-types"
import { BulkImageImport } from "@/components/bulk-image-import"
import { SmugMugGalleryImport } from "@/components/smugmug-gallery-import"
import { toast } from "sonner"
import { CAR_BRAND_NAMES } from "@/lib/car-brands"
import { SERVICE_CITIES, SUGGESTED_TAGS } from "@/lib/seo-constants"

interface TourRoute {
  id: string
  title: string
  duration: string
}

interface CarData {
  id: string
  title: string
  subtitle?: string
  brand?: string
  description?: string
  pricePerDay?: string | number
  pricePerHour?: string | number
  images?: any[]
  focalPoint?: string
  flipHorizontal?: boolean
  flipVertical?: boolean
  smugmugUrl?: string
  imageSourceUrls?: ImageSourceUrl[]
  isPublished: boolean
  isFeatured: boolean
  slug?: string
  metaTitle?: string
  metaDescription?: string
  specifications?: {
    seats?: number
    transmission?: string
    bodyType?: string
    horsepower?: number
    acceleration?: string
    brand?: string
    drivetrain?: string
    engine?: string
    topSpeed?: number
    torque?: string
    doors?: number
    fuelType?: string
    year?: number
    make?: string
    model?: string
    trim?: string
    features?: string[]
    exteriorColor?: string
    interiorColor?: string
    highlights?: string[]
  }
  tour_enabled?: boolean
  tour_category?: string
  tour_max_passengers?: number
  tour_durations?: string[]
  tour_pickup_location?: string
  tour_pricing?: {
    perHour?: {
      pax1?: number
      pax2?: number
      pax3?: number
      pax4?: number
      allowPax4?: boolean
    }
  }
  tour_operating_hours?: Record<string, { start: string; end: string }>
  tour_routes?: string[]
  serviceCities?: string[]
  tags?: string[]
  transactionType?: string
}

interface EditCarFormProps {
  car: CarData
  routes: TourRoute[]
  returnUrl: string
}

export default function EditCarForm({ car, routes, returnUrl }: EditCarFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [images, setImages] = useState<ImageEntry[]>(parseImageArray(car.images))
  const [focalPoint, setFocalPoint] = useState(car.focalPoint || "50% 40%")
  const [flipHorizontal, setFlipHorizontal] = useState(car.flipHorizontal || false)
  const [flipVertical, setFlipVertical] = useState(car.flipVertical || false)
  const [isPublished, setIsPublished] = useState(car.isPublished || false)
  const [isFeatured, setIsFeatured] = useState(car.isFeatured || false)
  const [seats, setSeats] = useState(car.specifications?.seats?.toString() || "")
  const [transmission, setTransmission] = useState(car.specifications?.transmission || "")
  const [bodyType, setBodyType] = useState(car.specifications?.bodyType || "")
  const [smugmugUrl, setSmugmugUrl] = useState(car.smugmugUrl || "")
  const [imageSourceUrls, setImageSourceUrls] = useState<ImageSourceUrl[]>(car.imageSourceUrls || [])
  const [importing, setImporting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [hasUploadErrors, setHasUploadErrors] = useState(false)
  const [isBulkImporting, setIsBulkImporting] = useState(false)
  const [isGalleryImporting, setIsGalleryImporting] = useState(false)
  const [aiContentGenerated, setAiContentGenerated] = useState(car.aiContentGenerated || false)
  const [importError, setImportError] = useState<string | null>(null)
  const [title, setTitle] = useState(car.title || "")
  const [subtitle, setSubtitle] = useState(car.subtitle || "")
  const [description, setDescription] = useState(car.description || "")
  const [horsepower, setHorsepower] = useState(car.specifications?.horsepower?.toString() || "")
  const [acceleration, setAcceleration] = useState(car.specifications?.acceleration || "")
  const [brand, setBrand] = useState(car.brand || car.specifications?.brand || "")
  const [drivetrain, setDrivetrain] = useState(car.specifications?.drivetrain || "")
  const [engine, setEngine] = useState(car.specifications?.engine || "")
  const [topSpeed, setTopSpeed] = useState(car.specifications?.topSpeed?.toString() || "")
  const [torque, setTorque] = useState(car.specifications?.torque || "")
  const [doors, setDoors] = useState(car.specifications?.doors?.toString() || "")
  const [fuelType, setFuelType] = useState(car.specifications?.fuelType || "")
  const [year, setYear] = useState(car.specifications?.year?.toString() || "")
  const [make, setMake] = useState(car.specifications?.make || "")
  const [model, setModel] = useState(car.specifications?.model || "")
  const [trim, setTrim] = useState(car.specifications?.trim || "")
  const [features, setFeatures] = useState(car.specifications?.features?.join(", ") || "")
  const [exteriorColor, setExteriorColor] = useState(car.specifications?.exteriorColor || "")
  const [interiorColor, setInteriorColor] = useState(car.specifications?.interiorColor || "")
  const [highlights, setHighlights] = useState(car.specifications?.highlights?.join(", ") || "")
  const [seoTitle, setSeoTitle] = useState(car.metaTitle || "")
  const [seoDescription, setSeoDescription] = useState(car.metaDescription || "")
  const [serviceCities, setServiceCities] = useState<string[]>(car.serviceCities || ['miami'])
  const [tags, setTags] = useState<string[]>(car.tags || [])
  const [tagInput, setTagInput] = useState("")
  const [transactionType, setTransactionType] = useState(car.transactionType || 'rental')
  
  const CAR_BRANDS = CAR_BRAND_NAMES

  const handleSmugmugImport = async () => {
    if (!smugmugUrl || !smugmugUrl.trim()) {
      setImportError("Please enter a SmugMug URL")
      return
    }

    setImporting(true)
    setImportError(null)

    try {
      const response = await fetch("/api/smugmug/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: smugmugUrl.trim() }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to import images")
      }

      const { images: importedImages } = await response.json()
      const imageUrls: string[] = importedImages.map((img: any) => img.url)
      setImages([...images, ...imageUrls] as ImageEntry[])
      setImageSourceUrls(addImageSourceUrl(imageSourceUrls, smugmugUrl.trim(), "SmugMug"))
      setSmugmugUrl("")
      setImportError(null)
      toast.success(`Imported ${imageUrls.length} images from SmugMug`)
    } catch (err) {
      setImportError(err instanceof Error ? err.message : "Failed to import images")
    } finally {
      setImporting(false)
    }
  }

  const handleRemoveSourceUrl = (urlToRemove: string) => {
    setImageSourceUrls(removeImageSourceUrl(imageSourceUrls, urlToRemove))
  }

  const handleFeaturedToggle = (checked: boolean) => {
    setIsFeatured(checked)
    startTransition(() => {
      toggleFeaturedStatus(car.id, checked).then((result) => {
        if (result.error) {
          toast.error(result.error)
          setIsFeatured(!checked)
        } else {
          toast.success(checked ? "Car marked as featured" : "Car unmarked as featured")
          router.refresh()
        }
      })
    })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    console.log("[EditCarForm] Submitting with images:", JSON.stringify(images.length), "entries")
    
    const formData = new FormData(e.currentTarget)
    formData.append("images", JSON.stringify(images))
    formData.append("focal_point", focalPoint)
    formData.append("flip_horizontal", flipHorizontal.toString())
    formData.append("flip_vertical", flipVertical.toString())
    formData.append("image_source_urls", JSON.stringify(imageSourceUrls))
    formData.set("is_published", isPublished ? "true" : "false")
    formData.set("is_featured", isFeatured ? "true" : "false")
    formData.set("ai_content_generated", aiContentGenerated ? "true" : "false")
    if (seoTitle) formData.set("meta_title", seoTitle)
    if (seoDescription) formData.set("meta_description", seoDescription)

    console.log("[EditCarForm] FormData images value:", formData.get("images"))

    startTransition(() => {
      updateInventoryItem(car.id, null, formData).then((result) => {
        if (result.error) {
          setError(result.error)
          toast.error(result.error)
        } else if (result.success) {
          console.log("[EditCarForm] Save success, returned data:", JSON.stringify(result.data))
          toast.success("Car saved successfully")
          router.refresh()
        }
      })
    })
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <Link href={returnUrl}>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Cars
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Edit {car.title}</h1>
              <p className="text-gray-400">Update car details and tour settings</p>
            </div>
          </div>
          <AIReviewPanel
            category="car"
            currentValues={{
              title,
              subtitle,
              brand,
              description,
              pricePerDay: car.pricePerDay,
              images,
              slug: car.slug,
              specifications: {
                year: year ? parseInt(year) : undefined,
                make,
                model,
                trim,
                seats: seats ? parseInt(seats) : undefined,
                doors: doors ? parseInt(doors) : undefined,
                transmission,
                bodyType,
                drivetrain,
                engine,
                horsepower: horsepower ? parseInt(horsepower) : undefined,
                torque,
                acceleration,
                topSpeed: topSpeed ? parseInt(topSpeed) : undefined,
                fuelType,
                features: features ? features.split(",").map((f: string) => f.trim()).filter(Boolean) : undefined,
                exteriorColor,
                interiorColor,
                highlights: highlights ? highlights.split(",").map((h: string) => h.trim()).filter(Boolean) : undefined,
              },
            }}
            onApply={(updates) => {
              setAiContentGenerated(true)
              if (updates.description) setDescription(updates.description)
              if (updates.seoTitle) setSeoTitle(updates.seoTitle)
              if (updates.seoDescription) setSeoDescription(updates.seoDescription)
              if (updates.specifications) {
                const s = updates.specifications
                if (s.year !== undefined) setYear(s.year.toString())
                if (s.make !== undefined) setMake(s.make)
                if (s.model !== undefined) setModel(s.model)
                if (s.trim !== undefined) setTrim(s.trim)
                if (s.seats !== undefined) setSeats(s.seats.toString())
                if (s.doors !== undefined) setDoors(s.doors.toString())
                if (s.transmission !== undefined) setTransmission(s.transmission)
                if (s.bodyType !== undefined) setBodyType(s.bodyType)
                if (s.drivetrain !== undefined) setDrivetrain(s.drivetrain)
                if (s.engine !== undefined) setEngine(s.engine)
                if (s.horsepower !== undefined) setHorsepower(s.horsepower.toString())
                if (s.torque !== undefined) setTorque(s.torque)
                if (s.acceleration !== undefined) setAcceleration(s.acceleration)
                if (s.topSpeed !== undefined) setTopSpeed(s.topSpeed.toString())
                if (s.fuelType !== undefined) setFuelType(s.fuelType)
                if (s.exteriorColor !== undefined) setExteriorColor(s.exteriorColor)
                if (s.interiorColor !== undefined) setInteriorColor(s.interiorColor)
                if (Array.isArray(s.features)) setFeatures(s.features.join(", "))
                if (Array.isArray(s.highlights)) setHighlights(s.highlights.join(", "))
              }
            }}
          />
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 cut-corner">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="hidden" name="category" value="car" />
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-[#111111] border border-[#333333]">
              <TabsTrigger value="basic" className="text-gray-300 data-[state=active]:bg-[#ECAC36] data-[state=active]:text-black">
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="tours" className="text-gray-300 data-[state=active]:bg-[#ECAC36] data-[state=active]:text-black">
                Tours
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-gray-300 data-[state=active]:bg-[#ECAC36] data-[state=active]:text-black">
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <Card className="bg-[#111111] border-[#333333] cut-corner">
                <CardHeader>
                  <CardTitle className="text-white">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-gray-300">
                        Car Title *
                      </Label>
                      <Input
                        id="title"
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="bg-[#0A0A0A] border-[#333333] text-white cut-corner"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="brand" className="text-gray-300">
                        Brand *
                      </Label>
                      <input type="hidden" name="brand" value={brand} />
                      <Select value={brand} onValueChange={setBrand}>
                        <SelectTrigger className="bg-[#0A0A0A] border-[#333333] text-white cut-corner">
                          <SelectValue placeholder="Select brand" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#111111] border-[#333333]">
                          {CAR_BRANDS.map((b) => (
                            <SelectItem key={b} value={b} className="text-white hover:bg-[#222222]">
                              {b}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subtitle" className="text-gray-300">
                        Color / Interior
                      </Label>
                      <Input
                        id="subtitle"
                        name="subtitle"
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        className="bg-[#0A0A0A] border-[#333333] text-white cut-corner"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-gray-300">
                      Description (HTML supported)
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={6}
                      className="bg-[#0A0A0A] border-[#333333] text-white cut-corner font-mono text-sm"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#111111] border-[#333333] cut-corner">
                <CardHeader>
                  <CardTitle className="text-white">SEO Metadata</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="meta_title" className="text-gray-300">SEO Title</Label>
                        <span className={`text-xs ${seoTitle.length >= 55 && seoTitle.length <= 60 ? "text-green-400" : seoTitle.length > 0 ? "text-yellow-400" : "text-gray-500"}`}>
                          {seoTitle.length}/60
                        </span>
                      </div>
                      <Input
                        id="meta_title"
                        name="meta_title"
                        value={seoTitle}
                        onChange={(e) => setSeoTitle(e.target.value)}
                        placeholder="SEO-optimized title (55-60 chars)"
                        className="bg-[#0A0A0A] border-[#333333] text-white cut-corner"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="meta_description" className="text-gray-300">Meta Description</Label>
                        <span className={`text-xs ${seoDescription.length >= 150 && seoDescription.length <= 160 ? "text-green-400" : seoDescription.length > 0 ? "text-yellow-400" : "text-gray-500"}`}>
                          {seoDescription.length}/160
                        </span>
                      </div>
                      <Textarea
                        id="meta_description"
                        name="meta_description"
                        value={seoDescription}
                        onChange={(e) => setSeoDescription(e.target.value)}
                        placeholder="Compelling meta description (150-160 chars)"
                        rows={2}
                        className="bg-[#0A0A0A] border-[#333333] text-white cut-corner"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#111111] border-[#333333] cut-corner">
                <CardHeader>
                  <CardTitle className="text-white">Pricing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price_per_day" className="text-gray-300">
                        Price per Day ($) *
                      </Label>
                      <Input
                        id="price_per_day"
                        name="price_per_day"
                        type="number"
                        step="0.01"
                        defaultValue={car.pricePerDay}
                        required
                        className="bg-[#0A0A0A] border-[#333333] text-white cut-corner"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price_per_hour" className="text-gray-300">
                        Price per Hour ($)
                      </Label>
                      <Input
                        id="price_per_hour"
                        name="price_per_hour"
                        type="number"
                        step="0.01"
                        defaultValue={car.pricePerHour}
                        className="bg-[#0A0A0A] border-[#333333] text-white cut-corner"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#111111] border-[#333333] cut-corner">
                <CardHeader>
                  <CardTitle className="text-white">Images</CardTitle>
                </CardHeader>
                <CardContent>
                  <ImageUpload images={images} setImages={setImages} onUploadingChange={setIsUploading} onHasErrors={setHasUploadErrors} itemTitle={title || 'car'} />
                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <BulkImageImport
                      onImagesImported={(urls) => setImages(prev => [...prev, ...urls])}
                      onImportingChange={setIsBulkImporting}
                      existingSingleImport={
                        <div className="space-y-2">
                          <Label htmlFor="smugmug_url" className="text-gray-300">
                            Import from SmugMug Gallery URL
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              id="smugmug_url"
                              name="smugmug_url"
                              type="url"
                              value={smugmugUrl}
                              onChange={(e) => setSmugmugUrl(e.target.value)}
                              placeholder="https://smugmug.com/gallery/..."
                              className="bg-[#0A0A0A] border-[#333333] text-white cut-corner flex-1"
                            />
                            <Button
                              type="button"
                              onClick={handleSmugmugImport}
                              disabled={importing || !smugmugUrl.trim()}
                              className="bg-[#ECAC36] hover:bg-[#B8860B] text-black font-bold cut-corner"
                            >
                              {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Import"}
                            </Button>
                          </div>
                          {importError && (
                            <p className="text-sm text-red-400">{importError}</p>
                          )}
                        </div>
                      }
                    />
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <SmugMugGalleryImport
                      onImagesImported={(urls) => setImages(prev => [...prev, ...urls])}
                      onImportingChange={setIsGalleryImporting}
                      existingSourceUrls={imageSourceUrls.map(s => s.url)}
                      onSourceUrlsChange={(newUrls) => {
                        setImageSourceUrls(prev => {
                          const existingUrlSet = new Set(prev.map(s => s.url))
                          const toAdd = newUrls.filter(url => !existingUrlSet.has(url))
                          const newSources: ImageSourceUrl[] = toAdd.map(url => ({
                            url,
                            source: url.includes('smugmug.com') ? 'SmugMug Gallery' : 'Import',
                            addedAt: new Date().toISOString()
                          }))
                          return [...prev, ...newSources]
                        })
                      }}
                    />
                  </div>

                  {imageSourceUrls.length > 0 && (
                    <div className="mt-4">
                      <ImageSourceLinks 
                        urls={imageSourceUrls} 
                        onRemove={handleRemoveSourceUrl}
                      />
                    </div>
                  )}

                  {images.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-700">
                      <FocalPointPicker
                        imageUrl={images[0]}
                        initialFocalPoint={focalPoint}
                        initialFlipHorizontal={flipHorizontal}
                        initialFlipVertical={flipVertical}
                        onChange={setFocalPoint}
                        onFlipChange={(h, v) => {
                          setFlipHorizontal(h)
                          setFlipVertical(v)
                        }}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-[#111111] border-[#333333] cut-corner">
                <CardHeader>
                  <CardTitle className="text-white">Specifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="year" className="text-gray-300">Year</Label>
                      <Input id="year" name="year" type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="2024" className="bg-[#0A0A0A] border-[#333333] text-white cut-corner" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="make" className="text-gray-300">Make</Label>
                      <Input id="make" name="make" value={make} onChange={(e) => setMake(e.target.value)} placeholder="Lamborghini" className="bg-[#0A0A0A] border-[#333333] text-white cut-corner" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model" className="text-gray-300">Model</Label>
                      <Input id="model" name="model" value={model} onChange={(e) => setModel(e.target.value)} placeholder="Huracán" className="bg-[#0A0A0A] border-[#333333] text-white cut-corner" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="trim" className="text-gray-300">Trim</Label>
                      <Input id="trim" name="trim" value={trim} onChange={(e) => setTrim(e.target.value)} placeholder="EVO Spyder" className="bg-[#0A0A0A] border-[#333333] text-white cut-corner" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="seats" className="text-gray-300">Seats *</Label>
                      <Select value={seats} onValueChange={setSeats} required>
                        <SelectTrigger className="bg-[#0A0A0A] border-[#333333] text-white cut-corner">
                          <SelectValue placeholder="Select seats" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#111111] border-[#333333]">
                          <SelectItem value="2">2 Seats</SelectItem>
                          <SelectItem value="4">4 Seats</SelectItem>
                          <SelectItem value="5">5 Seats</SelectItem>
                          <SelectItem value="7">7 Seats</SelectItem>
                        </SelectContent>
                      </Select>
                      <input type="hidden" name="seats" value={seats} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="doors" className="text-gray-300">Doors</Label>
                      <Select value={doors} onValueChange={setDoors}>
                        <SelectTrigger className="bg-[#0A0A0A] border-[#333333] text-white cut-corner">
                          <SelectValue placeholder="Select doors" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#111111] border-[#333333]">
                          <SelectItem value="2">2 Doors</SelectItem>
                          <SelectItem value="4">4 Doors</SelectItem>
                          <SelectItem value="5">5 Doors</SelectItem>
                        </SelectContent>
                      </Select>
                      <input type="hidden" name="doors" value={doors} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="body_type" className="text-gray-300">Body Type *</Label>
                      <Select value={bodyType} onValueChange={setBodyType} required>
                        <SelectTrigger className="bg-[#0A0A0A] border-[#333333] text-white cut-corner">
                          <SelectValue placeholder="Select body type" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#111111] border-[#333333]">
                          <SelectItem value="coupe">Coupe</SelectItem>
                          <SelectItem value="convertible">Convertible</SelectItem>
                          <SelectItem value="suv">SUV</SelectItem>
                          <SelectItem value="sedan">Sedan</SelectItem>
                          <SelectItem value="roadster">Roadster</SelectItem>
                          <SelectItem value="supercar">Supercar</SelectItem>
                          <SelectItem value="wagon">Wagon</SelectItem>
                          <SelectItem value="hatchback">Hatchback</SelectItem>
                        </SelectContent>
                      </Select>
                      <input type="hidden" name="body_type" value={bodyType} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="transmission" className="text-gray-300">Transmission *</Label>
                      <Input id="transmission" name="transmission" value={transmission} onChange={(e) => setTransmission(e.target.value)} placeholder="8-Speed Automatic" className="bg-[#0A0A0A] border-[#333333] text-white cut-corner" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="drivetrain" className="text-gray-300">Drivetrain</Label>
                      <Select value={drivetrain} onValueChange={setDrivetrain}>
                        <SelectTrigger className="bg-[#0A0A0A] border-[#333333] text-white cut-corner">
                          <SelectValue placeholder="Select drivetrain" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#111111] border-[#333333]">
                          <SelectItem value="RWD">RWD</SelectItem>
                          <SelectItem value="AWD">AWD</SelectItem>
                          <SelectItem value="4WD">4WD</SelectItem>
                          <SelectItem value="FWD">FWD</SelectItem>
                          <SelectItem value="4MATIC">4MATIC</SelectItem>
                          <SelectItem value="xDrive">xDrive</SelectItem>
                        </SelectContent>
                      </Select>
                      <input type="hidden" name="drivetrain" value={drivetrain} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fuelType" className="text-gray-300">Fuel Type</Label>
                      <Select value={fuelType} onValueChange={setFuelType}>
                        <SelectTrigger className="bg-[#0A0A0A] border-[#333333] text-white cut-corner">
                          <SelectValue placeholder="Select fuel type" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#111111] border-[#333333]">
                          <SelectItem value="Gasoline">Gasoline</SelectItem>
                          <SelectItem value="Diesel">Diesel</SelectItem>
                          <SelectItem value="Electric">Electric</SelectItem>
                          <SelectItem value="Hybrid">Hybrid</SelectItem>
                          <SelectItem value="Plug-in Hybrid">Plug-in Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                      <input type="hidden" name="fuelType" value={fuelType} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="engine" className="text-gray-300">Engine</Label>
                      <Input id="engine" name="engine" value={engine} onChange={(e) => setEngine(e.target.value)} placeholder="4.0L Twin-Turbo V8" className="bg-[#0A0A0A] border-[#333333] text-white cut-corner" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="horsepower" className="text-gray-300">Horsepower</Label>
                      <Input id="horsepower" name="horsepower" type="number" value={horsepower} onChange={(e) => setHorsepower(e.target.value)} placeholder="986" className="bg-[#0A0A0A] border-[#333333] text-white cut-corner" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="torque" className="text-gray-300">Torque</Label>
                      <Input id="torque" name="torque" value={torque} onChange={(e) => setTorque(e.target.value)} placeholder="553 lb-ft" className="bg-[#0A0A0A] border-[#333333] text-white cut-corner" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="acceleration" className="text-gray-300">0-60 mph</Label>
                      <Input id="acceleration" name="acceleration" value={acceleration} onChange={(e) => setAcceleration(e.target.value)} placeholder="2.5s" className="bg-[#0A0A0A] border-[#333333] text-white cut-corner" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="topSpeed" className="text-gray-300">Top Speed (mph)</Label>
                      <Input id="topSpeed" name="topSpeed" type="number" value={topSpeed} onChange={(e) => setTopSpeed(e.target.value)} placeholder="205" className="bg-[#0A0A0A] border-[#333333] text-white cut-corner" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="exteriorColor" className="text-gray-300">Exterior Color</Label>
                      <Input id="exteriorColor" name="exteriorColor" value={exteriorColor} onChange={(e) => setExteriorColor(e.target.value)} placeholder="Grigio Titans" className="bg-[#0A0A0A] border-[#333333] text-white cut-corner" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="interiorColor" className="text-gray-300">Interior Color</Label>
                      <Input id="interiorColor" name="interiorColor" value={interiorColor} onChange={(e) => setInteriorColor(e.target.value)} placeholder="Nero Ade" className="bg-[#0A0A0A] border-[#333333] text-white cut-corner" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="features" className="text-gray-300">Features (comma-separated)</Label>
                    <Textarea id="features" name="features" value={features} onChange={(e) => setFeatures(e.target.value)} placeholder="Carbon ceramic brakes, Adaptive suspension, Launch control" rows={2} className="bg-[#0A0A0A] border-[#333333] text-white cut-corner" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="highlights" className="text-gray-300">Highlights (3-6 items, comma-separated)</Label>
                    <Input id="highlights" name="highlights" value={highlights} onChange={(e) => setHighlights(e.target.value)} placeholder="Twin-Turbo V8, 0-60 in 2.5s, Carbon Fiber Package" className="bg-[#0A0A0A] border-[#333333] text-white cut-corner" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#111111] border-[#333333] cut-corner">
                <CardHeader>
                  <CardTitle className="text-white">Service & Location</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-gray-300">Service Cities</Label>
                    <p className="text-sm text-gray-400">Select cities where this car is available</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {SERVICE_CITIES.map((city) => (
                        <label key={city.slug} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={serviceCities.includes(city.slug)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setServiceCities([...serviceCities, city.slug])
                              } else {
                                setServiceCities(serviceCities.filter((c) => c !== city.slug))
                              }
                            }}
                            className="rounded border-[#333333] bg-[#0A0A0A] text-[#ECAC36]"
                          />
                          <span className="text-gray-300 text-sm">{city.name}</span>
                        </label>
                      ))}
                    </div>
                    <input type="hidden" name="service_cities" value={JSON.stringify(serviceCities)} />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-gray-300">Transaction Type</Label>
                    <div className="flex items-center space-x-6">
                      {[
                        { value: 'rental', label: 'Rental' },
                        { value: 'sale', label: 'Sale' },
                        { value: 'both', label: 'Both' },
                      ].map((option) => (
                        <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="transaction_type_radio"
                            value={option.value}
                            checked={transactionType === option.value}
                            onChange={() => setTransactionType(option.value)}
                            className="border-[#333333] bg-[#0A0A0A] text-[#ECAC36]"
                          />
                          <span className="text-gray-300 text-sm">{option.label}</span>
                        </label>
                      ))}
                    </div>
                    <input type="hidden" name="transaction_type" value={transactionType} />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-gray-300">Tags</Label>
                    <p className="text-sm text-gray-400">Add tags for categorization and SEO</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#ECAC36]/20 text-[#ECAC36] text-sm border border-[#ECAC36]/30"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => setTags(tags.filter((t) => t !== tag))}
                            className="ml-1 hover:text-white"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && tagInput.trim()) {
                            e.preventDefault()
                            const newTag = tagInput.trim().toLowerCase()
                            if (!tags.includes(newTag)) {
                              setTags([...tags, newTag])
                            }
                            setTagInput("")
                          }
                        }}
                        placeholder="Type a tag and press Enter"
                        className="bg-[#0A0A0A] border-[#333333] text-white cut-corner"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs text-gray-400 mr-1">Suggested:</span>
                      {SUGGESTED_TAGS.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            if (!tags.includes(tag)) {
                              setTags([...tags, tag])
                            }
                          }}
                          className={`px-2 py-0.5 rounded-full text-xs border ${
                            tags.includes(tag)
                              ? 'bg-[#ECAC36]/20 text-[#ECAC36] border-[#ECAC36]/30'
                              : 'bg-[#1A1A1A] text-gray-400 border-[#333333] hover:border-[#ECAC36]/50 hover:text-gray-300'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                    <input type="hidden" name="tags" value={JSON.stringify(tags)} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tours" className="space-y-6">
              <Card className="bg-[#111111] border-[#333333] cut-corner">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-[#ECAC36]" />
                    Tour Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="tour_enabled" className="text-gray-300">
                        Enable Tours
                      </Label>
                      <p className="text-sm text-gray-400">Allow this car to be booked for ride-along tours</p>
                    </div>
                    <Switch id="tour_enabled" name="tour_enabled" defaultChecked={car.tour_enabled} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tour_category" className="text-gray-300">
                        Tour Category *
                      </Label>
                      <Select name="tour_category" defaultValue={car.tour_category}>
                        <SelectTrigger className="bg-[#0A0A0A] border-[#333333] text-white cut-corner">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#111111] border-[#333333]">
                          <SelectItem value="twoSeaterConvertible">Two-Seater Convertible</SelectItem>
                          <SelectItem value="fourFiveSeater">Four/Five-Seater</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tour_max_passengers" className="text-gray-300">
                        Max Passengers
                      </Label>
                      <Input
                        id="tour_max_passengers"
                        name="tour_max_passengers"
                        type="number"
                        min="1"
                        max="5"
                        defaultValue={car.tour_max_passengers || 1}
                        className="bg-[#0A0A0A] border-[#333333] text-white cut-corner"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Available Durations</Label>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="duration_1h"
                          name="tour_durations"
                          value="1h"
                          defaultChecked={car.tour_durations?.includes("1h")}
                          className="border-[#333333]"
                        />
                        <Label htmlFor="duration_1h" className="text-gray-300">
                          1 Hour
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="duration_2h"
                          name="tour_durations"
                          value="2h"
                          defaultChecked={car.tour_durations?.includes("2h")}
                          className="border-[#333333]"
                        />
                        <Label htmlFor="duration_2h" className="text-gray-300">
                          2 Hours
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tour_pickup_location" className="text-gray-300">
                      Pickup Location
                    </Label>
                    <Input
                      id="tour_pickup_location"
                      name="tour_pickup_location"
                      defaultValue={car.tour_pickup_location || "Luxx Brickell, Miami, FL"}
                      className="bg-[#0A0A0A] border-[#333333] text-white cut-corner"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#111111] border-[#333333] cut-corner">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-[#ECAC36]" />
                    Tour Pricing (Per Hour)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pricing_pax1" className="text-gray-300">
                        1 Passenger ($)
                      </Label>
                      <Input
                        id="pricing_pax1"
                        name="pricing_pax1"
                        type="number"
                        step="0.01"
                        defaultValue={car.tour_pricing?.perHour?.pax1 || 300}
                        className="bg-[#0A0A0A] border-[#333333] text-white cut-corner"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pricing_pax2" className="text-gray-300">
                        2 Passengers ($)
                      </Label>
                      <Input
                        id="pricing_pax2"
                        name="pricing_pax2"
                        type="number"
                        step="0.01"
                        defaultValue={car.tour_pricing?.perHour?.pax2 || 225}
                        className="bg-[#0A0A0A] border-[#333333] text-white cut-corner"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pricing_pax3" className="text-gray-300">
                        3 Passengers ($)
                      </Label>
                      <Input
                        id="pricing_pax3"
                        name="pricing_pax3"
                        type="number"
                        step="0.01"
                        defaultValue={car.tour_pricing?.perHour?.pax3 || 175}
                        className="bg-[#0A0A0A] border-[#333333] text-white cut-corner"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pricing_pax4" className="text-gray-300">
                        4 Passengers ($)
                      </Label>
                      <Input
                        id="pricing_pax4"
                        name="pricing_pax4"
                        type="number"
                        step="0.01"
                        defaultValue={car.tour_pricing?.perHour?.pax4 || 150}
                        className="bg-[#0A0A0A] border-[#333333] text-white cut-corner"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="allow_pax4" className="text-gray-300">
                        Allow 4 Passengers
                      </Label>
                      <p className="text-sm text-gray-400">Enable 4-passenger bookings for this car</p>
                    </div>
                    <Switch id="allow_pax4" name="allow_pax4" defaultChecked={car.tour_pricing?.perHour?.allowPax4} />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#111111] border-[#333333] cut-corner">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="h-5 w-5 text-[#ECAC36]" />
                    Operating Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
                    <div key={day} className="grid grid-cols-3 gap-4 items-center">
                      <Label className="text-gray-300 capitalize">{day}</Label>
                      <Input
                        name={`hours_${day}_start`}
                        type="time"
                        defaultValue={car.tour_operating_hours?.[day]?.start || "09:00"}
                        className="bg-[#0A0A0A] border-[#333333] text-white cut-corner"
                      />
                      <Input
                        name={`hours_${day}_end`}
                        type="time"
                        defaultValue={car.tour_operating_hours?.[day]?.end || "18:00"}
                        className="bg-[#0A0A0A] border-[#333333] text-white cut-corner"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-[#111111] border-[#333333] cut-corner">
                <CardHeader>
                  <CardTitle className="text-white">Available Routes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {routes.map((route) => (
                      <div key={route.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`route_${route.id}`}
                          name="tour_routes"
                          value={route.id}
                          defaultChecked={car.tour_routes?.includes(route.id)}
                          className="border-[#333333]"
                        />
                        <Label htmlFor={`route_${route.id}`} className="text-gray-300">
                          {route.title} ({route.duration})
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <SeoPreviewPanel
                category="car"
                brand={brand}
                model={model}
                bodyType={bodyType}
                serviceCities={serviceCities}
                tags={tags}
              />

              <Card className="bg-[#111111] border-[#333333] cut-corner">
                <CardHeader>
                  <CardTitle className="text-white">Publishing Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="is_published" className="text-gray-300">
                        Published
                      </Label>
                      <p className="text-sm text-gray-400">Make this car visible on the website</p>
                    </div>
                    <Switch 
                      id="is_published" 
                      checked={isPublished}
                      onCheckedChange={setIsPublished}
                    />
                    <input type="hidden" name="is_published" value={isPublished ? "true" : "false"} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="is_featured" className="text-gray-300">
                        Featured
                      </Label>
                      <p className="text-sm text-gray-400">Show this car in featured sections</p>
                    </div>
                    <Switch 
                      id="is_featured" 
                      checked={isFeatured}
                      onCheckedChange={handleFeaturedToggle}
                      disabled={isPending}
                    />
                    <input type="hidden" name="is_featured" value={isFeatured ? "true" : "false"} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex items-center justify-end space-x-4">
            <Link href="/admin/cars">
              <Button
                variant="outline"
                className="border-[#333333] text-gray-300 hover:bg-[#222222] cut-corner bg-transparent"
              >
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isPending || isUploading || hasUploadErrors || isBulkImporting || isGalleryImporting}
              className="bg-[#ECAC36] hover:bg-[#B8860B] text-black font-bold cut-corner"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : hasUploadErrors ? (
                "Fix upload errors first"
              ) : isUploading ? (
                "Uploading images..."
              ) : isBulkImporting || isGalleryImporting ? (
                "Importing images..."
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { createInventoryItem } from "@/lib/inventory-actions"
import { useRouter } from "next/navigation"
import { ImageUpload } from "@/components/image-upload"
import { GenerateDescriptionButton } from "@/components/admin/generate-description-button"
import { SeoPreviewPanel } from "@/components/admin/seo-preview-panel"
import { CAR_BRAND_NAMES } from "@/lib/car-brands"
import { SERVICE_CITIES, SUGGESTED_TAGS } from "@/lib/seo-constants"

export default function CreateCarPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [isPublished, setIsPublished] = useState(false)
  const [isFeatured, setIsFeatured] = useState(false)
  const [seats, setSeats] = useState("")
  const [transmission, setTransmission] = useState("")
  const [bodyType, setBodyType] = useState("")
  const [brand, setBrand] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [hasUploadErrors, setHasUploadErrors] = useState(false)
  const [description, setDescription] = useState("")
  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const [horsepower, setHorsepower] = useState("")
  const [acceleration, setAcceleration] = useState("")
  const [serviceCities, setServiceCities] = useState<string[]>(['miami'])
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [transactionType, setTransactionType] = useState('rental')
  
  const CAR_BRANDS = CAR_BRAND_NAMES

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)
    formData.append("images", JSON.stringify(images))

    startTransition(() => {
      createInventoryItem(null, formData).then((result) => {
        if (result.error) {
          setError(result.error)
        } else if (result.success) {
          router.push("/admin/cars")
        }
      })
    })
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link href="/admin/cars">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cars
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Add New Car</h1>
            <p className="text-gray-400">Create a new luxury car listing</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="hidden" name="category" value="car" />

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 cut-corner">
              {error}
            </div>
          )}

          {/* Basic Information */}
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
                    placeholder="Ferrari SF90 Stradale"
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
                    placeholder="Red / Black"
                    className="bg-[#0A0A0A] border-[#333333] text-white cut-corner"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="description" className="text-gray-300">
                    Description
                  </Label>
                  <GenerateDescriptionButton
                    category="car"
                    getFormData={() => ({
                      title,
                      subtitle,
                      specifications: {
                        horsepower,
                        acceleration,
                        transmission,
                        bodyType,
                        seats,
                      },
                    })}
                    onGenerated={setDescription}
                  />
                </div>
                <Textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the car's features and luxury amenities..."
                  rows={4}
                  className="bg-[#0A0A0A] border-[#333333] text-white cut-corner"
                />
              </div>
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card className="bg-[#111111] border-[#333333] cut-corner">
            <CardHeader>
              <CardTitle className="text-white">Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="seats" className="text-gray-300">
                    Seats *
                  </Label>
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
                  <Label htmlFor="transmission" className="text-gray-300">
                    Transmission *
                  </Label>
                  <Select value={transmission} onValueChange={setTransmission} required>
                    <SelectTrigger className="bg-[#0A0A0A] border-[#333333] text-white cut-corner">
                      <SelectValue placeholder="Select transmission" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111111] border-[#333333]">
                      <SelectItem value="auto">Automatic</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                  <input type="hidden" name="transmission" value={transmission} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="body_type" className="text-gray-300">
                    Body Type *
                  </Label>
                  <Select value={bodyType} onValueChange={setBodyType} required>
                    <SelectTrigger className="bg-[#0A0A0A] border-[#333333] text-white cut-corner">
                      <SelectValue placeholder="Select body type" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111111] border-[#333333]">
                      <SelectItem value="coupe">Coupe</SelectItem>
                      <SelectItem value="convertible">Convertible</SelectItem>
                      <SelectItem value="suv">SUV</SelectItem>
                      <SelectItem value="sedan">Sedan</SelectItem>
                    </SelectContent>
                  </Select>
                  <input type="hidden" name="body_type" value={bodyType} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="horsepower" className="text-gray-300">
                    Horsepower
                  </Label>
                  <Input
                    id="horsepower"
                    name="horsepower"
                    type="number"
                    value={horsepower}
                    onChange={(e) => setHorsepower(e.target.value)}
                    placeholder="986"
                    className="bg-[#0A0A0A] border-[#333333] text-white cut-corner"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="acceleration" className="text-gray-300">
                    0-60 mph
                  </Label>
                  <Input
                    id="acceleration"
                    name="acceleration"
                    value={acceleration}
                    onChange={(e) => setAcceleration(e.target.value)}
                    placeholder="2.5s"
                    className="bg-[#0A0A0A] border-[#333333] text-white cut-corner"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service & Location */}
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

          {/* Pricing */}
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
                    placeholder="1995.00"
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
                    placeholder="299.00"
                    className="bg-[#0A0A0A] border-[#333333] text-white cut-corner"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Media */}
          <Card className="bg-[#111111] border-[#333333] cut-corner">
            <CardHeader>
              <CardTitle className="text-white">Media</CardTitle>
              <p className="text-sm text-gray-400 mt-1">
                Upload images directly or import from SmugMug gallery
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <ImageUpload value={images} onChange={setImages} maxImages={100} label="Car Images" onUploadingChange={setIsUploading} onHasErrors={setHasUploadErrors} />
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-[#333333]" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#111111] px-2 text-gray-400">Or import from SmugMug</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="smugmug_url" className="text-gray-300">
                  SmugMug Gallery URL
                </Label>
                <Input
                  id="smugmug_url"
                  name="smugmug_url"
                  type="url"
                  placeholder="https://cars-m.smugmug.com/AVAILABLE-CARS/Lamborghini-Huracan-White"
                  className="bg-[#0A0A0A] border-[#333333] text-white cut-corner"
                />
                <p className="text-xs text-gray-500">
                  Paste the full SmugMug gallery URL. All images will be automatically imported from the gallery.
                </p>
              </div>
            </CardContent>
          </Card>

          <SeoPreviewPanel
            category="car"
            brand={brand}
            model=""
            bodyType={bodyType}
            serviceCities={serviceCities}
            tags={tags}
          />

          {/* Publishing Options */}
          <Card className="bg-[#111111] border-[#333333] cut-corner">
            <CardHeader>
              <CardTitle className="text-white">Publishing Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="is_published" className="text-gray-300">
                    Publish immediately
                  </Label>
                  <p className="text-sm text-gray-400">Make this car visible on the website</p>
                </div>
                <Switch 
                  id="is_published" 
                  checked={isPublished}
                  onCheckedChange={setIsPublished}
                />
              </div>
              <input type="hidden" name="is_published" value={isPublished ? "true" : "false"} />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="is_featured" className="text-gray-300">
                    Featured car
                  </Label>
                  <p className="text-sm text-gray-400">Show this car in featured sections</p>
                </div>
                <Switch 
                  id="is_featured"
                  checked={isFeatured}
                  onCheckedChange={setIsFeatured}
                />
              </div>
              <input type="hidden" name="is_featured" value={isFeatured ? "true" : "false"} />
            </CardContent>
          </Card>

          {/* Actions */}
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
              disabled={isPending || isUploading || hasUploadErrors}
              className="bg-[#ECAC36] hover:bg-[#B8860B] text-black font-bold cut-corner"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : hasUploadErrors ? (
                "Fix upload errors first"
              ) : isUploading ? (
                "Uploading images..."
              ) : (
                "Create Car"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

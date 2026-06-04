"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { updateInventoryItem, toggleFeaturedStatus } from "@/lib/inventory-actions"
import { ImageUpload } from "@/components/image-upload"
import { FocalPointPicker } from "@/components/admin/focal-point-picker"
import { GenerateDescriptionButton } from "@/components/admin/generate-description-button"
import { EnrichInventoryButton } from "@/components/admin/enrich-inventory-button"
import { ImageSourceLinks, ImageSourceUrl, addImageSourceUrl, removeImageSourceUrl } from "@/components/image-source-links"
import { BulkImageImport } from "@/components/bulk-image-import"
import { SmugMugGalleryImport } from "@/components/smugmug-gallery-import"
import { toast } from "sonner"

interface HouseData {
  id: string
  title: string
  subtitle?: string
  description?: string
  pricePerDay?: string | number
  images?: string[]
  focalPoint?: string
  flipHorizontal?: boolean
  flipVertical?: boolean
  smugmugUrl?: string
  imageSourceUrls?: ImageSourceUrl[]
  isPublished: boolean
  isFeatured: boolean
  specifications?: {
    bedrooms?: number
    bathrooms?: number
    guests?: number
    securityDeposit?: string | number
    cleaningFee?: string | number
  }
}

interface EditHouseFormProps {
  house: HouseData
  returnUrl: string
}

export default function EditHouseForm({ house, returnUrl }: EditHouseFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [images, setImages] = useState<string[]>(house.images || [])
  const [focalPoint, setFocalPoint] = useState(house.focalPoint || "50% 40%")
  const [flipHorizontal, setFlipHorizontal] = useState(house.flipHorizontal || false)
  const [flipVertical, setFlipVertical] = useState(house.flipVertical || false)
  const [isPublished, setIsPublished] = useState(house.isPublished || false)
  const [isFeatured, setIsFeatured] = useState(house.isFeatured || false)
  const [smugmugUrl, setSmugmugUrl] = useState(house.smugmugUrl || "")
  const [imageSourceUrls, setImageSourceUrls] = useState<ImageSourceUrl[]>(house.imageSourceUrls || [])
  const [importing, setImporting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [hasUploadErrors, setHasUploadErrors] = useState(false)
  const [isBulkImporting, setIsBulkImporting] = useState(false)
  const [isGalleryImporting, setIsGalleryImporting] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const [title, setTitle] = useState(house.title || "")
  const [subtitle, setSubtitle] = useState(house.subtitle || "")
  const [description, setDescription] = useState(house.description || "")
  const [bedrooms, setBedrooms] = useState(house.specifications?.bedrooms?.toString() || "")
  const [bathrooms, setBathrooms] = useState(house.specifications?.bathrooms?.toString() || "")
  const [guests, setGuests] = useState(house.specifications?.guests?.toString() || "")

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
      const imageUrls = importedImages.map((img: any) => img.url)
      setImages([...images, ...imageUrls])
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
      toggleFeaturedStatus(house.id, checked).then((result) => {
        if (result.error) {
          toast.error(result.error)
          setIsFeatured(!checked)
        } else {
          toast.success(checked ? "Property marked as featured" : "Property unmarked as featured")
          router.refresh()
        }
      })
    })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)
    formData.append("images", JSON.stringify(images))
    formData.append("focal_point", focalPoint)
    formData.append("flip_horizontal", flipHorizontal.toString())
    formData.append("flip_vertical", flipVertical.toString())
    formData.append("image_source_urls", JSON.stringify(imageSourceUrls))
    formData.set("is_published", isPublished ? "true" : "false")
    formData.set("is_featured", isFeatured ? "true" : "false")

    startTransition(() => {
      updateInventoryItem(house.id, null, formData).then((result) => {
        if (result.error) {
          setError(result.error)
          toast.error(result.error)
        } else if (result.success) {
          toast.success("Property saved successfully")
          router.refresh()
        }
      })
    })
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <Link href={returnUrl}>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Houses
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Edit Property</h1>
              <p className="text-gray-400">Update property details and settings</p>
            </div>
          </div>
          <EnrichInventoryButton
            inventoryId={house.id}
            category="villa"
            getFormData={() => ({
              title,
              subtitle,
              currentSpecs: {
                bedrooms: bedrooms ? parseInt(bedrooms) : undefined,
                bathrooms: bathrooms ? parseInt(bathrooms) : undefined,
                guests: guests ? parseInt(guests) : undefined,
              },
            })}
            onEnriched={(updates) => {
              if (updates.bedrooms !== undefined) setBedrooms(updates.bedrooms.toString())
              if (updates.bathrooms !== undefined) setBathrooms(updates.bathrooms.toString())
              if (updates.guests !== undefined) setGuests(updates.guests.toString())
            }}
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="hidden" name="category" value="villa" />

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 cut-corner">
              {error}
            </div>
          )}

          <Card className="bg-[#111111] border-[#333333] cut-corner">
            <CardHeader>
              <CardTitle className="text-white">Images</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload images={images} setImages={setImages} onUploadingChange={setIsUploading} onHasErrors={setHasUploadErrors} />
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
              <CardTitle className="text-white">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-300">
                    Property Name *
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Villa Justa"
                    required
                    className="bg-[#0A0A0A] border-[#333333] text-white cut-corner"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subtitle" className="text-gray-300">
                    Location
                  </Label>
                  <Input
                    id="subtitle"
                    name="subtitle"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Miami Shores"
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
                    category="villa"
                    getFormData={() => ({
                      title,
                      subtitle,
                      specifications: {
                        bedrooms,
                        bathrooms,
                        guests,
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
                  placeholder="Describe the property's features and luxury amenities..."
                  rows={4}
                  className="bg-[#0A0A0A] border-[#333333] text-white cut-corner"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#111111] border-[#333333] cut-corner">
            <CardHeader>
              <CardTitle className="text-white">Property Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms" className="text-gray-300">
                    Bedrooms *
                  </Label>
                  <Input
                    id="bedrooms"
                    name="bedrooms"
                    type="number"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    placeholder="7"
                    required
                    className="bg-[#0A0A0A] border-[#333333] text-white cut-corner"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms" className="text-gray-300">
                    Bathrooms *
                  </Label>
                  <Input
                    id="bathrooms"
                    name="bathrooms"
                    type="number"
                    step="0.5"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    placeholder="5.5"
                    required
                    className="bg-[#0A0A0A] border-[#333333] text-white cut-corner"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guests" className="text-gray-300">
                    Max Guests *
                  </Label>
                  <Input
                    id="guests"
                    name="guests"
                    type="number"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    placeholder="16"
                    required
                    className="bg-[#0A0A0A] border-[#333333] text-white cut-corner"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="security_deposit" className="text-gray-300">
                    Security Deposit ($)
                  </Label>
                  <Input
                    id="security_deposit"
                    name="security_deposit"
                    type="number"
                    step="0.01"
                    defaultValue={house.specifications?.securityDeposit}
                    placeholder="1000.00"
                    className="bg-[#0A0A0A] border-[#333333] text-white cut-corner"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cleaning_fee" className="text-gray-300">
                    Cleaning Fee ($)
                  </Label>
                  <Input
                    id="cleaning_fee"
                    name="cleaning_fee"
                    type="number"
                    step="0.01"
                    defaultValue={house.specifications?.cleaningFee}
                    placeholder="750.00"
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
                    Price per Night ($) *
                  </Label>
                  <Input
                    id="price_per_day"
                    name="price_per_day"
                    type="number"
                    step="0.01"
                    defaultValue={house.pricePerDay}
                    placeholder="1595.00"
                    required
                    className="bg-[#0A0A0A] border-[#333333] text-white cut-corner"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

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
                  <p className="text-sm text-gray-400">Make this property visible on the website</p>
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
                    Featured property
                  </Label>
                  <p className="text-sm text-gray-400">Show this property in featured sections</p>
                </div>
                <Switch 
                  id="is_featured"
                  checked={isFeatured}
                  onCheckedChange={handleFeaturedToggle}
                  disabled={isPending}
                />
              </div>
              <input type="hidden" name="is_featured" value={isFeatured ? "true" : "false"} />
            </CardContent>
          </Card>

          <div className="flex items-center justify-end space-x-4">
            <Link href="/admin/houses">
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

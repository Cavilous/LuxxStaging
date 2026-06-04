"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, X, Plus, DollarSign, FileText, Settings, ImageIcon, Loader2 } from "lucide-react"
import Link from "next/link"
import { createForSaleAsset } from "@/lib/for-sale-actions"
import { ImageUpload } from "@/components/image-upload"
import { ImageSourceLinks, ImageSourceUrl, addImageSourceUrl, removeImageSourceUrl } from "@/components/image-source-links"
import { BulkImageImport } from "@/components/bulk-image-import"
import { SmugMugGalleryImport } from "@/components/smugmug-gallery-import"
import { toast } from "sonner"
import AdminLayout from "@/components/admin-layout"

export default function CreateForSaleAssetPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    brand: "",
    model: "",
    year: "",
    location: "",
    description: "",
    advertisedPrice: "",
    managedAssetPrice: "",
    specs: {} as Record<string, any>,
    managementTerms: {
      ownerUseAllotment: "",
      minHoldMonths: "",
      revSharePctOwner: "",
      revSharePctLuxx: "",
      estAnnualGross: "",
      estAnnualNetToOwner: "",
    },
    status: "Draft",
    badges: [] as string[],
    images: [] as string[],
    imageSourceUrls: [] as ImageSourceUrl[],
    seo: {
      slug: "",
      metaTitle: "",
      metaDescription: "",
    },
  })

  const [newBadge, setNewBadge] = useState("")
  const [smugmugUrl, setSmugmugUrl] = useState("")
  const [importing, setImporting] = useState(false)
  const [isBulkImporting, setIsBulkImporting] = useState(false)
  const [isGalleryImporting, setIsGalleryImporting] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const [newSpecKey, setNewSpecKey] = useState("")
  const [newSpecValue, setNewSpecValue] = useState("")

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev],
        [field]: value,
      },
    }))
  }

  const addBadge = () => {
    if (newBadge.trim() && !formData.badges.includes(newBadge.trim())) {
      setFormData((prev) => ({
        ...prev,
        badges: [...prev.badges, newBadge.trim()],
      }))
      setNewBadge("")
    }
  }

  const removeBadge = (badge: string) => {
    setFormData((prev) => ({
      ...prev,
      badges: prev.badges.filter((b) => b !== badge),
    }))
  }

  const addSpec = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      setFormData((prev) => ({
        ...prev,
        specs: {
          ...prev.specs,
          [newSpecKey.trim()]: newSpecValue.trim(),
        },
      }))
      setNewSpecKey("")
      setNewSpecValue("")
    }
  }

  const removeSpec = (key: string) => {
    setFormData((prev) => ({
      ...prev,
      specs: Object.fromEntries(Object.entries(prev.specs).filter(([k]) => k !== key)),
    }))
  }

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
      handleInputChange("images", [...formData.images, ...imageUrls])
      handleInputChange("imageSourceUrls", addImageSourceUrl(formData.imageSourceUrls, smugmugUrl.trim(), "SmugMug"))
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
    handleInputChange("imageSourceUrls", removeImageSourceUrl(formData.imageSourceUrls, urlToRemove))
  }

  // Handle bulk image import with functional update to avoid stale closure issues
  const handleBulkImagesImported = (urls: string[]) => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...urls]
    }))
  }

  const handleSubmit = async (status: string) => {
    if (!formData.title || !formData.category) {
      toast.error("Title and category are required")
      return
    }

    const submitData = new FormData()
    submitData.set("title", formData.title)
    submitData.set("category", formData.category)
    submitData.set("brand", formData.brand)
    submitData.set("model", formData.model)
    submitData.set("year", formData.year)
    submitData.set("location", formData.location)
    submitData.set("description", formData.description)
    submitData.set("heroImage", formData.images[0] || "")
    if (formData.advertisedPrice) submitData.set("advertisedPrice", formData.advertisedPrice)
    if (formData.managedAssetPrice) submitData.set("managedAssetPrice", formData.managedAssetPrice)
    submitData.set("status", status)
    submitData.set("slug", formData.seo.slug)
    submitData.set("metaTitle", formData.seo.metaTitle)
    submitData.set("metaDescription", formData.seo.metaDescription)
    submitData.set("specifications", JSON.stringify(formData.specs))
    submitData.set("badges", JSON.stringify(formData.badges))
    submitData.set("managementTerms", JSON.stringify(formData.managementTerms))
    submitData.set("images", JSON.stringify(formData.images))
    submitData.set("imageSourceUrls", JSON.stringify(formData.imageSourceUrls))

    startTransition(async () => {
      const result = await createForSaleAsset(submitData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(`Asset ${status === "Live" ? "published" : "saved as draft"} successfully`)
        router.push("/admin/for-sale")
      }
    })
  }

  return (
    <AdminLayout>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/for-sale">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Assets
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Create Asset</h1>
            <p className="text-gray-400">Add a new luxury asset for sale</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button 
            type="button"
            onClick={() => handleSubmit("Draft")}
            disabled={isPending || isBulkImporting || isGalleryImporting}
            variant="outline" 
            className="cut-corner border-[#333] text-gray-300 bg-transparent"
          >
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isBulkImporting || isGalleryImporting ? "Importing images..." : "Save Draft"}
          </Button>
          <Button 
            type="button"
            onClick={() => handleSubmit("Live")}
            disabled={isPending || isBulkImporting || isGalleryImporting}
            className="cut-corner bg-[#ECAC36] hover:bg-[#B8860B] text-black font-semibold"
          >
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isBulkImporting || isGalleryImporting ? "Importing images..." : "Publish Asset"}
          </Button>
        </div>
      </div>

      <div>
        <Tabs defaultValue="details" className="space-y-6">
          <TabsList className="bg-[#1a1a1a] border border-[#333]">
            <TabsTrigger value="details" className="data-[state=active]:bg-[#ECAC36] data-[state=active]:text-black">
              <FileText className="mr-2 h-4 w-4" />
              Details
            </TabsTrigger>
            <TabsTrigger value="media" className="data-[state=active]:bg-[#ECAC36] data-[state=active]:text-black">
              <ImageIcon className="mr-2 h-4 w-4" />
              Media
            </TabsTrigger>
            <TabsTrigger value="pricing" className="data-[state=active]:bg-[#ECAC36] data-[state=active]:text-black">
              <DollarSign className="mr-2 h-4 w-4" />
              Pricing
            </TabsTrigger>
            <TabsTrigger value="seo" className="data-[state=active]:bg-[#ECAC36] data-[state=active]:text-black">
              <Settings className="mr-2 h-4 w-4" />
              SEO
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <Card className="bg-[#1a1a1a] border-[#333] cut-corner">
              <CardHeader>
                <CardTitle className="text-white">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Title *</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className="bg-[#222] border-[#333] text-white cut-corner"
                      placeholder="e.g., 2022 Ferrari SF90 Stradale"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger className="bg-[#222] border-[#333] text-white cut-corner">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#222] border-[#333]">
                        <SelectItem value="car">Car</SelectItem>
                        <SelectItem value="yacht">Yacht</SelectItem>
                        <SelectItem value="villa">Villa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-gray-300">Brand</Label>
                    <Input
                      value={formData.brand}
                      onChange={(e) => handleInputChange("brand", e.target.value)}
                      className="bg-[#222] border-[#333] text-white cut-corner"
                      placeholder="e.g., Ferrari"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Model</Label>
                    <Input
                      value={formData.model}
                      onChange={(e) => handleInputChange("model", e.target.value)}
                      className="bg-[#222] border-[#333] text-white cut-corner"
                      placeholder="e.g., SF90 Stradale"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Year</Label>
                    <Input
                      type="number"
                      value={formData.year}
                      onChange={(e) => handleInputChange("year", e.target.value)}
                      className="bg-[#222] border-[#333] text-white cut-corner"
                      placeholder="2022"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-gray-300">Location</Label>
                  <Input
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className="bg-[#222] border-[#333] text-white cut-corner"
                    placeholder="e.g., Miami Beach, FL"
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="bg-[#222] border-[#333] text-white cut-corner"
                    placeholder="Detailed description of the asset..."
                    rows={4}
                  />
                </div>

                {/* Specifications */}
                <div>
                  <Label className="text-gray-300">Specifications</Label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Key (e.g., horsepower)"
                        value={newSpecKey}
                        onChange={(e) => setNewSpecKey(e.target.value)}
                        className="bg-[#222] border-[#333] text-white cut-corner"
                      />
                      <Input
                        placeholder="Value (e.g., 986)"
                        value={newSpecValue}
                        onChange={(e) => setNewSpecValue(e.target.value)}
                        className="bg-[#222] border-[#333] text-white cut-corner"
                      />
                      <Button type="button" onClick={addSpec} size="sm" className="cut-corner">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(formData.specs).map(([key, value]) => (
                        <Badge key={key} className="bg-[#333] text-white cut-corner flex items-center gap-1">
                          {key}: {value}
                          <button type="button" onClick={() => removeSpec(key)}>
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div>
                  <Label className="text-gray-300">Badges</Label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Badge name (e.g., Featured)"
                        value={newBadge}
                        onChange={(e) => setNewBadge(e.target.value)}
                        className="bg-[#222] border-[#333] text-white cut-corner"
                      />
                      <Button type="button" onClick={addBadge} size="sm" className="cut-corner">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.badges.map((badge) => (
                        <Badge
                          key={badge}
                          className="bg-[#ECAC36]/20 text-[#ECAC36] border-[#ECAC36]/30 cut-corner flex items-center gap-1"
                        >
                          {badge}
                          <button type="button" onClick={() => removeBadge(badge)}>
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media" className="space-y-6">
            <Card className="bg-[#1a1a1a] border-[#333] cut-corner">
              <CardHeader>
                <CardTitle className="text-white">Media & Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ImageUpload
                  value={formData.images}
                  onChange={(urls) => handleInputChange("images", urls)}
                  maxImages={100}
                  label="Asset Images"
                />
                <p className="text-sm text-gray-400">
                  Upload high-quality images of the asset. The first image will be used as the cover/hero image.
                </p>
                
                <div className="mt-6 pt-6 border-t border-[#333]">
                  <BulkImageImport
                    onImagesImported={handleBulkImagesImported}
                    onImportingChange={setIsBulkImporting}
                    existingSingleImport={
                      <div className="space-y-2">
                        <Label htmlFor="smugmug_url" className="text-gray-300">
                          Import from SmugMug Gallery URL
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="smugmug_url"
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
                          <p className="text-sm text-red-400 mt-2">{importError}</p>
                        )}
                      </div>
                    }
                  />
                </div>

                <div className="mt-6 pt-6 border-t border-gray-700">
                  <SmugMugGalleryImport
                    onImagesImported={(urls) => setFormData(prev => ({ ...prev, images: [...prev.images, ...urls] }))}
                    onImportingChange={setIsGalleryImporting}
                    existingSourceUrls={formData.imageSourceUrls.map(s => s.url)}
                    onSourceUrlsChange={(newUrls) => {
                      setFormData(prev => {
                        const existingUrlSet = new Set(prev.imageSourceUrls.map(s => s.url))
                        const toAdd = newUrls.filter(url => !existingUrlSet.has(url))
                        const newSources: ImageSourceUrl[] = toAdd.map(url => ({
                          url,
                          source: url.includes('smugmug.com') ? 'SmugMug Gallery' : 'Import',
                          addedAt: new Date().toISOString()
                        }))
                        return { ...prev, imageSourceUrls: [...prev.imageSourceUrls, ...newSources] }
                      })
                    }}
                  />
                </div>

                {formData.imageSourceUrls.length > 0 && (
                  <div className="mt-4">
                    <ImageSourceLinks 
                      urls={formData.imageSourceUrls} 
                      onRemove={handleRemoveSourceUrl}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-6">
            <Card className="bg-[#1a1a1a] border-[#333] cut-corner">
              <CardHeader>
                <CardTitle className="text-white">Pricing Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Advertised Price</Label>
                    <Input
                      type="number"
                      value={formData.advertisedPrice}
                      onChange={(e) => handleInputChange("advertisedPrice", e.target.value)}
                      className="bg-[#222] border-[#333] text-white cut-corner"
                      placeholder="1250000"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Managed Asset Price</Label>
                    <Input
                      type="number"
                      value={formData.managedAssetPrice}
                      onChange={(e) => handleInputChange("managedAssetPrice", e.target.value)}
                      className="bg-[#222] border-[#333] text-white cut-corner"
                      placeholder="950000"
                    />
                  </div>
                </div>

                {formData.managedAssetPrice && (
                  <Card className="bg-[#222] border-[#333] cut-corner">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Management Terms</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-300">Owner Use Allotment (days/year)</Label>
                          <Input
                            type="number"
                            value={formData.managementTerms.ownerUseAllotment}
                            onChange={(e) =>
                              handleNestedInputChange("managementTerms", "ownerUseAllotment", e.target.value)
                            }
                            className="bg-[#333] border-[#444] text-white cut-corner"
                            placeholder="45"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300">Min Hold (months)</Label>
                          <Input
                            type="number"
                            value={formData.managementTerms.minHoldMonths}
                            onChange={(e) =>
                              handleNestedInputChange("managementTerms", "minHoldMonths", e.target.value)
                            }
                            className="bg-[#333] border-[#444] text-white cut-corner"
                            placeholder="24"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300">Owner Revenue Share (%)</Label>
                          <Input
                            type="number"
                            value={formData.managementTerms.revSharePctOwner}
                            onChange={(e) =>
                              handleNestedInputChange("managementTerms", "revSharePctOwner", e.target.value)
                            }
                            className="bg-[#333] border-[#444] text-white cut-corner"
                            placeholder="60"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300">Luxx Revenue Share (%)</Label>
                          <Input
                            type="number"
                            value={formData.managementTerms.revSharePctLuxx}
                            onChange={(e) =>
                              handleNestedInputChange("managementTerms", "revSharePctLuxx", e.target.value)
                            }
                            className="bg-[#333] border-[#444] text-white cut-corner"
                            placeholder="40"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo" className="space-y-6">
            <Card className="bg-[#1a1a1a] border-[#333] cut-corner">
              <CardHeader>
                <CardTitle className="text-white">SEO & URL</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">URL Slug</Label>
                  <Input
                    value={formData.seo.slug}
                    onChange={(e) => handleNestedInputChange("seo", "slug", e.target.value)}
                    className="bg-[#222] border-[#333] text-white cut-corner"
                    placeholder="ferrari-sf90-stradale-2022"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Meta Title</Label>
                  <Input
                    value={formData.seo.metaTitle}
                    onChange={(e) => handleNestedInputChange("seo", "metaTitle", e.target.value)}
                    className="bg-[#222] border-[#333] text-white cut-corner"
                    placeholder="2022 Ferrari SF90 Stradale for Sale | Luxx Miami"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Meta Description</Label>
                  <Textarea
                    value={formData.seo.metaDescription}
                    onChange={(e) => handleNestedInputChange("seo", "metaDescription", e.target.value)}
                    className="bg-[#222] border-[#333] text-white cut-corner"
                    placeholder="Luxury 2022 Ferrari SF90 Stradale available for purchase in Miami. Direct buy or managed asset program available."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </AdminLayout>
  )
}

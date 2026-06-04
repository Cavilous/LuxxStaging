"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { createInventoryItem } from "@/lib/inventory-actions"
import { useRouter } from "next/navigation"
import { ImageUpload } from "@/components/image-upload"
import { GenerateDescriptionButton } from "@/components/admin/generate-description-button"

export default function CreateYachtPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [images, setImages] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [hasUploadErrors, setHasUploadErrors] = useState(false)
  const [isPublished, setIsPublished] = useState(false)
  const [isFeatured, setIsFeatured] = useState(false)
  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const [description, setDescription] = useState("")
  const [length, setLength] = useState("")
  const [guests, setGuests] = useState("")
  const [crew, setCrew] = useState("")
  const [marina, setMarina] = useState("")

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
          router.push("/admin/yachts")
        }
      })
    })
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link href="/admin/yachts">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Yachts
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Add New Yacht</h1>
            <p className="text-gray-400">Create a new luxury yacht listing</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="hidden" name="category" value="yacht" />

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 cut-corner">
              {error}
            </div>
          )}

          {/* Images */}
          <Card className="bg-[#111111] border-[#333333] cut-corner">
            <CardHeader>
              <CardTitle className="text-white">Images</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload value={images} onChange={setImages} maxImages={100} label="Yacht Images" onUploadingChange={setIsUploading} onHasErrors={setHasUploadErrors} />
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card className="bg-[#111111] border-[#333333] cut-corner">
            <CardHeader>
              <CardTitle className="text-white">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-300">
                    Yacht Name *
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Princess"
                    required
                    className="bg-[#0A0A0A] border-[#333333] text-white cut-corner"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subtitle" className="text-gray-300">
                    Type / Description
                  </Label>
                  <Input
                    id="subtitle"
                    name="subtitle"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Luxury Yacht"
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
                    category="yacht"
                    getFormData={() => ({
                      title,
                      subtitle,
                      specifications: {
                        length,
                        guests,
                        crew,
                        marina,
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
                  placeholder="Describe the yacht's features and luxury amenities..."
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
                  <Label htmlFor="length" className="text-gray-300">
                    Length *
                  </Label>
                  <Input
                    id="length"
                    name="length"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    placeholder="120'"
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
                    placeholder="12"
                    required
                    className="bg-[#0A0A0A] border-[#333333] text-white cut-corner"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="crew" className="text-gray-300">
                    Crew Size
                  </Label>
                  <Input
                    id="crew"
                    name="crew"
                    type="number"
                    value={crew}
                    onChange={(e) => setCrew(e.target.value)}
                    placeholder="2"
                    className="bg-[#0A0A0A] border-[#333333] text-white cut-corner"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="marina" className="text-gray-300">
                  Marina Location
                </Label>
                <Input
                  id="marina"
                  name="marina"
                  value={marina}
                  onChange={(e) => setMarina(e.target.value)}
                  placeholder="Miami Beach"
                  className="bg-[#0A0A0A] border-[#333333] text-white cut-corner"
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="bg-[#111111] border-[#333333] cut-corner">
            <CardHeader>
              <CardTitle className="text-white">Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 mb-4">
                <Label className="text-gray-300">Pricing Options *</Label>
                <p className="text-sm text-gray-400">At least one pricing option required: hourly rate or any package duration</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price_per_hour" className="text-gray-300">
                    Price per Hour ($)
                  </Label>
                  <Input
                    id="price_per_hour"
                    name="price_per_hour"
                    type="number"
                    step="0.01"
                    placeholder="2495.00"
                    className="bg-[#0A0A0A] border-[#333333] text-white cut-corner"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price_per_day" className="text-gray-300">
                    Price per Day ($)
                  </Label>
                  <Input
                    id="price_per_day"
                    name="price_per_day"
                    type="number"
                    step="0.01"
                    placeholder="15995.00"
                    className="bg-[#0A0A0A] border-[#333333] text-white cut-corner"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Package Pricing</Label>
                <p className="text-sm text-gray-400">Or set custom prices for popular charter durations</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price_per_4hr" className="text-gray-300">
                    4-Hour Charter ($)
                  </Label>
                  <Input
                    id="price_per_4hr"
                    name="price_per_4hr"
                    type="number"
                    step="0.01"
                    placeholder="9500.00"
                    className="bg-[#0A0A0A] border-[#333333] text-white cut-corner"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price_per_6hr" className="text-gray-300">
                    6-Hour Charter ($)
                  </Label>
                  <Input
                    id="price_per_6hr"
                    name="price_per_6hr"
                    type="number"
                    step="0.01"
                    placeholder="13500.00"
                    className="bg-[#0A0A0A] border-[#333333] text-white cut-corner"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price_per_8hr" className="text-gray-300">
                    8-Hour Charter ($)
                  </Label>
                  <Input
                    id="price_per_8hr"
                    name="price_per_8hr"
                    type="number"
                    step="0.01"
                    placeholder="17500.00"
                    className="bg-[#0A0A0A] border-[#333333] text-white cut-corner"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

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
                  <p className="text-sm text-gray-400">Make this yacht visible on the website</p>
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
                    Featured yacht
                  </Label>
                  <p className="text-sm text-gray-400">Show this yacht in featured sections</p>
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
            <Link href="/admin/yachts">
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
                "Create Yacht"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

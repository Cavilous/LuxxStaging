"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Trash2, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface SupplierMetadata {
  supplierType?: string | null
  categoryLabel?: string | null
  instagramHandle?: string | null
  serviceArea?: string | null
  internalRating?: number | string | null
  preferredSupplier?: boolean | null
  paymentTerms?: string | null
  commissionNotes?: string | null
  source?: string | null
  tags?: string[] | string | null
  privateNotes?: string | null
  [key: string]: unknown
}

interface VendorData {
  id?: string
  name: string
  category: string
  description: string | null
  contactName: string | null
  contactEmail: string | null
  contactPhone: string | null
  website: string | null
  apiType: string
  apiCredentials: unknown
  isActive: boolean
  metadata?: unknown
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {}
}

function asMetadata(metadata: unknown): SupplierMetadata {
  return metadata && typeof metadata === "object" && !Array.isArray(metadata) ? metadata as SupplierMetadata : {}
}

function toInputValue(value: unknown) {
  return value === null || value === undefined ? "" : String(value)
}

function tagsToInput(tags: SupplierMetadata["tags"]) {
  if (Array.isArray(tags)) return tags.join(", ")
  return toInputValue(tags)
}

export function VendorFormClient({ vendor }: { vendor?: VendorData }) {
  const router = useRouter()
  const isEdit = !!vendor?.id
  const vendorMetadata = asMetadata(vendor?.metadata)
  const apiCredentials = asRecord(vendor?.apiCredentials)

  const [name, setName] = useState(vendor?.name || "")
  const [category, setCategory] = useState(vendor?.category || "house")
  const [description, setDescription] = useState(vendor?.description || "")
  const [contactName, setContactName] = useState(vendor?.contactName || "")
  const [contactEmail, setContactEmail] = useState(vendor?.contactEmail || "")
  const [contactPhone, setContactPhone] = useState(vendor?.contactPhone || "")
  const [website, setWebsite] = useState(vendor?.website || "")
  const [apiType, setApiType] = useState(vendor?.apiType || "none")
  const [isActive, setIsActive] = useState(vendor?.isActive ?? true)
  const [supplierType, setSupplierType] = useState(toInputValue(vendorMetadata.supplierType || vendorMetadata.categoryLabel))
  const [instagramHandle, setInstagramHandle] = useState(toInputValue(vendorMetadata.instagramHandle))
  const [serviceArea, setServiceArea] = useState(toInputValue(vendorMetadata.serviceArea))
  const [internalRating, setInternalRating] = useState(toInputValue(vendorMetadata.internalRating))
  const [preferredSupplier, setPreferredSupplier] = useState(Boolean(vendorMetadata.preferredSupplier))
  const [paymentTerms, setPaymentTerms] = useState(toInputValue(vendorMetadata.paymentTerms))
  const [commissionNotes, setCommissionNotes] = useState(toInputValue(vendorMetadata.commissionNotes))
  const [source, setSource] = useState(toInputValue(vendorMetadata.source))
  const [tagsInput, setTagsInput] = useState(tagsToInput(vendorMetadata.tags))
  const [privateNotes, setPrivateNotes] = useState(toInputValue(vendorMetadata.privateNotes))
  const redactedAccountId = toInputValue(apiCredentials.accountId)
  const redactedApiKey = toInputValue(apiCredentials.apiKey)
  const [accountId, setAccountId] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [showApiKey, setShowApiKey] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Supplier/partner name is required")
      return
    }

    const rating = internalRating.trim() ? Number(internalRating) : null
    if (rating !== null && (!Number.isFinite(rating) || rating < 1 || rating > 5)) {
      toast.error("Internal rating must be between 1 and 5")
      return
    }

    setSaving(true)
    try {
      const normalizedInstagram = instagramHandle.trim().replace(/^@+/, "")
      const tags = tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)

      const body: Record<string, unknown> = {
        name: name.trim(),
        category,
        description: description.trim() || null,
        contactName: contactName.trim() || null,
        contactEmail: contactEmail.trim() || null,
        contactPhone: contactPhone.trim() || null,
        website: website.trim() || null,
        apiType,
        isActive,
        metadata: {
          ...vendorMetadata,
          supplierType: supplierType.trim() || null,
          instagramHandle: normalizedInstagram || null,
          serviceArea: serviceArea.trim() || null,
          internalRating: rating,
          preferredSupplier,
          paymentTerms: paymentTerms.trim() || null,
          commissionNotes: commissionNotes.trim() || null,
          source: source.trim() || null,
          tags,
          privateNotes: privateNotes.trim() || null,
        },
      }

      if (apiType === "hostaway") {
        if (!isEdit && (!accountId.trim() || !apiKey.trim())) {
          toast.error("Account ID and API Key are required for HostAway")
          setSaving(false)
          return
        }
        if (accountId.trim() || apiKey.trim()) {
          if (!accountId.trim() || !apiKey.trim()) {
            toast.error("Both Account ID and API Key must be provided when updating credentials")
            setSaving(false)
            return
          }
          body.apiCredentials = {
            accountId: accountId.trim(),
            apiKey: apiKey.trim(),
          }
        }
      } else {
        body.apiCredentials = {}
      }

      const url = isEdit ? `/api/admin/vendors/${vendor.id}` : "/api/admin/vendors"
      const method = isEdit ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to save supplier/partner")
      }

      toast.success(isEdit ? "Supplier/partner updated" : "Supplier/partner created")
      router.push("/admin/vendors")
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save supplier/partner")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this supplier/partner? This cannot be undone.")) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/admin/vendors/${vendor!.id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete supplier/partner")

      toast.success("Supplier/partner deleted")
      router.push("/admin/vendors")
      router.refresh()
    } catch (error) {
      toast.error("Failed to delete supplier/partner")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="max-w-5xl space-y-6">
      <Card className="bg-[#111111] border-[#333333] cut-corner">
        <CardHeader>
          <CardTitle className="text-white">Supplier/Partner Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-gray-300">Supplier/Partner Name *</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Luxury Villas Miami"
                className="bg-[#0A0A0A] border-[#333333] text-white mt-1"
              />
            </div>

            <div>
              <Label className="text-gray-300">Supplier Type / Category Label</Label>
              <Input
                value={supplierType}
                onChange={(e) => setSupplierType(e.target.value)}
                placeholder="e.g., Villa owner, concierge, transport"
                className="bg-[#0A0A0A] border-[#333333] text-white mt-1"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-gray-300">Inventory Category</Label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full mt-1 bg-[#0A0A0A] border border-[#333333] text-white rounded-md px-3 py-2"
              >
                <option value="house">Villas / Houses</option>
                <option value="car">Cars</option>
                <option value="yacht">Yachts</option>
                <option value="jet">Jets</option>
                <option value="service">Partner Services</option>
              </select>
            </div>

            <div>
              <Label className="text-gray-300">Internal Rating</Label>
              <Input
                type="number"
                min="1"
                max="5"
                step="1"
                value={internalRating}
                onChange={(e) => setInternalRating(e.target.value)}
                placeholder="1-5"
                className="bg-[#0A0A0A] border-[#333333] text-white mt-1"
              />
            </div>
          </div>

          <div>
            <Label className="text-gray-300">Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short internal description"
              rows={3}
              className="bg-[#0A0A0A] border-[#333333] text-white mt-1"
            />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-center justify-between rounded-md border border-[#333333] bg-[#0A0A0A] px-4 py-3">
              <div>
                <Label className="text-gray-200">Active</Label>
                <p className="text-xs text-gray-500">Available for admin workflows and imports.</p>
              </div>
              <Switch
                checked={isActive}
                onCheckedChange={setIsActive}
                className="data-[state=checked]:bg-[#ECAC36] data-[state=unchecked]:bg-[#333333]"
              />
            </div>

            <div className="flex items-center justify-between rounded-md border border-[#333333] bg-[#0A0A0A] px-4 py-3">
              <div>
                <Label className="text-gray-200">Preferred Supplier</Label>
                <p className="text-xs text-gray-500">Highlight this relationship in the CRM list.</p>
              </div>
              <Switch
                checked={preferredSupplier}
                onCheckedChange={setPreferredSupplier}
                className="data-[state=checked]:bg-[#ECAC36] data-[state=unchecked]:bg-[#333333]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#111111] border-[#333333] cut-corner">
        <CardHeader>
          <CardTitle className="text-white">Contact & Presence</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-gray-300">Contact Name</Label>
              <Input
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Contact person"
                className="bg-[#0A0A0A] border-[#333333] text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-gray-300">Contact Email</Label>
              <Input
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="email@example.com"
                className="bg-[#0A0A0A] border-[#333333] text-white mt-1"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-gray-300">Contact Phone</Label>
              <Input
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="bg-[#0A0A0A] border-[#333333] text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-gray-300">Service Area</Label>
              <Input
                value={serviceArea}
                onChange={(e) => setServiceArea(e.target.value)}
                placeholder="e.g., Miami Beach, South Florida"
                className="bg-[#0A0A0A] border-[#333333] text-white mt-1"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-gray-300">Website</Label>
              <Input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://..."
                className="bg-[#0A0A0A] border-[#333333] text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-gray-300">Instagram Handle</Label>
              <Input
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
                placeholder="@handle"
                className="bg-[#0A0A0A] border-[#333333] text-white mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#111111] border-[#333333] cut-corner">
        <CardHeader>
          <CardTitle className="text-white">Commercial Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-gray-300">Payment Terms</Label>
              <Input
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                placeholder="e.g., Net 15, deposit required"
                className="bg-[#0A0A0A] border-[#333333] text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-gray-300">Source</Label>
              <Input
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Referral, Instagram, direct outreach"
                className="bg-[#0A0A0A] border-[#333333] text-white mt-1"
              />
            </div>
          </div>

          <div>
            <Label className="text-gray-300">Tags</Label>
            <Input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Comma-separated tags"
              className="bg-[#0A0A0A] border-[#333333] text-white mt-1"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-gray-300">Commission Notes</Label>
              <Textarea
                value={commissionNotes}
                onChange={(e) => setCommissionNotes(e.target.value)}
                placeholder="Commission split, markup, referral terms"
                rows={4}
                className="bg-[#0A0A0A] border-[#333333] text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-gray-300">Private Notes</Label>
              <Textarea
                value={privateNotes}
                onChange={(e) => setPrivateNotes(e.target.value)}
                placeholder="Internal relationship notes"
                rows={4}
                className="bg-[#0A0A0A] border-[#333333] text-white mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#111111] border-[#333333] cut-corner">
        <CardHeader>
          <CardTitle className="text-white">Listing Import Integration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-gray-300">API Type</Label>
            <select
              value={apiType}
              onChange={(e) => setApiType(e.target.value)}
              className="w-full mt-1 bg-[#0A0A0A] border border-[#333333] text-white rounded-md px-3 py-2"
            >
              <option value="none">None</option>
              <option value="hostaway">HostAway</option>
            </select>
          </div>

          {apiType === "hostaway" && (
            <div className="space-y-4 p-4 bg-[#0A0A0A] rounded-lg border border-[#333333]">
              <p className="text-sm text-gray-400">Enter HostAway API credentials for listing imports.</p>
              <div>
                <Label className="text-gray-300">Account ID (Client ID) {!isEdit && "*"}</Label>
                <Input
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  placeholder={isEdit && redactedAccountId ? `Current: ${redactedAccountId}` : "Your HostAway Account ID"}
                  className="bg-[#111111] border-[#333333] text-white mt-1"
                />
                {isEdit && <p className="text-xs text-gray-500 mt-1">Leave blank to keep current credentials</p>}
              </div>
              <div>
                <Label className="text-gray-300">API Key (Client Secret) {!isEdit && "*"}</Label>
                <div className="relative mt-1">
                  <Input
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={isEdit && redactedApiKey ? `Current: ${redactedApiKey}` : "Your HostAway API Key"}
                    className="bg-[#111111] border-[#333333] text-white pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    aria-label={showApiKey ? "Hide API key" : "Show API key"}
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div>
          {isEdit && (
            <Button
              onClick={handleDelete}
              disabled={deleting}
              variant="destructive"
              className="cut-corner"
            >
              {deleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
              Delete Supplier
            </Button>
          )}
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#ECAC36] hover:bg-[#B8860B] text-black font-bold cut-corner"
        >
          {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {isEdit ? "Update Supplier" : "Create Supplier"}
        </Button>
      </div>
    </div>
  )
}

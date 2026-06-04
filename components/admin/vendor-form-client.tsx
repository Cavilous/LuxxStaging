"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Trash2, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

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
  apiCredentials: any
  isActive: boolean
}

export function VendorFormClient({ vendor }: { vendor?: VendorData }) {
  const router = useRouter()
  const isEdit = !!vendor?.id

  const [name, setName] = useState(vendor?.name || '')
  const [category, setCategory] = useState(vendor?.category || 'house')
  const [description, setDescription] = useState(vendor?.description || '')
  const [contactName, setContactName] = useState(vendor?.contactName || '')
  const [contactEmail, setContactEmail] = useState(vendor?.contactEmail || '')
  const [contactPhone, setContactPhone] = useState(vendor?.contactPhone || '')
  const [website, setWebsite] = useState(vendor?.website || '')
  const [apiType, setApiType] = useState(vendor?.apiType || 'none')
  const redactedAccountId = vendor?.apiCredentials?.accountId || ''
  const redactedApiKey = vendor?.apiCredentials?.apiKey || ''
  const [accountId, setAccountId] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Vendor name is required')
      return
    }

    setSaving(true)
    try {
      const body: any = {
        name: name.trim(),
        category,
        description: description.trim() || null,
        contactName: contactName.trim() || null,
        contactEmail: contactEmail.trim() || null,
        contactPhone: contactPhone.trim() || null,
        website: website.trim() || null,
        apiType,
      }

      if (apiType === 'hostaway') {
        if (!isEdit && (!accountId.trim() || !apiKey.trim())) {
          toast.error('Account ID and API Key are required for HostAway')
          setSaving(false)
          return
        }
        if (accountId.trim() || apiKey.trim()) {
          if (!accountId.trim() || !apiKey.trim()) {
            toast.error('Both Account ID and API Key must be provided when updating credentials')
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

      const url = isEdit ? `/api/admin/vendors/${vendor.id}` : '/api/admin/vendors'
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save vendor')
      }

      toast.success(isEdit ? 'Vendor updated' : 'Vendor created')
      router.push('/admin/vendors')
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save vendor')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this vendor? This cannot be undone.')) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/admin/vendors/${vendor!.id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete vendor')

      toast.success('Vendor deleted')
      router.push('/admin/vendors')
      router.refresh()
    } catch (error) {
      toast.error('Failed to delete vendor')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <Card className="bg-[#111111] border-[#333333] cut-corner">
        <CardHeader>
          <CardTitle className="text-white">Vendor Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-gray-300">Vendor Name *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Luxury Villas Miami"
              className="bg-[#0A0A0A] border-[#333333] text-white mt-1"
            />
          </div>

          <div>
            <Label className="text-gray-300">Category</Label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full mt-1 bg-[#0A0A0A] border border-[#333333] text-white rounded-md px-3 py-2"
            >
              <option value="house">Villas / Houses</option>
              <option value="car">Cars</option>
              <option value="yacht">Yachts</option>
              <option value="jet">Jets</option>
            </select>
          </div>

          <div>
            <Label className="text-gray-300">Description</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              className="bg-[#0A0A0A] border-[#333333] text-white mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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

          <div className="grid grid-cols-2 gap-4">
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
              <Label className="text-gray-300">Website</Label>
              <Input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://..."
                className="bg-[#0A0A0A] border-[#333333] text-white mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#111111] border-[#333333] cut-corner">
        <CardHeader>
          <CardTitle className="text-white">API Integration</CardTitle>
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

          {apiType === 'hostaway' && (
            <div className="space-y-4 p-4 bg-[#0A0A0A] rounded-lg border border-[#333333]">
              <p className="text-sm text-gray-400">Enter your HostAway API credentials. These are used to authenticate and fetch listings.</p>
              <div>
                <Label className="text-gray-300">Account ID (Client ID) {!isEdit && '*'}</Label>
                <Input
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  placeholder={isEdit && redactedAccountId ? `Current: ${redactedAccountId}` : 'Your HostAway Account ID'}
                  className="bg-[#111111] border-[#333333] text-white mt-1"
                />
                {isEdit && <p className="text-xs text-gray-500 mt-1">Leave blank to keep current credentials</p>}
              </div>
              <div>
                <Label className="text-gray-300">API Key (Client Secret) {!isEdit && '*'}</Label>
                <div className="relative mt-1">
                  <Input
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={isEdit && redactedApiKey ? `Current: ${redactedApiKey}` : 'Your HostAway API Key'}
                    className="bg-[#111111] border-[#333333] text-white pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
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
              Delete Vendor
            </Button>
          )}
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#ECAC36] hover:bg-[#B8860B] text-black font-bold cut-corner"
        >
          {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {isEdit ? 'Update Vendor' : 'Create Vendor'}
        </Button>
      </div>
    </div>
  )
}

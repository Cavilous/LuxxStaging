"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Download, CheckCircle2, AlertCircle, Home, RefreshCw } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface FetchedListing {
  externalId: string
  title: string
  description: string
  pricePerDay: string | null
  pricePerWeek: string | null
  pricePerMonth: string | null
  currency: string
  specifications: Record<string, any>
  features: string[]
  images: string[]
  location: string
  thumbnailUrl: string | null
  alreadyInCms: boolean
}

interface ImportResult {
  success: boolean
  created: number
  skipped: number
  failed: number
  errors: { externalId: string; error: string }[]
}

export function VendorImportClient({ vendorId, vendorName, apiType }: { vendorId: string; vendorName: string; apiType: string }) {
  const [fetching, setFetching] = useState(false)
  const [importing, setImporting] = useState(false)
  const [resyncing, setResyncing] = useState(false)
  const [listings, setListings] = useState<FetchedListing[] | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const handleFetch = async () => {
    setFetching(true)
    setFetchError(null)
    setListings(null)
    setImportResult(null)

    try {
      const response = await fetch(`/api/admin/vendors/${vendorId}/fetch-listings`, { method: 'POST' })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch listings')
      }

      setListings(data.listings)
      const newIds = new Set<string>()
      data.listings.forEach((l: FetchedListing) => {
        if (!l.alreadyInCms) newIds.add(l.externalId)
      })
      setSelected(newIds)

      toast.success(`Found ${data.total} listings (${data.newListings} new, ${data.alreadyImported} already in CMS)`)
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to fetch listings'
      setFetchError(msg)
      toast.error(msg)
    } finally {
      setFetching(false)
    }
  }

  const handleImport = async () => {
    if (selected.size === 0) {
      toast.error('No listings selected')
      return
    }

    setImporting(true)
    try {
      const response = await fetch(`/api/admin/vendors/${vendorId}/import-listings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingIds: Array.from(selected) }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to import listings')
      }

      setImportResult(data)
      toast.success(`Imported ${data.created} villas`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Import failed')
    } finally {
      setImporting(false)
    }
  }

  const handleResyncAll = async () => {
    if (!listings) return
    const alreadyImported = listings.filter(l => l.alreadyInCms).map(l => l.externalId)
    if (alreadyImported.length === 0) {
      toast.info('No already-imported listings to resync')
      return
    }

    setResyncing(true)
    try {
      const response = await fetch(`/api/admin/vendors/${vendorId}/import-listings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingIds: alreadyImported, resync: true }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Resync failed')
      toast.success(`Resynced ${data.updated} listings (photos + details updated)`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Resync failed')
    } finally {
      setResyncing(false)
    }
  }

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAll = () => {
    if (!listings) return
    const newIds = new Set<string>()
    listings.forEach(l => { if (!l.alreadyInCms) newIds.add(l.externalId) })
    setSelected(newIds)
  }

  const deselectAll = () => setSelected(new Set())

  if (importResult) {
    return (
      <Card className="bg-[#111111] border-[#333333] cut-corner">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Import Complete
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#0A0A0A] p-4 cut-corner">
              <p className="text-gray-400 text-sm">Created</p>
              <p className="text-2xl font-bold text-green-500">{importResult.created}</p>
            </div>
            <div className="bg-[#0A0A0A] p-4 cut-corner">
              <p className="text-gray-400 text-sm">Skipped</p>
              <p className="text-2xl font-bold text-yellow-500">{importResult.skipped}</p>
            </div>
            <div className="bg-[#0A0A0A] p-4 cut-corner">
              <p className="text-gray-400 text-sm">Failed</p>
              <p className="text-2xl font-bold text-red-500">{importResult.failed}</p>
            </div>
          </div>

          {importResult.errors.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/50 cut-corner p-4">
              <p className="text-red-400 font-semibold flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4" />
                Errors
              </p>
              {importResult.errors.map((err, idx) => (
                <p key={idx} className="text-sm text-gray-300">
                  Listing {err.externalId}: {err.error}
                </p>
              ))}
            </div>
          )}

          <p className="text-gray-400 text-sm">Imported villas are saved as unpublished drafts. Review and publish them in the Villas section.</p>

          <div className="flex gap-3">
            <Link href="/admin/houses" className="flex-1">
              <Button className="w-full bg-[#ECAC36] hover:bg-[#B8860B] text-black font-bold cut-corner">
                <Home className="h-4 w-4 mr-2" />
                View Villas
              </Button>
            </Link>
            <Button
              onClick={() => {
                setImportResult(null)
                setListings(null)
                setSelected(new Set())
              }}
              variant="outline"
              className="border-[#333333] bg-transparent text-white hover:bg-[#0A0A0A]"
            >
              Import More
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-[#111111] border-[#333333] cut-corner">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold">Fetch Listings from {apiType === 'hostaway' ? 'HostAway' : apiType}</h3>
              <p className="text-gray-400 text-sm mt-1">Pull available listings from {vendorName}&apos;s supplier API to review before importing</p>
            </div>
            <Button
              onClick={handleFetch}
              disabled={fetching}
              className="bg-[#ECAC36] hover:bg-[#B8860B] text-black font-bold cut-corner"
            >
              {fetching ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Fetching...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Fetch Listings
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {fetchError && (
        <Card className="bg-red-500/10 border-red-500/50 cut-corner">
          <CardContent className="p-4">
            <p className="text-red-400 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {fetchError}
            </p>
          </CardContent>
        </Card>
      )}

      {listings && listings.length === 0 && (
        <Card className="bg-[#111111] border-[#333333] cut-corner">
          <CardContent className="text-center py-12">
            <p className="text-gray-400">No listings found from this supplier&apos;s API.</p>
          </CardContent>
        </Card>
      )}

      {listings && listings.length > 0 && (
        <Card className="bg-[#111111] border-[#333333] cut-corner">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">
                {listings.length} Listings Found
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={selectAll} className="border-[#333333] bg-transparent text-gray-300 hover:text-white text-xs">
                  Select All New
                </Button>
                <Button variant="outline" size="sm" onClick={deselectAll} className="border-[#333333] bg-transparent text-gray-300 hover:text-white text-xs">
                  Deselect All
                </Button>
                {listings.some(l => l.alreadyInCms) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResyncAll}
                    disabled={resyncing}
                    className="border-[#ECAC36]/40 bg-transparent text-[#ECAC36] hover:bg-[#ECAC36]/10 text-xs"
                  >
                    {resyncing ? (
                      <><Loader2 className="h-3 w-3 mr-1 animate-spin" />Resyncing...</>
                    ) : (
                      <><RefreshCw className="h-3 w-3 mr-1" />Resync Photos</>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
            {listings.map((listing) => (
              <div
                key={listing.externalId}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  listing.alreadyInCms
                    ? 'border-[#333333] bg-[#0A0A0A] opacity-60'
                    : selected.has(listing.externalId)
                    ? 'border-[#ECAC36]/50 bg-[#ECAC36]/5'
                    : 'border-[#333333] bg-[#0A0A0A] hover:border-[#444444]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected.has(listing.externalId)}
                  disabled={listing.alreadyInCms}
                  onChange={() => toggleSelect(listing.externalId)}
                  className="w-4 h-4 rounded accent-[#ECAC36] flex-shrink-0"
                />

                <div className="w-16 h-12 flex-shrink-0 rounded overflow-hidden bg-[#1a1a1a]">
                  {listing.thumbnailUrl ? (
                    <img
                      src={listing.thumbnailUrl}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                      <Home className="h-5 w-5" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white text-sm font-medium truncate">{listing.title}</p>
                    {listing.alreadyInCms && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-gray-700 text-gray-400 flex-shrink-0">
                        Already in CMS
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-xs truncate">
                    {listing.location && <span>{listing.location} &middot; </span>}
                    {listing.specifications?.bedrooms && <span>{listing.specifications.bedrooms} bed &middot; </span>}
                    {listing.specifications?.bathrooms && <span>{listing.specifications.bathrooms} bath &middot; </span>}
                    {listing.specifications?.guests && <span>{listing.specifications.guests} guests</span>}
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  {listing.pricePerDay ? (
                    <p className="text-[#ECAC36] text-sm font-semibold">${Number(listing.pricePerDay).toLocaleString()}/night</p>
                  ) : (
                    <p className="text-gray-500 text-xs">No price</p>
                  )}
                  <p className="text-gray-600 text-xs">{listing.images.length} photos</p>
                </div>
              </div>
            ))}
          </CardContent>

          <div className="p-4 border-t border-[#333333]">
            <div className="flex items-center justify-between">
              <p className="text-gray-400 text-sm">
                {selected.size} of {listings.filter(l => !l.alreadyInCms).length} new listings selected
              </p>
              <Button
                onClick={handleImport}
                disabled={importing || selected.size === 0}
                className="bg-[#ECAC36] hover:bg-[#B8860B] text-black font-bold cut-corner"
              >
                {importing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Import Selected ({selected.size})
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

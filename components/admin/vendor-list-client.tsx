"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Plus,
  Download,
  Edit,
  Building2,
  Globe2,
  Instagram,
  Mail,
  Phone,
  Star,
} from "lucide-react"
import Link from "next/link"

interface SupplierMetadata {
  supplierType?: string | null
  categoryLabel?: string | null
  instagramHandle?: string | null
  serviceArea?: string | null
  internalRating?: number | string | null
  preferredSupplier?: boolean | null
  tags?: string[] | string | null
  [key: string]: unknown
}

interface VendorRow {
  id: string
  name: string
  category: string
  apiType: string
  isActive: boolean
  contactName: string | null
  contactEmail: string | null
  contactPhone: string | null
  website: string | null
  metadata?: unknown
  createdAt: Date
}

function asMetadata(metadata: unknown): SupplierMetadata {
  return metadata && typeof metadata === "object" && !Array.isArray(metadata) ? metadata as SupplierMetadata : {}
}

function formatCategory(category: string) {
  const labels: Record<string, string> = {
    house: "Villas / Houses",
    car: "Cars",
    yacht: "Yachts",
    jet: "Jets",
    service: "Partner Services",
  }
  return labels[category] || category
}

function formatApiType(apiType: string) {
  if (apiType === "hostaway") return "HostAway"
  return apiType
}

function formatInstagramHandle(value: unknown) {
  if (!value) return ""
  return String(value).trim().replace(/^@+/, "")
}

function getTags(tags: SupplierMetadata["tags"]) {
  if (Array.isArray(tags)) return tags.filter((tag): tag is string => typeof tag === "string" && !!tag.trim())
  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
  }
  return []
}

export function VendorListClient({ vendors }: { vendors: VendorRow[] }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Suppliers / Partners</h1>
          <p className="text-gray-400">Manage supplier relationships, contact details, and listing integrations</p>
        </div>
        <Link href="/admin/vendors/create">
          <Button className="bg-[#ECAC36] hover:bg-[#B8860B] text-black font-bold cut-corner">
            <Plus className="h-4 w-4 mr-2" />
            Add Supplier
          </Button>
        </Link>
      </div>

      {vendors.length === 0 ? (
        <Card className="bg-[#111111] border-[#333333] cut-corner">
          <CardContent className="text-center py-20">
            <Building2 className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">No suppliers or partners yet</p>
            <p className="text-gray-500 text-sm mb-6">Add a supplier profile to track contacts, terms, and imports</p>
            <Link href="/admin/vendors/create">
              <Button className="bg-[#ECAC36] hover:bg-[#B8860B] text-black font-bold cut-corner">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Supplier
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {vendors.map((vendor) => {
            const metadata = asMetadata(vendor.metadata)
            const supplierType = String(metadata.supplierType || metadata.categoryLabel || formatCategory(vendor.category))
            const instagramHandle = formatInstagramHandle(metadata.instagramHandle)
            const rating = metadata.internalRating ? Number(metadata.internalRating) : null
            const tags = getTags(metadata.tags)
            const hasContact = vendor.contactName || vendor.contactEmail || vendor.contactPhone

            return (
              <Card key={vendor.id} className="bg-[#111111] border-[#333333] cut-corner hover:border-[#ECAC36]/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#ECAC36]/10 flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-5 w-5 text-[#ECAC36]" />
                      </div>
                      <div className="min-w-0 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-white font-semibold leading-tight">{vendor.name}</h3>
                          <span className="text-xs px-2 py-0.5 rounded bg-[#ECAC36]/10 text-[#ECAC36]">
                            {supplierType}
                          </span>
                          {metadata.preferredSupplier && (
                            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300">
                              Preferred
                            </span>
                          )}
                          <span className={`text-xs px-2 py-0.5 rounded ${vendor.isActive ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                            {vendor.isActive ? "Active" : "Inactive"}
                          </span>
                          {vendor.apiType !== "none" && (
                            <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400">
                              {formatApiType(vendor.apiType)}
                            </span>
                          )}
                          {rating && Number.isFinite(rating) && (
                            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-300">
                              <Star className="h-3 w-3" />
                              {rating}/5
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400">
                          {hasContact ? (
                            <>
                              {vendor.contactName && <span>{vendor.contactName}</span>}
                              {vendor.contactEmail && (
                                <span className="inline-flex items-center gap-1">
                                  <Mail className="h-3.5 w-3.5" />
                                  {vendor.contactEmail}
                                </span>
                              )}
                              {vendor.contactPhone && (
                                <span className="inline-flex items-center gap-1">
                                  <Phone className="h-3.5 w-3.5" />
                                  {vendor.contactPhone}
                                </span>
                              )}
                            </>
                          ) : (
                            <span>Added {new Date(vendor.createdAt).toLocaleDateString()}</span>
                          )}
                          {metadata.serviceArea && <span>Service area: {String(metadata.serviceArea)}</span>}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          {vendor.website ? (
                            <a
                              href={vendor.website}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 rounded border border-[#333333] px-2 py-1 text-gray-300 hover:border-[#ECAC36]/60 hover:text-white"
                            >
                              <Globe2 className="h-3.5 w-3.5" />
                              Website
                            </a>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded border border-[#222222] px-2 py-1 text-gray-600">
                              <Globe2 className="h-3.5 w-3.5" />
                              No website
                            </span>
                          )}

                          {instagramHandle ? (
                            <a
                              href={`https://www.instagram.com/${instagramHandle}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 rounded border border-[#333333] px-2 py-1 text-gray-300 hover:border-[#ECAC36]/60 hover:text-white"
                            >
                              <Instagram className="h-3.5 w-3.5" />
                              @{instagramHandle}
                            </a>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded border border-[#222222] px-2 py-1 text-gray-600">
                              <Instagram className="h-3.5 w-3.5" />
                              No Instagram
                            </span>
                          )}

                          {tags.slice(0, 4).map((tag) => (
                            <span key={tag} className="rounded bg-[#0A0A0A] px-2 py-1 text-gray-400">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 lg:flex-shrink-0 lg:self-center">
                      {vendor.apiType !== "none" && (
                        <Link href={`/admin/vendors/${vendor.id}/import`}>
                          <Button variant="outline" size="sm" className="border-[#333333] bg-transparent text-gray-300 hover:text-white hover:border-[#ECAC36]">
                            <Download className="h-4 w-4 mr-1" />
                            Import
                          </Button>
                        </Link>
                      )}
                      <Link href={`/admin/vendors/${vendor.id}/edit`}>
                        <Button variant="outline" size="sm" className="border-[#333333] bg-transparent text-gray-300 hover:text-white hover:border-[#ECAC36]">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Download, Edit, Building2 } from "lucide-react"
import Link from "next/link"

interface VendorRow {
  id: string
  name: string
  category: string
  apiType: string
  isActive: boolean
  contactName: string | null
  contactEmail: string | null
  createdAt: Date
}

export function VendorListClient({ vendors }: { vendors: VendorRow[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Vendors</h1>
          <p className="text-gray-400">Manage vendor integrations and import listings</p>
        </div>
        <Link href="/admin/vendors/create">
          <Button className="bg-[#ECAC36] hover:bg-[#B8860B] text-black font-bold cut-corner">
            <Plus className="h-4 w-4 mr-2" />
            Add Vendor
          </Button>
        </Link>
      </div>

      {vendors.length === 0 ? (
        <Card className="bg-[#111111] border-[#333333] cut-corner">
          <CardContent className="text-center py-20">
            <Building2 className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">No vendors configured yet</p>
            <p className="text-gray-500 text-sm mb-6">Add a vendor to start importing listings via API</p>
            <Link href="/admin/vendors/create">
              <Button className="bg-[#ECAC36] hover:bg-[#B8860B] text-black font-bold cut-corner">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Vendor
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {vendors.map((vendor) => (
            <Card key={vendor.id} className="bg-[#111111] border-[#333333] cut-corner hover:border-[#ECAC36]/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#ECAC36]/10 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-[#ECAC36]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-semibold">{vendor.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded ${vendor.isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                          {vendor.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {vendor.apiType !== 'none' && (
                          <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400">
                            {vendor.apiType === 'hostaway' ? 'HostAway' : vendor.apiType}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {vendor.contactName && <span>{vendor.contactName}</span>}
                        {vendor.contactName && vendor.contactEmail && <span> &middot; </span>}
                        {vendor.contactEmail && <span>{vendor.contactEmail}</span>}
                        {!vendor.contactName && !vendor.contactEmail && (
                          <span>Added {new Date(vendor.createdAt).toLocaleDateString()}</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {vendor.apiType !== 'none' && (
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
          ))}
        </div>
      )}
    </div>
  )
}

import AdminLayout from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Car, Anchor, Home, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { ForSaleFilters } from "@/components/admin/for-sale-filters"
import { ForSaleActions } from "@/components/admin/for-sale-actions"
import { getAdminForSaleList } from "@/lib/admin-inventory-list-data"

export const dynamic = 'force-dynamic'

export default async function ForSaleAssetsPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string, category?: string, status?: string, managed?: string }>
}) {
  const { q, category, status, managed } = await searchParams

  const { assets, stats } = await getAdminForSaleList({ q, category, status, managed })

  const formatPrice = (price: string | null) => {
    if (!price) return " - "
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(price))
  }

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "car": return <Car className="h-4 w-4" />
      case "yacht": return <Anchor className="h-4 w-4" />
      case "villa": return <Home className="h-4 w-4" />
      default: return null
    }
  }

  const getStatusBadge = (assetStatus: string) => {
    const variants: Record<string, string> = {
      Live: "bg-green-500/20 text-green-400 border-green-500/30",
      Draft: "bg-gray-500/20 text-gray-400 border-gray-500/30",
      UnderOffer: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      Sold: "bg-red-500/20 text-red-400 border-red-500/30",
    }
    return <Badge className={`cut-corner ${variants[assetStatus] || variants.Draft}`}>{assetStatus}</Badge>
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">For Sale Assets</h1>
            <p className="text-gray-400">Manage luxury assets available for purchase</p>
          </div>
          <Link href="/admin/for-sale/create">
            <Button className="cut-corner bg-[#ECAC36] hover:bg-[#B8860B] text-black font-semibold">
              <Plus className="mr-2 h-4 w-4" />
              Add Asset
            </Button>
          </Link>
        </div>

        <ForSaleFilters />

        <Card className="bg-[#111111] border-[#333333] cut-corner">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#333333]">
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Asset</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Category</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Advertised Price</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Managed Price</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Updated</th>
                    <th className="text-right py-3 px-4 text-gray-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12">
                        <div className="text-gray-400 mb-4">No assets found</div>
                        <Link href="/admin/for-sale/create">
                          <Button className="bg-[#ECAC36] hover:bg-[#B8860B] text-black font-bold cut-corner">
                            <Plus className="h-4 w-4 mr-2" />
                            Create Your First Asset
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ) : (
                    assets.map((asset) => (
                      <tr key={asset.id} className="border-b border-[#333333] hover:bg-[#0A0A0A]">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            {asset.heroImage ? (
                              <img
                                src={asset.heroImage}
                                alt={asset.title}
                                className="w-12 h-12 object-cover cut-corner"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-[#333] cut-corner flex items-center justify-center text-gray-400">
                                {getCategoryIcon(asset.category)}
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-white">{asset.title}</p>
                              <p className="text-sm text-gray-400">{asset.year ? `${asset.year} • ` : ""}{asset.location || "No location"}</p>
                              <div className="flex gap-1 mt-1 flex-wrap">
                                {!asset.year && (
                                  <Badge className="text-xs bg-orange-500/20 text-orange-400 border-orange-500/30" title="Year is missing - please add in edit form">
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    Missing Year
                                  </Badge>
                                )}
                                {Array.isArray(asset.badges) && asset.badges.length > 0 && (
                                  (asset.badges as string[]).map((badge) => (
                                    <Badge key={badge} className="text-xs bg-[#ECAC36]/20 text-[#ECAC36] border-[#ECAC36]/30 cut-corner">
                                      {badge}
                                    </Badge>
                                  ))
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2 text-white">
                            {getCategoryIcon(asset.category)}
                            <span className="capitalize">{asset.category}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">{getStatusBadge(asset.status)}</td>
                        <td className="py-4 px-4 text-white font-medium">{formatPrice(asset.advertisedPrice)}</td>
                        <td className="py-4 px-4 text-[#ECAC36] font-medium">{formatPrice(asset.managedAssetPrice)}</td>
                        <td className="py-4 px-4 text-gray-400">
                          {asset.updatedAt ? new Date(asset.updatedAt).toLocaleDateString() : " - "}
                        </td>
                        <td className="py-4 px-4">
                          <ForSaleActions assetId={asset.id} assetStatus={asset.status} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-[#111111] border-[#333333] cut-corner">
            <CardContent className="p-4">
              <p className="text-sm text-gray-400">Total Assets</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </CardContent>
          </Card>
          <Card className="bg-[#111111] border-[#333333] cut-corner">
            <CardContent className="p-4">
              <p className="text-sm text-gray-400">Live</p>
              <p className="text-2xl font-bold text-green-400">{stats.live}</p>
            </CardContent>
          </Card>
          <Card className="bg-[#111111] border-[#333333] cut-corner">
            <CardContent className="p-4">
              <p className="text-sm text-gray-400">Under Offer</p>
              <p className="text-2xl font-bold text-yellow-400">{stats.underOffer}</p>
            </CardContent>
          </Card>
          <Card className="bg-[#111111] border-[#333333] cut-corner">
            <CardContent className="p-4">
              <p className="text-sm text-gray-400">With Managed Price</p>
              <p className="text-2xl font-bold text-[#ECAC36]">{stats.withManagedPrice}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}

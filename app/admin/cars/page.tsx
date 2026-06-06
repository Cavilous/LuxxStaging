import AdminLayout from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Car, Upload } from "lucide-react"
import Link from "next/link"
import { InventoryListClient } from "@/components/admin/inventory-list-client"
import { SearchFilterBar } from "@/components/admin/search-filter-bar"
import { FilterSelect } from "@/components/admin/filter-select"
import { Pagination } from "@/components/admin/pagination"
import { getAdminInventoryList } from "@/lib/admin-inventory-list-data"

export const dynamic = 'force-dynamic'

export default async function AdminCarsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ q?: string, status?: string, brand?: string, category?: string, page?: string, sort?: string, order?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const { q, status, brand } = resolvedSearchParams
  const page = Number(resolvedSearchParams.page) || 1
  const itemsPerPage = 20
  const sortColumn = resolvedSearchParams.sort || null
  const sortOrder = (resolvedSearchParams.order as 'asc' | 'desc') || 'desc'

  const { totalCount, items: cars } = await getAdminInventoryList({
    category: "car",
    q,
    status,
    brand,
    page,
    itemsPerPage,
    sortColumn,
    sortOrder,
  })

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Cars</h1>
            <p className="text-gray-400">Manage your luxury car inventory</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/cars/import">
              <Button variant="outline" className="border-[#ECAC36] text-[#ECAC36] hover:bg-[#ECAC36]/10 cut-corner">
                <Upload className="h-4 w-4 mr-2" />
                Import CSV
              </Button>
            </Link>
            <Link href="/admin/cars/create">
              <Button className="bg-[#ECAC36] hover:bg-[#B8860B] text-black font-bold cut-corner">
                <Plus className="h-4 w-4 mr-2" />
                Add Car
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-[#111111] border-[#333333] cut-corner">
          <CardContent className="p-4">
            <SearchFilterBar 
              placeholder="Search cars..."
              filterSlot={
                <>
                  <FilterSelect 
                    paramKey="status"
                    label="All Status"
                    options={[
                      { label: "Published", value: "published" },
                      { label: "Draft", value: "draft" }
                    ]}
                  />
                  <FilterSelect 
                    paramKey="brand"
                    label="All Brands"
                    options={[
                      { label: "Lamborghini", value: "lamborghini" },
                      { label: "Ferrari", value: "ferrari" },
                      { label: "McLaren", value: "mclaren" },
                      { label: "Rolls-Royce", value: "rolls-royce" },
                      { label: "Bentley", value: "bentley" },
                      { label: "Porsche", value: "porsche" },
                      { label: "Mercedes", value: "mercedes" }
                    ]}
                  />
                </>
              }
            />
          </CardContent>
        </Card>

        {/* Cars Table */}
        <Card className="bg-[#111111] border-[#333333] cut-corner">
          <CardHeader>
            <CardTitle className="text-white">Cars ({totalCount})</CardTitle>
          </CardHeader>
          <CardContent>
            {!cars?.length ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">No cars found</div>
                <Link href="/admin/cars/create">
                  <Button className="bg-[#ECAC36] hover:bg-[#B8860B] text-black font-bold cut-corner">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Car
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <InventoryListClient 
                  items={cars as any} 
                  category="car" 
                  icon={<Car className="h-6 w-6 text-gray-600" />} 
                />
                <Pagination 
                  currentPage={page}
                  totalItems={totalCount}
                  itemsPerPage={itemsPerPage}
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

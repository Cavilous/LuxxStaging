import AdminLayout from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Anchor, Upload } from "lucide-react"
import Link from "next/link"
import { InventoryListClient } from "@/components/admin/inventory-list-client"
import { db } from "@/lib/db"
import { inventory } from "@/lib/db/schema"
import { eq, desc, asc, and, or, ilike, sql } from "drizzle-orm"
import { SearchFilterBar } from "@/components/admin/search-filter-bar"
import { FilterSelect } from "@/components/admin/filter-select"
import { Pagination } from "@/components/admin/pagination"

export const dynamic = 'force-dynamic'

export default async function AdminYachtsPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string, status?: string, page?: string, sort?: string, order?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const { q, status } = resolvedSearchParams
  const page = Number(resolvedSearchParams.page) || 1
  const itemsPerPage = 20
  const sortColumn = resolvedSearchParams.sort || null
  const sortOrder = (resolvedSearchParams.order as 'asc' | 'desc') || 'desc'

  const conditions = [eq(inventory.category, "yacht")]

  if (q) {
    conditions.push(
      or(
        ilike(inventory.title, `%${q}%`),
        ilike(inventory.subtitle, `%${q}%`)
      )!
    )
  }

  if (status === "published") {
    conditions.push(eq(inventory.isPublished, true))
  } else if (status === "draft") {
    conditions.push(eq(inventory.isPublished, false))
  }

  const [totalCountResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(inventory)
    .where(and(...conditions))
  const totalCount = totalCountResult?.count || 0

  const yachts = await db
    .select()
    .from(inventory)
    .where(and(...conditions))
    .orderBy(
      sortColumn === "title" ? (sortOrder === "asc" ? asc(inventory.title) : desc(inventory.title)) :
      sortColumn === "price" ? (sortOrder === "asc" ? asc(inventory.pricePer4Hr) : desc(inventory.pricePer4Hr)) :
      sortOrder === "asc" ? asc(inventory.createdAt) : desc(inventory.createdAt)
    )
    .limit(itemsPerPage)
    .offset((page - 1) * itemsPerPage)

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Yachts</h1>
            <p className="text-gray-400">Manage your luxury yacht inventory</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/yachts/import">
              <Button variant="outline" className="border-[#ECAC36] text-[#ECAC36] hover:bg-[#ECAC36]/10 cut-corner">
                <Upload className="h-4 w-4 mr-2" />
                Import CSV
              </Button>
            </Link>
            <Link href="/admin/yachts/create">
              <Button className="bg-[#ECAC36] hover:bg-[#B8860B] text-black font-bold cut-corner">
                <Plus className="h-4 w-4 mr-2" />
                Add Yacht
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-[#111111] border-[#333333] cut-corner">
          <CardContent className="p-4">
            <SearchFilterBar 
              placeholder="Search yachts..."
              filterSlot={
                <FilterSelect 
                  paramKey="status"
                  label="All Status"
                  options={[
                    { label: "Published", value: "published" },
                    { label: "Draft", value: "draft" }
                  ]}
                />
              }
            />
          </CardContent>
        </Card>

        {/* Yachts Table */}
        <Card className="bg-[#111111] border-[#333333] cut-corner">
          <CardHeader>
            <CardTitle className="text-white">Yachts ({totalCount})</CardTitle>
          </CardHeader>
          <CardContent>
            {!yachts?.length ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">No yachts found</div>
                <Link href="/admin/yachts/create">
                  <Button className="bg-[#ECAC36] hover:bg-[#B8860B] text-black font-bold cut-corner">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Yacht
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <InventoryListClient 
                  items={yachts as any} 
                  category="yacht" 
                  icon={<Anchor className="h-6 w-6 text-gray-600" />} 
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

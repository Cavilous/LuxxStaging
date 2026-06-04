import AdminLayout from "@/components/admin-layout"
import { VendorListClient } from "@/components/admin/vendor-list-client"
import { db } from "@/lib/db"
import { vendors } from "@/lib/db/schema"
import { desc } from "drizzle-orm"

export const dynamic = 'force-dynamic'

export default async function VendorsPage() {
  const allVendors = await db
    .select({
      id: vendors.id,
      name: vendors.name,
      category: vendors.category,
      apiType: vendors.apiType,
      isActive: vendors.isActive,
      contactName: vendors.contactName,
      contactEmail: vendors.contactEmail,
      createdAt: vendors.createdAt,
    })
    .from(vendors)
    .orderBy(desc(vendors.createdAt))

  return (
    <AdminLayout>
      <div className="p-8">
        <VendorListClient vendors={allVendors} />
      </div>
    </AdminLayout>
  )
}

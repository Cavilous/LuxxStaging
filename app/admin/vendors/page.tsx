import AdminLayout from "@/components/admin-layout"
import { VendorListClient } from "@/components/admin/vendor-list-client"
import { db } from "@/lib/db"
import { vendors } from "@/lib/db/schema"
import { desc } from "drizzle-orm"
import { getDemoSafeAccessibleSections, getDemoSafeCurrentUser } from "../demo-safe-admin"

export const dynamic = 'force-dynamic'

export default async function VendorsPage() {
  const [currentUser, accessibleSections] = await Promise.all([
    getDemoSafeCurrentUser(),
    getDemoSafeAccessibleSections(),
  ])
  let allVendors: any[] = []

  try {
    allVendors = await db
      .select({
        id: vendors.id,
        name: vendors.name,
        category: vendors.category,
        apiType: vendors.apiType,
        isActive: vendors.isActive,
        contactName: vendors.contactName,
        contactEmail: vendors.contactEmail,
        contactPhone: vendors.contactPhone,
        website: vendors.website,
        metadata: vendors.metadata,
        createdAt: vendors.createdAt,
      })
      .from(vendors)
      .orderBy(desc(vendors.createdAt))
  } catch (error) {
    console.error("Error loading vendors:", error)
  }

  return (
    <AdminLayout
      user={currentUser ? { email: currentUser.email, role: currentUser.role } : null}
      accessibleSections={accessibleSections}
    >
      <div className="p-8">
        <VendorListClient vendors={allVendors} />
      </div>
    </AdminLayout>
  )
}

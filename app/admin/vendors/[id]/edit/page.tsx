import AdminLayout from "@/components/admin-layout"
import { VendorFormClient } from "@/components/admin/vendor-form-client"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { db } from "@/lib/db"
import { vendors } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
export default async function EditVendorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [vendor] = await db
    .select()
    .from(vendors)
    .where(eq(vendors.id, id))
    .limit(1)

  if (!vendor) {
    notFound()
  }

  const vendorForClient = {
    ...vendor,
    apiCredentials: vendor.apiCredentials && typeof vendor.apiCredentials === 'object'
      ? Object.fromEntries(
          Object.entries(vendor.apiCredentials as Record<string, string>).map(
            ([k, v]) => [k, typeof v === 'string' && v.length > 4 ? v.slice(0, 4) + '****' : '****']
          )
        )
      : vendor.apiCredentials,
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <Link
          href="/admin/vendors"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Vendors
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Edit Vendor</h1>
          <p className="text-gray-400">Update vendor details and API configuration</p>
        </div>

        <VendorFormClient vendor={vendorForClient} />
      </div>
    </AdminLayout>
  )
}

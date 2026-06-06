import AdminLayout from "@/components/admin-layout"
import { VendorImportClient } from "@/components/admin/vendor-import-client"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { db } from "@/lib/db"
import { vendors } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
export default async function VendorImportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [vendor] = await db
    .select()
    .from(vendors)
    .where(eq(vendors.id, id))
    .limit(1)

  if (!vendor) {
    notFound()
  }

  if (vendor.apiType === 'none') {
    return (
      <AdminLayout>
        <div className="p-8">
          <Link
            href="/admin/vendors"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Suppliers
          </Link>
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">This supplier has no API integration configured.</p>
            <Link href={`/admin/vendors/${id}/edit`} className="text-[#ECAC36] hover:underline mt-2 inline-block">
              Configure API settings
            </Link>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <Link
          href="/admin/vendors"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Suppliers
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Import from {vendor.name}</h1>
          <p className="text-gray-400">Fetch and import supplier listings via {vendor.apiType === 'hostaway' ? 'HostAway' : vendor.apiType} API</p>
        </div>

        <VendorImportClient vendorId={vendor.id} vendorName={vendor.name} apiType={vendor.apiType} />
      </div>
    </AdminLayout>
  )
}

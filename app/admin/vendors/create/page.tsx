import AdminLayout from "@/components/admin-layout"
import { VendorFormClient } from "@/components/admin/vendor-form-client"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CreateVendorPage() {
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
          <h1 className="text-4xl font-bold text-white mb-2">Add Vendor</h1>
          <p className="text-gray-400">Configure a new vendor with optional API integration</p>
        </div>

        <VendorFormClient />
      </div>
    </AdminLayout>
  )
}

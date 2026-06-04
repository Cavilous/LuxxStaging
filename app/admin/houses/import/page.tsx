import AdminLayout from "@/components/admin-layout"
import { ImportVillasClient } from "@/components/admin/import-villas-client"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ImportVillasPage() {
  return (
    <AdminLayout>
      <div className="p-8">
        <Link
          href="/admin/houses"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Villas
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Import Villas from CSV</h1>
          <p className="text-gray-400">Upload a CSV file to bulk import luxury villas</p>
        </div>

        <ImportVillasClient />
      </div>
    </AdminLayout>
  )
}

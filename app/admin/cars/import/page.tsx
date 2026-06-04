import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import AdminLayout from "@/components/admin-layout"
import { ImportCarsClient } from "@/components/admin/import-cars-client"

export default function ImportCarsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link href="/admin/cars">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cars
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Import Cars from CSV</h1>
            <p className="text-gray-400">Upload a CSV file to bulk import luxury cars</p>
          </div>
        </div>

        <ImportCarsClient />
      </div>
    </AdminLayout>
  )
}

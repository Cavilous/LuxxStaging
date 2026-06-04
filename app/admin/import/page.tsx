import { ImportClient } from "@/components/admin/import-client"
import { SlugMigration } from "@/components/admin/slug-migration"

export default async function ImportPage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Bulk Import</h1>
        <p className="text-gray-400">Import cars, yachts, and villas from CSV or TSV files</p>
      </div>

      <div className="mb-8">
        <SlugMigration />
      </div>

      <ImportClient />
    </div>
  )
}

import AdminLayout from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Package } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function RepairPackagesPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Repair Packages</h1>
            <p className="text-gray-400">Manage service packages and pricing</p>
          </div>
          <Button className="bg-[#ECAC36] hover:bg-[#B8860B] text-black font-bold cut-corner">
            <Plus className="h-4 w-4 mr-2" />
            Add New Package
          </Button>
        </div>

        {/* Packages Table */}
        <Card className="bg-[#111111] border-[#333333] cut-corner">
          <CardHeader>
            <CardTitle className="text-white">Service Packages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No service packages created</h3>
              <p className="text-gray-400 mb-6">
                Create service packages to offer bundled repair services at set prices.
              </p>
              <Button className="bg-[#ECAC36] hover:bg-[#B8860B] text-black font-bold cut-corner">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Package
              </Button>
              <div className="bg-[#0A0A0A] border border-[#333333] rounded-lg p-6 max-w-2xl mx-auto text-left mt-8">
                <h4 className="text-sm font-semibold text-[#ECAC36] mb-3">Package Examples:</h4>
                <ul className="text-sm text-gray-400 space-y-2">
                  <li>• <span className="text-white">PPF Full Front Package</span> - Hood, Fenders, Bumper - $2,500</li>
                  <li>• <span className="text-white">Ceramic Coating Premium</span> - Full exterior + wheels - $1,800</li>
                  <li>• <span className="text-white">Vinyl Wrap Full Body</span> - Color change wrap - $4,500</li>
                  <li>• <span className="text-white">Ultimate Protection</span> - PPF + Ceramic + Tint - $6,000</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

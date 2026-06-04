import AdminLayout from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Shield } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function RepairCapabilitiesPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Repair Capabilities</h1>
            <p className="text-gray-400">Manage services your shop offers</p>
          </div>
          <Button className="bg-[#ECAC36] hover:bg-[#B8860B] text-black font-bold cut-corner">
            <Plus className="h-4 w-4 mr-2" />
            Add New Service
          </Button>
        </div>

        {/* Capabilities Table */}
        <Card className="bg-[#111111] border-[#333333] cut-corner">
          <CardHeader>
            <CardTitle className="text-white">Available Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Shield className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No services configured</h3>
              <p className="text-gray-400 mb-6">
                Define what repair and protection services your shop can provide.
              </p>
              <Button className="bg-[#ECAC36] hover:bg-[#B8860B] text-black font-bold cut-corner">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Service
              </Button>
              <div className="bg-[#0A0A0A] border border-[#333333] rounded-lg p-6 max-w-2xl mx-auto text-left mt-8">
                <h4 className="text-sm font-semibold text-[#ECAC36] mb-3">Common Services:</h4>
                <ul className="text-sm text-gray-400 space-y-2">
                  <li>• <span className="text-white">Paint Protection Film (PPF)</span> - Clear bra installation</li>
                  <li>• <span className="text-white">Ceramic Coating</span> - Professional paint protection</li>
                  <li>• <span className="text-white">Vinyl Wrap</span> - Color change & custom graphics</li>
                  <li>• <span className="text-white">Window Tinting</span> - Automotive window film</li>
                  <li>• <span className="text-white">Paint Correction</span> - Swirl removal & polishing</li>
                  <li>• <span className="text-white">Detailing</span> - Interior & exterior detailing</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

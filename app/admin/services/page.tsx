import AdminLayout from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Settings } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function ServicesPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Services</h1>
            <p className="text-gray-400">Manage general service offerings</p>
          </div>
          <Button className="bg-[#ECAC36] hover:bg-[#B8860B] text-black font-bold cut-corner">
            <Plus className="h-4 w-4 mr-2" />
            Add New Service
          </Button>
        </div>

        {/* Services Table */}
        <Card className="bg-[#111111] border-[#333333] cut-corner">
          <CardHeader>
            <CardTitle className="text-white">Service Offerings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Settings className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No services created</h3>
              <p className="text-gray-400 mb-6">
                Define the services you offer beyond vehicle rentals and repairs.
              </p>
              <Button className="bg-[#ECAC36] hover:bg-[#B8860B] text-black font-bold cut-corner">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Service
              </Button>
              <div className="bg-[#0A0A0A] border border-[#333333] rounded-lg p-6 max-w-2xl mx-auto text-left mt-8">
                <h4 className="text-sm font-semibold text-[#ECAC36] mb-3">Service Examples:</h4>
                <ul className="text-sm text-gray-400 space-y-2">
                  <li>• <span className="text-white">Luxury Tours</span> - Guided tours of Miami in exotic vehicles</li>
                  <li>• <span className="text-white">Concierge Services</span> - VIP assistance and planning</li>
                  <li>• <span className="text-white">Event Planning</span> - Luxury vehicle rental for special events</li>
                  <li>• <span className="text-white">Airport Transfer</span> - Premium pickup and drop-off service</li>
                  <li>• <span className="text-white">Photography Services</span> - Professional vehicle photoshoots</li>
                  <li>• <span className="text-white">Yacht Charters</span> - Private yacht booking service</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

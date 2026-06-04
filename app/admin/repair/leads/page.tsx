import AdminLayout from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClipboardList } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function RepairLeadsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Repair Leads</h1>
            <p className="text-gray-400">Manage repair service inquiries from customers</p>
          </div>
        </div>

        {/* Leads Table */}
        <Card className="bg-[#111111] border-[#333333] cut-corner">
          <CardHeader>
            <CardTitle className="text-white">Customer Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <ClipboardList className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No repair leads yet</h3>
              <p className="text-gray-400 mb-6">
                Leads from the repair page will appear here. When customers submit repair inquiries,<br />
                you'll be able to track and manage them in this section.
              </p>
              <div className="bg-[#0A0A0A] border border-[#333333] rounded-lg p-6 max-w-2xl mx-auto text-left">
                <h4 className="text-sm font-semibold text-[#ECAC36] mb-3">Expected Columns:</h4>
                <ul className="text-sm text-gray-400 space-y-2">
                  <li>• Customer Name & Contact Information</li>
                  <li>• Services Requested (PPF, Ceramic Coating, Vinyl Wrap, etc.)</li>
                  <li>• Vehicle Information</li>
                  <li>• Status (New / Contacted / Completed)</li>
                  <li>• Submission Date</li>
                  <li>• Actions (View Details, Update Status, Mark Complete)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

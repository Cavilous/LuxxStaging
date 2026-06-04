import AdminLayout from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function RepairSettingsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Repair Shop Settings</h1>
            <p className="text-gray-400">Configure your repair shop information</p>
          </div>
        </div>

        {/* Settings Form */}
        <Card className="bg-[#111111] border-[#333333] cut-corner">
          <CardHeader>
            <CardTitle className="text-white">Shop Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="shopName" className="text-gray-300">Shop Name</Label>
                  <Input
                    id="shopName"
                    placeholder="Luxx Miami Auto Detailing"
                    className="bg-[#0A0A0A] border-[#333333] text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail" className="text-gray-300">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="repair@luxxmiami.com"
                    className="bg-[#0A0A0A] border-[#333333] text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(305) 555-0100"
                    className="bg-[#0A0A0A] border-[#333333] text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessHours" className="text-gray-300">Business Hours</Label>
                  <Input
                    id="businessHours"
                    placeholder="Mon-Fri: 8AM-6PM, Sat: 9AM-4PM"
                    className="bg-[#0A0A0A] border-[#333333] text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-gray-300">Location Address</Label>
                <Textarea
                  id="location"
                  placeholder="123 Ocean Drive, Miami Beach, FL 33139"
                  rows={3}
                  className="bg-[#0A0A0A] border-[#333333] text-white resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-300">Shop Description</Label>
                <Textarea
                  id="description"
                  placeholder="Professional paint protection, ceramic coating, and vinyl wrap services for luxury vehicles..."
                  rows={4}
                  className="bg-[#0A0A0A] border-[#333333] text-white resize-none"
                />
              </div>

              <div className="flex justify-end">
                <Button className="bg-[#ECAC36] hover:bg-[#B8860B] text-black font-bold cut-corner">
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Additional Settings */}
        <Card className="bg-[#111111] border-[#333333] cut-corner">
          <CardHeader>
            <CardTitle className="text-white">Notification Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-[#333333]">
                <div>
                  <h4 className="text-white font-medium">Email Notifications</h4>
                  <p className="text-sm text-gray-400">Receive email when new leads are submitted</p>
                </div>
                <div className="bg-[#0A0A0A] border border-[#333333] rounded px-4 py-2 text-sm text-gray-400">
                  Coming Soon
                </div>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-[#333333]">
                <div>
                  <h4 className="text-white font-medium">SMS Notifications</h4>
                  <p className="text-sm text-gray-400">Get text alerts for urgent inquiries</p>
                </div>
                <div className="bg-[#0A0A0A] border border-[#333333] rounded px-4 py-2 text-sm text-gray-400">
                  Coming Soon
                </div>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <h4 className="text-white font-medium">Auto-Response</h4>
                  <p className="text-sm text-gray-400">Automatically reply to new lead submissions</p>
                </div>
                <div className="bg-[#0A0A0A] border border-[#333333] rounded px-4 py-2 text-sm text-gray-400">
                  Coming Soon
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

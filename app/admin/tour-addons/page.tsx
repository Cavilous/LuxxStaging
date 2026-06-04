import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AdminLayout from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, DollarSign, Users, Package } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function AdminTourAddOnsPage() {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/admin/login")
  }

  // Get admin user info
  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("*")
    .eq("email", session.user.email)
    .eq("is_active", true)
    .single()

  if (!adminUser) {
    redirect("/admin/login?error=unauthorized")
  }

  // Get tour add-ons
  const { data: addOns } = await supabase.from("tour_addons").select("*").order("created_at", { ascending: false })

  return (
    <AdminLayout user={adminUser}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Tour Add-Ons</h1>
            <p className="text-gray-400">Manage optional tour upgrades and services</p>
          </div>
          <Link href="/admin/tour-addons/create">
            <Button className="bg-[#ECAC36] hover:bg-[#B8860B] text-black font-bold cut-corner">
              <Plus className="h-4 w-4 mr-2" />
              Add Add-On
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="bg-[#111111] border-[#333333] cut-corner">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search add-ons..."
                  className="pl-10 bg-[#0A0A0A] border-[#333333] text-white cut-corner"
                />
              </div>
              <Button
                variant="outline"
                className="border-[#333333] text-gray-300 hover:bg-[#222222] cut-corner bg-transparent"
              >
                All Status
              </Button>
              <Button
                variant="outline"
                className="border-[#333333] text-gray-300 hover:bg-[#222222] cut-corner bg-transparent"
              >
                Pricing Type
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Add-Ons Table */}
        <Card className="bg-[#111111] border-[#333333] cut-corner">
          <CardHeader>
            <CardTitle className="text-white">Add-Ons ({addOns?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#333333]">
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Add-On</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Price</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Pricing Type</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Created</th>
                    <th className="text-right py-3 px-4 text-gray-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {addOns?.map((addon) => (
                    <tr key={addon.id} className="border-b border-[#333333] hover:bg-[#0A0A0A]">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-[#ECAC36]/20 rounded-lg flex items-center justify-center">
                            <Package className="h-4 w-4 text-[#ECAC36]" />
                          </div>
                          <div className="font-medium text-white">{addon.title}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center text-[#ECAC36] font-medium">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {addon.price}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          className={`${
                            addon.per_passenger
                              ? "bg-blue-500/10 text-blue-400 border-blue-500/50"
                              : "bg-green-500/10 text-green-400 border-green-500/50"
                          }`}
                        >
                          {addon.per_passenger ? (
                            <>
                              <Users className="h-3 w-3 mr-1" />
                              Per Passenger
                            </>
                          ) : (
                            <>
                              <Package className="h-3 w-3 mr-1" />
                              Per Booking
                            </>
                          )}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        {addon.is_active ? (
                          <Badge className="bg-green-500/10 text-green-400 border-green-500/50">Active</Badge>
                        ) : (
                          <Badge className="bg-gray-500/10 text-gray-400 border-gray-500/50">Inactive</Badge>
                        )}
                      </td>
                      <td className="py-4 px-4 text-gray-400">{new Date(addon.created_at).toLocaleDateString()}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end space-x-2">
                          <Link href={`/admin/tour-addons/${addon.id}/edit`}>
                            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!addOns?.length && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">No add-ons found</div>
                  <Link href="/admin/tour-addons/create">
                    <Button className="bg-[#ECAC36] hover:bg-[#B8860B] text-black font-bold cut-corner">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Add-On
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

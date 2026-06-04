import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AdminLayout from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, MapPin, Clock } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function AdminTourRoutesPage() {
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

  // Get tour routes
  const { data: routes } = await supabase.from("tour_routes").select("*").order("created_at", { ascending: false })

  return (
    <AdminLayout user={adminUser}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Tour Routes</h1>
            <p className="text-gray-400">Manage tour routes and waypoints</p>
          </div>
          <Link href="/admin/tour-routes/create">
            <Button className="bg-[#ECAC36] hover:bg-[#B8860B] text-black font-bold cut-corner">
              <Plus className="h-4 w-4 mr-2" />
              Add Route
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
                  placeholder="Search routes..."
                  className="pl-10 bg-[#0A0A0A] border-[#333333] text-white cut-corner"
                />
              </div>
              <Button
                variant="outline"
                className="border-[#333333] text-gray-300 hover:bg-[#222222] cut-corner bg-transparent"
              >
                All Durations
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Routes Table */}
        <Card className="bg-[#111111] border-[#333333] cut-corner">
          <CardHeader>
            <CardTitle className="text-white">Routes ({routes?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#333333]">
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Route</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Duration</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Waypoints</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Photo Stop</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Created</th>
                    <th className="text-right py-3 px-4 text-gray-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {routes?.map((route) => (
                    <tr key={route.id} className="border-b border-[#333333] hover:bg-[#0A0A0A]">
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-white">{route.title}</div>
                          <div className="text-sm text-gray-400 line-clamp-2">{route.description}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/50">
                          <Clock className="h-3 w-3 mr-1" />
                          {route.duration}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center text-gray-300">
                          <MapPin className="h-4 w-4 mr-1 text-[#ECAC36]" />
                          {Array.isArray(route.waypoints) ? route.waypoints.length : 0} stops
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {route.has_photo_stop ? (
                          <Badge className="bg-green-500/10 text-green-400 border-green-500/50">Yes</Badge>
                        ) : (
                          <Badge className="bg-gray-500/10 text-gray-400 border-gray-500/50">No</Badge>
                        )}
                      </td>
                      <td className="py-4 px-4 text-gray-400">{new Date(route.created_at).toLocaleDateString()}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end space-x-2">
                          <Link href={`/admin/tour-routes/${route.id}/edit`}>
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
              {!routes?.length && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">No routes found</div>
                  <Link href="/admin/tour-routes/create">
                    <Button className="bg-[#ECAC36] hover:bg-[#B8860B] text-black font-bold cut-corner">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Route
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

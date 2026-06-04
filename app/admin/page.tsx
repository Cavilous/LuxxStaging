import { redirect } from "next/navigation"
import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, Anchor, Home, Plane, Globe } from "lucide-react"
import { db } from "@/lib/db"
import { inventory } from "@/lib/db/schema"
import { getCurrentUser } from "@/lib/auth-helpers"
import { getUserAccessibleSections } from "@/lib/role-permissions-actions"

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const currentUser = await getCurrentUser()
  
  if (!currentUser) {
    redirect("/admin/login")
  }
  
  const accessibleSections = await getUserAccessibleSections()
  
  // Get inventory counts
  const inventoryCounts = await db.select({ category: inventory.category }).from(inventory)

  const counts =
    inventoryCounts?.reduce((acc: any, item: any) => {
      acc[item.category] = (acc[item.category] || 0) + 1
      return acc
    }, {}) || {}

  const stats = [
    {
      title: "Cars",
      value: counts.car || 0,
      icon: Car,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Yachts",
      value: counts.yacht || 0,
      icon: Anchor,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
    },
    {
      title: "Houses",
      value: counts.villa || 0,
      icon: Home,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Jets",
      value: counts.jet || 0,
      icon: Plane,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
  ]

  return (
    <AdminLayout 
      user={currentUser ? { email: currentUser.email, role: currentUser.role } : null}
      accessibleSections={accessibleSections}
    >
      <div className="space-y-6">
        {/* Welcome */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, Admin</h1>
          <p className="text-gray-400">Manage your luxury rental inventory and content</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="bg-[#111111] border-[#333333] cut-corner">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <p className="text-xs text-gray-400 mt-1">Total {stat.title.toLowerCase()}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="bg-[#111111] border-[#333333] cut-corner">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <a
                href="/admin/cars"
                className="flex items-center space-x-3 p-4 bg-[#0A0A0A] hover:bg-[#222222] transition-colors cut-corner border border-[#333333]"
              >
                <Car className="h-5 w-5 text-[#ECAC36]" />
                <span className="text-white">Manage Cars</span>
              </a>
              <a
                href="/admin/yachts"
                className="flex items-center space-x-3 p-4 bg-[#0A0A0A] hover:bg-[#222222] transition-colors cut-corner border border-[#333333]"
              >
                <Anchor className="h-5 w-5 text-[#ECAC36]" />
                <span className="text-white">Manage Yachts</span>
              </a>
              <a
                href="/admin/houses"
                className="flex items-center space-x-3 p-4 bg-[#0A0A0A] hover:bg-[#222222] transition-colors cut-corner border border-[#333333]"
              >
                <Home className="h-5 w-5 text-[#ECAC36]" />
                <span className="text-white">Manage Houses</span>
              </a>
              <a
                href="/admin/jets"
                className="flex items-center space-x-3 p-4 bg-[#0A0A0A] hover:bg-[#222222] transition-colors cut-corner border border-[#333333]"
              >
                <Plane className="h-5 w-5 text-[#ECAC36]" />
                <span className="text-white">Manage Jets</span>
              </a>
              <a
                href="/admin/seo-pages"
                className="flex items-center space-x-3 p-4 bg-[#0A0A0A] hover:bg-[#222222] transition-colors cut-corner border border-[#333333]"
              >
                <Globe className="h-5 w-5 text-[#ECAC36]" />
                <span className="text-white">SEO Pages</span>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

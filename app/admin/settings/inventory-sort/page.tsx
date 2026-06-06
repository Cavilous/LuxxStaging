import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpDown, ShieldAlert } from "lucide-react"
import { redirect } from "next/navigation"
import { getAllSortSettings } from "@/lib/sort-settings-actions"
import { InventorySortSettings } from "@/components/admin/inventory-sort-settings"
import { canUseDemoSafeAdminAccess, getDemoSafeAccessibleSections, getDemoSafeCurrentUser } from "../../demo-safe-admin"

export const dynamic = 'force-dynamic'

export default async function InventorySortPage() {
  const [currentUser, accessibleSections] = await Promise.all([
    getDemoSafeCurrentUser(),
    getDemoSafeAccessibleSections(),
  ])

  if (!currentUser) {
    redirect("/admin/login")
  }

  if (!canUseDemoSafeAdminAccess(currentUser)) {
    return (
      <AdminLayout
        user={{ email: currentUser.email, role: currentUser.role }}
        accessibleSections={accessibleSections}
      >
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <ShieldAlert className="h-16 w-16 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400 text-center max-w-md">
            You do not have permission to access inventory sort settings.
            Only super administrators can manage display settings.
          </p>
        </div>
      </AdminLayout>
    )
  }

  const settings = await getAllSortSettings()

  return (
    <AdminLayout
      user={{ email: currentUser.email, role: currentUser.role }}
      accessibleSections={accessibleSections}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Inventory Sort Order</h1>
            <p className="text-gray-400">
              Control how items are ordered on the public listing pages
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-[#ECAC36]/10 border border-[#ECAC36]/50 rounded-lg">
            <ArrowUpDown className="h-5 w-5 text-[#ECAC36]" />
            <span className="text-[#ECAC36] text-sm font-medium">Display Settings</span>
          </div>
        </div>

        <InventorySortSettings initialSettings={settings} />

        <Card className="bg-[#111111] border-[#333333]">
          <CardHeader>
            <CardTitle className="text-white text-lg">How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-400">
            <p>
              <span className="text-[#ECAC36] font-medium">Featured First:</span>{" "}
              Featured items appear at the top, followed by remaining items sorted by date added. This is the default behavior.
            </p>
            <p>
              <span className="text-[#ECAC36] font-medium">Price + Brand Grouped:</span>{" "}
              Items are sorted from highest to lowest price. Within the same price point, items are grouped alphabetically by brand. For example, if you have 2 Ferraris and 3 Lamborghinis at $5,000/day, all Ferraris appear first, then all Lamborghinis.
            </p>
            <p>
              <span className="text-[#ECAC36] font-medium">Brand A&ndash;Z:</span>{" "}
              Items are grouped alphabetically by brand name, with items within each brand sorted by price (highest first).
            </p>
            <p>
              <span className="text-[#ECAC36] font-medium">Changes Take Effect:</span>{" "}
              After saving, the listing page cache is refreshed automatically. Changes will be visible on the next page load.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

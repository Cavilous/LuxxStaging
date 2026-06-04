import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/lib/db"
import { inventory, homePageSections } from "@/lib/db/schema"
import { eq, asc } from "drizzle-orm"
import { HomePageSectionManager } from "@/components/home-page-section-manager"

export const dynamic = 'force-dynamic'

export default async function HomePageManagement() {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/admin/login")
  }

  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("*")
    .eq("email", session.user.email)
    .eq("is_active", true)
    .single()

  if (!adminUser) {
    redirect("/admin/login?error=unauthorized")
  }

  const sections = await db
    .select({
      id: homePageSections.id,
      section: homePageSections.section,
      inventoryId: homePageSections.inventoryId,
      displayOrder: homePageSections.displayOrder,
      title: inventory.title,
      category: inventory.category,
      images: inventory.images,
    })
    .from(homePageSections)
    .innerJoin(inventory, eq(homePageSections.inventoryId, inventory.id))
    .orderBy(asc(homePageSections.section), asc(homePageSections.displayOrder))

  const allInventory = await db
    .select({
      id: inventory.id,
      title: inventory.title,
      category: inventory.category,
      subtitle: inventory.subtitle,
      images: inventory.images,
    })
    .from(inventory)
    .where(eq(inventory.isPublished, true))
    .orderBy(asc(inventory.category), asc(inventory.title))

  const featuredExotics = sections.filter(s => s.section === "featured_exotics")
  const luxuryYachts = sections.filter(s => s.section === "luxury_yachts")
  const premiumVillas = sections.filter(s => s.section === "premium_villas")

  return (
    <AdminLayout user={adminUser}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Home Page Management</h1>
          <p className="text-gray-400">Curate which inventory items appear on the home page</p>
        </div>

        <div className="grid gap-6">
          <Card className="bg-[#0A0A0A] border-[#333333]">
            <CardHeader>
              <CardTitle className="text-white">Featured Exotics</CardTitle>
              <p className="text-sm text-gray-400">Select cars to display in the &quot;Featured Exotics&quot; section</p>
            </CardHeader>
            <CardContent>
              <HomePageSectionManager
                section="featured_exotics"
                sectionTitle="Featured Exotics"
                currentItems={featuredExotics}
                allInventory={allInventory.filter(i => i.category === "car")}
              />
            </CardContent>
          </Card>

          <Card className="bg-[#0A0A0A] border-[#333333]">
            <CardHeader>
              <CardTitle className="text-white">Luxury Yachts</CardTitle>
              <p className="text-sm text-gray-400">Select yachts to display in the &quot;Luxury Yachts&quot; section</p>
            </CardHeader>
            <CardContent>
              <HomePageSectionManager
                section="luxury_yachts"
                sectionTitle="Luxury Yachts"
                currentItems={luxuryYachts}
                allInventory={allInventory.filter(i => i.category === "yacht")}
              />
            </CardContent>
          </Card>

          <Card className="bg-[#0A0A0A] border-[#333333]">
            <CardHeader>
              <CardTitle className="text-white">Premium Villas</CardTitle>
              <p className="text-sm text-gray-400">Select villas to display in the &quot;Premium Villas&quot; section</p>
            </CardHeader>
            <CardContent>
              <HomePageSectionManager
                section="premium_villas"
                sectionTitle="Premium Villas"
                currentItems={premiumVillas}
                allInventory={allInventory.filter(i => i.category === "villa")}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}

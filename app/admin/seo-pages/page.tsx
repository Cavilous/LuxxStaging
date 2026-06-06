import AdminLayout from "@/components/admin-layout"
import { getAllSeoPages } from "@/lib/seo-page-actions"
import { SERVICE_CITIES } from "@/lib/seo-constants"
import { SeoPagesList } from "./seo-pages-list"
import { getDemoSafeAccessibleSections, getDemoSafeCurrentUser } from "../demo-safe-admin"

export const dynamic = 'force-dynamic'

export default async function AdminSeoPagesPage({
  searchParams,
}: {
  searchParams: Promise<{ pageType?: string; city?: string; category?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const filters: any = {}
  if (resolvedSearchParams.pageType) filters.pageType = resolvedSearchParams.pageType
  if (resolvedSearchParams.city) filters.city = resolvedSearchParams.city
  if (resolvedSearchParams.category) filters.category = resolvedSearchParams.category

  const [currentUser, accessibleSections] = await Promise.all([
    getDemoSafeCurrentUser(),
    getDemoSafeAccessibleSections(),
  ])

  let pages: any[] = []
  try {
    pages = await getAllSeoPages(filters)
  } catch (error) {
    console.error("Error loading SEO pages:", error)
  }

  const cities = SERVICE_CITIES.map(c => ({ slug: c.slug, name: c.name }))

  return (
    <AdminLayout
      user={currentUser ? { email: currentUser.email, role: currentUser.role } : null}
      accessibleSections={accessibleSections}
    >
      <SeoPagesList
        initialPages={JSON.parse(JSON.stringify(pages))}
        cities={cities}
        initialFilters={{
          pageType: resolvedSearchParams.pageType || '',
          city: resolvedSearchParams.city || '',
          category: resolvedSearchParams.category || '',
        }}
      />
    </AdminLayout>
  )
}

import AdminLayout from "@/components/admin-layout"
import { getAllSeoPages } from "@/lib/seo-page-actions"
import { SERVICE_CITIES } from "@/lib/seo-constants"
import { SeoPagesList } from "./seo-pages-list"

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

  const pages = await getAllSeoPages(filters)

  const cities = SERVICE_CITIES.map(c => ({ slug: c.slug, name: c.name }))

  return (
    <AdminLayout>
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

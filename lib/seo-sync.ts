import 'server-only'
import { db } from '@/lib/db'
import { inventory, seoPages, seoPageUnits, seoIntentMappings } from '@/lib/db/schema'
import { eq, and, sql, inArray } from 'drizzle-orm'
import { getCityName, CATEGORY_LABELS } from '@/lib/seo-constants'

function triggerAiContentGeneration(page: { id: string; pageType: string; city: string | null; brand: string | null; model: string | null; intent: string | null; category: string }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    || (process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : 'http://localhost:3000')

  const url = `${baseUrl}/api/admin/generate-seo-content`

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-internal-key': process.env.INTERNAL_API_SECRET || '',
    },
    body: JSON.stringify({
      seoPageId: page.id,
      pageType: page.pageType,
      city: page.city || 'miami',
      brand: page.brand,
      model: page.model,
      intent: page.intent,
      category: page.category,
    }),
  }).catch(err => {
    console.error(`[SeoSync] Fire-and-forget AI generation failed for page ${page.id}:`, err)
  })
}

interface UnitData {
  id: string
  category: string
  title: string
  brand: string | null
  brandSlug: string | null
  specifications: Record<string, any> | null
  serviceCities: string[] | null
  tags: string[] | null
  transactionType: string
  pricePerDay: string | null
  isPublished: boolean
}

interface SeoPageTarget {
  slug: string
  pageType: string
  city: string
  brand: string | null
  model: string | null
  intent: string | null
  category: string
  title: string
  h1: string
  metaTitle: string
  metaDescription: string
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function buildMetaTitle(parts: {
  brand?: string
  model?: string
  intent?: string
  city: string
  category: string
}): string {
  const { brand, model, intent, city, category } = parts
  const categoryLabel = CATEGORY_LABELS[category]
  const cityName = getCityName(city)

  if (model && brand && intent) {
    return `${brand} ${model} ${capitalize(intent)} Rental ${cityName} | Luxx Miami`
  }
  if (model && brand) {
    return `${brand} ${model} Rental ${cityName} | Luxx Miami`
  }
  if (brand) {
    return `${brand} Rental ${cityName} | Exotic ${categoryLabel?.singular || 'Car'} Rentals - Luxx Miami`
  }
  if (intent) {
    return `${capitalize(intent)} ${cityName} | Luxury ${categoryLabel?.singular || 'Car'} Rentals - Luxx Miami`
  }
  return `${categoryLabel?.singular || 'Exotic Car'} Rental ${cityName} | Luxury ${categoryLabel?.singular || 'Car'} Rentals - Luxx Miami`
}

function buildMetaDescription(parts: {
  brand?: string
  model?: string
  city: string
  priceFrom?: string
}): string {
  const { brand, model, city, priceFrom } = parts
  const cityName = getCityName(city)
  const vehicle = model && brand ? `${brand} ${model}` : brand || 'luxury exotic car'
  const priceStr = priceFrom ? ` from $${priceFrom}/day` : ''
  return `Rent a ${vehicle} in ${cityName}${priceStr}. Delivery available. Book your luxury rental with Luxx Miami.`
}

function capitalize(s: string): string {
  return s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

function generatePagesForUnit(unit: UnitData): SeoPageTarget[] {
  const pages: SeoPageTarget[] = []
  const cities = unit.serviceCities?.length ? unit.serviceCities : ['miami']
  const brand = unit.brand
  const specs = unit.specifications || {}
  const model = specs.model as string | undefined
  const bodyType = specs.bodyType as string | undefined
  const tags = unit.tags || []
  const category = unit.category
  const categoryLabel = CATEGORY_LABELS[category]
  const priceFrom = unit.pricePerDay || undefined

  for (const city of cities) {
    const cityName = getCityName(city)

    pages.push({
      slug: `${city}/${categoryLabel?.urlSegment || 'exotic-car-rental'}`,
      pageType: 'city-hub',
      city,
      brand: null,
      model: null,
      intent: null,
      category,
      title: `${categoryLabel?.singular || 'Exotic Car'} Rental ${cityName}`,
      h1: `${categoryLabel?.singular || 'Exotic Car'} Rentals in ${cityName}`,
      metaTitle: buildMetaTitle({ city, category }),
      metaDescription: `Discover luxury ${categoryLabel?.plural?.toLowerCase() || 'cars'} for rent in ${cityName}. Premium fleet, delivery available. Book with Luxx Miami.`,
    })

    if (brand) {
      const brandSlug = slugify(brand)
      pages.push({
        slug: `${city}/${brandSlug}-rental`,
        pageType: 'brand-city',
        city,
        brand,
        model: null,
        intent: null,
        category,
        title: `${brand} Rental ${cityName}`,
        h1: `${brand} Rentals in ${cityName}`,
        metaTitle: buildMetaTitle({ brand, city, category }),
        metaDescription: buildMetaDescription({ brand, city, priceFrom }),
      })

      if (model) {
        const modelSlug = slugify(model)
        pages.push({
          slug: `${city}/${brandSlug}-${modelSlug}-rental`,
          pageType: 'model-city',
          city,
          brand,
          model,
          intent: null,
          category,
          title: `${brand} ${model} Rental ${cityName}`,
          h1: `${brand} ${model} Rentals in ${cityName}`,
          metaTitle: buildMetaTitle({ brand, model, city, category }),
          metaDescription: buildMetaDescription({ brand, model, city, priceFrom }),
        })
      }
    }
  }

  return pages
}

async function getIntentPages(unit: UnitData): Promise<SeoPageTarget[]> {
  const pages: SeoPageTarget[] = []
  const cities = unit.serviceCities?.length ? unit.serviceCities : ['miami']
  const specs = unit.specifications || {}
  const bodyType = specs.bodyType as string | undefined
  const tags = unit.tags || []
  const brand = unit.brand
  const model = specs.model as string | undefined
  const category = unit.category
  const priceFrom = unit.pricePerDay || undefined

  const sourceValues: string[] = []
  const sourceTypes: string[] = []

  if (bodyType) {
    sourceValues.push(bodyType.toLowerCase())
    sourceTypes.push('body_style')
  }
  for (const tag of tags) {
    sourceValues.push(tag.toLowerCase())
    sourceTypes.push('tag')
  }

  if (sourceValues.length === 0) return pages

  const mappings = await db
    .select()
    .from(seoIntentMappings)
    .where(
      and(
        eq(seoIntentMappings.isActive, true),
        sql`(${seoIntentMappings.category} IS NULL OR ${seoIntentMappings.category} = ${category})`
      )
    )

  const matchedMappings = mappings.filter(m => {
    const idx = sourceValues.indexOf(m.sourceValue.toLowerCase())
    return idx !== -1 && sourceTypes[idx] === m.sourceType
  })

  for (const mapping of matchedMappings) {
    for (const city of cities) {
      const cityName = getCityName(city)

      if (brand && model) {
        const brandSlug = slugify(brand)
        const modelSlug = slugify(model)
        pages.push({
          slug: `${city}/${brandSlug}-${modelSlug}-${mapping.urlSegment}`,
          pageType: 'intent-city',
          city,
          brand,
          model,
          intent: mapping.urlSegment,
          category,
          title: `${brand} ${model} ${mapping.displayName} ${cityName}`,
          h1: `${brand} ${model} ${mapping.displayName} in ${cityName}`,
          metaTitle: buildMetaTitle({ brand, model, intent: mapping.displayName, city, category }),
          metaDescription: buildMetaDescription({ brand, model, city, priceFrom }),
        })
      }

      pages.push({
        slug: `${city}/${mapping.urlSegment}`,
        pageType: 'intent-city',
        city,
        brand: null,
        model: null,
        intent: mapping.urlSegment,
        category,
        title: `${mapping.displayName} ${cityName}`,
        h1: `${mapping.displayName} in ${cityName}`,
        metaTitle: buildMetaTitle({ intent: mapping.displayName, city, category }),
        metaDescription: `Find luxury ${mapping.displayName.toLowerCase()} in ${cityName}. Premium fleet, delivery available. Book with Luxx Miami.`,
      })
    }
  }

  return pages
}

export async function syncSeoPagesForUnit(unitId: string): Promise<{ created: number; attached: number; errors: string[] }> {
  const errors: string[] = []
  let created = 0
  let attached = 0

  try {
    const units = await db
      .select()
      .from(inventory)
      .where(eq(inventory.id, unitId))
      .limit(1)

    if (units.length === 0) {
      return { created: 0, attached: 0, errors: ['Unit not found'] }
    }

    const unit: UnitData = {
      id: units[0].id,
      category: units[0].category,
      title: units[0].title,
      brand: units[0].brand,
      brandSlug: units[0].brandSlug,
      specifications: units[0].specifications as Record<string, any> | null,
      serviceCities: units[0].serviceCities as string[] | null,
      tags: units[0].tags as string[] | null,
      transactionType: units[0].transactionType,
      pricePerDay: units[0].pricePerDay,
      isPublished: units[0].isPublished,
    }

    if (!unit.isPublished) {
      await detachUnitFromAllPages(unitId)
      return { created: 0, attached: 0, errors: [] }
    }

    const basePages = generatePagesForUnit(unit)
    const intentPages = await getIntentPages(unit)
    const allTargets = [...basePages, ...intentPages]

    const seenSlugs = new Set<string>()
    const uniqueTargets = allTargets.filter(t => {
      if (seenSlugs.has(t.slug)) return false
      seenSlugs.add(t.slug)
      return true
    })

    const existingLinks = await db
      .select({ seoPageId: seoPageUnits.seoPageId })
      .from(seoPageUnits)
      .where(eq(seoPageUnits.inventoryId, unitId))

    const existingPageIds = new Set(existingLinks.map(l => l.seoPageId))

    const newPageIds = new Set<string>()

    for (const target of uniqueTargets) {
      try {
        const existing = await db
          .select({ id: seoPages.id })
          .from(seoPages)
          .where(eq(seoPages.slug, target.slug))
          .limit(1)

        let pageId: string

        if (existing.length > 0) {
          pageId = existing[0].id
        } else {
          const inserted = await db
            .insert(seoPages)
            .values({
              slug: target.slug,
              pageType: target.pageType,
              city: target.city,
              brand: target.brand,
              model: target.model,
              intent: target.intent,
              category: target.category,
              title: target.title,
              h1: target.h1,
              metaTitle: target.metaTitle,
              metaDescription: target.metaDescription,
              contentStatus: 'pending',
            })
            .returning({ id: seoPages.id })

          pageId = inserted[0].id
          created++

          triggerAiContentGeneration({
            id: pageId,
            pageType: target.pageType,
            city: target.city,
            brand: target.brand,
            model: target.model,
            intent: target.intent,
            category: target.category,
          })
        }

        newPageIds.add(pageId)

        if (!existingPageIds.has(pageId)) {
          await db
            .insert(seoPageUnits)
            .values({
              seoPageId: pageId,
              inventoryId: unitId,
            })
            .onConflictDoNothing()

          attached++
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error'
        errors.push(`Failed for slug ${target.slug}: ${msg}`)
      }
    }

    const pageIdsToDetach = [...existingPageIds].filter(id => !newPageIds.has(id))
    if (pageIdsToDetach.length > 0) {
      await db
        .delete(seoPageUnits)
        .where(
          and(
            eq(seoPageUnits.inventoryId, unitId),
            inArray(seoPageUnits.seoPageId, pageIdsToDetach)
          )
        )
    }

    await refreshUnitCounts([...newPageIds, ...pageIdsToDetach])

  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    errors.push(`Sync failed: ${msg}`)
  }

  return { created, attached, errors }
}

export async function detachUnitFromAllPages(unitId: string): Promise<void> {
  const links = await db
    .select({ seoPageId: seoPageUnits.seoPageId })
    .from(seoPageUnits)
    .where(eq(seoPageUnits.inventoryId, unitId))

  if (links.length === 0) return

  await db
    .delete(seoPageUnits)
    .where(eq(seoPageUnits.inventoryId, unitId))

  await refreshUnitCounts(links.map(l => l.seoPageId))
}

async function refreshUnitCounts(pageIds: string[]): Promise<void> {
  if (pageIds.length === 0) return

  const uniqueIds = [...new Set(pageIds)]

  for (const pageId of uniqueIds) {
    const countResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(seoPageUnits)
      .where(eq(seoPageUnits.seoPageId, pageId))

    await db
      .update(seoPages)
      .set({
        unitCount: countResult[0]?.count || 0,
        updatedAt: new Date(),
      })
      .where(eq(seoPages.id, pageId))
  }
}

export function previewSeoPagesForUnit(data: {
  category: string
  brand: string | null
  model: string | null
  bodyType: string | null
  serviceCities: string[]
  tags: string[]
}): string[] {
  const { category, brand, model, bodyType, serviceCities, tags } = data
  const cities = serviceCities.length ? serviceCities : ['miami']
  const categoryLabel = CATEGORY_LABELS[category]
  const slugs: string[] = []

  for (const city of cities) {
    slugs.push(`${city}/${categoryLabel?.urlSegment || 'exotic-car-rental'}`)

    if (brand) {
      const brandSlug = slugify(brand)
      slugs.push(`${city}/${brandSlug}-rental`)

      if (model) {
        const modelSlug = slugify(model)
        slugs.push(`${city}/${brandSlug}-${modelSlug}-rental`)
      }
    }
  }

  return [...new Set(slugs)]
}

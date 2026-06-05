import 'server-only'
import { db, withRetry } from '@/lib/db'
import { seoPages, seoPageUnits, seoIntentMappings, inventory } from '@/lib/db/schema'
import { eq, and, desc, asc, sql, inArray, ilike, or } from 'drizzle-orm'
import { getCityName, SERVICE_CITIES, getBrandSeoDisplayName, normalizeBrandSeoSlug } from '@/lib/seo-constants'
import { getFallbackCarsByTerms } from '@/lib/fallback-cars'

export async function getSeoPageBySlug(slug: string) {
  try {
    const results = await withRetry(
      () => db
        .select()
        .from(seoPages)
        .where(eq(seoPages.slug, slug))
        .limit(1),
      3,
      `seo-page-${slug}`
    )
    return results[0] || null
  } catch (error) {
    console.error(`[SEO Page Lookup Error] slug="${slug}":`, error)
    return null
  }
}

export async function getSeoPageUnits(seoPageId: string) {
  const units = await db
    .select({
      unit: inventory,
      isFeatured: seoPageUnits.isFeatured,
      displayOrder: seoPageUnits.displayOrder,
    })
    .from(seoPageUnits)
    .innerJoin(inventory, eq(seoPageUnits.inventoryId, inventory.id))
    .where(
      and(
        eq(seoPageUnits.seoPageId, seoPageId),
        eq(inventory.isPublished, true)
      )
    )
    .orderBy(
      desc(seoPageUnits.isFeatured),
      asc(seoPageUnits.displayOrder),
      desc(inventory.pricePerDay)
    )

  return units.map(u => ({
    ...u.unit,
    isFeaturedOnPage: u.isFeatured,
  }))
}

const BRAND_SLUG_TO_INVENTORY: Record<string, string> = {
  'aston-martin': 'Aston Martin',
  'audi': 'Audi',
  'bentley': 'Bentley',
  'bmw': 'BMW',
  'cadillac': 'Cadillac',
  'chevrolet': 'Chevrolet',
  'ferrari': 'Ferrari',
  'lamborghini': 'Lamborghini',
  'land-rover': 'Land Rover',
  'maserati': 'Maserati',
  'mclaren': 'McLaren',
  'mercedes': 'Mercedes',
  'porsche': 'Porsche',
  'rolls-royce': 'Rolls Royce',
  'tesla': 'Tesla',
  'ford': 'Ford',
  'dodge': 'Dodge',
}

const BRAND_MATCH_TERMS: Record<string, string[]> = {
  mercedes: ['Mercedes-Benz', 'Mercedes-AMG', 'AMG', 'G-Wagon'],
  'rolls-royce': ['Rolls Royce', 'Rolls-Royce', 'RollsRoyce'],
  'land-rover': ['Land Rover', 'Range Rover', 'RangeRover'],
  'aston-martin': ['Aston Martin', 'Aston'],
}

export async function getInventoryByBrand(brandSlug: string) {
  const normalizedBrandSlug = normalizeBrandSeoSlug(brandSlug)
  const brandName =
    BRAND_SLUG_TO_INVENTORY[normalizedBrandSlug] ||
    getBrandSeoDisplayName(normalizedBrandSlug) ||
    normalizedBrandSlug.replace(/-/g, ' ')
  const matchTerms = Array.from(new Set([
    brandName,
    normalizedBrandSlug,
    normalizedBrandSlug.replace(/-/g, ' '),
    brandSlug,
    brandSlug.replace(/-/g, ' '),
    ...(BRAND_MATCH_TERMS[normalizedBrandSlug] || []),
  ].filter(Boolean))).map((term) => term.toLowerCase())

  try {
    const results = await withRetry(
      () => db
        .select()
        .from(inventory)
        .where(
          and(
            eq(inventory.category, 'car'),
            eq(inventory.isPublished, true),
            or(
              eq(inventory.brandSlug, normalizedBrandSlug),
              ...matchTerms.flatMap((term) => [
                ilike(inventory.brand, `%${term}%`),
                ilike(inventory.title, `%${term}%`),
              ])
            )
          )
        )
        .orderBy(desc(inventory.isFeatured), desc(inventory.pricePerDay)),
      3,
      `brand-inventory-${normalizedBrandSlug}`
    )
    const fallbackMatches = getFallbackCarsByTerms(matchTerms)
    return fallbackMatches.length > results.length ? fallbackMatches : results
  } catch (error) {
    console.error(`[Brand Inventory Error] brand="${normalizedBrandSlug}":`, error)
    return getFallbackCarsByTerms(matchTerms)
  }
}

export async function getAlternativeUnits(category: string, city: string, limit = 6) {
  const cityHubSlug = category === 'car' ? `${city}/exotic-car-rental`
    : category === 'yacht' ? `${city}/yacht-charter`
    : `${city}/luxury-villa-rental`

  const cityHubPage = await db
    .select({ id: seoPages.id })
    .from(seoPages)
    .where(eq(seoPages.slug, cityHubSlug))
    .limit(1)

  if (cityHubPage.length === 0) {
    return db
      .select()
      .from(inventory)
      .where(
        and(
          eq(inventory.category, category),
          eq(inventory.isPublished, true)
        )
      )
      .orderBy(desc(inventory.pricePerDay))
      .limit(limit)
  }

  return getSeoPageUnits(cityHubPage[0].id).then(units => units.slice(0, limit))
}

export async function getAllSeoPages(filters?: {
  pageType?: string
  city?: string
  category?: string
  isPublished?: boolean
}) {
  let query = db.select().from(seoPages)

  const conditions = []
  if (filters?.pageType) conditions.push(eq(seoPages.pageType, filters.pageType))
  if (filters?.city) conditions.push(eq(seoPages.city, filters.city))
  if (filters?.category) conditions.push(eq(seoPages.category, filters.category))
  if (filters?.isPublished !== undefined) conditions.push(eq(seoPages.isPublished, filters.isPublished))

  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any
  }

  return query.orderBy(asc(seoPages.slug))
}

export async function updateSeoPage(id: string, data: {
  title?: string
  h1?: string
  metaTitle?: string
  metaDescription?: string
  content?: string
  contentStatus?: string
  isPublished?: boolean
  isIndexable?: boolean
  canonicalUrl?: string | null
  redirectTo?: string | null
}) {
  return db
    .update(seoPages)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(seoPages.id, id))
    .returning()
}

export async function getAllIntentMappings() {
  return db
    .select()
    .from(seoIntentMappings)
    .orderBy(asc(seoIntentMappings.sourceType), asc(seoIntentMappings.sourceValue))
}

export async function upsertIntentMapping(data: {
  id?: string
  sourceType: string
  sourceValue: string
  urlSegment: string
  displayName: string
  category?: string | null
  isActive?: boolean
}) {
  if (data.id) {
    return db
      .update(seoIntentMappings)
      .set({
        sourceType: data.sourceType,
        sourceValue: data.sourceValue,
        urlSegment: data.urlSegment,
        displayName: data.displayName,
        category: data.category || null,
        isActive: data.isActive ?? true,
        updatedAt: new Date(),
      })
      .where(eq(seoIntentMappings.id, data.id))
      .returning()
  }

  return db
    .insert(seoIntentMappings)
    .values({
      sourceType: data.sourceType,
      sourceValue: data.sourceValue,
      urlSegment: data.urlSegment,
      displayName: data.displayName,
      category: data.category || null,
      isActive: data.isActive ?? true,
    })
    .returning()
}

export async function deleteIntentMapping(id: string) {
  return db
    .delete(seoIntentMappings)
    .where(eq(seoIntentMappings.id, id))
}

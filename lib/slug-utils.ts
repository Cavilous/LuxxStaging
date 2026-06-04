import { db } from "@/lib/db"
import { inventory } from "@/lib/db/schema"
import { eq, like, and, ne } from "drizzle-orm"

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function parseColorsFromSubtitle(subtitle: string | null): { exterior: string | null; interior: string | null } {
  if (!subtitle) return { exterior: null, interior: null }
  
  const colorMatch = subtitle.match(/^(.+?)\s*[\/|]\s*(.+)$/)
  if (colorMatch) {
    return {
      exterior: colorMatch[1].trim(),
      interior: colorMatch[2].trim()
    }
  }
  
  return { exterior: subtitle.trim(), interior: null }
}

interface GenerateUniqueSlugParams {
  title: string
  brand?: string | null
  subtitle?: string | null
  category?: string
  existingId?: string
}

export async function generateUniqueSlug({
  title,
  brand,
  subtitle,
  category,
  existingId
}: GenerateUniqueSlugParams): Promise<{ slug: string; wasModified: boolean; originalSlug: string }> {
  const baseSlug = slugify(title)
  const originalSlug = baseSlug
  
  const { exterior, interior } = parseColorsFromSubtitle(subtitle || null)
  
  const candidateSlugs: string[] = [baseSlug]
  
  if (exterior) {
    candidateSlugs.push(`${baseSlug}-${slugify(exterior)}`)
  }
  
  if (exterior && interior) {
    candidateSlugs.push(`${baseSlug}-${slugify(exterior)}-${slugify(interior)}`)
  }
  
  if (subtitle && subtitle.trim()) {
    const subtitleSlug = slugify(subtitle)
    if (!candidateSlugs.includes(`${baseSlug}-${subtitleSlug}`)) {
      candidateSlugs.push(`${baseSlug}-${subtitleSlug}`)
    }
  }

  for (const candidate of candidateSlugs) {
    const exists = await checkSlugExists(candidate, existingId)
    if (!exists) {
      return {
        slug: candidate,
        wasModified: candidate !== originalSlug,
        originalSlug
      }
    }
  }
  
  const bestCandidate = candidateSlugs[candidateSlugs.length - 1]
  const uniqueSlug = await generateNumericSuffix(bestCandidate, existingId)
  
  return {
    slug: uniqueSlug,
    wasModified: true,
    originalSlug
  }
}

async function checkSlugExists(slug: string, excludeId?: string): Promise<boolean> {
  const conditions = [eq(inventory.slug, slug)]
  
  if (excludeId) {
    conditions.push(ne(inventory.id, excludeId))
  }
  
  const existing = await db
    .select({ id: inventory.id })
    .from(inventory)
    .where(and(...conditions))
    .limit(1)
  
  return existing.length > 0
}

async function generateNumericSuffix(baseSlug: string, excludeId?: string): Promise<string> {
  const existingSlugs = await db
    .select({ slug: inventory.slug })
    .from(inventory)
    .where(like(inventory.slug, `${baseSlug}%`))
  
  const existingSet = new Set(
    existingSlugs
      .map(r => r.slug)
      .filter(s => s !== null)
  )
  
  if (excludeId) {
    const currentItem = await db
      .select({ slug: inventory.slug })
      .from(inventory)
      .where(eq(inventory.id, excludeId))
      .limit(1)
    
    if (currentItem.length > 0 && currentItem[0].slug) {
      existingSet.delete(currentItem[0].slug)
    }
  }
  
  let suffix = 2
  while (existingSet.has(`${baseSlug}-${suffix}`)) {
    suffix++
  }
  
  return `${baseSlug}-${suffix}`
}

export function generateBrandSlug(brand: string | null): string | null {
  if (!brand) return null
  return slugify(brand)
}

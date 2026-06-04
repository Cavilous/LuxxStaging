'use server'

import { getAllSeoPages, updateSeoPage, getSeoPageBySlug } from '@/lib/seo-page-actions'
import { db } from '@/lib/db'
import { seoPages } from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'

export async function fetchAllSeoPages(filters?: {
  pageType?: string
  city?: string
  category?: string
  isPublished?: boolean
}) {
  return getAllSeoPages(filters)
}

export async function fetchSeoPageById(id: string) {
  const results = await db
    .select()
    .from(seoPages)
    .where(eq(seoPages.id, id))
    .limit(1)
  return results[0] || null
}

export async function fetchPendingSeoPages() {
  return db
    .select({
      id: seoPages.id,
      slug: seoPages.slug,
      pageType: seoPages.pageType,
      city: seoPages.city,
      category: seoPages.category,
      brand: seoPages.brand,
      model: seoPages.model,
      intent: seoPages.intent,
      unitCount: seoPages.unitCount,
    })
    .from(seoPages)
    .where(eq(seoPages.contentStatus, 'pending'))
    .orderBy(asc(seoPages.slug))
}

export async function saveSeoPage(id: string, data: {
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
  return updateSeoPage(id, data)
}

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { seoPages, seoIntentMappings } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  if (secret !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { pages, intentMappings } = body
    const results: { type: string; slug?: string; status: string }[] = []

    if (Array.isArray(pages) && pages.length > 0) {
      for (const page of pages) {
        try {
          const existing = await db
            .select({ id: seoPages.id })
            .from(seoPages)
            .where(eq(seoPages.slug, page.slug))
            .limit(1)

          if (existing.length > 0) {
            await db
              .update(seoPages)
              .set({
                pageType: page.page_type,
                city: page.city,
                brand: page.brand || null,
                model: page.model || null,
                intent: page.intent || null,
                category: page.category || 'car',
                title: page.title,
                h1: page.h1,
                metaTitle: page.meta_title || null,
                metaDescription: page.meta_description || null,
                content: page.content || null,
                contentStatus: page.content_status || 'pending',
                isPublished: page.is_published ?? true,
                isIndexable: page.is_indexable ?? true,
                canonicalUrl: page.canonical_url || null,
                redirectTo: page.redirect_to || null,
                unitCount: page.unit_count ?? 0,
                updatedAt: new Date(),
              })
              .where(eq(seoPages.slug, page.slug))
            results.push({ type: 'page', slug: page.slug, status: 'updated' })
          } else {
            await db.insert(seoPages).values({
              id: page.id,
              slug: page.slug,
              pageType: page.page_type,
              city: page.city,
              brand: page.brand || null,
              model: page.model || null,
              intent: page.intent || null,
              category: page.category || 'car',
              title: page.title,
              h1: page.h1,
              metaTitle: page.meta_title || null,
              metaDescription: page.meta_description || null,
              content: page.content || null,
              contentStatus: page.content_status || 'pending',
              isPublished: page.is_published ?? true,
              isIndexable: page.is_indexable ?? true,
              canonicalUrl: page.canonical_url || null,
              redirectTo: page.redirect_to || null,
              unitCount: page.unit_count ?? 0,
            })
            results.push({ type: 'page', slug: page.slug, status: 'inserted' })
          }
        } catch (e: any) {
          results.push({ type: 'page', slug: page.slug, status: `error: ${e.message}` })
        }
      }
    }

    if (Array.isArray(intentMappings) && intentMappings.length > 0) {
      for (const mapping of intentMappings) {
        try {
          const existing = await db
            .select({ id: seoIntentMappings.id })
            .from(seoIntentMappings)
            .where(eq(seoIntentMappings.id, mapping.id))
            .limit(1)

          if (existing.length > 0) {
            results.push({ type: 'mapping', slug: `${mapping.source_type}:${mapping.source_value}`, status: 'exists' })
          } else {
            await db.insert(seoIntentMappings).values({
              id: mapping.id,
              sourceType: mapping.source_type,
              sourceValue: mapping.source_value,
              urlSegment: mapping.url_segment,
              displayName: mapping.display_name,
              category: mapping.category || null,
              isActive: mapping.is_active ?? true,
            })
            results.push({ type: 'mapping', slug: `${mapping.source_type}:${mapping.source_value}`, status: 'inserted' })
          }
        } catch (e: any) {
          results.push({ type: 'mapping', slug: `${mapping.source_type}:${mapping.source_value}`, status: `error: ${e.message}` })
        }
      }
    }

    return NextResponse.json({ success: true, results })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  if (secret !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  try {
    const pages = await db.select().from(seoPages)
    const mappings = await db.select().from(seoIntentMappings)
    return NextResponse.json({
      pages: pages.length,
      mappings: mappings.length,
      pageSlugs: pages.map(p => p.slug),
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

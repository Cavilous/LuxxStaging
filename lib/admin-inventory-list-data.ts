import { db } from "@/lib/db"
import { sql } from "drizzle-orm"

type InventoryCategory = "car" | "yacht" | "villa" | "jet"

interface InventoryListOptions {
  category: InventoryCategory
  q?: string
  status?: string
  brand?: string
  page: number
  itemsPerPage: number
  sortColumn?: string | null
  sortOrder?: "asc" | "desc"
}

interface ForSaleListOptions {
  q?: string
  category?: string
  status?: string
  managed?: string
}

function getExecuteRows(result: any): any[] {
  if (Array.isArray(result)) return result
  if (Array.isArray(result?.rows)) return result.rows
  return []
}

function normalizeInventoryRow(row: any, category: InventoryCategory) {
  const item = row?.item || row || {}

  return {
    id: item.id,
    title: item.title || "Untitled item",
    subtitle: item.subtitle || null,
    images: item.images || [],
    pricePerDay: item.pricePerDay ?? item.price_per_day ?? null,
    pricePerHour: item.pricePerHour ?? item.price_per_hour ?? null,
    pricePer4Hr: item.pricePer4Hr ?? item.price_per_4hr ?? null,
    isPublished: item.isPublished ?? item.is_published ?? false,
    isFeatured: item.isFeatured ?? item.is_featured ?? false,
    createdAt: item.createdAt ?? item.created_at ?? null,
    category: item.category || category,
    specifications: item.specifications || {},
    focalPoint: item.focalPoint ?? item.focal_point ?? null,
    flipHorizontal: item.flipHorizontal ?? item.flip_horizontal ?? false,
    flipVertical: item.flipVertical ?? item.flip_vertical ?? false,
    aiContentGenerated: item.aiContentGenerated ?? item.ai_content_generated ?? null,
  }
}

function normalizeForSaleRow(row: any) {
  const item = row?.item || row || {}

  return {
    id: item.id,
    slug: item.slug || null,
    title: item.title || "Untitled asset",
    category: item.category || "car",
    brand: item.brand || null,
    model: item.model || null,
    year: item.year ?? null,
    heroImage: item.heroImage ?? item.hero_image ?? null,
    images: item.images || [],
    imageSourceUrls: item.imageSourceUrls ?? item.image_source_urls ?? [],
    advertisedPrice: item.advertisedPrice ?? item.advertised_price ?? null,
    managedAssetPrice: item.managedAssetPrice ?? item.managed_asset_price ?? null,
    status: item.status || "Draft",
    location: item.location || null,
    description: item.description || null,
    specifications: item.specifications || {},
    badges: item.badges || [],
    managementTerms: item.managementTerms ?? item.management_terms ?? {},
    metaTitle: item.metaTitle ?? item.meta_title ?? null,
    metaDescription: item.metaDescription ?? item.meta_description ?? null,
    createdAt: item.createdAt ?? item.created_at ?? null,
    updatedAt: item.updatedAt ?? item.updated_at ?? null,
  }
}

function inventoryOrderBy(category: InventoryCategory, sortColumn?: string | null, sortOrder: "asc" | "desc" = "desc") {
  const direction = sortOrder === "asc" ? "ASC" : "DESC"

  if (sortColumn === "title") {
    return sql.raw(`lower(i.title) ${direction} NULLS LAST`)
  }

  if (sortColumn === "price") {
    const field = category === "yacht" ? "price_per_4hr" : category === "jet" ? "price_per_hour" : "price_per_day"
    return sql.raw(`NULLIF(to_jsonb(i)->>'${field}', '')::numeric ${direction} NULLS LAST`)
  }

  return sql.raw(`(to_jsonb(i)->>'created_at')::timestamptz ${direction} NULLS LAST`)
}

export async function getAdminInventoryList(options: InventoryListOptions) {
  const page = Number.isFinite(options.page) && options.page > 0 ? options.page : 1
  const offset = (page - 1) * options.itemsPerPage
  const conditions = [sql`i.category = ${options.category}`]

  if (options.q) {
    const query = `%${options.q}%`
    conditions.push(sql`(i.title ILIKE ${query} OR COALESCE(to_jsonb(i)->>'subtitle', '') ILIKE ${query})`)
  }

  if (options.status === "published") {
    conditions.push(sql`to_jsonb(i)->>'is_published' = 'true'`)
  } else if (options.status === "draft") {
    conditions.push(sql`COALESCE(to_jsonb(i)->>'is_published', 'false') = 'false'`)
  }

  if (options.brand) {
    conditions.push(sql`i.title ILIKE ${`%${options.brand}%`}`)
  }

  const whereClause = sql.join(conditions, sql` AND `)

  try {
    const [countResult, rowsResult] = await Promise.all([
      db.execute(sql`SELECT count(*)::int AS count FROM inventory i WHERE ${whereClause}`),
      db.execute(sql`
        SELECT to_jsonb(i) AS item
        FROM inventory i
        WHERE ${whereClause}
        ORDER BY ${inventoryOrderBy(options.category, options.sortColumn, options.sortOrder)}
        LIMIT ${options.itemsPerPage}
        OFFSET ${offset}
      `),
    ])

    const countRows = getExecuteRows(countResult)
    const itemRows = getExecuteRows(rowsResult)

    return {
      totalCount: Number(countRows[0]?.count || 0),
      items: itemRows.map((row) => normalizeInventoryRow(row, options.category)),
    }
  } catch (error) {
    console.error(`[Admin ${options.category} inventory list failed, using empty fallback]:`, error)
    return { totalCount: 0, items: [] }
  }
}

export async function getAdminForSaleList(options: ForSaleListOptions) {
  const conditions = []

  if (options.q) {
    const query = `%${options.q}%`
    conditions.push(sql`(
      f.title ILIKE ${query}
      OR COALESCE(to_jsonb(f)->>'brand', '') ILIKE ${query}
      OR COALESCE(to_jsonb(f)->>'model', '') ILIKE ${query}
    )`)
  }

  if (options.category && options.category !== "all") {
    conditions.push(sql`f.category = ${options.category}`)
  }

  if (options.status && options.status !== "all") {
    conditions.push(sql`COALESCE(to_jsonb(f)->>'status', 'Draft') = ${options.status}`)
  }

  if (options.managed === "yes") {
    conditions.push(sql`NULLIF(to_jsonb(f)->>'managed_asset_price', '') IS NOT NULL`)
  } else if (options.managed === "no") {
    conditions.push(sql`NULLIF(to_jsonb(f)->>'managed_asset_price', '') IS NULL`)
  }

  const whereClause = conditions.length > 0 ? sql`WHERE ${sql.join(conditions, sql` AND `)}` : sql``

  try {
    const rowsResult = await db.execute(sql`
      SELECT to_jsonb(f) AS item
      FROM for_sale_assets f
      ${whereClause}
      ORDER BY (to_jsonb(f)->>'updated_at')::timestamptz DESC NULLS LAST
    `)

    const statsResult = await db.execute(sql`
      SELECT
        count(*)::int AS total,
        count(*) FILTER (WHERE COALESCE(to_jsonb(f)->>'status', 'Draft') = 'Live')::int AS live,
        count(*) FILTER (WHERE COALESCE(to_jsonb(f)->>'status', 'Draft') = 'UnderOffer')::int AS under_offer,
        count(*) FILTER (WHERE NULLIF(to_jsonb(f)->>'managed_asset_price', '') IS NOT NULL)::int AS with_managed_price
      FROM for_sale_assets f
    `)

    const statsRows = getExecuteRows(statsResult)
    const statsRow = statsRows[0] || {}

    return {
      assets: getExecuteRows(rowsResult).map(normalizeForSaleRow),
      stats: {
        total: Number(statsRow.total || 0),
        live: Number(statsRow.live || 0),
        underOffer: Number(statsRow.under_offer || 0),
        withManagedPrice: Number(statsRow.with_managed_price || 0),
      },
    }
  } catch (error) {
    console.error("[Admin for-sale list failed, using empty fallback]:", error)
    return {
      assets: [],
      stats: {
        total: 0,
        live: 0,
        underOffer: 0,
        withManagedPrice: 0,
      },
    }
  }
}

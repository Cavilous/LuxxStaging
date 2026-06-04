import { MetadataRoute } from 'next'
import { db } from '@/lib/db'
import { inventory, blogPosts, seoPages } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://luxxmiami.com'
  
  const brandSlugs = [
    'aston-martin',
    'audi',
    'bentley',
    'bmw',
    'cadillac',
    'ferrari',
    'lamborghini', 
    'land-rover',
    'maserati',
    'mclaren',
    'mercedes',
    'porsche',
    'rolls-royce',
    'tesla',
  ]

  let migratedBrandSlugs: Set<string> = new Set()
  try {
    const migratedPages = await db
      .select({ slug: seoPages.slug, contentStatus: seoPages.contentStatus })
      .from(seoPages)
      .where(and(eq(seoPages.pageType, 'brand-city'), eq(seoPages.category, 'car'), eq(seoPages.isPublished, true)))
    
    for (const page of migratedPages) {
      if (page.contentStatus !== 'pending') {
        const match = page.slug.match(/^miami\/(.+)-rental$/)
        if (match) {
          migratedBrandSlugs.add(match[1])
        }
      }
    }
  } catch (e) {
    // ignore - fall back to including all brand pages
  }

  const brandPages = brandSlugs
    .filter((slug) => !migratedBrandSlugs.has(slug))
    .map((slug) => ({
      url: `${baseUrl}/car-brand/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    }))

  // Static pages - using new canonical URLs
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/cars-listing`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/yachts`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/houses`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tours`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tours/cars`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/buy-sell`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/repair`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/miami-club-guide`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/miami-restaurant-guide`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/sell-consign`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/vehicle-management`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    ...brandPages,
  ]

  // Get all published inventory items and content for dynamic pages
  try {
    const [cars, yachts, villas, blogs] = await Promise.all([
      db.select({ slug: inventory.slug, updatedAt: inventory.updatedAt })
        .from(inventory)
        .where(and(eq(inventory.category, 'car'), eq(inventory.isPublished, true))),
      db.select({ slug: inventory.slug, updatedAt: inventory.updatedAt })
        .from(inventory)
        .where(and(eq(inventory.category, 'yacht'), eq(inventory.isPublished, true))),
      db.select({ slug: inventory.slug, updatedAt: inventory.updatedAt })
        .from(inventory)
        .where(and(eq(inventory.category, 'villa'), eq(inventory.isPublished, true))),
      db.select({ slug: blogPosts.slug, updatedAt: blogPosts.updatedAt })
        .from(blogPosts)
        .where(eq(blogPosts.isPublished, true)),
    ])

  // Helper to validate slugs - filters out null, empty, or invalid slugs
  const isValidSlug = (slug: string | null | undefined): slug is string => {
    return typeof slug === 'string' && slug.trim() !== '' && slug !== 'null'
  }

  // Dynamic car pages - filter out invalid slugs
  const carPages = cars
    .filter((car) => isValidSlug(car.slug))
    .map((car) => ({
      url: `${baseUrl}/cars/${car.slug}`,
      lastModified: car.updatedAt || new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }))

  // Dynamic yacht pages - filter out invalid slugs
  const yachtPages = yachts
    .filter((yacht) => isValidSlug(yacht.slug))
    .map((yacht) => ({
      url: `${baseUrl}/yachts/${yacht.slug}`,
      lastModified: yacht.updatedAt || new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }))

  // Dynamic villa pages - filter out invalid slugs
  const villaPages = villas
    .filter((villa) => isValidSlug(villa.slug))
    .map((villa) => ({
      url: `${baseUrl}/houses/${villa.slug}`,
      lastModified: villa.updatedAt || new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }))

  // Dynamic blog post pages - filter out invalid slugs
  const blogPages = blogs
    .filter((blog) => isValidSlug(blog.slug))
    .map((blog) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: blog.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    let seoPageEntries: MetadataRoute.Sitemap = []
    try {
      const allSeoPages = await db
        .select({ slug: seoPages.slug, pageType: seoPages.pageType, updatedAt: seoPages.updatedAt })
        .from(seoPages)
        .where(and(eq(seoPages.isPublished, true), eq(seoPages.isIndexable, true)))

      const priorityMap: Record<string, number> = {
        'city-hub': 0.9,
        'brand-city': 0.85,
        'model-city': 0.8,
        'intent-city': 0.75,
        'variant-city': 0.7,
      }

      seoPageEntries = allSeoPages.map(page => ({
        url: `${baseUrl}/${page.slug}`,
        lastModified: page.updatedAt || new Date(),
        changeFrequency: 'weekly' as const,
        priority: priorityMap[page.pageType] || 0.7,
      }))
    } catch (seoError) {
      console.error('Error fetching SEO pages for sitemap:', seoError)
    }

    return [...staticPages, ...carPages, ...yachtPages, ...villaPages, ...blogPages, ...seoPageEntries]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticPages
  }
}

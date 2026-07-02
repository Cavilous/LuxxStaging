import { MetadataRoute } from 'next'

const PRODUCTION_URL = 'https://luxxmiami.com'

// Production is identified by NEXT_PUBLIC_SITE_URL === 'https://luxxmiami.com'.
// Any other value (or unset, e.g. luxx-staging.vercel.app) keeps the deployment
// fully blocked from crawlers, so staging stays noindexed by default.
const isProductionSite = process.env.NEXT_PUBLIC_SITE_URL === PRODUCTION_URL

export default function robots(): MetadataRoute.Robots {
  if (!isProductionSite) {
    return {
      rules: [
        {
          userAgent: '*',
          disallow: '/',
        },
      ],
      host: process.env.NEXT_PUBLIC_SITE_URL || 'https://luxx-staging.vercel.app',
    }
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
    ],
    sitemap: `${PRODUCTION_URL}/sitemap.xml`,
    host: PRODUCTION_URL,
  }
}

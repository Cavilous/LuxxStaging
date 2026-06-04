import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/setup-admin',
          '/cars-listing',
          '/tours/cars/booking-success',
        ],
      },
    ],
    sitemap: 'https://luxxmiami.com/sitemap.xml',
    host: 'https://luxxmiami.com',
  }
}

import { NextResponse } from 'next/server'

export async function GET() {
  const content = `# Luxx Miami - Luxury Rental Platform
# https://luxxmiami.com

## About
Luxx Miami is a premier luxury rental platform offering exotic cars, yachts, villas, and jet charters in Miami, Florida. We provide a seamless booking experience for discerning clientele seeking the finest in luxury transportation and accommodations.

## Public Content (Allowed)
The following sections contain publicly accessible content suitable for indexing and training:

### Marketing Pages
- / (Homepage)
- /exotic-cars (Exotic car fleet)
- /exotic-cars/* (Individual car pages)
- /yachts (Luxury yacht rentals)
- /yachts/* (Individual yacht pages)
- /villas (Premium villa rentals)
- /villas/* (Individual villa pages)
- /jets (Private jet charters)
- /services (Our services)
- /tours/* (Miami car tours)
- /for-sale (Luxury assets for sale)
- /for-sale/* (Individual for-sale listings)

### Brand Pages
- /brands/* (Luxury car brand pages - Ferrari, Lamborghini, McLaren, etc.)

### Blog Content
- /blog (Blog listing)
- /blog/* (Individual blog articles)

### Informational Pages
- /about
- /contact
- /privacy-policy
- /terms-of-service

## Private/Restricted Content (Disallowed)
The following paths should NOT be accessed, indexed, or used for training:

- /admin/* (Admin panel and CMS)
- /api/* (API endpoints)
- /_next/* (Next.js internal assets)
- /setup-admin (Admin setup)
- /objects/* (Object storage routes)
- /cars-listing (Internal listing page)
- /tours/cars/booking-success (Booking confirmation)

## Contact
- Phone: (305) 605-5899
- Website: https://luxxmiami.com
- Location: Miami, Florida, USA

## Terms
This llm.txt file describes content access policies for AI systems and language models.
Public marketing content may be used for informational purposes.
User-generated content, private data, and admin areas are strictly prohibited.
`

  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}

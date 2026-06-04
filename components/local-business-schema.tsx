import type React from "react"

export function LocalBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://luxxmiami.com/#organization',
    name: 'Luxx Miami',
    description:
      'Miami\'s premier luxury rental platform for exotic cars, yachts, villas, and private jet services. Elite lifestyle experiences for discerning clients.',
    url: 'https://luxxmiami.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://luxxmiami.com/luxx-logo.png',
      width: 1080,
      height: 1080,
    },
    image: 'https://luxxmiami.com/luxx-logo.png',
    telephone: '+1-305-605-5899',
    email: 'luxxmiamigroup@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Brickell Avenue',
      addressLocality: 'Miami',
      addressRegion: 'FL',
      postalCode: '33131',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '25.7617',
      longitude: '-80.1918',
    },
    areaServed: [
      {
        '@type': 'City',
        name: 'Miami',
        '@id': 'https://en.wikipedia.org/wiki/Miami',
      },
      {
        '@type': 'City',
        name: 'Miami Beach',
        '@id': 'https://en.wikipedia.org/wiki/Miami_Beach,_Florida',
      },
      {
        '@type': 'City',
        name: 'Fort Lauderdale',
        '@id': 'https://en.wikipedia.org/wiki/Fort_Lauderdale,_Florida',
      },
    ],
    priceRange: '$$$',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '00:00',
        closes: '23:59',
      },
    ],
    sameAs: [
      'https://www.instagram.com/luxx.miami/',
      'https://www.facebook.com/luxxmiami',
      'https://twitter.com/luxxmiami',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Luxury Rental Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Exotic Car Rentals',
            description: 'Rent luxury and exotic cars including Lamborghini, Ferrari, Rolls-Royce, and more.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Yacht Charters',
            description: 'Private yacht charters with flexible hourly packages for Miami coastal experiences.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Luxury Villa Rentals',
            description: 'Exclusive beachfront villas and waterfront estates in Miami\'s most prestigious neighborhoods.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Private Jet Services',
            description: 'On-demand private jet charters for seamless luxury travel.',
          },
        },
      ],
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '350',
      bestRating: '5',
      worstRating: '1',
    },
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

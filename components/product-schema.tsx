interface ProductSchemaProps {
  name: string
  description: string
  image: string[] | string
  price: number
  priceCurrency?: string
  category: 'car' | 'yacht' | 'villa'
  brand?: string
  model?: string
  year?: number
  url: string
  availability?: string
  specs?: Record<string, any>
}

export function ProductSchema({
  name,
  description,
  image,
  price,
  priceCurrency = 'USD',
  category,
  brand,
  model,
  year,
  url,
  availability = 'https://schema.org/InStock',
  specs = {},
}: ProductSchemaProps) {
  const getProductType = () => {
    switch (category) {
      case 'car':
        return 'Vehicle'
      case 'yacht':
        return 'Product'
      case 'villa':
        return 'Product'
      default:
        return 'Product'
    }
  }

  const imageUrls = Array.isArray(image) ? image.filter(img => typeof img === 'string') : [image]

  const getRentalInfo = () => {
    if (category === 'car') {
      return {
        '@type': 'Offer',
        availability,
        price: price.toString(),
        priceCurrency,
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: price.toString(),
          priceCurrency,
          unitText: 'DAY',
        },
        seller: {
          '@type': 'Organization',
          name: 'Luxx Miami',
        },
      }
    }

    if (category === 'yacht') {
      return {
        '@type': 'Offer',
        availability,
        price: price.toString(),
        priceCurrency,
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: price.toString(),
          priceCurrency,
          unitText: 'HOUR',
        },
        seller: {
          '@type': 'Organization',
          name: 'Luxx Miami',
        },
      }
    }

    if (category === 'villa') {
      return {
        '@type': 'Offer',
        availability,
        price: price.toString(),
        priceCurrency,
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: price.toString(),
          priceCurrency,
          unitText: 'NIGHT',
        },
        seller: {
          '@type': 'Organization',
          name: 'Luxx Miami',
        },
      }
    }

    return null
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': getProductType(),
    name,
    description,
    image: imageUrls,
    url,
    ...(brand && { brand: { '@type': 'Brand', name: brand } }),
    ...(model && { model }),
    ...(year && { productionDate: year.toString() }),
    offers: getRentalInfo(),
    provider: {
      '@type': 'Organization',
      name: 'Luxx Miami',
      url: 'https://luxxmiami.com',
    },
    ...(Object.keys(specs).length > 0 && {
      additionalProperty: Object.entries(specs).map(([key, value]) => ({
        '@type': 'PropertyValue',
        name: key,
        value: value?.toString() || '',
      })),
    }),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '120',
      bestRating: '5',
      worstRating: '1',
    },
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

interface ForSaleAsset {
  id: string
  slug: string
  title: string
  category: "car" | "yacht" | "villa"
  brand?: string
  model?: string
  year?: number
  specs: Record<string, any>
  heroImage: string
  advertisedPrice?: number
  managedAssetPrice?: number
  status: string
  location: string
  badges: string[]
}

interface AssetListSchemaProps {
  assets: ForSaleAsset[]
}

export function AssetListSchema({ assets }: AssetListSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Luxury Assets for Sale - Luxx Miami",
    description: "Premium luxury cars, yachts, and villas available for purchase in Miami",
    numberOfItems: assets.length,
    itemListElement: assets.map((asset, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": getSchemaType(asset.category),
        "@id": `https://luxxmiami.com/buy-sell/${asset.slug}`,
        name: asset.title,
        description: `${asset.title} available for purchase in ${asset.location}`,
        image: asset.heroImage,
        brand: asset.brand
          ? {
              "@type": "Brand",
              name: asset.brand,
            }
          : undefined,
        model: asset.model,
        productionDate: asset.year?.toString(),
        location: {
          "@type": "Place",
          name: asset.location,
        },
        offers: [
          ...(asset.advertisedPrice
            ? [
                {
                  "@type": "Offer",
                  name: "Direct Purchase",
                  description: "Direct purchase for personal use",
                  price: asset.advertisedPrice,
                  priceCurrency: "USD",
                  availability: "https://schema.org/InStock",
                  seller: {
                    "@type": "Organization",
                    name: "Luxx Miami",
                  },
                },
              ]
            : []),
          ...(asset.managedAssetPrice
            ? [
                {
                  "@type": "Offer",
                  name: "Managed Asset Program",
                  description: "Lower price when Luxx manages rentals & experiences",
                  price: asset.managedAssetPrice,
                  priceCurrency: "USD",
                  availability: "https://schema.org/InStock",
                  seller: {
                    "@type": "Organization",
                    name: "Luxx Miami",
                  },
                },
              ]
            : []),
        ].filter(Boolean),
        additionalProperty: Object.entries(asset.specs).map(([key, value]) => ({
          "@type": "PropertyValue",
          name: key,
          value: value.toString(),
        })),
      },
    })),
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }} />
}

interface AssetDetailSchemaProps {
  asset: ForSaleAsset
}

export function AssetDetailSchema({ asset }: AssetDetailSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": getSchemaType(asset.category),
    "@id": `https://luxxmiami.com/buy-sell/${asset.slug}`,
    name: asset.title,
    description: `${asset.title} available for purchase in ${asset.location}`,
    image: [asset.heroImage],
    brand: asset.brand
      ? {
          "@type": "Brand",
          name: asset.brand,
        }
      : undefined,
    model: asset.model,
    productionDate: asset.year?.toString(),
    location: {
      "@type": "Place",
      name: asset.location,
    },
    offers: [
      ...(asset.advertisedPrice
        ? [
            {
              "@type": "Offer",
              name: "Direct Purchase",
              description: "Direct purchase for personal use",
              price: asset.advertisedPrice,
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
              validFrom: new Date().toISOString(),
              seller: {
                "@type": "Organization",
                name: "Luxx Miami",
                url: "https://luxxmiami.com",
              },
            },
          ]
        : []),
      ...(asset.managedAssetPrice
        ? [
            {
              "@type": "Offer",
              name: "Managed Asset Program",
              description: "Lower price when Luxx manages rentals & experiences",
              price: asset.managedAssetPrice,
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
              validFrom: new Date().toISOString(),
              seller: {
                "@type": "Organization",
                name: "Luxx Miami",
                url: "https://luxxmiami.com",
              },
            },
          ]
        : []),
    ].filter(Boolean),
    additionalProperty: Object.entries(asset.specs).map(([key, value]) => ({
      "@type": "PropertyValue",
      name: key,
      value: value.toString(),
    })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "127",
    },
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }} />
}

function getSchemaType(category: string): string {
  switch (category) {
    case "car":
      return "Vehicle"
    case "yacht":
      return "Boat"
    case "villa":
      return "Residence"
    default:
      return "Product"
  }
}

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Luxx Miami",
    description: "Premier luxury asset sales, rentals, and investment management in Miami",
    url: "https://luxxmiami.com",
    logo: "https://luxxmiami.com/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-305-XXX-XXXX",
      contactType: "sales",
      availableLanguage: ["English", "Spanish"],
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Miami",
      addressRegion: "FL",
      addressCountry: "US",
    },
    sameAs: ["https://www.instagram.com/luxx.miami/", "https://www.facebook.com/luxxmiami"],
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }} />
}

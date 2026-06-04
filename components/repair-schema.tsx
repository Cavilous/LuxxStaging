interface RepairSchemaProps {
  packages: Array<{
    id: string
    title: string
    price: number
    description: string
    category: string
  }>
  capabilities: Array<{
    id: string
    brand: string
    certifications: string[]
  }>
}

export function RepairSchema({ packages, capabilities }: RepairSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name: "Luxx Miami - Luxury Vehicle Customization & Repair",
    description:
      "Premium automotive customization and collision repair services for luxury and exotic vehicles in Miami, Florida.",
    url: "https://luxxmiami.com/repair",
    telephone: "+1-305-605-5899",
    email: "luxxmiamigroup@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Luxury Lane",
      addressLocality: "Miami",
      addressRegion: "FL",
      postalCode: "33101",
      addressCountry: "US",
    },
    areaServed: {
      "@type": "City",
      name: "Miami",
      addressRegion: "FL",
      addressCountry: "US",
    },
    serviceType: [
      "Collision Repair",
      "Paint Protection Film",
      "Vehicle Wrapping",
      "Window Tinting",
      "Ceramic Coating",
      "Performance Upgrades",
      "Interior Customization",
    ],
    brand: capabilities.map((cap) => ({
      "@type": "Brand",
      name: cap.brand,
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Repair & Customization Services",
      itemListElement: packages.map((pkg, index) => ({
        "@type": "Offer",
        position: index + 1,
        itemOffered: {
          "@type": "Service",
          name: pkg.title,
          description: pkg.description,
          category: pkg.category,
        },
        price: pkg.price,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        validFrom: new Date().toISOString(),
        seller: {
          "@type": "AutoRepair",
          name: "Luxx Miami",
        },
      })),
    },
    openingHours: ["Mo-Fr 08:00-18:00", "Sa 09:00-17:00"],
    paymentAccepted: ["Cash", "Credit Card", "Insurance Claims"],
    priceRange: "$$$",
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

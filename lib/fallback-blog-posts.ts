export interface FallbackBlogPost {
  id: string
  slug: string
  href: string
  title: string
  excerpt: string
  content: string
  featuredImage: string
  category: string
  tags: string[]
  author: string
  publishedAt: Date
}

export const fallbackBlogPosts: FallbackBlogPost[] = [
  {
    id: "fallback-miami-club-guide",
    slug: "miami-club-guide",
    href: "/miami-club-guide",
    title: "Miami Club Guide",
    excerpt: "A quick guide to VIP nightlife, late-night tables, and the venues worth building a luxury Miami night around.",
    content: "",
    featuredImage: "/stock_images/luxury_nightclub_int_0b64e371.jpg",
    category: "Nightlife",
    tags: ["Miami", "Nightlife", "VIP"],
    author: "Luxx Miami",
    publishedAt: new Date("2026-06-01T12:00:00.000Z"),
  },
  {
    id: "fallback-miami-restaurant-guide",
    slug: "miami-restaurant-guide",
    href: "/miami-restaurant-guide",
    title: "Miami Restaurant Guide",
    excerpt: "Where to book the table, arrive in style, and pair the city’s best dining rooms with a full luxury itinerary.",
    content: "",
    featuredImage: "/stock_images/fine_dining_restaura_997d193e.jpg",
    category: "Dining",
    tags: ["Miami", "Dining", "Concierge"],
    author: "Luxx Miami",
    publishedAt: new Date("2026-05-30T12:00:00.000Z"),
  },
  {
    id: "fallback-exotic-car-guide",
    slug: "exotic-car-rental-miami",
    href: "/cars",
    title: "Exotic Car Rental Miami",
    excerpt: "A presentation-ready look at the fleet, filtering experience, and concierge rental flow for Miami visitors.",
    content: "",
    featuredImage: "/ferrari-sf90-stradale.png",
    category: "Cars",
    tags: ["Cars", "Miami", "Fleet"],
    author: "Luxx Miami",
    publishedAt: new Date("2026-05-28T12:00:00.000Z"),
  },
]

export type SortMode =
  | "featured_first"
  | "price_high_to_low"
  | "price_high_brand_grouped"
  | "brand_alpha"
  | "price_low_to_high"

export const SORT_MODE_LABELS: Record<SortMode, string> = {
  featured_first: "Featured First",
  price_high_to_low: "Price: High to Low",
  price_high_brand_grouped: "Price + Brand Grouped",
  brand_alpha: "Brand A\u2013Z",
  price_low_to_high: "Price: Low to High",
}

export const SORT_MODE_DESCRIPTIONS: Record<SortMode, string> = {
  featured_first: "Featured items appear first, then ordered by date added",
  price_high_to_low: "Most expensive items appear first",
  price_high_brand_grouped: "Ordered by price (high to low), grouped by brand within same price",
  brand_alpha: "Grouped alphabetically by brand, then by price within each brand",
  price_low_to_high: "Least expensive items appear first",
}

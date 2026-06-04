import { desc, asc } from "drizzle-orm"
import { inventory } from "@/lib/db/schema"
import type { SortMode } from "@/lib/sort-settings-constants"

export function getInventoryOrderBy(sortMode: SortMode) {
  switch (sortMode) {
    case "price_high_to_low":
      return [desc(inventory.pricePerDay)]
    case "price_high_brand_grouped":
      return [desc(inventory.pricePerDay), asc(inventory.brand)]
    case "brand_alpha":
      return [asc(inventory.brand), desc(inventory.pricePerDay)]
    case "price_low_to_high":
      return [asc(inventory.pricePerDay)]
    case "featured_first":
    default:
      return [desc(inventory.isFeatured), desc(inventory.createdAt)]
  }
}

export function getYachtOrderBy(sortMode: SortMode) {
  switch (sortMode) {
    case "price_high_to_low":
      return [desc(inventory.pricePerHour)]
    case "price_high_brand_grouped":
      return [desc(inventory.pricePerHour), asc(inventory.brand)]
    case "brand_alpha":
      return [asc(inventory.brand), desc(inventory.pricePerHour)]
    case "price_low_to_high":
      return [asc(inventory.pricePerHour)]
    case "featured_first":
    default:
      return [desc(inventory.isFeatured), asc(inventory.pricePerHour)]
  }
}

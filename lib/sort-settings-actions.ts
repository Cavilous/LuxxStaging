"use server"

import { db } from "@/lib/db"
import { inventoryDisplaySettings } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import type { SortMode } from "@/lib/sort-settings-constants"

const CATEGORY_ROUTE_MAP: Record<string, string> = {
  car: "/cars",
  yacht: "/yachts",
  villa: "/houses",
}

export async function getSortSetting(category: string): Promise<SortMode> {
  try {
    const rows = await db
      .select({ sortMode: inventoryDisplaySettings.sortMode })
      .from(inventoryDisplaySettings)
      .where(eq(inventoryDisplaySettings.category, category))
      .limit(1)

    if (rows.length > 0 && rows[0].sortMode) {
      return rows[0].sortMode as SortMode
    }
    return "featured_first"
  } catch {
    return "featured_first"
  }
}

export async function getAllSortSettings(): Promise<Record<string, SortMode>> {
  try {
    const rows = await db
      .select({
        category: inventoryDisplaySettings.category,
        sortMode: inventoryDisplaySettings.sortMode,
      })
      .from(inventoryDisplaySettings)

    const settings: Record<string, SortMode> = {
      car: "featured_first",
      yacht: "featured_first",
      villa: "featured_first",
    }

    for (const row of rows) {
      settings[row.category] = row.sortMode as SortMode
    }

    return settings
  } catch {
    return {
      car: "featured_first",
      yacht: "featured_first",
      villa: "featured_first",
    }
  }
}

export async function upsertSortSetting(category: string, sortMode: SortMode) {
  try {
    const existing = await db
      .select({ id: inventoryDisplaySettings.id })
      .from(inventoryDisplaySettings)
      .where(eq(inventoryDisplaySettings.category, category))
      .limit(1)

    if (existing.length > 0) {
      await db
        .update(inventoryDisplaySettings)
        .set({ sortMode, updatedAt: new Date() })
        .where(eq(inventoryDisplaySettings.category, category))
    } else {
      await db.insert(inventoryDisplaySettings).values({
        category,
        sortMode,
      })
    }

    const route = CATEGORY_ROUTE_MAP[category]
    if (route) {
      revalidatePath(route)
    }

    return { success: true }
  } catch (error) {
    console.error("[upsertSortSetting error]:", error)
    return { error: error instanceof Error ? error.message : "Failed to save sort setting" }
  }
}

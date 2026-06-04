"use server"

import { db } from "@/lib/db"
import { homePageSections } from "@/lib/db/schema"
import { eq, and, gt, lt } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

async function checkAuth() {
  const supabase = createClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    throw new Error("Unauthorized - Please login to perform this action")
  }
  
  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("id")
    .eq("email", session.user.email)
    .eq("is_active", true)
    .single()
  
  if (!adminUser) {
    throw new Error("Unauthorized - Admin access required")
  }
  
  return { userId: adminUser.id, session }
}

export async function addToHomePageSection(section: string, inventoryId: string) {
  try {
    await checkAuth()

    const existingItems = await db
      .select()
      .from(homePageSections)
      .where(eq(homePageSections.section, section))

    const maxOrder = existingItems.length > 0 
      ? Math.max(...existingItems.map(item => item.displayOrder)) 
      : -1

    await db.insert(homePageSections).values({
      section,
      inventoryId,
      displayOrder: maxOrder + 1,
    })

    revalidatePath("/")
    revalidatePath("/admin/home-page")

    return { success: true }
  } catch (error) {
    console.error("Error adding to home page section:", error)
    throw error
  }
}

export async function removeFromHomePageSection(sectionId: string) {
  try {
    await checkAuth()

    const item = await db
      .select()
      .from(homePageSections)
      .where(eq(homePageSections.id, sectionId))
      .limit(1)

    if (item.length === 0) {
      throw new Error("Section item not found")
    }

    const { section, displayOrder } = item[0]

    await db.delete(homePageSections).where(eq(homePageSections.id, sectionId))

    const itemsToUpdate = await db
      .select()
      .from(homePageSections)
      .where(
        and(
          eq(homePageSections.section, section),
          gt(homePageSections.displayOrder, displayOrder)
        )
      )

    for (const itemToUpdate of itemsToUpdate) {
      await db
        .update(homePageSections)
        .set({ displayOrder: itemToUpdate.displayOrder - 1 })
        .where(eq(homePageSections.id, itemToUpdate.id))
    }

    revalidatePath("/")
    revalidatePath("/admin/home-page")

    return { success: true }
  } catch (error) {
    console.error("Error removing from home page section:", error)
    throw error
  }
}

export async function moveHomePageSectionItem(sectionId: string, direction: "up" | "down") {
  try {
    await checkAuth()

    const item = await db
      .select()
      .from(homePageSections)
      .where(eq(homePageSections.id, sectionId))
      .limit(1)

    if (item.length === 0) {
      throw new Error("Section item not found")
    }

    const { section, displayOrder } = item[0]
    const newOrder = direction === "up" ? displayOrder - 1 : displayOrder + 1

    const swapItem = await db
      .select()
      .from(homePageSections)
      .where(
        and(
          eq(homePageSections.section, section),
          eq(homePageSections.displayOrder, newOrder)
        )
      )
      .limit(1)

    if (swapItem.length === 0) {
      return { success: false, message: "Cannot move in that direction" }
    }

    await db
      .update(homePageSections)
      .set({ displayOrder: newOrder })
      .where(eq(homePageSections.id, sectionId))

    await db
      .update(homePageSections)
      .set({ displayOrder: displayOrder })
      .where(eq(homePageSections.id, swapItem[0].id))

    revalidatePath("/")
    revalidatePath("/admin/home-page")

    return { success: true }
  } catch (error) {
    console.error("Error moving home page section item:", error)
    throw error
  }
}

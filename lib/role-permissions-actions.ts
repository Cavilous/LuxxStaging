"use server"

import { db } from "@/lib/db"
import { rolePermissions } from "@/lib/db/schema"
import { revalidatePath } from "next/cache"
import { eq, and } from "drizzle-orm"
import { getCurrentUser } from "@/lib/auth-helpers"
import { isSuperAdmin } from "@/lib/auth-utils"
import { CMS_SECTIONS } from "@/lib/cms-sections"

async function requireSuperAdminAccess() {
  const currentUser = await getCurrentUser()
  
  if (!currentUser) {
    return { error: "Unauthorized: Not logged in", authorized: false }
  }
  
  if (!isSuperAdmin(currentUser)) {
    return { error: "Forbidden: Only super admins can manage role permissions", authorized: false }
  }
  
  return { authorized: true, currentUser }
}

export async function getRolePermissions(role: string) {
  try {
    const permissions = await db
      .select()
      .from(rolePermissions)
      .where(eq(rolePermissions.role, role))
    
    const permissionMap: Record<string, boolean> = {}
    
    for (const section of CMS_SECTIONS) {
      if (section.id === "users") {
        permissionMap[section.id] = false
      } else {
        permissionMap[section.id] = true
      }
    }
    
    for (const perm of permissions) {
      permissionMap[perm.section] = perm.canAccess
    }
    
    return { success: true, data: permissionMap }
  } catch (error) {
    console.error("Error fetching role permissions:", error)
    return { error: "Failed to fetch permissions" }
  }
}

export async function getAllRolePermissions() {
  try {
    const authResult = await requireSuperAdminAccess()
    if (!authResult.authorized) {
      return { error: authResult.error }
    }

    const permissions = await db
      .select()
      .from(rolePermissions)
    
    const adminPermissions: Record<string, boolean> = {}
    
    for (const section of CMS_SECTIONS) {
      if (section.id === "users") {
        adminPermissions[section.id] = false
      } else {
        adminPermissions[section.id] = true
      }
    }
    
    for (const perm of permissions) {
      if (perm.role === "admin") {
        adminPermissions[perm.section] = perm.canAccess
      }
    }
    
    return { 
      success: true, 
      data: {
        admin: adminPermissions,
      }
    }
  } catch (error) {
    console.error("Error fetching all role permissions:", error)
    return { error: "Failed to fetch permissions" }
  }
}

export async function updateRolePermission(role: string, section: string, canAccess: boolean) {
  try {
    const authResult = await requireSuperAdminAccess()
    if (!authResult.authorized) {
      return { error: authResult.error }
    }

    if (role === "super_admin") {
      return { error: "Cannot modify super admin permissions" }
    }

    if (section === "users" && role === "admin" && canAccess) {
      return { error: "Users section is reserved for super admins only" }
    }

    const existing = await db
      .select()
      .from(rolePermissions)
      .where(and(
        eq(rolePermissions.role, role),
        eq(rolePermissions.section, section)
      ))
      .limit(1)

    if (existing.length > 0) {
      await db
        .update(rolePermissions)
        .set({ 
          canAccess,
          updatedAt: new Date()
        })
        .where(eq(rolePermissions.id, existing[0].id))
    } else {
      await db
        .insert(rolePermissions)
        .values({
          role,
          section,
          canAccess,
        })
    }

    revalidatePath("/admin/settings/roles")
    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Error updating role permission:", error)
    return { error: "Failed to update permission" }
  }
}

export async function bulkUpdateRolePermissions(role: string, permissions: Record<string, boolean>) {
  try {
    const authResult = await requireSuperAdminAccess()
    if (!authResult.authorized) {
      return { error: authResult.error }
    }

    if (role === "super_admin") {
      return { error: "Cannot modify super admin permissions" }
    }

    for (const [section, canAccess] of Object.entries(permissions)) {
      if (section === "users" && role === "admin" && canAccess) {
        continue
      }

      const existing = await db
        .select()
        .from(rolePermissions)
        .where(and(
          eq(rolePermissions.role, role),
          eq(rolePermissions.section, section)
        ))
        .limit(1)

      if (existing.length > 0) {
        await db
          .update(rolePermissions)
          .set({ 
            canAccess,
            updatedAt: new Date()
          })
          .where(eq(rolePermissions.id, existing[0].id))
      } else {
        await db
          .insert(rolePermissions)
          .values({
            role,
            section,
            canAccess,
          })
      }
    }

    revalidatePath("/admin/settings/roles")
    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Error bulk updating role permissions:", error)
    return { error: "Failed to update permissions" }
  }
}

export async function canUserAccessSection(section: string): Promise<boolean> {
  try {
    const currentUser = await getCurrentUser()
    
    if (!currentUser) {
      return false
    }
    
    if (isSuperAdmin(currentUser)) {
      return true
    }
    
    if (section === "users") {
      return false
    }
    
    const permission = await db
      .select()
      .from(rolePermissions)
      .where(and(
        eq(rolePermissions.role, currentUser.role),
        eq(rolePermissions.section, section)
      ))
      .limit(1)
    
    if (permission.length === 0) {
      return true
    }
    
    return permission[0].canAccess
  } catch (error) {
    console.error("Error checking section access:", error)
    return false
  }
}

export async function getUserAccessibleSections(): Promise<string[]> {
  try {
    const currentUser = await getCurrentUser()
    
    if (!currentUser) {
      return []
    }
    
    if (isSuperAdmin(currentUser)) {
      return CMS_SECTIONS.map(s => s.id)
    }
    
    const permissions = await db
      .select()
      .from(rolePermissions)
      .where(eq(rolePermissions.role, currentUser.role))
    
    const permissionMap: Record<string, boolean> = {}
    for (const section of CMS_SECTIONS) {
      if (section.id === "users") {
        permissionMap[section.id] = false
      } else {
        permissionMap[section.id] = true
      }
    }
    
    for (const perm of permissions) {
      permissionMap[perm.section] = perm.canAccess
    }
    
    return Object.entries(permissionMap)
      .filter(([_, canAccess]) => canAccess)
      .map(([section]) => section)
  } catch (error) {
    console.error("Error getting accessible sections:", error)
    return []
  }
}

"use server"

import { db } from "@/lib/db"
import { rolePermissions } from "@/lib/db/schema"
import { revalidatePath } from "next/cache"
import { eq, and } from "drizzle-orm"
import { getCurrentUser } from "@/lib/auth-helpers"
import { EDITABLE_ADMIN_ROLE_VALUES, isSuperAdmin, normalizeAdminRole, type AdminRole, type EditableAdminRole } from "@/lib/auth-utils"
import { CMS_SECTIONS } from "@/lib/cms-sections"

const NAV_ONLY_SECTION_IDS = ["vendors", "seo-pages", "media-quality", "duplicates"] as const
const CMS_SECTION_IDS = CMS_SECTIONS.map((section) => section.id)
const ALL_SECTION_IDS = Array.from(new Set([...CMS_SECTION_IDS, ...NAV_ONLY_SECTION_IDS]))

const OPS_DEFAULT_SECTIONS = [
  "dashboard",
  "tasks",
  "social-outreach",
  "cars",
  "yachts",
  "houses",
  "jets",
  "for-sale",
  "vendors",
  "services",
  "import",
  "media-quality",
  "duplicates",
] as const

const MARKETING_DEFAULT_SECTIONS = [
  "dashboard",
  "tasks",
  "social-outreach",
  "blog",
  "home-page",
  "seo-pages",
  "media-quality",
  "duplicates",
] as const

function isSuperAdminOnlySection(section: string) {
  return section === "users"
}

function getDefaultSectionAccess(role: AdminRole, section: string) {
  if (role === "super_admin") {
    return true
  }

  if (isSuperAdminOnlySection(section)) {
    return false
  }

  if (role === "admin") {
    return true
  }

  if (role === "ops") {
    return (OPS_DEFAULT_SECTIONS as readonly string[]).includes(section)
  }

  return (MARKETING_DEFAULT_SECTIONS as readonly string[]).includes(section)
}

function buildDefaultPermissionMap(role: AdminRole, sectionIds: readonly string[] = CMS_SECTION_IDS) {
  const permissionMap: Record<string, boolean> = {}

  for (const sectionId of sectionIds) {
    permissionMap[sectionId] = getDefaultSectionAccess(role, sectionId)
  }

  return permissionMap
}

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
    const normalizedRole = normalizeAdminRole(role)
    if (!normalizedRole) {
      return { error: "Invalid role specified" }
    }

    const permissions = await db
      .select()
      .from(rolePermissions)
      .where(eq(rolePermissions.role, normalizedRole))
    
    const permissionMap = buildDefaultPermissionMap(normalizedRole)
    
    for (const perm of permissions) {
      permissionMap[perm.section] = isSuperAdminOnlySection(perm.section) ? false : perm.canAccess
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
    
    const permissionByRole = EDITABLE_ADMIN_ROLE_VALUES
      .reduce((roles, role) => {
        roles[role] = buildDefaultPermissionMap(role)
        return roles
      }, {} as Record<EditableAdminRole, Record<string, boolean>>)
    
    for (const perm of permissions) {
      const normalizedRole = normalizeAdminRole(perm.role)
      if (!normalizedRole || normalizedRole === "super_admin") {
        continue
      }

      const editableRole: EditableAdminRole = normalizedRole
      permissionByRole[editableRole][perm.section] = isSuperAdminOnlySection(perm.section)
        ? false
        : perm.canAccess
    }
    
    return { 
      success: true, 
      data: permissionByRole
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

    const normalizedRole = normalizeAdminRole(role)
    if (!normalizedRole) {
      return { error: "Invalid role specified" }
    }

    if (normalizedRole === "super_admin") {
      return { error: "Cannot modify super admin permissions" }
    }

    if (isSuperAdminOnlySection(section) && canAccess) {
      return { error: "Users section is reserved for super admins only" }
    }

    const existing = await db
      .select()
      .from(rolePermissions)
      .where(and(
        eq(rolePermissions.role, normalizedRole),
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
          role: normalizedRole,
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

    const normalizedRole = normalizeAdminRole(role)
    if (!normalizedRole) {
      return { error: "Invalid role specified" }
    }

    if (normalizedRole === "super_admin") {
      return { error: "Cannot modify super admin permissions" }
    }

    for (const [section, canAccess] of Object.entries(permissions)) {
      const nextAccess = isSuperAdminOnlySection(section) ? false : canAccess

      const existing = await db
        .select()
        .from(rolePermissions)
        .where(and(
          eq(rolePermissions.role, normalizedRole),
          eq(rolePermissions.section, section)
        ))
        .limit(1)

      if (existing.length > 0) {
        await db
          .update(rolePermissions)
          .set({ 
            canAccess: nextAccess,
            updatedAt: new Date()
          })
          .where(eq(rolePermissions.id, existing[0].id))
      } else {
        await db
          .insert(rolePermissions)
          .values({
            role: normalizedRole,
            section,
            canAccess: nextAccess,
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

    const normalizedRole = normalizeAdminRole(currentUser.role)
    if (!normalizedRole) {
      return false
    }
    
    const permission = await db
      .select()
      .from(rolePermissions)
      .where(and(
        eq(rolePermissions.role, normalizedRole),
        eq(rolePermissions.section, section)
      ))
      .limit(1)
    
    if (permission.length === 0) {
      return getDefaultSectionAccess(normalizedRole, section)
    }
    
    return isSuperAdminOnlySection(section) ? false : permission[0].canAccess
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
      return ALL_SECTION_IDS
    }

    const normalizedRole = normalizeAdminRole(currentUser.role)
    if (!normalizedRole) {
      return []
    }
    
    const permissions = await db
      .select()
      .from(rolePermissions)
      .where(eq(rolePermissions.role, normalizedRole))
    
    const permissionMap = buildDefaultPermissionMap(normalizedRole, ALL_SECTION_IDS)
    
    for (const perm of permissions) {
      permissionMap[perm.section] = isSuperAdminOnlySection(perm.section) ? false : perm.canAccess
    }
    
    return Object.entries(permissionMap)
      .filter(([_, canAccess]) => canAccess)
      .map(([section]) => section)
  } catch (error) {
    console.error("Error getting accessible sections:", error)
    return []
  }
}

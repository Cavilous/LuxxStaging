import { getCurrentUser, type CurrentUser } from "@/lib/auth-helpers"
import { isSuperAdmin } from "@/lib/auth-utils"
import { DEMO_ADMIN_EMAIL, DEMO_ADMIN_ID, DEMO_SAFE_ADMIN_SECTIONS } from "@/lib/demo-admin"
import { getUserAccessibleSections } from "@/lib/role-permissions-actions"

export function isDemoAdminUser(user: CurrentUser | null | undefined) {
  return user?.userId === DEMO_ADMIN_ID || user?.email === DEMO_ADMIN_EMAIL
}

export function canUseDemoSafeAdminAccess(user: CurrentUser | null | undefined) {
  return isSuperAdmin(user ?? null) || isDemoAdminUser(user)
}

export async function getDemoSafeCurrentUser() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return null
  }

  if (isDemoAdminUser(currentUser)) {
    return {
      ...currentUser,
      role: "super_admin",
      name: currentUser.name ?? "Demo Admin",
    }
  }

  return currentUser
}

export async function getDemoSafeAccessibleSections() {
  try {
    const sections = await getUserAccessibleSections()
    return sections.length > 0 ? sections : [...DEMO_SAFE_ADMIN_SECTIONS]
  } catch (error) {
    console.error("Error loading demo-safe admin sections:", error)
    return [...DEMO_SAFE_ADMIN_SECTIONS]
  }
}

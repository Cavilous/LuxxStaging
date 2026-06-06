"use server"

import { db } from "@/lib/db"
import { adminUsers } from "@/lib/db/schema"
import { revalidatePath } from "next/cache"
import { and, eq } from "drizzle-orm"
import bcrypt from "bcryptjs"
import { getCurrentUser, isLastSuperAdmin } from "@/lib/auth-helpers"
import { isSuperAdmin, normalizeAdminRole } from "@/lib/auth-utils"

type AdminUserRecord = typeof adminUsers.$inferSelect
type SafeAdminUser = Omit<AdminUserRecord, "passwordHash">

function toSafeAdminUser(user: AdminUserRecord): SafeAdminUser {
  const { passwordHash: _passwordHash, ...safeUser } = user
  return safeUser
}

async function requireSuperAdminAccess() {
  const currentUser = await getCurrentUser()
  
  if (!currentUser) {
    return { error: "Unauthorized: Not logged in", authorized: false }
  }
  
  if (!isSuperAdmin(currentUser)) {
    return { error: "Forbidden: Only super admins can manage users", authorized: false }
  }
  
  return { authorized: true, currentUser }
}

export async function createAdminUser(formData: FormData) {
  try {
    const authResult = await requireSuperAdminAccess()
    if (!authResult.authorized) {
      return { error: authResult.error }
    }

    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const roleInput = formData.get("role") as string
    const role = roleInput ? normalizeAdminRole(roleInput) : null

    if (!email || !password) {
      return { error: "Email and password are required" }
    }

    if (password.length < 8) {
      return { error: "Password must be at least 8 characters" }
    }

    if (roleInput && !role) {
      return { error: "Invalid role specified" }
    }

    const existingUser = await db
      .select({ id: adminUsers.id })
      .from(adminUsers)
      .where(eq(adminUsers.email, email.toLowerCase()))
      .limit(1)

    if (existingUser.length > 0) {
      return { error: "A user with this email already exists" }
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const [newUser] = await db
      .insert(adminUsers)
      .values({
        name: name || null,
        email: email.toLowerCase(),
        passwordHash,
        role: role || "ops",
        isActive: true,
      })
      .returning()

    revalidatePath("/admin/users")
    return { success: true, data: toSafeAdminUser(newUser) }
  } catch (error) {
    console.error("Error creating admin user:", error)
    return { error: error instanceof Error ? error.message : "Failed to create user" }
  }
}

export async function updateAdminUser(id: string, formData: FormData) {
  try {
    const authResult = await requireSuperAdminAccess()
    if (!authResult.authorized) {
      return { error: authResult.error }
    }

    const currentUser = authResult.currentUser!
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const roleInput = formData.get("role") as string
    const role = roleInput ? normalizeAdminRole(roleInput) : null

    if (!email) {
      return { error: "Email is required" }
    }

    const [targetUser] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.id, id))
      .limit(1)

    if (!targetUser) {
      return { error: "User not found" }
    }

    if (roleInput && !role) {
      return { error: "Invalid role specified" }
    }

    if (targetUser.role === 'super_admin' && role && role !== 'super_admin') {
      const isLast = await isLastSuperAdmin(id)
      if (isLast) {
        return { error: "Cannot demote the last super admin. Create another super admin first." }
      }
    }

    const currentUserRole = normalizeAdminRole(currentUser.role)
    if (id === currentUser.userId && role && role !== currentUserRole) {
      return { error: "You cannot change your own role" }
    }

    const existingUser = await db
      .select({ id: adminUsers.id })
      .from(adminUsers)
      .where(eq(adminUsers.email, email.toLowerCase()))
      .limit(1)

    if (existingUser.length > 0 && existingUser[0].id !== id) {
      return { error: "A user with this email already exists" }
    }

    const updateData: any = {
      name: name || null,
      email: email.toLowerCase(),
      role: role || targetUser.role,
      updatedAt: new Date(),
    }

    if (password && password.trim() !== "") {
      if (password.length < 8) {
        return { error: "Password must be at least 8 characters" }
      }
      updateData.passwordHash = await bcrypt.hash(password, 10)
    }

    const [updatedUser] = await db
      .update(adminUsers)
      .set(updateData)
      .where(eq(adminUsers.id, id))
      .returning()

    revalidatePath("/admin/users")
    return { success: true, data: toSafeAdminUser(updatedUser) }
  } catch (error) {
    console.error("Error updating admin user:", error)
    return { error: error instanceof Error ? error.message : "Failed to update user" }
  }
}

export async function deleteAdminUser(id: string, confirmed: boolean = false) {
  try {
    const authResult = await requireSuperAdminAccess()
    if (!authResult.authorized) {
      return { error: authResult.error }
    }

    const currentUser = authResult.currentUser!

    if (!confirmed) {
      return { error: "Delete confirmation required" }
    }

    if (id === currentUser.userId) {
      return { error: "You cannot delete your own account" }
    }

    const [userToDelete] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.id, id))
      .limit(1)

    if (!userToDelete) {
      return { error: "User not found" }
    }

    if (userToDelete.role === 'super_admin') {
      const isLast = await isLastSuperAdmin(id)
      if (isLast) {
        return { error: "Cannot delete the last super admin account" }
      }
    }

    await db.delete(adminUsers).where(eq(adminUsers.id, id))
    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Error deleting admin user:", error)
    return { error: "Failed to delete user" }
  }
}

export async function toggleUserStatus(id: string) {
  try {
    const authResult = await requireSuperAdminAccess()
    if (!authResult.authorized) {
      return { error: authResult.error }
    }

    const currentUser = authResult.currentUser!

    if (id === currentUser.userId) {
      return { error: "You cannot deactivate your own account" }
    }

    const [user] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.id, id))
      .limit(1)

    if (!user) {
      return { error: "User not found" }
    }

    if (user.role === 'super_admin' && user.isActive) {
      const activeSuperAdmins = await db
        .select({ id: adminUsers.id })
        .from(adminUsers)
        .where(and(
          eq(adminUsers.role, 'super_admin'),
          eq(adminUsers.isActive, true)
        ))

      if (activeSuperAdmins.length === 1) {
        return { error: "Cannot deactivate the last active super admin" }
      }
    }

    const [updatedUser] = await db
      .update(adminUsers)
      .set({ 
        isActive: !user.isActive,
        updatedAt: new Date()
      })
      .where(eq(adminUsers.id, id))
      .returning()

    revalidatePath("/admin/users")
    return { success: true, data: toSafeAdminUser(updatedUser) }
  } catch (error) {
    console.error("Error toggling user status:", error)
    return { error: "Failed to toggle user status" }
  }
}

export async function getAdminUserById(id: string) {
  try {
    const authResult = await requireSuperAdminAccess()
    if (!authResult.authorized) {
      return { error: authResult.error }
    }

    const [user] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.id, id))
      .limit(1)

    if (!user) {
      return { error: "User not found" }
    }

    return { success: true, data: toSafeAdminUser(user) }
  } catch (error) {
    console.error("Error fetching admin user:", error)
    return { error: "Failed to fetch user" }
  }
}

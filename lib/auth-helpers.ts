"use server"

import { cookies } from "next/headers"
import * as jwt from "jsonwebtoken"
import { db } from "@/lib/db"
import { adminUsers } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { isSuperAdmin } from "./auth-utils"

const JWT_SECRET_FALLBACK = "your-secret-key-change-in-production"

function getJwtSecret(): string {
  return process.env.JWT_SECRET || JWT_SECRET_FALLBACK
}

export async function requireApiAuth(): Promise<CurrentUser> {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_session')?.value

  if (!token) {
    const error = new Error("Unauthorized")
    ;(error as any).status = 401
    throw error
  }

  try {
    const jwtSecret = getJwtSecret()
    const decoded = jwt.verify(token, jwtSecret, { algorithms: ['HS256'] }) as {
      userId: string
      email: string
      role: string
    }

    if (!decoded.userId || !decoded.email || !decoded.role) {
      const error = new Error("Unauthorized")
      ;(error as any).status = 401
      throw error
    }

    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    }
  } catch (e) {
    const error = new Error("Unauthorized")
    ;(error as any).status = 401
    throw error
  }
}

export interface CurrentUser {
  userId: string
  email: string
  role: string
  name?: string | null
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_session')?.value

    if (!token) {
      return null
    }

    const jwtSecret = getJwtSecret()
    const decoded = jwt.verify(token, jwtSecret) as {
      userId: string
      email: string
      role: string
    }

    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    }
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export async function getCurrentUserWithDetails(): Promise<CurrentUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_session')?.value

    if (!token) {
      return null
    }

    const jwtSecret = getJwtSecret()
    const decoded = jwt.verify(token, jwtSecret) as {
      userId: string
      email: string
      role: string
    }

    const [user] = await db
      .select({
        id: adminUsers.id,
        email: adminUsers.email,
        name: adminUsers.name,
        role: adminUsers.role,
      })
      .from(adminUsers)
      .where(eq(adminUsers.id, decoded.userId))
      .limit(1)

    if (!user) {
      return null
    }

    return {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    }
  } catch (error) {
    console.error("Error getting current user details:", error)
    return null
  }
}

export async function requireSuperAdmin(): Promise<CurrentUser> {
  const user = await getCurrentUser()
  
  if (!user) {
    throw new Error("Unauthorized: Not logged in")
  }
  
  if (!isSuperAdmin(user)) {
    throw new Error("Forbidden: Super admin access required")
  }
  
  return user
}

export async function countSuperAdmins(): Promise<number> {
  const superAdmins = await db
    .select({ id: adminUsers.id })
    .from(adminUsers)
    .where(eq(adminUsers.role, 'super_admin'))
  
  return superAdmins.length
}

export async function isLastSuperAdmin(userId: string): Promise<boolean> {
  const [user] = await db
    .select({ role: adminUsers.role })
    .from(adminUsers)
    .where(eq(adminUsers.id, userId))
    .limit(1)

  if (!user || user.role !== 'super_admin') {
    return false
  }

  const count = await countSuperAdmins()
  return count === 1
}

import type { CurrentUser } from "./auth-helpers"

export function isSuperAdmin(user: CurrentUser | null): boolean {
  return user?.role === 'super_admin'
}

export function isAdmin(user: CurrentUser | null): boolean {
  return user?.role === 'admin' || user?.role === 'super_admin'
}

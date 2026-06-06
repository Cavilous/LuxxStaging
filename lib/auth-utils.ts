import type { CurrentUser } from "./auth-helpers"

export const ADMIN_ROLE_VALUES = ["super_admin", "admin", "ops", "marketing"] as const

export type AdminRole = typeof ADMIN_ROLE_VALUES[number]
export type EditableAdminRole = Exclude<AdminRole, "super_admin">

export const EDITABLE_ADMIN_ROLE_VALUES: readonly EditableAdminRole[] = ["admin", "ops", "marketing"]

export const ADMIN_ROLE_OPTIONS: ReadonlyArray<{
  value: AdminRole
  label: string
  description: string
}> = [
  {
    value: "super_admin",
    label: "Super Admin",
    description: "Owner-level access, including user and role management.",
  },
  {
    value: "admin",
    label: "Admin Team",
    description: "Management access to admin tools except super-admin-only sections.",
  },
  {
    value: "ops",
    label: "Ops Team",
    description: "Operational access for inventory and service workflows.",
  },
  {
    value: "marketing",
    label: "Marketing Team",
    description: "Content and marketing access for blog, SEO, and home page work.",
  },
]

const LEGACY_ROLE_ALIASES: Record<string, AdminRole> = {
  moderator: "ops",
}

const ROLE_LABELS: Record<AdminRole, string> = ADMIN_ROLE_OPTIONS.reduce(
  (labels, role) => ({ ...labels, [role.value]: role.label }),
  {} as Record<AdminRole, string>
)

export function normalizeAdminRole(role: string | null | undefined): AdminRole | null {
  if (!role) return null

  const normalized = role.trim().toLowerCase()
  if ((ADMIN_ROLE_VALUES as readonly string[]).includes(normalized)) {
    return normalized as AdminRole
  }

  return LEGACY_ROLE_ALIASES[normalized] ?? null
}

export function isAllowedAdminRole(role: string | null | undefined): boolean {
  return normalizeAdminRole(role) !== null
}

export function getAdminRoleLabel(role: string | null | undefined): string {
  const normalized = normalizeAdminRole(role)
  if (!normalized) return "Team Member"

  return ROLE_LABELS[normalized]
}

export function isSuperAdmin(user: CurrentUser | null): boolean {
  return normalizeAdminRole(user?.role) === 'super_admin'
}

export function isAdmin(user: CurrentUser | null): boolean {
  const role = normalizeAdminRole(user?.role)
  return role === 'admin' || role === 'super_admin'
}

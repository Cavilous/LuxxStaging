export const DEMO_ADMIN_ID = "00000000-0000-4000-8000-000000000001"
export const DEMO_ADMIN_EMAIL = "demo-admin@luxxmiami.local"
export const DEMO_ADMIN_NAME = "Demo Admin"
export const DEMO_ADMIN_ROLE = "super_admin"

export const DEMO_SAFE_ADMIN_SECTIONS = [
  "dashboard",
  "tasks",
  "social-outreach",
  "cars",
  "yachts",
  "houses",
  "jets",
  "for-sale",
  "vendors",
  "seo-pages",
  "blog",
  "services",
  "users",
  "tour-routes",
  "tour-addons",
  "repair-leads",
  "repair-packages",
  "repair-capabilities",
  "repair-settings",
  "audit",
  "analytics",
  "import",
  "home-page",
  "media-quality",
  "duplicates",
  "settings",
  "inventory-sort",
] as const

export function isDemoAdminIdentity(user: { userId?: string | null; id?: string | null; email?: string | null } | null | undefined) {
  return user?.userId === DEMO_ADMIN_ID || user?.id === DEMO_ADMIN_ID || user?.email === DEMO_ADMIN_EMAIL
}

export function getDemoAdminUser() {
  return {
    userId: DEMO_ADMIN_ID,
    id: DEMO_ADMIN_ID,
    email: DEMO_ADMIN_EMAIL,
    role: DEMO_ADMIN_ROLE,
    name: DEMO_ADMIN_NAME,
  }
}

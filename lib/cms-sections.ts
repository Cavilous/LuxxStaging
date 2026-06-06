export const CMS_SECTIONS = [
  { id: "dashboard", name: "Dashboard", description: "Main admin dashboard" },
  { id: "tasks", name: "Tasks", description: "Manage daily operations tasks" },
  { id: "social-outreach", name: "Social Outreach", description: "Track human social outreach workflows" },
  { id: "cars", name: "Cars", description: "Manage car inventory" },
  { id: "yachts", name: "Yachts", description: "Manage yacht inventory" },
  { id: "houses", name: "Houses/Villas", description: "Manage house/villa inventory" },
  { id: "jets", name: "Jets", description: "Manage jet inventory" },
  { id: "for-sale", name: "For Sale", description: "Manage assets for sale" },
  { id: "tour-routes", name: "Tour Routes", description: "Manage tour routes" },
  { id: "tour-addons", name: "Tour Add-Ons", description: "Manage tour add-ons" },
  { id: "repair-leads", name: "Repair Leads", description: "View repair service leads" },
  { id: "repair-packages", name: "Repair Packages", description: "Manage repair packages" },
  { id: "repair-capabilities", name: "Repair Capabilities", description: "Manage repair capabilities" },
  { id: "repair-settings", name: "Repair Settings", description: "Manage repair shop settings" },
  { id: "blog", name: "Blog", description: "Manage blog posts" },
  { id: "services", name: "Services", description: "Manage services" },
  { id: "users", name: "Users", description: "Manage admin users (super admin only)" },
  { id: "audit", name: "Audit Logs", description: "View audit logs" },
  { id: "import", name: "Bulk Import", description: "Import inventory in bulk" },
  { id: "home-page", name: "Home Page", description: "Manage home page sections" },
] as const

export type CMSSection = typeof CMS_SECTIONS[number]["id"]

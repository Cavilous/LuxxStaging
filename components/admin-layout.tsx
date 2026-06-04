"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { LayoutDashboard, Car, Anchor, Home, Plane, Settings, Users, FileText, LogOut, Menu, X, Crown, MapPin, Package, DollarSign, Wrench, ClipboardList, Shield, Cog, Upload, ChevronDown, BookOpen, BarChart3, ImageIcon, Copy, Globe, ArrowUpDown, Building2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { adminSignOut } from "@/lib/admin-actions"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  superAdminOnly?: boolean
  sectionId?: string
}

interface NavGroup {
  name: string
  icon: React.ComponentType<{ className?: string }>
  items: NavItem[]
  superAdminOnly?: boolean
}

interface ExtendedNavItem extends NavItem {
  superAdminOnly?: boolean
}

const navigationGroups: (ExtendedNavItem | NavGroup)[] = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard, sectionId: "dashboard" },
  {
    name: "Rental Inventory",
    icon: Package,
    items: [
      { name: "Cars", href: "/admin/cars", icon: Car, sectionId: "cars" },
      { name: "Yachts", href: "/admin/yachts", icon: Anchor, sectionId: "yachts" },
      { name: "Houses", href: "/admin/houses", icon: Home, sectionId: "houses" },
      { name: "Jets", href: "/admin/jets", icon: Plane, sectionId: "jets" },
      { name: "Vendors", href: "/admin/vendors", icon: Building2, sectionId: "vendors" },
    ]
  },
  {
    name: "For Sale Inventory",
    icon: DollarSign,
    items: [
      { name: "Cars", href: "/admin/for-sale", icon: Car, sectionId: "for-sale" },
    ]
  },
  {
    name: "Tours",
    icon: MapPin,
    items: [
      { name: "Tour Routes", href: "/admin/tour-routes", icon: MapPin, sectionId: "tour-routes" },
      { name: "Tour Add-Ons", href: "/admin/tour-addons", icon: Package, sectionId: "tour-addons" },
    ]
  },
  {
    name: "Repair Shop",
    icon: Wrench,
    items: [
      { name: "Repair Leads", href: "/admin/repair/leads", icon: ClipboardList, sectionId: "repair-leads" },
      { name: "Repair Packages", href: "/admin/repair/packages", icon: Wrench, sectionId: "repair-packages" },
      { name: "Repair Capabilities", href: "/admin/repair/capabilities", icon: Shield, sectionId: "repair-capabilities" },
      { name: "Repair Settings", href: "/admin/repair/settings", icon: Cog, sectionId: "repair-settings" },
    ]
  },
  { name: "SEO Pages", href: "/admin/seo-pages", icon: Globe, sectionId: "seo-pages" },
  { name: "Blog", href: "/admin/blog", icon: BookOpen, sectionId: "blog" },
  {
    name: "System",
    icon: Settings,
    items: [
      { name: "Services", href: "/admin/services", icon: Settings, sectionId: "services" },
      { name: "Users", href: "/admin/users", icon: Users, superAdminOnly: true, sectionId: "users" },
      { name: "Role Settings", href: "/admin/settings/roles", icon: Shield, superAdminOnly: true },
      { name: "Inventory Sort", href: "/admin/settings/inventory-sort", icon: ArrowUpDown, superAdminOnly: true },
      { name: "Analytics", href: "/admin/analytics", icon: BarChart3, superAdminOnly: true },
      { name: "Media Quality", href: "/admin/media-quality", icon: ImageIcon, sectionId: "media-quality" },
      { name: "Duplicates", href: "/admin/duplicates", icon: Copy, sectionId: "duplicates" },
      { name: "Audit Logs", href: "/admin/audit", icon: FileText, sectionId: "audit" },
      { name: "Bulk Import", href: "/admin/import", icon: Upload, sectionId: "import" },
      { name: "Home Page", href: "/admin/home-page", icon: Home, sectionId: "home-page" },
    ]
  }
]

function isNavGroup(item: ExtendedNavItem | NavGroup): item is NavGroup {
  return 'items' in item
}

// Temporarily hidden sections - will be re-enabled later
const HIDDEN_NAV_GROUPS = ["Tours", "Repair Shop"]

function filterNavigationByRole(
  items: (ExtendedNavItem | NavGroup)[], 
  isSuperAdmin: boolean, 
  accessibleSections?: string[]
): (ExtendedNavItem | NavGroup)[] {
  return items.filter(item => {
    // Hide temporarily disabled nav groups
    if (isNavGroup(item) && HIDDEN_NAV_GROUPS.includes(item.name)) {
      return false
    }
    return true
  }).map(item => {
    if (isNavGroup(item)) {
      const filteredItems = item.items.filter(subItem => {
        if ('superAdminOnly' in subItem && subItem.superAdminOnly) {
          return isSuperAdmin
        }
        if (!isSuperAdmin && accessibleSections && subItem.sectionId) {
          return accessibleSections.includes(subItem.sectionId)
        }
        return true
      })
      if (filteredItems.length === 0) return null
      return { ...item, items: filteredItems }
    }
    if (item.superAdminOnly && !isSuperAdmin) {
      return null
    }
    if (!isSuperAdmin && accessibleSections && item.sectionId) {
      if (!accessibleSections.includes(item.sectionId)) {
        return null
      }
    }
    return item
  }).filter(Boolean) as (ExtendedNavItem | NavGroup)[]
}

interface AdminLayoutProps {
  children: React.ReactNode
  user?: { email?: string; role?: string } | null
  accessibleSections?: string[]
}

export default function AdminLayout({ children, user, accessibleSections }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  
  const isSuperAdmin = user?.role === 'super_admin'
  const filteredNavigation = filterNavigationByRole(navigationGroups, isSuperAdmin, accessibleSections)
  
  // Pre-compute which groups should be open based on active path
  const [openGroups, setOpenGroups] = useState<string[]>(() => {
    const initialOpen: string[] = []
    filteredNavigation.forEach(item => {
      if (isNavGroup(item)) {
        const hasActiveChild = item.items.some(child => child.href === pathname)
        if (hasActiveChild) {
          initialOpen.push(item.name)
        }
      }
    })
    return initialOpen
  })

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Grain overlay */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none bg-[url('data:image/svg+xml,%3Csvg width%3D%22200%22 height%3D%22200%22 xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cfilter id%3D%22noise%22%3E%3CfeTurbulence type%3D%22fractalNoise%22 baseFrequency%3D%220.9%22 numOctaves%3D%224%22 stitchTiles%3D%22stitch%22/%3E%3C/filter%3E%3Crect width%3D%22100%25%22 height%3D%22100%25%22 filter%3D%22url(%23noise)%22 opacity%3D%221%22/%3E%3C/svg%3E')]"></div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#111111] border-r border-[#333333] transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-[#333333]">
            <div className="flex items-center space-x-3">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/profile-pic-logo-transparent-background%20%281%29-NsrnIlw2XUmCf9NaHqCqGNTdzkkgw9.png"
                alt="Luxx Miami"
                width={40}
                height={40}
              />
              <div>
                <h1 className="text-lg font-bold text-white">Admin Portal</h1>
                <p className="text-xs text-gray-400">Content Management</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {filteredNavigation.map((item) => {
              if (isNavGroup(item)) {
                const isAnyChildActive = item.items.some(child => pathname === child.href)
                const isOpen = openGroups.includes(item.name)
                
                return (
                  <Collapsible 
                    key={item.name} 
                    open={isOpen} 
                    onOpenChange={(open) => {
                      setOpenGroups(prev => 
                        open 
                          ? [...prev, item.name]
                          : prev.filter(name => name !== item.name)
                      )
                    }}
                  >
                    <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-2.5 text-sm font-medium text-gray-300 hover:bg-[#222222] hover:text-white transition-colors cut-corner">
                      <div className="flex items-center space-x-3">
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </div>
                      <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-1 space-y-1">
                      {item.items.map((subItem) => {
                        const isActive = pathname === subItem.href
                        return (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className={`flex items-center space-x-3 px-4 py-2 ml-4 text-sm transition-colors cut-corner ${
                              isActive ? "bg-[#ECAC36] text-black font-medium" : "text-gray-400 hover:bg-[#1A1A1A] hover:text-white"
                            }`}
                          >
                            <subItem.icon className="h-4 w-4" />
                            <span>{subItem.name}</span>
                          </Link>
                        )
                      })}
                    </CollapsibleContent>
                  </Collapsible>
                )
              } else {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-2.5 text-sm font-medium transition-colors cut-corner ${
                      isActive ? "bg-[#ECAC36] text-black" : "text-gray-300 hover:bg-[#222222] hover:text-white"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              }
            })}
          </nav>

          {/* User info and logout */}
          <div className="p-4 border-t border-[#333333]">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isSuperAdmin ? 'bg-purple-500' : 'bg-[#ECAC36]'}`}>
                <Crown className="h-4 w-4 text-black" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.email || "Admin User"}</p>
                <p className="text-xs text-gray-400">{isSuperAdmin ? 'Super Admin' : 'Admin'}</p>
              </div>
            </div>
            <Button
              onClick={() => adminSignOut()}
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-[#222222]"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-[#111111] border-b border-[#333333] px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex-1 lg:flex-none">
              <h2 className="text-xl font-semibold text-white">
                {filteredNavigation.flatMap(item => 
                  isNavGroup(item) ? item.items : [item]
                ).find((item) => item.href === pathname)?.name || "Admin"}
              </h2>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}

"use client"

import { useState, useTransition } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Lock, Check, X } from "lucide-react"
import { updateRolePermission } from "@/lib/role-permissions-actions"
import { toast } from "sonner"

interface Section {
  id: string
  name: string
  description: string
}

interface RolePermissionsTableProps {
  role: string
  sections: readonly Section[]
  permissions: Record<string, boolean>
}

export function RolePermissionsTable({ role, sections, permissions }: RolePermissionsTableProps) {
  const [localPermissions, setLocalPermissions] = useState(permissions)
  const [isPending, startTransition] = useTransition()
  const [loadingSection, setLoadingSection] = useState<string | null>(null)

  const handleToggle = async (sectionId: string, currentValue: boolean) => {
    if (sectionId === "users") return

    setLoadingSection(sectionId)
    const newValue = !currentValue

    setLocalPermissions(prev => ({
      ...prev,
      [sectionId]: newValue
    }))

    startTransition(async () => {
      const result = await updateRolePermission(role, sectionId, newValue)
      
      if (result.error) {
        setLocalPermissions(prev => ({
          ...prev,
          [sectionId]: currentValue
        }))
        toast.error(result.error)
      } else {
        toast.success(`Permission updated for ${sectionId}`)
      }
      setLoadingSection(null)
    })
  }

  const groupedSections = {
    inventory: sections.filter(s => ["cars", "yachts", "houses", "jets", "for-sale"].includes(s.id)),
    tours: sections.filter(s => ["tour-routes", "tour-addons"].includes(s.id)),
    repair: sections.filter(s => s.id.startsWith("repair-")),
    content: sections.filter(s => ["blog", "home-page"].includes(s.id)),
    system: sections.filter(s => ["dashboard", "services", "users", "audit", "import"].includes(s.id)),
  }

  const renderSection = (section: Section) => {
    const isUsers = section.id === "users"
    const hasAccess = localPermissions[section.id] ?? (isUsers ? false : true)
    const isLoading = loadingSection === section.id

    return (
      <div 
        key={section.id}
        className={`flex items-center justify-between p-3 rounded-lg border ${
          isUsers 
            ? "bg-gray-900/50 border-gray-700 opacity-60" 
            : hasAccess 
              ? "bg-green-500/5 border-green-500/20" 
              : "bg-red-500/5 border-red-500/20"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded flex items-center justify-center ${
            isUsers ? "bg-gray-700" : hasAccess ? "bg-green-500/20" : "bg-red-500/20"
          }`}>
            {isUsers ? (
              <Lock className="h-4 w-4 text-gray-400" />
            ) : hasAccess ? (
              <Check className="h-4 w-4 text-green-400" />
            ) : (
              <X className="h-4 w-4 text-red-400" />
            )}
          </div>
          <div>
            <Label className={`font-medium ${isUsers ? "text-gray-500" : "text-white"}`}>
              {section.name}
            </Label>
            <p className="text-xs text-gray-500">{section.description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {isUsers ? (
            <Badge className="bg-gray-700 text-gray-400 border-gray-600">
              Super Admin Only
            </Badge>
          ) : (
            <>
              <Badge className={hasAccess 
                ? "bg-green-500/10 text-green-400 border-green-500/50" 
                : "bg-red-500/10 text-red-400 border-red-500/50"
              }>
                {hasAccess ? "Allowed" : "Denied"}
              </Badge>
              <Switch
                checked={hasAccess}
                onCheckedChange={() => handleToggle(section.id, hasAccess)}
                disabled={isPending || isLoading}
                className="data-[state=checked]:bg-green-500"
              />
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-[#ECAC36] uppercase tracking-wide">Inventory</h4>
        <div className="space-y-2">
          {groupedSections.inventory.map(renderSection)}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-[#ECAC36] uppercase tracking-wide">Tours</h4>
        <div className="space-y-2">
          {groupedSections.tours.map(renderSection)}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-[#ECAC36] uppercase tracking-wide">Repair Shop</h4>
        <div className="space-y-2">
          {groupedSections.repair.map(renderSection)}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-[#ECAC36] uppercase tracking-wide">Content</h4>
        <div className="space-y-2">
          {groupedSections.content.map(renderSection)}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-[#ECAC36] uppercase tracking-wide">System</h4>
        <div className="space-y-2">
          {groupedSections.system.map(renderSection)}
        </div>
      </div>
    </div>
  )
}

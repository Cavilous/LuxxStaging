import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Shield, ShieldAlert, Settings } from "lucide-react"
import { getCurrentUser } from "@/lib/auth-helpers"
import { isSuperAdmin } from "@/lib/auth-utils"
import { redirect } from "next/navigation"
import { getAllRolePermissions, getUserAccessibleSections } from "@/lib/role-permissions-actions"
import { CMS_SECTIONS } from "@/lib/cms-sections"
import { RolePermissionsTable } from "@/components/admin/role-permissions-table"

export const dynamic = 'force-dynamic'

export default async function RoleSettingsPage() {
  const currentUser = await getCurrentUser()
  const accessibleSections = await getUserAccessibleSections()
  
  if (!currentUser) {
    redirect("/admin/login")
  }
  
  if (!isSuperAdmin(currentUser)) {
    return (
      <AdminLayout 
        user={{ email: currentUser.email, role: currentUser.role }}
        accessibleSections={accessibleSections}
      >
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <ShieldAlert className="h-16 w-16 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400 text-center max-w-md">
            You do not have permission to access role settings. 
            Only super administrators can manage role permissions.
          </p>
        </div>
      </AdminLayout>
    )
  }

  const result = await getAllRolePermissions()
  const permissions = result.success ? result.data : { admin: {} }

  return (
    <AdminLayout 
      user={{ email: currentUser.email, role: currentUser.role }}
      accessibleSections={accessibleSections}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Role Settings</h1>
            <p className="text-gray-400">Configure which CMS sections each role can access</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/50 rounded-lg">
            <Shield className="h-5 w-5 text-purple-400" />
            <span className="text-purple-400 text-sm font-medium">Super Admin Only</span>
          </div>
        </div>

        <div className="grid gap-6">
          <Card className="bg-[#111111] border-[#333333]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-white">Super Admin</CardTitle>
                  <CardDescription className="text-gray-400">
                    Full access to all CMS sections. Permissions cannot be modified.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {CMS_SECTIONS.map((section) => (
                  <div key={section.id} className="flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/30 rounded text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-green-400">{section.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#111111] border-[#333333]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Settings className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-white">Admin</CardTitle>
                  <CardDescription className="text-gray-400">
                    Configure which sections admin users can access. Users section is always restricted.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <RolePermissionsTable 
                role="admin"
                sections={CMS_SECTIONS}
                permissions={permissions?.admin || {}}
              />
            </CardContent>
          </Card>
        </div>

        <Card className="bg-[#111111] border-[#333333]">
          <CardHeader>
            <CardTitle className="text-white text-lg">Permission Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-400">
            <p>
              <span className="text-[#ECAC36] font-medium">Users Section:</span> Always restricted to super admins only. This cannot be changed.
            </p>
            <p>
              <span className="text-[#ECAC36] font-medium">Default Behavior:</span> When no permission is set for a section, admins have access by default (except Users).
            </p>
            <p>
              <span className="text-[#ECAC36] font-medium">Changes Take Effect:</span> Permission changes apply immediately when users navigate to a new page.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

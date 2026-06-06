import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users as UsersIcon, Shield, ShieldAlert } from "lucide-react"
import { db } from "@/lib/db"
import { adminUsers } from "@/lib/db/schema"
import { desc } from "drizzle-orm"
import { AddUserDialog } from "@/components/admin/add-user-dialog"
import { UserActions } from "@/components/admin/user-actions"
import { getAdminRoleLabel, normalizeAdminRole } from "@/lib/auth-utils"
import { redirect } from "next/navigation"
import { canUseDemoSafeAdminAccess, getDemoSafeAccessibleSections, getDemoSafeCurrentUser, isDemoAdminUser } from "../demo-safe-admin"

export const dynamic = 'force-dynamic'

function getRoleAvatarClass(role: string) {
  switch (normalizeAdminRole(role)) {
    case "super_admin":
      return "bg-purple-500/20 text-purple-400"
    case "admin":
      return "bg-blue-500/20 text-blue-400"
    case "marketing":
      return "bg-rose-500/20 text-rose-400"
    case "ops":
    default:
      return "bg-[#ECAC36]/20 text-[#ECAC36]"
  }
}

function getRoleBadgeClass(role: string) {
  switch (normalizeAdminRole(role)) {
    case "super_admin":
      return "bg-purple-500/10 text-purple-400 border-purple-500/50"
    case "admin":
      return "bg-blue-500/10 text-blue-400 border-blue-500/50"
    case "marketing":
      return "bg-rose-500/10 text-rose-400 border-rose-500/50"
    case "ops":
      return "bg-[#ECAC36]/10 text-[#ECAC36] border-[#ECAC36]/50"
    default:
      return "bg-gray-500/10 text-gray-400 border-gray-500/50"
  }
}

export default async function UsersPage() {
  const [currentUser, accessibleSections] = await Promise.all([
    getDemoSafeCurrentUser(),
    getDemoSafeAccessibleSections(),
  ])
  
  if (!currentUser) {
    redirect("/admin/login")
  }
  
  if (!canUseDemoSafeAdminAccess(currentUser)) {
    return (
      <AdminLayout user={{ email: currentUser.email, role: currentUser.role }} accessibleSections={accessibleSections}>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <ShieldAlert className="h-16 w-16 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400 text-center max-w-md">
            You do not have permission to access user management. 
            Only super administrators can manage users.
          </p>
        </div>
      </AdminLayout>
    )
  }

  let users: any[] = []
  try {
    users = await db
      .select()
      .from(adminUsers)
      .orderBy(desc(adminUsers.createdAt))
  } catch (error) {
    console.error("Error loading admin users:", error)
  }

  if (isDemoAdminUser(currentUser) && !users.some((user) => user.id === currentUser.userId)) {
    users = [
      {
        id: currentUser.userId,
        name: currentUser.name ?? "Demo Admin",
        email: currentUser.email,
        role: currentUser.role,
        isActive: true,
        lastLoginAt: null,
        createdAt: new Date(),
      },
      ...users,
    ]
  }

  return (
    <AdminLayout user={{ email: currentUser.email, role: currentUser.role }} accessibleSections={accessibleSections}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Team Users</h1>
            <p className="text-gray-400">Manage team login accounts, roles, and active status</p>
          </div>
          <AddUserDialog />
        </div>

        <Card className="bg-[#111111] border-[#333333] cut-corner">
          <CardHeader>
            <CardTitle className="text-white">Users ({users.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {!users?.length ? (
              <div className="text-center py-12">
                <UsersIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No users found</h3>
                <p className="text-gray-400 mb-6">Add team members to manage operational workflows.</p>
                <AddUserDialog />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#333333]">
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">User</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Email</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Role</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Last Login</th>
                      <th className="text-right py-3 px-4 text-gray-300 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-[#333333] hover:bg-[#0A0A0A]">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getRoleAvatarClass(user.role)}`}>
                              <Shield className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-medium text-white">{user.name || 'Unnamed User'}</div>
                              {user.id === currentUser.userId && (
                                <span className="text-xs text-[#ECAC36]">(You)</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-300">{user.email}</td>
                        <td className="py-4 px-4">
                          <Badge className={getRoleBadgeClass(user.role)}>
                            {getAdminRoleLabel(user.role)}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={
                            user.isActive
                              ? "bg-green-500/10 text-green-400 border-green-500/50"
                              : "bg-red-500/10 text-red-400 border-red-500/50"
                          }>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-gray-400">
                          {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}
                        </td>
                        <td className="py-4 px-4">
                          <UserActions 
                            user={{
                              id: user.id,
                              name: user.name,
                              email: user.email,
                              role: user.role,
                              isActive: user.isActive,
                            }} 
                            isCurrentUser={user.id === currentUser.userId}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

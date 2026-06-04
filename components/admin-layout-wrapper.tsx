import { getCurrentUser } from "@/lib/auth-helpers"
import { getUserAccessibleSections } from "@/lib/role-permissions-actions"
import AdminLayout from "./admin-layout"

interface AdminLayoutWrapperProps {
  children: React.ReactNode
}

export default async function AdminLayoutWrapper({ children }: AdminLayoutWrapperProps) {
  const currentUser = await getCurrentUser()
  const accessibleSections = await getUserAccessibleSections()
  
  return (
    <AdminLayout 
      user={currentUser ? { email: currentUser.email, role: currentUser.role } : null}
      accessibleSections={accessibleSections}
    >
      {children}
    </AdminLayout>
  )
}

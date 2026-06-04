import AdminLayout from "@/components/admin-layout"
import { getCurrentUser } from "@/lib/auth-helpers"
import { isSuperAdmin } from "@/lib/auth-utils"
import { redirect } from "next/navigation"
import { ShieldAlert } from "lucide-react"
import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard"

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const currentUser = await getCurrentUser()
  
  if (!currentUser) {
    redirect("/admin/login")
  }
  
  if (!isSuperAdmin(currentUser)) {
    return (
      <AdminLayout user={{ email: currentUser.email, role: currentUser.role }}>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <ShieldAlert className="h-16 w-16 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400 text-center max-w-md">
            You do not have permission to access analytics. 
            Only super administrators can view analytics data.
          </p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout user={{ email: currentUser.email, role: currentUser.role }}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-gray-400">Track call events and form submissions</p>
        </div>
        
        <AnalyticsDashboard />
      </div>
    </AdminLayout>
  )
}

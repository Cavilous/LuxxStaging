import AdminLayout from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Filter } from "lucide-react"
import { db } from "@/lib/db"
import { auditLogs } from "@/lib/db/schema"
import { desc } from "drizzle-orm"
import { getDemoSafeAccessibleSections, getDemoSafeCurrentUser } from "../demo-safe-admin"

export const dynamic = 'force-dynamic'

export default async function AuditLogsPage() {
  const [currentUser, accessibleSections] = await Promise.all([
    getDemoSafeCurrentUser(),
    getDemoSafeAccessibleSections(),
  ])

  let logs: any[] = []
  try {
    logs = await db
      .select()
      .from(auditLogs)
      .orderBy(desc(auditLogs.createdAt))
      .limit(100)
  } catch (error) {
    console.error("Error loading audit logs:", error)
  }

  return (
    <AdminLayout
      user={currentUser ? { email: currentUser.email, role: currentUser.role } : null}
      accessibleSections={accessibleSections}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Audit Logs</h1>
            <p className="text-gray-400">System activity and change history</p>
          </div>
          <Button className="bg-[#111111] hover:bg-[#1A1A1A] border border-[#333333] text-white cut-corner">
            <Filter className="h-4 w-4 mr-2" />
            Filter Logs
          </Button>
        </div>

        {/* Filters */}
        <Card className="bg-[#111111] border-[#333333] cut-corner">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-3">
              <div className="flex-1 min-w-[200px]">
                <select className="w-full bg-[#0A0A0A] border border-[#333333] rounded px-3 py-2 text-sm text-white">
                  <option>All Actions</option>
                  <option>Created</option>
                  <option>Updated</option>
                  <option>Deleted</option>
                </select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <select className="w-full bg-[#0A0A0A] border border-[#333333] rounded px-3 py-2 text-sm text-white">
                  <option>All Resources</option>
                  <option>Cars</option>
                  <option>Yachts</option>
                  <option>Houses</option>
                  <option>Jets</option>
                  <option>Users</option>
                </select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <input 
                  type="date" 
                  className="w-full bg-[#0A0A0A] border border-[#333333] rounded px-3 py-2 text-sm text-white"
                  placeholder="Filter by date"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audit Logs Table */}
        <Card className="bg-[#111111] border-[#333333] cut-corner">
          <CardHeader>
            <CardTitle className="text-white">Activity Log ({logs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {!logs?.length ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No audit logs recorded yet</h3>
                <p className="text-gray-400 mb-6">
                  System activities and changes will be tracked here automatically.
                </p>
                <div className="bg-[#0A0A0A] border border-[#333333] rounded-lg p-6 max-w-2xl mx-auto text-left">
                  <h4 className="text-sm font-semibold text-[#ECAC36] mb-3">What Gets Logged:</h4>
                  <ul className="text-sm text-gray-400 space-y-2">
                    <li>• User login and logout activities</li>
                    <li>• Inventory item creation, updates, and deletions</li>
                    <li>• User account changes and permissions</li>
                    <li>• Settings and configuration updates</li>
                    <li>• Important system actions and changes</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#333333]">
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Timestamp</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">User</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Action</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Resource</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id} className="border-b border-[#333333] hover:bg-[#0A0A0A]">
                        <td className="py-4 px-4 text-gray-400 text-sm">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td className="py-4 px-4 text-white">
                          {log.userEmail || 'System'}
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={
                            log.action === 'created' || log.action === 'insert'
                              ? "bg-green-500/10 text-green-400 border-green-500/50"
                              : log.action === 'updated' || log.action === 'update'
                              ? "bg-blue-500/10 text-blue-400 border-blue-500/50"
                              : "bg-red-500/10 text-red-400 border-red-500/50"
                          }>
                            {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <div className="text-white font-medium">{log.tableName}</div>
                            <div className="text-xs text-gray-500">{log.recordId.slice(0, 8)}...</div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-400 text-sm">
                          {log.ipAddress && (
                            <div>IP: {log.ipAddress}</div>
                          )}
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

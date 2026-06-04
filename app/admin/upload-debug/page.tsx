import { db } from "@/lib/db"
import { uploadLogs, adminUsers } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"
import { cookies } from "next/headers"
import * as jwt from "jsonwebtoken"
import { redirect } from "next/navigation"
import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, CheckCircle, XCircle, Clock, FileImage, AlertTriangle } from "lucide-react"

export const dynamic = 'force-dynamic'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

async function getAdminUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_session')?.value
  
  if (!token) return null
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string }
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.email, decoded.email)).limit(1)
    return user
  } catch {
    return null
  }
}

export default async function UploadDebugPage() {
  const user = await getAdminUser()
  
  if (!user) {
    redirect("/admin/login")
  }
  
  if (user.role !== 'superadmin') {
    redirect("/admin?error=unauthorized")
  }
  
  const logs = await db.select()
    .from(uploadLogs)
    .orderBy(desc(uploadLogs.createdAt))
    .limit(50)
  
  const successCount = logs.filter(l => l.status === 'success').length
  const errorCount = logs.filter(l => l.status === 'error').length
  const totalSize = logs.reduce((acc, l) => acc + (l.fileSize || 0), 0)
  const avgDuration = logs.length > 0 
    ? Math.round(logs.reduce((acc, l) => acc + (l.durationMs || 0), 0) / logs.length)
    : 0

  return (
    <AdminLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Upload Debug Panel</h1>
          <p className="text-gray-400">Monitor and debug image upload attempts</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-[#111111] border-[#333333]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{successCount}</p>
                  <p className="text-sm text-gray-400">Successful</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#111111] border-[#333333]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <XCircle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{errorCount}</p>
                  <p className="text-sm text-gray-400">Failed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#111111] border-[#333333]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <FileImage className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{(totalSize / 1024 / 1024).toFixed(1)}MB</p>
                  <p className="text-sm text-gray-400">Total Uploaded</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#111111] border-[#333333]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{avgDuration}ms</p>
                  <p className="text-sm text-gray-400">Avg Duration</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-[#111111] border-[#333333]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Recent Upload Attempts ({logs.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {logs.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No upload attempts logged yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#333333]">
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">File</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Size</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Duration</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Context</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">User</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id} className="border-b border-[#333333] hover:bg-[#0A0A0A]">
                        <td className="py-4 px-4">
                          {log.status === 'success' ? (
                            <Badge className="bg-green-500/10 text-green-400 border-green-500/50">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Success
                            </Badge>
                          ) : (
                            <Badge className="bg-red-500/10 text-red-400 border-red-500/50" title={log.errorMessage || ''}>
                              <XCircle className="h-3 w-3 mr-1" />
                              {log.errorCode || 'Error'}
                            </Badge>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="max-w-[200px]">
                            <p className="text-white truncate" title={log.fileName}>{log.fileName}</p>
                            <p className="text-xs text-gray-500">{log.fileType}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-300">
                          {log.fileSize > 0 ? `${(log.fileSize / 1024).toFixed(0)}KB` : '-'}
                        </td>
                        <td className="py-4 px-4 text-gray-300">
                          {log.durationMs ? `${log.durationMs}ms` : '-'}
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant="outline" className="border-[#333333] text-gray-400">
                            {log.uploadContext || 'unknown'}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-gray-400 text-sm">
                          {log.userEmail || '-'}
                        </td>
                        <td className="py-4 px-4 text-gray-400 text-sm whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleString('en-US', { 
                            timeZone: 'America/New_York',
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {errorCount > 0 && (
              <div className="mt-6 p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-400">Recent Errors</h4>
                    <div className="mt-2 space-y-2">
                      {logs.filter(l => l.status === 'error').slice(0, 5).map((log) => (
                        <div key={log.id} className="text-sm text-gray-400">
                          <span className="text-red-400">{log.errorCode}:</span> {log.errorMessage || 'Unknown error'} 
                          <span className="text-gray-500"> ({log.fileName})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

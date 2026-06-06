import { redirect } from "next/navigation"
import { and, asc, desc, eq, gte, inArray, lt, sql } from "drizzle-orm"
import AdminLayout from "@/components/admin-layout"
import { TaskWorkflowClient } from "@/components/admin/task-workflow-client"
import { db } from "@/lib/db"
import { adminUsers, opsTasks } from "@/lib/db/schema"
import { getCurrentUser } from "@/lib/auth-helpers"
import { canUserAccessSection } from "@/lib/role-permissions-actions"
import { ensureOpsTaskStorage } from "@/lib/ops-task-storage"
import { getDemoSafeAccessibleSections, isDemoAdminUser } from "../demo-safe-admin"

export const dynamic = "force-dynamic"

type TaskSearchParams = {
  status?: string
  type?: string
  assignee?: string
}

type OpsTaskRow = typeof opsTasks.$inferSelect
type ActiveAdminRow = {
  id: string
  email: string
  name: string | null
  role: string
}
type CountRow = { count: number }

export default async function AdminTasksPage({
  searchParams,
}: {
  searchParams: Promise<TaskSearchParams>
}) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/admin/login")
  }

  const [accessibleSections, canAccessTasks, resolvedSearchParams] = await Promise.all([
    getDemoSafeAccessibleSections(),
    canUserAccessSection("tasks").catch((error) => {
      console.error("Error checking task access:", error)
      return false
    }),
    searchParams,
  ])

  if (!canAccessTasks && !isDemoAdminUser(currentUser)) {
    redirect("/admin")
  }

  let schemaWarning: string | null = null
  try {
    await ensureOpsTaskStorage()
  } catch (error) {
    console.error("Error preparing ops task storage:", error)
    schemaWarning = "Task storage is not active yet. Apply scripts/016_create_ops_tasks.sql to the staging database to enable saving daily tasks and social outreach."
  }

  const { status, type, assignee } = resolvedSearchParams
  const conditions = []

  if (status && status !== "all") {
    conditions.push(eq(opsTasks.status, status))
  }

  if (type && type !== "all") {
    conditions.push(eq(opsTasks.taskType, type))
  }

  if (assignee && assignee !== "all") {
    conditions.push(eq(opsTasks.assignedTo, assignee === "me" ? currentUser.userId : assignee))
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const tomorrowStart = new Date(todayStart)
  tomorrowStart.setDate(todayStart.getDate() + 1)

  let activeAdmins: ActiveAdminRow[] = []
  let taskRows: OpsTaskRow[] = []
  let dueTodayResult: CountRow[] = [{ count: 0 }]
  let openResult: CountRow[] = [{ count: 0 }]
  let completedResult: CountRow[] = [{ count: 0 }]
  let socialResult: CountRow[] = [{ count: 0 }]
  let myOpenResult: CountRow[] = [{ count: 0 }]

  try {
    activeAdmins = await db
      .select({
        id: adminUsers.id,
        email: adminUsers.email,
        name: adminUsers.name,
        role: adminUsers.role,
      })
      .from(adminUsers)
      .where(eq(adminUsers.isActive, true))
      .orderBy(asc(adminUsers.name), asc(adminUsers.email))
  } catch (error) {
    console.error("Error loading task assignees:", error)
  }

  try {
    ;[
      taskRows,
      dueTodayResult,
      openResult,
      completedResult,
      socialResult,
      myOpenResult,
    ] = await Promise.all([
      db
        .select()
        .from(opsTasks)
        .where(whereClause)
        .orderBy(
          sql`case when ${opsTasks.status} = 'completed' then 1 else 0 end`,
          sql`${opsTasks.dueDate} asc nulls last`,
          desc(opsTasks.createdAt)
        )
        .limit(120),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(opsTasks)
        .where(and(
          gte(opsTasks.dueDate, todayStart),
          lt(opsTasks.dueDate, tomorrowStart),
          inArray(opsTasks.status, ["open", "in_progress"])
        )),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(opsTasks)
        .where(inArray(opsTasks.status, ["open", "in_progress"])),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(opsTasks)
        .where(eq(opsTasks.status, "completed")),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(opsTasks)
        .where(eq(opsTasks.taskType, "social_outreach")),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(opsTasks)
        .where(and(
          eq(opsTasks.assignedTo, currentUser.userId),
          inArray(opsTasks.status, ["open", "in_progress"])
        )),
    ])
  } catch (error) {
    console.error("Error loading ops tasks. Apply scripts/016_create_ops_tasks.sql to enable task storage:", error)
    schemaWarning = "Task storage is not active yet. Apply scripts/016_create_ops_tasks.sql to the staging database to enable saving daily tasks and social outreach."
  }

  const adminById = new Map(activeAdmins.map((admin) => [admin.id, admin]))
  const currentUserOption = adminById.get(currentUser.userId)

  const tasks = taskRows.map((task) => {
    const assigneeRecord = task.assignedTo ? adminById.get(task.assignedTo) : undefined
    const creatorRecord = task.createdBy ? adminById.get(task.createdBy) : undefined

    return {
      id: task.id,
      title: task.title,
      description: task.description,
      taskType: task.taskType,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate?.toISOString() ?? null,
      assignedTo: task.assignedTo,
      assignedToName: assigneeRecord?.name || assigneeRecord?.email || null,
      createdBy: task.createdBy,
      createdByName: creatorRecord?.name || creatorRecord?.email || null,
      targetName: task.targetName,
      targetUrl: task.targetUrl,
      targetCategory: task.targetCategory,
      platform: task.platform,
      proofUrl: task.proofUrl,
      notes: task.notes,
      completedAt: task.completedAt?.toISOString() ?? null,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    }
  })

  const admins = activeAdmins.map((admin) => ({
    id: admin.id,
    label: admin.name || admin.email,
    email: admin.email,
    role: admin.role,
  }))

  return (
    <AdminLayout
      user={{ email: currentUser.email, role: currentUser.role }}
      accessibleSections={accessibleSections}
    >
      <TaskWorkflowClient
        tasks={tasks}
        admins={admins}
        currentUser={{
          id: currentUser.userId,
          email: currentUser.email,
          label: currentUserOption?.name || currentUser.email,
        }}
        stats={{
          dueToday: dueTodayResult[0]?.count || 0,
          open: openResult[0]?.count || 0,
          completed: completedResult[0]?.count || 0,
          socialOutreach: socialResult[0]?.count || 0,
          myOpen: myOpenResult[0]?.count || 0,
        }}
        activeFilters={{
          status: status || "all",
          type: type || "all",
          assignee: assignee || "all",
        }}
        schemaWarning={schemaWarning}
      />
    </AdminLayout>
  )
}

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
import { buildMeganChecklistItems, extractTaskNotes, MEGAN_DAILY_OUTREACH_TITLE } from "@/lib/ops-task-checklist"

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
type DailyTrackerDay = {
  dateKey: string
  label: string
  completed: boolean
}
type DailyInstagramTracker = {
  title: string
  assignedToLabel: string
  todayTaskId: string | null
  todayComplete: boolean
  completedDaysLast14: number
  currentStreak: number
  days: DailyTrackerDay[]
}

const MEGAN_DAILY_OUTREACH_DESCRIPTION =
  "Daily Instagram checklist: post 1 Luxx Miami IG Story, then leave 5 thoughtful comments on Miami-based IG pages. Focus on restaurants, nightlife, real estate, concierge, yacht, auto, and luxury lifestyle accounts. Add proof links or screenshot notes before marking complete."

function startOfLocalDay(date = new Date()) {
  const day = new Date(date)
  day.setHours(0, 0, 0, 0)
  return day
}

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

function formatTrackerLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date)
}

function findMeganAdmin(activeAdmins: ActiveAdminRow[]) {
  return activeAdmins.find((admin) => {
    const haystack = `${admin.name || ""} ${admin.email || ""}`.toLowerCase()
    return haystack.includes("megan")
  })
}

function isMeganDailyOutreachTask(task: Pick<OpsTaskRow, "title">) {
  return task.title === MEGAN_DAILY_OUTREACH_TITLE
}

async function ensureMeganDailyOutreachTask(assignedTo: string | null) {
  const todayStart = startOfLocalDay()
  const tomorrowStart = addDays(todayStart, 1)

  const existingToday = await db
    .select({ id: opsTasks.id })
    .from(opsTasks)
    .where(and(
      eq(opsTasks.title, MEGAN_DAILY_OUTREACH_TITLE),
      gte(opsTasks.dueDate, todayStart),
      lt(opsTasks.dueDate, tomorrowStart)
    ))
    .limit(1)

  if (existingToday.length > 0) {
    return
  }

  await db.insert(opsTasks).values({
    title: MEGAN_DAILY_OUTREACH_TITLE,
    description: MEGAN_DAILY_OUTREACH_DESCRIPTION,
    taskType: "social_outreach",
    status: "open",
    priority: "high",
    dueDate: new Date(todayStart.getTime() + 12 * 60 * 60 * 1000),
    assignedTo,
    createdBy: assignedTo,
    targetName: "Miami-based Instagram pages",
    targetCategory: "Miami social outreach",
    platform: "Instagram",
    notes: null,
  })
}

async function getDailyInstagramTracker(assignedToLabel: string): Promise<DailyInstagramTracker> {
  const todayStart = startOfLocalDay()
  const rangeStart = addDays(todayStart, -13)

  let rows: Pick<OpsTaskRow, "id" | "dueDate" | "status" | "completedAt">[] = []
  try {
    rows = await db
      .select({
        id: opsTasks.id,
        dueDate: opsTasks.dueDate,
        status: opsTasks.status,
        completedAt: opsTasks.completedAt,
      })
      .from(opsTasks)
      .where(and(
        eq(opsTasks.title, MEGAN_DAILY_OUTREACH_TITLE),
        gte(opsTasks.dueDate, rangeStart)
      ))
  } catch (error) {
    console.error("Error loading Megan daily Instagram tracker:", error)
  }

  const completedByDate = new Map<string, boolean>()
  let todayTaskId: string | null = null
  const todayKey = dateKey(todayStart)
  for (const row of rows) {
    if (!row.dueDate) continue
    const key = dateKey(startOfLocalDay(row.dueDate))
    if (key === todayKey) todayTaskId = row.id
    completedByDate.set(key, completedByDate.get(key) || row.status === "completed" || !!row.completedAt)
  }

  const days = Array.from({ length: 14 }, (_, index) => {
    const day = addDays(rangeStart, index)
    const key = dateKey(day)
    return {
      dateKey: key,
      label: formatTrackerLabel(day),
      completed: completedByDate.get(key) || false,
    }
  })

  let currentStreak = 0
  for (let index = days.length - 1; index >= 0; index--) {
    if (!days[index].completed) break
    currentStreak++
  }

  return {
    title: MEGAN_DAILY_OUTREACH_TITLE,
    assignedToLabel,
    todayTaskId,
    todayComplete: days[days.length - 1]?.completed || false,
    completedDaysLast14: days.filter((day) => day.completed).length,
    currentStreak,
    days,
  }
}

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
    schemaWarning = "Task storage is still being prepared. Refresh once, then try again if this appears during the demo."
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

  const meganAdmin = findMeganAdmin(activeAdmins)
  const meganAssignedToLabel = meganAdmin?.name || meganAdmin?.email || "Megan"

  if (!schemaWarning) {
    try {
      await ensureMeganDailyOutreachTask(meganAdmin?.id || null)
    } catch (error) {
      console.error("Error ensuring Megan daily Instagram task:", error)
      schemaWarning = "Daily task storage is active, but the Megan Instagram task could not be refreshed automatically."
    }
  }

  const dailyInstagramTracker = await getDailyInstagramTracker(meganAssignedToLabel)

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
          inArray(opsTasks.status, ["open", "in_progress", "needs_proof"])
        )),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(opsTasks)
        .where(inArray(opsTasks.status, ["open", "in_progress", "needs_proof"])),
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
          inArray(opsTasks.status, ["open", "in_progress", "needs_proof"])
        )),
    ])

  } catch (error) {
    console.error("Error loading ops tasks:", error)
    schemaWarning = "Task storage is still being prepared. Refresh once, then try again if this appears during the demo."
  }

  const adminById = new Map(activeAdmins.map((admin) => [admin.id, admin]))
  const currentUserOption = adminById.get(currentUser.userId)

  const tasks = taskRows.map((task) => {
    const assigneeRecord = task.assignedTo ? adminById.get(task.assignedTo) : undefined
    const creatorRecord = task.createdBy ? adminById.get(task.createdBy) : undefined
    const parsedNotes = extractTaskNotes(task.notes)
    const isMeganTask = isMeganDailyOutreachTask(task)

    return {
      id: task.id,
      title: task.title,
      description: task.description,
      taskType: task.taskType,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate?.toISOString() ?? null,
      assignedTo: task.assignedTo,
      assignedToName: assigneeRecord?.name || assigneeRecord?.email || (isMeganDailyOutreachTask(task) ? meganAssignedToLabel : null),
      createdBy: task.createdBy,
      createdByName: creatorRecord?.name || creatorRecord?.email || null,
      targetName: task.targetName,
      targetUrl: task.targetUrl,
      targetCategory: task.targetCategory,
      platform: task.platform,
      proofUrl: task.proofUrl,
      notes: parsedNotes.notes,
      checklistItems: isMeganTask ? buildMeganChecklistItems(task.id, parsedNotes.checklistState) : [],
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
        dailyInstagramTracker={dailyInstagramTracker}
      />
    </AdminLayout>
  )
}

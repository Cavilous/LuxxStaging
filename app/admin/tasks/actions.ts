"use server"

import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { opsTasks } from "@/lib/db/schema"
import { getCurrentUser } from "@/lib/auth-helpers"
import { canUserAccessSection } from "@/lib/role-permissions-actions"
import { ensureOpsTaskStorage } from "@/lib/ops-task-storage"

const TASK_TYPES = ["daily", "social_outreach"] as const
const TASK_STATUSES = ["open", "in_progress", "completed"] as const
const TASK_PRIORITIES = ["low", "normal", "high", "urgent"] as const

type TaskType = (typeof TASK_TYPES)[number]
type TaskStatus = (typeof TASK_STATUSES)[number]
type TaskPriority = (typeof TASK_PRIORITIES)[number]

type ActionResult = {
  success?: boolean
  error?: string
}

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === "string" ? value.trim() : ""
}

function getNullableFormString(formData: FormData, key: string) {
  const value = getFormString(formData, key)
  return value.length > 0 ? value : null
}

function parseDateInput(value: string) {
  if (!value) return null
  const parsed = new Date(`${value}T12:00:00`)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

async function requireTaskAccess() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return { error: "You must be signed in to manage tasks." }
  }

  const canAccessTasks = await canUserAccessSection("tasks")
  if (!canAccessTasks) {
    return { error: "You do not have access to the tasks section." }
  }

  try {
    await ensureOpsTaskStorage()
  } catch (error) {
    console.error("Error preparing ops task storage:", error)
    return { error: "Task storage is not active yet. Apply the ops task migration and try again." }
  }

  return { currentUser }
}

export async function createOpsTask(formData: FormData): Promise<ActionResult> {
  const auth = await requireTaskAccess()
  if ("error" in auth) return { error: auth.error }

  const title = getFormString(formData, "title")
  if (!title) {
    return { error: "Task title is required." }
  }

  const rawTaskType = getFormString(formData, "taskType")
  const taskType: TaskType = TASK_TYPES.includes(rawTaskType as TaskType) ? (rawTaskType as TaskType) : "daily"

  const rawStatus = getFormString(formData, "status")
  const status: TaskStatus = TASK_STATUSES.includes(rawStatus as TaskStatus) ? (rawStatus as TaskStatus) : "open"

  const rawPriority = getFormString(formData, "priority")
  const priority: TaskPriority = TASK_PRIORITIES.includes(rawPriority as TaskPriority) ? (rawPriority as TaskPriority) : "normal"

  const assignedTo = getNullableFormString(formData, "assignedTo") || auth.currentUser.userId
  const dueDate = parseDateInput(getFormString(formData, "dueDate"))

  await db.insert(opsTasks).values({
    title,
    description: getNullableFormString(formData, "description"),
    taskType,
    status,
    priority,
    dueDate,
    assignedTo,
    createdBy: auth.currentUser.userId,
    targetName: getNullableFormString(formData, "targetName"),
    targetUrl: getNullableFormString(formData, "targetUrl"),
    targetCategory: getNullableFormString(formData, "targetCategory"),
    platform: getNullableFormString(formData, "platform"),
    proofUrl: getNullableFormString(formData, "proofUrl"),
    notes: getNullableFormString(formData, "notes"),
    completedAt: status === "completed" ? new Date() : null,
  })

  revalidatePath("/admin/tasks")
  return { success: true }
}

export async function updateTaskStatus(taskId: string, status: string): Promise<ActionResult> {
  const auth = await requireTaskAccess()
  if ("error" in auth) return { error: auth.error }

  if (!taskId) {
    return { error: "Task id is required." }
  }

  if (!TASK_STATUSES.includes(status as TaskStatus)) {
    return { error: "Invalid task status." }
  }

  await db
    .update(opsTasks)
    .set({
      status: status as TaskStatus,
      completedAt: status === "completed" ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(opsTasks.id, taskId))

  revalidatePath("/admin/tasks")
  return { success: true }
}

export async function updateTaskDetails(formData: FormData): Promise<ActionResult> {
  const auth = await requireTaskAccess()
  if ("error" in auth) return { error: auth.error }

  const taskId = getFormString(formData, "taskId")
  if (!taskId) {
    return { error: "Task id is required." }
  }

  await db
    .update(opsTasks)
    .set({
      proofUrl: getNullableFormString(formData, "proofUrl"),
      notes: getNullableFormString(formData, "notes"),
      updatedAt: new Date(),
    })
    .where(eq(opsTasks.id, taskId))

  revalidatePath("/admin/tasks")
  return { success: true }
}

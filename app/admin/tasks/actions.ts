"use server"

import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { opsTasks } from "@/lib/db/schema"
import { getCurrentUser } from "@/lib/auth-helpers"
import { canUserAccessSection } from "@/lib/role-permissions-actions"
import { ensureOpsTaskStorage } from "@/lib/ops-task-storage"
import {
  allMeganChecklistItemsDone,
  extractDelegationNotes,
  extractTaskNotes,
  formatDelegationNotes,
  formatTaskNotes,
  MEGAN_DAILY_CHECKLIST,
  MEGAN_DAILY_OUTREACH_TITLE,
  setChecklistItemState,
} from "@/lib/ops-task-checklist"

const TASK_TYPES = ["daily", "social_outreach"] as const
const TASK_STATUSES = ["open", "in_progress", "needs_proof", "completed"] as const
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
  const ownerName = getNullableFormString(formData, "ownerName")
  const requesterName = getNullableFormString(formData, "requesterName")
  const dueDate = parseDateInput(getFormString(formData, "dueDate"))
  const notes = formatDelegationNotes(getNullableFormString(formData, "notes"), requesterName, ownerName)

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
    notes,
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

  if (status === "completed") {
    const taskRows = await db
      .select({
        title: opsTasks.title,
        taskType: opsTasks.taskType,
        proofUrl: opsTasks.proofUrl,
        notes: opsTasks.notes,
      })
      .from(opsTasks)
      .where(eq(opsTasks.id, taskId))
      .limit(1)

    const task = taskRows[0]
    if (task?.taskType === "social_outreach") {
      const parsedNotes = extractTaskNotes(task.notes)
      const delegationNotes = extractDelegationNotes(parsedNotes.notes)
      const note = delegationNotes.notes?.trim()
      const hasCompletionUpdate = Boolean(task.proofUrl?.trim() || note)
      if (!hasCompletionUpdate) {
        return { error: "Add a completion update or link before marking social outreach complete." }
      }

      if (task.title === MEGAN_DAILY_OUTREACH_TITLE && !allMeganChecklistItemsDone(parsedNotes.checklistState)) {
        return { error: "Finish Megan's daily checklist before marking the task complete." }
      }
    }
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

  const existingTaskRows = await db
    .select({ notes: opsTasks.notes })
    .from(opsTasks)
    .where(eq(opsTasks.id, taskId))
    .limit(1)
  const existingNotes = extractTaskNotes(existingTaskRows[0]?.notes)
  const existingDelegation = extractDelegationNotes(existingNotes.notes)
  const requesterName = getNullableFormString(formData, "requesterName") || existingDelegation.requestedByName
  const ownerName = getNullableFormString(formData, "ownerName") || existingDelegation.ownerName
  const notes = formatDelegationNotes(getNullableFormString(formData, "notes"), requesterName, ownerName)

  await db
    .update(opsTasks)
    .set({
      proofUrl: getNullableFormString(formData, "proofUrl"),
      notes: formatTaskNotes(notes, existingNotes.checklistState),
      updatedAt: new Date(),
    })
    .where(eq(opsTasks.id, taskId))

  revalidatePath("/admin/tasks")
  return { success: true }
}

export async function updateChecklistItemStatus(itemId: string, isDone: boolean): Promise<ActionResult> {
  const auth = await requireTaskAccess()
  if ("error" in auth) return { error: auth.error }

  if (!itemId) {
    return { error: "Checklist item id is required." }
  }

  const [taskId, indexValue] = itemId.split("::")
  const itemIndex = Number(indexValue)
  const label = MEGAN_DAILY_CHECKLIST[itemIndex]

  if (!taskId || !label) {
    return { error: "Checklist item is invalid." }
  }

  const existingTaskRows = await db
    .select({ notes: opsTasks.notes })
    .from(opsTasks)
    .where(eq(opsTasks.id, taskId))
    .limit(1)
  const existingNotes = extractTaskNotes(existingTaskRows[0]?.notes)
  const nextChecklistState = setChecklistItemState(existingNotes.checklistState, label, isDone)

  await db
    .update(opsTasks)
    .set({
      notes: formatTaskNotes(existingNotes.notes, nextChecklistState),
      updatedAt: new Date(),
    })
    .where(eq(opsTasks.id, taskId))

  revalidatePath("/admin/tasks")
  return { success: true }
}

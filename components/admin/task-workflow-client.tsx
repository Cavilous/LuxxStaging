"use client"

import type { ReactNode } from "react"
import { useEffect, useMemo, useRef, useState, useTransition } from "react"
import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd"
import { useRouter, useSearchParams } from "next/navigation"
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  CircleDot,
  ClipboardCheck,
  Clock3,
  ExternalLink,
  Filter,
  GripVertical,
  Instagram,
  LinkIcon,
  ListChecks,
  MessageSquareText,
  PencilLine,
  Plus,
  Save,
  Sparkles,
  Target,
  UserCheck,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import {
  createOpsTask,
  updateChecklistItemStatus,
  updateTaskDetails,
  updateTaskStatus,
} from "@/app/admin/tasks/actions"

type TaskStatus = "open" | "in_progress" | "needs_proof" | "completed"
type TaskType = "daily" | "social_outreach"
type TaskPriority = "low" | "normal" | "high" | "urgent"

type ChecklistItem = {
  id: string
  label: string
  isDone: boolean
  displayOrder: number
}

export interface TaskWorkflowItem {
  id: string
  title: string
  description: string | null
  taskType: string
  status: string
  priority: string
  dueDate: string | null
  assignedTo: string | null
  assignedToName: string | null
  createdBy: string | null
  createdByName: string | null
  targetName: string | null
  targetUrl: string | null
  targetCategory: string | null
  platform: string | null
  proofUrl: string | null
  notes: string | null
  checklistItems: ChecklistItem[]
  completedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface TaskAdminOption {
  id: string
  label: string
  email: string
  role: string
}

interface DailyInstagramTracker {
  title: string
  assignedToLabel: string
  todayTaskId: string | null
  todayComplete: boolean
  completedDaysLast14: number
  currentStreak: number
  days: {
    dateKey: string
    label: string
    completed: boolean
  }[]
}

interface TaskWorkflowClientProps {
  tasks: TaskWorkflowItem[]
  admins: TaskAdminOption[]
  currentUser: {
    id: string
    email: string
    label: string
  }
  stats: {
    dueToday: number
    open: number
    completed: number
    socialOutreach: number
    myOpen: number
  }
  activeFilters: {
    status: string
    type: string
    assignee: string
  }
  schemaWarning?: string | null
  dailyInstagramTracker?: DailyInstagramTracker
}

type DemoTaskState = {
  status?: string
  proofUrl?: string | null
  notes?: string | null
  checklist?: Record<string, boolean>
  completedAt?: string | null
  updatedAt?: string
}

const DEMO_TASK_STORAGE_KEY = "luxx-demo-task-board-v1"

const BOARD_COLUMNS: {
  status: TaskStatus
  title: string
  description: string
  icon: typeof CircleDot
}[] = [
  { status: "open", title: "To Do", description: "Ready to start", icon: CircleDot },
  { status: "in_progress", title: "Doing", description: "Being worked on", icon: Clock3 },
  { status: "needs_proof", title: "Needs Proof", description: "Save link or note", icon: LinkIcon },
  { status: "completed", title: "Done", description: "Finished and tracked", icon: CheckCircle2 },
]

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "open", label: "To Do" },
  { value: "in_progress", label: "Doing" },
  { value: "needs_proof", label: "Needs Proof" },
  { value: "completed", label: "Done" },
]

const TASK_TYPE_OPTIONS: { value: TaskType; label: string }[] = [
  { value: "daily", label: "Daily task" },
  { value: "social_outreach", label: "Social outreach" },
]

const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
]

const MIAMI_CATEGORIES = [
  "Miami restaurant",
  "Nightclub",
  "Concierge",
  "Yacht broker",
  "Luxury real estate",
  "Exotic car rental",
  "Event planner",
  "Other",
]

const PLATFORM_OPTIONS = ["Instagram", "TikTok", "Google Maps", "Website", "Other"]

const STATUS_LABELS: Record<string, string> = {
  open: "To Do",
  in_progress: "Doing",
  needs_proof: "Needs Proof",
  completed: "Done",
}

const TASK_TYPE_LABELS: Record<string, string> = {
  daily: "Daily",
  social_outreach: "Social outreach",
}

function isDemoTaskId(taskId: string) {
  return taskId.startsWith("demo-")
}

function formatDate(dateValue: string | null) {
  if (!dateValue) return "No due date"
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateValue))
}

function formatShortDateTime(dateValue: string | null) {
  if (!dateValue) return "Not updated yet"
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(dateValue))
}

function getDueState(task: Pick<TaskWorkflowItem, "dueDate" | "status">) {
  if (!task.dueDate || task.status === "completed") return "neutral"

  const dueDate = new Date(task.dueDate)
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const tomorrowStart = new Date(todayStart)
  tomorrowStart.setDate(todayStart.getDate() + 1)

  if (dueDate < todayStart) return "overdue"
  if (dueDate >= todayStart && dueDate < tomorrowStart) return "today"
  return "neutral"
}

function getExternalHref(value: string | null) {
  if (!value) return null
  if (/^https?:\/\//i.test(value)) return value
  if (value.startsWith("@")) return `https://www.instagram.com/${value.slice(1)}`
  if (value.startsWith("www.")) return `https://${value}`
  return null
}

function getTargetHref(task: TaskWorkflowItem) {
  const explicitHref = getExternalHref(task.targetUrl)
  if (explicitHref) return explicitHref

  if (task.platform?.toLowerCase() === "instagram" && task.targetName) {
    const handle = task.targetName.replace(/^@/, "").trim()
    if (handle) return `https://www.instagram.com/${handle}`
  }

  return null
}

function getChecklistProgress(task: TaskWorkflowItem) {
  const total = task.checklistItems.length
  const done = task.checklistItems.filter((item) => item.isDone).length
  return { done, total }
}

function hasProof(task: TaskWorkflowItem) {
  const note = task.notes?.trim()
  return Boolean(task.proofUrl?.trim() || (note && !note.toLowerCase().startsWith("checklist:")))
}

function statusBadgeClass(status: string) {
  switch (status) {
    case "completed":
      return "border-green-500/30 bg-green-500/15 text-green-300"
    case "needs_proof":
      return "border-[#ECAC36]/30 bg-[#ECAC36]/15 text-[#ECAC36]"
    case "in_progress":
      return "border-blue-500/30 bg-blue-500/15 text-blue-300"
    default:
      return "border-zinc-500/20 bg-zinc-500/10 text-zinc-300"
  }
}

function priorityBadgeClass(priority: string) {
  switch (priority) {
    case "urgent":
      return "border-red-500/30 bg-red-500/15 text-red-300"
    case "high":
      return "border-orange-500/30 bg-orange-500/15 text-orange-300"
    case "low":
      return "border-zinc-500/30 bg-zinc-500/15 text-zinc-300"
    default:
      return "border-[#ECAC36]/30 bg-[#ECAC36]/15 text-[#ECAC36]"
  }
}

function SelectField({
  label,
  value,
  onChange,
  children,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  children: ReactNode
}) {
  return (
    <label className="flex flex-col gap-1 text-xs font-medium text-gray-400">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 min-w-[150px] rounded-md border border-[#333333] bg-[#0A0A0A] px-3 text-sm text-white outline-none focus:border-[#ECAC36]"
      >
        {children}
      </select>
    </label>
  )
}

export function TaskWorkflowClient({
  tasks,
  admins,
  currentUser,
  stats,
  activeFilters,
  schemaWarning,
  dailyInstagramTracker,
}: TaskWorkflowClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const formRef = useRef<HTMLFormElement>(null)
  const [taskType, setTaskType] = useState<TaskType>("daily")
  const [createPending, setCreatePending] = useState(false)
  const [createMessage, setCreateMessage] = useState<string | null>(null)
  const [detailsMessage, setDetailsMessage] = useState<string | null>(null)
  const [savingTaskId, setSavingTaskId] = useState<string | null>(null)
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null)
  const [checkingItemId, setCheckingItemId] = useState<string | null>(null)
  const [optimisticStatuses, setOptimisticStatuses] = useState<Record<string, string>>({})
  const [optimisticChecklist, setOptimisticChecklist] = useState<Record<string, boolean>>({})
  const [demoTaskState, setDemoTaskState] = useState<Record<string, DemoTaskState>>({})
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(
    dailyInstagramTracker?.todayTaskId || tasks[0]?.id || null
  )
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    try {
      const rawState = window.localStorage.getItem(DEMO_TASK_STORAGE_KEY)
      if (rawState) {
        setDemoTaskState(JSON.parse(rawState))
      }
    } catch {
      setDemoTaskState({})
    }
  }, [])

  const updateDemoTaskState = (taskId: string, updater: (previous: DemoTaskState) => DemoTaskState) => {
    setDemoTaskState((previous) => {
      const next = {
        ...previous,
        [taskId]: updater(previous[taskId] || {}),
      }
      try {
        window.localStorage.setItem(DEMO_TASK_STORAGE_KEY, JSON.stringify(next))
      } catch {
        // Local demo persistence is best-effort.
      }
      return next
    })
  }

  const displayTasks = useMemo(
    () =>
      tasks.map((task) => {
        const demoState = demoTaskState[task.id]
        return {
          ...task,
          status: demoState?.status || optimisticStatuses[task.id] || task.status,
          proofUrl: demoState?.proofUrl ?? task.proofUrl,
          notes: demoState?.notes ?? task.notes,
          completedAt: demoState?.completedAt ?? task.completedAt,
          updatedAt: demoState?.updatedAt || task.updatedAt,
          checklistItems: task.checklistItems.map((item) => ({
            ...item,
            isDone: demoState?.checklist?.[item.id] ?? optimisticChecklist[item.id] ?? item.isDone,
          })),
        }
      }),
    [demoTaskState, optimisticChecklist, optimisticStatuses, tasks]
  )

  const todayTask = useMemo(() => {
    if (!dailyInstagramTracker) return null
    return (
      displayTasks.find((task) => task.id === dailyInstagramTracker.todayTaskId) ||
      displayTasks.find((task) => task.title === dailyInstagramTracker.title) ||
      null
    )
  }, [dailyInstagramTracker, displayTasks])

  const selectedTask = useMemo(() => {
    return displayTasks.find((task) => task.id === selectedTaskId) || todayTask || displayTasks[0] || null
  }, [displayTasks, selectedTaskId, todayTask])

  const tasksByStatus = useMemo(() => {
    const grouped = new Map<string, TaskWorkflowItem[]>()
    for (const column of BOARD_COLUMNS) {
      grouped.set(column.status, [])
    }

    for (const task of displayTasks) {
      const status = BOARD_COLUMNS.some((column) => column.status === task.status) ? task.status : "open"
      grouped.get(status)?.push(task)
    }

    return grouped
  }, [displayTasks])

  useEffect(() => {
    if (selectedTaskId && displayTasks.some((task) => task.id === selectedTaskId)) return
    setSelectedTaskId(dailyInstagramTracker?.todayTaskId || displayTasks[0]?.id || null)
  }, [dailyInstagramTracker?.todayTaskId, displayTasks, selectedTaskId])

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (!value || value === "all") {
      params.delete(key)
    } else {
      params.set(key, value)
    }

    const query = params.toString()
    router.push(query ? `/admin/tasks?${query}` : "/admin/tasks")
  }

  const handleCreate = async (formData: FormData) => {
    setCreatePending(true)
    setCreateMessage(null)

    const result = await createOpsTask(formData)
    setCreatePending(false)

    if (result.error) {
      setCreateMessage(result.error)
      return
    }

    formRef.current?.reset()
    setTaskType("daily")
    setCreateMessage("Task added.")
    router.refresh()
  }

  const handleStatusChange = (taskId: string, status: string) => {
    if (isDemoTaskId(taskId)) {
      const task = displayTasks.find((item) => item.id === taskId)
      if (task && status === "completed") {
        const progress = getChecklistProgress(task)
        if (!hasProof(task)) {
          setDetailsMessage("Add a proof URL or proof note before marking social outreach complete.")
          return
        }
        if (progress.total > 0 && progress.done < progress.total) {
          setDetailsMessage("Finish Megan's daily checklist before marking the task complete.")
          return
        }
      }

      const now = new Date().toISOString()
      updateDemoTaskState(taskId, (previous) => ({
        ...previous,
        status,
        completedAt: status === "completed" ? now : null,
        updatedAt: now,
      }))
      setDetailsMessage(`Task moved to ${STATUS_LABELS[status] || status}.`)
      return
    }

    const previousStatus =
      optimisticStatuses[taskId] || tasks.find((task) => task.id === taskId)?.status || "open"

    setUpdatingTaskId(taskId)
    setDetailsMessage(null)
    setOptimisticStatuses((previous) => ({ ...previous, [taskId]: status }))

    startTransition(async () => {
      const result = await updateTaskStatus(taskId, status)
      setUpdatingTaskId(null)

      if (result.error) {
        setDetailsMessage(result.error)
        setOptimisticStatuses((previous) => ({ ...previous, [taskId]: previousStatus }))
        return
      }

      router.refresh()
    })
  }

  const handleBoardDragEnd = (result: DropResult) => {
    if (!result.destination) return
    if (result.source.droppableId === result.destination.droppableId) return
    handleStatusChange(result.draggableId, result.destination.droppableId)
  }

  const handleDetailsSave = async (formData: FormData) => {
    const taskId = String(formData.get("taskId") || "")
    setSavingTaskId(taskId)
    setDetailsMessage(null)

    if (isDemoTaskId(taskId)) {
      const proofUrl = String(formData.get("proofUrl") || "").trim() || null
      const notes = String(formData.get("notes") || "").trim() || null
      updateDemoTaskState(taskId, (previous) => ({
        ...previous,
        proofUrl,
        notes,
        updatedAt: new Date().toISOString(),
      }))
      setSavingTaskId(null)
      setDetailsMessage("Task details saved.")
      return
    }

    const result = await updateTaskDetails(formData)
    setSavingTaskId(null)

    if (result.error) {
      setDetailsMessage(result.error)
      return
    }

    setDetailsMessage("Task details saved.")
    router.refresh()
  }

  const handleChecklistChange = (itemId: string, checked: boolean) => {
    const [taskId] = itemId.split("::")
    if (isDemoTaskId(taskId)) {
      setCheckingItemId(itemId)
      updateDemoTaskState(taskId, (previous) => ({
        ...previous,
        checklist: {
          ...(previous.checklist || {}),
          [itemId]: checked,
        },
        updatedAt: new Date().toISOString(),
      }))
      setCheckingItemId(null)
      setDetailsMessage("Checklist updated.")
      return
    }

    setCheckingItemId(itemId)
    setDetailsMessage(null)
    setOptimisticChecklist((previous) => ({ ...previous, [itemId]: checked }))

    startTransition(async () => {
      const result = await updateChecklistItemStatus(itemId, checked)
      setCheckingItemId(null)

      if (result.error) {
        setDetailsMessage(result.error)
        setOptimisticChecklist((previous) => {
          const next = { ...previous }
          delete next[itemId]
          return next
        })
        return
      }

      router.refresh()
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Team Work Board</h1>
          <p className="mt-1 text-sm text-gray-400">
            Daily tasks, social outreach, proof links, and simple status tracking.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => todayTask && setSelectedTaskId(todayTask.id)}
            disabled={!todayTask}
            variant="outline"
            className="border-[#333333] bg-[#0A0A0A] text-gray-200 hover:border-[#ECAC36] hover:text-white cut-corner"
          >
            <Instagram className="h-4 w-4 text-pink-300" />
            Megan Today
          </Button>
          <Button
            onClick={() => updateFilter("assignee", "me")}
            className="bg-[#ECAC36] text-black hover:bg-[#B8860B] cut-corner"
          >
            <UserCheck className="h-4 w-4" />
            My Tasks ({stats.myOpen})
          </Button>
        </div>
      </div>

      {schemaWarning && (
        <Card className="bg-[#1A1206] border-[#ECAC36]/40 cut-corner">
          <CardContent className="flex items-start gap-3 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#ECAC36]" />
            <div>
              <p className="font-semibold text-white">Task board is warming up</p>
              <p className="mt-1 text-sm text-gray-300">{schemaWarning}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card className="bg-[#111111] border-[#333333] cut-corner">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-gray-400">Due Today</p>
              <p className="text-2xl font-bold text-white">{stats.dueToday}</p>
            </div>
            <CalendarClock className="h-5 w-5 text-[#ECAC36]" />
          </CardContent>
        </Card>
        <Card className="bg-[#111111] border-[#333333] cut-corner">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-gray-400">Active</p>
              <p className="text-2xl font-bold text-white">{stats.open}</p>
            </div>
            <CircleDot className="h-5 w-5 text-blue-300" />
          </CardContent>
        </Card>
        <Card className="bg-[#111111] border-[#333333] cut-corner">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-white">{stats.completed}</p>
            </div>
            <CheckCircle2 className="h-5 w-5 text-green-300" />
          </CardContent>
        </Card>
        <Card className="bg-[#111111] border-[#333333] cut-corner">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-gray-400">Outreach</p>
              <p className="text-2xl font-bold text-white">{stats.socialOutreach}</p>
            </div>
            <Instagram className="h-5 w-5 text-pink-300" />
          </CardContent>
        </Card>
      </div>

      {dailyInstagramTracker && (
        <Card className="overflow-hidden border-[#ECAC36]/35 bg-[#111111] cut-corner">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
              <div className="space-y-5 p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="cut-corner border-pink-500/30 bg-pink-500/10 text-pink-200">
                    <Instagram className="mr-1 h-3.5 w-3.5" />
                    Daily Instagram
                  </Badge>
                  <Badge
                    className={cn(
                      "cut-corner",
                      dailyInstagramTracker.todayComplete
                        ? "border-green-500/30 bg-green-500/15 text-green-300"
                        : "border-[#ECAC36]/30 bg-[#ECAC36]/15 text-[#ECAC36]"
                    )}
                  >
                    {dailyInstagramTracker.todayComplete ? "Done today" : "Due today"}
                  </Badge>
                  {todayTask && (
                    <Badge className={cn("cut-corner", statusBadgeClass(todayTask.status))}>
                      {STATUS_LABELS[todayTask.status] || todayTask.status}
                    </Badge>
                  )}
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white">Megan's daily outreach</h2>
                  <p className="mt-1 max-w-3xl text-sm text-gray-400">
                    Post one IG Story, leave five comments on Miami-based pages, then save the proof link or note here.
                  </p>
                </div>

                {todayTask ? (
                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.85fr)]">
                    <div className="rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] p-4">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-white">Today's checklist</p>
                        <span className="text-xs text-gray-500">
                          {getChecklistProgress(todayTask).done}/{getChecklistProgress(todayTask).total} done
                        </span>
                      </div>
                      <div className="space-y-2">
                        {todayTask.checklistItems.map((item) => (
                          <label
                            key={item.id}
                            className="flex items-center gap-3 rounded-md border border-[#202020] bg-black/40 px-3 py-2 text-sm text-gray-200"
                          >
                            <Checkbox
                              checked={item.isDone}
                              disabled={checkingItemId === item.id || isPending}
                              onCheckedChange={(checked) => handleChecklistChange(item.id, checked === true)}
                              className="border-[#ECAC36]/50 data-[state=checked]:border-[#ECAC36] data-[state=checked]:bg-[#ECAC36] data-[state=checked]:text-black"
                            />
                            <span className={cn(item.isDone && "text-gray-500 line-through")}>{item.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <form
                      key={`today-${todayTask.id}`}
                      action={handleDetailsSave}
                      className="space-y-3 rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] p-4"
                    >
                      <input type="hidden" name="taskId" value={todayTask.id} />
                      <div>
                        <p className="text-sm font-semibold text-white">Proof and notes</p>
                        <p className="mt-1 text-xs text-gray-500">Paste a link or write exactly what got done.</p>
                      </div>
                      <Input
                        name="proofUrl"
                        defaultValue={todayTask.proofUrl || ""}
                        placeholder="Proof URL"
                        className="border-[#333333] bg-black text-white placeholder:text-gray-600"
                      />
                      <Textarea
                        name="notes"
                        defaultValue={todayTask.notes || ""}
                        placeholder="Example: Story posted, commented on @miamidesigndistrict..."
                        className="min-h-24 border-[#333333] bg-black text-white placeholder:text-gray-600"
                      />
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <Button
                          type="submit"
                          disabled={savingTaskId === todayTask.id}
                          className="bg-[#ECAC36] text-black hover:bg-[#B8860B] cut-corner"
                        >
                          <Save className="h-4 w-4" />
                          {savingTaskId === todayTask.id ? "Saving..." : "Save Proof"}
                        </Button>
                        <Button
                          type="button"
                          disabled={updatingTaskId === todayTask.id || isPending}
                          onClick={() => handleStatusChange(todayTask.id, "completed")}
                          variant="outline"
                          className="border-green-500/40 bg-green-500/10 text-green-200 hover:bg-green-500/20 cut-corner"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Mark Done
                        </Button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] p-4 text-sm text-gray-400">
                    Today's task will appear here after the board refreshes.
                  </div>
                )}
              </div>

              <div className="border-t border-[#242424] bg-black/30 p-5 xl:border-l xl:border-t-0">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-md border border-[#333333] bg-[#0A0A0A] px-4 py-3">
                    <p className="text-xs uppercase tracking-wide text-gray-500">14-day done</p>
                    <p className="text-2xl font-bold text-white">{dailyInstagramTracker.completedDaysLast14}/14</p>
                  </div>
                  <div className="rounded-md border border-[#333333] bg-[#0A0A0A] px-4 py-3">
                    <p className="text-xs uppercase tracking-wide text-gray-500">Current streak</p>
                    <p className="text-2xl font-bold text-white">{dailyInstagramTracker.currentStreak}</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-7 gap-2">
                  {dailyInstagramTracker.days.map((day) => (
                    <div
                      key={day.dateKey}
                      className={cn(
                        "rounded-md border px-2 py-2 text-center text-xs",
                        day.completed
                          ? "border-green-500/30 bg-green-500/15 text-green-200"
                          : "border-[#333333] bg-[#0A0A0A] text-gray-500"
                      )}
                      title={`${day.label}: ${day.completed ? "Completed" : "Not completed"}`}
                    >
                      <div className="mx-auto mb-1 flex h-5 w-5 items-center justify-center rounded-full">
                        {day.completed ? (
                          <CheckCircle2 className="h-4 w-4 text-green-300" />
                        ) : (
                          <CircleDot className="h-3.5 w-3.5 text-gray-600" />
                        )}
                      </div>
                      <span>{day.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {detailsMessage && (
        <Card className="border-[#ECAC36]/30 bg-[#1A1206] cut-corner">
          <CardContent className="flex items-center gap-2 p-3 text-sm text-[#ECAC36]" aria-live="polite">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {detailsMessage}
          </CardContent>
        </Card>
      )}

      <Card className="bg-[#111111] border-[#333333] cut-corner">
        <CardContent className="flex flex-col gap-3 p-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-center gap-2 text-white">
            <Filter className="h-4 w-4 text-[#ECAC36]" />
            <div>
              <span className="text-sm font-semibold">Board filters</span>
              <p className="text-xs text-gray-500">Keep the view simple for the person working today.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <SelectField label="Status" value={activeFilters.status} onChange={(value) => updateFilter("status", value)}>
              <option value="all">All statuses</option>
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectField>

            <SelectField label="Type" value={activeFilters.type} onChange={(value) => updateFilter("type", value)}>
              <option value="all">All types</option>
              {TASK_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectField>

            <SelectField label="Assignee" value={activeFilters.assignee} onChange={(value) => updateFilter("assignee", value)}>
              <option value="all">All assignees</option>
              <option value="me">My Tasks</option>
              {admins.map((admin) => (
                <option key={admin.id} value={admin.id}>
                  {admin.label}
                </option>
              ))}
            </SelectField>
          </div>
        </CardContent>
      </Card>

      <DragDropContext onDragEnd={handleBoardDragEnd}>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
          {BOARD_COLUMNS.map((column) => {
            const columnTasks = tasksByStatus.get(column.status) || []
            const Icon = column.icon

            return (
              <Droppable droppableId={column.status} key={column.status}>
                {(provided, snapshot) => (
                  <section
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      "min-h-[260px] rounded-lg border bg-[#0A0A0A] p-3 transition-colors",
                      snapshot.isDraggingOver ? "border-[#ECAC36]/70" : "border-[#2A2A2A]"
                    )}
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-md border border-[#333333] bg-black">
                          <Icon className="h-4 w-4 text-[#ECAC36]" />
                        </span>
                        <div>
                          <h2 className="text-sm font-semibold text-white">{column.title}</h2>
                          <p className="text-xs text-gray-500">{column.description}</p>
                        </div>
                      </div>
                      <Badge className="cut-corner border-[#333333] bg-black text-gray-300">{columnTasks.length}</Badge>
                    </div>

                    {columnTasks.length === 0 && (
                      <div className="flex min-h-28 items-center justify-center rounded-md border border-dashed border-[#333333] text-center text-sm text-gray-600">
                        Drop tasks here
                      </div>
                    )}

                    <div className="space-y-3">
                      {columnTasks.map((task, index) => (
                        <Draggable draggableId={task.id} index={index} key={task.id}>
                          {(dragProvided, dragSnapshot) => (
                            <article
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              className={cn(
                                "rounded-lg border bg-[#111111] p-3 shadow-sm transition",
                                selectedTask?.id === task.id ? "border-[#ECAC36]/70" : "border-[#2A2A2A]",
                                dragSnapshot.isDragging && "border-[#ECAC36] shadow-xl shadow-[#ECAC36]/10"
                              )}
                            >
                              <div className="mb-2 flex items-start justify-between gap-2">
                                <button
                                  type="button"
                                  onClick={() => setSelectedTaskId(task.id)}
                                  className="min-w-0 flex-1 text-left"
                                >
                                  <div className="mb-2 flex flex-wrap gap-1.5">
                                    <Badge className={cn("cut-corner", priorityBadgeClass(task.priority))}>
                                      {task.priority}
                                    </Badge>
                                    {task.taskType === "social_outreach" && (
                                      <Badge className="cut-corner border-pink-500/30 bg-pink-500/10 text-pink-200">
                                        <Instagram className="mr-1 h-3 w-3" />
                                        IG
                                      </Badge>
                                    )}
                                    {!hasProof(task) && task.taskType === "social_outreach" && (
                                      <Badge className="cut-corner border-[#ECAC36]/30 bg-[#ECAC36]/10 text-[#ECAC36]">
                                        Proof needed
                                      </Badge>
                                    )}
                                  </div>
                                  <h3 className="line-clamp-2 text-sm font-semibold text-white">{task.title}</h3>
                                </button>
                                <button
                                  type="button"
                                  {...dragProvided.dragHandleProps}
                                  className="rounded-md p-1 text-gray-600 hover:bg-white/5 hover:text-gray-300"
                                  aria-label={`Move ${task.title}`}
                                >
                                  <GripVertical className="h-4 w-4" />
                                </button>
                              </div>

                              {task.description && (
                                <p className="line-clamp-2 text-xs text-gray-500">{task.description}</p>
                              )}

                              <div className="mt-3 space-y-2 text-xs text-gray-400">
                                <div
                                  className={cn(
                                    "flex items-center gap-2",
                                    getDueState(task) === "overdue" && "text-red-300",
                                    getDueState(task) === "today" && "text-[#ECAC36]"
                                  )}
                                >
                                  <CalendarClock className="h-3.5 w-3.5" />
                                  {formatDate(task.dueDate)}
                                </div>
                                <div className="flex items-center gap-2">
                                  <UserCheck className="h-3.5 w-3.5" />
                                  {task.assignedToName || "Unassigned"}
                                </div>
                                {task.checklistItems.length > 0 && (
                                  <div className="flex items-center gap-2">
                                    <ClipboardCheck className="h-3.5 w-3.5" />
                                    {getChecklistProgress(task).done}/{getChecklistProgress(task).total} checklist
                                  </div>
                                )}
                              </div>

                              <div className="mt-3 grid grid-cols-2 gap-2">
                                {task.status !== "in_progress" && task.status !== "completed" && (
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    disabled={updatingTaskId === task.id || isPending}
                                    onClick={() => handleStatusChange(task.id, "in_progress")}
                                    className="border-blue-500/30 bg-blue-500/10 text-blue-200 hover:bg-blue-500/20"
                                  >
                                    Start
                                  </Button>
                                )}
                                {task.status !== "needs_proof" && task.status !== "completed" && (
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    disabled={updatingTaskId === task.id || isPending}
                                    onClick={() => handleStatusChange(task.id, "needs_proof")}
                                    className="border-[#ECAC36]/30 bg-[#ECAC36]/10 text-[#ECAC36] hover:bg-[#ECAC36]/20"
                                  >
                                    Proof
                                  </Button>
                                )}
                                {task.status !== "completed" && (
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    disabled={updatingTaskId === task.id || isPending}
                                    onClick={() => handleStatusChange(task.id, "completed")}
                                    className="border-green-500/30 bg-green-500/10 text-green-200 hover:bg-green-500/20"
                                  >
                                    Done
                                  </Button>
                                )}
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setSelectedTaskId(task.id)}
                                  className="text-gray-300 hover:bg-white/5 hover:text-white"
                                >
                                  Edit
                                </Button>
                              </div>
                            </article>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </section>
                )}
              </Droppable>
            )
          })}
        </div>
      </DragDropContext>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(320px,420px)_1fr]">
        <Card className="bg-[#111111] border-[#333333] cut-corner">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-white">
              <Plus className="h-4 w-4 text-[#ECAC36]" />
              Quick Add
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form ref={formRef} action={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="task-title" className="text-gray-300">
                    Title
                  </Label>
                  <Input
                    id="task-title"
                    name="title"
                    required
                    placeholder="Follow up with villa supplier"
                    className="border-[#333333] bg-[#0A0A0A] text-white placeholder:text-gray-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="task-type" className="text-gray-300">
                    Type
                  </Label>
                  <select
                    id="task-type"
                    name="taskType"
                    value={taskType}
                    onChange={(event) => setTaskType(event.target.value as TaskType)}
                    className="h-9 w-full rounded-md border border-[#333333] bg-[#0A0A0A] px-3 text-sm text-white outline-none focus:border-[#ECAC36]"
                  >
                    {TASK_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="task-priority" className="text-gray-300">
                    Priority
                  </Label>
                  <select
                    id="task-priority"
                    name="priority"
                    defaultValue="normal"
                    className="h-9 w-full rounded-md border border-[#333333] bg-[#0A0A0A] px-3 text-sm text-white outline-none focus:border-[#ECAC36]"
                  >
                    {PRIORITY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="task-status" className="text-gray-300">
                    Status
                  </Label>
                  <select
                    id="task-status"
                    name="status"
                    defaultValue="open"
                    className="h-9 w-full rounded-md border border-[#333333] bg-[#0A0A0A] px-3 text-sm text-white outline-none focus:border-[#ECAC36]"
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="task-due-date" className="text-gray-300">
                    Due Date
                  </Label>
                  <Input
                    id="task-due-date"
                    name="dueDate"
                    type="date"
                    className="border-[#333333] bg-[#0A0A0A] text-white"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="task-assignee" className="text-gray-300">
                    Assignee
                  </Label>
                  <select
                    id="task-assignee"
                    name="assignedTo"
                    defaultValue={currentUser.id}
                    className="h-9 w-full rounded-md border border-[#333333] bg-[#0A0A0A] px-3 text-sm text-white outline-none focus:border-[#ECAC36]"
                  >
                    {admins.map((admin) => (
                      <option key={admin.id} value={admin.id}>
                        {admin.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="task-description" className="text-gray-300">
                    Description
                  </Label>
                  <Textarea
                    id="task-description"
                    name="description"
                    placeholder="Context, handoff notes, or next step"
                    className="min-h-20 border-[#333333] bg-[#0A0A0A] text-white placeholder:text-gray-600"
                  />
                </div>
              </div>

              {taskType === "social_outreach" && (
                <div className="grid grid-cols-1 gap-3 border-t border-[#333333] pt-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="task-platform" className="text-gray-300">
                      Platform
                    </Label>
                    <select
                      id="task-platform"
                      name="platform"
                      defaultValue="Instagram"
                      className="h-9 w-full rounded-md border border-[#333333] bg-[#0A0A0A] px-3 text-sm text-white outline-none focus:border-[#ECAC36]"
                    >
                      {PLATFORM_OPTIONS.map((platform) => (
                        <option key={platform} value={platform}>
                          {platform}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="task-category" className="text-gray-300">
                      Miami Category
                    </Label>
                    <select
                      id="task-category"
                      name="targetCategory"
                      defaultValue="Miami restaurant"
                      className="h-9 w-full rounded-md border border-[#333333] bg-[#0A0A0A] px-3 text-sm text-white outline-none focus:border-[#ECAC36]"
                    >
                      {MIAMI_CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="task-target-name" className="text-gray-300">
                      Instagram Target
                    </Label>
                    <Input
                      id="task-target-name"
                      name="targetName"
                      placeholder="@miamirestaurant"
                      className="border-[#333333] bg-[#0A0A0A] text-white placeholder:text-gray-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="task-target-url" className="text-gray-300">
                      Target URL
                    </Label>
                    <Input
                      id="task-target-url"
                      name="targetUrl"
                      placeholder="https://instagram.com/..."
                      className="border-[#333333] bg-[#0A0A0A] text-white placeholder:text-gray-600"
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={createPending}
                className="w-full bg-[#ECAC36] text-black hover:bg-[#B8860B] cut-corner"
              >
                <Plus className="h-4 w-4" />
                {createPending ? "Adding..." : "Add Task"}
              </Button>

              {createMessage && (
                <p className="text-sm text-gray-300" aria-live="polite">
                  {createMessage}
                </p>
              )}
            </form>
          </CardContent>
        </Card>

        <Card className="bg-[#111111] border-[#333333] cut-corner">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-white">
              <PencilLine className="h-4 w-4 text-[#ECAC36]" />
              Task Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedTask ? (
              <div className="space-y-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="mb-2 flex flex-wrap gap-2">
                      <Badge className={cn("cut-corner", statusBadgeClass(selectedTask.status))}>
                        {STATUS_LABELS[selectedTask.status] || selectedTask.status}
                      </Badge>
                      <Badge className={cn("cut-corner", priorityBadgeClass(selectedTask.priority))}>
                        {selectedTask.priority}
                      </Badge>
                      <Badge className="cut-corner border-[#333333] bg-[#0A0A0A] text-gray-300">
                        {TASK_TYPE_LABELS[selectedTask.taskType] || selectedTask.taskType}
                      </Badge>
                    </div>
                    <h2 className="text-xl font-semibold text-white">{selectedTask.title}</h2>
                    {selectedTask.description && (
                      <p className="mt-1 text-sm text-gray-400">{selectedTask.description}</p>
                    )}
                  </div>

                  <select
                    value={selectedTask.status}
                    disabled={updatingTaskId === selectedTask.id || isPending}
                    onChange={(event) => handleStatusChange(selectedTask.id, event.target.value)}
                    className="h-9 rounded-md border border-[#333333] bg-[#0A0A0A] px-3 text-sm text-white outline-none focus:border-[#ECAC36]"
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-3 text-sm text-gray-400 md:grid-cols-3">
                  <div
                    className={cn(
                      "flex items-center gap-2 rounded-md border border-[#242424] bg-[#0A0A0A] p-3",
                      getDueState(selectedTask) === "overdue" && "text-red-300",
                      getDueState(selectedTask) === "today" && "text-[#ECAC36]"
                    )}
                  >
                    <CalendarClock className="h-4 w-4" />
                    {formatDate(selectedTask.dueDate)}
                  </div>
                  <div className="flex items-center gap-2 rounded-md border border-[#242424] bg-[#0A0A0A] p-3">
                    <UserCheck className="h-4 w-4" />
                    {selectedTask.assignedToName || "Unassigned"}
                  </div>
                  <div className="flex items-center gap-2 rounded-md border border-[#242424] bg-[#0A0A0A] p-3">
                    {selectedTask.taskType === "social_outreach" ? (
                      <Instagram className="h-4 w-4" />
                    ) : (
                      <Target className="h-4 w-4" />
                    )}
                    Updated {formatShortDateTime(selectedTask.updatedAt)}
                  </div>
                </div>

                {selectedTask.checklistItems.length > 0 && (
                  <div className="rounded-lg border border-[#242424] bg-[#0A0A0A] p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-white">Checklist</p>
                      <Badge className="cut-corner border-[#333333] bg-black text-gray-300">
                        {getChecklistProgress(selectedTask).done}/{getChecklistProgress(selectedTask).total}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      {selectedTask.checklistItems.map((item) => (
                        <label
                          key={item.id}
                          className="flex items-center gap-3 rounded-md border border-[#202020] bg-black/40 px-3 py-2 text-sm text-gray-200"
                        >
                          <Checkbox
                            checked={item.isDone}
                            disabled={checkingItemId === item.id || isPending}
                            onCheckedChange={(checked) => handleChecklistChange(item.id, checked === true)}
                            className="border-[#ECAC36]/50 data-[state=checked]:border-[#ECAC36] data-[state=checked]:bg-[#ECAC36] data-[state=checked]:text-black"
                          />
                          <span className={cn(item.isDone && "text-gray-500 line-through")}>{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {(selectedTask.targetName || selectedTask.targetUrl || selectedTask.proofUrl || selectedTask.notes) && (
                  <div className="grid grid-cols-1 gap-3 rounded-lg border border-[#242424] bg-[#0A0A0A] p-4 lg:grid-cols-2">
                    {(selectedTask.targetName || selectedTask.targetUrl) && (
                      <div className="min-w-0">
                        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">Target</p>
                        <div className="flex min-w-0 items-center gap-2 text-sm text-gray-300">
                          <LinkIcon className="h-4 w-4 shrink-0 text-[#ECAC36]" />
                          {getTargetHref(selectedTask) ? (
                            <a
                              href={getTargetHref(selectedTask) || "#"}
                              target="_blank"
                              rel="noreferrer"
                              className="min-w-0 truncate text-[#ECAC36] hover:underline"
                            >
                              {selectedTask.targetName || selectedTask.targetUrl}
                            </a>
                          ) : (
                            <span className="min-w-0 truncate">{selectedTask.targetName || selectedTask.targetUrl}</span>
                          )}
                          {getTargetHref(selectedTask) && <ExternalLink className="h-3 w-3 shrink-0" />}
                        </div>
                      </div>
                    )}

                    {(selectedTask.proofUrl || selectedTask.notes) && (
                      <div className="min-w-0">
                        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">Current proof / notes</p>
                        <div className="space-y-1 text-sm text-gray-300">
                          {selectedTask.proofUrl && getExternalHref(selectedTask.proofUrl) && (
                            <a
                              href={getExternalHref(selectedTask.proofUrl) || "#"}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex max-w-full items-center gap-1 truncate text-[#ECAC36] hover:underline"
                            >
                              <ExternalLink className="h-3 w-3 shrink-0" />
                              <span className="truncate">{selectedTask.proofUrl}</span>
                            </a>
                          )}
                          {selectedTask.proofUrl && !getExternalHref(selectedTask.proofUrl) && (
                            <p className="truncate">{selectedTask.proofUrl}</p>
                          )}
                          {selectedTask.notes && (
                            <p className="flex gap-2 text-gray-400">
                              <MessageSquareText className="mt-0.5 h-4 w-4 shrink-0" />
                              <span>{selectedTask.notes}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <form
                  key={selectedTask.id}
                  action={handleDetailsSave}
                  className="grid grid-cols-1 gap-3 border-t border-[#242424] pt-4 lg:grid-cols-[minmax(180px,1fr)_minmax(220px,1.3fr)_auto]"
                >
                  <input type="hidden" name="taskId" value={selectedTask.id} />
                  <div className="space-y-2">
                    <Label className="text-gray-300">Proof URL</Label>
                    <Input
                      name="proofUrl"
                      defaultValue={selectedTask.proofUrl || ""}
                      placeholder="Link to proof"
                      className="border-[#333333] bg-[#0A0A0A] text-white placeholder:text-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Notes</Label>
                    <Textarea
                      name="notes"
                      defaultValue={selectedTask.notes || ""}
                      placeholder="What happened, blocker, or proof note"
                      className="min-h-20 border-[#333333] bg-[#0A0A0A] text-white placeholder:text-gray-600"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="submit"
                      disabled={savingTaskId === selectedTask.id}
                      variant="outline"
                      className="w-full border-[#333333] bg-transparent text-gray-300 hover:border-[#ECAC36] hover:text-white lg:w-auto"
                    >
                      <Save className="h-4 w-4" />
                      {savingTaskId === selectedTask.id ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="py-16 text-center">
                <ListChecks className="mx-auto mb-4 h-12 w-12 text-gray-600" />
                <p className="text-lg font-medium text-white">No task selected</p>
                <p className="mt-1 text-sm text-gray-500">Select a card from the board to add notes or proof.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {tasks.length === 0 && (
        <Card className="bg-[#111111] border-[#333333] cut-corner">
          <CardContent className="py-16 text-center">
            <Sparkles className="mx-auto mb-4 h-12 w-12 text-gray-600" />
            <p className="text-lg font-medium text-white">No tasks found</p>
            <p className="mt-1 text-sm text-gray-500">Adjust filters or add the next task.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

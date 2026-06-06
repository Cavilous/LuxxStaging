"use client"

import type { ReactNode } from "react"
import { useRef, useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  CalendarClock,
  CheckCircle2,
  CircleDot,
  ExternalLink,
  Filter,
  Instagram,
  LinkIcon,
  ListChecks,
  MessageSquareText,
  Plus,
  Save,
  Target,
  UserCheck,
  AlertTriangle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { createOpsTask, updateTaskDetails, updateTaskStatus } from "@/app/admin/tasks/actions"

type TaskStatus = "open" | "in_progress" | "completed"
type TaskType = "daily" | "social_outreach"
type TaskPriority = "low" | "normal" | "high" | "urgent"

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

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
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
  open: "Open",
  in_progress: "In progress",
  completed: "Completed",
}

const TASK_TYPE_LABELS: Record<string, string> = {
  daily: "Daily",
  social_outreach: "Social outreach",
}

function formatDate(dateValue: string | null) {
  if (!dateValue) return "No due date"
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateValue))
}

function getDueState(task: TaskWorkflowItem) {
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

function statusBadgeClass(status: string) {
  switch (status) {
    case "completed":
      return "bg-green-500/15 text-green-300 border-green-500/30"
    case "in_progress":
      return "bg-blue-500/15 text-blue-300 border-blue-500/30"
    default:
      return "bg-zinc-500/15 text-zinc-300 border-zinc-500/30"
  }
}

function priorityBadgeClass(priority: string) {
  switch (priority) {
    case "urgent":
      return "bg-red-500/15 text-red-300 border-red-500/30"
    case "high":
      return "bg-orange-500/15 text-orange-300 border-orange-500/30"
    case "low":
      return "bg-zinc-500/15 text-zinc-300 border-zinc-500/30"
    default:
      return "bg-[#ECAC36]/15 text-[#ECAC36] border-[#ECAC36]/30"
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
  const [optimisticStatuses, setOptimisticStatuses] = useState<Record<string, string>>({})
  const [isPending, startTransition] = useTransition()

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
    setUpdatingTaskId(taskId)
    setOptimisticStatuses((previous) => ({ ...previous, [taskId]: status }))

    startTransition(async () => {
      const result = await updateTaskStatus(taskId, status)
      setUpdatingTaskId(null)

      if (result.error) {
        setCreateMessage(result.error)
        setOptimisticStatuses((previous) => {
          const next = { ...previous }
          delete next[taskId]
          return next
        })
        return
      }

      router.refresh()
    })
  }

  const handleDetailsSave = async (formData: FormData) => {
    const taskId = String(formData.get("taskId") || "")
    setSavingTaskId(taskId)
    setDetailsMessage(null)

    const result = await updateTaskDetails(formData)
    setSavingTaskId(null)

    if (result.error) {
      setDetailsMessage(result.error)
      return
    }

    setDetailsMessage("Task details saved.")
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Daily Tasks</h1>
          <p className="mt-1 text-sm text-gray-400">Operations queue and social outreach tracking</p>
        </div>
        <Button
          onClick={() => updateFilter("assignee", "me")}
          className="w-fit bg-[#ECAC36] text-black hover:bg-[#B8860B] cut-corner"
        >
          <UserCheck className="mr-2 h-4 w-4" />
          My Tasks ({stats.myOpen})
        </Button>
      </div>

      {schemaWarning && (
        <Card className="bg-[#1A1206] border-[#ECAC36]/40 cut-corner">
          <CardContent className="flex items-start gap-3 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#ECAC36]" />
            <div>
              <p className="font-semibold text-white">Task database setup needed</p>
              <p className="mt-1 text-sm text-gray-300">{schemaWarning}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
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
              <p className="text-sm text-gray-400">Open</p>
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
              <p className="text-sm text-gray-400">Social Outreach</p>
              <p className="text-2xl font-bold text-white">{stats.socialOutreach}</p>
            </div>
            <Instagram className="h-5 w-5 text-pink-300" />
          </CardContent>
        </Card>
      </div>

      {dailyInstagramTracker && (
        <Card className="bg-[#111111] border-[#333333] cut-corner">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="cut-corner border-pink-500/30 bg-pink-500/10 text-pink-200">
                    <Instagram className="mr-1 h-3.5 w-3.5" />
                    Daily Instagram
                  </Badge>
                  <Badge className={cn(
                    "cut-corner",
                    dailyInstagramTracker.todayComplete
                      ? "border-green-500/30 bg-green-500/15 text-green-300"
                      : "border-[#ECAC36]/30 bg-[#ECAC36]/15 text-[#ECAC36]"
                  )}>
                    {dailyInstagramTracker.todayComplete ? "Done today" : "Due today"}
                  </Badge>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">{dailyInstagramTracker.title}</h2>
                  <p className="mt-1 text-sm text-gray-400">
                    Assigned to {dailyInstagramTracker.assignedToLabel}. Post 1 IG Story and leave 5 comments on Miami-based IG pages.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-[auto_auto]">
                <div className="rounded-md border border-[#333333] bg-[#0A0A0A] px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-gray-500">14-day done</p>
                  <p className="text-2xl font-bold text-white">{dailyInstagramTracker.completedDaysLast14}/14</p>
                </div>
                <div className="rounded-md border border-[#333333] bg-[#0A0A0A] px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Current streak</p>
                  <p className="text-2xl font-bold text-white">{dailyInstagramTracker.currentStreak}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-7 gap-2 xl:grid-cols-[repeat(14,minmax(0,1fr))]">
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
          </CardContent>
        </Card>
      )}

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
                  <Label htmlFor="task-title" className="text-gray-300">Title</Label>
                  <Input
                    id="task-title"
                    name="title"
                    required
                    placeholder="Review overdue leads"
                    className="border-[#333333] bg-[#0A0A0A] text-white placeholder:text-gray-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="task-type" className="text-gray-300">Type</Label>
                  <select
                    id="task-type"
                    name="taskType"
                    value={taskType}
                    onChange={(event) => setTaskType(event.target.value as TaskType)}
                    className="h-9 w-full rounded-md border border-[#333333] bg-[#0A0A0A] px-3 text-sm text-white outline-none focus:border-[#ECAC36]"
                  >
                    {TASK_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="task-priority" className="text-gray-300">Priority</Label>
                  <select
                    id="task-priority"
                    name="priority"
                    defaultValue="normal"
                    className="h-9 w-full rounded-md border border-[#333333] bg-[#0A0A0A] px-3 text-sm text-white outline-none focus:border-[#ECAC36]"
                  >
                    {PRIORITY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="task-status" className="text-gray-300">Status</Label>
                  <select
                    id="task-status"
                    name="status"
                    defaultValue="open"
                    className="h-9 w-full rounded-md border border-[#333333] bg-[#0A0A0A] px-3 text-sm text-white outline-none focus:border-[#ECAC36]"
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="task-due-date" className="text-gray-300">Due Date</Label>
                  <Input
                    id="task-due-date"
                    name="dueDate"
                    type="date"
                    className="border-[#333333] bg-[#0A0A0A] text-white"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="task-assignee" className="text-gray-300">Assignee</Label>
                  <select
                    id="task-assignee"
                    name="assignedTo"
                    defaultValue={currentUser.id}
                    className="h-9 w-full rounded-md border border-[#333333] bg-[#0A0A0A] px-3 text-sm text-white outline-none focus:border-[#ECAC36]"
                  >
                    {admins.map((admin) => (
                      <option key={admin.id} value={admin.id}>{admin.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="task-description" className="text-gray-300">Description</Label>
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
                    <Label htmlFor="task-platform" className="text-gray-300">Platform</Label>
                    <select
                      id="task-platform"
                      name="platform"
                      defaultValue="Instagram"
                      className="h-9 w-full rounded-md border border-[#333333] bg-[#0A0A0A] px-3 text-sm text-white outline-none focus:border-[#ECAC36]"
                    >
                      {PLATFORM_OPTIONS.map((platform) => (
                        <option key={platform} value={platform}>{platform}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="task-category" className="text-gray-300">Miami Category</Label>
                    <select
                      id="task-category"
                      name="targetCategory"
                      defaultValue="Miami restaurant"
                      className="h-9 w-full rounded-md border border-[#333333] bg-[#0A0A0A] px-3 text-sm text-white outline-none focus:border-[#ECAC36]"
                    >
                      {MIAMI_CATEGORIES.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="task-target-name" className="text-gray-300">Instagram Target</Label>
                    <Input
                      id="task-target-name"
                      name="targetName"
                      placeholder="@miamirestaurant"
                      className="border-[#333333] bg-[#0A0A0A] text-white placeholder:text-gray-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="task-target-url" className="text-gray-300">Target URL</Label>
                    <Input
                      id="task-target-url"
                      name="targetUrl"
                      placeholder="https://instagram.com/..."
                      className="border-[#333333] bg-[#0A0A0A] text-white placeholder:text-gray-600"
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="task-proof-url" className="text-gray-300">Proof URL</Label>
                    <Input
                      id="task-proof-url"
                      name="proofUrl"
                      placeholder="Link to comment, DM, or screenshot"
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
                <Plus className="mr-2 h-4 w-4" />
                {createPending ? "Adding..." : "Add Task"}
              </Button>

              {createMessage && (
                <p className="text-sm text-gray-300" aria-live="polite">{createMessage}</p>
              )}
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="bg-[#111111] border-[#333333] cut-corner">
            <CardContent className="flex flex-col gap-3 p-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex items-center gap-2 text-white">
                <Filter className="h-4 w-4 text-[#ECAC36]" />
                <span className="text-sm font-semibold">Filters</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <SelectField
                  label="Status"
                  value={activeFilters.status}
                  onChange={(value) => updateFilter("status", value)}
                >
                  <option value="all">All statuses</option>
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </SelectField>

                <SelectField
                  label="Type"
                  value={activeFilters.type}
                  onChange={(value) => updateFilter("type", value)}
                >
                  <option value="all">All types</option>
                  {TASK_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </SelectField>

                <SelectField
                  label="Assignee"
                  value={activeFilters.assignee}
                  onChange={(value) => updateFilter("assignee", value)}
                >
                  <option value="all">All assignees</option>
                  <option value="me">My Tasks</option>
                  {admins.map((admin) => (
                    <option key={admin.id} value={admin.id}>{admin.label}</option>
                  ))}
                </SelectField>
              </div>
            </CardContent>
          </Card>

          {tasks.length === 0 ? (
            <Card className="bg-[#111111] border-[#333333] cut-corner">
              <CardContent className="py-16 text-center">
                <ListChecks className="mx-auto mb-4 h-12 w-12 text-gray-600" />
                <p className="text-lg font-medium text-white">No tasks found</p>
                <p className="mt-1 text-sm text-gray-500">Adjust filters or add the next task.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => {
                const currentStatus = optimisticStatuses[task.id] || task.status
                const dueState = getDueState({ ...task, status: currentStatus })
                const targetHref = getTargetHref(task)
                const proofHref = getExternalHref(task.proofUrl)

                return (
                  <Card key={task.id} className="bg-[#111111] border-[#333333] cut-corner">
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              <Badge className={cn("cut-corner", statusBadgeClass(currentStatus))}>
                                {STATUS_LABELS[currentStatus] || currentStatus}
                              </Badge>
                              <Badge className={cn("cut-corner", priorityBadgeClass(task.priority))}>
                                {task.priority}
                              </Badge>
                              <Badge className="cut-corner border-[#333333] bg-[#0A0A0A] text-gray-300">
                                {TASK_TYPE_LABELS[task.taskType] || task.taskType}
                              </Badge>
                              {task.targetCategory && (
                                <Badge className="cut-corner border-pink-500/30 bg-pink-500/10 text-pink-200">
                                  {task.targetCategory}
                                </Badge>
                              )}
                            </div>

                            <h2 className="truncate text-lg font-semibold text-white">{task.title}</h2>
                            {task.description && (
                              <p className="mt-1 text-sm text-gray-400">{task.description}</p>
                            )}
                          </div>

                          <div className="flex flex-col gap-2 sm:flex-row xl:flex-col xl:items-end">
                            <select
                              value={currentStatus}
                              disabled={updatingTaskId === task.id || isPending}
                              onChange={(event) => handleStatusChange(task.id, event.target.value)}
                              className="h-9 rounded-md border border-[#333333] bg-[#0A0A0A] px-3 text-sm text-white outline-none focus:border-[#ECAC36]"
                            >
                              {STATUS_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 text-sm text-gray-400 md:grid-cols-3">
                          <div className={cn(
                            "flex items-center gap-2",
                            dueState === "overdue" && "text-red-300",
                            dueState === "today" && "text-[#ECAC36]"
                          )}>
                            <CalendarClock className="h-4 w-4" />
                            {formatDate(task.dueDate)}
                          </div>
                          <div className="flex items-center gap-2">
                            <UserCheck className="h-4 w-4" />
                            {task.assignedToName || "Unassigned"}
                          </div>
                          <div className="flex items-center gap-2">
                            {task.taskType === "social_outreach" ? (
                              <Instagram className="h-4 w-4" />
                            ) : (
                              <Target className="h-4 w-4" />
                            )}
                            {task.platform || TASK_TYPE_LABELS[task.taskType] || "Task"}
                          </div>
                        </div>

                        {(task.targetName || task.targetUrl || task.proofUrl || task.notes) && (
                          <div className="grid grid-cols-1 gap-3 rounded-md border border-[#242424] bg-[#0A0A0A] p-3 lg:grid-cols-2">
                            {(task.targetName || task.targetUrl) && (
                              <div className="min-w-0">
                                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">Target</p>
                                <div className="flex min-w-0 items-center gap-2 text-sm text-gray-300">
                                  <LinkIcon className="h-4 w-4 shrink-0 text-[#ECAC36]" />
                                  {targetHref ? (
                                    <a
                                      href={targetHref}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="min-w-0 truncate text-[#ECAC36] hover:underline"
                                    >
                                      {task.targetName || task.targetUrl}
                                    </a>
                                  ) : (
                                    <span className="min-w-0 truncate">{task.targetName || task.targetUrl}</span>
                                  )}
                                  {targetHref && <ExternalLink className="h-3 w-3 shrink-0" />}
                                </div>
                              </div>
                            )}

                            {(task.proofUrl || task.notes) && (
                              <div className="min-w-0">
                                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">Proof / Notes</p>
                                <div className="space-y-1 text-sm text-gray-300">
                                  {task.proofUrl && proofHref && (
                                    <a
                                      href={proofHref}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex max-w-full items-center gap-1 truncate text-[#ECAC36] hover:underline"
                                    >
                                      <ExternalLink className="h-3 w-3 shrink-0" />
                                      <span className="truncate">{task.proofUrl}</span>
                                    </a>
                                  )}
                                  {task.proofUrl && !proofHref && <p className="truncate">{task.proofUrl}</p>}
                                  {task.notes && (
                                    <p className="flex gap-2 text-gray-400">
                                      <MessageSquareText className="mt-0.5 h-4 w-4 shrink-0" />
                                      <span>{task.notes}</span>
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        <form
                          action={handleDetailsSave}
                          className="grid grid-cols-1 gap-2 border-t border-[#242424] pt-3 md:grid-cols-[minmax(180px,1fr)_minmax(200px,1.4fr)_auto]"
                        >
                          <input type="hidden" name="taskId" value={task.id} />
                          <Input
                            name="proofUrl"
                            defaultValue={task.proofUrl || ""}
                            placeholder="Proof URL"
                            className="border-[#333333] bg-[#0A0A0A] text-white placeholder:text-gray-600"
                          />
                          <Input
                            name="notes"
                            defaultValue={task.notes || ""}
                            placeholder="Notes"
                            className="border-[#333333] bg-[#0A0A0A] text-white placeholder:text-gray-600"
                          />
                          <Button
                            type="submit"
                            disabled={savingTaskId === task.id}
                            variant="outline"
                            className="border-[#333333] bg-transparent text-gray-300 hover:border-[#ECAC36] hover:text-white"
                          >
                            <Save className="mr-2 h-4 w-4" />
                            {savingTaskId === task.id ? "Saving..." : "Save"}
                          </Button>
                        </form>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {detailsMessage && (
            <p className="text-sm text-gray-300" aria-live="polite">{detailsMessage}</p>
          )}
        </div>
      </div>
    </div>
  )
}

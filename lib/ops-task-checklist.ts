export const MEGAN_DAILY_OUTREACH_TITLE = "Megan: IG story + 5 Miami comments"

export const MEGAN_DAILY_CHECKLIST = [
  "Post 1 IG Story",
  "Comment on Miami page 1",
  "Comment on Miami page 2",
  "Comment on Miami page 3",
  "Comment on Miami page 4",
  "Comment on Miami page 5",
  "Add completion update or link",
]

const CHECKLIST_PREFIX = "__LUXX_CHECKLIST__="
const REQUESTED_BY_PREFIX = "Requested by: "
const OWNER_PREFIX = "Owner: "

export type ChecklistState = Record<string, boolean>
export type DelegationNoteData = {
  requestedByName: string | null
  ownerName: string | null
  notes: string | null
}

export function extractTaskNotes(rawNotes: string | null | undefined): {
  notes: string | null
  checklistState: ChecklistState
} {
  if (!rawNotes) {
    return { notes: null, checklistState: {} }
  }

  const lines = rawNotes.split(/\r?\n/)
  const firstLine = lines[0] || ""

  if (!firstLine.startsWith(CHECKLIST_PREFIX)) {
    return { notes: rawNotes.trim() || null, checklistState: {} }
  }

  let checklistState: ChecklistState = {}
  try {
    const parsed = JSON.parse(firstLine.slice(CHECKLIST_PREFIX.length))
    if (parsed && typeof parsed === "object") {
      checklistState = Object.fromEntries(
        Object.entries(parsed).filter(([, value]) => typeof value === "boolean")
      ) as ChecklistState
    }
  } catch {
    checklistState = {}
  }

  const notes = lines.slice(1).join("\n").trim()
  return { notes: notes || null, checklistState }
}

export function formatTaskNotes(notes: string | null | undefined, checklistState: ChecklistState = {}) {
  const cleanNotes = notes?.trim() || ""
  const hasChecklistState = Object.keys(checklistState).length > 0

  if (!hasChecklistState) {
    return cleanNotes || null
  }

  const checklistLine = `${CHECKLIST_PREFIX}${JSON.stringify(checklistState)}`
  return cleanNotes ? `${checklistLine}\n${cleanNotes}` : checklistLine
}

export function extractDelegationNotes(rawNotes: string | null | undefined): DelegationNoteData {
  if (!rawNotes) {
    return { requestedByName: null, ownerName: null, notes: null }
  }

  const remainingLines: string[] = []
  let requestedByName: string | null = null
  let ownerName: string | null = null

  for (const line of rawNotes.split(/\r?\n/)) {
    if (line.startsWith(REQUESTED_BY_PREFIX)) {
      requestedByName = line.slice(REQUESTED_BY_PREFIX.length).trim() || null
      continue
    }

    if (line.startsWith(OWNER_PREFIX)) {
      ownerName = line.slice(OWNER_PREFIX.length).trim() || null
      continue
    }

    remainingLines.push(line)
  }

  return {
    requestedByName,
    ownerName,
    notes: remainingLines.join("\n").trim() || null,
  }
}

export function formatDelegationNotes(
  notes: string | null | undefined,
  requestedByName?: string | null,
  ownerName?: string | null
) {
  const lines = [
    requestedByName ? `${REQUESTED_BY_PREFIX}${requestedByName}` : null,
    ownerName ? `${OWNER_PREFIX}${ownerName}` : null,
    notes?.trim() || null,
  ].filter(Boolean)

  return lines.length > 0 ? lines.join("\n") : null
}

export function buildMeganChecklistItems(taskId: string, checklistState: ChecklistState) {
  return MEGAN_DAILY_CHECKLIST.map((label, index) => ({
    id: `${taskId}::${index}`,
    label,
    isDone: checklistState[label] || false,
    displayOrder: index + 1,
  }))
}

export function allMeganChecklistItemsDone(checklistState: ChecklistState) {
  return MEGAN_DAILY_CHECKLIST.every((label) => checklistState[label])
}

export function setChecklistItemState(
  checklistState: ChecklistState,
  label: string,
  isDone: boolean
) {
  return {
    ...checklistState,
    [label]: isDone,
  }
}

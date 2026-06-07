import "server-only"
import { client } from "@/lib/db"

const OPS_TASK_STORAGE_STATEMENTS = [
  "ALTER TABLE admin_users ALTER COLUMN role SET DEFAULT 'ops'",
  `CREATE TABLE IF NOT EXISTS ops_task_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    list_type TEXT NOT NULL DEFAULT 'daily',
    created_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS ops_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    list_id UUID REFERENCES ops_task_lists(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    task_type TEXT NOT NULL DEFAULT 'daily',
    status TEXT NOT NULL DEFAULT 'open',
    priority TEXT NOT NULL DEFAULT 'normal',
    due_date TIMESTAMP WITH TIME ZONE,
    assigned_to UUID REFERENCES admin_users(id),
    created_by UUID REFERENCES admin_users(id),
    related_vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
    target_name TEXT,
    target_url TEXT,
    target_category TEXT,
    platform TEXT,
    proof_url TEXT,
    notes TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS ops_task_checklist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES ops_tasks(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    is_done BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
  )`,
  "CREATE INDEX IF NOT EXISTS idx_ops_task_lists_type ON ops_task_lists(list_type)",
  "CREATE INDEX IF NOT EXISTS idx_ops_task_lists_created_by ON ops_task_lists(created_by)",
  "CREATE INDEX IF NOT EXISTS idx_ops_tasks_type ON ops_tasks(task_type)",
  "CREATE INDEX IF NOT EXISTS idx_ops_tasks_status ON ops_tasks(status)",
  "CREATE INDEX IF NOT EXISTS idx_ops_tasks_priority ON ops_tasks(priority)",
  "CREATE INDEX IF NOT EXISTS idx_ops_tasks_due_date ON ops_tasks(due_date)",
  "CREATE INDEX IF NOT EXISTS idx_ops_tasks_assigned_to ON ops_tasks(assigned_to)",
  "CREATE INDEX IF NOT EXISTS idx_ops_tasks_created_by ON ops_tasks(created_by)",
  "CREATE INDEX IF NOT EXISTS idx_ops_tasks_related_vendor ON ops_tasks(related_vendor_id)",
  "CREATE INDEX IF NOT EXISTS idx_ops_tasks_type_status_due ON ops_tasks(task_type, status, due_date)",
  "CREATE INDEX IF NOT EXISTS idx_ops_task_checklist_task ON ops_task_checklist_items(task_id)",
  "CREATE INDEX IF NOT EXISTS idx_ops_task_checklist_task_order ON ops_task_checklist_items(task_id, display_order)",
  `CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ language 'plpgsql'`,
  "DROP TRIGGER IF EXISTS update_ops_task_lists_updated_at ON ops_task_lists",
  `CREATE TRIGGER update_ops_task_lists_updated_at
  BEFORE UPDATE ON ops_task_lists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`,
  "DROP TRIGGER IF EXISTS update_ops_tasks_updated_at ON ops_tasks",
  `CREATE TRIGGER update_ops_tasks_updated_at
  BEFORE UPDATE ON ops_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`,
  "DROP TRIGGER IF EXISTS update_ops_task_checklist_updated_at ON ops_task_checklist_items",
  `CREATE TRIGGER update_ops_task_checklist_updated_at
  BEFORE UPDATE ON ops_task_checklist_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`,
]

let setupPromise: Promise<void> | null = null

export async function ensureOpsTaskStorage() {
  if (!setupPromise) {
    setupPromise = (async () => {
      for (const statement of OPS_TASK_STORAGE_STATEMENTS) {
        await client.unsafe(statement)
      }
    })().catch((error) => {
      setupPromise = null
      throw error
    })
  }

  return setupPromise
}

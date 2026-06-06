export interface Task {
    id: number
    project_id: number
    created_by_id: number
    title: string
    status: ("todo" | "in_progress" | "done")
    priority: ("low" | "medium" | "high")
    due_date: string | null
    order: number
    created_at: string
    updated_at: string
}
export interface Scene {
    id: number
    project_id: number
    created_by_id: number
    title: string
    description: string | null
    image_url: string | null
    type: ("cutscene" | "gameplay" | "boss" | "dialogue" | "other")
    status: ("planned" | "in_progress" | "done")
    created_at: string
    updated_at: string
}
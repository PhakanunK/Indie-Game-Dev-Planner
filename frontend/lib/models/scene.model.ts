export interface SceneLink {
    id: number
    from_scene_id: number
    to_scene_id: number
    label: string | null
}

export interface Scene {
    id: number
    project_id: number
    created_by_id: number
    title: string
    description: string | null
    image_url: string | null
    type: ("cutscene" | "gameplay" | "boss" | "dialogue" | "other")
    status: ("planned" | "in_progress" | "done")
    pos_x: number | null
    pos_y: number | null
    created_at: string
    updated_at: string
    outgoinglinks: SceneLink[]
}
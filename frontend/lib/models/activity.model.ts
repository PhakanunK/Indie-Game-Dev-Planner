export interface Activity {
    id: number
    project_id: number
    user_id: number
    user: { id: number; username: string }
    action: string
    entity_type: string
    entity_id: number
    created_at: string
}
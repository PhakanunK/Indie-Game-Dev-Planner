export interface Project {
    id: number
    owner_id: number
    name: string
    genre: string
    engine: string
    platform: string
    description: string | null
    created_at: string
    updated_at: string
}
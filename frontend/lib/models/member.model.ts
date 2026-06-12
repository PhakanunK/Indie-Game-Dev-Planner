export interface Member {
    id: number
    project_id: number
    user_id: number
    role: ("owner" | "member")
    joined_at: string
    user: {
        id: number
        username: string
    }
}
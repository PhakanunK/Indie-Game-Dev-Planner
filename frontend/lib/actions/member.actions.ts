import { Member } from "../models/member.model";

export const getMembers = async (token: string, projectId: number): Promise<Member[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/members`, {
        headers: {"Authorization": `Bearer ${token}`}
    })
    if (!response.ok) {
        throw new Error("Failed to get members")
    }
    return await response.json()
}
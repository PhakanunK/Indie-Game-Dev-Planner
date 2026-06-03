import { Activity } from "../models/activity.model";

export const getActivities = async (token: string, projectId: number): Promise<Activity[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/activities`, {
        method: "GET",
        headers: {"Authorization": `Bearer ${token}`},
    })
    if (!response.ok) {
        throw new Error("Failed to get activities")
    }
    return await response.json()
}
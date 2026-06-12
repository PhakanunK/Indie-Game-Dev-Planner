import { Scene } from "../models/scene.model";
import { SCENE_STATUSES, SCENE_TYPES } from "../utils/constants";

export const getScenes = async (token: string, projectId: number): Promise<Scene[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/scenes`, {
        method: "GET",
        headers: {"Authorization": `Bearer ${token}`},
    })
    if (!response.ok) {
        throw new Error("Failed to get scenes")
    }
    return await response.json()
}

export const createScene = async (token: string, projectId: number, data: {
    title: string
    description?: string
    image_url?: string
    type: typeof SCENE_TYPES[number]
    status: typeof SCENE_STATUSES[number]
}): Promise<Scene> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/scenes`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    if (!response.ok) {
        throw new Error("Failed to create scene")
    }
    return await response.json()
}

export const updateScene = async (token: string, projectId: number, sceneId: number, data: {
    title?: string
    description?: string
    image_url?: string
    type?: typeof SCENE_TYPES[number]
    status?: typeof SCENE_STATUSES[number]
}): Promise<Scene> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/scenes/${sceneId}`, {
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    if (!response.ok) {
        throw new Error("Failed to update scene")
    }
    return await response.json()
}

export const deleteScene = async (token: string, projectId: number, sceneId: number): Promise<void> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/scenes/${sceneId}`, {
        method: "DELETE",
        headers: {"Authorization": `Bearer ${token}`},
    })
    if (!response.ok) {
        throw new Error("Failed to delete scene")
    }
}
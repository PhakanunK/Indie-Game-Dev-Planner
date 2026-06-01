import { Project } from "../models/project.model";

export const getProjects = async (token: string): Promise<Project[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
        method: "GET",
        headers: {"Authorization": `Bearer ${token}`, },
    })
    if (!response.ok) {
        throw new Error("Failed to get projects")
    }
    return await response.json()
}

export const createProject = async (token: string, data: {
    name: string
    genre: string
    engine: string
    platform: string
    description?: string
}): Promise<Project> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`, 
            "Content-Type": "application/json"},
        body: JSON.stringify(data)
    })
    if (!response.ok) {
        throw new Error("Failed to create project")
    }
    return await response.json()
}
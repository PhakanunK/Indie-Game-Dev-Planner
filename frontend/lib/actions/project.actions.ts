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

export const updateProject = async (token: string, projectId: number, data: {
    name?: string
    genre?: string
    engine?: string
    platform?: string
    description?: string
}): Promise<Project> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}`, {
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${token}`, 
            "Content-Type": "application/json"},
        body: JSON.stringify(data)
    })
    if (!response.ok) {
        throw new Error("Failed to update project")
    }
    return await response.json()
}

export const deleteProject = async (token: string, projectId: number): Promise<void> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}`, {
        method: "DELETE",
        headers: {"Authorization": `Bearer ${token}`, },
    })
    if (!response.ok) {
        throw new Error("Failed to delete project")
    }
}

export const getProject = async (token: string, projectId: number): Promise<Project> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}`, {
        method: "GET",
        headers: {"Authorization": `Bearer ${token}`, },
    })
    if (!response.ok) {
        throw new Error("Failed to get a project")
    }
    return await response.json()
}
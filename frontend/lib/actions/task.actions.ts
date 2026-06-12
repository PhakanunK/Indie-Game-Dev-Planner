import { Task } from "../models/task.model";
import { TASK_PRIORITIES, TASK_STATUSES } from "../utils/constants";

export const getTasks = async (token: string, projectId: number): Promise<Task[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/tasks`, {
        method: "GET",
        headers: {"Authorization": `Bearer ${token}`},
    })
    if (!response.ok) {
        throw new Error("Failed to get tasks")
    }
    return await response.json()
}

export const createTask = async (token: string, projectId: number, data: {
    title: string
    status?: typeof TASK_STATUSES[number]
    priority?: typeof TASK_PRIORITIES[number]
    due_date?: string | null
    order: number
}): Promise<Task> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/tasks`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    if (!response.ok) {
        throw new Error("Failed to create task")
    }
    return await response.json()
}

export const updateTask = async (token: string, projectId: number, taskId: number, data: {
    title?: string
    status?: typeof TASK_STATUSES[number]
    priority?: typeof TASK_PRIORITIES[number]
    due_date?: string | null
    order?: number
}): Promise<Task> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    if (!response.ok) {
        throw new Error("Failed to update task")
    }
    return await response.json()
}

export const deleteTask = async (token: string, projectId: number, taskId: number): Promise<void> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/tasks/${taskId}`, {
        method: "DELETE",
        headers: {"Authorization": `Bearer ${token}`},
    })
    if (!response.ok) {
        throw new Error("Failed to delete task")
    }
}
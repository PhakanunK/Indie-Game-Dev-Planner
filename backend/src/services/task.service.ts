import { create, findAllByProjectId, findById, reorder, softDelete, update } from "../repositories/task.repository"
import { CreateTaskData, UpdateTaskData } from "../schemas/task.schema"

export const getTasks = async (projectId: number) => {
    return await findAllByProjectId(projectId)
}

export const createTask = async (projectId: number, ownerId: number, data: CreateTaskData) => {
    return await create(projectId, ownerId, data)
}

export const updateTask = async (projectId: number, id: number, data: UpdateTaskData) => {
    const task = await findById(id)
    if (!task || task.project_id !== projectId) {
        throw new Error("Task not found")
    }
    return await update(id, data)
}

export const deleteTask = async (projectId: number, id: number) => {
    const task = await findById(id)
    if (!task || task.project_id !== projectId) {
        throw new Error("Task not found")
    }
    return await softDelete(id)
}

export const reorderTasks = async (orderIds: number[]) => {
    return await reorder(orderIds)
}
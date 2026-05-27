import { create, findAllByProjectId, findById, reorder, softDelete, update } from "../repositories/task.repository"
import { CreateTaskData, UpdateTaskData } from "../schemas/task.schema"
import { emitTaskUpdated } from "../sockets/emitter"
import { logActivity } from "./activity.service"

export const getTasks = async (projectId: number) => {
    return await findAllByProjectId(projectId)
}

export const createTask = async (projectId: number, ownerId: number, data: CreateTaskData) => {
    const task = await create(projectId, ownerId, data)
    emitTaskUpdated(projectId, task, "created")
    await logActivity(projectId, ownerId, `created task '${task.title}'`, "task", task.id)
    return task
}

export const updateTask = async (projectId: number, userId: number, id: number, data: UpdateTaskData) => {
    const task = await findById(id)
    if (!task || task.project_id !== projectId) {
        throw new Error("Task not found")
    }
    const updated = await update(id, data)
    emitTaskUpdated(projectId, updated, "updated")
    await logActivity(projectId, userId, `updated task '${task.title}'`, "task", task.id)
    return updated
}

export const deleteTask = async (projectId: number, userId: number,  id: number) => {
    const task = await findById(id)
    if (!task || task.project_id !== projectId) {
        throw new Error("Task not found")
    }
    emitTaskUpdated(projectId, task, "deleted")
    await logActivity(projectId, userId, `deleted task '${task.title}'`, "task", task.id)
    return await softDelete(id)
}

export const reorderTasks = async (projectId: number, orderIds: number[]) => {
    const tasks = await reorder(orderIds)
    emitTaskUpdated(projectId, tasks, "reordered")
    return tasks
}
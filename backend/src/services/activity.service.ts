import { create, findAllByProjectId } from "../repositories/activity.repository"
import { emitActivityNew } from "../sockets/emitter"

export const logActivity = async (projectId: number, userId: number, action: string, entityType: string, entityId: number) => {
    const activity = await create(projectId, userId, action, entityType, entityId)
    emitActivityNew(projectId, activity)
    return activity
}

export const getActivities = async (projectId: number) => {
    return await findAllByProjectId(projectId)
}
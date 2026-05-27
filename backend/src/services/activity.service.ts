import { create, findAllByProjectId } from "../repositories/activity.repository"
import { findMember } from "../repositories/member.repository"
import { emitActivityNew } from "../sockets/emitter"

export const logActivity = async (projectId: number, userId: number, action: string, entityType: string, entityId: number) => {
    const activity = await create(projectId, userId, action, entityType, entityId)
    emitActivityNew(projectId, activity)
    return activity
}

export const getActivities = async (projectId: number, userId: number) => {
    const isMember = await findMember(projectId, userId)
    if (!isMember) {
        throw new Error("Unauthorized")
    }
    return await findAllByProjectId(projectId)
}
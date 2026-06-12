import { prisma } from "../utils/prisma"

export const create = (projectId: number, userId: number, action: string, entityType: string, entityId: number) => {
    return prisma.activity.create({
        data: {
            project_id: projectId,
            user_id: userId,
            action: action,
            entity_type: entityType,
            entity_id: entityId
        },
        include: { user: { select: { id: true, username: true } } }
    })
}

export const findAllByProjectId = (projectId: number) => {
    return prisma.activity.findMany({
        where: { project_id: projectId },
        orderBy: { created_at: "desc" },
        include: { user: { select: { id: true, username: true } } }
    })
}
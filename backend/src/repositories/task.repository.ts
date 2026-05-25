import { CreateTaskData, UpdateTaskData } from "../schemas/task.schema"
import { prisma } from "../utils/prisma"

export const findAllByProjectId = (projectId: number) => {
    return prisma.task.findMany({
        where: {
            project_id: projectId,
            deleted_at: null
        }
    })
}

export const findById = (id: number) => {
    return prisma.task.findUnique({where: {id}})
}

export const create = (projectId: number, ownerId: number, data: CreateTaskData) => {
    return prisma.task.create({
        data: {
            ...data,
            project_id: projectId,
            created_by_id: ownerId,
        }
    })
}

export const update = (id: number, data: UpdateTaskData) => {
    return prisma.task.update({where: {id}, data})
}

export const softDelete = (id: number) => {
    return prisma.task.update({
        where: {id},
        data: {deleted_at: new Date()}
    })
}

export const reorder = (orderedIds: number[]) => {
    const updates = orderedIds.map((id, index) =>
        prisma.task.update({where:{id}, data:{order:index}})
    )
    return Promise.all(updates)
}
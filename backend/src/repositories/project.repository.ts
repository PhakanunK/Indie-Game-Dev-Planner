import { prisma } from "../utils/prisma"
import { CreateProjectData, UpdateProjectData } from "../schemas/project.schema"

export const findById = (id: number) => {
    return prisma.project.findUnique({where: {id}})
}

export const findAllByUserId = (userId: number) => {
    return prisma.project.findMany({
        where: {
            projectMembers: {
                some: { user_id: userId}
            }
        }
    })
}

export const deleteById = (id: number) => {
    return prisma.project.delete({ where: {id}})
}

export const create = (ownerId: number, data: CreateProjectData) => {
    return prisma.project.create({
        data: {
            ...data,
            owner_id: ownerId,
            projectMembers: {
                create: {user_id: ownerId, role: "owner"}
            }
        }
    })
}

export const update = (id: number, data: UpdateProjectData) => {
    return prisma.project.update({ where: {id}, data })
}
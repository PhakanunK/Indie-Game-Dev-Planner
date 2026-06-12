import { prisma } from "../utils/prisma"

export const findAllByProjectId = (projectId: number) => {
    return prisma.projectMember.findMany({
        where: {project_id: projectId},
        include: {user: {select: {id: true, username:true}}}
    })
}

export const removeById = (projectId: number, userId: number) => {
    return prisma.projectMember.delete({
        where: {
            project_id_user_id: {project_id: projectId, user_id: userId}
        }
    })
}

export const create = (projectId: number, userId: number) => {
    return prisma.projectMember.create({
        data: {
            project_id: projectId,
            user_id: userId
        }
    })
}

export const findMember = (projectId: number, userId: number) => {
    return prisma.projectMember.findUnique({
        where: {
            project_id_user_id: {project_id: projectId, user_id: userId}
        }
    })
}
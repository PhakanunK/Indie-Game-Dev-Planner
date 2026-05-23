import { prisma } from "../utils/prisma"

export const create = (projectId: number, token: string, createdBy: number, expiresAt: Date) => {
    return prisma.inviteToken.create({
        data: {
            project_id: projectId,
            token,
            created_by_id: createdBy,
            expires_at: expiresAt
        }
    })
}

export const findByToken = (token: string) => {
    return prisma.inviteToken.findUnique({where: {token}})
}

export const markUsed = (id: number) => {
    return prisma.inviteToken.update({where: {id}, data: {used: true}})
}
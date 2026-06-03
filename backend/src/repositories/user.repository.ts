import { prisma } from "../utils/prisma"

export const findByEmail = (email: string) => {
    return prisma.user.findUnique({where: {email}})
}

export const create = (email: string, username: string, passwordHash: string) => {
    return prisma.user.create({data: {email, username, password_hash: passwordHash}})
}

export const findById = (id: number) => {
    return prisma.user.findUnique({where: {id}})
}
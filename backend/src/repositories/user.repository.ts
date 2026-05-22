import { prisma } from "../utils/prisma"

export const findByEmail = (email: string) => {
    return prisma.user.findUnique({where: {email}})
}

export const create = (email: string, passwordHash: string) => {
    return prisma.user.create({data: {email, password_hash: passwordHash}})
}

export const findById = (id: number) => {
    return prisma.user.findUnique({where: {id}})
}
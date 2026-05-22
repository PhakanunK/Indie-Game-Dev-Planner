import argon2 from "argon2"
import { create, findByEmail, findById } from "../repositories/user.repository"
import { signToken } from "../utils/jwt"

export const register = async (email: string, password: string) => {
    const existingUser = await findByEmail(email)
    if (existingUser) {
        throw new Error("Email already in use")
    }
    const passwordHash = await argon2.hash(password)
    const user = await create(email, passwordHash)
    const { password_hash, ...safeUser} = user
    return safeUser
}

export const login = async (email: string, password: string) => {
    const user = await findByEmail(email)
    if (!user) {
        throw new Error("Invalid email or password")
    }
    const verify = await argon2.verify(user.password_hash, password)
    if (!verify) {
        throw new Error("Invalid email or password")
    }
    return signToken(user.id)
}

export const getMe = async (id: number) => {
    const user = await findById(id)
    if (!user) {
        throw new Error("User not found")
    }
    const { password_hash, ...safeUser} = user
    return safeUser
}
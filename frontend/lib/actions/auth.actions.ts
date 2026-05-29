import { User } from "../models/user.model";

export const login = async (email: string, password: string): Promise<{token: string, user: User}> => {
    throw new Error("Nope")
}

export const register = async (email: string, password: string): Promise<{token: string, user: User}> => {
    throw new Error("Nope")
}
import { User } from "../models/user.model";

export const login = async (email: string, password: string): Promise<string> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, password})
    })
    if (!response.ok) {
        throw new Error("Login failed")
    }
    return await response.json()
}

export const register = async (email: string, username: string, password: string): Promise<void> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, username, password})
    })
    if (!response.ok) {
        throw new Error("Register failed")
    }
}

export const getMe = async (token: string): Promise<User> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        method: "GET",
        headers: {"Authorization": `Bearer ${token}`, },
    })
    if (!response.ok) {
        throw new Error("Failed to get user")
    }
    return await response.json()
}
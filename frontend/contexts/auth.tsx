"use client"

import { User } from "@/lib/models/user.model"
import React, { createContext, useContext, useState } from "react"

interface AuthContextType {
    user: User | null
    token: string | null
    login: (token: string, user: User) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({children}: {children: React.ReactNode}) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const login = (token: string, user: User) => {
        setUser(user)
        setToken(token)
    }
    const logout = () => {
        setUser(null)
        setToken(null)
    }
    return <AuthContext.Provider value={{user, token, login, logout}}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) {
        throw new Error("useAuth must be used inside AuthProvider")
    }
    return ctx
}
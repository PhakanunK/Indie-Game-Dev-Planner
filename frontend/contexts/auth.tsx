"use client"

import { getMe } from "@/lib/actions/auth.actions"
import { User } from "@/lib/models/user.model"
import socket from "@/lib/socket"
import React, { createContext, useContext, useEffect, useState } from "react"

interface AuthContextType {
    user: User | null
    token: string | null
    login: (token: string, user: User) => void
    logout: () => void
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({children}: {children: React.ReactNode}) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        const saved = localStorage.getItem("token")
        if (saved) {
            setToken(saved)
            socket.connect()
            socket.emit("auth", {token: saved})
            getMe(saved).then(setUser).finally(() => setIsLoading(false))
        }
        else {
            setIsLoading(false)
        }
    }, [])
    const login = (token: string, user: User) => {
        localStorage.setItem("token", token)
        setUser(user)
        setToken(token)
        socket.connect()
        socket.emit("auth", {token})
    }
    const logout = () => {
        localStorage.removeItem("token")
        setUser(null)
        setToken(null)
        socket.disconnect()
    }
    return <AuthContext.Provider value={{user, token, login, logout, isLoading}}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) {
        throw new Error("useAuth must be used inside AuthProvider")
    }
    return ctx
}
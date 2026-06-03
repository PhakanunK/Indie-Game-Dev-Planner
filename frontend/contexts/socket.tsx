"use client"

import React, { createContext, useContext } from "react"
import { Socket } from "socket.io-client"
import socket from "@/lib/socket"

interface SocketContextType {
    socket: Socket
}

const SocketContext = createContext<SocketContextType | null>(null)

export function SocketProvider({children}: {children: React.ReactNode}) {
    return <SocketContext.Provider value={{socket}}>{children}</SocketContext.Provider>
}

export const useSocket = () => {
    const ctx = useContext(SocketContext)
        if (!ctx) {
        throw new Error("useSocket must be used inside SocketProvider")
    }
    return ctx
}
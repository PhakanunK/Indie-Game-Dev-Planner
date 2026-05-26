import { Server } from "socket.io";
import { verifyToken } from "../utils/jwt";

export const initSockets = (io: Server) => {
    io.on("connection", (socket) => {
        console.log(`Socket connected: ${socket.id}`)

        socket.on("auth", async (data: {token: string}) => {
            try {
                const userId = verifyToken(data.token)
                socket.data.userId = userId
                socket.emit("auth:success")
            } catch {
                socket.emit("auth:error", {message: "Invalid token"})
                socket.disconnect()
            }
        })

        socket.on("project:join", async (data: {projectId: number}) => {
            if (!socket.data.userId) {
                socket.emit("error", {message: "Not authenticated"})
                return
            }
            socket.join(String(data.projectId))

            const sockets = await io.in(String(data.projectId)).fetchSockets()
            const onlineUserIds = sockets.map(s => s.data.userId).filter(id => id !== undefined)
            io.to(String(data.projectId)).emit("user:presence", {
                projectId: data.projectId,
                onlineUserIds
            })
        })

        socket.on("project:leave", async (data: {projectId: number}) => {
            if (!socket.data.userId) {
                socket.emit("error", {message: "Not authenticated"})
                return
            }
            socket.leave(String(data.projectId))

            const sockets = await io.in(String(data.projectId)).fetchSockets()
            const onlineUserIds = sockets.map(s => s.data.userId).filter(id => id !== undefined)
            io.to(String(data.projectId)).emit("user:presence", {
                projectId: data.projectId,
                onlineUserIds
            })
        })

        socket.on("disconnect", () => {
            console.log(`Socket disconnected: ${socket.id}`)
        })
    })
}
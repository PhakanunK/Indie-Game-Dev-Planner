import { Server } from "socket.io";
import { verifyToken } from "../utils/jwt";

export const initSockets = (io: Server) => {
    io.on("connection", (socket) => {
        console.log(`Socket connected: ${socket.id}`)

        socket.on("auth", async (data: { token: string }) => {
            try {
                const userId = verifyToken(data.token)
                socket.data.userId = userId
                socket.emit("auth:success")
            } catch {
                socket.emit("auth:error", { message: "Invalid token" })
                socket.disconnect()
            }
        })

        socket.on("project:join", async (data: { projectId: number }) => {
            if (!socket.data.userId) {
                socket.emit("error", { message: "Not authenticated" })
                return
            }
            socket.join(String(data.projectId))
            if (!socket.data.projectIds) socket.data.projectIds = []
            socket.data.projectIds.push(data.projectId)

            const sockets = await io.in(String(data.projectId)).fetchSockets()
            const onlineUserIds = sockets.map(s => s.data.userId).filter(id => id !== undefined)
            io.to(String(data.projectId)).emit("user:presence", {
                projectId: data.projectId,
                onlineUserIds
            })
        })

        socket.on("project:leave", async (data: { projectId: number }) => {
            if (!socket.data.userId) {
                socket.emit("error", { message: "Not authenticated" })
                return
            }
            socket.leave(String(data.projectId))
            socket.data.projectIds = (socket.data.projectIds ?? []).filter((id: number) => id !== data.projectId)

            const sockets = await io.in(String(data.projectId)).fetchSockets()
            const onlineUserIds = sockets.map(s => s.data.userId).filter(id => id !== undefined)
            io.to(String(data.projectId)).emit("user:presence", {
                projectId: data.projectId,
                onlineUserIds
            })
        })

        socket.on("disconnect", async () => {
            console.log(`Socket disconnected: ${socket.id}`)
            const projectIds: number[] = socket.data.projectIds ?? []
            for (const projectId of projectIds) {
                const sockets = await io.in(String(projectId)).fetchSockets()
                const onlineUserIds = sockets
                    .filter(s => s.id !== socket.id)
                    .map(s => s.data.userId)
                    .filter((id: number) => id !== undefined)
                io.to(String(projectId)).emit("user:presence", { projectId, onlineUserIds })
            }
        })
    })
}
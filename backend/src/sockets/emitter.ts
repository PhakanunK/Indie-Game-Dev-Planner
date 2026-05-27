import { Server } from "socket.io";

let io: Server

export const initEmitter = (server: Server) => {
    io = server
}

export const emitTaskUpdated = (projectId: number, task: any, action: string) => {
    io.to(String(projectId)).emit("task:updated", {projectId, task, action})
}

export const emitSceneUpdated = (projectId: number, scene: any, action: string) => {
    io.to(String(projectId)).emit("scene:updated", {projectId, scene, action})
}

export const emitActivityNew = (projectId: number, activity: any) => {
    io.to(String(projectId)).emit("activity:new", {projectId, activity})
}
import { Server } from "socket.io";
import { Activity, Scene, Task } from "../generated/prisma/client";

let io: Server

export const initEmitter = (server: Server) => {
    io = server
}

export const emitTaskUpdated = (projectId: number, task: Task | Task[], action: string) => {
    io.to(String(projectId)).emit("task:updated", {projectId, task, action})
}

export const emitSceneUpdated = (projectId: number, scene: Scene, action: string) => {
    io.to(String(projectId)).emit("scene:updated", {projectId, scene, action})
}

export const emitActivityNew = (projectId: number, activity: Activity) => {
    io.to(String(projectId)).emit("activity:new", {projectId, activity})
}
import { useAuth } from "@/contexts/auth";
import socket from "@/lib/socket";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTasks } from "./use-tasks";
import { useScenes } from "./use-scenes";
import { useActivities } from "./use-activities";

export const useProject = () => {
    const {id} = useParams()
    const projectId = Number(id)
    const {token} = useAuth()
    const [onlineUserIds, setOnlineUserIds] = useState<number[]>([])
    useEffect(() => {
        if (token) {
            if (socket.connected) {
                socket.emit("project:join", {projectId})
            }
            else {
                socket.once("auth:success", () => {
                    socket.emit("project:join", {projectId})
             })
            }
            return () => {
                socket.emit("project:leave", {projectId})
            }
        }
    }, [token, projectId])
    useEffect(() => {
        socket.on("user:presence", (data) => {
            setOnlineUserIds(data.onlineUserIds)
        })
        return () => {
            socket.off("user:presence")
        }
    }, [])
    const tasks = useTasks(projectId, token ?? "")
    const scenes = useScenes(projectId, token ?? "")
    const activities = useActivities(projectId, token ?? "")
    return {...tasks, ...scenes, activities, onlineUserIds}
}
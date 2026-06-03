import { useAuth } from "@/contexts/auth";
import socket from "@/lib/socket";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useTasks } from "./use-tasks";
import { useScenes } from "./use-scenes";
import { useActivities } from "./use-activities";

export const useProject = () => {
    const {id} = useParams()
    const projectId = Number(id)
    const {token} = useAuth()
    useEffect(() => {
        if (token) {
            socket.emit("project:join", {projectId})
            return () => {
                socket.emit("project:leave", {projectId})
            }
        }
    }, [token, projectId])
    const tasks = useTasks(projectId, token ?? "")
    const scenes = useScenes(projectId, token ?? "")
    const activities = useActivities(projectId, token ?? "")
    return {...tasks, ...scenes, activities}
}
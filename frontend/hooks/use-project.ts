"use client"

import { useAuth } from "@/contexts/auth";
import { deleteProject, getProject, updateProject } from "@/lib/actions/project.actions";
import socket from "@/lib/socket";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTasks } from "./use-tasks";
import { useScenes } from "./use-scenes";
import { useActivities } from "./use-activities";
import { Member } from "@/lib/models/member.model";
import { Project } from "@/lib/models/project.model";
import { getMembers } from "@/lib/actions/member.actions";

export const useProject = () => {
    const {id} = useParams()
    const projectId = Number(id)
    const {token} = useAuth()
    const router = useRouter()
    const [project, setProject] = useState<Project | null>(null)
    const [projectError, setProjectError] = useState<"not_found" | "forbidden" | null>(null)
    const [accessToken, setAccessToken] = useState("")
    const [onlineUserIds, setOnlineUserIds] = useState<number[]>([])
    const [members, setMembers] = useState<Member[]>([])
    useEffect(() => {
        if (token) {
            getProject(token, projectId)
                .then((p) => {
                    setProject(p)
                    setAccessToken(token)
                    return getMembers(token, projectId)
                })
                .then(setMembers)
                .catch((err: unknown) => {
                    const msg = err instanceof Error ? err.message : ""
                    if (msg === "PROJECT_NOT_FOUND") setProjectError("not_found")
                    else if (msg === "PROJECT_FORBIDDEN") setProjectError("forbidden")
                    else setProjectError("not_found")
                })
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
        const handler = (data: {onlineUserIds: number[]}) => {
            setOnlineUserIds(data.onlineUserIds)
        }
        socket.on("user:presence", handler)
        return () => {
            socket.off("user:presence", handler)
        }
    }, [])
    const onProjectUpdate = async (data: { name?: string; genre?: string; engine?: string; platform?: string; description?: string }) => {
        if (!token) return
        const updated = await updateProject(token, projectId, data)
        setProject(updated)
    }
    const onProjectDelete = async () => {
        if (!token) return
        await deleteProject(token, projectId)
        router.push("/dashboard")
    }
    const { isLoading: tasksLoading, ...tasks } = useTasks(projectId, accessToken)
    const { isLoading: scenesLoading, ...scenes } = useScenes(projectId, accessToken)
    const { isLoading: activitiesLoading, ...activitiesData } = useActivities(projectId, accessToken)
    return { project, projectError, ...tasks, tasksLoading, ...scenes, scenesLoading, ...activitiesData, activitiesLoading, onlineUserIds, members, onProjectUpdate, onProjectDelete }
}
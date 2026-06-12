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
    const [onlineUserIds, setOnlineUserIds] = useState<number[]>([])
    const [members, setMembers] = useState<Member[]>([])
    useEffect(() => {
        if (token) {
            getProject(token, projectId).then(setProject)
            getMembers(token, projectId).then(setMembers)
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
    const { isLoading: tasksLoading, ...tasks } = useTasks(projectId, token ?? "")
    const { isLoading: scenesLoading, ...scenes } = useScenes(projectId, token ?? "")
    const { isLoading: activitiesLoading, ...activitiesData } = useActivities(projectId, token ?? "")
    return { project, ...tasks, tasksLoading, ...scenes, scenesLoading, ...activitiesData, activitiesLoading, onlineUserIds, members, onProjectUpdate, onProjectDelete }
}
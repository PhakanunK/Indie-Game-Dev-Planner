"use client"

import { useAuth } from "@/contexts/auth";
import socket from "@/lib/socket";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTasks } from "./use-tasks";
import { useScenes } from "./use-scenes";
import { useActivities } from "./use-activities";
import { Member } from "@/lib/models/member.model";
import { getMembers } from "@/lib/actions/member.actions";

export const useProject = () => {
    const {id} = useParams()
    const projectId = Number(id)
    const {token} = useAuth()
    const [onlineUserIds, setOnlineUserIds] = useState<number[]>([])
    const [members, setMembers] = useState<Member[]>([])
    useEffect(() => {
        if (token) {
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
    const { isLoading: tasksLoading, ...tasks } = useTasks(projectId, token ?? "")
    const { isLoading: scenesLoading, ...scenes } = useScenes(projectId, token ?? "")
    const { isLoading: activitiesLoading, ...activitiesData } = useActivities(projectId, token ?? "")
    return { ...tasks, tasksLoading, ...scenes, scenesLoading, ...activitiesData, activitiesLoading, onlineUserIds, members }
}
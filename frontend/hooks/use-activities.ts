import { getActivities } from "@/lib/actions/activity.actions"
import { Activity } from "@/lib/models/activity.model"
import socket from "@/lib/socket"
import { useEffect, useState } from "react"

export const useActivities = (projectId: number, token: string) => {
    const [activities, setActivities] = useState<Activity[]>([])
    useEffect(() => {
            if (token) {
                getActivities(token, projectId).then(setActivities)
            }
        }, [token, projectId])
    useEffect (() => {
        socket.on("activity:new", (data) => {
            setActivities(prev => [data.activity, ...prev])
        })
        return () => {
            socket.off("activity:new")
        }
    }, [])
    return activities
}
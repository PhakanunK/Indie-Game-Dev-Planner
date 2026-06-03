"use client"

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
        const handler = (data: {activity: Activity}) => {
            setActivities(prev => [data.activity, ...prev])
        }
        socket.on("activity:new", handler)
        return () => {
            socket.off("activity:new", handler)
        }
    }, [])
    return activities
}
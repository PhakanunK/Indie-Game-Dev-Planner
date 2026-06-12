"use client"

import { createTask, deleteTask, getTasks, updateTask } from "@/lib/actions/task.actions"
import { Task } from "@/lib/models/task.model"
import socket from "@/lib/socket"
import { TASK_PRIORITIES, TASK_STATUSES } from "@/lib/utils/constants"
import { useEffect, useState } from "react"

type TaskCreateInput = {
    title: string
    status: typeof TASK_STATUSES[number]
    priority: typeof TASK_PRIORITIES[number]
    due_date?: string
}

type TaskUpdateInput = {
    title?: string
    status?: typeof TASK_STATUSES[number]
    priority?: typeof TASK_PRIORITIES[number]
    due_date?: string | null
}

export const useTasks = (projectId: number, token: string) => {
    const [tasks, setTasks] = useState<Task[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (token) {
            setIsLoading(true)
            getTasks(token, projectId).then(setTasks).finally(() => setIsLoading(false))
        }
    }, [token, projectId])

    useEffect(() => {
        const handler = (data: { action: string; task: Task }) => {
            if (data.action === "created") {
                setTasks(prev => [...prev, data.task])
            } else if (data.action === "updated") {
                setTasks(prev => prev.map(t => t.id === data.task.id ? data.task : t))
            } else if (data.action === "deleted") {
                setTasks(prev => prev.filter(t => t.id !== data.task.id))
            }
        }
        socket.on("task:updated", handler)
        return () => { socket.off("task:updated", handler) }
    }, [])

    const onTaskCreate = async (data: TaskCreateInput) => {
        if (!token) return
        await createTask(token, projectId, {
            ...data,
            due_date: data.due_date ? new Date(data.due_date).toISOString() : undefined,
            order: tasks.length
        })
    }

    const onTaskUpdate = async (taskId: number, data: TaskUpdateInput) => {
        try {
            if (!token) return
            setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...data } : t))
            await updateTask(token, projectId, taskId, {
                ...data,
                due_date: data.due_date ? new Date(data.due_date).toISOString() : data.due_date
            })
        } catch {
            getTasks(token, projectId).then(setTasks)
        }
    }

    const onTaskDelete = async (taskId: number) => {
        if (!token) return
        await deleteTask(token, projectId, taskId)
    }

    return { tasks, isLoading, onTaskCreate, onTaskUpdate, onTaskDelete }
}

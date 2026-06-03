"use client"

import { createTask, getTasks } from "@/lib/actions/task.actions";
import { Task } from "@/lib/models/task.model";
import socket from "@/lib/socket";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const taskSchema = z.object({
    title: z.string().min(1),
    status: z.enum(["todo", "in_progress", "done"])
})

type TaskFormData = z.infer<typeof taskSchema>

export const useTasks = (projectId: number, token: string) => {
    const taskForm = useForm<TaskFormData>({ resolver: zodResolver(taskSchema) })
    const [tasks, setTasks] = useState<Task[]>([])
    useEffect(() => {
        if (token) {
            getTasks(token, projectId).then(setTasks)
        }
    }, [token, projectId])
    useEffect(() => {
        const handler = (data: {action: string, task: Task}) => {
            if (data.action === "created") {
                setTasks(prev => [...prev, data.task])
            }
            else if (data.action === "updated") {
                setTasks(prev => prev.map(t => t.id === data.task.id ? data.task : t))
            }
            else if (data.action === "deleted") {
                setTasks(prev => prev.filter(t => t.id !== data.task.id))
            }
        }
        socket.on("task:updated", handler)
        return () => {
            socket.off("task:updated", handler)
        }
    }, [])
    const onTaskSubmit = async (data: TaskFormData) => {
        try {
            if (!token) {
                return
            }
            await createTask(token, projectId, { ...data, order: tasks.length })
        } catch {
            taskForm.setError("root", { message: "Failed to create task" })
        }
    }
    return { tasks, taskForm, onTaskSubmit }
}
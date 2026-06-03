import { useAuth } from "@/contexts/auth";
import { getActivities } from "@/lib/actions/activity.actions";
import { createScene, getScenes } from "@/lib/actions/scene.actions";
import { createTask, getTasks } from "@/lib/actions/task.actions";
import { Activity } from "@/lib/models/activity.model";
import { Scene } from "@/lib/models/scene.model";
import { Task } from "@/lib/models/task.model";
import socket from "@/lib/socket";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const taskSchema = z.object({
    title: z.string().min(1),
    status: z.enum(["todo", "in_progress", "done"])
})

type TaskFormData = z.infer<typeof taskSchema>

const sceneSchema = z.object({
    title: z.string().min(1),
    type: z.enum(["cutscene", "gameplay", "boss", "dialogue", "other"]),
    status: z.enum(["planned", "in_progress", "done"])
})

type SceneFormData = z.infer<typeof sceneSchema>

export const useProject = () => {
    const taskForm = useForm<TaskFormData>({resolver: zodResolver(taskSchema)})
    const sceneForm = useForm<SceneFormData>({resolver: zodResolver(sceneSchema)})
    const {id} = useParams()
    const projectId = Number(id)
    const [tasks, setTasks] = useState<Task[]>([])
    const [scenes, setScenes] = useState<Scene[]>([])
    const [activities, setActivities] = useState<Activity[]>([])
    const {token} = useAuth()
    useEffect(() => {
        if (token) {
            getTasks(token, projectId).then(setTasks)
            getScenes(token, projectId).then(setScenes)
            getActivities(token, projectId).then(setActivities)
            socket.emit("project:join", {projectId})
            return () => {
                socket.emit("project:leave", {projectId})
            }
        }
    }, [token, projectId])
    useEffect (() => {
        socket.on("task:updated", (data) => {
            if (data.action === "created") {
                setTasks(prev => [...prev, data.task])
            }
            else if (data.action === "updated") {
                setTasks(prev => prev.map(t => t.id === data.task.id ? data.task: t))
            }
            else if (data.action === "deleted") {
                setTasks(prev => prev.filter(t => t.id !== data.task.id))
            }
        })
        socket.on("scene:updated", (data) => {
            if (data.action === "created") {
                setScenes(prev => [...prev, data.scene])
            }
            else if (data.action === "updated") {
                setScenes(prev => prev.map(s => s.id === data.scene.id ? data.scene: s))
            }
            else if (data.action === "deleted") {
                setScenes(prev => prev.filter(s => s.id !== data.scene.id))
            }
        })
        socket.on("activity:new", (data) => {
            setActivities(prev => [data.activity, ...prev])
        })
        return () => {
            socket.off("task:updated")
            socket.off("scene:updated")
            socket.off("activity:new")
        }
    }, [])
    const onTaskSubmit = async (data: TaskFormData) => {
            if (!token) {
                return
            }
            await createTask(token, projectId, {...data, order: tasks.length})
        }
    const onSceneSubmit = async (data: SceneFormData) => {
            if (!token) {
                return
            }
            await createScene(token, projectId, data)
        }
    return {tasks, taskForm, scenes, sceneForm, onTaskSubmit, onSceneSubmit, activities}
}
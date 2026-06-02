import { useAuth } from "@/contexts/auth";
import { getActivities } from "@/lib/actions/activity.actions";
import { createScene, getScenes } from "@/lib/actions/scene.actions";
import { createTask, getTasks } from "@/lib/actions/task.actions";
import { Activity } from "@/lib/models/activity.model";
import { Scene } from "@/lib/models/scene.model";
import { Task } from "@/lib/models/task.model";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const taskSchema = z.object({
    title: z.string(),
    status: z.enum(["todo", "in_progress", "done"])
})

type TaskFormData = z.infer<typeof taskSchema>

const sceneSchema = z.object({
    title: z.string(),
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
        }
    }, [token, projectId])
    const onTaskSubmit = async (data: TaskFormData) => {
            if (!token) {
                return
            }
            const newTask = await createTask(token, projectId, {...data, order: tasks.length})
            setTasks(prev => [...prev, newTask])
        }
    const onSceneSubmit = async (data: SceneFormData) => {
            if (!token) {
                return
            }
            const newScene = await createScene(token, projectId, data)
            setScenes(prev => [...prev, newScene])
        }
    return {tasks, taskForm, scenes, sceneForm, onTaskSubmit, onSceneSubmit, activities}
}
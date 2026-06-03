import { createScene, getScenes } from "@/lib/actions/scene.actions";
import { Scene } from "@/lib/models/scene.model";
import socket from "@/lib/socket";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const sceneSchema = z.object({
    title: z.string().min(1),
    type: z.enum(["cutscene", "gameplay", "boss", "dialogue", "other"]),
    status: z.enum(["planned", "in_progress", "done"])
})

type SceneFormData = z.infer<typeof sceneSchema>

export const useScenes = (projectId: number, token: string) => {
    const sceneForm = useForm<SceneFormData>({resolver: zodResolver(sceneSchema)})
    const [scenes, setScenes] = useState<Scene[]>([])
    useEffect(() => {
        if (token) {
            getScenes(token, projectId).then(setScenes)
        }
    }, [token, projectId])
    useEffect (() => {
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
        return () => {
            socket.off("scene:updated")
        }
    }, [])
    const onSceneSubmit = async (data: SceneFormData) => {
            if (!token) {
                return
            }
            await createScene(token, projectId, data)
        }
    return {scenes, sceneForm, onSceneSubmit}
}
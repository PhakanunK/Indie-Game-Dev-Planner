"use client"

import { createScene, deleteScene, getScenes, updateScene } from "@/lib/actions/scene.actions";
import { Scene } from "@/lib/models/scene.model";
import socket from "@/lib/socket";
import { SCENE_STATUSES, SCENE_TYPES } from "@/lib/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const sceneSchema = z.object({
    title: z.string().min(1),
    type: z.enum(SCENE_TYPES),
    status: z.enum(SCENE_STATUSES)
})

type SceneFormData = z.infer<typeof sceneSchema>

export const useScenes = (projectId: number, token: string) => {
    const sceneForm = useForm<SceneFormData>({ resolver: zodResolver(sceneSchema) })
    const [scenes, setScenes] = useState<Scene[]>([])
    useEffect(() => {
        if (token) {
            getScenes(token, projectId).then(setScenes)
        }
    }, [token, projectId])
    useEffect(() => {
        const handler = (data: { action: string, scene: Scene }) => {
            if (data.action === "created") {
                setScenes(prev => [...prev, data.scene])
            }
            else if (data.action === "updated") {
                setScenes(prev => prev.map(s => s.id === data.scene.id ? data.scene : s))
            }
            else if (data.action === "deleted") {
                setScenes(prev => prev.filter(s => s.id !== data.scene.id))
            }
        }
        socket.on("scene:updated", handler)
        return () => {
            socket.off("scene:updated", handler)
        }
    }, [])

    const onSceneSubmit = async (data: SceneFormData) => {

        try {
            if (!token) {
                return
            }
            await createScene(token, projectId, data)
        } catch {
            sceneForm.setError("root", { message: "Failed to create scene" })
        }

    }
    const onSceneUpdate = async (sceneId: number, data: {
        title?: string
        description?: string
        image_url?: string
        type?: typeof SCENE_TYPES[number]
        status?: typeof SCENE_STATUSES[number]
    }) => {
        try {
            if (!token) {
                return
            }
            await updateScene(token, projectId, sceneId, data)
        } catch {

        }
    }

    const onSceneDelete = async (sceneId: number) => {
        try {
            if (!token) {
                return
            }
            await deleteScene(token, projectId, sceneId)
        } catch {

        }
    }

    return { scenes, sceneForm, onSceneSubmit, onSceneUpdate, onSceneDelete }
}
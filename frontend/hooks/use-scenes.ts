"use client"

import { createScene, deleteScene, getScenes, updateScene } from "@/lib/actions/scene.actions"
import { Scene } from "@/lib/models/scene.model"
import socket from "@/lib/socket"
import { SCENE_STATUSES, SCENE_TYPES } from "@/lib/utils/constants"
import { useEffect, useState } from "react"

type SceneCreateInput = {
    title: string
    description?: string
    type: typeof SCENE_TYPES[number]
    status: typeof SCENE_STATUSES[number]
}

type SceneUpdateInput = {
    title?: string
    description?: string
    image_url?: string
    type?: typeof SCENE_TYPES[number]
    status?: typeof SCENE_STATUSES[number]
}

export const useScenes = (projectId: number, token: string) => {
    const [scenes, setScenes] = useState<Scene[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (token) {
            setIsLoading(true)
            getScenes(token, projectId).then(setScenes).finally(() => setIsLoading(false))
        }
    }, [token, projectId])

    useEffect(() => {
        const handler = (data: { action: string; scene: Scene }) => {
            if (data.action === "created") {
                setScenes(prev => [...prev, data.scene])
            } else if (data.action === "updated") {
                setScenes(prev => prev.map(s => s.id === data.scene.id ? data.scene : s))
            } else if (data.action === "deleted") {
                setScenes(prev => prev.filter(s => s.id !== data.scene.id))
            }
        }
        socket.on("scene:updated", handler)
        return () => { socket.off("scene:updated", handler) }
    }, [])

    const onSceneCreate = async (data: SceneCreateInput) => {
        if (!token) return
        await createScene(token, projectId, data)
    }

    const onSceneUpdate = async (sceneId: number, data: SceneUpdateInput) => {
        try {
            if (!token) return
            await updateScene(token, projectId, sceneId, data)
        } catch {}
    }

    const onSceneDelete = async (sceneId: number) => {
        try {
            if (!token) return
            await deleteScene(token, projectId, sceneId)
        } catch {}
    }

    return { scenes, isLoading, onSceneCreate, onSceneUpdate, onSceneDelete }
}

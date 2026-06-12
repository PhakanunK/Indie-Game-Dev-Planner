"use client"

import { addSceneLink, createScene, deleteScene, getScenes, removeSceneLink, updateScene } from "@/lib/actions/scene.actions"
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
    pos_x?: number
    pos_y?: number
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
        if (!token) return
        await updateScene(token, projectId, sceneId, data)
    }

    const onSceneDelete = async (sceneId: number) => {
        try {
            if (!token) return
            await deleteScene(token, projectId, sceneId)
        } catch {}
    }

    const onSceneLinkAdd = async (fromSceneId: number, toSceneId: number, label?: string) => {
        if (!token) return
        const link = await addSceneLink(token, projectId, fromSceneId, { to_scene_id: toSceneId, label })
        setScenes(prev => prev.map(s =>
            s.id === fromSceneId
                ? { ...s, outgoinglinks: [...(s.outgoinglinks ?? []), link] }
                : s
        ))
    }

    const onSceneLinkRemove = async (fromSceneId: number, linkId: number) => {
        if (!token) return
        await removeSceneLink(token, projectId, fromSceneId, linkId)
        setScenes(prev => prev.map(s =>
            s.id === fromSceneId
                ? { ...s, outgoinglinks: (s.outgoinglinks ?? []).filter(l => l.id !== linkId) }
                : s
        ))
    }

    return { scenes, isLoading, onSceneCreate, onSceneUpdate, onSceneDelete, onSceneLinkAdd, onSceneLinkRemove }
}

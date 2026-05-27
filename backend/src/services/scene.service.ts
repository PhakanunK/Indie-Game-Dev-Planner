import { create, createLink, deleteById, deleteLink, findAllByProjectId, findById, update } from "../repositories/scene.repository"
import { CreateSceneData, CreateSceneLinkData, UpdateSceneData } from "../schemas/scene.schema"
import { emitSceneUpdated } from "../sockets/emitter"
import { logActivity } from "./activity.service"

export const getScenes = async (projectId: number) => {
    return await findAllByProjectId(projectId)
}

export const createScene = async (projectId: number, ownerId: number, data: CreateSceneData) => {
    const scene = await create(projectId, ownerId, data)
    emitSceneUpdated(projectId, scene, "created")
    await logActivity(projectId, ownerId, `created scene '${scene.title}'`, "scene", scene.id)
    return scene
}

export const updateScene = async (projectId: number, userId: number, id: number, data: UpdateSceneData) => {
    const scene = await findById(id)
    if (!scene || scene.project_id !== projectId) {
        throw new Error("Scene not found")
    }
    const updated = await update(id, data)
    emitSceneUpdated(projectId, updated, "updated")
    await logActivity(projectId, userId, `updated scene '${scene.title}'`, "scene", scene.id)
    return updated
}

export const deleteScene = async (projectId: number, userId: number, id: number) => {
    const scene = await findById(id)
    if (!scene || scene.project_id !== projectId) {
        throw new Error("Scene not found")
    }
    emitSceneUpdated(projectId, scene, "deleted")
    await logActivity(projectId, userId, `deleted scene '${scene.title}'`, "scene", scene.id)
    return await deleteById(id)
}

export const addSceneLink = async (projectId: number, id: number, data: CreateSceneLinkData) => {
    const scene = await findById(id)
    if (!scene || scene.project_id !== projectId) {
        throw new Error("Scene not found")
    }
    return await createLink(id, data)
}

export const removeSceneLink = async (projectId: number, id: number, linkId: number) => {
    const scene = await findById(id)
    if (!scene|| scene.project_id !== projectId) {
        throw new Error("Scene not found")
    }
    return await deleteLink(linkId)
}
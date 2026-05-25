import { create, createLink, deleteById, deleteLink, findAllByProjectId, findById, update } from "../repositories/scene.repository"
import { CreateSceneData, CreateSceneLinkData, UpdateSceneData } from "../schemas/scene.schema"

export const getScenes = async (projectId: number) => {
    return await findAllByProjectId(projectId)
}

export const createScene = async (projectId: number, ownerId: number, data: CreateSceneData) => {
    return await create(projectId, ownerId, data)
}

export const updateScene = async (projectId: number, id: number, data: UpdateSceneData) => {
    const scene = await findById(id)
    if (!scene || scene.project_id !== projectId) {
        throw new Error("Scene not found")
    }
    return await update(id, data)
}

export const deleteScene = async (projectId: number, id: number) => {
    const scene = await findById(id)
    if (!scene || scene.project_id !== projectId) {
        throw new Error("Scene not found")
    }
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
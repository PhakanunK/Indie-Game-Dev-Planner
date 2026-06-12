import { CreateSceneData, CreateSceneLinkData, UpdateSceneData } from "../schemas/scene.schema"
import { prisma } from "../utils/prisma"

export const findAllByProjectId = (projectId: number) => {
    return prisma.scene.findMany({
        where: {project_id: projectId},
        include: {outgoinglinks: true}
    })
}

export const findById = (id: number) => {
    return prisma.scene.findUnique({where: {id}, include: {outgoinglinks: true}})
}

export const create = (projectId: number, ownerId: number, data: CreateSceneData) => {
    return prisma.scene.create({
        data: {
            ...data,
            project_id: projectId,
            created_by_id: ownerId,
        },
        include: {outgoinglinks: true}
    })
}

export const update = (id: number, data: UpdateSceneData) => {
    return prisma.scene.update({where: {id}, data, include: {outgoinglinks: true}})
}

export const deleteById = (id: number) => {
    return prisma.scene.delete({where: {id}})
}

export const createLink = (id: number, data: CreateSceneLinkData) => {
    return prisma.sceneLink.create({
        data: {
            ...data,
            from_scene_id: id
        }
    })
}

export const deleteLink = (linkId: number) => {
    return prisma.sceneLink.delete({where: {id: linkId}})
}
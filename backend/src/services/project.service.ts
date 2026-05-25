import { findMember } from "../repositories/member.repository"
import { create, deleteById, findAllByUserId, findById, update } from "../repositories/project.repository"
import { CreateProjectData, UpdateProjectData } from "../schemas/project.schema"

export const getProjects = async (userId: number) => {
    return await findAllByUserId(userId)
}

export const getProject = async (id: number, userId: number) => {
    const project = await findById(id)
    if (!project) {
        throw new Error("Project not found")
    }
    const isMember = await findMember(id, userId)
    if (!isMember) {
        throw new Error("Unauthorized")
    }
    return project
}

export const createProject = async (ownerId: number, data: CreateProjectData) => {
    return await create(ownerId, data)
}

export const updateProject = async (id: number, data: UpdateProjectData, userId: number) => {
    const project = await findById(id)
    if (!project) {
        throw new Error("Project not found")
    }
    if (project.owner_id !== userId) {
        throw new Error("Unauthorized")
    }
    return await update(id, data)
}

export const deleteProject = async (id: number,  userId: number) => {
    const project = await findById(id)
    if (!project) {
        throw new Error("Project not found")
    }
    if (project.owner_id !== userId) {
        throw new Error("Unauthorized")
    }
    return await deleteById(id)
}
import crypto from "crypto"
import { create as createInvite, findByToken, markUsed } from "../repositories/invite.repository"
import { create as createMember, findAllByProjectId, findMember, removeById } from "../repositories/member.repository"
import { findById } from "../repositories/project.repository"

export const generateInvite = async (projectId: number, createdBy: number) => {
    const project = await findById(projectId)
    if (!project) {
        throw new Error("Project not found")
    }
    if (project.owner_id !== createdBy) {
        throw new Error("Unauthorized")
    }
    const token = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate()+7)
    return await createInvite(projectId, token, createdBy, expiresAt)
}

export const acceptInvite = async (token: string, userId: number) => {
    const invitation = await findByToken(token)
    if (!invitation) {
        throw new Error("Invalid token")
    }
    if (invitation.used) {
        throw new Error("Token already used")
    }
    const today = new Date()
    if (invitation.expires_at < today) {
        throw new Error("Token expired")
    }
    await markUsed(invitation.id)
    return await createMember(invitation.project_id, userId)
}

export const getMember = async (projectId: number, userId: number) => {
    const isMember = await findMember(projectId, userId)
    if (!isMember) {
        throw new Error("Unauthorized")
    }
    return await findAllByProjectId(projectId)
}

export const removeMember = async (projectId: number, userId: number, ownerId: number) => {
    const project = await findById(projectId)
    if (!project) {
        throw new Error("Project not found")
    }
    if (project.owner_id !== ownerId) {
        throw new Error("Unauthorized")
    }
    return removeById(projectId, userId)
}
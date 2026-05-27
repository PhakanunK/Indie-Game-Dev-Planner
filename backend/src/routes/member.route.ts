import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { generateInvite, getMembers, removeMember } from "../services/member.service";

const memberRouter = Router({mergeParams: true})

memberRouter.post("/invite", authenticate, async (req, res) => {
    try {
        const projectId = Number(req.params.id)
        const invitation = await generateInvite(projectId, req.userId)
        res.status(201).json(invitation.token)
    } catch(error) {
        res.status(400).json({message: "Something went wrong"})
    }
})

memberRouter.get("/members", authenticate, async (req, res) => {
    try {
        const projectId = Number(req.params.id)
        const member = await getMembers(projectId, req.userId)
        res.status(200).json(member)
    } catch(error) {
        res.status(400).json({message: "Something went wrong"})
    }
})

memberRouter.delete("/members/:userId", authenticate, async (req, res) => {
    try {
        const projectId = Number(req.params.id)
        const userId = Number(req.params.userId)
        await removeMember(projectId, userId, req.userId)
        res.status(200).json({message: "User removed"})
    } catch(error) {
        res.status(400).json({message: "Something went wrong"})
    }
})

export default memberRouter
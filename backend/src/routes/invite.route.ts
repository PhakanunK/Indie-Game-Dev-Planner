import { Router } from "express"
import { authenticate } from "../middlewares/auth"
import { acceptInvite } from "../services/member.service"

const inviteRouter = Router()

inviteRouter.post("/:token/accept", authenticate, async (req, res) => {
    try {
        const token = String(req.params.token)
        await acceptInvite(token, req.userId)
        res.status(200).json({message: "Joined project"})
    } catch(error) {
        res.status(400).json({message: "Something went wrong"})
    }
})

export default inviteRouter
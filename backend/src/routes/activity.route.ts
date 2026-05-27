import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { getActivities } from "../services/activity.service";

const activityRouter = Router({mergeParams: true})

activityRouter.get("/", authenticate, async (req, res) => {
    const projectId = Number(req.params.id)
    try {
        const activity = await getActivities(projectId)
        res.status(200).json(activity)
    } catch (error) {
        res.status(400).json({message:"Something went wrong"})
    }
})

export default activityRouter
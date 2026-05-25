import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { createProject, deleteProject, getProject, getProjects, updateProject } from "../services/project.service";
import { createProjectSchema, updateProjectSchema } from "../schemas/project.schema";

const projectRouter = Router()

projectRouter.get("/", authenticate, async (req, res) => {
    try {
        const project = await getProjects(req.userId)
        res.status(200).json(project)
    } catch (error) {
        res.status(400).json({message:"Something went wrong"})
    }
})

projectRouter.post("/", authenticate, async (req, res) => {
    try {
        const body = createProjectSchema.parse(req.body)
        const project = await createProject(req.userId, body)
        res.status(201).json(project)
    } catch(error) {
        res.status(400).json({message:"Something went wrong"})
    }
})

projectRouter.get("/:id", authenticate, async (req, res) => {
    const id = Number(req.params.id)
    try {
        const project = await getProject(id, req.userId)
        res.status(200).json(project)
    } catch (error) {
        res.status(400).json({message: "Something went wrong"})
    }
})

projectRouter.patch("/:id", authenticate, async (req, res) => {
    const id = Number(req.params.id)
    try {
        const body = updateProjectSchema.parse(req.body)
        const project = await updateProject(id, body, req.userId)
        res.status(200).json(project)
    } catch(error) {
        res.status(400).json({message: "Something went wrong"})
    }
})

projectRouter.delete("/:id", authenticate, async (req, res) => {
    const id = Number(req.params.id)
    try {
        await deleteProject(id, req.userId)
        res.status(200).json({message: "Project deleted"})
    } catch (error) {
        res.status(400).json({message: "Something went wrong"})
    }
})

export default projectRouter
import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { addSceneLink, createScene, deleteScene, getScenes, removeSceneLink, updateScene } from "../services/scene.service";
import { createSceneLinkSchema, createSceneSchema, updateSceneSchema } from "../schemas/scene.schema";

const sceneRouter = Router({mergeParams: true})

sceneRouter.get("/", authenticate, async (req, res) => {
    const projectId = Number(req.params.id)
    try {
        const scene = await getScenes(projectId)
        res.status(200).json(scene)
    } catch (error) {
        res.status(400).json({message:"Something went wrong"})
    }
})

sceneRouter.post("/", authenticate, async (req, res) => {
    const projectId = Number(req.params.id)
    try {
        const body = createSceneSchema.parse(req.body)
        const scene = await createScene(projectId, req.userId, body)
        res.status(201).json(scene)
    } catch(error) {
        res.status(400).json({message:"Something went wrong"})
    }
})

sceneRouter.patch("/:sceneId", authenticate, async (req, res) => {
    const projectId = Number(req.params.id)
    const sceneId = Number(req.params.sceneId)
    try {
        const body = updateSceneSchema.parse(req.body)
        const scene = await updateScene(projectId, req.userId, sceneId, body)
        res.status(200).json(scene)
    } catch(error) {
        res.status(400).json({message:"Something went wrong"})
    }
})

sceneRouter.delete("/:sceneId", authenticate, async (req, res) => {
    const projectId = Number(req.params.id)
    const sceneId = Number(req.params.sceneId)
    try {
        await deleteScene(projectId, req.userId, sceneId)
        res.status(200).json({message: "Scene deleted"})
    } catch(error) {
        res.status(400).json({message:"Something went wrong"})
    }
})

sceneRouter.post("/:sceneId/links", authenticate, async (req, res) => {
    const projectId = Number(req.params.id)
    const sceneId = Number(req.params.sceneId)
    try {
        const body = createSceneLinkSchema.parse(req.body)
        const sceneLink = await addSceneLink(projectId, sceneId, body)
        res.status(201).json(sceneLink)
    } catch(error) {
        res.status(400).json({message:"Something went wrong"})
    }
})

sceneRouter.delete("/:sceneId/links/:linkId", authenticate, async (req, res) => {
    const projectId = Number(req.params.id)
    const sceneId = Number(req.params.sceneId)
    const linkId = Number(req.params.linkId)
    try {
        await removeSceneLink(projectId, sceneId, linkId)
        res.status(200).json({message: "Scene link deleted"})
    } catch(error) {
        res.status(400).json({message:"Something went wrong"})
    }
})

export default sceneRouter
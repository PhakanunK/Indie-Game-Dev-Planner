import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { createTask, deleteTask, getTasks, reorderTasks, updateTask } from "../services/task.service";
import { createTaskSchema, reorderTaskSchema, updateTaskSchema } from "../schemas/task.schema";

const taskRouter = Router({mergeParams: true})

taskRouter.get("/", authenticate, async (req, res) => {
    const projectId = Number(req.params.id)
    try {
        const task = await getTasks(projectId)
        res.status(200).json(task)
    } catch (error) {
        res.status(400).json({message:"Something went wrong"})
    }
})

taskRouter.post("/", authenticate, async (req, res) => {
    const projectId = Number(req.params.id)
    try {
        const body = createTaskSchema.parse(req.body)
        const task = await createTask(projectId, req.userId, body)
        res.status(201).json(task)
    } catch(error) {
        res.status(400).json({message:"Something went wrong"})
    }
})

taskRouter.patch("/reorder", authenticate, async (req, res) => {
    const projectId = Number(req.params.id)
    try {
        const body = reorderTaskSchema.parse(req.body)
        await reorderTasks(projectId, body.orderedIds)
        res.status(200).json({message:"Tasks reordered"})
    } catch(error) {
        res.status(400).json({message:"Something went wrong"})
    }
})

taskRouter.patch("/:taskId", authenticate, async (req, res) => {
    const projectId = Number(req.params.id)
    const taskId = Number(req.params.taskId)
    try {
        const body = updateTaskSchema.parse(req.body)
        const task = await updateTask(projectId, req.userId, taskId, body)
        res.status(200).json(task)
    } catch(error) {
        res.status(400).json({message:"Something went wrong"})
    }
})

taskRouter.delete("/:taskId", authenticate, async (req, res) => {
    const projectId = Number(req.params.id)
    const taskId = Number(req.params.taskId)
    try {
        await deleteTask(projectId, req.userId, taskId)
        res.status(200).json({message: "Task deleted"})
    } catch(error) {
        res.status(400).json({message:"Something went wrong"})
    }
})

export default taskRouter
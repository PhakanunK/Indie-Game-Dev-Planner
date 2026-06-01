import { Router } from "express";
import { getMe, login, register } from "../services/auth.service";
import { authenticate } from "../middlewares/auth";
import { loginSchema, registerSchema } from "../schemas/auth.schema";

const authRouter = Router()

authRouter.post("/register", async (req, res) => {
    try {
        const body = registerSchema.parse(req.body)
        const user = await register(body.email, body.username, body.password)
        res.status(201).json(user)
    } catch (error) {
        res.status(400).json({message: "Registration failed"})
    }
})

authRouter.post("/login", async (req, res) => {
    try {
        const body = loginSchema.parse(req.body)
        const token = await login(body.email, body.password)
        res.status(200).json(token)
    } catch(error) {
        res.status(400).json({message: "Login failed"})
    }
})

authRouter.get("/me", authenticate, async (req, res) => {
    try {
        const user = await getMe(req.userId)
        res.status(200).json(user)
    } catch(error) {
        res.status(404).json({message: "User not found"})
    }
})

export default authRouter
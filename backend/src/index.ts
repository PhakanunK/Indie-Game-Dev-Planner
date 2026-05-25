import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route";
import projectRouter from "./routes/project.route";
import memberRouter from "./routes/member.route";
import inviteRouter from "./routes/invite.route";
import taskRouter from "./routes/task.route";
import sceneRouter from "./routes/scene.route";

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use("/auth", authRouter)
app.use("/projects", projectRouter)
app.use("/projects/:id", memberRouter)
app.use("/invites", inviteRouter)
app.use("/projects/:id/tasks", taskRouter)
app.use("/projects/:id/scenes", sceneRouter)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

export default app
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route";
import projectRouter from "./routes/project.route";

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use("/auth", authRouter)
app.use("/projects", projectRouter)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

export default app
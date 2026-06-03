"use client"

import { useAuth } from "@/contexts/auth"
import { createProject, getProjects } from "@/lib/actions/project.actions"
import { Project } from "@/lib/models/project.model"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const schema = z.object({
    name: z.string().min(1),
    genre: z.string().min(1),
    engine: z.string().min(1),
    platform: z.string().min(1),
    description: z.string().optional()
})

type FormData = z.infer<typeof schema>

export const useDashboard = () => {
    const form = useForm<FormData>({ resolver: zodResolver(schema) })
    const [projects, setProjects] = useState<Project[]>([])
    const { token } = useAuth()
    useEffect(() => {
        if (token) {
            getProjects(token).then(setProjects)
        }
    }, [token])
    const onSubmit = async (data: FormData) => {
        try {
            if (!token) {
                return
            }
            const newProject = await createProject(token, data)
            setProjects(prev => [...prev, newProject])
        } catch {
            form.setError("root", { message: "Failed to create project" })
        }

    }
    return { projects, form, onSubmit }
}
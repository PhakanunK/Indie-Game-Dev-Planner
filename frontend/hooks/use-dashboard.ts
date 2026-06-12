"use client"

import { useAuth } from "@/contexts/auth"
import { createProject, getProjects } from "@/lib/actions/project.actions"
import { Project } from "@/lib/models/project.model"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
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
    const [isLoading, setIsLoading] = useState(true)
    const { token } = useAuth()
    useEffect(() => {
        if (token) {
            setIsLoading(true)
            getProjects(token).then(setProjects).finally(() => setIsLoading(false))
        }
    }, [token])
    const onSubmit = async (data: FormData) => {
        try {
            if (!token) {
                return
            }
            const newProject = await createProject(token, data)
            setProjects(prev => [...prev, newProject])
            toast.success("Project created")
        } catch {
            toast.error("Failed to create project")
            form.setError("root", { message: "Failed to create project" })
        }

    }
    return { projects, isLoading, form, onSubmit }
}
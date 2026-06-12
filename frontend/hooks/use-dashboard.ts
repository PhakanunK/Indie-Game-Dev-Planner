"use client"

import { useAuth } from "@/contexts/auth"
import { createProject, getProjects } from "@/lib/actions/project.actions"
import { ProjectFormData } from "@/components/projects/project-dialog"
import { Project } from "@/lib/models/project.model"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export const useDashboard = () => {
    const [projects, setProjects] = useState<Project[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const { token } = useAuth()
    useEffect(() => {
        if (token) {
            setIsLoading(true)
            getProjects(token).then(setProjects).finally(() => setIsLoading(false))
        }
    }, [token])
    const onProjectCreate = async (data: ProjectFormData) => {
        if (!token) return
        const newProject = await createProject(token, data)
        setProjects(prev => [...prev, newProject])
        toast.success("Project created")
    }
    return { projects, isLoading, onProjectCreate }
}

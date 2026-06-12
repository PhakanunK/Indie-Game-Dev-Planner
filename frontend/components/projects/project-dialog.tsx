"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Project } from "@/lib/models/project.model"
import FormDialog, { FormField } from "@/components/form-dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const projectSchema = z.object({
    name: z.string().min(1, "Name is required"),
    genre: z.string().min(1, "Genre is required"),
    engine: z.string().min(1, "Engine is required"),
    platform: z.string().min(1, "Platform is required"),
    description: z.string().optional()
})

export type ProjectFormData = z.infer<typeof projectSchema>

interface ProjectDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (data: ProjectFormData) => Promise<void>
    project?: Project
}

export default function ProjectDialog({ open, onOpenChange, onSubmit, project }: ProjectDialogProps) {
    const form = useForm<ProjectFormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: { name: "", genre: "", engine: "", platform: "", description: "" }
    })

    useEffect(() => {
        if (open) {
            form.reset({
                name: project?.name ?? "",
                genre: project?.genre ?? "",
                engine: project?.engine ?? "",
                platform: project?.platform ?? "",
                description: project?.description ?? ""
            })
        }
    }, [open, project])

    const handleSubmit = async (data: ProjectFormData) => {
        try {
            await onSubmit(data)
            toast.success("Project updated")
            onOpenChange(false)
        } catch (err) {
            const message = err instanceof Error ? err.message : "Something went wrong"
            toast.error(message)
            form.setError("root", { message })
        }
    }

    return (
        <FormDialog
            title={project ? "Edit Project" : "Create Project"}
            open={open}
            onOpenChange={onOpenChange}
            onSubmit={form.handleSubmit(handleSubmit)}
            submitLabel={project ? "Save" : "Create"}
        >
            <FormField label="Name">
                <Input {...form.register("name")} placeholder="Project name" />
                {form.formState.errors.name && (
                    <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>
                )}
            </FormField>
            <FormField label="Genre">
                <Input {...form.register("genre")} placeholder="e.g. RPG, Platformer" />
                {form.formState.errors.genre && (
                    <p className="text-sm text-destructive mt-1">{form.formState.errors.genre.message}</p>
                )}
            </FormField>
            <FormField label="Engine">
                <Input {...form.register("engine")} placeholder="e.g. Unity, Godot" />
                {form.formState.errors.engine && (
                    <p className="text-sm text-destructive mt-1">{form.formState.errors.engine.message}</p>
                )}
            </FormField>
            <FormField label="Platform">
                <Input {...form.register("platform")} placeholder="e.g. PC, Mobile" />
                {form.formState.errors.platform && (
                    <p className="text-sm text-destructive mt-1">{form.formState.errors.platform.message}</p>
                )}
            </FormField>
            <FormField label="Description">
                <Textarea {...form.register("description")} placeholder="Short project description" rows={3} />
            </FormField>
            {form.formState.errors.root && (
                <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
            )}
        </FormDialog>
    )
}

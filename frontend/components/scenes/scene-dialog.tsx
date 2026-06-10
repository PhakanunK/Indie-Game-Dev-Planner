"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Scene } from "@/lib/models/scene.model"
import { SCENE_STATUSES, SCENE_TYPES } from "@/lib/utils/constants"
import FormDialog, { FormField } from "@/components/form-dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const TYPE_LABELS: Record<typeof SCENE_TYPES[number], string> = {
    cutscene: "Cutscene",
    gameplay: "Gameplay",
    boss: "Boss",
    dialogue: "Dialogue",
    other: "Other"
}

const STATUS_LABELS: Record<typeof SCENE_STATUSES[number], string> = {
    planned: "Planned",
    in_progress: "In Progress",
    done: "Done"
}

const sceneSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    type: z.enum(SCENE_TYPES),
    status: z.enum(SCENE_STATUSES)
})

export type SceneFormData = z.infer<typeof sceneSchema>

interface SceneDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (data: SceneFormData) => Promise<void>
    scene?: Scene
}

export default function SceneDialog({ open, onOpenChange, onSubmit, scene }: SceneDialogProps) {
    const form = useForm<SceneFormData>({
        resolver: zodResolver(sceneSchema),
        defaultValues: { title: "", description: "", type: "gameplay", status: "planned" }
    })

    useEffect(() => {
        if (open) {
            form.reset({
                title: scene?.title ?? "",
                description: scene?.description ?? "",
                type: scene?.type ?? "gameplay",
                status: scene?.status ?? "planned"
            })
        }
    }, [open, scene])

    const handleSubmit = async (data: SceneFormData) => {
        try {
            await onSubmit(data)
            onOpenChange(false)
        } catch {
            form.setError("root", { message: "Something went wrong" })
        }
    }

    return (
        <FormDialog
            title={scene ? "Edit Scene" : "Create Scene"}
            open={open}
            onOpenChange={onOpenChange}
            onSubmit={form.handleSubmit(handleSubmit)}
            submitLabel={scene ? "Save" : "Create"}
        >
            <FormField label="Title">
                <Input {...form.register("title")} placeholder="Scene title" />
                {form.formState.errors.title && (
                    <p className="text-sm text-destructive mt-1">{form.formState.errors.title.message}</p>
                )}
            </FormField>
            <FormField label="Description">
                <Textarea {...form.register("description")} placeholder="What happens in this scene?" rows={3} />
            </FormField>
            <FormField label="Type">
                <Select
                    value={form.watch("type")}
                    onValueChange={(value) => form.setValue("type", value as typeof SCENE_TYPES[number])}
                >
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                        {SCENE_TYPES.map(t => (
                            <SelectItem key={t} value={t}>{TYPE_LABELS[t]}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </FormField>
            <FormField label="Status">
                <Select
                    value={form.watch("status")}
                    onValueChange={(value) => form.setValue("status", value as typeof SCENE_STATUSES[number])}
                >
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select status" /></SelectTrigger>
                    <SelectContent>
                        {SCENE_STATUSES.map(s => (
                            <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </FormField>
            {form.formState.errors.root && (
                <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
            )}
        </FormDialog>
    )
}

"use client"

import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Scene } from "@/lib/models/scene.model"
import { SCENE_STATUSES, SCENE_TYPES } from "@/lib/utils/constants"
import { uploadSceneImage } from "@/lib/actions/storage.actions"
import FormDialog, { FormField } from "@/components/form-dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ImageIcon, X } from "lucide-react"
import Image from "next/image"

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
    image_url: z.string().optional(),
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
        defaultValues: { title: "", description: "", image_url: undefined, type: "gameplay", status: "planned" }
    })
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (open) {
            form.reset({
                title: scene?.title ?? "",
                description: scene?.description ?? "",
                image_url: scene?.image_url ?? undefined,
                type: scene?.type ?? "gameplay",
                status: scene?.status ?? "planned"
            })
            setImageFile(null)
            setImagePreview(scene?.image_url ?? null)
        }
    }, [open, scene])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setImageFile(file)
        setImagePreview(URL.createObjectURL(file))
    }

    const handleRemoveImage = () => {
        setImageFile(null)
        setImagePreview(null)
        form.setValue("image_url", undefined)
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    const handleSubmit = async (data: SceneFormData) => {
        try {
            if (imageFile) {
                data.image_url = await uploadSceneImage(imageFile)
            } else if (!imagePreview) {
                data.image_url = undefined
            }
            await onSubmit(data)
            toast.success(scene ? "Scene updated" : "Scene created")
            onOpenChange(false)
        } catch (err) {
            const message = err instanceof Error ? err.message : "Something went wrong"
            toast.error(message)
            form.setError("root", { message })
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
            <FormField label="Image">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                />
                {imagePreview ? (
                    <div className="relative w-full h-32 rounded-md overflow-hidden border border-border">
                        <Image src={imagePreview} alt="Scene preview" fill className="object-cover" />
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6"
                            onClick={handleRemoveImage}
                        >
                            <X size={12} />
                        </Button>
                    </div>
                ) : (
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <ImageIcon size={14} className="mr-2" />
                        Upload image
                    </Button>
                )}
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

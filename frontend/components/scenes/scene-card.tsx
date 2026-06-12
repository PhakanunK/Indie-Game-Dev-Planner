"use client"

import { Scene } from "@/lib/models/scene.model"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import Image from "next/image"

const TYPE_LABELS: Record<Scene["type"], string> = {
    cutscene: "Cutscene",
    gameplay: "Gameplay",
    boss: "Boss",
    dialogue: "Dialogue",
    other: "Other"
}

const STATUS_LABELS: Record<Scene["status"], string> = {
    planned: "Planned",
    in_progress: "In Progress",
    done: "Done"
}

interface SceneCardProps {
    scene: Scene
    onEdit: (scene: Scene) => void
    onDelete: (scene: Scene) => void
}

export default function SceneCard({ scene, onEdit, onDelete }: SceneCardProps) {
    return (
        <Card className="overflow-hidden">
            {scene.image_url && (
                <div className="relative w-full h-32">
                    <Image src={scene.image_url} alt={scene.title} fill className="object-cover" />
                </div>
            )}
            <CardHeader className="p-3 pb-1">
                <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm">{scene.title}</CardTitle>
                    <div className="flex gap-1 shrink-0">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onEdit(scene)}>
                            <Pencil size={12} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive" onClick={() => onDelete(scene)}>
                            <Trash2 size={12} />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-3 pt-1 flex flex-col gap-2">
                {scene.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">{scene.description}</p>
                )}
                <div className="flex gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {TYPE_LABELS[scene.type]}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {STATUS_LABELS[scene.status]}
                    </span>
                </div>
            </CardContent>
        </Card>
    )
}

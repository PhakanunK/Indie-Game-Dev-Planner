"use client"

import { useState } from "react"
import { TabsContent } from "./ui/tabs"
import { Button } from "./ui/button"
import { Scene } from "@/lib/models/scene.model"
import { useScenes } from "@/hooks/use-scenes"
import SceneCard from "./scenes/scene-card"
import SceneDialog from "./scenes/scene-dialog"
import SceneDeleteDialog from "./scenes/scene-delete-dialog"

type ScenesTabProps = {
    scenes: Scene[]
    isLoading: boolean
    onSceneCreate: ReturnType<typeof useScenes>["onSceneCreate"]
    onSceneUpdate: ReturnType<typeof useScenes>["onSceneUpdate"]
    onSceneDelete: ReturnType<typeof useScenes>["onSceneDelete"]
}

export default function ScenesTab({ scenes, isLoading, onSceneCreate, onSceneUpdate, onSceneDelete }: ScenesTabProps) {
    const [createOpen, setCreateOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [selectedScene, setSelectedScene] = useState<Scene | null>(null)

    if (isLoading) return (
        <TabsContent value="scenes">
            <p className="text-sm text-muted-foreground py-8 text-center">Loading scenes...</p>
        </TabsContent>
    )

    return (
        <TabsContent value="scenes">
            {scenes.length === 0 && (
                <p className="text-sm text-muted-foreground py-8 text-center">No scenes yet. Create your first scene.</p>
            )}
            <div className="grid grid-cols-3 gap-4">
                {scenes.map(scene => (
                    <SceneCard
                        key={scene.id}
                        scene={scene}
                        onEdit={(s) => { setSelectedScene(s); setEditOpen(true) }}
                        onDelete={(s) => { setSelectedScene(s); setDeleteOpen(true) }}
                    />
                ))}
            </div>

            <Button className="mt-4" onClick={() => setCreateOpen(true)}>Create Scene</Button>

            <SceneDialog
                open={createOpen}
                onOpenChange={setCreateOpen}
                onSubmit={onSceneCreate}
            />
            <SceneDialog
                open={editOpen}
                onOpenChange={setEditOpen}
                scene={selectedScene ?? undefined}
                onSubmit={(data) => onSceneUpdate(selectedScene!.id, data)}
            />
            <SceneDeleteDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                scene={selectedScene}
                onConfirm={() => selectedScene && onSceneDelete(selectedScene.id)}
            />
        </TabsContent>
    )
}

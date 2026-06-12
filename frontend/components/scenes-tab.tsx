"use client"

import { useState } from "react"
import { TabsContent } from "./ui/tabs"
import { Button } from "./ui/button"
import { Scene } from "@/lib/models/scene.model"
import { useScenes } from "@/hooks/use-scenes"
import SceneFlowCanvas from "./scenes/scene-flow-canvas"
import SceneDialog from "./scenes/scene-dialog"
import SceneDeleteDialog from "./scenes/scene-delete-dialog"

type ScenesTabProps = {
    scenes: Scene[]
    isLoading: boolean
    onSceneCreate: ReturnType<typeof useScenes>["onSceneCreate"]
    onSceneUpdate: ReturnType<typeof useScenes>["onSceneUpdate"]
    onSceneDelete: ReturnType<typeof useScenes>["onSceneDelete"]
    onSceneLinkAdd: ReturnType<typeof useScenes>["onSceneLinkAdd"]
    onSceneLinkRemove: ReturnType<typeof useScenes>["onSceneLinkRemove"]
}

export default function ScenesTab({ scenes, isLoading, onSceneCreate, onSceneUpdate, onSceneDelete, onSceneLinkAdd, onSceneLinkRemove  }: ScenesTabProps) {
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
        <TabsContent value="scenes" className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium text-muted-foreground">Scene Flow</h2>
                <Button size="sm" onClick={() => setCreateOpen(true)}>+ Create Scene</Button>
            </div>

            <div className="h-[calc(100vh-320px)] min-h-[400px] rounded-lg border border-border overflow-hidden">
                <SceneFlowCanvas
                    scenes={scenes}
                    onEdit={(s) => { setSelectedScene(s); setEditOpen(true) }}
                    onDelete={(s) => { setSelectedScene(s); setDeleteOpen(true) }}
                    onSceneUpdate={onSceneUpdate}
                    onSceneLinkAdd={onSceneLinkAdd}
                    onSceneLinkRemove={onSceneLinkRemove}
                />
            </div>

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

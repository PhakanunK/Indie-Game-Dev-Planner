"use client"

import { memo, useState } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Pencil, Trash2 } from "lucide-react"
import Image from "next/image"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { type SceneNodeData, type SceneNodeType } from "@/lib/utils/scene-flow-layout"

const TYPE_COLORS: Record<string, string> = {
    cutscene: "bg-purple-500/15 text-purple-400",
    gameplay: "bg-blue-500/15 text-blue-400",
    boss: "bg-red-500/15 text-red-400",
    dialogue: "bg-yellow-500/15 text-yellow-400",
    other: "bg-muted text-muted-foreground",
}

const STATUS_COLORS: Record<string, string> = {
    planned: "bg-muted text-muted-foreground",
    in_progress: "bg-blue-500/15 text-blue-500",
    done: "bg-green-500/15 text-green-500",
}

function SceneFlowNode({ data }: NodeProps<SceneNodeType>) {
    const { scene, onEdit, onDelete } = data
    const [imageOpen, setImageOpen] = useState(false)
    const [imgLoaded, setImgLoaded] = useState(false)

    const handleOpenChange = (open: boolean) => {
        setImageOpen(open)
        if (!open) setImgLoaded(false)
    }

    return (
        <div className="relative w-55">
            <Handle
                type="target"
                position={Position.Left}
                className="w-3! h-3! bg-primary! border-2! border-background!"
            />

            <Card className="overflow-hidden shadow-sm">
                {scene.image_url && (
                    <>
                        <div
                            className="relative w-full h-20 cursor-pointer"
                            onClick={() => setImageOpen(true)}
                            onMouseDown={e => e.stopPropagation()}
                        >
                            <Image src={scene.image_url} alt={scene.title} fill className="object-cover" />
                        </div>
                        <Dialog open={imageOpen} onOpenChange={handleOpenChange}>
                            <DialogContent className="w-fit max-w-[80vw] sm:max-w-[80vw] p-0 gap-0 overflow-hidden">
                                <VisuallyHidden><DialogTitle>{scene.title}</DialogTitle></VisuallyHidden>
                                {!imgLoaded && <div className="w-full h-48 bg-muted animate-pulse rounded" />}
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={scene.image_url}
                                    alt={scene.title}
                                    className={`block max-w-[80vw] max-h-[80vh] w-auto h-auto transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
                                    onLoad={() => setImgLoaded(true)}
                                />
                            </DialogContent>
                        </Dialog>
                    </>
                )}

                <CardHeader className="p-3 pb-1">
                    <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-sm line-clamp-2">{scene.title}</CardTitle>
                        <div className="flex gap-1 shrink-0" onMouseDown={e => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => onEdit(scene)}>
                                <Pencil size={10} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-5 w-5 text-destructive hover:text-destructive" onClick={() => onDelete(scene)}>
                                <Trash2 size={10} />
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-3 pt-1 flex flex-col gap-2">
                    {scene.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">{scene.description}</p>
                    )}

                    <div className="flex gap-2 flex-wrap">
                        <span className={`text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground`}>
                            {scene.type}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[scene.status]}`}>
                            {scene.status.replace("_", " ")}
                        </span>
                    </div>
                </CardContent>
            </Card>

            <Handle
                type="source"
                position={Position.Right}
                className="w-3! h-3! bg-primary! border-2! border-background!"
            />
        </div>
    )
}

export default memo(SceneFlowNode)

"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
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
    return (
        <div className="bg-card border border-border rounded-lg overflow-hidden w-55 shadow-sm">
            <Handle
                type="target"
                position={Position.Left}
                className="w-3! h-3! bg-primary! border-2! border-background!"
            />

            {scene.image_url && (
                <img
                    src={scene.image_url}
                    alt={scene.title}
                    className="w-full h-20 object-cover block"
                />
            )}

            <div className="p-3">
                <div className="flex items-start justify-between gap-1 mb-2">
                    <p className="text-sm font-medium leading-tight line-clamp-2">{scene.title}</p>
                    <div className="flex gap-0.5 shrink-0" onMouseDown={e => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => onEdit(scene)}>
                            <Pencil size={10} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-5 w-5 text-destructive hover:text-destructive" onClick={() => onDelete(scene)}>
                            <Trash2 size={10} />
                        </Button>
                    </div>
                </div>

                <div className="flex gap-1 flex-wrap">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${TYPE_COLORS[scene.type]}`}>
                        {scene.type}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${STATUS_COLORS[scene.status]}`}>
                        {scene.status.replace("_", " ")}
                    </span>
                </div>
            </div>

            <Handle
                type="source"
                position={Position.Right}
                className="w-3! h-3! bg-primary! border-2! border-background!"
            />
        </div>
    )
}

export default memo(SceneFlowNode)

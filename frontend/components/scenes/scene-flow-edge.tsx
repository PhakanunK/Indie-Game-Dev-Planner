"use client"

import { BaseEdge, EdgeLabelRenderer, getBezierPath, type EdgeProps } from "@xyflow/react"
import { X } from "lucide-react"
import { type SceneEdgeData } from "@/lib/utils/scene-flow-layout"

export default function SceneFlowEdge({
    id, sourceX, sourceY, targetX, targetY,
    sourcePosition, targetPosition, label, markerEnd, data
}: EdgeProps<SceneEdgeData>) {
    const [edgePath, labelX, labelY] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition })
    const { linkId, fromSceneId, onSceneLinkRemove } = data ?? {}

    return (
        <>
            <BaseEdge id={id} path={edgePath} markerEnd={markerEnd as string} />
            <EdgeLabelRenderer>
                <div
                    style={{ transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)` }}
                    className="absolute pointer-events-auto nodrag nopan flex items-center gap-1"
                >
                    {label && (
                        <span className="text-[10px] bg-card border border-border px-1.5 py-0.5 rounded">
                            {label}
                        </span>
                    )}
                    <button
                        onClick={() => onSceneLinkRemove?.(fromSceneId!, linkId!)}
                        className="w-4 h-4 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:opacity-80 transition-opacity"
                    >
                        <X size={8} />
                    </button>
                </div>
            </EdgeLabelRenderer>
        </>
    )
}

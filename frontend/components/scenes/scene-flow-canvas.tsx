"use client"

import { useCallback, useEffect, useMemo } from "react"
import {
    ReactFlow,
    Background,
    Controls,
    useNodesState,
    useEdgesState,
    type Connection,
    type Node,
    type NodeTypes,
    type EdgeTypes,
    BackgroundVariant,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { useTheme } from "next-themes"
import { Scene } from "@/lib/models/scene.model"
import { buildSceneFlowLayout, type SceneNodeType, type SceneEdgeType, type SceneEdgeData } from "@/lib/utils/scene-flow-layout"
import SceneFlowNode from "./scene-flow-node"
import SceneFlowEdge from "./scene-flow-edge"

const nodeTypes: NodeTypes = { sceneNode: SceneFlowNode as NodeTypes[string] }
const edgeTypes: EdgeTypes = { sceneEdge: SceneFlowEdge as EdgeTypes[string] }

type Props = {
    scenes: Scene[]
    onEdit: (scene: Scene) => void
    onDelete: (scene: Scene) => void
    onSceneUpdate: (sceneId: number, data: { pos_x?: number; pos_y?: number }) => Promise<void>
    onSceneLinkAdd: (fromSceneId: number, toSceneId: number) => Promise<void>
    onSceneLinkRemove: (fromSceneId: number, linkId: number) => Promise<void>
}

export default function SceneFlowCanvas({ scenes, onEdit, onDelete, onSceneUpdate, onSceneLinkAdd, onSceneLinkRemove }: Props) {
    const { theme } = useTheme()
    const [nodes, setNodes, onNodesChange] = useNodesState<SceneNodeType>([])
    const [edges, setEdges, onEdgesChange] = useEdgesState<SceneEdgeType>([])

    const sceneIds = useMemo(() => scenes.map(s => s.id).sort().join(","), [scenes])
    const linkKey = useMemo(
        () => scenes.map(s => `${s.id}:${(s.outgoinglinks ?? []).map(l => l.id).join(",")}`).join("|"),
        [scenes]
    )

    // Full re-layout when scene set changes
    useEffect(() => {
        if (!scenes.length) { setNodes([]); setEdges([]); return }
        const { nodes: n, edges: e } = buildSceneFlowLayout(scenes, onEdit, onDelete, onSceneLinkRemove)
        setNodes(n)
        setEdges(e)
    }, [sceneIds])

    // Edges only when links change — preserves node positions
    useEffect(() => {
        if (!scenes.length) return
        const { edges: e } = buildSceneFlowLayout(scenes, onEdit, onDelete, onSceneLinkRemove)
        setEdges(e)
    }, [linkKey])

    // Keep node/edge data fresh; also sync position from server (drives realtime updates)
    useEffect(() => {
        setNodes(prev => prev.map(node => {
            const scene = scenes.find(s => String(s.id) === node.id)
            if (!scene) return node
            const updated: typeof node = { ...node, data: { ...node.data, scene, onEdit, onDelete } }
            if (scene.pos_x != null && scene.pos_y != null) {
                updated.position = { x: scene.pos_x, y: scene.pos_y }
            }
            return updated
        }))
        setEdges(prev => prev.map(edge => ({
            ...edge,
            data: { ...edge.data, onSceneLinkRemove } as SceneEdgeData
        })))
    }, [scenes, onEdit, onDelete, onSceneLinkRemove])

    const onConnect = useCallback(async (connection: Connection) => {
        if (!connection.source || !connection.target) return
        await onSceneLinkAdd(Number(connection.source), Number(connection.target))
    }, [onSceneLinkAdd])

    const onNodeDragStop = useCallback(async (_: MouseEvent | TouchEvent, node: Node) => {
        await onSceneUpdate(Number(node.id), { pos_x: node.position.x, pos_y: node.position.y })
    }, [onSceneUpdate])

    if (scenes.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                No scenes yet. Create your first scene above.
            </div>
        )
    }

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeDragStop={onNodeDragStop}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            deleteKeyCode={null}
            colorMode={theme === "dark" ? "dark" : "light"}
            fitView
            fitViewOptions={{ padding: 0.2 }}
        >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
            <Controls />
        </ReactFlow>
    )
}

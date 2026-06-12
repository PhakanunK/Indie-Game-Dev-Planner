import dagre from "dagre"
import { MarkerType, type Edge, type Node } from "@xyflow/react"
import { Scene } from "@/lib/models/scene.model"

export const NODE_WIDTH = 220
export const NODE_HEIGHT = 90

export type SceneNodeData = {
    scene: Scene
    onEdit: (scene: Scene) => void
    onDelete: (scene: Scene) => void
}

export type SceneEdgeData = {
    linkId: number
    fromSceneId: number
    onSceneLinkRemove: (fromSceneId: number, linkId: number) => Promise<void>
}

export function buildSceneFlowLayout(
    scenes: Scene[],
    onEdit: (scene: Scene) => void,
    onDelete: (scene: Scene) => void,
    onSceneLinkRemove?: (fromSceneId: number, linkId: number) => Promise<void>
): { nodes: Node<SceneNodeData>[]; edges: Edge<SceneEdgeData>[] } {
    const g = new dagre.graphlib.Graph()
    g.setDefaultEdgeLabel(() => ({}))
    g.setGraph({ rankdir: "LR", ranksep: 80, nodesep: 40 })

    scenes.forEach(scene => {
        g.setNode(String(scene.id), { width: NODE_WIDTH, height: NODE_HEIGHT })
    })

    scenes.forEach(scene => {
        (scene.outgoinglinks ?? []).forEach(link => {
            g.setEdge(String(scene.id), String(link.to_scene_id))
        })
    })

    dagre.layout(g)

    const nodes: Node<SceneNodeData>[] = scenes.map(scene => {
        const pos = g.node(String(scene.id))
        // Use stored position if available, otherwise use dagre calculated position
        const x = scene.pos_x !== null && scene.pos_x !== undefined ? scene.pos_x : pos.x - NODE_WIDTH / 2
        const y = scene.pos_y !== null && scene.pos_y !== undefined ? scene.pos_y : pos.y - NODE_HEIGHT / 2
        return {
            id: String(scene.id),
            type: "sceneNode",
            position: { x, y },
            data: { scene, onEdit, onDelete },
        }
    })

    const edges: Edge<SceneEdgeData>[] = scenes.flatMap(scene =>
        (scene.outgoinglinks ?? []).map(link => ({
            id: String(link.id),
            source: String(link.from_scene_id),
            target: String(link.to_scene_id),
            type: "sceneEdge",
            label: link.label ?? undefined,
            markerEnd: { type: MarkerType.ArrowClosed },
            data: {
                linkId: link.id,
                fromSceneId: link.from_scene_id,
                onSceneLinkRemove: onSceneLinkRemove ?? (async () => {}),
            },
        }))
    )

    return { nodes, edges }
}

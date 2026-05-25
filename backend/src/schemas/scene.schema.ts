import { z } from "zod"

export const createSceneSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    image_url: z.string().optional(),
    type: z.enum(["cutscene", "gameplay", "boss", "dialogue", "other"]),
    status: z.enum(["planned", "in_progress", "done"]).default("planned")
})

export type CreateSceneData = z.infer<typeof createSceneSchema>

export const updateSceneSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    image_url: z.string().optional(),
    type: z.enum(["cutscene", "gameplay", "boss", "dialogue", "other"]).optional(),
    status: z.enum(["planned", "in_progress", "done"]).optional()
})

export type UpdateSceneData = z.infer<typeof updateSceneSchema>

export const createSceneLinkSchema = z.object({
    to_scene_id: z.int(),
    label: z.string().optional()
})

export type CreateSceneLinkData = z.infer<typeof createSceneLinkSchema>
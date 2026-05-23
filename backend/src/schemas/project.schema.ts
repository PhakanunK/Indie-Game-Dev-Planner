import { z } from "zod"

export const createProjectSchema = z.object({
    name: z.string(),
    genre: z.string(),
    engine: z.string(),
    platform: z.string(),
    description: z.string().optional()
})

export type CreateProjectData = z.infer<typeof createProjectSchema>

export const updateProjectSchema = z.object({
    name: z.string().optional(),
    genre: z.string().optional(),
    engine: z.string().optional(),
    platform: z.string().optional(),
    description: z.string().optional()
})

export type UpdateProjectData = z.infer<typeof updateProjectSchema>

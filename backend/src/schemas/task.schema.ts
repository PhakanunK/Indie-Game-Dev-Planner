import { z } from "zod"

export const createTaskSchema = z.object({
    title: z.string(),
    status: z.enum(["todo", "in_progress", "done"]).default("todo"),
    due_date: z.string().optional(),
    order: z.int()
})

export type CreateTaskData = z.infer<typeof createTaskSchema>

export const updateTaskSchema = z.object({
    title: z.string().optional(),
    status: z.enum(["todo", "in_progress", "done"]).optional(),
    due_date: z.string().optional(),
    order: z.int().optional()
})

export type UpdateTaskData = z.infer<typeof updateTaskSchema>

export const reorderTaskSchema = z.object({
    orderedIds: z.array(z.int())
})
"use client"

import { useTasks } from "@/hooks/use-tasks"
import { TabsContent } from "./ui/tabs"
import { Task } from "@/lib/models/task.model"
import { TASK_STATUSES } from "@/lib/utils/constants"
import { closestCenter, DndContext, DragEndEvent, DragOverlay, DragStartEvent, useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import TaskCard from "./task-card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

const COLUMN_LABELS: Record<typeof TASK_STATUSES[number], string> = {
    todo: "To Do",
    in_progress: "In Progress",
    done: "Done"
}

const PRIORITY_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 }

const VALID_TRANSITIONS: Record<string, string> = {
    todo: "in_progress",
    in_progress: "done"
}

type TasksTabProps = {
    tasks: Task[]
    form: ReturnType<typeof useTasks>["taskForm"]
    onSubmit: ReturnType<typeof useTasks>["onTaskSubmit"]
    onTaskUpdate: ReturnType<typeof useTasks>["onTaskUpdate"]
}

function DroppableColumn({ status, children }: { status: string, children: React.ReactNode }) {
    const { setNodeRef, isOver } = useDroppable({ id: status })
    return (
        <div
            ref={setNodeRef}
            className={`flex flex-col gap-2 min-h-24 rounded-md p-2 transition-colors ${isOver ? "bg-muted/60 ring-1 ring-border" : "bg-muted"}`}
        >
            {children}
        </div>
    )
}

export default function TasksTab({ tasks, form, onSubmit, onTaskUpdate }: TasksTabProps) {
    const [activeTask, setActiveTask] = useState<Task | null>(null)

    const handleDragStart = (event: DragStartEvent) => {
        const task = tasks.find(t => t.id === event.active.id)
        if (task) setActiveTask(task)
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        setActiveTask(null)
        if (!over) return

        const draggedTask = tasks.find(t => t.id === active.id)
        if (!draggedTask) return

        const overStatus = typeof over.id === "string"
            ? over.id as typeof TASK_STATUSES[number]
            : tasks.find(t => t.id === over.id)?.status

        if (!overStatus || draggedTask.status === overStatus) return
        if (VALID_TRANSITIONS[draggedTask.status] !== overStatus) return

        onTaskUpdate(draggedTask.id, { status: overStatus })
    }

    return (
        <TabsContent value="tasks">
            <DndContext collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-3 gap-4">
                    {TASK_STATUSES.map(status => {
                        const columnTasks = tasks
                            .filter(t => t.status === status)
                            .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])
                        return (
                            <div key={status} className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs uppercase tracking-widest text-muted-foreground">
                                        {COLUMN_LABELS[status]}
                                    </h3>
                                    <span className="text-xs text-muted-foreground">{columnTasks.length}</span>
                                </div>
                                <SortableContext items={columnTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                                    <DroppableColumn status={status}>
                                        {columnTasks.map(task => <TaskCard key={task.id} task={task} />)}
                                    </DroppableColumn>
                                </SortableContext>
                            </div>
                        )
                    })}
                </div>
                <DragOverlay>
                    {activeTask && (
                        <Card className="cursor-grabbing shadow-lg opacity-90">
                            <CardHeader className="p-3 pb-1">
                                <CardTitle className="text-sm">{activeTask.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-3 pt-0">
                                <p className="text-xs text-muted-foreground">{activeTask.priority}</p>
                                {activeTask.due_date && (
                                    <p className="text-xs text-muted-foreground">Due: {new Date(activeTask.due_date).toLocaleDateString()}</p>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </DragOverlay>
            </DndContext>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="mt-4">Create Task</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Task</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <Input {...form.register("title")} placeholder="Task title" />
                        {form.formState.errors.title && <p>{form.formState.errors.title.message}</p>}
                        <Select onValueChange={(value) => form.setValue("status", value as typeof TASK_STATUSES[number])}>
                            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                            <SelectContent>
                                {TASK_STATUSES.map(s => <SelectItem key={s} value={s}>{COLUMN_LABELS[s]}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        {form.formState.errors.root && <p>{form.formState.errors.root.message}</p>}
                        <Button type="submit" className="mt-2">Create</Button>
                    </form>
                </DialogContent>
            </Dialog>
        </TabsContent>
    )
}

"use client"

import { useState } from "react"
import { closestCenter, DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors, useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { TabsContent } from "./ui/tabs"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Task } from "@/lib/models/task.model"
import { TASK_STATUSES } from "@/lib/utils/constants"
import { useTasks } from "@/hooks/use-tasks"
import TaskCard from "./tasks/task-card"
import TaskDialog from "./tasks/task-dialog"
import TaskDeleteDialog from "./tasks/task-delete-dialog"

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

function DroppableColumn({ status, children }: { status: string; children: React.ReactNode }) {
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

type TasksTabProps = {
    tasks: Task[]
    isLoading: boolean
    onTaskCreate: ReturnType<typeof useTasks>["onTaskCreate"]
    onTaskUpdate: ReturnType<typeof useTasks>["onTaskUpdate"]
    onTaskDelete: ReturnType<typeof useTasks>["onTaskDelete"]
}

export default function TasksTab({ tasks, isLoading, onTaskCreate, onTaskUpdate, onTaskDelete }: TasksTabProps) {
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))
    const [activeTask, setActiveTask] = useState<Task | null>(null)
    const [createOpen, setCreateOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)

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

    if (isLoading) return (
        <TabsContent value="tasks">
            <p className="text-sm text-muted-foreground py-8 text-center">Loading tasks...</p>
        </TabsContent>
    )

    return (
        <TabsContent value="tasks">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
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
                                        {columnTasks.length === 0 && (
                                            <p className="text-xs text-muted-foreground text-center py-4">No tasks</p>
                                        )}
                                        {columnTasks.map(task => (
                                            <TaskCard
                                                key={task.id}
                                                task={task}
                                                onEdit={(t) => { setSelectedTask(t); setEditOpen(true) }}
                                                onDelete={(t) => { setSelectedTask(t); setDeleteOpen(true) }}
                                            />
                                        ))}
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

            <Button className="mt-4" onClick={() => setCreateOpen(true)}>Create Task</Button>

            <TaskDialog
                open={createOpen}
                onOpenChange={setCreateOpen}
                onSubmit={onTaskCreate}
            />
            <TaskDialog
                open={editOpen}
                onOpenChange={setEditOpen}
                task={selectedTask ?? undefined}
                onSubmit={(data) => onTaskUpdate(selectedTask!.id, data)}
            />
            <TaskDeleteDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                task={selectedTask}
                onConfirm={() => selectedTask && onTaskDelete(selectedTask.id)}
            />
        </TabsContent>
    )
}

"use client"

import { Task } from "@/lib/models/task.model"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"

interface TaskCardProps {
    task: Task
    onEdit: (task: Task) => void
    onDelete: (task: Task) => void
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1
    }
    return (
        <Card ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-grab">
            <CardHeader className="p-3 pb-1">
                <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm">{task.title}</CardTitle>
                    <div className="flex gap-1 shrink-0" onPointerDown={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onEdit(task)}>
                            <Pencil size={12} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive" onClick={() => onDelete(task)}>
                            <Trash2 size={12} />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-3 pt-0">
                <p className="text-xs text-muted-foreground">{task.priority}</p>
                {task.due_date && (
                    <p className="text-xs text-muted-foreground">Due: {new Date(task.due_date).toLocaleDateString()}</p>
                )}
            </CardContent>
        </Card>
    )
}

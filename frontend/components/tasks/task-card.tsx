"use client"

import { Task } from "@/lib/models/task.model"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"

const PRIORITY_STYLES: Record<string, string> = {
    high: "bg-red-500/15 text-red-500",
    medium: "bg-yellow-500/15 text-yellow-500",
    low: "bg-green-500/15 text-green-500"
}

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
                <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${PRIORITY_STYLES[task.priority]}`}>
                        {task.priority}
                    </span>
                    {task.due_date && (
                        <span className="text-xs text-muted-foreground">Due: {new Date(task.due_date).toLocaleDateString()}</span>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

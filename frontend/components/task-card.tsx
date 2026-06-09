"use client"

import { Task } from "@/lib/models/task.model";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function TaskCard({ task }: { task: Task }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1
    }
    return (
        <Card ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-grab">
            <CardHeader className="p-3 pb-1">
                <CardTitle className="text-sm">{task.title}</CardTitle>
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
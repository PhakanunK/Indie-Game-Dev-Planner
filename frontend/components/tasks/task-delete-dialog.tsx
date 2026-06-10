"use client"

import { Task } from "@/lib/models/task.model"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface TaskDeleteDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    task: Task | null
    onConfirm: () => void
}

export default function TaskDeleteDialog({ open, onOpenChange, task, onConfirm }: TaskDeleteDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Task</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                    Are you sure you want to delete{" "}
                    <span className="text-foreground font-medium">"{task?.title}"</span>?
                    This cannot be undone.
                </p>
                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={() => { onConfirm(); onOpenChange(false) }}>Delete</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

"use client"

import { toast } from "sonner"
import { Project } from "@/lib/models/project.model"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ProjectDeleteDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    project: Project
    onConfirm: () => Promise<void>
}

export default function ProjectDeleteDialog({ open, onOpenChange, project, onConfirm }: ProjectDeleteDialogProps) {
    const handleConfirm = async () => {
        try {
            await onConfirm()
            toast.success("Project deleted")
        } catch {
            toast.error("Failed to delete project")
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Project</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                    Are you sure you want to delete{" "}
                    <span className="text-foreground font-medium">"{project.name}"</span>?
                    This will permanently remove all tasks, scenes, and activity. This cannot be undone.
                </p>
                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={handleConfirm}>Delete</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

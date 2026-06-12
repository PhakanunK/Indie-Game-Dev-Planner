"use client"

import { toast } from "sonner"
import { Scene } from "@/lib/models/scene.model"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface SceneDeleteDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    scene: Scene | null
    onConfirm: () => void
}

export default function SceneDeleteDialog({ open, onOpenChange, scene, onConfirm }: SceneDeleteDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Scene</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                    Are you sure you want to delete{" "}
                    <span className="text-foreground font-medium">"{scene?.title}"</span>?
                    This cannot be undone.
                </p>
                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={() => { onConfirm(); onOpenChange(false); toast.success("Scene deleted") }}>Delete</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

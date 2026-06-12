import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"

interface FormDialogProps {
    title: string
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: () => void
    children: React.ReactNode
    submitLabel?: string
}

export default function FormDialog({ title, open, onOpenChange, onSubmit, children, submitLabel = "Save" }: FormDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-3">{children}</div>
                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={onSubmit}>{submitLabel}</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

interface FormFieldProps {
    label: string
    children: React.ReactNode
}

export function FormField({ label, children }: FormFieldProps) {
    return (
        <div className="flex items-start gap-3">
            <label className="text-sm font-medium w-20 shrink-0 pt-2">{label}</label>
            <div className="flex-1">{children}</div>
        </div>
    )
}
"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Task } from "@/lib/models/task.model"
import { TASK_PRIORITIES, TASK_STATUSES } from "@/lib/utils/constants"
import FormDialog, { FormField } from "@/components/form-dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

const COLUMN_LABELS: Record<typeof TASK_STATUSES[number], string> = {
    todo: "To Do",
    in_progress: "In Progress",
    done: "Done"
}

const taskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    status: z.enum(TASK_STATUSES),
    priority: z.enum(TASK_PRIORITIES),
    due_date: z.string().optional()
})

export type TaskFormData = z.infer<typeof taskSchema>

interface TaskDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (data: TaskFormData) => Promise<void>
    task?: Task
}

export default function TaskDialog({ open, onOpenChange, onSubmit, task }: TaskDialogProps) {
    const form = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: { title: "", status: "todo", priority: "medium", due_date: undefined }
    })
    const [dateOpen, setDateOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

    useEffect(() => {
        if (open) {
            const parsedDate = task?.due_date ? new Date(task.due_date) : undefined
            form.reset({
                title: task?.title ?? "",
                status: task?.status ?? "todo",
                priority: task?.priority ?? "medium",
                due_date: parsedDate ? format(parsedDate, "yyyy-MM-dd") : undefined
            })
            setSelectedDate(parsedDate)
        }
    }, [open, task])

    const handleSubmit = async (data: TaskFormData) => {
        try {
            await onSubmit(data)
            onOpenChange(false)
        } catch {
            form.setError("root", { message: "Something went wrong" })
        }
    }

    return (
        <FormDialog
            title={task ? "Edit Task" : "Create Task"}
            open={open}
            onOpenChange={onOpenChange}
            onSubmit={form.handleSubmit(handleSubmit)}
            submitLabel={task ? "Save" : "Create"}
        >
            <FormField label="Title">
                <Input {...form.register("title")} placeholder="Task title" />
                {form.formState.errors.title && (
                    <p className="text-sm text-destructive mt-1">{form.formState.errors.title.message}</p>
                )}
            </FormField>
            <FormField label="Status">
                <Select
                    value={form.watch("status")}
                    onValueChange={(value) => form.setValue("status", value as typeof TASK_STATUSES[number])}
                >
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select status" /></SelectTrigger>
                    <SelectContent>
                        {TASK_STATUSES.map(s => (
                            <SelectItem key={s} value={s}>{COLUMN_LABELS[s]}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </FormField>
            <FormField label="Priority">
                <Select
                    value={form.watch("priority")}
                    onValueChange={(value) => form.setValue("priority", value as typeof TASK_PRIORITIES[number])}
                >
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select priority" /></SelectTrigger>
                    <SelectContent>
                        {TASK_PRIORITIES.map(p => (
                            <SelectItem key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </FormField>
            <FormField label="Due Date">
                <Popover open={dateOpen} onOpenChange={setDateOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => {
                                setSelectedDate(date)
                                form.setValue("due_date", date ? format(date, "yyyy-MM-dd") : undefined)
                                setDateOpen(false)
                            }}
                        />
                    </PopoverContent>
                </Popover>
            </FormField>
            {form.formState.errors.root && (
                <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
            )}
        </FormDialog>
    )
}

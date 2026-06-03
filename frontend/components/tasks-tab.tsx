"use client"

import { useTasks } from "@/hooks/use-tasks"
import { TabsContent } from "./ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Task } from "@/lib/models/task.model"
import { TASK_STATUSES } from "@/lib/utils/constants"
import { Button } from "./ui/button"
import { DialogTrigger, DialogContent, DialogHeader, DialogTitle, Dialog } from "./ui/dialog"
import { Input } from "./ui/input"
import { SelectTrigger, SelectValue, SelectContent, SelectItem, Select } from "./ui/select"

type TasksTabProps = {
    tasks: Task[]
    form: ReturnType<typeof useTasks>["taskForm"]
    onSubmit: ReturnType<typeof useTasks>["onTaskSubmit"]
}

export default function TasksTab({ tasks, form, onSubmit}: TasksTabProps) {
    return (
        <TabsContent value="tasks">
                    {tasks.map((task) => (
                        <div key={task.id}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>{task.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>{task.status}</p>
                                    <p>{task.due_date}</p>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>Create Task</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create Task</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <Input {...form.register("title")} placeholder="Task title" />
                                {form.formState.errors.title && <p>{form.formState.errors.title.message}</p>}

                                <Select onValueChange={(value) => form.setValue("status", value as typeof TASK_STATUSES[number])}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Task status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {TASK_STATUSES.map((status) => (
                                            <SelectItem key={status} value={status}>{status}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Button type="submit">Create</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </TabsContent>
    )
}
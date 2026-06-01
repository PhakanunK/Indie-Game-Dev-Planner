"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth";
import { useProject } from "@/hooks/use-project";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Project() {
    const { token, isLoading } = useAuth()
    const router = useRouter()
    const { tasks, form, onSubmit } = useProject()
    useEffect(() => {
        if (!isLoading && !token) {
            router.replace("/login")
        }
    }, [token, isLoading])
    if (isLoading || !token) {
        return null
    }

    return (
        <div>
            <Tabs defaultValue="tasks">
                <TabsList>
                    <TabsTrigger value="tasks">Tasks</TabsTrigger>
                    <TabsTrigger value="scenes">Scenes</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>

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

                                <Button type="submit">Create</Button>
                            </form>
                        </DialogContent>
                    </Dialog>

                </TabsContent>
                <TabsContent value="scenes">Scenes go here</TabsContent>
                <TabsContent value="activity">Activity go here</TabsContent>
            </Tabs>
            <div>Online Members</div>
        </div>
    )
}
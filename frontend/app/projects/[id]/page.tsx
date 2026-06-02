"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth";
import { useProject } from "@/hooks/use-project";
import { SCENE_STATUSES, SCENE_TYPES, TASK_STATUSES } from "@/lib/utils/constants";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Project() {
    const { token, isLoading } = useAuth()
    const router = useRouter()
    const { tasks, taskForm, onTaskSubmit, scenes, sceneForm, onSceneSubmit } = useProject()
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
                            <form onSubmit={taskForm.handleSubmit(onTaskSubmit)}>
                                <Input {...taskForm.register("title")} placeholder="Task title" />
                                {taskForm.formState.errors.title && <p>{taskForm.formState.errors.title.message}</p>}

                                <Select onValueChange={(value) => taskForm.setValue("status", value as any)}>
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

                <TabsContent value="scenes">
                    {scenes.map((scene) => (
                        <div key={scene.id}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>{scene.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>{scene.type}</p>
                                    <p>{scene.status}</p>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>Create Scene</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create Scene</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={sceneForm.handleSubmit(onSceneSubmit)}>
                                <Input {...sceneForm.register("title")} placeholder="Scene title" />
                                {sceneForm.formState.errors.title && <p>{sceneForm.formState.errors.title.message}</p>}

                                <Select onValueChange={(value) => sceneForm.setValue("type", value as any)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Scene type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SCENE_TYPES.map((type) => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select onValueChange={(value) => sceneForm.setValue("status", value as any)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Scene status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SCENE_STATUSES.map((status) => (
                                            <SelectItem key={status} value={status}>{status}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Button type="submit">Create</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </TabsContent>

                <TabsContent value="activity">Activity go here</TabsContent>
            </Tabs>
            <div>Online Members</div>
        </div>
    )
}
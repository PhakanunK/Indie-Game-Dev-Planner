"use client"

import ActivitiesTab from "@/components/activity-tab";
import ScenesTab from "@/components/scenes-tab";
import TasksTab from "@/components/tasks-tab";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth";
import { useProject } from "@/hooks/use-project";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Project() {
    const { token, isLoading } = useAuth()
    const router = useRouter()
    const { tasks, taskForm, onTaskSubmit, scenes, sceneForm, onSceneSubmit, activities, onlineUserIds} = useProject()
    useEffect(() => {
        if (!isLoading && !token) {
            router.replace("/login")
        }
    }, [token, isLoading])
    if (isLoading || !token) {
        return null
    }

    return (
        <div className="p-6">
            <Tabs defaultValue="tasks">
                <TabsList>
                    <TabsTrigger value="tasks">Tasks</TabsTrigger>
                    <TabsTrigger value="scenes">Scenes</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>
                <TasksTab tasks={tasks} form={taskForm} onSubmit={onTaskSubmit} />
                <ScenesTab scenes={scenes} form={sceneForm} onSubmit={onSceneSubmit} />
                <ActivitiesTab activities={activities} /> 
            </Tabs>
            <div>
                Online Members: {onlineUserIds.length}
                {onlineUserIds.map(id => (
                    <p key={id}>User {id}</p>
                ))}
            </div>
        </div>
    )
}
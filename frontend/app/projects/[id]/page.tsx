"use client"

import ActivitiesTab from "@/components/activity-tab";
import MemberSidebar from "@/components/member-sidebar";
import ScenesTab from "@/components/scenes-tab";
import TasksTab from "@/components/tasks-tab";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth";
import { useProject } from "@/hooks/use-project";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Project() {
    const { token, isLoading } = useAuth()
    const router = useRouter()
    const { tasks, onTaskCreate, onTaskUpdate, onTaskDelete, scenes, sceneForm, onSceneSubmit, activities, onlineUserIds, members } = useProject()
    const [sidebarOpen, setSidebarOpen] = useState(true)
    useEffect(() => {
        if (!isLoading && !token) {
            router.replace("/login")
        }
    }, [token, isLoading])
    if (isLoading || !token) {
        return null
    }

    return (
        <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                        <ChevronLeft size={16} /> Dashboard
                    </Link>
                </div>
                <Tabs defaultValue="tasks">
                    <TabsList>
                        <TabsTrigger value="tasks">Tasks</TabsTrigger>
                        <TabsTrigger value="scenes">Scenes</TabsTrigger>
                        <TabsTrigger value="activity">Activity</TabsTrigger>
                    </TabsList>
                    <TasksTab tasks={tasks} onTaskCreate={onTaskCreate} onTaskUpdate={onTaskUpdate} onTaskDelete={onTaskDelete} />
                    <ScenesTab scenes={scenes} form={sceneForm} onSubmit={onSceneSubmit}/>
                    <ActivitiesTab activities={activities} />
                </Tabs>
            </div>
            <MemberSidebar members={members} onlineUserIds={onlineUserIds} isOpen={sidebarOpen} onToggle={() => setSidebarOpen(prev => !prev)} />
        </div>
    )
}
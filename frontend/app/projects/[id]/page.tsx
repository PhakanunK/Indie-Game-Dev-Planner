"use client"

import ActivitiesTab from "@/components/activity-tab";
import MemberSidebar from "@/components/member-sidebar";
import InviteDialog from "@/components/projects/invite-dialog";
import ProjectDeleteDialog from "@/components/projects/project-delete-dialog";
import ProjectDialog from "@/components/projects/project-dialog";
import ScenesTab from "@/components/scenes-tab";
import TasksTab from "@/components/tasks-tab";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth";
import { useProject } from "@/hooks/use-project";
import { ChevronLeft, Pencil, Trash2, UserPlus } from "lucide-react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Project() {
    const { token, isLoading, user } = useAuth()
    const router = useRouter()
    const { project, projectError, tasks, tasksLoading, onTaskCreate, onTaskUpdate, onTaskDelete, scenes, scenesLoading, onSceneCreate, onSceneUpdate, onSceneDelete, activities, activitiesLoading, onlineUserIds, members, onProjectUpdate, onProjectDelete } = useProject()
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [editOpen, setEditOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [inviteOpen, setInviteOpen] = useState(false)
    const isOwner = user && project ? user.id === project.owner_id : false
    useEffect(() => {
        if (!isLoading && !token) {
            router.replace("/login")
        }
    }, [token, isLoading])
    if (isLoading || !token) {
        return null
    }

    if (projectError === "not_found") notFound()
    if (projectError === "forbidden") {
        router.replace("/dashboard")
        return null
    }

    return (
        <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                        <ChevronLeft size={16} /> Dashboard
                    </Link>
                    {isOwner && project && (
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setInviteOpen(true)}>
                                <UserPlus size={14} className="mr-1" /> Invite
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setEditOpen(true)}>
                                <Pencil size={16} />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => setDeleteOpen(true)}>
                                <Trash2 size={16} />
                            </Button>
                        </div>
                    )}
                </div>
                {project && (
                    <div className="mb-4">
                        <h1 className="text-2xl font-bold">{project.name}</h1>
                        <p className="text-sm text-muted-foreground">{project.genre} · {project.engine} · {project.platform}</p>
                        {project.description && <p className="text-sm text-muted-foreground mt-1">{project.description}</p>}
                    </div>
                )}
                {project && (
                    <>
                        <ProjectDialog open={editOpen} onOpenChange={setEditOpen} project={project} onSubmit={onProjectUpdate} />
                        <ProjectDeleteDialog open={deleteOpen} onOpenChange={setDeleteOpen} project={project} onConfirm={onProjectDelete} />
                        <InviteDialog open={inviteOpen} onOpenChange={setInviteOpen} projectId={project.id} token={token} />
                    </>
                )}
                <Tabs defaultValue="tasks">
                    <TabsList>
                        <TabsTrigger value="tasks">Tasks</TabsTrigger>
                        <TabsTrigger value="scenes">Scenes</TabsTrigger>
                        <TabsTrigger value="activity">Activity</TabsTrigger>
                    </TabsList>
                    <TasksTab tasks={tasks} isLoading={tasksLoading} onTaskCreate={onTaskCreate} onTaskUpdate={onTaskUpdate} onTaskDelete={onTaskDelete} />
                    <ScenesTab scenes={scenes} isLoading={scenesLoading} onSceneCreate={onSceneCreate} onSceneUpdate={onSceneUpdate} onSceneDelete={onSceneDelete} />
                    <ActivitiesTab activities={activities} isLoading={activitiesLoading} />
                </Tabs>
            </div>
            <MemberSidebar members={members} onlineUserIds={onlineUserIds} isOpen={sidebarOpen} onToggle={() => setSidebarOpen(prev => !prev)} />
        </div>
    )
}
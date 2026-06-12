"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ProjectDialog from "@/components/projects/project-dialog"
import { useAuth } from "@/contexts/auth"
import { useDashboard } from "@/hooks/use-dashboard"
import { Plus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Dashboard() {
    const { token, isLoading } = useAuth()
    const router = useRouter()
    const { projects, isLoading: projectsLoading, onProjectCreate } = useDashboard()
    const [createOpen, setCreateOpen] = useState(false)
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
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">My Projects</h1>
                <Button onClick={() => setCreateOpen(true)}>
                    <Plus size={16} className="mr-2" /> New Project
                </Button>
            </div>
            {projectsLoading ? (
                <p className="text-sm text-muted-foreground">Loading projects...</p>
            ) : projects.length === 0 ? (
                <p className="text-sm text-muted-foreground">No projects yet. Create your first project.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((project) => (
                        <Link key={project.id} href={`/projects/${project.id}`}>
                            <Card className="hover:border-foreground/30 transition-colors cursor-pointer h-full">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base">{project.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-2">
                                    <div className="flex flex-wrap gap-2">
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{project.genre}</span>
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{project.engine}</span>
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{project.platform}</span>
                                    </div>
                                    {project.description && (
                                        <p className="text-xs text-muted-foreground line-clamp-2">{project.description}</p>
                                    )}
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
            <ProjectDialog open={createOpen} onOpenChange={setCreateOpen} onSubmit={onProjectCreate} />
        </div>
    )
}

"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth"
import { useDashboard } from "@/hooks/use-dashboard"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect} from "react"

export default function Dashboard() {
    const {token, isLoading} = useAuth()
    const router = useRouter()
    const {projects, form, onSubmit} = useDashboard()
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
            {projects.map((project) => (
                <div key={project.id}>
                    <Link href={`/projects/${project.id}`}>
                        <Card>
                            <CardHeader>
                                <CardTitle>{project.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>{project.genre}</p>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            ))}
            <Dialog>
                <DialogTrigger asChild>
                    <Button>Create Project</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Project</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <Input {...form.register("name")} placeholder="Project name"/>
                        {form.formState.errors.name && <p>{form.formState.errors.name.message}</p>}

                        <Input {...form.register("genre")} placeholder="Genre"/>
                        {form.formState.errors.genre && <p>{form.formState.errors.genre.message}</p>}

                        <Input {...form.register("engine")} placeholder="Engine"/>
                        {form.formState.errors.engine && <p>{form.formState.errors.engine.message}</p>}

                        <Input {...form.register("platform")} placeholder="Platform"/>
                        {form.formState.errors.platform && <p>{form.formState.errors.platform.message}</p>}

                        <Input {...form.register("description")} placeholder="Description"/>
                        {form.formState.errors.description && <p>{form.formState.errors.description.message}</p>}

                        {form.formState.errors.root && <p>{form.formState.errors.root.message}</p>}
                        <Button type="submit">Create</Button>
                    </form>
                </DialogContent>
            </Dialog>
            
        </div>
    )
}
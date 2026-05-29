import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Project } from "@/lib/models/project.model"
import Link from "next/link"

const mockProjects: Project[] = [
     { id: 1, name: "Space RPG", genre: "RPG", engine: "Unity", platform: "PC", owner_id: 1, description: null, created_at: "", updated_at: "" },
     { id: 2, name: "Pixel Platformer", genre: "Platformer", engine: "Godot", platform: "Mobile", owner_id: 1, description: "Test", created_at: "", updated_at: "" }
]

export default function Dashboard() {
    return (
        <div>
            {mockProjects.map((project) => (
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
            
            <Button>Create Project</Button>
        </div>
    )
}
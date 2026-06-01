import { useAuth } from "@/contexts/auth";
import { createTask, getTasks } from "@/lib/actions/task.actions";
import { Task } from "@/lib/models/task.model";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
    title: z.string()
})

type FormData = z.infer<typeof schema>

export const useProject = () => {
    const form = useForm<FormData>({resolver: zodResolver(schema)})
    const {id} = useParams()
    const projectId = Number(id)
    const [tasks, setTasks] = useState<Task[]>([])
    const {token} = useAuth()
    useEffect(() => {
        if (token) {
            getTasks(token, projectId).then(setTasks)
        }
    }, [token, projectId])
    const onSubmit = async (data: FormData) => {
            if (!token) {
                return
            }
            const newTask = await createTask(token, projectId, {...data, order: tasks.length})
            setTasks(prev => [...prev, newTask])
        }
    return {tasks, form, onSubmit}
}
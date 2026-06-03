"use client"

import { useAuth } from "@/contexts/auth"
import { register as registerAction,login as loginAction, getMe as getMeAction } from "@/lib/actions/auth.actions"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"

const schema = z.object({
    email: z.email(),
    username: z.string().min(1),
    password: z.string().min(8),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
})

type FormData = z.infer<typeof schema>

export const useRegister = () => {
    const form = useForm<FormData>({resolver: zodResolver(schema)})
    const router = useRouter()
    const auth = useAuth()
    const onSubmit = async (data: FormData) => {
        await registerAction(data.email, data.username, data.password)
        const token = await loginAction(data.email, data.password)
        const user = await getMeAction(token)
        auth.login(token, user)
        router.push("/dashboard")
    }
    return {form, onSubmit}
}
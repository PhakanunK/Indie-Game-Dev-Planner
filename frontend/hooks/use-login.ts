"use client"

import { useAuth } from "@/contexts/auth"
import { login as loginAction, getMe as getMeAction} from "@/lib/actions/auth.actions"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"

const schema = z.object({
    email: z.email(),
    password: z.string().min(8)
})

type FormData = z.infer<typeof schema>

export const useLogin = () => {
    const form = useForm<FormData>({resolver: zodResolver(schema)})
    const router = useRouter()
    const auth = useAuth()
    const onSubmit = async (data: FormData) => {
        const token = await loginAction(data.email, data.password)
        const user = await getMeAction(token)
        auth.login(token, user)
        router.push("/dashboard")
    }
    return {form, onSubmit}
}
import { register } from "@/lib/actions/auth.actions"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const schema = z.object({
    email: z.email(),
    password: z.string().min(6)
})

type FormData = z.infer<typeof schema>

export const useRegister = () => {
    const form = useForm<FormData>({resolver: zodResolver(schema)})
    const onSubmit = async (data: FormData) => {await register(data.email, data.password)}
    return {form, onSubmit}
}
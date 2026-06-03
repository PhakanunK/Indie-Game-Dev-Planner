"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLogin } from "@/hooks/use-login"
import Link from "next/link"

export default function Login() {
    const {form, onSubmit} = useLogin()

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <Input {...form.register("email")} placeholder="Email"/>
            {form.formState.errors.email && <p>{form.formState.errors.email.message}</p>}

            <Input {...form.register("password")} placeholder="Password" type="password"/>
            {form.formState.errors.password && <p>{form.formState.errors.password.message}</p>}

            {form.formState.errors.root && <p>{form.formState.errors.root.message}</p>}
            <Button type="submit">Login</Button>
            <Link href="/register">Don't have an account?</Link>
        </form>
    )
}
"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRegister } from "@/hooks/use-register"
import Link from "next/link"

export default function Register() {
    const {form, onSubmit} = useRegister()

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <Input {...form.register("username")} placeholder="Username"/>
            {form.formState.errors.username && <p>{form.formState.errors.username.message}</p>}
            
            <Input {...form.register("email")} placeholder="Email"/>
            {form.formState.errors.email && <p>{form.formState.errors.email.message}</p>}

            <Input {...form.register("password")} placeholder="Password" type="password"/>
            {form.formState.errors.password && <p>{form.formState.errors.password.message}</p>}
            
            <Input {...form.register("confirmPassword")} placeholder="Confirm password" type="password"/>
            {form.formState.errors.confirmPassword && <p>{form.formState.errors.confirmPassword.message}</p>}

            {form.formState.errors.root && <p>{form.formState.errors.root.message}</p>}
            <Button type="submit">Register</Button>
            <Link href="/login">Already have an account?</Link>
        </form>
    )
}
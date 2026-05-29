"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRegister } from "@/hooks/use-register"
import Link from "next/link"

export default function Register() {
    const {form, onSubmit} = useRegister()

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <Input {...form.register("email")}/>
            {form.formState.errors.email && <p>{form.formState.errors.email.message}</p>}

            <Input {...form.register("password")} type="password"/>
            {form.formState.errors.password && <p>{form.formState.errors.password.message}</p>}

            <Button type="submit">Register</Button>
            <Link href="/login">Already have an account?</Link>
        </form>
    )
}
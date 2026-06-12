"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLogin } from "@/hooks/use-login"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"

export default function Login() {
    const { form, onSubmit } = useLogin()
    const [showPassword, setShowPassword] = useState(false)

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Welcome back</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium">Email</label>
                        <Input {...form.register("email")} placeholder="you@example.com" type="email" />
                        {form.formState.errors.email && (
                            <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium">Password</label>
                        <div className="relative">
                            <Input
                                {...form.register("password")}
                                placeholder="••••••••"
                                type={showPassword ? "text" : "password"}
                                className="pr-10"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                onClick={() => setShowPassword(prev => !prev)}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {form.formState.errors.password && (
                            <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
                        )}
                    </div>
                    {form.formState.errors.root && (
                        <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
                    )}
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? "Logging in..." : "Login"}
                    </Button>
                    <p className="text-center text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link href="/register" className="text-foreground hover:underline font-medium">Register</Link>
                    </p>
                </form>
            </CardContent>
        </Card>
    )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRegister } from "@/hooks/use-register"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"

export default function Register() {
    const { form, onSubmit } = useRegister()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Register</CardTitle>
                <CardDescription>Create your account</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium">Username</label>
                        <Input {...form.register("username")} placeholder="yourusername" />
                        {form.formState.errors.username && (
                            <p className="text-xs text-destructive">{form.formState.errors.username.message}</p>
                        )}
                    </div>
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
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium">Confirm Password</label>
                        <div className="relative">
                            <Input
                                {...form.register("confirmPassword")}
                                placeholder="••••••••"
                                type={showConfirm ? "text" : "password"}
                                className="pr-10"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                onClick={() => setShowConfirm(prev => !prev)}
                            >
                                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {form.formState.errors.confirmPassword && (
                            <p className="text-xs text-destructive">{form.formState.errors.confirmPassword.message}</p>
                        )}
                    </div>
                    {form.formState.errors.root && (
                        <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
                    )}
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? "Registering..." : "Register"}
                    </Button>
                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="text-foreground hover:underline font-medium">Login</Link>
                    </p>
                </form>
            </CardContent>
        </Card>
    )
}

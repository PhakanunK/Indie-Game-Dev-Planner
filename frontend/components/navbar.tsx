"use client"

import { useAuth } from "@/contexts/auth"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "./ui/button"
import ThemeToggle from "./theme-toggle"

export default function Navbar() {
    const { user, logout } = useAuth()
    const router = useRouter()
    const pathname = usePathname()
    if (!user || pathname === "/login" || pathname === "/register") return null
    const handleLogout = () => {
        logout()
        router.push("/login")
    }
    return (
        <nav className="h-14 border-b border-border flex items-center justify-between px-6 shrink-0">
            <span className="font-bold tracking-widest text-sm uppercase">
                Indie Game Dev Planner
            </span>
            <div className="flex items-center gap-2">
                <ThemeToggle />
                <span className="text-sm text-muted-foreground">{user.username}</span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>Logout</Button>
            </div>
        </nav>
    )
}
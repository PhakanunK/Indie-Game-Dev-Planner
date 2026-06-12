"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { acceptInvite } from "@/lib/actions/invite.actions"
import { useAuth } from "@/contexts/auth"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function InvitePage() {
    const { token: inviteToken } = useParams<{ token: string }>()
    const { token, isLoading } = useAuth()
    const router = useRouter()
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (isLoading) return
        if (!token) {
            router.replace(`/login?redirect=/invite/${inviteToken}`)
            return
        }
        acceptInvite(token, inviteToken)
            .then(() => {
                setStatus("success")
                setTimeout(() => router.push("/dashboard"), 2000)
            })
            .catch((err: unknown) => {
                setError(err instanceof Error ? err.message : "Failed to accept invite")
                setStatus("error")
            })
    }, [isLoading, token])

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 size={16} className="animate-spin" />
                <span>Joining project...</span>
            </div>
        )
    }

    if (status === "success") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-2">
                <p className="text-lg font-semibold">You joined the project!</p>
                <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-2">
            <p className="text-lg font-semibold text-destructive">Invite failed</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button variant="outline" onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
        </div>
    )
}

"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
    useEffect(() => { }, [error])

    return (
        <div className="flex flex-col items-center justify-center flex-1 gap-4">
            <p className="text-lg font-semibold">Something went wrong</p>
            <p className="text-sm text-muted-foreground">{error.message || "Failed to load dashboard."}</p>
            <Button variant="outline" onClick={reset}>Try again</Button>
        </div>
    )
}

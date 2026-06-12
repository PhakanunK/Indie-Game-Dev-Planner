"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ProjectError({ error, reset }: { error: Error; reset: () => void }) {
    useEffect(() => { }, [error])

    return (
        <div className="flex flex-col items-center justify-center flex-1 gap-4">
            <p className="text-lg font-semibold">Something went wrong</p>
            <p className="text-sm text-muted-foreground">{error.message || "Failed to load project."}</p>
            <div className="flex gap-2">
                <Button variant="outline" onClick={reset}>Try again</Button>
                <Button asChild variant="ghost">
                    <Link href="/dashboard">Back to Dashboard</Link>
                </Button>
            </div>
        </div>
    )
}

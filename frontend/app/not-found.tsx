import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <p className="text-6xl font-bold text-muted-foreground/30">404</p>
            <p className="text-lg font-semibold">Page not found</p>
            <p className="text-sm text-muted-foreground">The page you're looking for doesn't exist.</p>
            <Button asChild variant="outline">
                <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
        </div>
    )
}

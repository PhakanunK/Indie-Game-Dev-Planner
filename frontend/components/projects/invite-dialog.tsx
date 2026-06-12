"use client"

import { useState } from "react"
import { toast } from "sonner"
import { generateInvite } from "@/lib/actions/invite.actions"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Loader2 } from "lucide-react"

interface InviteDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    projectId: number
    token: string
}

export default function InviteDialog({ open, onOpenChange, projectId, token }: InviteDialogProps) {
    const [inviteUrl, setInviteUrl] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleGenerate = async () => {
        setLoading(true)
        try {
            const inviteToken = await generateInvite(token, projectId)
            const url = `${window.location.origin}/invite/${inviteToken}`
            setInviteUrl(url)
        } catch {
            toast.error("Failed to generate invite link")
        } finally {
            setLoading(false)
        }
    }

    const handleCopy = () => {
        if (!inviteUrl) return
        navigator.clipboard.writeText(inviteUrl)
        toast.success("Invite link copied!")
    }

    const handleOpenChange = (open: boolean) => {
        if (!open) setInviteUrl(null)
        onOpenChange(open)
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invite to Project</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                    Generate a one-time invite link. It expires in 7 days.
                </p>
                {!inviteUrl ? (
                    <Button onClick={handleGenerate} disabled={loading}>
                        {loading ? <><Loader2 size={14} className="mr-2 animate-spin" />Generating...</> : "Generate Invite Link"}
                    </Button>
                ) : (
                    <div className="flex gap-2">
                        <Input value={inviteUrl} readOnly className="text-xs" />
                        <Button size="icon" variant="outline" onClick={handleCopy}>
                            <Copy size={14} />
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

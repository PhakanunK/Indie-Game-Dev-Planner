"use client"

import { formatDistanceToNow } from "date-fns"
import { Activity } from "@/lib/models/activity.model"
import { TabsContent } from "./ui/tabs"

type ActivitiesTabProps = {
    activities: Activity[]
    isLoading: boolean
}

export default function ActivitiesTab({ activities, isLoading }: ActivitiesTabProps) {
    if (isLoading) return (
        <TabsContent value="activity">
            <p className="text-sm text-muted-foreground py-8 text-center">Loading activity...</p>
        </TabsContent>
    )

    return (
        <TabsContent value="activity">
            {activities.length === 0 && (
                <p className="text-sm text-muted-foreground py-8 text-center">No activity yet.</p>
            )}
            <div className="flex flex-col divide-y divide-border">
                {activities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between py-3">
                        <p className="text-sm">
                            <span className="font-medium">{activity.user?.username ?? "Unknown"}</span>
                            {" "}{activity.action}
                        </p>
                        <span className="text-xs text-muted-foreground shrink-0 ml-4">
                            {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                        </span>
                    </div>
                ))}
            </div>
        </TabsContent>
    )
}

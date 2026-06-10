"use client"

import { formatDistanceToNow } from "date-fns"
import { useActivities } from "@/hooks/use-activities"
import { TabsContent } from "./ui/tabs"

type ActivitiesTabProps = {
    activities: ReturnType<typeof useActivities>
}

export default function ActivitiesTab({ activities }: ActivitiesTabProps) {
    return (
        <TabsContent value="activity">
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

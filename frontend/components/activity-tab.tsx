"use client"

import { useActivities } from "@/hooks/use-activities"
import { TabsContent } from "./ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

type ActivitiesTabProps = {
    activities: ReturnType<typeof useActivities>
}

export default function ActivitiesTab({ activities }: ActivitiesTabProps) {
    return (
        <TabsContent value="activity">
            {activities.map((activity) => (
                <div key={activity.id}>
                    <Card>
                        <CardHeader>
                            <CardTitle>{activity.action}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>{activity.entity_type}</p>
                            <p>{activity.created_at}</p>
                        </CardContent>
                    </Card>
                </div>
            ))}
        </TabsContent>
    )
}
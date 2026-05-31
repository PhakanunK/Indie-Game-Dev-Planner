"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Project() {
    const {token, isLoading} = useAuth()
    const router = useRouter()
    useEffect(() => {
        if (!isLoading && !token) {
            router.replace("/login")
        }
    }, [token, isLoading])
    if (isLoading || !token) {
        return null
    }
    
    return (
        <div>
            <Tabs defaultValue="tasks">
                <TabsList>
                    <TabsTrigger value="tasks">Tasks</TabsTrigger>
                    <TabsTrigger value="scenes">Scenes</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>
                <TabsContent value="tasks">Tasks go here</TabsContent>
                <TabsContent value="scenes">Scenes go here</TabsContent>
                <TabsContent value="activity">Activity go here</TabsContent>
            </Tabs>
            <div>Online Members</div>
        </div>
    )
}
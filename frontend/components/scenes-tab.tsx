"use client"

import { useScenes } from "@/hooks/use-scenes"
import { Scene } from "@/lib/models/scene.model"
import { TabsContent } from "./ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { SCENE_TYPES, SCENE_STATUSES } from "@/lib/utils/constants"
import { Button } from "./ui/button"
import { DialogTrigger, DialogContent, DialogHeader, DialogTitle, Dialog } from "./ui/dialog"
import { Input } from "./ui/input"
import { SelectTrigger, SelectValue, SelectContent, SelectItem, Select } from "./ui/select"

type ScenesTabProps = {
    scenes: Scene[]
    form: ReturnType<typeof useScenes>["sceneForm"]
    onSubmit: ReturnType<typeof useScenes>["onSceneSubmit"]
}

export default function ScenesTab({ scenes, form, onSubmit}: ScenesTabProps) {
    return (
        <TabsContent value="scenes">
                    {scenes.map((scene) => (
                        <div key={scene.id}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>{scene.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>{scene.type}</p>
                                    <p>{scene.status}</p>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>Create Scene</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create Scene</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <Input {...form.register("title")} placeholder="Scene title" />
                                {form.formState.errors.title && <p>{form.formState.errors.title.message}</p>}

                                <Select onValueChange={(value) => form.setValue("type", value as typeof SCENE_TYPES[number])}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Scene type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SCENE_TYPES.map((type) => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select onValueChange={(value) => form.setValue("status", value as typeof SCENE_STATUSES[number])}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Scene status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SCENE_STATUSES.map((status) => (
                                            <SelectItem key={status} value={status}>{status}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Button type="submit">Create</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </TabsContent>
    )
}
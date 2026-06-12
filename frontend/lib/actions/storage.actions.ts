import { supabase } from "@/lib/supabase"

export async function uploadSceneImage(file: File): Promise<string> {
    const ext = file.name.split(".").pop()
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error } = await supabase.storage.from("scene-images").upload(path, file)
    if (error) throw new Error(error.message)

    const { data } = supabase.storage.from("scene-images").getPublicUrl(path)
    return data.publicUrl
}

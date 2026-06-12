export const generateInvite = async (token: string, projectId: number): Promise<string> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/invite`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
    })
    if (!response.ok) throw new Error("Failed to generate invite")
    return await response.json()
}

export const acceptInvite = async (token: string, inviteToken: string): Promise<void> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/invites/${inviteToken}/accept`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
    })
    if (!response.ok) throw new Error("Failed to accept invite")
}

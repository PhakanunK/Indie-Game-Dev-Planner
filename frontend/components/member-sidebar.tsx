import { ChevronLeft, ChevronRight } from "lucide-react"
import { Member } from "@/lib/models/member.model"

interface MemberSidebarProps {
    members: Member[]
    onlineUserIds: number[]
    isOpen: boolean
    onToggle: () => void
}

export default function MemberSidebar({ members, onlineUserIds, isOpen, onToggle }: MemberSidebarProps) {
    return (
        <aside className={`shrink-0 border border-border overflow-hidden transition-all duration-300 p-4 ${isOpen ? "w-56" : "w-10"}`}>
            <div className="flex items-center justify-between mb-3">
                {isOpen && <p className="text-xs uppercase tracking-widest text-muted-foreground">Members</p>}
                <button onClick={onToggle} className="text-muted-foreground hover:text-foreground">
                    {isOpen ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>
            
            {isOpen && (members.length === 0 ? (
                <p className="text-sm text-muted-foreground">No members yet</p>
            ) : (
                <ul className="flex flex-col gap-2">
                    {members.map(member => {
                        const isOnline = onlineUserIds.includes(member.user_id)
                        return (
                            <li key={member.id} className="flex items-center gap-2 text-sm">
                                <span className={`w-2 h-2 rounded-full shrink-0 ${isOnline ? "bg-green-500" : "bg-muted-foreground"}`} />
                                <span className={isOnline ? "" : "text-muted-foreground"}>
                                    {member.user.username}
                                </span>
                            </li>
                        )
                    })}
                </ul>
            ))}
        </aside>
    )
}
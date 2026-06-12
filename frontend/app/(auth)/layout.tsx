import React from "react"
import PixelRain from "@/components/pixel-rain"
import ThemeToggle from "@/components/theme-toggle"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex">
            {/* Left decoration */}
            <div className="hidden lg:flex lg:w-[60%] flex-col justify-between p-12 border-r border-border bg-muted/20 relative overflow-hidden">
                <PixelRain />

                <div className="relative">
                    <h1 className="text-3xl font-bold tracking-tight">Indie Game Dev</h1>
                    <p className="text-muted-foreground mt-1">Plan your game. Build your world.</p>
                </div>

                <div className="relative space-y-3">
                    {[
                        "Real-time task board with your whole team",
                        "Scene planning with image references",
                        "Activity feed — see every change as it happens",
                        "Live presence — know who's online right now"
                    ].map(feature => (
                        <div key={feature} className="flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-muted-foreground shrink-0" />
                            <p className="text-sm text-muted-foreground">{feature}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right form */}
            <div className="flex-1 flex items-center justify-center p-8 relative">
                <div className="absolute top-4 right-4">
                    <ThemeToggle />
                </div>
                {children}
            </div>
        </div>
    )
}

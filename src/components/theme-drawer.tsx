"use client"

import { Settings } from "lucide-react"
import { useTheme } from "next-themes"
import { useStore } from "@/lib/store"
import { TeamTheme } from "@/types"
import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { cn } from "@/lib/utils"

const TEAMS: { id: TeamTheme; name: string; color: string }[] = [
    { id: 'default', name: 'Default', color: '#ffffff' },
    { id: 'ferrari', name: 'Ferrari', color: '#ff2800' },
    { id: 'mercedes', name: 'Mercedes', color: '#00d2be' },
    { id: 'mclaren', name: 'McLaren', color: '#ff8000' },
    { id: 'astonmartin', name: 'Aston Martin', color: '#006f62' },
    { id: 'porsche', name: 'Porsche', color: '#d5001c' },
    { id: 'bmw', name: 'BMW', color: '#0066b1' },
    { id: 'cadillac', name: 'Cadillac', color: '#ffaf00' },
]

export function ThemeDrawer() {
    const { setTheme, theme, resolvedTheme } = useTheme()
    const teamTheme = useStore((state) => state.teamTheme)
    const setTeamTheme = useStore((state) => state.setTeamTheme)

    console.log('ThemeDrawer render:', { theme, resolvedTheme, teamTheme })

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:text-primary hover:bg-white/10">
                    <Settings className="h-6 w-6" />
                    <span className="sr-only">Settings</span>
                </Button>
            </DrawerTrigger>
            <DrawerContent className="bg-black/95 border-t border-white/10 text-white">
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle className="text-2xl font-black italic uppercase tracking-tighter text-center">Configuración</DrawerTitle>
                    </DrawerHeader>

                    <div className="p-4 space-y-8">
                        {/* User Profile Section */}




                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-white/60">Escudería</h3>
                            <div className="grid grid-cols-4 gap-3">
                                {TEAMS.map((team) => (
                                    <button
                                        key={team.id}
                                        onClick={() => {
                                            console.log('Setting team theme to:', team.id)
                                            setTeamTheme(team.id)
                                        }}
                                        className={cn(
                                            "flex flex-col items-center gap-2 p-2 rounded-xl border transition-all duration-200 group",
                                            teamTheme === team.id
                                                ? "border-primary bg-primary/10 shadow-[0_0_10px_var(--primary)]"
                                                : "border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "h-8 w-8 rounded-full shadow-sm transition-transform duration-300",
                                                teamTheme === team.id ? "scale-110" : "group-hover:scale-110"
                                            )}
                                            style={{ backgroundColor: team.color }}
                                        />
                                        <span className={cn(
                                            "text-[10px] font-mono uppercase tracking-wider truncate w-full text-center transition-colors",
                                            teamTheme === team.id ? "text-white font-bold" : "text-white/50 group-hover:text-white/80"
                                        )}>
                                            {team.name}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-4 mt-4 border-t border-white/10 text-center text-xs text-white/30 font-mono">
                        TimeTracksRecords v1.2
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

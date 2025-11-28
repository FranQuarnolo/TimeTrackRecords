"use client"

import { Settings, Moon, Sun } from "lucide-react"
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
    { id: 'redbull', name: 'Red Bull', color: '#0600ef' },
    { id: 'mclaren', name: 'McLaren', color: '#ff8000' },
    { id: 'astonmartin', name: 'Aston Martin', color: '#006f62' },
    { id: 'haas', name: 'Haas', color: '#ffffff' },
    { id: 'porsche', name: 'Porsche', color: '#d5001c' },
    { id: 'bmw', name: 'BMW', color: '#0066b1' },
    { id: 'cadillac', name: 'Cadillac', color: '#ffaf00' },
]

export function ThemeDrawer() {
    const { setTheme, theme } = useTheme()
    const { teamTheme, setTeamTheme } = useStore()

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:text-red-500 hover:bg-white/10">
                    <Settings className="h-6 w-6" />
                    <span className="sr-only">Settings</span>
                </Button>
            </DrawerTrigger>
            <DrawerContent className="bg-black/95 border-t border-white/10 text-white">
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle className="text-2xl font-black italic uppercase tracking-tighter text-center">Configuración</DrawerTitle>
                        <DrawerDescription className="text-center text-white/50">Personaliza tu experiencia.</DrawerDescription>
                    </DrawerHeader>

                    <div className="p-4 space-y-8">
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-white/60">Tema</h3>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "flex-1 border-white/10 bg-white/5 hover:bg-white/10 text-white hover:text-white",
                                        theme === 'light' && "border-red-500 bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400"
                                    )}
                                    onClick={() => setTheme('light')}
                                >
                                    <Sun className="mr-2 h-4 w-4" />
                                    Claro
                                </Button>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "flex-1 border-white/10 bg-white/5 hover:bg-white/10 text-white hover:text-white",
                                        theme === 'dark' && "border-red-500 bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400"
                                    )}
                                    onClick={() => setTheme('dark')}
                                >
                                    <Moon className="mr-2 h-4 w-4" />
                                    Oscuro
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-white/60">Escudería</h3>
                            <div className="grid grid-cols-4 gap-3">
                                {TEAMS.map((team) => (
                                    <button
                                        key={team.id}
                                        onClick={() => setTeamTheme(team.id)}
                                        className={cn(
                                            "flex flex-col items-center gap-2 p-2 rounded-xl border transition-all duration-200 group",
                                            teamTheme === team.id
                                                ? "border-red-500 bg-red-500/10 shadow-[0_0_10px_rgba(220,38,38,0.2)]"
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
                        TimeTracksRecords v1.1.0
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

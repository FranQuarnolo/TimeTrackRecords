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
                <Button variant="ghost" size="icon">
                    <Settings className="h-6 w-6" />
                    <span className="sr-only">Settings</span>
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle>Configuración</DrawerTitle>
                        <DrawerDescription>Personaliza tu experiencia.</DrawerDescription>
                    </DrawerHeader>

                    <div className="p-4 space-y-6">
                        <div className="space-y-3">
                            <h3 className="text-sm font-medium">Tema</h3>
                            <div className="flex gap-2">
                                <Button
                                    variant={theme === 'light' ? 'default' : 'outline'}
                                    className="flex-1"
                                    onClick={() => setTheme('light')}
                                >
                                    <Sun className="mr-2 h-4 w-4" />
                                    Claro
                                </Button>
                                <Button
                                    variant={theme === 'dark' ? 'default' : 'outline'}
                                    className="flex-1"
                                    onClick={() => setTheme('dark')}
                                >
                                    <Moon className="mr-2 h-4 w-4" />
                                    Oscuro
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-sm font-medium">Escudería</h3>
                            <div className="grid grid-cols-4 gap-2">
                                {TEAMS.map((team) => (
                                    <button
                                        key={team.id}
                                        onClick={() => setTeamTheme(team.id)}
                                        className={cn(
                                            "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200",
                                            teamTheme === team.id
                                                ? "border-primary bg-primary/10 scale-105 shadow-sm ring-2 ring-primary ring-offset-2 ring-offset-background"
                                                : "border-transparent hover:bg-muted hover:scale-105"
                                        )}
                                    >
                                        <div
                                            className="h-10 w-10 rounded-full border shadow-sm"
                                            style={{ backgroundColor: team.color }}
                                        />
                                        <span className="text-xs font-medium truncate w-full text-center">
                                            {team.name}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-4 mt-4 border-t text-center text-xs text-muted-foreground">
                        TimeTracksRecords v1.1.0
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

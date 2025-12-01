"use client"

import { Settings, Moon, Sun, LogOut } from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
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
    const { user, signOut } = useAuth()
    const router = useRouter()

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
                            <h3 className="text-sm font-bold uppercase tracking-widest text-white/60">Perfil</h3>
                            {user ? (
                                <div className="flex flex-col gap-3 p-4 rounded-xl border border-white/10 bg-white/5">
                                    <div className="flex items-center gap-3">
                                        {user.user_metadata?.avatar_url ? (
                                            <img
                                                src={user.user_metadata.avatar_url}
                                                alt="Avatar"
                                                className="h-10 w-10 rounded-full border border-primary/30"
                                            />
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg border border-primary/30">
                                                {(user.user_metadata?.username || user.email || 'U').charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="text-sm font-bold text-white truncate">
                                                {user.user_metadata?.full_name || user.user_metadata?.username || 'Piloto'}
                                            </span>
                                            <span className="text-xs text-white/50 truncate">{user.email}</span>
                                        </div>
                                    </div>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="w-full mt-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20"
                                        onClick={async () => {
                                            await signOut()
                                            router.push('/login')
                                        }}
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Cerrar Sesión
                                    </Button>
                                </div>
                            ) : (
                                <div className="p-4 rounded-xl border border-white/10 bg-white/5 text-center">
                                    <p className="text-sm text-white/60 mb-3">Inicia sesión para guardar tus tiempos.</p>
                                    <Button
                                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                                        onClick={() => router.push('/login')}
                                    >
                                        Iniciar Sesión
                                    </Button>
                                </div>
                            )}
                        </div>

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

"use client"

import * as React from "react"
import { useStore } from "@/lib/store"
import { Setup } from "@/types"
import { cn } from "@/lib/utils"
import { Fuel, Settings } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface SetupSelectorProps {
    carId: string
    value: string | null
    onSelect: (setupId: string) => void
}

export function SetupSelector({ carId, value, onSelect }: SetupSelectorProps) {
    const { setups, loadUserData } = useStore()

    React.useEffect(() => {
        loadUserData()
    }, [loadUserData])

    const carSetups = setups.filter(s => s.carId === carId)

    if (carSetups.length === 0) {
        return (
            <div className="text-center py-8 border border-dashed border-white/10 rounded-xl bg-white/5">
                <Settings className="h-8 w-8 text-white/20 mx-auto mb-2" />
                <p className="text-xs text-white/40 italic">No hay setups guardados.</p>
            </div>
        )
    }

    return (
        <div className="grid gap-2">
            {carSetups.map((setup) => (
                <div
                    key={setup.id}
                    onClick={() => onSelect(setup.id)}
                    className={cn(
                        "relative overflow-hidden border rounded-xl p-3 cursor-pointer transition-all active:scale-[0.98]",
                        value === setup.id
                            ? "bg-primary/10 border-primary ring-1 ring-primary"
                            : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                    )}
                >
                    <div className="flex items-start justify-between">
                        <div className="flex flex-col gap-1">
                            <h3 className={cn(
                                "font-bold text-sm transition-colors leading-tight",
                                value === setup.id ? "text-primary" : "text-white"
                            )}>
                                {setup.name}
                            </h3>

                            <div className="flex items-center gap-2">
                                {setup.sessionType === 'Race' ? (
                                    <span className="text-[9px] font-bold text-green-500 uppercase tracking-wider">Race</span>
                                ) : (
                                    <span className="text-[9px] font-bold text-purple-500 uppercase tracking-wider">Qualy</span>
                                )}
                                <span className="text-[9px] text-white/30">•</span>
                                <span className="text-[9px] text-white/40 font-mono">
                                    {format(new Date(setup.created_at), "dd MMM", { locale: es })}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 bg-black/40 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-white/80 border border-white/5">
                            <Fuel className="h-3 w-3 text-orange-500" />
                            {setup.fuel}L
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

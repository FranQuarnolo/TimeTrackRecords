"use client"

import * as React from "react"
import { useStore } from "@/lib/store"
import { CarSelector } from "@/components/times/car-selector"
import { Button } from "@/components/ui/button"
import { Plus, Settings, Wrench, ChevronRight, FileText, ChevronLeft, Flag, Timer } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"

import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../../components/ui/alert-dialog"

// Hook for long press
function useLongPress(callback: () => void, ms = 500) {
    const [startLongPress, setStartLongPress] = React.useState(false);

    React.useEffect(() => {
        let timerId: NodeJS.Timeout;
        if (startLongPress) {
            timerId = setTimeout(callback, ms);
        } else {
            // @ts-ignore
            clearTimeout(timerId);
        }

        return () => {
            clearTimeout(timerId);
        };
    }, [callback, ms, startLongPress]);

    return {
        onMouseDown: () => setStartLongPress(true),
        onMouseUp: () => setStartLongPress(false),
        onMouseLeave: () => setStartLongPress(false),
        onTouchStart: () => setStartLongPress(true),
        onTouchEnd: () => setStartLongPress(false),
    };
}

import { Header } from "@/components/layout/header"

export default function SetupsPage() {
    const { cars, setups, loadUserData, deleteSetup } = useStore()
    const [selectedCarName, setSelectedCarName] = React.useState<string>("")
    const [setupToDelete, setSetupToDelete] = React.useState<string | null>(null)

    // Ensure data is fresh
    React.useEffect(() => {
        loadUserData()
    }, [loadUserData])

    const selectedCar = cars.find(c => c.name === selectedCarName)
    const carSetups = setups.filter(s => s.carId === selectedCar?.id)

    const handleDelete = async () => {
        if (setupToDelete) {
            await deleteSetup(setupToDelete)
            toast.success("Setup eliminado")
            setSetupToDelete(null)
        }
    }

    return (
        <div className="min-h-screen bg-black text-white pb-24">
            <Header />
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold italic tracking-tighter uppercase">Setups</h1>
                    <p className="text-white/50 text-sm font-light mt-2">
                        Gestiona las configuraciones técnicas de tus vehículos.
                    </p>
                </div>

                <div className="space-y-4">
                    <label className="text-xs font-bold text-white/50 uppercase tracking-wider pl-1">
                        Seleccionar Vehículo
                    </label>
                    <CarSelector
                        value={selectedCarName}
                        onSelect={setSelectedCarName}
                    />
                </div>

                {selectedCarName && selectedCar && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold uppercase tracking-wide flex items-center gap-2">
                                <Wrench className="h-5 w-5 text-primary" />
                                Mis Setups
                            </h2>
                            <Button
                                asChild
                                size="sm"
                                className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/20"
                            >
                                <Link href={`/setups/new?carId=${selectedCar.id}`}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Nuevo Setup
                                </Link>
                            </Button>
                        </div>

                        {carSetups.length === 0 ? (
                            <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl bg-white/5">
                                <Settings className="h-12 w-12 text-white/20 mx-auto mb-3" />
                                <p className="text-white/40 italic">No hay setups guardados para este auto.</p>
                            </div>
                        ) : (
                            <div className="grid gap-3">
                                {carSetups.map((setup) => (
                                    <SetupItem
                                        key={setup.id}
                                        setup={setup}
                                        onLongPress={() => setSetupToDelete(setup.id)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <AlertDialog open={!!setupToDelete} onOpenChange={(open) => !open && setSetupToDelete(null)}>
                <AlertDialogContent className="bg-black border-white/10 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar Setup?</AlertDialogTitle>
                        <AlertDialogDescription className="text-white/60">
                            Esta acción no se puede deshacer. El setup se eliminará permanentemente.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white">Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-500 text-white hover:bg-red-600">Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

import { Fuel as FuelIcon } from "lucide-react"

function SetupItem({ setup, onLongPress }: { setup: any, onLongPress: () => void }) {
    const longPressEvent = useLongPress(onLongPress, 800);

    const getTireIcon = (tire: string) => {
        const config: Record<string, { color: string, letter: string }> = {
            'Soft': { color: '#ef4444', letter: 'S' },
            'Medium': { color: '#eab308', letter: 'M' },
            'Hard': { color: '#ffffff', letter: 'H' },
            'Wet': { color: '#3b82f6', letter: 'W' },
            'Inter': { color: '#22c55e', letter: 'I' },
        }
        const t = config[tire] || config['Soft']

        return (
            <div className="flex items-center justify-center shrink-0 w-5 h-5 border border-white/20 rounded-full">
                <span className="font-black text-[10px]" style={{ color: t.color }}>{t.letter}</span>
            </div>
        )
    }

    return (
        <div
            {...longPressEvent}
            className="group relative overflow-hidden bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-all select-none active:scale-[0.98]"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10 flex flex-col gap-3">
                {/* Header: Name and Type */}
                <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                        <h3 className="font-bold text-base text-white group-hover:text-primary transition-colors leading-tight">
                            {setup.name}
                        </h3>

                        <div className="flex items-center gap-2">
                            {/* Session Badge */}
                            {setup.sessionType === 'Race' ? (
                                <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider">Race</span>
                            ) : (
                                <span className="text-[10px] font-bold text-purple-500 uppercase tracking-wider">Qualy</span>
                            )}

                            <span className="text-[10px] text-white/30">•</span>

                            {/* Tire Icon */}
                            {getTireIcon(setup.tires)}

                            <span className="text-[10px] text-white/30">•</span>

                            {/* Date */}
                            <span className="text-[10px] text-white/40 font-mono">
                                {format(new Date(setup.created_at), "dd MMM", { locale: es })}
                            </span>
                        </div>
                    </div>

                    {/* Fuel */}
                    <div className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-lg border border-white/5">
                        <FuelIcon className="h-3.5 w-3.5 text-orange-500" />
                        <span className="text-xs font-mono font-bold text-white/90">{setup.fuel}L</span>
                    </div>
                </div>

                {/* Pressures Grid */}
                <div className="grid grid-cols-4 gap-1 bg-black/20 rounded-lg p-1.5 border border-white/5">
                    <div className="text-center">
                        <div className="text-[9px] text-white/30 uppercase mb-0.5">FL</div>
                        <div className="text-xs font-mono font-bold text-white/80">{setup.pressure?.fl || '-'}</div>
                    </div>
                    <div className="text-center border-l border-white/5">
                        <div className="text-[9px] text-white/30 uppercase mb-0.5">FR</div>
                        <div className="text-xs font-mono font-bold text-white/80">{setup.pressure?.fr || '-'}</div>
                    </div>
                    <div className="text-center border-l border-white/5">
                        <div className="text-[9px] text-white/30 uppercase mb-0.5">RL</div>
                        <div className="text-xs font-mono font-bold text-white/80">{setup.pressure?.rl || '-'}</div>
                    </div>
                    <div className="text-center border-l border-white/5">
                        <div className="text-[9px] text-white/30 uppercase mb-0.5">RR</div>
                        <div className="text-xs font-mono font-bold text-white/80">{setup.pressure?.rr || '-'}</div>
                    </div>
                </div>

                {/* Notes (if any) */}
                {setup.notes && (
                    <div className="flex items-start gap-1.5 text-xs text-white/40 px-1">
                        <FileText className="h-3 w-3 mt-0.5 shrink-0" />
                        <span className="truncate leading-tight">{setup.notes}</span>
                    </div>
                )}
            </div>
        </div>
    )
}

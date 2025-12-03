"use client"

import * as React from "react"
import { useStore } from "@/lib/store"
import { CarSelector } from "@/components/times/car-selector"
import { Button } from "@/components/ui/button"
import { Plus, Settings, Wrench, ChevronRight, FileText, ChevronLeft, Flag, Timer } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function SetupsPage() {
    const { cars, setups } = useStore()
    const [selectedCarName, setSelectedCarName] = React.useState<string>("")

    const selectedCar = cars.find(c => c.name === selectedCarName)
    const carSetups = setups.filter(s => s.carId === selectedCar?.id)

    return (
        <div className="min-h-screen bg-black text-white pb-24">
            <div className="p-6 space-y-6">
                <header className="space-y-4">
                    <Button variant="ghost" size="sm" asChild className="pl-0 text-primary hover:text-primary/80 hover:bg-transparent">
                        <Link href="/">
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Volver al menú
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                            <span className="text-primary">///</span>
                            Setups
                        </h1>
                        <p className="text-white/50 text-sm font-light">
                            Gestiona las configuraciones técnicas de tus vehículos.
                        </p>
                    </div>
                </header>

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
                                    <div
                                        key={setup.id}
                                        className="group relative overflow-hidden bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                        <div className="relative z-10 flex items-start justify-between gap-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    {setup.sessionType === 'Race' ? (
                                                        <span className="bg-green-500/20 text-green-500 text-[10px] font-bold px-1.5 py-0.5 rounded border border-green-500/20" title="Carrera">R</span>
                                                    ) : (
                                                        <span className="bg-purple-500/20 text-purple-500 text-[10px] font-bold px-1.5 py-0.5 rounded border border-purple-500/20" title="Clasificación">Q</span>
                                                    )}
                                                    <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors">
                                                        {setup.name}
                                                    </h3>
                                                </div>
                                                <div className="flex flex-wrap gap-2 text-xs text-white/60">
                                                    {setup.tires && (
                                                        <span className="bg-white/10 px-2 py-0.5 rounded">
                                                            {setup.tires}
                                                        </span>
                                                    )}
                                                    {setup.fuel && (
                                                        <span className="bg-white/10 px-2 py-0.5 rounded">
                                                            {setup.fuel}
                                                        </span>
                                                    )}
                                                </div>
                                                {setup.notes && (
                                                    <div className="flex items-center gap-1 text-xs text-white/40 mt-2">
                                                        <FileText className="h-3 w-3" />
                                                        <span className="truncate max-w-[200px]">{setup.notes}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <div className="text-[10px] text-white/20 font-mono">
                                                    {format(new Date(setup.created_at), "dd MMM yyyy", { locale: es })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

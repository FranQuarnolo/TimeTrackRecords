"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
    DrawerClose,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { useStore } from "@/lib/store"
import { getBrandIcon } from "./brand-icons"

interface CarSelectorProps {
    value?: string
    onSelect: (value: string) => void
}

export function CarSelector({ value, onSelect }: CarSelectorProps) {
    const [open, setOpen] = React.useState(false)
    const [search, setSearch] = React.useState("")
    const { cars } = useStore()

    const filteredCars = React.useMemo(() => {
        if (!search) return cars;
        return cars.filter(car =>
            car.name.toLowerCase().includes(search.toLowerCase()) ||
            car.brand?.toLowerCase().includes(search.toLowerCase())
        );
    }, [cars, search]);

    const selectedCar = cars.find((car) => car.name === value)

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between h-16 rounded-2xl border border-white/10 bg-black/40 px-6 text-xl font-normal hover:bg-black/60 hover:border-primary/30 text-white transition-all shadow-inner"
                >
                    {value ? (
                        <div className="flex items-center gap-3">
                            <div className="filter drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">
                                {getBrandIcon(selectedCar?.brand)}
                            </div>
                            <span className="truncate font-mono uppercase tracking-wide">{value}</span>
                        </div>
                    ) : (
                        <span className="text-white/30 italic">Ej: Ferrari 499P</span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 text-white" />
                </Button>
            </DrawerTrigger>
            <DrawerContent className="h-[85vh] bg-black/95 border-t border-white/10 text-white">
                <DrawerHeader className="border-b border-white/10 pb-4">
                    <DrawerTitle className="text-center text-2xl font-black italic uppercase tracking-tighter">Seleccionar Vehículo</DrawerTitle>
                </DrawerHeader>
                <div className="p-4 border-b border-white/10">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                        <input
                            className="flex h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 pl-9 text-sm text-white placeholder:text-white/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                            placeholder="Buscar auto..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            autoFocus
                        />
                    </div>
                </div>
                <div className="overflow-y-auto flex-1 p-4">
                    <div className="flex flex-col gap-2">
                        {filteredCars.map((car) => (
                            <DrawerClose key={car.id} asChild>
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "justify-start h-auto py-3 px-4 text-lg font-normal hover:bg-white/10 hover:text-white transition-all border border-transparent",
                                        value === car.name && "bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 hover:text-primary"
                                    )}
                                    onClick={() => {
                                        onSelect(car.name)
                                        setSearch("")
                                    }}
                                >
                                    <div className="flex items-center gap-3 w-full">
                                        <div className="opacity-80">
                                            {getBrandIcon(car.brand)}
                                        </div>
                                        <span className="truncate flex-1 text-left font-mono uppercase tracking-wide">{car.name}</span>
                                        {value === car.name && (
                                            <Check className="h-4 w-4 text-primary drop-shadow-[0_0_5px_var(--primary)]" />
                                        )}
                                    </div>
                                </Button>
                            </DrawerClose>
                        ))}
                        {filteredCars.length === 0 && (
                            <div className="text-center py-8 text-white/30">
                                No se encontraron autos
                            </div>
                        )}
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

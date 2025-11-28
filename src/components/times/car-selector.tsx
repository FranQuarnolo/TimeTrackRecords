"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Search, Car } from "lucide-react"
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
    const { cars, addCar } = useStore()

    const filteredCars = React.useMemo(() => {
        if (!search) return cars;
        return cars.filter(car =>
            car.name.toLowerCase().includes(search.toLowerCase()) ||
            car.brand?.toLowerCase().includes(search.toLowerCase())
        );
    }, [cars, search]);

    const selectedCar = cars.find((car) => car.name === value)

    const handleAddCar = () => {
        if (!search) return;
        addCar(search);
        onSelect(search);
        setSearch("");
        setOpen(false);
    };

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between h-20 rounded-2xl border border-white/10 bg-black/40 px-6 text-xl font-normal hover:bg-black/60 hover:border-primary/50 text-white transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] group"
                >
                    {value ? (
                        <div className="flex items-center gap-4">
                            <div className="filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] transition-transform group-hover:scale-110 duration-300">
                                {getBrandIcon(selectedCar?.brand)}
                            </div>
                            <div className="flex flex-col items-start text-left">
                                <span className="text-xs text-white/50 uppercase tracking-wider font-bold">{selectedCar?.brand || 'Custom'}</span>
                                <span className="truncate font-mono uppercase tracking-wide text-lg font-bold text-white group-hover:text-primary transition-colors">{value}</span>
                            </div>
                        </div>
                    ) : (
                        <span className="text-white/30 italic">Seleccionar Vehículo...</span>
                    )}
                    <ChevronsUpDown className="ml-2 h-5 w-5 shrink-0 opacity-50 text-white group-hover:text-primary transition-colors" />
                </Button>
            </DrawerTrigger>
            <DrawerContent className="h-[90vh] bg-[#0a0a0a] border-t border-white/10 text-white">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />

                <DrawerHeader className="border-b border-white/10 pb-6 pt-6 relative z-10">
                    <DrawerTitle className="text-center text-3xl font-black italic uppercase tracking-tighter flex items-center justify-center gap-3">
                        <span className="text-primary">///</span>
                        Seleccionar Vehículo
                    </DrawerTitle>
                </DrawerHeader>

                <div className="p-4 border-b border-white/10 bg-black/20 relative z-10">
                    <div className="relative max-w-md mx-auto">
                        <Search className="absolute left-4 top-3.5 h-5 w-5 text-white/50" />
                        <input
                            className="flex h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pl-12 text-base text-white placeholder:text-white/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-inner"
                            placeholder="Buscar por nombre, marca o categoría..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            autoFocus
                        />
                    </div>
                </div>

                <div className="overflow-y-auto flex-1 p-4 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-5xl mx-auto">
                        {filteredCars.map((car) => (
                            <DrawerClose key={car.id} asChild>
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "justify-start h-auto py-4 px-5 text-lg font-normal transition-all border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] group relative overflow-hidden",
                                        value === car.name && "bg-primary/10 border-primary/50 text-white ring-1 ring-primary/50"
                                    )}
                                    onClick={() => {
                                        onSelect(car.name)
                                        setSearch("")
                                    }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                                    <div className="flex items-center gap-4 w-full relative z-10">
                                        <div className="opacity-80 group-hover:opacity-100 transition-opacity scale-110">
                                            {getBrandIcon(car.brand)}
                                        </div>
                                        <div className="flex flex-col items-start flex-1 min-w-0">
                                            <div className="flex items-center gap-2 w-full">
                                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-white/70 uppercase tracking-wider">
                                                    {car.category}
                                                </span>
                                                {car.brand === 'Custom' && (
                                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/20 text-primary uppercase tracking-wider">
                                                        Custom
                                                    </span>
                                                )}
                                            </div>
                                            <span className="truncate w-full text-left font-mono uppercase tracking-wide font-bold text-white/90 group-hover:text-white mt-1">
                                                {car.name}
                                            </span>
                                        </div>
                                        {value === car.name && (
                                            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                                                <Check className="h-5 w-5 text-primary drop-shadow-[0_0_5px_var(--primary)]" />
                                            </div>
                                        )}
                                    </div>
                                </Button>
                            </DrawerClose>
                        ))}

                        {search && !filteredCars.find(c => c.name.toLowerCase() === search.toLowerCase()) && (
                            <Button
                                variant="ghost"
                                className="justify-start h-auto py-6 px-6 text-lg font-normal hover:bg-primary/10 hover:text-primary transition-all border border-dashed border-white/20 hover:border-primary/50 text-white/70 col-span-full"
                                onClick={handleAddCar}
                            >
                                <div className="flex items-center gap-4 w-full justify-center">
                                    <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                                        {getBrandIcon('Custom')}
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <span className="text-sm text-white/50 uppercase tracking-wider font-bold">No encontrado</span>
                                        <span className="truncate flex-1 text-left font-mono uppercase tracking-wide text-xl">
                                            Agregar "{search}"
                                        </span>
                                    </div>
                                    <span className="ml-auto text-xs bg-primary/20 px-3 py-1.5 rounded-full text-primary font-bold animate-pulse">
                                        + CREAR NUEVO
                                    </span>
                                </div>
                            </Button>
                        )}

                        {filteredCars.length === 0 && !search && (
                            <div className="col-span-full flex flex-col items-center justify-center py-12 text-white/30 gap-4">
                                <Car className="h-16 w-16 opacity-20" />
                                <p className="text-xl font-light italic">No se encontraron autos</p>
                            </div>
                        )}
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

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
                    className="w-full justify-between h-16 rounded-2xl border-2 border-border bg-background/50 px-6 text-xl font-normal hover:bg-background/80"
                >
                    {value ? (
                        <div className="flex items-center gap-3">
                            {getBrandIcon(selectedCar?.brand)}
                            <span className="truncate">{value}</span>
                        </div>
                    ) : (
                        <span className="text-muted-foreground/50">Ej: Ferrari 499P</span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </DrawerTrigger>
            <DrawerContent className="h-[85vh]">
                <DrawerHeader className="border-b pb-4">
                    <DrawerTitle className="text-center">Seleccionar Vehículo</DrawerTitle>
                </DrawerHeader>
                <div className="p-4 border-b">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <input
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                                        "justify-start h-auto py-3 px-4 text-lg font-normal",
                                        value === car.name && "bg-accent"
                                    )}
                                    onClick={() => {
                                        onSelect(car.name)
                                        setSearch("")
                                    }}
                                >
                                    <div className="flex items-center gap-3 w-full">
                                        {getBrandIcon(car.brand)}
                                        <span className="truncate flex-1 text-left">{car.name}</span>
                                        {value === car.name && (
                                            <Check className="h-4 w-4 text-primary" />
                                        )}
                                    </div>
                                </Button>
                            </DrawerClose>
                        ))}
                        {filteredCars.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                No se encontraron autos
                            </div>
                        )}
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

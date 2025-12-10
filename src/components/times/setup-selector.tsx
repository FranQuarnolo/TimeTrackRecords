"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Settings2, FileText } from "lucide-react"
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
import { Setup } from "@/types"

interface SetupSelectorProps {
    carName?: string
    value?: string
    onSelect: (value?: string) => void
}

export function SetupSelector({ carName, value, onSelect }: SetupSelectorProps) {
    const [open, setOpen] = React.useState(false)
    const { cars, setups } = useStore()

    const selectedCar = React.useMemo(() =>
        cars.find(c => c.name === carName),
        [cars, carName]
    );

    const availableSetups = React.useMemo(() => {
        if (!selectedCar) return [];
        return setups.filter(s => s.carId === selectedCar.id);
    }, [setups, selectedCar]);

    const selectedSetup = setups.find((s) => s.id === value)

    if (!carName || availableSetups.length === 0) {
        return null;
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full max-w-full justify-between h-20 rounded-2xl border border-white/10 bg-black/40 px-6 text-xl font-normal hover:bg-black/60 hover:border-primary/50 text-white transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] group"
                >
                    {value ? (
                        <div className="flex items-center gap-4 min-w-0 flex-1 text-left">
                            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex flex-col items-start text-left min-w-0 flex-1">
                                <span className="text-xs text-white/50 uppercase tracking-wider font-bold truncate w-full">Setup</span>
                                <span className="truncate font-mono uppercase tracking-wide text-lg font-bold text-white group-hover:text-primary transition-colors w-full">{selectedSetup?.name}</span>
                            </div>
                        </div>
                    ) : (
                        <span className="text-white/30 italic flex items-center gap-4 truncate">
                            <Settings2 className="h-5 w-5 opacity-50 shrink-0" />
                            <span className="truncate">Seleccionar Setup (Opcional)</span>
                        </span>
                    )}
                    <ChevronsUpDown className="ml-2 h-5 w-5 shrink-0 opacity-50 text-white group-hover:text-primary transition-colors" />
                </Button>
            </DrawerTrigger>
            <DrawerContent className="h-[60vh] bg-[#0a0a0a] border-t border-white/10 text-white">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />

                <DrawerHeader className="border-b border-white/10 pb-6 pt-6 relative z-10">
                    <DrawerTitle className="text-center text-3xl font-black italic uppercase tracking-tighter flex items-center justify-center gap-3">
                        <Settings2 className="h-8 w-8 text-primary" />
                        Seleccionar Setup
                    </DrawerTitle>
                </DrawerHeader>

                <div className="overflow-y-auto flex-1 p-4 relative z-10">
                    <div className="grid grid-cols-1 gap-3 max-w-2xl mx-auto">
                        <DrawerClose asChild>
                            <Button
                                variant="ghost"
                                className={cn(
                                    "justify-start h-auto py-4 px-6 text-lg font-normal transition-all border border-dashed border-white/20 hover:bg-white/5 hover:border-white/40 text-white/50",
                                    !value && "bg-white/5 border-white/40 text-white"
                                )}
                                onClick={() => onSelect(undefined)}
                            >
                                <span className="italic">Sin setup</span>
                                {!value && <Check className="ml-auto h-5 w-5" />}
                            </Button>
                        </DrawerClose>

                        {availableSetups.map((setup) => (
                            <DrawerClose key={setup.id} asChild>
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "justify-start h-auto py-4 px-6 text-lg font-normal transition-all border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] group relative overflow-hidden",
                                        value === setup.id && "bg-primary/10 border-primary/50 text-white ring-1 ring-primary/50"
                                    )}
                                    onClick={() => onSelect(setup.id)}
                                >
                                    <div className="flex flex-col items-start gap-1 w-full">
                                        <div className="flex items-center justify-between w-full">
                                            <span className="font-mono font-bold uppercase tracking-wide">{setup.name}</span>
                                            {value === setup.id && (
                                                <Check className="h-5 w-5 text-primary drop-shadow-[0_0_5px_var(--primary)]" />
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-white/50 uppercase tracking-wider font-bold">
                                            <span className={cn(
                                                "px-1.5 py-0.5 rounded",
                                                setup.sessionType === 'Race' ? "bg-green-500/20 text-green-500" : "bg-yellow-500/20 text-yellow-500"
                                            )}>
                                                {setup.sessionType}
                                            </span>
                                            <span>{setup.tires}</span>
                                        </div>
                                    </div>
                                </Button>
                            </DrawerClose>
                        ))}
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

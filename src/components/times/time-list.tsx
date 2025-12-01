"use client"
import { useStore } from "@/lib/store";
import { formatTime, cn } from "@/lib/utils";
import { SessionType, LapTime } from "@/types";
import { ChevronDown, ChevronRight, Trophy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface TimeListProps {
    type: SessionType;
}

export function TimeList({ type }: TimeListProps) {
    const { laps, circuits, removeLap } = useStore();
    const [expandedCircuits, setExpandedCircuits] = useState<Record<string, boolean>>({});

    // Delete interaction state
    const [selectedLap, setSelectedLap] = useState<LapTime | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const longPressTimer = useRef<NodeJS.Timeout | null>(null);
    const isLongPress = useRef(false);

    const handleTouchStart = (lap: LapTime) => {
        isLongPress.current = false;
        longPressTimer.current = setTimeout(() => {
            isLongPress.current = true;
            setSelectedLap(lap);
            setIsMenuOpen(true);
        }, 800); // 800ms for long press
    };

    const handleTouchEnd = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
        }
    };

    const handleDelete = async () => {
        if (selectedLap) {
            await removeLap(selectedLap.id);
            setIsConfirmOpen(false);
            setSelectedLap(null);
        }
    };

    // Filter laps by type
    const filteredLaps = laps.filter((lap) => lap.type === type);

    // Group laps by circuit
    const lapsByCircuit = circuits.map((circuit) => {
        const circuitLaps = filteredLaps
            .filter((lap) => lap.circuitId === circuit.id)
            .sort((a, b) => a.time - b.time); // Sort ascending (best time first)

        return {
            circuit,
            laps: circuitLaps,
        };
    })
        .filter(group => group.laps.length > 0)
        .sort((a, b) => a.circuit.name.localeCompare(b.circuit.name)); // Sort alphabetically by circuit name

    const toggleCircuit = (circuitId: string) => {
        setExpandedCircuits(prev => ({
            ...prev,
            [circuitId]: !prev[circuitId]
        }));
    };

    if (lapsByCircuit.length === 0) {
        return (
            <div className="text-center text-white/60 py-12 flex flex-col items-center gap-4">
                <Trophy className="h-12 w-12 opacity-20" />
                <p>No hay tiempos registrados para {type === 'qualifying' ? 'clasificación' : 'carrera'}.</p>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4">
                {lapsByCircuit.map(({ circuit, laps }) => {
                    const isExpanded = expandedCircuits[circuit.id] ?? true; // Default to expanded

                    return (
                        <motion.div
                            key={circuit.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="border border-white/10 rounded-xl overflow-hidden bg-black/40 backdrop-blur-md shadow-lg"
                        >
                            <div
                                className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
                                onClick={() => toggleCircuit(circuit.id)}
                            >
                                <div className="flex items-center gap-3">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-white/70 hover:text-white hover:bg-white/10">
                                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                    </Button>
                                    <h3 className="text-lg font-bold text-white tracking-wide">{circuit.name}</h3>
                                </div>
                                <div className="text-xs font-mono text-primary font-medium px-2 py-1 bg-primary/10 rounded border border-primary/20">
                                    {laps.length} LAP{laps.length !== 1 && 'S'}
                                </div>
                            </div>

                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-white/5 bg-black/20"
                                    >
                                        <div className="p-2 space-y-2">
                                            {laps.map((lap, index) => {
                                                let rankStyle = "text-white/50 font-mono text-sm";
                                                let rowStyle = "bg-white/5 border-transparent";

                                                if (index === 0) {
                                                    rankStyle = "text-yellow-400 font-bold text-lg drop-shadow-sm";
                                                    rowStyle = "bg-yellow-500/10 border-yellow-500/20 shadow-[0_0_15px_-5px_rgba(234,179,8,0.3)]";
                                                } else if (index === 1) {
                                                    rankStyle = "text-slate-300 font-bold text-lg";
                                                    rowStyle = "bg-slate-500/10 border-slate-500/20";
                                                } else if (index === 2) {
                                                    rankStyle = "text-amber-600 font-bold text-lg";
                                                    rowStyle = "bg-amber-600/10 border-amber-600/20";
                                                }

                                                return (
                                                    <div
                                                        key={lap.id}
                                                        className={cn(
                                                            "flex items-center justify-between gap-4 p-3 rounded-lg border transition-all hover:scale-[1.01] hover:bg-white/10 select-none touch-none",
                                                            rowStyle
                                                        )}
                                                        onTouchStart={() => handleTouchStart(lap)}
                                                        onTouchEnd={handleTouchEnd}
                                                        onMouseDown={() => handleTouchStart(lap)}
                                                        onMouseUp={handleTouchEnd}
                                                        onMouseLeave={handleTouchEnd}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-8 flex justify-center">
                                                                <span className={rankStyle}>
                                                                    {index + 1}
                                                                </span>
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className={cn(
                                                                    "text-xl font-mono font-bold tracking-tight",
                                                                    index === 0 ? "text-white" : "text-white/90"
                                                                )}>
                                                                    {formatTime(lap.time)}
                                                                </span>
                                                                <span className="text-xs text-white/50 font-medium uppercase tracking-wider">
                                                                    {lap.carModel || 'Unknown Car'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <span className="text-[10px] text-white/30 font-mono">
                                                            {new Date(lap.date).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>

            {/* Menu Drawer */}
            <Drawer open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <DrawerContent className="bg-black/95 border-t border-white/10 text-white">
                    <div className="mx-auto w-full max-w-sm">
                        <DrawerHeader>
                            <DrawerTitle className="text-center">Opciones</DrawerTitle>
                            <DrawerDescription className="text-center text-white/50">
                                {selectedLap && `${formatTime(selectedLap.time)} - ${selectedLap.carModel}`}
                            </DrawerDescription>
                        </DrawerHeader>
                        <div className="p-4">
                            <Button
                                variant="destructive"
                                className="w-full gap-2"
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    setIsConfirmOpen(true);
                                }}
                            >
                                <Trash2 className="h-4 w-4" />
                                Eliminar Tiempo
                            </Button>
                        </div>
                        <DrawerFooter>
                            <Button variant="outline" onClick={() => setIsMenuOpen(false)} className="border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white">
                                Cancelar
                            </Button>
                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>

            {/* Confirmation Dialog */}
            <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <DialogContent className="bg-zinc-900 border-white/10 text-white sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>¿Eliminar tiempo?</DialogTitle>
                        <DialogDescription className="text-white/60">
                            ¿Estás seguro de que quieres eliminar este tiempo? Esta acción no se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-2 sm:justify-end">
                        <Button
                            variant="ghost"
                            onClick={() => setIsConfirmOpen(false)}
                            className="text-white hover:bg-white/10"
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                        >
                            Eliminar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

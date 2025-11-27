"use client"
import { useStore } from "@/lib/store";
import { formatTime, cn } from "@/lib/utils";
import { SessionType } from "@/types";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface TimeListProps {
    type: SessionType;
}

export function TimeList({ type }: TimeListProps) {
    const { laps, circuits } = useStore();
    const [expandedCircuits, setExpandedCircuits] = useState<Record<string, boolean>>({});

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
            <div className="text-center text-muted-foreground py-8">
                No hay tiempos registrados para {type === 'qualifying' ? 'clasificación' : 'carrera'}.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {lapsByCircuit.map(({ circuit, laps }) => {
                const isExpanded = expandedCircuits[circuit.id] ?? true; // Default to expanded

                return (
                    <div key={circuit.id} className="border rounded-xl overflow-hidden bg-card shadow-sm">
                        <div
                            className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => toggleCircuit(circuit.id)}
                        >
                            <div className="flex items-center gap-3">
                                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                                    {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                </Button>
                                <h3 className="text-lg font-bold">{circuit.name}</h3>
                            </div>
                            <div className="text-sm text-muted-foreground font-medium">
                                {laps.length} {laps.length === 1 ? 'tiempo' : 'tiempos'}
                            </div>
                        </div>

                        {isExpanded && (
                            <div className="border-t bg-muted/10 p-2 space-y-2">
                                {laps.map((lap, index) => {
                                    let medalColor = "bg-muted text-muted-foreground";
                                    if (index === 0) medalColor = "bg-yellow-400 text-yellow-900 ring-2 ring-yellow-400/50";
                                    if (index === 1) medalColor = "bg-slate-300 text-slate-900 ring-2 ring-slate-300/50";
                                    if (index === 2) medalColor = "bg-amber-600 text-amber-100 ring-2 ring-amber-600/50";

                                    return (
                                        <div
                                            key={lap.id}
                                            className="flex items-center justify-between gap-4 p-3 rounded-lg bg-background hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold text-sm shadow-sm",
                                                    medalColor
                                                )}>
                                                    {index + 1}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xl font-mono font-bold tracking-tight">
                                                        {formatTime(lap.time)}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground font-medium">
                                                        {lap.carModel || 'Sin modelo'}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="text-[10px] text-muted-foreground font-medium bg-muted px-2 py-1 rounded-full">
                                                {new Date(lap.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

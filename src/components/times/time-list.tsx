"use client"

import { useStore } from "@/lib/store";
import { formatTime, cn } from "@/lib/utils";
import { SessionType } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TimeListProps {
    type: SessionType;
}

export function TimeList({ type }: TimeListProps) {
    const { laps, circuits } = useStore();

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
    }).filter(group => group.laps.length > 0); // Only show circuits with times

    if (lapsByCircuit.length === 0) {
        return (
            <div className="text-center text-muted-foreground py-8">
                No hay tiempos registrados para {type === 'qualifying' ? 'clasificación' : 'carrera'}.
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {lapsByCircuit.map(({ circuit, laps }) => (
                <div key={circuit.id} className="space-y-4">
                    <div className="flex items-center gap-2 border-b pb-2">
                        <h3 className="text-xl font-bold">{circuit.name}</h3>
                    </div>
                    <div className="space-y-3">
                        {laps.map((lap, index) => {
                            let medalColor = "bg-muted text-muted-foreground";
                            if (index === 0) medalColor = "bg-yellow-400 text-yellow-900 ring-2 ring-yellow-400/50";
                            if (index === 1) medalColor = "bg-slate-300 text-slate-900 ring-2 ring-slate-300/50";
                            if (index === 2) medalColor = "bg-amber-600 text-amber-100 ring-2 ring-amber-600/50";

                            return (
                                <div
                                    key={lap.id}
                                    className="flex items-center justify-between gap-4 p-3 rounded-xl bg-card border shadow-sm"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-lg shadow-sm",
                                            medalColor
                                        )}>
                                            {index + 1}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-3xl font-mono font-bold tracking-tight">
                                                {formatTime(lap.time)}
                                            </span>
                                            <span className="text-sm text-muted-foreground font-medium">
                                                {lap.carModel || 'Sin modelo'}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-xs text-muted-foreground font-medium bg-muted px-2 py-1 rounded-full">
                                        {new Date(lap.date).toLocaleDateString()}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}

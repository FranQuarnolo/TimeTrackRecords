"use client"

import { useStore } from "@/lib/store";
import { formatTime } from "@/lib/utils";
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
        <div className="space-y-6">
            {lapsByCircuit.map(({ circuit, laps }) => (
                <Card key={circuit.id} className="overflow-hidden">
                    <CardHeader className="bg-muted/50 pb-2">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            {circuit.name}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <ul className="divide-y">
                            {laps.map((lap, index) => (
                                <li key={lap.id} className="flex items-center justify-between p-3 hover:bg-muted/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${index === 0 ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400' : 'bg-muted text-muted-foreground'}`}>
                                            {index + 1}
                                        </span>
                                        <span className="font-mono text-lg font-medium">
                                            {formatTime(lap.time)}
                                        </span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(lap.date).toLocaleDateString()}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

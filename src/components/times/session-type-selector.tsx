"use client"

import { Circuit, SessionType } from "@/types";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { formatTime } from "@/lib/utils";
import { ChevronLeft, Trophy } from "lucide-react";

interface SessionTypeSelectorProps {
    circuit: Circuit;
    onSelect: (type: SessionType) => void;
    onBack: () => void;
}

export function SessionTypeSelector({ circuit, onSelect, onBack }: SessionTypeSelectorProps) {
    const { getBestTime } = useStore();

    const bestQualy = getBestTime(circuit.id, 'qualifying');
    const bestRace = getBestTime(circuit.id, 'race');

    return (
        <div className="flex flex-col h-full p-4">
            <div className="flex items-center mb-6">
                <Button variant="ghost" size="icon" onClick={onBack} className="-ml-2">
                    <ChevronLeft className="h-6 w-6" />
                </Button>
                <h2 className="text-xl font-bold ml-2">{circuit.name}</h2>
            </div>

            <div className="flex-1 flex flex-col gap-4 justify-center">
                <Button
                    variant="outline"
                    className="h-40 flex flex-col items-center justify-center gap-2 relative overflow-hidden border-2 hover:border-primary/50 transition-colors"
                    onClick={() => onSelect('qualifying')}
                >
                    <span className="text-2xl font-bold">Clasificación</span>
                    {bestQualy && (
                        <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20 px-3 py-1 rounded-full">
                            <Trophy className="h-4 w-4" />
                            <span className="font-mono font-bold">{formatTime(bestQualy)}</span>
                        </div>
                    )}
                </Button>

                <Button
                    variant="outline"
                    className="h-40 flex flex-col items-center justify-center gap-2 relative overflow-hidden border-2 hover:border-primary/50 transition-colors"
                    onClick={() => onSelect('race')}
                >
                    <span className="text-2xl font-bold">Carrera</span>
                    {bestRace && (
                        <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20 px-3 py-1 rounded-full">
                            <Trophy className="h-4 w-4" />
                            <span className="font-mono font-bold">{formatTime(bestRace)}</span>
                        </div>
                    )}
                </Button>
            </div>
        </div>
    );
}

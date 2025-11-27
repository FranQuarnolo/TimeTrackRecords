"use client"

import { useState } from "react";
import { Circuit, SessionType } from "@/types";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface TimeInputProps {
    circuit: Circuit;
    type: SessionType;
    onSubmit: (time: number) => void;
    onBack: () => void;
}

export function TimeInput({ circuit, type, onSubmit, onBack }: TimeInputProps) {
    const [minutes, setMinutes] = useState(1);
    const [seconds, setSeconds] = useState(30);
    const [milliseconds, setMilliseconds] = useState(0);

    const handleSubmit = () => {
        const totalMs = (minutes * 60 * 1000) + (seconds * 1000) + (milliseconds * 10);
        onSubmit(totalMs);
    };

    return (
        <div className="flex flex-col h-full p-4">
            <div className="flex items-center mb-6">
                <Button variant="ghost" size="icon" onClick={onBack} className="-ml-2">
                    <ChevronLeft className="h-6 w-6" />
                </Button>
                <div className="ml-2">
                    <h2 className="text-xl font-bold">{circuit.name}</h2>
                    <p className="text-sm text-muted-foreground capitalize">{type === 'qualifying' ? 'Clasificación' : 'Carrera'}</p>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-8">
                <div className="flex items-center gap-2 text-4xl font-mono font-bold">
                    <NumberPicker
                        value={minutes}
                        onChange={setMinutes}
                        max={59}
                        label="Min"
                    />
                    <span>:</span>
                    <NumberPicker
                        value={seconds}
                        onChange={setSeconds}
                        max={59}
                        label="Sec"
                    />
                    <span>.</span>
                    <NumberPicker
                        value={milliseconds}
                        onChange={setMilliseconds}
                        max={99}
                        label="Ms"
                    />
                </div>

                <Button size="lg" className="w-full max-w-xs" onClick={handleSubmit}>
                    Guardar Tiempo
                </Button>
            </div>
        </div>
    );
}

function NumberPicker({ value, onChange, max, label }: { value: number, onChange: (v: number) => void, max: number, label: string }) {
    return (
        <div className="flex flex-col items-center gap-2">
            <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12"
                onClick={() => onChange(value >= max ? 0 : value + 1)}
            >
                ▲
            </Button>
            <div className="bg-muted rounded-md w-20 h-24 flex items-center justify-center text-5xl border-2 border-transparent focus-within:border-primary">
                {value.toString().padStart(2, '0')}
            </div>
            <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12"
                onClick={() => onChange(value <= 0 ? max : value - 1)}
            >
                ▼
            </Button>
            <span className="text-xs text-muted-foreground font-sans uppercase tracking-wider">{label}</span>
        </div>
    );
}

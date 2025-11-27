"use client"

import { useState } from "react";
import { Circuit, SessionType } from "@/types";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Car as CarIcon, Save } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface TimeInputProps {
    circuit: Circuit;
    type: SessionType;
    onSubmit: (time: number, carModel?: string) => void;
    onBack: () => void;
}

export function TimeInput({ circuit, type, onSubmit, onBack }: TimeInputProps) {
    const { cars } = useStore();
    const [minutes, setMinutes] = useState(1);
    const [seconds, setSeconds] = useState(30);
    const [milliseconds, setMilliseconds] = useState(0);
    const [selectedCar, setSelectedCar] = useState("");

    const handleSubmit = () => {
        const totalMs = (minutes * 60 * 1000) + (seconds * 1000) + milliseconds;
        onSubmit(totalMs, selectedCar || undefined);
    };

    return (
        <div className="flex flex-col h-full relative">
            <div className="flex items-center p-4 border-b bg-background z-10">
                <Button variant="ghost" size="icon" onClick={onBack} className="-ml-2">
                    <ChevronLeft className="h-6 w-6" />
                </Button>
                <div className="ml-2">
                    <h2 className="text-xl font-bold">{circuit.name}</h2>
                    <p className="text-sm text-muted-foreground capitalize">{type === 'qualifying' ? 'Clasificación' : 'Carrera'}</p>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-4 gap-12 pb-24">
                {/* Time Picker */}
                <div className="flex items-center gap-2 text-5xl sm:text-7xl font-mono font-bold select-none text-primary drop-shadow-sm">
                    <NumberPicker
                        value={minutes}
                        onChange={setMinutes}
                        max={59}
                        label="Min"
                    />
                    <span className="pb-8 opacity-50">:</span>
                    <NumberPicker
                        value={seconds}
                        onChange={setSeconds}
                        max={59}
                        label="Sec"
                    />
                    <span className="pb-8 opacity-50">.</span>
                    <NumberPicker
                        value={milliseconds}
                        onChange={setMilliseconds}
                        max={999}
                        label="Ms"
                        digits={3}
                    />
                </div>

                {/* Car Selection */}
                <div className="w-full max-w-sm space-y-3">
                    <label className="text-base font-medium flex items-center gap-2 text-muted-foreground">
                        <CarIcon className="h-5 w-5" />
                        Auto / Vehículo
                    </label>
                    <div className="relative">
                        <input
                            list="cars-list"
                            type="text"
                            placeholder="Ej: Ferrari 499P"
                            className="flex h-16 w-full rounded-2xl border-2 border-input bg-background/50 px-6 py-4 text-xl ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-0 shadow-sm transition-all"
                            value={selectedCar}
                            onChange={(e) => setSelectedCar(e.target.value)}
                        />
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 transition-opacity peer-focus:opacity-100" />
                    </div>
                    <datalist id="cars-list">
                        {cars.map((car) => (
                            <option key={car.id} value={car.name} />
                        ))}
                    </datalist>
                </div>
            </div>

            {/* FAB Save Button */}
            <Button
                size="icon"
                className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg z-50 bg-primary text-primary-foreground hover:scale-105 transition-transform"
                onClick={handleSubmit}
            >
                <Save className="h-8 w-8" />
            </Button>
        </div>
    );
}

function NumberPicker({ value, onChange, max, label, digits = 2 }: { value: number, onChange: (v: number) => void, max: number, label: string, digits?: number }) {
    return (
        <div className="flex flex-col items-center gap-4">
            <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full hover:bg-muted"
                onClick={() => onChange(value >= max ? 0 : value + 1)}
            >
                ▲
            </Button>
            <div className="bg-muted/50 rounded-xl min-w-[3ch] h-24 flex items-center justify-center border-b-4 border-transparent focus-within:border-primary hover:border-accent-secondary transition-colors">
                {value.toString().padStart(digits, '0')}
            </div>
            <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full hover:bg-muted"
                onClick={() => onChange(value <= 0 ? max : value - 1)}
            >
                ▼
            </Button>
            <span className="text-xs text-muted-foreground font-sans uppercase tracking-wider font-medium">{label}</span>
        </div>
    );
}

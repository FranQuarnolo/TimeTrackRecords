"use client"

import { useState } from "react";
import { Circuit, SessionType } from "@/types";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Car as CarIcon, Save } from "lucide-react";
import { CarSelector } from "./car-selector";
import { motion } from "framer-motion";

interface TimeInputProps {
    circuit: Circuit;
    type: SessionType;
    onSubmit: (time: number, carModel?: string) => void;
    onBack: () => void;
}

export function TimeInput({ circuit, type, onSubmit, onBack }: TimeInputProps) {
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
            <div className="flex items-center p-4 z-10 bg-transparent">
                <Button variant="ghost" size="icon" onClick={onBack} className="-ml-2 text-white hover:text-red-500 hover:bg-white/10">
                    <ChevronLeft className="h-6 w-6" />
                </Button>
                <div className="ml-2">
                    <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">{circuit.name}</h2>
                    <p className="text-xs font-mono text-white/60 uppercase tracking-widest">{type === 'qualifying' ? 'Clasificación' : 'Carrera'}</p>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-4 gap-12 pb-24">
                {/* Time Picker */}
                <div className="flex items-center gap-2 text-5xl sm:text-7xl font-mono font-bold select-none text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                    <NumberPicker
                        value={minutes}
                        onChange={setMinutes}
                        max={59}
                        label="Min"
                    />
                    <span className="pb-8 opacity-50 text-red-500 animate-pulse">:</span>
                    <NumberPicker
                        value={seconds}
                        onChange={setSeconds}
                        max={59}
                        label="Sec"
                    />
                    <span className="pb-8 opacity-50 text-red-500 animate-pulse">.</span>
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex gap-1 h-32 items-center bg-black/40 rounded-xl px-2 border border-white/10 shadow-inner">
                            <ScrollDigit value={Math.floor(milliseconds / 100)} onChange={(v) => setMilliseconds((milliseconds % 100) + v * 100)} />
                            <ScrollDigit value={Math.floor((milliseconds % 100) / 10)} onChange={(v) => setMilliseconds(Math.floor(milliseconds / 100) * 100 + v * 10 + (milliseconds % 10))} />
                            <ScrollDigit value={milliseconds % 10} onChange={(v) => setMilliseconds(Math.floor(milliseconds / 10) * 10 + v)} />
                        </div>
                        <span className="text-xs text-white/40 font-mono uppercase tracking-wider font-medium">Ms</span>
                    </div>
                </div>

                {/* Car Selection */}
                <div className="w-full max-w-sm space-y-3 bg-black/40 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
                    <label className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 text-white/60">
                        <CarIcon className="h-4 w-4" />
                        Vehículo
                    </label>
                    <CarSelector value={selectedCar} onSelect={setSelectedCar} />
                </div>
            </div>

            {/* FAB Save Button */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="fixed bottom-6 right-6 z-50"
            >
                <Button
                    size="icon"
                    className="h-16 w-16 rounded-full shadow-lg bg-red-600 hover:bg-red-700 text-white border-2 border-red-400/20 hover:scale-110 transition-transform"
                    onClick={handleSubmit}
                >
                    <Save className="h-8 w-8" />
                </Button>
            </motion.div>
        </div>
    );
}

function ScrollDigit({ value, onChange }: { value: number, onChange: (v: number) => void }) {
    return (
        <div className="h-24 w-8 overflow-y-auto snap-y snap-mandatory scrollbar-hide relative flex flex-col items-center mask-image-gradient">
            <div className="h-8 w-full shrink-0" /> {/* Spacer */}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                    key={num}
                    className={`h-8 w-full shrink-0 flex items-center justify-center snap-center text-xl font-mono transition-all ${num === value ? "text-white font-bold scale-125 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "text-white/20 scale-90"
                        }`}
                    onClick={() => onChange(num)}
                >
                    {num}
                </button>
            ))}
            <div className="h-8 w-full shrink-0" /> {/* Spacer */}
        </div>
    );
}

function NumberPicker({ value, onChange, max, label, digits = 2 }: { value: number, onChange: (v: number) => void, max: number, label: string, digits?: number }) {

    const handleWheel = (e: React.WheelEvent) => {
        if (e.deltaY < 0) {
            onChange(value >= max ? 0 : value + 1);
        } else {
            onChange(value <= 0 ? max : value - 1);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4" onWheel={handleWheel}>
            <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full hover:bg-white/10 text-white/50 hover:text-white"
                onClick={() => onChange(value >= max ? 0 : value + 1)}
            >
                ▲
            </Button>
            <div className="bg-black/40 rounded-xl min-w-[3ch] h-24 flex items-center justify-center border border-white/10 shadow-inner">
                {value.toString().padStart(digits, '0')}
            </div>
            <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full hover:bg-white/10 text-white/50 hover:text-white"
                onClick={() => onChange(value <= 0 ? max : value - 1)}
            >
                ▼
            </Button>
            <span className="text-xs text-white/40 font-mono uppercase tracking-wider font-medium">{label}</span>
        </div>
    );
}

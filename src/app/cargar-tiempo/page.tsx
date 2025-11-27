"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { CircuitSelector } from "@/components/times/circuit-selector";
import { SessionTypeSelector } from "@/components/times/session-type-selector";
import { TimeInput } from "@/components/times/time-input";
import { useStore } from "@/lib/store";
import { Circuit, SessionType } from "@/types";

export default function CargarTiempoPage() {
    const router = useRouter();
    const { addLap } = useStore();
    const [step, setStep] = useState(1);
    const [selectedCircuit, setSelectedCircuit] = useState<Circuit | null>(null);
    const [sessionType, setSessionType] = useState<SessionType | null>(null);

    const handleCircuitSelect = (circuit: Circuit) => {
        setSelectedCircuit(circuit);
        setStep(2);
    };

    const handleTypeSelect = (type: SessionType) => {
        setSessionType(type);
        setStep(3);
    };

    const handleTimeSubmit = (time: number, carModel?: string) => {
        if (selectedCircuit && sessionType) {
            addLap({
                id: crypto.randomUUID(),
                circuitId: selectedCircuit.id,
                time,
                date: new Date().toISOString(),
                type: sessionType,
                carModel,
            });
            router.push('/mis-tiempos');
        }
    };

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 flex flex-col">
                {step === 1 && (
                    <CircuitSelector onSelect={handleCircuitSelect} />
                )}
                {step === 2 && selectedCircuit && (
                    <SessionTypeSelector
                        circuit={selectedCircuit}
                        onSelect={handleTypeSelect}
                        onBack={() => setStep(1)}
                    />
                )}
                {step === 3 && selectedCircuit && sessionType && (
                    <TimeInput
                        circuit={selectedCircuit}
                        type={sessionType}
                        onSubmit={handleTimeSubmit}
                        onBack={() => setStep(2)}
                    />
                )}
            </main>
        </div>
    );
}

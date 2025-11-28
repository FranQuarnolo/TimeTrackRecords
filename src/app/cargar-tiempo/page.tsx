"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { CircuitSelector } from "@/components/times/circuit-selector";
import { SessionTypeSelector } from "@/components/times/session-type-selector";
import { TimeInput } from "@/components/times/time-input";
import { useStore } from "@/lib/store";
import { Circuit, SessionType } from "@/types";
import { BackgroundAnimation } from "@/components/ui/background-animation";
import { motion, AnimatePresence } from "framer-motion";

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
        <div className="flex min-h-screen flex-col relative overflow-hidden bg-black text-white selection:bg-red-500/30">
            <BackgroundAnimation />

            <div className="relative z-10 flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 flex flex-col relative">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="flex-1 flex flex-col"
                            >
                                <CircuitSelector onSelect={handleCircuitSelect} />
                            </motion.div>
                        )}
                        {step === 2 && selectedCircuit && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex-1 flex flex-col"
                            >
                                <SessionTypeSelector
                                    circuit={selectedCircuit}
                                    onSelect={handleTypeSelect}
                                    onBack={() => setStep(1)}
                                />
                            </motion.div>
                        )}
                        {step === 3 && selectedCircuit && sessionType && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex-1 flex flex-col"
                            >
                                <TimeInput
                                    circuit={selectedCircuit}
                                    type={sessionType}
                                    onSubmit={handleTimeSubmit}
                                    onBack={() => setStep(2)}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}

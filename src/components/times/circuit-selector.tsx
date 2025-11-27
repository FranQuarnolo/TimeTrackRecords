"use client"

import { useStore } from "@/lib/store";
import { Circuit } from "@/types";
import { motion } from "framer-motion";

interface CircuitSelectorProps {
    onSelect: (circuit: Circuit) => void;
}

export function CircuitSelector({ onSelect }: CircuitSelectorProps) {
    const { circuits } = useStore();

    return (
        <div className="flex flex-col h-full">
            <h2 className="text-xl font-bold p-4 text-center">Selecciona un Circuito</h2>
            <div className="flex-1 overflow-y-auto pb-8">
                <div className="flex flex-col gap-4 p-4">
                    {circuits.map((circuit, index) => (
                        <motion.div
                            key={circuit.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => onSelect(circuit)}
                            className="relative h-48 w-full cursor-pointer overflow-hidden rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow"
                        >
                            {/* Placeholder Image - In real app, use next/image */}
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform hover:scale-105 duration-500"
                                style={{ backgroundImage: `url(${circuit.imageUrl})` }}
                            />
                            <div className="absolute inset-0 bg-black/40 hover:bg-black/30 transition-colors" />
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                <h3 className="text-2xl font-bold text-white">{circuit.name}</h3>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

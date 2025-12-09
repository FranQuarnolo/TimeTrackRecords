"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw, Flag, Timer, Save, ChevronLeft, ArrowRight, Smartphone } from "lucide-react"
import { cn } from "@/lib/utils"
import { useStore } from "@/lib/store"
import { CarSelector } from "@/components/times/car-selector"
import { CircuitSelector } from "@/components/times/circuit-selector"
import { SetupSelector } from "@/components/setups/setup-selector"
import { Circuit, LapTime } from "@/types"
import { motion, AnimatePresence } from "framer-motion"
import { Header } from "@/components/layout/header"

export default function LiveTimingPage() {
    const { addLap, getBestTime, cars, setups } = useStore()

    // Steps: 1=Circuit, 2=Car/Setup, 3=Timing
    const [step, setStep] = React.useState(1)

    // Selection State
    const [selectedCircuit, setSelectedCircuit] = React.useState<Circuit | null>(null)
    const [selectedCarName, setSelectedCarName] = React.useState<string>("")
    const [selectedSetupId, setSelectedSetupId] = React.useState<string | null>(null)

    // Timer State
    const [time, setTime] = React.useState(0)
    const [isRunning, setIsRunning] = React.useState(false)
    const [laps, setLaps] = React.useState<number[]>([])
    const [sessionBest, setSessionBest] = React.useState<number | null>(null)

    const intervalRef = React.useRef<NodeJS.Timeout | null>(null)

    // Timer Logic
    // TODO: Assetto Corsa Integration
    // To connect with Assetto Corsa, replace the setInterval below with a WebSocket or API polling mechanism.
    // Example:
    // useEffect(() => {
    //   if (isRunning && mode === 'telemetry') {
    //     const socket = new WebSocket('ws://localhost:some-port');
    //     socket.onmessage = (event) => {
    //       const data = JSON.parse(event.data);
    //       setTime(data.currentTime);
    //       if (data.newLap) handleLap();
    //     };
    //     return () => socket.close();
    //   }
    // }, [isRunning]);

    React.useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTime(prev => prev + 10)
            }, 10)
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current)
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [isRunning])

    const formatTime = (ms: number) => {
        const minutes = Math.floor(ms / 60000)
        const seconds = Math.floor((ms % 60000) / 1000)
        const milliseconds = Math.floor((ms % 1000) / 10)
        return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`
    }

    const handleStartStop = () => setIsRunning(!isRunning)

    const handleReset = () => {
        setIsRunning(false)
        setTime(0)
        setLaps([])
        setSessionBest(null)
    }

    const handleLap = () => {
        const lapTime = time
        setLaps(prev => [lapTime, ...prev])
        setTime(0)
        if (!sessionBest || lapTime < sessionBest) {
            setSessionBest(lapTime)
        }
    }

    const handleSaveSession = async () => {
        if (!selectedCarName || !selectedCircuit) return

        for (const lapTime of laps) {
            const lap: LapTime = {
                id: crypto.randomUUID(),
                circuitId: selectedCircuit.id,
                time: lapTime,
                date: new Date().toISOString(),
                type: 'race',
                carModel: selectedCarName,
            }
            await addLap(lap)
        }
        handleReset()
        alert('Sesión guardada correctamente!')
    }

    // Navigation Handlers
    const handleCircuitSelect = (circuit: Circuit) => {
        setSelectedCircuit(circuit)
        setStep(2)
    }

    const handleStartSession = () => {
        if (selectedCarName && selectedSetupId) {
            setStep(3)
        }
    }

    const selectedCar = cars.find(c => c.name === selectedCarName)
    const historicalBest = selectedCircuit ? getBestTime(selectedCircuit.id, 'race') : null

    // Render Steps
    return (
        <div className="min-h-screen bg-black text-white flex flex-col overflow-hidden">
            {/* Header only on steps 1 & 2 */}
            {step < 3 && <Header />}

            <main className="flex-1 flex flex-col relative">
                <AnimatePresence mode="wait">

                    {/* STEP 1: CIRCUIT SELECTION */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex-1 flex flex-col p-6"
                        >
                            <div className="mb-6">
                                <h2 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-2">
                                    <Flag className="h-6 w-6 text-primary" />
                                    Seleccionar Circuito
                                </h2>
                                <p className="text-white/50 text-sm">Elige donde vas a correr hoy.</p>
                            </div>
                            <CircuitSelector onSelect={(c) => handleCircuitSelect(c)} />
                        </motion.div>
                    )}

                    {/* STEP 2: VEHICLE & SETUP */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex-1 flex flex-col p-6 pb-24"
                        >
                            <div className="flex items-center gap-2 mb-6">
                                <Button variant="ghost" size="icon" onClick={() => setStep(1)} className="-ml-2">
                                    <ChevronLeft className="h-6 w-6" />
                                </Button>
                                <div>
                                    <h2 className="text-2xl font-black italic uppercase tracking-tighter">
                                        Configuración
                                    </h2>
                                    <p className="text-white/50 text-sm">Selecciona vehículo y setup.</p>
                                </div>
                            </div>

                            <div className="space-y-8 max-w-md mx-auto w-full">
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-white/50 uppercase tracking-wider">
                                        Vehículo
                                    </label>
                                    <CarSelector value={selectedCarName} onSelect={(name) => {
                                        setSelectedCarName(name)
                                        setSelectedSetupId(null) // Reset setup when car changes
                                    }} />
                                </div>

                                {selectedCar && (
                                    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4">
                                        <label className="text-xs font-bold text-white/50 uppercase tracking-wider">
                                            Setup
                                        </label>
                                        <SetupSelector
                                            carId={selectedCar.id}
                                            value={selectedSetupId}
                                            onSelect={setSelectedSetupId}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Floating Start Button */}
                            <div className="fixed bottom-6 left-0 right-0 px-6 flex justify-center">
                                <Button
                                    size="lg"
                                    className="w-full max-w-md h-14 text-lg font-black uppercase tracking-widest shadow-[0_0_30px_rgba(34,197,94,0.3)]"
                                    disabled={!selectedCarName || !selectedSetupId}
                                    onClick={handleStartSession}
                                >
                                    Iniciar Sesión
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: LIVE TIMING (LANDSCAPE) */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="fixed inset-0 z-50 bg-black flex flex-col"
                        >
                            {/* Rotation Wrapper for Mobile */}
                            <div className="flex-1 flex flex-col relative landscape-mode-container">

                                {/* Background Grid */}
                                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />

                                {/* Top Bar */}
                                <div className="relative z-10 flex items-center justify-between p-6 md:p-8">
                                    <Button variant="ghost" size="icon" onClick={() => setStep(2)} className="text-white/50 hover:text-white">
                                        <ChevronLeft className="h-8 w-8" />
                                    </Button>

                                    <div className="text-center">
                                        <h3 className="text-sm font-bold text-white/50 uppercase tracking-wider">{selectedCircuit?.name}</h3>
                                        <p className="text-xs text-white/30 font-mono">{selectedCarName}</p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <span className="text-[10px] font-bold text-white/50 uppercase block">Best</span>
                                            <span className="font-mono font-bold text-primary">
                                                {sessionBest ? formatTime(sessionBest) : '--:--.--'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Main Timer */}
                                <div className="flex-1 flex items-center justify-center relative z-10">
                                    <div className="text-[22vw] md:text-[15vw] leading-none font-black font-mono tracking-tighter tabular-nums text-white drop-shadow-[0_0_50px_rgba(255,255,255,0.15)] select-none">
                                        {formatTime(time)}
                                    </div>
                                </div>

                                {/* Controls */}
                                <div className="relative z-10 p-8 pb-12 flex items-center justify-center gap-12">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="h-20 w-20 md:h-24 md:w-24 rounded-full border-2 border-white/20 hover:bg-white/10"
                                        onClick={handleReset}
                                    >
                                        <RotateCcw className="h-8 w-8 text-white/70" />
                                    </Button>

                                    <Button
                                        size="lg"
                                        className={cn(
                                            "h-28 w-28 md:h-32 md:w-32 rounded-full border-4 shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all active:scale-95",
                                            isRunning
                                                ? "bg-red-500 hover:bg-red-600 border-red-400 text-white"
                                                : "bg-green-500 hover:bg-green-600 border-green-400 text-black"
                                        )}
                                        onClick={handleStartStop}
                                    >
                                        {isRunning ? (
                                            <Pause className="h-12 w-12 fill-current" />
                                        ) : (
                                            <Play className="h-12 w-12 fill-current ml-2" />
                                        )}
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="h-20 w-20 md:h-24 md:w-24 rounded-full border-2 border-white/20 hover:bg-white/10"
                                        onClick={handleLap}
                                        disabled={!isRunning}
                                    >
                                        <Flag className="h-8 w-8 text-white/70" />
                                    </Button>
                                </div>

                                {/* Save Button (Small, corner) */}
                                {laps.length > 0 && (
                                    <div className="absolute bottom-8 right-8 z-20">
                                        <Button
                                            size="sm"
                                            className="bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md"
                                            onClick={handleSaveSession}
                                        >
                                            <Save className="h-4 w-4 mr-2" />
                                            Guardar ({laps.length})
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Orientation Hint (Visible only on portrait mobile if needed, but we force UI to adapt) */}
                            <div className="md:hidden absolute top-4 left-1/2 -translate-x-1/2 text-[10px] text-white/20 uppercase tracking-widest flex items-center gap-1 pointer-events-none">
                                <Smartphone className="h-3 w-3 rotate-90" />
                                Mejor en horizontal
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    )
}

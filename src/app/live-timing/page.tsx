"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw, Flag, Timer, Save } from "lucide-react"
import { cn } from "@/lib/utils"
import { useStore } from "@/lib/store"
import { CarSelector } from "@/components/times/car-selector"
import { CircuitSelector } from "@/components/times/circuit-selector"
import { LapTime } from "@/types"
import { format } from "date-fns"

export default function LiveTimingPage() {
    const { addLap, getBestTime } = useStore()
    const [time, setTime] = React.useState(0)
    const [isRunning, setIsRunning] = React.useState(false)
    const [laps, setLaps] = React.useState<number[]>([])
    const [selectedCar, setSelectedCar] = React.useState<string>("")
    const [selectedCircuit, setSelectedCircuit] = React.useState<string>("")
    const [sessionBest, setSessionBest] = React.useState<number | null>(null)

    const intervalRef = React.useRef<NodeJS.Timeout | null>(null)

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

    const handleStartStop = () => {
        setIsRunning(!isRunning)
    }

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
        if (!selectedCar || !selectedCircuit) return

        // Save all laps
        for (const lapTime of laps) {
            const lap: LapTime = {
                id: crypto.randomUUID(),
                circuitId: selectedCircuit,
                time: lapTime,
                date: new Date().toISOString(),
                type: 'race', // Default to race for live timing
                carModel: selectedCar
            }
            await addLap(lap)
        }

        // Reset after save
        handleReset()
        alert('Sesión guardada correctamente!')
    }

    const historicalBest = selectedCircuit ? getBestTime(selectedCircuit, 'race') : null

    return (
        <div className="min-h-screen bg-black text-white flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar / Controls */}
            <div className="w-full md:w-1/3 lg:w-1/4 p-4 border-b md:border-b-0 md:border-r border-white/10 flex flex-col gap-4 bg-[#0a0a0a] z-10">
                <div className="space-y-4">
                    <h1 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-2">
                        <Timer className="h-6 w-6 text-primary" />
                        Live Timing
                    </h1>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Circuito</label>
                        <CircuitSelector value={selectedCircuit} onSelect={setSelectedCircuit} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Vehículo</label>
                        <CarSelector value={selectedCar} onSelect={setSelectedCar} />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto mt-4 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-white/30 uppercase tracking-wider pb-2 border-b border-white/10">
                        <span>Vuelta</span>
                        <span>Tiempo</span>
                    </div>
                    {laps.map((lap, index) => (
                        <div key={index} className="flex items-center justify-between text-sm font-mono p-2 rounded bg-white/5 border border-white/5">
                            <span className="text-white/50">#{laps.length - index}</span>
                            <span className={cn(
                                "font-bold",
                                lap === sessionBest ? "text-primary" : "text-white"
                            )}>
                                {formatTime(lap)}
                            </span>
                        </div>
                    ))}
                </div>

                <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold uppercase tracking-wide"
                    disabled={laps.length === 0 || !selectedCar || !selectedCircuit}
                    onClick={handleSaveSession}
                >
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Sesión
                </Button>
            </div>

            {/* Main Timer Display */}
            <div className="flex-1 flex flex-col relative bg-black">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

                {/* Top Stats Bar */}
                <div className="flex items-center justify-between p-6 relative z-10">
                    <div className="space-y-1">
                        <span className="text-xs font-bold text-white/50 uppercase tracking-wider block">Mejor Histórico</span>
                        <span className="text-xl font-mono font-bold text-white">
                            {historicalBest ? formatTime(historicalBest) : '--:--.--'}
                        </span>
                    </div>
                    <div className="space-y-1 text-right">
                        <span className="text-xs font-bold text-white/50 uppercase tracking-wider block">Mejor Sesión</span>
                        <span className="text-xl font-mono font-bold text-primary">
                            {sessionBest ? formatTime(sessionBest) : '--:--.--'}
                        </span>
                    </div>
                </div>

                {/* Big Timer */}
                <div className="flex-1 flex items-center justify-center relative z-10">
                    <div className="text-[15vw] leading-none font-black font-mono tracking-tighter tabular-nums text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                        {formatTime(time)}
                    </div>
                </div>

                {/* Controls */}
                <div className="p-8 flex items-center justify-center gap-6 relative z-10 pb-12">
                    <Button
                        variant="outline"
                        size="lg"
                        className="h-24 w-24 rounded-full border-2 border-white/20 hover:bg-white/10 hover:border-white/40"
                        onClick={handleReset}
                    >
                        <RotateCcw className="h-8 w-8 text-white/70" />
                    </Button>

                    <Button
                        size="lg"
                        className={cn(
                            "h-32 w-32 rounded-full border-4 shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all active:scale-95",
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
                        className="h-24 w-24 rounded-full border-2 border-white/20 hover:bg-white/10 hover:border-white/40"
                        onClick={handleLap}
                        disabled={!isRunning}
                    >
                        <Flag className="h-8 w-8 text-white/70" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

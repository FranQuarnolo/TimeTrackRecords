"use client"
// Trigger Vercel Redeploy

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw, Flag, Timer, Save, ChevronLeft, ArrowRight, Smartphone, Wifi, WifiOff, Download, Monitor, QrCode, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useStore } from "@/lib/store"
import { CarSelector } from "@/components/times/car-selector"
import { CircuitSelector } from "@/components/times/circuit-selector"
import { SetupSelector } from "@/components/setups/setup-selector"
import { Circuit, LapTime } from "@/types"
import { motion, AnimatePresence } from "framer-motion"
import { Header } from "@/components/layout/header"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Scanner } from '@yudiel/react-qr-scanner';

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

    // AC Bridge State
    const [serverIp, setServerIp] = React.useState("192.168.1.X")
    const [isConnected, setIsConnected] = React.useState(false)
    const [acData, setAcData] = React.useState<any>(null)
    const socketRef = React.useRef<WebSocket | null>(null)
    const [showConnectionDialog, setShowConnectionDialog] = React.useState(false)
    const [showScanner, setShowScanner] = React.useState(false)

    // Telemetry State
    const [telemetry, setTelemetry] = React.useState({
        speed: 0,
        gear: 0,
        rpm: 0,
        gas: 0,
        brake: 0
    })

    // Connect to WebSocket
    const connectToBridge = (ipOverride?: string) => {
        if (socketRef.current) {
            socketRef.current.close()
        }

        try {
            // Clean IP
            const targetIp = ipOverride || serverIp
            const ip = targetIp.replace('http://', '').replace('ws://', '').split(':')[0]
            const wsUrl = `ws://${ip}:8000/ws`

            console.log(`Connecting to ${wsUrl}...`)
            const socket = new WebSocket(wsUrl)

            socket.onopen = () => {
                console.log("Connected to AC Bridge")
                setIsConnected(true)
                setShowConnectionDialog(false)
                setServerIp(ip) // Update state if connected via override
            }

            socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data)
                    if (data.connected) {
                        setAcData(data)

                        // Update Telemetry
                        setTelemetry({
                            speed: Math.round(data.physics.speedKmh),
                            gear: data.physics.gear,
                            rpm: data.physics.rpms,
                            gas: data.physics.gas,
                            brake: data.physics.brake
                        })

                        // Update Time & Laps
                        if (data.graphics.iCurrentTime > 0) {
                            setTime(data.graphics.iCurrentTime)
                            setIsRunning(true)
                        }
                    }
                } catch (e) {
                    console.error("Error parsing AC data", e)
                }
            }

            socket.onclose = () => {
                console.log("Disconnected from AC Bridge")
                setIsConnected(false)
                setIsRunning(false)
            }

            socket.onerror = (error) => {
                console.error("WebSocket Error", error)
                setIsConnected(false)
            }

            socketRef.current = socket
        } catch (e) {
            console.error("Connection failed", e)
        }
    }

    React.useEffect(() => {
        return () => {
            if (socketRef.current) {
                socketRef.current.close()
            }
        }
    }, [])

    // Fallback Timer Logic (only if not connected to AC)
    const intervalRef = React.useRef<NodeJS.Timeout | null>(null)
    React.useEffect(() => {
        if (isRunning && !isConnected) {
            intervalRef.current = setInterval(() => {
                setTime(prev => prev + 10)
            }, 10)
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current)
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [isRunning, isConnected])

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
        if (selectedCarName) {
            setStep(3)
        }
    }

    const handleScan = (result: string) => {
        if (result) {
            // Expecting ws://IP:PORT/ws or just IP
            // Extract IP
            try {
                let ip = result
                if (result.includes('ws://')) {
                    ip = result.split('ws://')[1].split(':')[0]
                }
                setServerIp(ip)
                setShowScanner(false)
                connectToBridge(ip)
            } catch (e) {
                console.error("Invalid QR Code", e)
            }
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
                                    disabled={!selectedCarName}
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
                                        {/* Connection Status */}
                                        <Dialog open={showConnectionDialog} onOpenChange={setShowConnectionDialog}>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className={cn(
                                                        "gap-2 border-white/10 bg-white/5 backdrop-blur-md",
                                                        isConnected ? "text-green-500 border-green-500/50" : "text-white/50"
                                                    )}
                                                >
                                                    {isConnected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                                                    <span className="hidden md:inline">{isConnected ? "Conectado" : "Desconectado"}</span>
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="bg-zinc-900 border-white/10 text-white">
                                                <DialogHeader>
                                                    <DialogTitle>Conectar con Assetto Corsa</DialogTitle>
                                                    <DialogDescription className="text-white/50">
                                                        Para ver datos en tiempo real, necesitas ejecutar el conector en tu PC.
                                                    </DialogDescription>
                                                </DialogHeader>

                                                {!showScanner ? (
                                                    <div className="space-y-6 py-4">
                                                        {/* Step 1: Download */}
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2 text-sm font-bold text-white/70">
                                                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-xs">1</span>
                                                                Descargar Conector
                                                            </div>
                                                            <Button className="w-full gap-2" variant="secondary" asChild>
                                                                <a href="/downloads/AC_Bridge.exe" download>
                                                                    <Download className="h-4 w-4" />
                                                                    Descargar AC_Bridge.exe
                                                                </a>
                                                            </Button>
                                                        </div>

                                                        {/* Step 2: Run */}
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2 text-sm font-bold text-white/70">
                                                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-xs">2</span>
                                                                Ejecutar en PC
                                                            </div>
                                                            <p className="text-xs text-white/40 pl-8">
                                                                Abre el archivo descargado. Verás una ventana negra con un código QR y una IP.
                                                            </p>
                                                        </div>

                                                        {/* Step 3: Connect */}
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2 text-sm font-bold text-white/70">
                                                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-xs">3</span>
                                                                Ingresar IP
                                                            </div>
                                                            <div className="flex gap-2 pl-8">
                                                                <Input
                                                                    value={serverIp}
                                                                    onChange={(e) => setServerIp(e.target.value)}
                                                                    placeholder="192.168.1.X"
                                                                    className="bg-black/50 border-white/10 font-mono"
                                                                />
                                                                <Button size="icon" variant="outline" onClick={() => setShowScanner(true)}>
                                                                    <QrCode className="h-4 w-4" />
                                                                </Button>
                                                                <Button onClick={() => connectToBridge()}>
                                                                    Conectar
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="py-4 space-y-4">
                                                        <div className="relative aspect-square w-full max-w-sm mx-auto overflow-hidden rounded-lg border border-white/10 bg-black">
                                                            <Scanner
                                                                onScan={(result) => {
                                                                    if (result && result.length > 0) {
                                                                        handleScan(result[0].rawValue)
                                                                    }
                                                                }}
                                                                onError={(error) => console.error(error)}
                                                                components={{

                                                                    onOff: false,
                                                                    torch: false,
                                                                    zoom: false,
                                                                    finder: false,
                                                                }}
                                                                styles={{
                                                                    container: { width: '100%', height: '100%' },
                                                                    video: { width: '100%', height: '100%', objectFit: 'cover' }
                                                                }}
                                                            />
                                                            <div className="absolute inset-0 border-2 border-primary/50 m-12 rounded-lg pointer-events-none animate-pulse" />
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            className="w-full"
                                                            onClick={() => setShowScanner(false)}
                                                        >
                                                            Cancelar
                                                        </Button>
                                                    </div>
                                                )}
                                            </DialogContent>
                                        </Dialog>

                                        <div className="text-right">
                                            <span className="text-[10px] font-bold text-white/50 uppercase block">Best</span>
                                            <span className="font-mono font-bold text-primary">
                                                {sessionBest ? formatTime(sessionBest) : '--:--.--'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Main Timer */}
                                <div className="flex-1 flex flex-col items-center justify-center relative z-10">
                                    <div className="text-[22vw] md:text-[15vw] leading-none font-black font-mono tracking-tighter tabular-nums text-white drop-shadow-[0_0_50px_rgba(255,255,255,0.15)] select-none">
                                        {formatTime(time)}
                                    </div>

                                    {/* Telemetry Data (Only visible when connected) */}
                                    {isConnected && (
                                        <div className="flex gap-8 mt-4 md:mt-8">
                                            <div className="text-center">
                                                <span className="text-xs font-bold text-white/30 uppercase block">Gear</span>
                                                <span className="text-4xl font-black font-mono text-white">
                                                    {telemetry.gear === 0 ? 'R' : telemetry.gear === 1 ? 'N' : telemetry.gear - 1}
                                                </span>
                                            </div>
                                            <div className="text-center">
                                                <span className="text-xs font-bold text-white/30 uppercase block">Speed</span>
                                                <span className="text-4xl font-black font-mono text-white">{telemetry.speed}</span>
                                                <span className="text-xs font-bold text-white/30 uppercase ml-1">km/h</span>
                                            </div>
                                            <div className="text-center">
                                                <span className="text-xs font-bold text-white/30 uppercase block">RPM</span>
                                                <span className="text-4xl font-black font-mono text-white">{telemetry.rpm}</span>
                                            </div>
                                        </div>
                                    )}
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

                                    {/* Play/Pause only if NOT connected (Manual Mode) */}
                                    {!isConnected && (
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
                                    )}

                                    {/* Connected Status Indicator (replaces Play button when connected) */}
                                    {isConnected && (
                                        <div className="h-28 w-28 md:h-32 md:w-32 rounded-full border-4 border-green-500/30 bg-green-500/10 flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.2)]">
                                            <Monitor className="h-12 w-12 text-green-500 animate-pulse" />
                                        </div>
                                    )}

                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="h-20 w-20 md:h-24 md:w-24 rounded-full border-2 border-white/20 hover:bg-white/10"
                                        onClick={handleLap}
                                        disabled={!isRunning && !isConnected}
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
                                <span className="sr-only">Mejor en horizontal</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    )
}

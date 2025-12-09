"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw, Flag, Timer, Save, ChevronLeft, ArrowRight, Smartphone, Wifi, WifiOff, Download, Monitor, QrCode, X, AlertCircle, CheckCircle2, HelpCircle } from "lucide-react"
import { toast } from "sonner"
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
            if (!targetIp) {
                toast.error("IP inválida", { description: "Por favor ingresa una IP válida." })
                return
            }

            const ip = targetIp.replace('http://', '').replace('ws://', '').split(':')[0]
            const wsUrl = `ws://${ip}:8000/ws`

            // Check for Mixed Content (HTTPS -> WS)
            if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
                toast.error("Error de Seguridad (Mixed Content)", {
                    description: "No se puede conectar a un servidor local (ws://) desde una página segura (https://). Por favor accede a la aplicación usando http://localhost:3000 o configura SSL en el puente.",
                    duration: 10000,
                })
                return
            }

            console.log(`Connecting to ${wsUrl}...`)
            const socket = new WebSocket(wsUrl)

            // Track if we ever established connection to differentiate between
            // "failed to connect" and "disconnected after success"
            let connectionEstablished = false

            // Connection timeout
            const timeoutId = setTimeout(() => {
                if (socket.readyState !== WebSocket.OPEN) {
                    socket.close()
                    toast.error("Tiempo de espera agotado", {
                        description: "No se pudo conectar al puente. Verifica que esté corriendo y que la IP sea correcta."
                    })
                }
            }, 5000)

            socket.onopen = () => {
                clearTimeout(timeoutId)
                connectionEstablished = true
                console.log("Connected to AC Bridge")
                setIsConnected(true)
                setShowConnectionDialog(false)
                setServerIp(ip) // Update state if connected via override
                toast.success("Conectado a Assetto Corsa", {
                    description: "Datos de telemetría en tiempo real activos."
                })
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
                clearTimeout(timeoutId)
                console.log("Disconnected from AC Bridge")
                setIsConnected(false)
                setIsRunning(false)

                // If we never connected, it was a connection failure
                if (!connectionEstablished) {
                    toast.error("No se pudo conectar", {
                        description: "Verifica que el puente esté corriendo y la IP sea correcta. Revisa el Firewall."
                    })
                } else {
                    // If we were connected and lost it
                    toast("Desconectado del puente", {
                        description: "Se perdió la conexión con Assetto Corsa."
                    })
                }
            }

            socket.onerror = (error) => {
                // Just log it, onclose will handle the UI feedback
                console.error("WebSocket Error", error)
            }

            socketRef.current = socket
        } catch (e: any) {
            console.error("Connection failed", e)
            toast.error("Error de conexión", { description: e.message || "Ocurrió un error inesperado al intentar conectar." })
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
            if (!isConnected) {
                setShowConnectionDialog(true)
            }
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
                                                        "gap-2 border-white/10 bg-white/5 backdrop-blur-md transition-all",
                                                        isConnected
                                                            ? "text-green-500 border-green-500/50 hover:bg-green-500/10"
                                                            : "text-white/50 hover:text-white hover:bg-white/10 animate-pulse"
                                                    )}
                                                >
                                                    {isConnected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                                                    <span className="hidden md:inline font-medium">{isConnected ? "Conectado" : "Desconectado"}</span>
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="bg-zinc-950 border-white/10 text-white max-w-2xl max-h-[85vh] overflow-y-auto">
                                                <DialogHeader>
                                                    <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-2">
                                                        <Monitor className="h-6 w-6 text-primary" />
                                                        Conectar con Assetto Corsa
                                                    </DialogTitle>
                                                    <DialogDescription className="text-white/50">
                                                        Sigue estos pasos para sincronizar la telemetría en tiempo real.
                                                    </DialogDescription>
                                                </DialogHeader>

                                                <div className="grid md:grid-cols-2 gap-8 py-4">
                                                    {/* Left Column: Instructions */}
                                                    <div className="space-y-8">
                                                        {/* Step 1 */}
                                                        <div className="relative pl-8">
                                                            <div className="absolute left-0 top-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold border border-primary/50">1</div>
                                                            <h4 className="font-bold text-white mb-1">Abrir Assetto Corsa</h4>
                                                            <p className="text-sm text-white/50">
                                                                Inicia una sesión de <strong>Práctica</strong> o <strong>Hotlap</strong> en el juego. El auto debe estar en pista (no en boxes).
                                                            </p>
                                                        </div>

                                                        {/* Step 2 */}
                                                        <div className="relative pl-8">
                                                            <div className="absolute left-0 top-0 flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-white/70 text-xs font-bold border border-white/20">2</div>
                                                            <h4 className="font-bold text-white mb-1">Ejecutar Puente</h4>
                                                            <p className="text-sm text-white/50 mb-3">
                                                                Descarga y abre el archivo <code>AC_Bridge.exe</code> en tu PC.
                                                            </p>
                                                            <Button size="sm" variant="secondary" className="w-full gap-2 h-8 text-xs" asChild>
                                                                <a href="/downloads/AC_Bridge.exe" download>
                                                                    <Download className="h-3 w-3" />
                                                                    Descargar AC_Bridge.exe
                                                                </a>
                                                            </Button>
                                                        </div>

                                                        {/* Step 3 */}
                                                        <div className="relative pl-8">
                                                            <div className="absolute left-0 top-0 flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-white/70 text-xs font-bold border border-white/20">3</div>
                                                            <h4 className="font-bold text-white mb-1">Escanear QR</h4>
                                                            <p className="text-sm text-white/50">
                                                                Escanea el código QR que aparece en la ventana negra del puente.
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Right Column: Action */}
                                                    <div className="flex flex-col gap-4 bg-white/5 rounded-xl p-4 border border-white/10">
                                                        {!showScanner ? (
                                                            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                                                                <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-2">
                                                                    <QrCode className="h-8 w-8 text-white/50" />
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-bold text-lg">Escanear Código QR</h3>
                                                                    <p className="text-xs text-white/40 max-w-[200px] mx-auto">
                                                                        Apunta tu cámara al código QR en la pantalla de tu PC.
                                                                    </p>
                                                                </div>
                                                                <Button
                                                                    size="lg"
                                                                    className="w-full font-bold shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                                                                    onClick={() => setShowScanner(true)}
                                                                >
                                                                    <QrCode className="mr-2 h-5 w-5" />
                                                                    Abrir Escáner
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex-1 flex flex-col">
                                                                <div className="relative flex-1 bg-black rounded-lg overflow-hidden border border-white/10 min-h-[250px]">
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
                                                                    <div className="absolute inset-0 border-2 border-primary/50 m-8 rounded-lg pointer-events-none animate-pulse" />
                                                                    <Button
                                                                        size="icon"
                                                                        variant="ghost"
                                                                        className="absolute top-2 right-2 h-8 w-8 bg-black/50 text-white hover:bg-black/80"
                                                                        onClick={() => setShowScanner(false)}
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                                <p className="text-center text-xs text-white/40 mt-2">
                                                                    Buscando código QR...
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Troubleshooting Footer */}
                                                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 flex gap-3 items-start">
                                                    <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                                                    <div className="space-y-1">
                                                        <h5 className="text-xs font-bold text-yellow-500 uppercase tracking-wide">¿Problemas de conexión?</h5>
                                                        <ul className="text-[10px] text-yellow-500/80 list-disc pl-3 space-y-0.5">
                                                            <li>Asegúrate que tu celular y PC estén en la <strong>misma red Wi-Fi</strong>.</li>
                                                            <li>Verifica que el Firewall de Windows no esté bloqueando <code>python</code> o el puerto <code>8000</code>.</li>
                                                            <li>Si usas VPN, desactívala temporalmente.</li>
                                                        </ul>
                                                    </div>
                                                </div>
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

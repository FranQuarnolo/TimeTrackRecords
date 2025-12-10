import * as React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Wifi, WifiOff, Monitor, Download, QrCode, X, AlertCircle } from "lucide-react"
import { Scanner } from '@yudiel/react-qr-scanner'
import { cn } from "@/lib/utils"

interface ConnectionStatusProps {
    isConnected: boolean;
    connectToBridge: (ip?: string) => void;
    showConnectionDialog: boolean;
    setShowConnectionDialog: (show: boolean) => void;
}

export function ConnectionStatus({
    isConnected,
    connectToBridge,
    showConnectionDialog,
    setShowConnectionDialog
}: ConnectionStatusProps) {
    const [showScanner, setShowScanner] = React.useState(false)

    const handleScan = (result: string) => {
        if (result) {
            try {
                let ip = result
                if (result.includes('ws://')) {
                    ip = result.split('ws://')[1].split(':')[0]
                }
                setShowScanner(false)
                connectToBridge(ip)
            } catch (e) {
                console.error("Invalid QR Code", e)
            }
        }
    }

    return (
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
    )
}

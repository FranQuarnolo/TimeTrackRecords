import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

export interface TelemetryData {
    speed: number;
    gear: number;
    rpm: number;
    gas: number;
    brake: number;
}

export const useACConnection = () => {
    const [serverIp, setServerIp] = useState("192.168.1.X");
    const [isConnected, setIsConnected] = useState(false);
    const [acData, setAcData] = useState<any>(null);
    const socketRef = useRef<WebSocket | null>(null);
    const [telemetry, setTelemetry] = useState<TelemetryData>({
        speed: 0,
        gear: 0,
        rpm: 0,
        gas: 0,
        brake: 0
    });
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    const connectToBridge = (ipOverride?: string) => {
        if (socketRef.current) {
            socketRef.current.close();
        }

        try {
            // Clean IP
            const targetIp = ipOverride || serverIp;
            if (!targetIp) {
                toast.error("IP inválida", { description: "Por favor ingresa una IP válida." });
                return;
            }

            const ip = targetIp.replace('http://', '').replace('ws://', '').split(':')[0];
            const wsUrl = `ws://${ip}:8000/ws`;

            // Check for Mixed Content (HTTPS -> WS)
            if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
                toast.error("Error de Seguridad (Mixed Content)", {
                    description: "No se puede conectar al puente desde HTTPS. Cambia a HTTP.",
                    duration: Infinity,
                    action: {
                        label: "Cambiar a HTTP",
                        onClick: () => {
                            const url = new URL(window.location.href);
                            url.protocol = "http:";
                            window.location.href = url.toString();
                        }
                    }
                });
                return;
            }

            console.log(`Connecting to ${wsUrl}...`);
            const socket = new WebSocket(wsUrl);

            let connectionEstablished = false;

            const timeoutId = setTimeout(() => {
                if (socket.readyState !== WebSocket.OPEN) {
                    socket.close();
                    toast.error("Tiempo de espera agotado", {
                        description: "No se pudo conectar al puente. Verifica que esté corriendo y que la IP sea correcta."
                    });
                }
            }, 5000);

            socket.onopen = () => {
                clearTimeout(timeoutId);
                connectionEstablished = true;
                console.log("Connected to AC Bridge");
                setIsConnected(true);
                setServerIp(ip);
                toast.success("Conectado a Assetto Corsa", {
                    description: "Datos de telemetría en tiempo real activos."
                });
            };

            socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.connected) {
                        setAcData(data);

                        setTelemetry({
                            speed: Math.round(data.physics.speedKmh),
                            gear: data.physics.gear,
                            rpm: data.physics.rpms,
                            gas: data.physics.gas,
                            brake: data.physics.brake
                        });

                        if (data.graphics.iCurrentTime > 0) {
                            setTime(data.graphics.iCurrentTime);
                            setIsRunning(true);
                        }
                    }
                } catch (e) {
                    console.error("Error parsing AC data", e);
                }
            };

            socket.onclose = () => {
                clearTimeout(timeoutId);
                console.log("Disconnected from AC Bridge");
                setIsConnected(false);
                setIsRunning(false);

                if (!connectionEstablished) {
                    toast.error("No se pudo conectar", {
                        description: "Verifica que el puente esté corriendo y la IP sea correcta. Revisa el Firewall."
                    });
                } else {
                    toast("Desconectado del puente", {
                        description: "Se perdió la conexión con Assetto Corsa."
                    });
                }
            };

            socket.onerror = (error) => {
                console.error("WebSocket Error", error);
            };

            socketRef.current = socket;
        } catch (e: any) {
            console.error("Connection failed", e);
            toast.error("Error de conexión", { description: e.message || "Ocurrió un error inesperado al intentar conectar." });
        }
    };

    useEffect(() => {
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, []);

    // Fallback Timer Logic (only if not connected to AC)
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    useEffect(() => {
        if (isRunning && !isConnected) {
            intervalRef.current = setInterval(() => {
                setTime(prev => prev + 10);
            }, 10);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning, isConnected]);

    return {
        serverIp,
        setServerIp,
        isConnected,
        acData,
        telemetry,
        time,
        setTime,
        isRunning,
        setIsRunning,
        connectToBridge
    };
};

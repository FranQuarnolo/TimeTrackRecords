"use client"

import * as React from "react"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Line, LineChart, CartesianGrid } from "recharts"
import { Trophy, TrendingUp, Activity, Timer, Car, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function AnalyticsPage() {
    const { laps, circuits, cars } = useStore()

    // 1. Best Laps per Circuit
    const bestLapsData = React.useMemo(() => {
        const data = circuits.map(circuit => {
            const circuitLaps = laps.filter(l => l.circuitId === circuit.id)
            if (circuitLaps.length === 0) return null
            const bestTime = Math.min(...circuitLaps.map(l => l.time))
            return {
                name: circuit.name,
                time: bestTime / 1000, // seconds
                displayTime: formatTime(bestTime)
            }
        }).filter(Boolean)
        return data.sort((a, b) => (a?.time || 0) - (b?.time || 0)).slice(0, 5) // Top 5 fastest tracks? Or just list them.
    }, [laps, circuits])

    // 2. Progression (Last 10 sessions)
    const progressionData = React.useMemo(() => {
        // Group by date
        const sortedLaps = [...laps].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        const lastLaps = sortedLaps.slice(-20) // Last 20 laps
        return lastLaps.map((lap, index) => ({
            index: index + 1,
            time: lap.time / 1000,
            circuit: circuits.find(c => c.id === lap.circuitId)?.name || 'Unknown',
            date: format(new Date(lap.date), 'dd/MM')
        }))
    }, [laps, circuits])

    // 3. Consistency (Standard Deviation per Circuit)
    const consistencyData = React.useMemo(() => {
        return circuits.map(circuit => {
            const circuitLaps = laps.filter(l => l.circuitId === circuit.id)
            if (circuitLaps.length < 3) return null // Need at least 3 laps for meaningful stats

            const times = circuitLaps.map(l => l.time)
            const mean = times.reduce((a, b) => a + b, 0) / times.length
            const variance = times.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / times.length
            const stdDev = Math.sqrt(variance)

            return {
                name: circuit.name,
                stdDev: stdDev / 1000, // seconds
                laps: circuitLaps.length
            }
        }).filter(Boolean).sort((a, b) => (a?.stdDev || 0) - (b?.stdDev || 0)).slice(0, 5) // Top 5 most consistent
    }, [laps, circuits])

    // 4. Total Stats
    const totalStats = React.useMemo(() => {
        const totalLaps = laps.length
        const uniqueCircuits = new Set(laps.map(l => l.circuitId)).size
        const uniqueCars = new Set(laps.map(l => l.carModel)).size
        return { totalLaps, uniqueCircuits, uniqueCars }
    }, [laps])

    function formatTime(ms: number) {
        const minutes = Math.floor(ms / 60000)
        const seconds = Math.floor((ms % 60000) / 1000)
        const milliseconds = Math.floor((ms % 1000) / 10)
        return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`
    }

    return (
        <div className="min-h-screen bg-black text-white pb-24 p-6 space-y-8">
            <header className="space-y-4">
                <Button variant="ghost" size="sm" asChild className="pl-0 text-primary hover:text-primary/80 hover:bg-transparent">
                    <Link href="/">
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Volver al menú
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                        <span className="text-primary">///</span>
                        Analytics
                    </h1>
                    <p className="text-white/50 text-sm font-light">
                        Analiza tu rendimiento y evolución en pista.
                    </p>
                </div>
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
                <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <Trophy className="h-6 w-6 text-primary mb-2" />
                        <span className="text-2xl font-bold text-white">{totalStats.totalLaps}</span>
                        <span className="text-[10px] text-white/50 uppercase tracking-wider">Vueltas Totales</span>
                    </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <Activity className="h-6 w-6 text-primary mb-2" />
                        <span className="text-2xl font-bold text-white">{totalStats.uniqueCircuits}</span>
                        <span className="text-[10px] text-white/50 uppercase tracking-wider">Circuitos Únicos</span>
                    </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <Car className="h-6 w-6 text-primary mb-2" />
                        <span className="text-2xl font-bold text-white">{totalStats.uniqueCars}</span>
                        <span className="text-[10px] text-white/50 uppercase tracking-wider">Autos Usados</span>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="progression" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10">
                    <TabsTrigger value="progression" className="data-[state=active]:bg-primary data-[state=active]:text-black text-white/70">Progreso</TabsTrigger>
                    <TabsTrigger value="best" className="data-[state=active]:bg-primary data-[state=active]:text-black text-white/70">Récords</TabsTrigger>
                    <TabsTrigger value="consistency" className="data-[state=active]:bg-primary data-[state=active]:text-black text-white/70">Consistencia</TabsTrigger>
                </TabsList>

                <TabsContent value="progression" className="mt-6 space-y-4">
                    <Card className="bg-black border-white/10">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-primary" />
                                Últimas 20 Vueltas
                            </CardTitle>
                            <p className="text-xs text-white/40">Evolución de tus tiempos en las últimas sesiones.</p>
                        </CardHeader>
                        <CardContent className="p-0 pb-4">
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={progressionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                        <XAxis dataKey="index" stroke="#666" tick={{ fill: '#666', fontSize: 10 }} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#666" tick={{ fill: '#666', fontSize: 10 }} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                                            itemStyle={{ color: '#fff' }}
                                            labelStyle={{ color: '#666' }}
                                            formatter={(value: number) => [`${value.toFixed(3)}s`, 'Tiempo']}
                                            labelFormatter={(label) => `Vuelta ${label}`}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="time"
                                            stroke="var(--primary)"
                                            strokeWidth={2}
                                            dot={{ fill: 'var(--primary)', r: 4 }}
                                            activeDot={{ r: 6, fill: '#fff' }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="best" className="mt-6 space-y-4">
                    <Card className="bg-black border-white/10">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                                <Trophy className="h-5 w-5 text-primary" />
                                Mejores Tiempos (Top 5)
                            </CardTitle>
                            <p className="text-xs text-white/40">Tus récords absolutos por circuito.</p>
                        </CardHeader>
                        <CardContent className="p-0 pb-4">
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={bestLapsData} layout="vertical" margin={{ top: 0, right: 30, left: 30, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                                        <XAxis type="number" stroke="#666" tick={{ fill: '#666', fontSize: 10 }} tickLine={false} axisLine={false} hide />
                                        <YAxis dataKey="name" type="category" stroke="#fff" tick={{ fill: '#fff', fontSize: 11, fontWeight: 'bold' }} tickLine={false} axisLine={false} width={100} />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                            contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                                            itemStyle={{ color: '#fff' }}
                                            formatter={(value: number) => [`${formatTime(value * 1000)}`, 'Tiempo']}
                                        />
                                        <Bar dataKey="time" fill="var(--primary)" radius={[0, 4, 4, 0]} barSize={30}>
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="consistency" className="mt-6 space-y-4">
                    <Card className="bg-black border-white/10">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                                <Activity className="h-5 w-5 text-primary" />
                                Más Consistentes
                            </CardTitle>
                            <p className="text-xs text-white/40">Circuitos con menor desviación estándar (mayor regularidad).</p>
                        </CardHeader>
                        <CardContent className="p-0 pb-4">
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={consistencyData} layout="vertical" margin={{ top: 0, right: 30, left: 30, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                                        <XAxis type="number" stroke="#666" tick={{ fill: '#666', fontSize: 10 }} tickLine={false} axisLine={false} hide />
                                        <YAxis dataKey="name" type="category" stroke="#fff" tick={{ fill: '#fff', fontSize: 11, fontWeight: 'bold' }} tickLine={false} axisLine={false} width={100} />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                            contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                                            itemStyle={{ color: '#fff' }}
                                            formatter={(value: number) => [`${value.toFixed(3)}s`, 'Desviación']}
                                        />
                                        <Bar dataKey="stdDev" fill="#10b981" radius={[0, 4, 4, 0]} barSize={30} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

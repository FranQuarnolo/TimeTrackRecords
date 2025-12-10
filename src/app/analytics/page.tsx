"use client"

import * as React from "react"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Line, LineChart, CartesianGrid, Legend, LabelList } from "recharts"
import { Trophy, TrendingUp, Activity, Timer, Car, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatTime } from "@/lib/utils"

export default function AnalyticsPage() {
    const { laps, circuits } = useStore()
    const [sessionType, setSessionType] = React.useState<'qualifying' | 'race'>('qualifying')

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
        return data.sort((a, b) => (a?.time || 0) - (b?.time || 0)).slice(0, 5)
    }, [laps, circuits])

    // 2. Progression (Last 10 laps per circuit)
    const progressionData = React.useMemo(() => {
        // Filter by session type
        const filteredLaps = laps.filter(l => l.type === sessionType)

        // Group by circuit
        const lapsByCircuit: Record<string, any[]> = {}

        circuits.forEach(circuit => {
            const circuitLaps = filteredLaps
                .filter(l => l.circuitId === circuit.id)
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(-10) // Last 10 laps

            if (circuitLaps.length > 0) {
                lapsByCircuit[circuit.name] = circuitLaps.map((lap, index) => ({
                    index: index + 1,
                    time: lap.time / 1000,
                    date: format(new Date(lap.date), 'dd/MM')
                }))
            }
        })

        // Transform for Recharts: Array of { index: 1, CircuitA: time, CircuitB: time, ... }
        const chartData = []
        for (let i = 0; i < 10; i++) {
            const dataPoint: any = { index: i + 1 }
            Object.entries(lapsByCircuit).forEach(([circuitName, laps]) => {
                if (laps[i]) {
                    dataPoint[circuitName] = laps[i].time
                    dataPoint[`${circuitName}_date`] = laps[i].date
                }
            })
            chartData.push(dataPoint)
        }

        return { chartData, circuits: Object.keys(lapsByCircuit) }
    }, [laps, circuits, sessionType])

    // 4. Total Stats
    const totalStats = React.useMemo(() => {
        const totalLaps = laps.length
        const uniqueCircuits = new Set(laps.map(l => l.circuitId)).size
        const uniqueCars = new Set(laps.map(l => l.carModel)).size
        return { totalLaps, uniqueCircuits, uniqueCars }
    }, [laps])


    // Generate consistent colors for circuits
    const getCircuitColor = (index: number) => {
        const colors = [
            '#ef4444', // red
            '#3b82f6', // blue
            '#10b981', // green
            '#f59e0b', // amber
            '#8b5cf6', // violet
            '#ec4899', // pink
            '#06b6d4', // cyan
            '#f97316', // orange
        ]
        return colors[index % colors.length]
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
                <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10">
                    <TabsTrigger value="progression" className="data-[state=active]:bg-primary data-[state=active]:text-black text-white/70">Progreso</TabsTrigger>
                    <TabsTrigger value="best" className="data-[state=active]:bg-primary data-[state=active]:text-black text-white/70">Récords</TabsTrigger>
                </TabsList>

                <TabsContent value="progression" className="mt-6 space-y-4">
                    <Card className="bg-black border-white/10">
                        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-2">
                            <div>
                                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-primary" />
                                    Progreso por Circuito
                                </CardTitle>
                                <p className="text-xs text-white/40">Últimas 10 vueltas por circuito.</p>
                            </div>
                            <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg border border-white/10 w-full md:w-auto">
                                <Button
                                    size="sm"
                                    variant={sessionType === 'qualifying' ? 'default' : 'ghost'}
                                    onClick={() => setSessionType('qualifying')}
                                    className={`flex-1 md:flex-none ${sessionType === 'qualifying' ? 'bg-primary text-black hover:bg-primary/90' : 'text-white/50 hover:text-white hover:bg-transparent'}`}
                                >
                                    Clasificación
                                </Button>
                                <Button
                                    size="sm"
                                    variant={sessionType === 'race' ? 'default' : 'ghost'}
                                    onClick={() => setSessionType('race')}
                                    className={`flex-1 md:flex-none ${sessionType === 'race' ? 'bg-primary text-black hover:bg-primary/90' : 'text-white/50 hover:text-white hover:bg-transparent'}`}
                                >
                                    Carrera
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 pb-4 pt-4">
                            <div className="h-[500px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={progressionData.chartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                        <XAxis
                                            dataKey="index"
                                            stroke="#444"
                                            tick={{ fill: '#666', fontSize: 12 }}
                                            tickLine={false}
                                            axisLine={false}
                                            dy={10}
                                        />
                                        <YAxis stroke="#444" tick={{ fill: '#666', fontSize: 12 }} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
                                            itemStyle={{ color: '#fff', fontSize: '12px' }}
                                            labelStyle={{ color: '#888', marginBottom: '8px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}
                                            formatter={(value: number, name: string) => [`${value.toFixed(3)}s`, name]}
                                            labelFormatter={(label) => `Vuelta ${label}`}
                                        />
                                        <Legend
                                            verticalAlign="bottom"
                                            height={36}
                                            iconType="circle"
                                            wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }}
                                        />
                                        {progressionData.circuits.map((circuit, index) => (
                                            <Line
                                                key={circuit}
                                                type="monotone"
                                                dataKey={circuit}
                                                stroke={getCircuitColor(index)}
                                                strokeWidth={3}
                                                dot={{ fill: getCircuitColor(index), r: 4, strokeWidth: 0 }}
                                                activeDot={{ r: 6, fill: '#fff', stroke: getCircuitColor(index), strokeWidth: 2 }}
                                                connectNulls
                                            />
                                        ))}
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
                            <div className="h-[400px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={bestLapsData} layout="vertical" margin={{ top: 0, right: 60, left: 40, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#222" horizontal={false} />
                                        <XAxis type="number" stroke="#444" tick={{ fill: '#666', fontSize: 12 }} tickLine={false} axisLine={false} hide />
                                        <YAxis dataKey="name" type="category" stroke="#fff" tick={{ fill: '#fff', fontSize: 12, fontWeight: 'bold' }} tickLine={false} axisLine={false} width={120} />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                            contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
                                            itemStyle={{ color: '#fff', fontSize: '12px' }}
                                            formatter={(value: number) => [`${formatTime(value * 1000)}`, 'Tiempo']}
                                        />
                                        <Bar dataKey="time" fill="var(--primary)" radius={[0, 4, 4, 0]} barSize={40}>
                                            <LabelList dataKey="displayTime" position="right" fill="#fff" fontSize={12} fontWeight="bold" />
                                        </Bar>
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

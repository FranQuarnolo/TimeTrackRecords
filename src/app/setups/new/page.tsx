"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { SetupForm } from "@/components/setups/setup-form"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { Setup } from "@/types"

export default function NewSetupPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const carId = searchParams.get("carId")
    const { cars, addSetup } = useStore()

    const car = cars.find(c => c.id === carId)

    if (!carId || !car) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-3 space-y-4">
                <p className="text-white/50">Auto no encontrado o no seleccionado.</p>
                <Button asChild variant="outline" className="text-primary hover:text-primary/80 hover:bg-transparent">
                    <Link href="/setups">Volver a Setups</Link>
                </Button>
            </div>
        )
    }

    const handleSave = async (data: Omit<Setup, 'id' | 'created_at'>) => {
        await addSetup(data)
        router.push("/setups")
    }

    return (
        <div className="min-h-screen bg-black text-white pb-24">
            <div className="p-6 space-y-8 max-w-2xl mx-auto">
                <header className="space-y-4">
                    <Button variant="ghost" size="sm" asChild className="pl-0 text-primary hover:text-primary/80 hover:bg-transparent">
                        <Link href="/setups">
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Volver a Setups
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                            <span className="text-primary">///</span>
                            Nuevo Setup
                        </h1>
                        <p className="text-white/50 text-sm font-light">
                            Creando configuración para <span className="text-primary font-bold">{car.name}</span>
                        </p>
                    </div>
                </header>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <SetupForm
                        carId={carId}
                        onSubmit={handleSave}
                        onCancel={() => router.back()}
                    />
                </div>
            </div>
        </div>
    )
}

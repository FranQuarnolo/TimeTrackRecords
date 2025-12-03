"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useStore } from "@/lib/store"
import { format } from "date-fns"

export function ExportButton() {
    const { laps, circuits, cars } = useStore()

    const handleExport = () => {
        // 1. Prepare Data
        const headers = ["Fecha", "Circuito", "Auto", "Tiempo (ms)", "Tiempo (Formato)", "Tipo"]
        const rows = laps.map(lap => {
            const circuitName = circuits.find(c => c.id === lap.circuitId)?.name || lap.circuitId
            const carName = cars.find(c => c.id === lap.carModel)?.name || lap.carModel || "Desconocido"

            const minutes = Math.floor(lap.time / 60000)
            const seconds = Math.floor((lap.time % 60000) / 1000)
            const milliseconds = Math.floor((lap.time % 1000) / 10)
            const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`

            return [
                format(new Date(lap.date), "yyyy-MM-dd HH:mm:ss"),
                `"${circuitName}"`, // Quote to handle commas
                `"${carName}"`,
                lap.time,
                formattedTime,
                lap.type
            ]
        })

        // 2. Convert to CSV
        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n")

        // 3. Trigger Download
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `tiempos_export_${format(new Date(), "yyyyMMdd_HHmmss")}.csv`)
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="border-white/10 hover:bg-white/10 text-white/70 hover:text-white"
        >
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
        </Button>
    )
}

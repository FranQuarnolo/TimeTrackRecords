'use client' // Error components must be Client Components

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-black text-white">
            <div className="flex flex-col items-center gap-2 text-center">
                <div className="rounded-full bg-red-500/10 p-4">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">¡Algo salió mal!</h2>
                <p className="text-white/60">
                    Ha ocurrido un error inesperado. Por favor, intenta de nuevo.
                </p>
            </div>
            <Button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
                variant="outline"
                className="border-white/10 bg-white/5 hover:bg-white/10 hover:text-white"
            >
                Intentar de nuevo
            </Button>
        </div>
    )
}

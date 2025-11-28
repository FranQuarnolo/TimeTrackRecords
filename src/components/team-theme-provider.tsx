"use client"

import { useStore } from "@/lib/store"
import { useEffect } from "react"

export function TeamThemeProvider({ children }: { children: React.ReactNode }) {
    const teamTheme = useStore((state) => state.teamTheme)
    const syncCircuits = useStore((state) => state.syncCircuits)

    useEffect(() => {
        syncCircuits()
    }, [syncCircuits])

    useEffect(() => {
        console.log('TeamTheme changed:', teamTheme)
        const root = window.document.documentElement
        root.setAttribute("data-team", teamTheme)
        console.log('Attribute set to:', root.getAttribute('data-team'))
    }, [teamTheme])

    return <>{children}</>
}

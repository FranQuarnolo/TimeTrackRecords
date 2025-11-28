"use client"

import { useStore } from "@/lib/store"
import { useEffect } from "react"

export function TeamThemeProvider({ children }: { children: React.ReactNode }) {
    const { teamTheme, syncCircuits } = useStore()

    useEffect(() => {
        syncCircuits()
    }, [syncCircuits])

    useEffect(() => {
        const root = window.document.documentElement
        root.setAttribute("data-team", teamTheme)
    }, [teamTheme])

    return <>{children}</>
}

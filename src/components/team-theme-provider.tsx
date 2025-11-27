"use client"

import { useStore } from "@/lib/store"
import { useEffect } from "react"

export function TeamThemeProvider({ children }: { children: React.ReactNode }) {
    const { teamTheme } = useStore()

    useEffect(() => {
        const root = window.document.documentElement
        root.setAttribute("data-team", teamTheme)
    }, [teamTheme])

    return <>{children}</>
}

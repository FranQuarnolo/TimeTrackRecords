"use client"

import { Flag, ChevronLeft, Timer } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeDrawer } from "@/components/theme-drawer";

export function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const isHome = pathname === "/";

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/20 backdrop-blur-md shadow-sm">
            <div className="container flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    {!isHome && (
                        <Button variant="ghost" size="icon" onClick={() => router.back()} className="-ml-2 text-white hover:text-primary hover:bg-white/10">
                            <ChevronLeft className="h-6 w-6" />
                        </Button>
                    )}
                    <div className="flex items-center gap-2 font-bold text-lg">
                        <div className="bg-primary p-1.5 rounded-lg shadow-[0_0_10px_var(--primary)]">
                            <Timer className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-white uppercase tracking-widest text-sm sm:text-base font-black italic">TimeTracks</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <ThemeDrawer />
                </div>
            </div>
        </header>
    );
}

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
        <header className="sticky top-0 z-50 w-full border-b bg-background shadow-sm">
            <div className="container flex h-14 items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    {!isHome && (
                        <Button variant="ghost" size="icon" onClick={() => router.back()} className="-ml-2">
                            <ChevronLeft className="h-6 w-6" />
                        </Button>
                    )}
                    <div className="flex items-center gap-2 font-bold text-lg">
                        <Timer className="h-8 w-8 text-primary" />
                        <span>TimeTracksRecords</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <ThemeDrawer />
                </div>
            </div>
        </header>
    );
}

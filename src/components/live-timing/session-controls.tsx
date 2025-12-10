import * as React from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw, Flag, Monitor } from "lucide-react"
import { cn } from "@/lib/utils"

interface SessionControlsProps {
    isRunning: boolean;
    isConnected: boolean;
    onStartStop: () => void;
    onReset: () => void;
    onLap: () => void;
}

export function SessionControls({
    isRunning,
    isConnected,
    onStartStop,
    onReset,
    onLap
}: SessionControlsProps) {
    return (
        <div className="relative z-10 p-8 pb-12 flex items-center justify-center gap-12">
            <Button
                variant="outline"
                size="lg"
                className="h-20 w-20 md:h-24 md:w-24 rounded-full border-2 border-white/20 hover:bg-white/10"
                onClick={onReset}
            >
                <RotateCcw className="h-8 w-8 text-white/70" />
            </Button>

            {/* Play/Pause only if NOT connected (Manual Mode) */}
            {!isConnected && (
                <Button
                    size="lg"
                    className={cn(
                        "h-28 w-28 md:h-32 md:w-32 rounded-full border-4 shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all active:scale-95",
                        isRunning
                            ? "bg-red-500 hover:bg-red-600 border-red-400 text-white"
                            : "bg-green-500 hover:bg-green-600 border-green-400 text-black"
                    )}
                    onClick={onStartStop}
                >
                    {isRunning ? (
                        <Pause className="h-12 w-12 fill-current" />
                    ) : (
                        <Play className="h-12 w-12 fill-current ml-2" />
                    )}
                </Button>
            )}

            {/* Connected Status Indicator (replaces Play button when connected) */}
            {isConnected && (
                <div className="h-28 w-28 md:h-32 md:w-32 rounded-full border-4 border-green-500/30 bg-green-500/10 flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.2)]">
                    <Monitor className="h-12 w-12 text-green-500 animate-pulse" />
                </div>
            )}

            <Button
                variant="outline"
                size="lg"
                className="h-20 w-20 md:h-24 md:w-24 rounded-full border-2 border-white/20 hover:bg-white/10"
                onClick={onLap}
                disabled={!isRunning && !isConnected}
            >
                <Flag className="h-8 w-8 text-white/70" />
            </Button>
        </div>
    )
}

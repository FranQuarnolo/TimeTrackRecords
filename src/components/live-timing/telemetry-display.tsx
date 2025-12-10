import * as React from "react"
import { TelemetryData } from "@/hooks/useACConnection"

interface TelemetryDisplayProps {
    telemetry: TelemetryData;
    isConnected: boolean;
}

export function TelemetryDisplay({ telemetry, isConnected }: TelemetryDisplayProps) {
    if (!isConnected) return null;

    return (
        <div className="flex gap-8 mt-4 md:mt-8">
            <div className="text-center">
                <span className="text-xs font-bold text-white/30 uppercase block">Gear</span>
                <span className="text-4xl font-black font-mono text-white">
                    {telemetry.gear === 0 ? 'R' : telemetry.gear === 1 ? 'N' : telemetry.gear - 1}
                </span>
            </div>
            <div className="text-center">
                <span className="text-xs font-bold text-white/30 uppercase block">Speed</span>
                <span className="text-4xl font-black font-mono text-white">{telemetry.speed}</span>
                <span className="text-xs font-bold text-white/30 uppercase ml-1">km/h</span>
            </div>
            <div className="text-center">
                <span className="text-xs font-bold text-white/30 uppercase block">RPM</span>
                <span className="text-4xl font-black font-mono text-white">{telemetry.rpm}</span>
            </div>
        </div>
    )
}

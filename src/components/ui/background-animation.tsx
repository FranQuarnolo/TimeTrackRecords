"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function BackgroundAnimation({ backgroundImage = "/background.png" }: { backgroundImage?: string }) {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="relative w-full h-full">
                <Image
                    src={backgroundImage}
                    alt="Background"
                    fill
                    className="object-cover opacity-60"
                    priority
                />
            </div>
            {/* Gradient Overlay for Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
        </div>
    );
}

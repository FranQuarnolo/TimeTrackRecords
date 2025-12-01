"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function BackgroundAnimation({ backgroundImage = "/background.png" }: { backgroundImage?: string }) {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
                className="relative w-full h-full"
            >
                <Image
                    src={backgroundImage}
                    alt="Background"
                    fill
                    className="object-cover opacity-80"
                    priority
                />
            </motion.div>
            {/* Gradient Overlay for Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-transparent" />
        </div>
    );
}

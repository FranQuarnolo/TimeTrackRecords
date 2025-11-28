"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Timer, PlusCircle, ChevronRight } from "lucide-react";
import { Header } from "@/components/layout/header";
import { motion } from "framer-motion";
import { BackgroundAnimation } from "@/components/ui/background-animation";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col relative overflow-hidden bg-black text-white selection:bg-primary/30">
      <BackgroundAnimation />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 flex flex-col items-center justify-center p-6 gap-12">

          {/* Main Action Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="w-full max-w-md"
          >
            <div className="relative group">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/50 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />

              <Button
                asChild
                className="relative w-full h-32 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 overflow-hidden group"
              >
                <Link href="/mis-tiempos" className="flex items-center justify-between px-8">
                  <div className="flex flex-col items-start gap-2">
                    <span className="text-xs font-mono text-primary tracking-widest uppercase">Sistema de Telemetría</span>
                    <span className="text-3xl font-bold italic tracking-tighter text-white group-hover:text-primary-foreground transition-colors">
                      MIS TIEMPOS
                    </span>
                    <div className="flex items-center gap-2 text-zinc-400 text-sm">
                      <Timer className="h-4 w-4" />
                      <span>Ver mis tiempos</span>
                    </div>
                  </div>
                  <ChevronRight className="h-8 w-8 text-zinc-500 group-hover:text-primary group-hover:translate-x-1 transition-all" />

                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 p-2 opacity-50">
                    <div className="w-16 h-1 bg-gradient-to-l from-primary to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 p-2 opacity-50">
                    <div className="w-16 h-1 bg-gradient-to-r from-primary to-transparent" />
                  </div>
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Quick Action FAB */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <Button
              asChild
              size="icon"
              className="h-16 w-16 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 border-2 border-primary/20 hover:scale-110 transition-transform duration-300"
            >
              <Link href="/cargar-tiempo">
                <PlusCircle className="h-8 w-8" />
                <span className="sr-only">Cargar Tiempo</span>
              </Link>
            </Button>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

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
            className="w-full max-w-md space-y-4"
          >
            {/* Mis Tiempos (Main) */}
            <div className="relative group">
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
                </Link>
              </Button>
            </div>

            {/* Grid for new features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Analytics */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-10 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
                <Button
                  asChild
                  className="relative w-full h-28 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 hover:bg-white/5 hover:border-blue-500/50 transition-all duration-300 overflow-hidden group"
                >
                  <Link href="/analytics" className="flex items-center justify-between px-6">
                    <div className="flex flex-col items-start gap-1">
                      <span className="text-[10px] font-mono text-blue-400 tracking-widest uppercase">Estadísticas</span>
                      <span className="text-2xl font-bold italic tracking-tighter text-white group-hover:text-blue-400 transition-colors">
                        ANALYTICS
                      </span>
                    </div>
                    <span className="text-3xl group-hover:scale-110 transition-transform duration-300">📊</span>
                  </Link>
                </Button>
              </div>

              {/* Setups */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl blur opacity-10 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
                <Button
                  asChild
                  className="relative w-full h-28 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 hover:bg-white/5 hover:border-orange-500/50 transition-all duration-300 overflow-hidden group"
                >
                  <Link href="/setups" className="flex items-center justify-between px-6">
                    <div className="flex flex-col items-start gap-1">
                      <span className="text-[10px] font-mono text-orange-400 tracking-widest uppercase">Taller</span>
                      <span className="text-2xl font-bold italic tracking-tighter text-white group-hover:text-orange-400 transition-colors">
                        SETUPS
                      </span>
                    </div>
                    <span className="text-3xl group-hover:scale-110 transition-transform duration-300">🔧</span>
                  </Link>
                </Button>
              </div>

              {/* Live Timing (Full Width) */}
              <div className="relative group md:col-span-2">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-10 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
                <Button
                  asChild
                  className="relative w-full h-24 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 hover:bg-white/5 hover:border-green-500/50 transition-all duration-300 overflow-hidden group"
                >
                  <Link href="/live-timing" className="flex items-center justify-between px-8">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl group-hover:rotate-12 transition-transform duration-300">⏱️</span>
                      <div className="flex flex-col items-start gap-1">
                        <span className="text-[10px] font-mono text-green-400 tracking-widest uppercase">En Pista</span>
                        <span className="text-2xl font-bold italic tracking-tighter text-white group-hover:text-green-400 transition-colors">
                          LIVE TIMING
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-6 w-6 text-zinc-500 group-hover:text-green-400 group-hover:translate-x-1 transition-all" />
                  </Link>
                </Button>
              </div>
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

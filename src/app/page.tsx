"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Timer, PlusCircle, ChevronRight, BarChart3, Wrench, Activity } from "lucide-react";
import { Header } from "@/components/layout/header";
import { motion } from "framer-motion";
import { BackgroundAnimation } from "@/components/ui/background-animation";
import { FeatureCard } from "@/components/dashboard/feature-card";

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
            <FeatureCard
              href="/mis-tiempos"
              gradient="bg-gradient-to-r from-primary to-primary/50"
              borderHoverColor="hover:border-primary/50"
              height="h-32"
              glowOpacity="opacity-25 group-hover:opacity-75"
            >
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
            </FeatureCard>

            {/* Grid for new features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Analytics */}
              <FeatureCard
                href="/analytics"
                gradient="bg-gradient-to-r from-blue-500 to-cyan-500"
                borderHoverColor="hover:border-blue-500/50"
                height="h-28"
              >
                <div className="flex flex-col items-start gap-2">
                  <span className="text-[10px] font-mono text-blue-400 tracking-widest uppercase">Estadísticas</span>
                  <span className="text-2xl font-bold italic tracking-tighter text-white group-hover:text-blue-400 transition-colors">
                    ANALYTICS
                  </span>
                  <div className="flex items-center gap-2 text-zinc-400 text-sm">
                    <BarChart3 className="h-4 w-4" />
                    <span>Ver estadísticas</span>
                  </div>
                </div>
                <ChevronRight className="h-6 w-6 text-zinc-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              </FeatureCard>

              {/* Setups */}
              <FeatureCard
                href="/setups"
                gradient="bg-gradient-to-r from-orange-500 to-amber-500"
                borderHoverColor="hover:border-orange-500/50"
                height="h-28"
              >
                <div className="flex flex-col items-start gap-2">
                  <span className="text-[10px] font-mono text-orange-400 tracking-widest uppercase">Taller</span>
                  <span className="text-2xl font-bold italic tracking-tighter text-white group-hover:text-orange-400 transition-colors">
                    SETUPS
                  </span>
                  <div className="flex items-center gap-2 text-zinc-400 text-sm">
                    <Wrench className="h-4 w-4" />
                    <span>Gestionar setups</span>
                  </div>
                </div>
                <ChevronRight className="h-6 w-6 text-zinc-500 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
              </FeatureCard>

              {/* Live Timing (Full Width) */}
              <FeatureCard
                href="/live-timing"
                gradient="bg-gradient-to-r from-green-500 to-emerald-500"
                borderHoverColor="hover:border-green-500/50"
                height="h-28"
                className="md:col-span-2"
              >
                <div className="flex flex-col items-start gap-2">
                  <span className="text-[10px] font-mono text-green-400 tracking-widest uppercase">En Pista</span>
                  <span className="text-2xl font-bold italic tracking-tighter text-white group-hover:text-green-400 transition-colors">
                    LIVE TIMING
                  </span>
                  <div className="flex items-center gap-2 text-zinc-400 text-sm">
                    <Activity className="h-4 w-4" />
                    <span>Telemetría en tiempo real</span>
                  </div>
                </div>
                <ChevronRight className="h-8 w-8 text-zinc-500 group-hover:text-green-400 group-hover:translate-x-1 transition-all" />
              </FeatureCard>
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

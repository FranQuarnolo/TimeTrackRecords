"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimeList } from "@/components/times/time-list";
import { Header } from "@/components/layout/header";
import { BackgroundAnimation } from "@/components/ui/background-animation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function MisTiemposPage() {
    return (
        <div className="flex min-h-screen flex-col relative overflow-hidden bg-black text-white selection:bg-primary/30">
            <BackgroundAnimation />

            <div className="relative z-10 flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 container p-4 mx-auto max-w-md pb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center gap-4">
                            <h1 className="text-3xl font-bold italic tracking-tighter uppercase">Mis Tiempos</h1>
                        </div>

                        <Tabs defaultValue="qualifying" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/10 p-1 rounded-xl border border-white/10">
                                <TabsTrigger
                                    value="qualifying"
                                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-white/60 rounded-lg transition-all"
                                >
                                    Clasificación
                                </TabsTrigger>
                                <TabsTrigger
                                    value="race"
                                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-white/60 rounded-lg transition-all"
                                >
                                    Carrera
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="qualifying" className="mt-0">
                                <TimeList type="qualifying" />
                            </TabsContent>
                            <TabsContent value="race" className="mt-0">
                                <TimeList type="race" />
                            </TabsContent>
                        </Tabs>
                    </motion.div>
                </main>
            </div>
        </div>
    );
}

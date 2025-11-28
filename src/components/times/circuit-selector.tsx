"use client"

import { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { Circuit } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface CircuitSelectorProps {
    onSelect: (circuit: Circuit) => void;
}

const CATEGORIES = ['All', 'Fav'];

export function CircuitSelector({ onSelect }: CircuitSelectorProps) {
    const { circuits, toggleFavorite } = useStore();
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const filteredCircuits = useMemo(() => {
        return circuits
            .filter((c) => {
                const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                    c.country.toLowerCase().includes(search.toLowerCase());

                let matchesCategory = true;
                if (selectedCategory === 'Fav') {
                    matchesCategory = c.isFavorite;
                } else if (selectedCategory !== 'All') {
                    matchesCategory = c.category === selectedCategory;
                }

                return matchesSearch && matchesCategory;
            })
            .sort((a, b) => {
                // Favorites first
                if (a.isFavorite && !b.isFavorite) return -1;
                if (!a.isFavorite && b.isFavorite) return 1;
                return 0;
            });
    }, [circuits, search, selectedCategory]);

    return (
        <div className="flex flex-col h-full relative">
            {/* Filters */}
            <div className="p-4 z-10 sticky top-0 bg-transparent">
                <h2 className="text-xl font-bold text-center mb-4 text-white uppercase tracking-widest">Selecciona un Circuito</h2>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide justify-center">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={cn(
                                "px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all border",
                                selectedCategory === cat
                                    ? "bg-red-600 text-white border-red-600 shadow-[0_0_15px_-3px_rgba(220,38,38,0.5)]"
                                    : "bg-black/40 text-white/60 border-white/10 hover:bg-white/10 hover:text-white"
                            )}
                        >
                            {cat === 'Fav' ? <Star className="h-3 w-3 inline mr-2 fill-current mb-0.5" /> : null}
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pb-24 px-4 pt-4">
                <div className="flex flex-col gap-4">
                    <AnimatePresence mode="popLayout">
                        {filteredCircuits.map((circuit) => (
                            <motion.div
                                layout
                                key={circuit.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="relative h-48 w-full overflow-hidden rounded-xl border border-white/10 bg-black/40 shadow-lg hover:shadow-red-900/20 hover:border-red-500/30 transition-all group"
                            >
                                {/* Clickable Area */}
                                <div
                                    className="absolute inset-0 cursor-pointer z-0"
                                    onClick={() => onSelect(circuit)}
                                >
                                    <div className="absolute inset-0 transition-transform hover:scale-105 duration-700">
                                        <Image
                                            src={circuit.imageUrl}
                                            alt={circuit.name}
                                            fill
                                            className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                            unoptimized
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <div className="flex items-end justify-between">
                                            <div>
                                                <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter drop-shadow-md">{circuit.name}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs font-mono text-white/80 uppercase tracking-wider bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm border border-white/10">
                                                        {circuit.country}
                                                    </span>
                                                    <span className="px-2 py-0.5 rounded bg-red-600 text-[10px] font-bold text-white uppercase tracking-wider shadow-sm">
                                                        {circuit.category}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Favorite Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFavorite(circuit.id);
                                    }}
                                    className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 transition-colors border border-white/10"
                                >
                                    <Star
                                        className={cn(
                                            "h-5 w-5 transition-colors",
                                            circuit.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-white/50 hover:text-white"
                                        )}
                                    />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredCircuits.length === 0 && (
                        <div className="text-center py-12 text-white/50">
                            No se encontraron circuitos.
                        </div>
                    )}
                </div>
            </div>

            {/* FAB Search */}
            <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                <DialogTrigger asChild>
                    <Button
                        size="icon"
                        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 bg-red-600 hover:bg-red-700 text-white border-2 border-red-400/20 hover:scale-110 transition-transform"
                    >
                        <Search className="h-6 w-6" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="top-[20%] translate-y-0 sm:max-w-md p-6 gap-6 border border-white/10 bg-black/90 backdrop-blur-xl text-white">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-center uppercase tracking-widest">Buscar Circuito</DialogTitle>
                    </DialogHeader>
                    <div className="relative mt-2">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o país..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full h-14 pl-12 pr-4 rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-lg text-white placeholder:text-white/30 focus-visible:outline-none focus-visible:border-red-500 focus-visible:ring-1 focus-visible:ring-red-500 transition-all"
                            autoFocus
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

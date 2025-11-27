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
            <div className="p-4 bg-background z-10 sticky top-0 border-b">
                <h2 className="text-xl font-bold text-center mb-4">Selecciona un Circuito</h2>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={cn(
                                "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                                selectedCategory === cat
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                            )}
                        >
                            {cat === 'Fav' ? <Star className="h-3 w-3 inline mr-1 fill-current" /> : null}
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
                                className="relative h-48 w-full overflow-hidden rounded-xl border-2 border-border bg-card shadow-sm hover:shadow-md transition-shadow group"
                            >
                                {/* Clickable Area */}
                                <div
                                    className="absolute inset-0 cursor-pointer z-0"
                                    onClick={() => onSelect(circuit)}
                                >
                                    <div className="absolute inset-0 transition-transform hover:scale-105 duration-500">
                                        <Image
                                            src={circuit.imageUrl}
                                            alt={circuit.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-black/40 hover:bg-black/30 transition-colors" />
                                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                        <div className="flex items-end justify-between">
                                            <div>
                                                <h3 className="text-2xl font-bold text-white">{circuit.name}</h3>
                                                <p className="text-sm text-white/80 flex items-center gap-2">
                                                    <span className="opacity-70">{circuit.country}</span>
                                                    <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] backdrop-blur-sm">
                                                        {circuit.category}
                                                    </span>
                                                </p>
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
                                    className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/20 backdrop-blur-md hover:bg-black/40 transition-colors"
                                >
                                    <Star
                                        className={cn(
                                            "h-6 w-6 transition-colors",
                                            circuit.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-white"
                                        )}
                                    />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredCircuits.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
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
                        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
                    >
                        <Search className="h-6 w-6" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="top-[20%] translate-y-0 sm:max-w-md p-8 gap-6 border-2 border-primary/20">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-center">Buscar Circuito</DialogTitle>
                    </DialogHeader>
                    <div className="relative mt-4">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o país..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full h-14 pl-12 pr-4 rounded-xl border-2 border-input bg-background px-3 py-2 text-lg ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary focus-visible:ring-0 transition-colors"
                            autoFocus
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

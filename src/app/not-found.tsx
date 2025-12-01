import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Flag, Home } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-black text-white relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-black to-black" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

            <div className="relative z-10 flex flex-col items-center text-center p-8 max-w-2xl mx-auto">
                {/* 404 Display */}
                <div className="relative mb-8">
                    <h1 className="text-[150px] font-black leading-none tracking-tighter italic text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 select-none">
                        404
                    </h1>
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-full h-24 bg-red-500/20 blur-[100px]" />
                </div>

                {/* Message */}
                <div className="space-y-6 mb-12">
                    <div className="flex items-center justify-center gap-3 text-red-500 mb-4">
                        <Flag className="w-8 h-8 animate-pulse" />
                        <span className="text-xl font-bold uppercase tracking-widest">Bandera Roja</span>
                        <Flag className="w-8 h-8 animate-pulse" />
                    </div>

                    <h2 className="text-4xl font-bold uppercase tracking-tight">
                        Te has salido de la pista
                    </h2>

                    <p className="text-lg text-white/60 max-w-md mx-auto">
                        Parece que la página que buscas no existe o ha sido movida a otro circuito.
                    </p>
                </div>

                {/* Action */}
                <Button
                    asChild
                    size="lg"
                    className="bg-white text-black hover:bg-white/90 font-bold uppercase tracking-wider h-12 px-8 rounded-full shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] transition-all hover:scale-105"
                >
                    <Link href="/">
                        <Home className="mr-2 w-4 h-4" />
                        Volver a Boxes
                    </Link>
                </Button>
            </div>

            {/* Decorative lines */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
    );
}

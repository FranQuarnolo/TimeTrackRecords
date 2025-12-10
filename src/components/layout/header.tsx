"use client"

import { Flag, ChevronLeft, Timer } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";
import { User, LogOut, UserCog } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const isHome = pathname === "/";
    const { user, signOut } = useAuth();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/20 backdrop-blur-md shadow-sm">
            <div className="container flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    {!isHome && (
                        <Button variant="ghost" size="icon" onClick={() => router.back()} className="-ml-2 text-white hover:text-primary hover:bg-white/10">
                            <ChevronLeft className="h-6 w-6" />
                        </Button>
                    )}
                    <div className="flex items-center gap-2 font-bold text-lg">
                        <div className="bg-primary p-1.5 rounded-lg shadow-[0_0_10px_var(--primary)]">
                            <Timer className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-white uppercase tracking-widest text-sm sm:text-base font-black italic">TimeTracks</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0 overflow-hidden border border-primary/30 hover:border-primary transition-colors">
                                        {user.user_metadata?.avatar_url ? (
                                            <Image
                                                src={user.user_metadata.avatar_url}
                                                alt="Avatar"
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="h-full w-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                                                {(user.user_metadata?.username || user.email || 'U').charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-72 bg-black/60 backdrop-blur-xl border-none text-white shadow-[0_0_50px_-10px_var(--primary)] animate-in fade-in zoom-in-95 duration-300 p-2"
                                    align="end"
                                    forceMount
                                >
                                    <DropdownMenuLabel className="font-normal p-3">
                                        <div className="flex flex-col space-y-2">
                                            <p className="text-lg font-bold leading-none tracking-wide">{user.user_metadata?.username || 'Usuario'}</p>
                                            <p className="text-sm leading-none text-white/50 font-mono">
                                                {user.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-white/10" />
                                    <DropdownMenuItem
                                        onClick={() => router.push('/configuracion')}
                                        className="p-3 text-base font-medium focus:bg-white/10 focus:text-white cursor-pointer"
                                    >
                                        <UserCog className="mr-3 h-5 w-5" />
                                        <span>Editar Perfil</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={async () => {
                                        await signOut();
                                        router.push('/login');
                                    }} className="p-3 text-base font-medium text-red-400 focus:text-red-400 focus:bg-red-500/10 cursor-pointer">
                                        <LogOut className="mr-3 h-5 w-5" />
                                        <span>Cerrar Sesión</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm border border-primary/30">
                                <User className="h-4 w-4" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

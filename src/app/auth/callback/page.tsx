'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-provider';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
    const router = useRouter();
    const { session } = useAuth();

    useEffect(() => {
        if (session) {
            router.push('/');
        }
    }, [session, router]);

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-black text-white">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-white/60 text-sm uppercase tracking-widest">Autenticando...</p>
            </div>
        </div>
    );
}

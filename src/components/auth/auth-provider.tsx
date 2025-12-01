'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    loading: true,
    signOut: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const { setTheme } = useTheme();

    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const setData = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) throw error;
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);

            if (session?.user) {
                const { useStore } = await import('@/lib/store');
                await useStore.getState().loadUserData();
                const themeMode = useStore.getState().themeMode;
                if (themeMode && themeMode !== 'system') {
                    setTheme(themeMode);
                }
            }
        };

        const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
            if (session?.user) {
                const { useStore } = await import('@/lib/store');
                useStore.getState().loadUserData();
            } else if (!loading && pathname !== '/login' && pathname !== '/auth/callback') {
                router.push('/login');
            }
        });

        setData();

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (!loading && !session && pathname !== '/login' && pathname !== '/auth/callback') {
            router.push('/login');
        }
    }, [loading, session, pathname, router]);

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ session, user, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

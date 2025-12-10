import { StateCreator } from 'zustand';
import { TeamTheme } from '@/types';
import { supabase } from '../supabase';

export interface ThemeSlice {
    teamTheme: TeamTheme;
    themeMode: 'light' | 'dark' | 'system';
    setTeamTheme: (theme: TeamTheme) => Promise<void>;
    setThemeMode: (mode: 'light' | 'dark' | 'system') => Promise<void>;
}

export const createThemeSlice: StateCreator<ThemeSlice> = (set, get) => ({
    teamTheme: 'default',
    themeMode: 'system',
    setTeamTheme: async (theme) => {
        set({ teamTheme: theme });
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            await supabase.from('profiles').update({ team_theme: theme }).eq('id', user.id);
        }
    },
    setThemeMode: async (mode) => {
        set({ themeMode: mode });
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            await supabase.from('profiles').update({ theme_mode: mode }).eq('id', user.id);
        }
    },
});

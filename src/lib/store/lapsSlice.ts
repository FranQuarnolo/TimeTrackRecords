import { StateCreator } from 'zustand';
import { LapTime } from '@/types';
import { supabase } from '../supabase';

export interface LapsSlice {
    laps: LapTime[];
    addLap: (lap: LapTime) => Promise<void>;
    removeLap: (lapId: string) => Promise<void>;
    getBestTime: (circuitId: string, type: 'qualifying' | 'race') => number | null;
    setLaps: (laps: LapTime[]) => void;
}

export const createLapsSlice: StateCreator<LapsSlice> = (set, get) => ({
    laps: [],
    addLap: async (lap) => {
        // Optimistic update
        set((state) => {
            const existingLaps = state.laps.filter(
                l => l.circuitId === lap.circuitId && l.type === lap.type
            );
            const allLaps = [...existingLaps, lap];
            const sortedLaps = allLaps.sort((a, b) => a.time - b.time);
            const otherLaps = state.laps.filter(
                l => !(l.circuitId === lap.circuitId && l.type === lap.type)
            );
            return { laps: [...otherLaps, ...sortedLaps] };
        });

        // Supabase insert
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            await supabase.from('laps').insert({
                user_id: user.id,
                circuit_id: lap.circuitId,
                car_id: lap.carModel || 'unknown',
                time: lap.time,
                type: lap.type,
                created_at: lap.date
            });
        }
    },
    removeLap: async (lapId) => {
        // Optimistic update
        set((state) => ({
            laps: state.laps.filter(l => l.id !== lapId)
        }));

        // Supabase delete
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            await supabase.from('laps').delete().eq('id', lapId).eq('user_id', user.id);
        }
    },
    getBestTime: (circuitId, type) => {
        const { laps } = get();
        const circuitLaps = laps.filter(
            (l) => l.circuitId === circuitId && l.type === type
        );
        if (circuitLaps.length === 0) return null;
        return Math.min(...circuitLaps.map((l) => l.time));
    },
    setLaps: (laps) => set({ laps }),
});

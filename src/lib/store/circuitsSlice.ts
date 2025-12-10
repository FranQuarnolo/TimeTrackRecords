import { StateCreator } from 'zustand';
import { Circuit } from '@/types';
import { supabase } from '../supabase';
import { INITIAL_CIRCUITS } from '../constants';

export interface CircuitsSlice {
    circuits: Circuit[];
    toggleFavorite: (circuitId: string) => Promise<void>;
    syncCircuits: () => void;
    setCircuits: (circuits: Circuit[]) => void;
}

export const createCircuitsSlice: StateCreator<CircuitsSlice> = (set, get) => ({
    circuits: INITIAL_CIRCUITS,
    toggleFavorite: async (circuitId) => {
        set((state) => {
            const newCircuits = state.circuits.map((c) =>
                c.id === circuitId ? { ...c, isFavorite: !c.isFavorite } : c
            );
            return { circuits: newCircuits };
        });

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const circuit = get().circuits.find(c => c.id === circuitId);
            if (circuit) {
                await supabase.from('user_circuit_settings').upsert({
                    user_id: user.id,
                    circuit_id: circuitId,
                    is_favorite: circuit.isFavorite
                });
            }
        }
    },
    syncCircuits: () => set((state) => {
        const currentFavorites = new Set(
            state.circuits.filter(c => c.isFavorite).map(c => c.id)
        );

        const mergedCircuits = INITIAL_CIRCUITS.map(initialCircuit => ({
            ...initialCircuit,
            isFavorite: currentFavorites.has(initialCircuit.id)
        }));

        return { circuits: mergedCircuits };
    }),
    setCircuits: (circuits) => set({ circuits }),
});

import { StateCreator } from 'zustand';
import { Setup } from '@/types';
import { supabase } from '../supabase';

export interface SetupsSlice {
    setups: Setup[];
    addSetup: (setup: Omit<Setup, 'id' | 'created_at'>) => Promise<void>;
    updateSetup: (setup: Setup) => Promise<void>;
    deleteSetup: (id: string) => Promise<void>;
    setSetups: (setups: Setup[]) => void;
}

export const createSetupsSlice: StateCreator<SetupsSlice> = (set, get) => ({
    setups: [],
    addSetup: async (setupData) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuario no autenticado');

        const { data, error } = await supabase.from('setups').insert({
            user_id: user.id,
            car_id: setupData.carId,
            name: setupData.name,
            session_type: setupData.sessionType,
            tires: setupData.tires,
            pressure: setupData.pressure,
            fuel: setupData.fuel,
            notes: setupData.notes
        }).select().single();

        if (error) {
            console.error('Error saving setup:', error);
            throw error;
        }

        if (data) {
            // Map the response back to Setup type
            const newSetup: Setup = {
                id: data.id,
                carId: data.car_id,
                name: data.name,
                sessionType: data.session_type || 'Qualy',
                tires: data.tires,
                pressure: data.pressure, // Assuming DB returns object/json
                fuel: data.fuel,
                notes: data.notes,
                created_at: data.created_at
            };
            set(state => ({ setups: [...state.setups, newSetup] }));
        }
    },
    updateSetup: async (setup) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase.from('setups').update({
            name: setup.name,
            session_type: setup.sessionType,
            tires: setup.tires,
            pressure: setup.pressure,
            fuel: setup.fuel,
            notes: setup.notes
        }).eq('id', setup.id).select().single();

        if (data) {
            const updatedSetup: Setup = {
                id: data.id,
                carId: data.car_id,
                name: data.name,
                sessionType: data.session_type || 'Qualy',
                tires: data.tires,
                pressure: data.pressure,
                fuel: data.fuel,
                notes: data.notes,
                created_at: data.created_at
            };
            set(state => ({
                setups: state.setups.map(s => s.id === setup.id ? updatedSetup : s)
            }));
        }
    },
    deleteSetup: async (id) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        await supabase.from('setups').delete().eq('id', id);

        set(state => ({
            setups: state.setups.filter(s => s.id !== id)
        }));
    },
    setSetups: (setups) => set({ setups }),
});

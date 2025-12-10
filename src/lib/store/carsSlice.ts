import { StateCreator } from 'zustand';
import { Car } from '@/types';
import { supabase } from '../supabase';
import { INITIAL_CARS } from '../constants';

export interface CarsSlice {
    cars: Car[];
    addCar: (name: string) => Promise<void>;
    setCars: (cars: Car[]) => void;
}

export const createCarsSlice: StateCreator<CarsSlice> = (set, get) => ({
    cars: INITIAL_CARS,
    addCar: async (name) => {
        const newCar: Car = {
            id: name.toLowerCase().replace(/\s+/g, '_'), // Temporary ID for local
            name: name,
            category: 'Other',
            brand: 'Custom'
        };

        set((state) => ({ cars: [...state.cars, newCar] }));

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data } = await supabase.from('user_cars').insert({
                user_id: user.id,
                name: newCar.name,
                brand: newCar.brand,
                category: newCar.category
            }).select().single();

            // Update the ID with the real UUID from DB
            if (data) {
                set(state => ({
                    cars: state.cars.map(c => c.id === newCar.id ? { ...c, id: data.id } : c)
                }));
            }
        }
    },
    setCars: (cars) => set({ cars }),
});

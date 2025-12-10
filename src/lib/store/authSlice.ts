import { StateCreator } from 'zustand';
import { supabase } from '../supabase';
import { LapsSlice } from './lapsSlice';
import { CircuitsSlice } from './circuitsSlice';
import { CarsSlice } from './carsSlice';
import { SetupsSlice } from './setupsSlice';
import { ThemeSlice } from './themeSlice';
import { LapTime, Car, Setup, TeamTheme } from '@/types';
import { INITIAL_CARS } from '../constants';

// Combined type for accessing other slices
type StoreState = LapsSlice & CircuitsSlice & CarsSlice & SetupsSlice & ThemeSlice & AuthSlice;

export interface AuthSlice {
    loadUserData: () => Promise<void>;
}

export const createAuthSlice: StateCreator<StoreState, [], [], AuthSlice> = (set, get) => ({
    loadUserData: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Load Profile (Theme)
        const { data: profile } = await supabase
            .from('profiles')
            .select('team_theme, theme_mode')
            .eq('id', user.id)
            .single();

        if (profile) {
            set({ teamTheme: profile.team_theme as TeamTheme });
            if (profile.theme_mode) {
                set({ themeMode: profile.theme_mode as 'light' | 'dark' | 'system' });
            }
        }

        // Load Laps
        const { data: laps } = await supabase
            .from('laps')
            .select('*');

        if (laps) {
            const formattedLaps: LapTime[] = laps.map(l => ({
                id: l.id,
                circuitId: l.circuit_id,
                time: Number(l.time),
                date: l.created_at,
                type: l.type as 'qualifying' | 'race',
                carModel: l.car_id
            }));
            set({ laps: formattedLaps });
        }

        // Load User Cars
        const { data: userCars } = await supabase
            .from('user_cars')
            .select('*');

        if (userCars) {
            const formattedCars: Car[] = userCars.map(c => ({
                id: c.id, // Use UUID from DB
                name: c.name,
                category: c.category,
                brand: c.brand
            }));
            set(state => ({ cars: [...INITIAL_CARS, ...formattedCars] }));
        }

        // Load Setups
        const { data: setups } = await supabase
            .from('setups')
            .select('*');

        if (setups) {
            const formattedSetups: Setup[] = setups.map(s => {
                let parsedPressure = s.pressure;
                if (typeof s.pressure === 'string') {
                    try {
                        parsedPressure = JSON.parse(s.pressure);
                    } catch {
                        // If it's a simple string (old format), map it to all wheels or keep as is if structure allows
                        parsedPressure = { fl: s.pressure, fr: s.pressure, rl: s.pressure, rr: s.pressure };
                    }
                }

                return {
                    id: s.id,
                    carId: s.car_id || s.carId, // Handle snake_case from DB
                    name: s.name,
                    sessionType: s.session_type || 'Qualy', // Default to Qualy if missing
                    tires: s.tires,
                    pressure: parsedPressure || { fl: '', fr: '', rl: '', rr: '' },
                    fuel: s.fuel,
                    notes: s.notes,
                    created_at: s.created_at
                };
            });
            set({ setups: formattedSetups });
        }

        // Load Favorites
        const { data: favorites } = await supabase
            .from('user_circuit_settings')
            .select('circuit_id, is_favorite')
            .eq('is_favorite', true);

        if (favorites) {
            const favIds = new Set(favorites.map(f => f.circuit_id));
            set(state => ({
                circuits: state.circuits.map(c => ({
                    ...c,
                    isFavorite: favIds.has(c.id)
                }))
            }));
        }
    },
});

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createLapsSlice, LapsSlice } from './store/lapsSlice';
import { createCircuitsSlice, CircuitsSlice } from './store/circuitsSlice';
import { createCarsSlice, CarsSlice } from './store/carsSlice';
import { createSetupsSlice, SetupsSlice } from './store/setupsSlice';
import { createThemeSlice, ThemeSlice } from './store/themeSlice';
import { createAuthSlice, AuthSlice } from './store/authSlice';

export type AppState = LapsSlice & CircuitsSlice & CarsSlice & SetupsSlice & ThemeSlice & AuthSlice;

export const useStore = create<AppState>()(
    persist(
        (...a) => ({
            ...createLapsSlice(...a),
            ...createCircuitsSlice(...a),
            ...createCarsSlice(...a),
            ...createSetupsSlice(...a),
            ...createThemeSlice(...a),
            ...createAuthSlice(...a),
        }),
        {
            name: 'timetracks-storage',
            partialize: (state) => ({
                // Persist only what's needed locally or what we want to keep offline first
                // Though most is synced with Supabase, keeping local cache is good
                laps: state.laps,
                circuits: state.circuits,
                cars: state.cars,
                setups: state.setups,
                teamTheme: state.teamTheme,
                themeMode: state.themeMode,
            }),
        }
    )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LapTime, Circuit, TeamTheme, Car } from '@/types';

interface AppState {
    laps: LapTime[];
    circuits: Circuit[];
    cars: Car[];
    teamTheme: TeamTheme;
    addLap: (lap: LapTime) => void;
    getBestTime: (circuitId: string, type: 'qualifying' | 'race') => number | null;
    toggleFavorite: (circuitId: string) => void;
    setTeamTheme: (theme: TeamTheme) => void;
}

// Initial circuits data
const INITIAL_CIRCUITS: Circuit[] = [
    { id: 'monza', name: 'Monza', imageUrl: '/tracks/monza.png', country: 'Italy', category: 'F1', isFavorite: false },
    { id: 'spa', name: 'Spa-Francorchamps', imageUrl: '/tracks/spa.png', country: 'Belgium', category: 'F1', isFavorite: false },
    { id: 'silverstone', name: 'Silverstone', imageUrl: '/tracks/silverstone.png', country: 'UK', category: 'F1', isFavorite: false },
    { id: 'interlagos', name: 'Interlagos', imageUrl: '/tracks/interlagos.png', country: 'Brazil', category: 'F1', isFavorite: false },
    { id: 'suzuka', name: 'Suzuka', imageUrl: '/tracks/suzuka.png', country: 'Japan', category: 'F1', isFavorite: false },
    { id: 'nurburgring', name: 'Nürburgring', imageUrl: '/tracks/nurburgring.png', country: 'Germany', category: 'Other', isFavorite: false },
    { id: 'monaco', name: 'Monaco', imageUrl: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Monaco', country: 'Monaco', category: 'F1', isFavorite: false },
    { id: 'lemans', name: 'Le Mans', imageUrl: '/tracks/lemans.png', country: 'France', category: 'WEC', isFavorite: false },
    { id: 'daytona', name: 'Daytona', imageUrl: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Daytona', country: 'USA', category: 'Other', isFavorite: false },
    { id: 'sebring', name: 'Sebring', imageUrl: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Sebring', country: 'USA', category: 'WEC', isFavorite: false },
    { id: 'fuji', name: 'Fuji', imageUrl: '/tracks/fuji.png', country: 'Japan', category: 'WEC', isFavorite: false },
    { id: 'bahrain', name: 'Bahrain', imageUrl: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Bahrain', country: 'Bahrain', category: 'WEC', isFavorite: false },
    { id: 'cota', name: 'COTA', imageUrl: '/tracks/cota.png', country: 'USA', category: 'F1', isFavorite: false },
    { id: 'imola', name: 'Imola', imageUrl: '/tracks/imola.png', country: 'Italy', category: 'F1', isFavorite: false },
    { id: 'termas', name: 'Termas de Río Hondo', imageUrl: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Termas', country: 'Argentina', category: 'Other', isFavorite: false },
    { id: 'mendoza', name: 'San Martín (Mendoza)', imageUrl: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Mendoza', country: 'Argentina', category: 'Other', isFavorite: false },
    { id: 'portimao', name: 'Portimão', imageUrl: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Portimao', country: 'Portugal', category: 'WEC', isFavorite: false },
    { id: 'zandvoort', name: 'Zandvoort', imageUrl: '/tracks/zandvordt.png', country: 'Netherlands', category: 'F1', isFavorite: false },
    { id: 'catalunya', name: 'Catalunya', imageUrl: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Catalunya', country: 'Spain', category: 'F1', isFavorite: false },
    { id: 'mexico', name: 'Hermanos Rodríguez', imageUrl: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Mexico', country: 'Mexico', category: 'F1', isFavorite: false },
    { id: 'vegas', name: 'Las Vegas', imageUrl: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Vegas', country: 'USA', category: 'F1', isFavorite: false },
    { id: 'road_america', name: 'Road America', imageUrl: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Road+America', country: 'USA', category: 'Other', isFavorite: false },
    { id: 'qatar', name: 'Qatar', imageUrl: '/tracks/qatar.png', country: 'Qatar', category: 'F1', isFavorite: false },
];

const INITIAL_CARS: Car[] = [
    // Hypercar
    { id: 'ferrari_499p', name: 'Ferrari 499P', category: 'WEC', brand: 'Ferrari' },
    { id: 'toyota_gr010', name: 'Toyota GR010', category: 'WEC', brand: 'Toyota' },
    { id: 'porsche_963', name: 'Porsche 963', category: 'WEC', brand: 'Porsche' },
    { id: 'cadillac_vseries', name: 'Cadillac V-Series.R', category: 'WEC', brand: 'Cadillac' },
    { id: 'peugeot_9x8', name: 'Peugeot 9X8', category: 'WEC', brand: 'Peugeot' },
    { id: 'bmw_m_hybrid', name: 'BMW M Hybrid V8', category: 'WEC', brand: 'BMW' },
    { id: 'lamborghini_sc63', name: 'Lamborghini SC63', category: 'WEC', brand: 'Lamborghini' },
    { id: 'isotta_tipo6', name: 'Isotta Fraschini Tipo 6', category: 'WEC', brand: 'Isotta Fraschini' },
    // LMGT3
    { id: 'aston_martin_vantage', name: 'Aston Martin Vantage GT3', category: 'GT3', brand: 'Aston Martin' },
    { id: 'bmw_m4_gt3', name: 'BMW M4 GT3', category: 'GT3', brand: 'BMW' },
    { id: 'ferrari_296_gt3', name: 'Ferrari 296 GT3', category: 'GT3', brand: 'Ferrari' },
    { id: 'mclaren_720s_evo', name: 'McLaren 720S GT3 Evo', category: 'GT3', brand: 'McLaren' },
    { id: 'lamborghini_huracan_evo2', name: 'Lamborghini Huracan GT3 EVO2', category: 'GT3', brand: 'Lamborghini' },
    { id: 'ford_mustang_gt3', name: 'Ford Mustang GT3', category: 'GT3', brand: 'Ford' },
    { id: 'lexus_rc_f_gt3', name: 'Lexus RC F GT3', category: 'GT3', brand: 'Lexus' },
    { id: 'corvette_z06_gt3r', name: 'Corvette Z06 GT3.R', category: 'GT3', brand: 'Corvette' },
    // TC Argentina 2025
    { id: 'chevrolet_camaro_zl1', name: 'Chevrolet Camaro ZL1', category: 'TC', brand: 'Chevrolet' },
    { id: 'ford_mustang_mach_1', name: 'Ford Mustang Mach I', category: 'TC', brand: 'Ford' },
    { id: 'toyota_camry_tc', name: 'Toyota Camry TC', category: 'TC', brand: 'Toyota' },
    { id: 'dodge_challenger_srt', name: 'Dodge Challenger SRT', category: 'TC', brand: 'Dodge' },
    { id: 'torino_cherokee', name: 'Torino Cherokee', category: 'TC', brand: 'Torino' },
    // Other
    { id: 'f1_generic', name: 'Formula 1 Car', category: 'F1', brand: 'F1' },
];

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            laps: [],
            circuits: INITIAL_CIRCUITS,
            cars: INITIAL_CARS,
            teamTheme: 'default',
            addLap: (lap) => set((state) => {
                // Get all laps for this circuit and type
                const existingLaps = state.laps.filter(
                    l => l.circuitId === lap.circuitId && l.type === lap.type
                );

                // Combine with new lap
                const allLaps = [...existingLaps, lap];

                // Sort by time (asc)
                const sortedLaps = allLaps.sort((a, b) => a.time - b.time);

                // Get laps that are NOT for this circuit/type (to preserve them)
                const otherLaps = state.laps.filter(
                    l => !(l.circuitId === lap.circuitId && l.type === lap.type)
                );

                return { laps: [...otherLaps, ...sortedLaps] };
            }),
            getBestTime: (circuitId, type) => {
                const { laps } = get();
                const circuitLaps = laps.filter(
                    (l) => l.circuitId === circuitId && l.type === type
                );
                if (circuitLaps.length === 0) return null;
                return Math.min(...circuitLaps.map((l) => l.time));
            },
            toggleFavorite: (circuitId) => set((state) => ({
                circuits: state.circuits.map((c) =>
                    c.id === circuitId ? { ...c, isFavorite: !c.isFavorite } : c
                )
            })),
            setTeamTheme: (theme) => set({ teamTheme: theme }),
        }),
        {
            name: 'timetracks-storage',
        }
    )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LapTime, Circuit, TeamTheme, Car, Setup } from '@/types';
import { supabase } from './supabase';

interface AppState {
    laps: LapTime[];
    circuits: Circuit[];
    cars: Car[];
    setups: Setup[];
    teamTheme: TeamTheme;
    themeMode: 'light' | 'dark' | 'system';
    addLap: (lap: LapTime) => Promise<void>;
    removeLap: (lapId: string) => Promise<void>;
    getBestTime: (circuitId: string, type: 'qualifying' | 'race') => number | null;
    toggleFavorite: (circuitId: string) => Promise<void>;
    setTeamTheme: (theme: TeamTheme) => Promise<void>;
    setThemeMode: (mode: 'light' | 'dark' | 'system') => Promise<void>;
    syncCircuits: () => void;
    addCar: (name: string) => Promise<void>;
    loadUserData: () => Promise<void>;
    addSetup: (setup: Omit<Setup, 'id' | 'created_at'>) => Promise<void>;
    updateSetup: (setup: Setup) => Promise<void>;
}

// Initial circuits data
const INITIAL_CIRCUITS: Circuit[] = [
    { id: 'monza', name: 'Monza', imageUrl: '/tracks/monza.png', country: 'Italy', category: 'F1', isFavorite: false },
    { id: 'spa', name: 'Spa-Francorchamps', imageUrl: '/tracks/spa.png', country: 'Belgium', category: 'F1', isFavorite: false },
    { id: 'silverstone', name: 'Silverstone', imageUrl: '/tracks/silverstone.png', country: 'UK', category: 'F1', isFavorite: false },
    { id: 'interlagos', name: 'Interlagos', imageUrl: '/tracks/interlagos.png', country: 'Brazil', category: 'F1', isFavorite: false },
    { id: 'suzuka', name: 'Suzuka', imageUrl: '/tracks/suzuka.png', country: 'Japan', category: 'F1', isFavorite: false },
    { id: 'nurburgring', name: 'Nürburgring', imageUrl: '/tracks/nurburgring.png', country: 'Germany', category: 'Other', isFavorite: false },
    { id: 'monaco', name: 'Monaco', imageUrl: '/tracks/monaco.png', country: 'Monaco', category: 'F1', isFavorite: false },
    { id: 'lemans', name: 'Le Mans', imageUrl: '/tracks/lemans.png', country: 'France', category: 'WEC', isFavorite: false },
    { id: 'daytona', name: 'Daytona', imageUrl: '/tracks/daytona.png', country: 'USA', category: 'Other', isFavorite: false },
    { id: 'sebring', name: 'Sebring', imageUrl: '/tracks/sebring.png', country: 'USA', category: 'WEC', isFavorite: false },
    { id: 'fuji', name: 'Fuji', imageUrl: '/tracks/fuji.png', country: 'Japan', category: 'WEC', isFavorite: false },
    { id: 'bahrain', name: 'Bahrain', imageUrl: '/tracks/bahrain.png', country: 'Bahrain', category: 'WEC', isFavorite: false },
    { id: 'cota', name: 'COTA', imageUrl: '/tracks/cota.png', country: 'USA', category: 'F1', isFavorite: false },
    { id: 'imola', name: 'Imola', imageUrl: '/tracks/imola.png', country: 'Italy', category: 'F1', isFavorite: false },
    { id: 'termas', name: 'Termas de Río Hondo', imageUrl: '/tracks/termas.png', country: 'Argentina', category: 'Other', isFavorite: false },
    { id: 'mendoza', name: 'San Martín (Mendoza)', imageUrl: '/tracks/mendoza.png', country: 'Argentina', category: 'Other', isFavorite: false },
    { id: 'portimao', name: 'Portimão', imageUrl: '/tracks/portimao.png', country: 'Portugal', category: 'WEC', isFavorite: false },
    { id: 'zandvoort', name: 'Zandvoort', imageUrl: '/tracks/zandvordt.png', country: 'Netherlands', category: 'F1', isFavorite: false },
    { id: 'catalunya', name: 'Catalunya', imageUrl: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Catalunya', country: 'Spain', category: 'F1', isFavorite: false },
    { id: 'mexico', name: 'Hermanos Rodríguez', imageUrl: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Mexico', country: 'Mexico', category: 'F1', isFavorite: false },
    { id: 'vegas', name: 'Las Vegas', imageUrl: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Vegas', country: 'USA', category: 'F1', isFavorite: false },
    { id: 'road_america', name: 'Road America', imageUrl: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Road+America', country: 'USA', category: 'Other', isFavorite: false },
    { id: 'qatar', name: 'Qatar', imageUrl: '/tracks/qatar.png', country: 'Qatar', category: 'F1', isFavorite: false },
    // New Circuits
    { id: 'kyalami', name: 'Kyalami', imageUrl: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Kyalami', country: 'South Africa', category: 'F1', isFavorite: false },
    { id: 'sepang', name: 'Sepang', imageUrl: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Sepang', country: 'Malaysia', category: 'F1', isFavorite: false },
    { id: 'estoril', name: 'Estoril', imageUrl: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Estoril', country: 'Portugal', category: 'F1', isFavorite: false },
    { id: 'adelaide', name: 'Adelaide', imageUrl: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Adelaide', country: 'Australia', category: 'F1', isFavorite: false },
    { id: 'magny_cours', name: 'Magny-Cours', imageUrl: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Magny-Cours', country: 'France', category: 'F1', isFavorite: false },
    { id: 'hockenheim', name: 'Hockenheimring', imageUrl: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Hockenheim', country: 'Germany', category: 'F1', isFavorite: false },
    { id: 'istanbul', name: 'Istanbul Park', imageUrl: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Istanbul', country: 'Turkey', category: 'F1', isFavorite: false },
    { id: 'baku', name: 'Baku City Circuit', imageUrl: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Baku', country: 'Azerbaijan', category: 'F1', isFavorite: false },
    { id: 'singapore', name: 'Marina Bay', imageUrl: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Singapore', country: 'Singapore', category: 'F1', isFavorite: false },
    { id: 'yas_marina', name: 'Yas Marina', imageUrl: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Yas+Marina', country: 'UAE', category: 'F1', isFavorite: false },
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
    { id: 'alpine_a424', name: 'Alpine A424', category: 'WEC', brand: 'Alpine' },
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
    { id: 'porsche_911_gt3_r', name: 'Porsche 911 GT3 R (992)', category: 'GT3', brand: 'Porsche' },
    { id: 'mercedes_amg_gt3', name: 'Mercedes-AMG GT3 Evo', category: 'GT3', brand: 'Mercedes' },
    { id: 'audi_r8_lms', name: 'Audi R8 LMS GT3 evo II', category: 'GT3', brand: 'Audi' },
    // F1 2024
    { id: 'rb20', name: 'Red Bull RB20', category: 'F1', brand: 'Red Bull' },
    { id: 'sf24', name: 'Ferrari SF-24', category: 'F1', brand: 'Ferrari' },
    { id: 'w15', name: 'Mercedes W15', category: 'F1', brand: 'Mercedes' },
    { id: 'mcl38', name: 'McLaren MCL38', category: 'F1', brand: 'McLaren' },
    { id: 'amr24', name: 'Aston Martin AMR24', category: 'F1', brand: 'Aston Martin' },
    { id: 'a524', name: 'Alpine A524', category: 'F1', brand: 'Alpine' },
    { id: 'fw46', name: 'Williams FW46', category: 'F1', brand: 'Williams' },
    { id: 'vcarb01', name: 'VCARB 01', category: 'F1', brand: 'RB' },
    { id: 'c44', name: 'Kick Sauber C44', category: 'F1', brand: 'Kick Sauber' },
    { id: 'vf24', name: 'Haas VF-24', category: 'F1', brand: 'Haas' },
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
            setups: [],
            teamTheme: 'default',
            themeMode: 'system',

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

            addSetup: async (setupData) => {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data } = await supabase.from('setups').insert({
                    user_id: user.id,
                    car_id: setupData.carId,
                    name: setupData.name,
                    session_type: setupData.sessionType,
                    tires: setupData.tires,
                    pressure: setupData.pressure,
                    fuel: setupData.fuel,
                    notes: setupData.notes
                }).select().single();

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
        }),
        {
            name: 'timetracks-storage',
        }
    )
);

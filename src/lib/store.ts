import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LapTime, Circuit } from '@/types';

interface AppState {
    laps: LapTime[];
    circuits: Circuit[];
    addLap: (lap: LapTime) => void;
    getBestTime: (circuitId: string, type: 'qualifying' | 'race') => number | null;
}

// Initial circuits data
const INITIAL_CIRCUITS: Circuit[] = [
    { id: 'monza', name: 'Monza', imageUrl: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Monza' },
    { id: 'spa', name: 'Spa-Francorchamps', imageUrl: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Spa' },
    { id: 'silverstone', name: 'Silverstone', imageUrl: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Silverstone' },
    { id: 'interlagos', name: 'Interlagos', imageUrl: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Interlagos' },
    { id: 'suzuka', name: 'Suzuka', imageUrl: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Suzuka' },
    { id: 'nurburgring', name: 'Nürburgring', imageUrl: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Nurburgring' },
    { id: 'monaco', name: 'Monaco', imageUrl: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Monaco' },
];

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            laps: [],
            circuits: INITIAL_CIRCUITS,
            addLap: (lap) => set((state) => ({ laps: [...state.laps, lap] })),
            getBestTime: (circuitId, type) => {
                const { laps } = get();
                const circuitLaps = laps.filter(
                    (l) => l.circuitId === circuitId && l.type === type
                );
                if (circuitLaps.length === 0) return null;
                return Math.min(...circuitLaps.map((l) => l.time));
            },
        }),
        {
            name: 'timetracks-storage',
        }
    )
);

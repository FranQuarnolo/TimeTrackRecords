export type SessionType = 'qualifying' | 'race';
export type TeamTheme = 'default' | 'ferrari' | 'mercedes' | 'redbull' | 'mclaren' | 'astonmartin' | 'alpine' | 'williams' | 'haas' | 'sauber' | 'porsche' | 'bmw' | 'cadillac';

export interface LapTime {
  id: string;
  circuitId: string;
  time: number; // in milliseconds
  date: string; // ISO string
  type: SessionType;
  carModel?: string;
  setupId?: string;
}

export interface Circuit {
  id: string;
  name: string;
  imageUrl: string;
  country: string;
  category: 'F1' | 'WEC' | 'GT3' | 'Other';
  isFavorite: boolean;
}

export interface Car {
  id: string;
  name: string;
  category: string;
  brand?: string;
}

export interface Setup {
  id: string;
  carId: string;
  name: string;
  sessionType: 'Qualy' | 'Race';
  tires: string;
  pressure: {
    fl: string;
    fr: string;
    rl: string;
    rr: string;
  };
  fuel: string;
  notes: string;
  created_at: string;
}

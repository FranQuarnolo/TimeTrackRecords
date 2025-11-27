export type SessionType = 'qualifying' | 'race';

export interface LapTime {
  id: string;
  circuitId: string;
  time: number; // in milliseconds
  date: string; // ISO string
  type: SessionType;
}

export interface Circuit {
  id: string;
  name: string;
  imageUrl: string;
}

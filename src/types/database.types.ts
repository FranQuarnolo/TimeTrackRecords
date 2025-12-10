export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            laps: {
                Row: {
                    id: string
                    user_id: string
                    circuit_id: string
                    car_id: string
                    time: number
                    type: 'qualifying' | 'race'
                    setup_id: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    circuit_id: string
                    car_id: string
                    time: number
                    type: 'qualifying' | 'race'
                    setup_id?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    circuit_id?: string
                    car_id?: string
                    time?: number
                    type?: 'qualifying' | 'race'
                    setup_id?: string | null
                    created_at?: string
                }
            }
            user_circuit_settings: {
                Row: {
                    user_id: string
                    circuit_id: string
                    is_favorite: boolean
                }
                Insert: {
                    user_id: string
                    circuit_id: string
                    is_favorite: boolean
                }
                Update: {
                    user_id?: string
                    circuit_id?: string
                    is_favorite?: boolean
                }
            }
            user_cars: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    brand: string
                    category: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    name: string
                    brand: string
                    category: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    brand?: string
                    category?: string
                }
            }
            setups: {
                Row: {
                    id: string
                    user_id: string
                    car_id: string
                    name: string
                    session_type: 'Qualy' | 'Race'
                    tires: string
                    pressure: Json
                    fuel: string
                    notes: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    car_id: string
                    name: string
                    session_type: 'Qualy' | 'Race'
                    tires: string
                    pressure: Json
                    fuel: string
                    notes: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    car_id?: string
                    name?: string
                    session_type?: 'Qualy' | 'Race'
                    tires?: string
                    pressure?: Json
                    fuel?: string
                    notes?: string
                    created_at?: string
                }
            }
            profiles: {
                Row: {
                    id: string
                    team_theme: string | null
                    theme_mode: 'light' | 'dark' | 'system' | null
                    username: string | null
                }
                Insert: {
                    id: string
                    team_theme?: string | null
                    theme_mode?: 'light' | 'dark' | 'system' | null
                    username?: string | null
                }
                Update: {
                    id?: string
                    team_theme?: string | null
                    theme_mode?: 'light' | 'dark' | 'system' | null
                    username?: string | null
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}

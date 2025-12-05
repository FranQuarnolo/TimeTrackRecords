-- Create profiles table
create table public.profiles (
  id uuid references auth.users not null primary key,
  username text,
  team_theme text,
  theme_mode text default 'system',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create laps table
create table public.laps (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  circuit_id text not null,
  car_id text not null,
  time numeric not null,
  type text not null, -- 'qualifying' or 'race'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user_cars table
create table public.user_cars (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  name text not null,
  brand text not null,
  category text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user_circuit_settings table
create table public.user_circuit_settings (
  user_id uuid references public.profiles(id) not null,
  circuit_id text not null,
  is_favorite boolean default false,
  primary key (user_id, circuit_id)
);

-- Create setups table
create table if not exists public.setups (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  car_id text not null, -- Can be a UUID (for user cars) or a string ID (for default cars)
  name text not null,
  session_type text,
  tires text,
  pressure jsonb, -- Storing pressure as JSON { fl: "26.5", fr: "26.5", ... }
  fuel text,
  notes text,
  created_at timestamptz default now()
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.laps enable row level security;
alter table public.user_cars enable row level security;
alter table public.user_circuit_settings enable row level security;
alter table public.setups enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

create policy "Laps are viewable by everyone." on public.laps
  for select using (true);

create policy "Users can insert their own laps." on public.laps
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own laps." on public.laps
  for update using (auth.uid() = user_id);

create policy "Users can delete their own laps." on public.laps
  for delete using (auth.uid() = user_id);

create policy "User cars are viewable by everyone." on public.user_cars
  for select using (true);

create policy "Users can insert their own cars." on public.user_cars
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own cars." on public.user_cars
  for update using (auth.uid() = user_id);

create policy "Circuit settings are viewable by everyone." on public.user_circuit_settings
  for select using (true);

create policy "Users can insert their own circuit settings." on public.user_circuit_settings
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own circuit settings." on public.user_circuit_settings
  for update using (auth.uid() = user_id);

-- Setups policies
create policy "Users can view their own setups"
on public.setups for select
using (auth.uid() = user_id);

create policy "Users can insert their own setups"
on public.setups for insert
with check (auth.uid() = user_id);

create policy "Users can update their own setups"
on public.setups for update
using (auth.uid() = user_id);

create policy "Users can delete their own setups"
on public.setups for delete
using (auth.uid() = user_id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, team_theme, theme_mode)
  values (new.id, new.raw_user_meta_data->>'username', 'default', 'system');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

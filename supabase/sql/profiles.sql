-- profiles
create table profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  preferences jsonb not null default '{}'::jsonb,
  legacy_stats jsonb not null default '{}'::jsonb,
  preferences_updated_at timestamptz,
  legacy_updated_at timestamptz
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Row Level Security
alter table profiles enable row level security;

drop policy if exists "profiles owner"      on public.profiles
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;

create policy "profiles_select_own"
    on public.profiles
    for select
    using (auth.uid() = user_id);

create policy "profiles_insert_own"
    on public.profiles
    for insert
    with check (auth.uid() = user_id);

create policy "profiles_update_own"
    on public.profiles
    for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  url text not null,
  provider text not null,
  video_id text not null,
  title text not null,
  description text,
  thumbnail_url text,
  video_type text not null check (video_type in ('normal', 'short')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_user_id_idx on public.profiles (user_id);
create index if not exists videos_user_id_idx on public.videos (user_id);
create index if not exists videos_video_type_idx on public.videos (video_type);
create index if not exists videos_created_at_idx on public.videos (created_at desc);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists set_videos_updated_at on public.videos;
create trigger set_videos_updated_at
before update on public.videos
for each row
execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.videos enable row level security;

drop policy if exists "profiles are viewable by everyone" on public.profiles;
create policy "profiles are viewable by everyone"
on public.profiles
for select
using (true);

drop policy if exists "users can insert own profile" on public.profiles;
create policy "users can insert own profile"
on public.profiles
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "users can update own profile" on public.profiles;
create policy "users can update own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "videos are viewable by everyone" on public.videos;
create policy "videos are viewable by everyone"
on public.videos
for select
using (true);

drop policy if exists "authenticated users can insert own videos" on public.videos;
create policy "authenticated users can insert own videos"
on public.videos
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "users can update own videos" on public.videos;
create policy "users can update own videos"
on public.videos
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "users can delete own videos" on public.videos;
create policy "users can delete own videos"
on public.videos
for delete
to authenticated
using (auth.uid() = user_id);

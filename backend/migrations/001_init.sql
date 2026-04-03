create extension if not exists "pgcrypto";

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  hackathon_name text not null,
  ends_at timestamptz not null,
  invite_code text not null unique,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('dev', 'design', 'pitch')),
  created_at timestamptz not null default now(),
  unique(team_id, user_id)
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  title text not null,
  status text not null check (status in ('todo', 'doing', 'done')),
  assignee_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.decisions (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  content text not null,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.pitches (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  content text not null,
  readme text not null,
  generated_at timestamptz not null default now()
);

create or replace function public.is_team_member(target_team_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.members
    where team_id = target_team_id and user_id = auth.uid()
  );
$$;

alter table public.teams enable row level security;
alter table public.members enable row level security;
alter table public.tasks enable row level security;
alter table public.decisions enable row level security;
alter table public.pitches enable row level security;

create policy "team access" on public.teams
for all using (
  public.is_team_member(id) or created_by = auth.uid()
) with check (
  public.is_team_member(id) or created_by = auth.uid()
);

create policy "member access" on public.members
for all using (public.is_team_member(team_id))
with check (public.is_team_member(team_id) or user_id = auth.uid());

create policy "task access" on public.tasks
for all using (public.is_team_member(team_id))
with check (public.is_team_member(team_id));

create policy "decision access" on public.decisions
for all using (public.is_team_member(team_id))
with check (public.is_team_member(team_id) and created_by = auth.uid());

create policy "pitch access" on public.pitches
for all using (public.is_team_member(team_id))
with check (public.is_team_member(team_id));

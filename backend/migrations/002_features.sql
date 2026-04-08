-- Migration: New tables for enhanced features
-- Run after 001_init.sql

-- Hackathons info
create table if not exists public.hackathons (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  name text not null,
  deadline timestamptz,
  description text,
  link text,
  ai_analysis jsonb,
  created_at timestamptz not null default now()
);

-- Project ideas
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  idea text not null,
  description text,
  created_at timestamptz not null default now()
);

-- Roadmap (AI-generated tree)
create table if not exists public.roadmap_nodes (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  parent_id uuid references public.roadmap_nodes(id) on delete cascade,
  title text not null,
  description text,
  status text check (status in ('todo', 'doing', 'done')) default 'todo',
  order_index int not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Team tasks (shared)
create table if not exists public.team_tasks (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  title text not null,
  status text check (status in ('todo', 'doing', 'done')) default 'todo',
  assignee_id uuid references auth.users(id) on delete set null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Personal tasks (only for yourself)
create table if not exists public.personal_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  status text check (status in ('todo', 'doing', 'done')) default 'todo',
  created_at timestamptz not null default now()
);

-- Brainstorm ideas (AI-generated)
create table if not exists public.brainstorm (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  title text not null,
  description text,
  votes int not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Team hierarchy / roles
create table if not exists public.team_roles (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role_name text not null check (role_name in ('leader', 'developer', 'designer', 'pitch', 'other')),
  role_label text,
  created_at timestamptz not null default now(),
  unique(team_id, user_id)
);

-- Enable RLS
alter table public.hackathons enable row level security;
alter table public.projects enable row level security;
alter table public.roadmap_nodes enable row level security;
alter table public.team_tasks enable row level security;
alter table public.personal_tasks enable row level security;
alter table public.brainstorm enable row level security;
alter table public.team_roles enable row level security;

-- Policies
create policy "hackathon access" on public.hackathons
for all using (public.is_team_member(team_id));

create policy "project access" on public.projects
for all using (public.is_team_member(team_id));

create policy "roadmap access" on public.roadmap_nodes
for all using (public.is_team_member(team_id));

create policy "team_task access" on public.team_tasks
for all using (public.is_team_member(team_id));

create policy "personal_task access" on public.personal_tasks
for all using (user_id = auth.uid());

create policy "brainstorm access" on public.brainstorm
for all using (public.is_team_member(team_id));

create policy "team_role access" on public.team_roles
for all using (public.is_team_member(team_id));

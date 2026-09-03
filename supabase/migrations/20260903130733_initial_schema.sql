-- ============================================
-- Vertex Virtual Lab
-- Initial Database Schema
-- M4 Backend
-- ============================================

-- ============================================
-- 1. PROFILES
-- Extends Supabase Auth users
-- ============================================

create table public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    display_name text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);


-- ============================================
-- 2. EXPERIMENTS
-- Stores experiment definitions/configuration
-- ============================================

create table public.experiments (
    id uuid primary key default gen_random_uuid(),

    user_id uuid not null
        references public.profiles(id)
        on delete cascade,

    name text not null,
    description text,
    experiment_type text not null,

    configuration jsonb not null default '{}'::jsonb,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);


-- ============================================
-- 3. EXPERIMENT RUNS
-- Stores individual executions of experiments
-- ============================================

create table public.experiment_runs (
    id uuid primary key default gen_random_uuid(),

    experiment_id uuid not null
        references public.experiments(id)
        on delete cascade,

    status text not null default 'pending',

    input_data jsonb not null default '{}'::jsonb,
    result_data jsonb,

    error_message text,

    started_at timestamptz,
    completed_at timestamptz,

    created_at timestamptz not null default now()
);


-- ============================================
-- 4. INDEXES
-- ============================================

create index experiments_user_id_idx
    on public.experiments(user_id);

create index experiment_runs_experiment_id_idx
    on public.experiment_runs(experiment_id);

create index experiment_runs_status_idx
    on public.experiment_runs(status);

create index experiment_runs_created_at_idx
    on public.experiment_runs(created_at);


-- ============================================
-- 5. ROW LEVEL SECURITY
-- ============================================

alter table public.profiles enable row level security;
alter table public.experiments enable row level security;
alter table public.experiment_runs enable row level security;


-- ============================================
-- 6. PROFILE POLICIES
-- ============================================

create policy "Users can view their own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);


create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);


-- ============================================
-- 7. EXPERIMENT POLICIES
-- ============================================

create policy "Users can view their own experiments"
on public.experiments
for select
to authenticated
using (auth.uid() = user_id);


create policy "Users can create their own experiments"
on public.experiments
for insert
to authenticated
with check (auth.uid() = user_id);


create policy "Users can update their own experiments"
on public.experiments
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);


create policy "Users can delete their own experiments"
on public.experiments
for delete
to authenticated
using (auth.uid() = user_id);


-- ============================================
-- 8. EXPERIMENT RUN POLICIES
-- ============================================

create policy "Users can view runs of their own experiments"
on public.experiment_runs
for select
to authenticated
using (
    exists (
        select 1
        from public.experiments
        where experiments.id = experiment_runs.experiment_id
          and experiments.user_id = auth.uid()
    )
);


create policy "Users can create runs for their own experiments"
on public.experiment_runs
for insert
to authenticated
with check (
    exists (
        select 1
        from public.experiments
        where experiments.id = experiment_runs.experiment_id
          and experiments.user_id = auth.uid()
    )
);


create policy "Users can update runs of their own experiments"
on public.experiment_runs
for update
to authenticated
using (
    exists (
        select 1
        from public.experiments
        where experiments.id = experiment_runs.experiment_id
          and experiments.user_id = auth.uid()
    )
)
with check (
    exists (
        select 1
        from public.experiments
        where experiments.id = experiment_runs.experiment_id
          and experiments.user_id = auth.uid()
    )
);


create policy "Users can delete runs of their own experiments"
on public.experiment_runs
for delete
to authenticated
using (
    exists (
        select 1
        from public.experiments
        where experiments.id = experiment_runs.experiment_id
          and experiments.user_id = auth.uid()
    )
);

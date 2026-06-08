create table if not exists public.tree_type_assignments (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  farm_property_id uuid not null references public.farm_properties(id) on delete restrict,
  block_id uuid references public.farm_blocks(id) on delete cascade,
  row_id uuid references public.farm_rows(id) on delete set null,
  row_range text,
  tree_count integer not null default 0 check (tree_count >= 0),
  status public.record_status not null default 'active',
  notes text,
  created_by uuid references public.worker_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tree_type_assignments_farm_idx
  on public.tree_type_assignments(farm_id);

create index if not exists tree_type_assignments_property_idx
  on public.tree_type_assignments(farm_property_id);

create index if not exists tree_type_assignments_block_row_idx
  on public.tree_type_assignments(block_id, row_id);

alter table public.tree_type_assignments enable row level security;

drop policy if exists "farm workers can read tree assignments" on public.tree_type_assignments;
create policy "farm workers can read tree assignments"
on public.tree_type_assignments
for select to authenticated
using (public.current_worker_role(farm_id) is not null);

drop policy if exists "admins and managers can manage tree assignments" on public.tree_type_assignments;
create policy "admins and managers can manage tree assignments"
on public.tree_type_assignments
for all to authenticated
using (public.current_worker_role(farm_id) in ('admin', 'manager'))
with check (public.current_worker_role(farm_id) in ('admin', 'manager'));

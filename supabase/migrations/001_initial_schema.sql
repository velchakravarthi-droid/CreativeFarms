create extension if not exists pgcrypto;

create type public.app_role as enum ('admin', 'manager', 'user');
create type public.record_status as enum ('active', 'inactive', 'hold');
create type public.work_status as enum ('open', 'in_progress', 'hold', 'completed', 'cancelled');
create type public.payment_status as enum ('paid', 'due', 'advance', 'part_paid');

create table public.farms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  total_acres numeric(10, 2) not null default 0,
  created_at timestamptz not null default now()
);

create table public.farm_blocks (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  name text not null,
  acres numeric(10, 2) not null default 0,
  status public.record_status not null default 'active',
  notes text,
  created_at timestamptz not null default now(),
  unique (farm_id, name)
);

create table public.farm_rows (
  id uuid primary key default gen_random_uuid(),
  block_id uuid not null references public.farm_blocks(id) on delete cascade,
  name text not null,
  status public.record_status not null default 'active',
  notes text,
  created_at timestamptz not null default now(),
  unique (block_id, name)
);

create table public.farm_properties (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  property_type text not null,
  name text not null,
  quantity integer,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  unique (farm_id, property_type, name)
);

create table public.worker_profiles (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  auth_user_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  phone text,
  role public.app_role not null default 'user',
  access_area text,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  unique (farm_id, full_name)
);

create table public.worker_block_assignments (
  id uuid primary key default gen_random_uuid(),
  worker_id uuid not null references public.worker_profiles(id) on delete cascade,
  block_id uuid not null references public.farm_blocks(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (worker_id, block_id)
);

create table public.activity_entries (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  block_id uuid references public.farm_blocks(id) on delete set null,
  row_id uuid references public.farm_rows(id) on delete set null,
  activity_type text not null,
  activity_date date not null default current_date,
  start_time time,
  end_time time,
  worker_id uuid references public.worker_profiles(id) on delete set null,
  equipment_property_id uuid references public.farm_properties(id) on delete set null,
  status public.work_status not null default 'completed',
  notes text,
  created_by uuid references public.worker_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  synced_at timestamptz,
  unique (client_id)
);

create table public.tree_exceptions (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  block_id uuid not null references public.farm_blocks(id) on delete cascade,
  row_id uuid references public.farm_rows(id) on delete set null,
  tree_number integer,
  tree_type text,
  issue_type text not null,
  severity text not null,
  observed_on date not null default current_date,
  notes text,
  photo_url text,
  created_by uuid references public.worker_profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.work_orders (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  block_id uuid references public.farm_blocks(id) on delete set null,
  row_id uuid references public.farm_rows(id) on delete set null,
  work_type text not null,
  title text not null,
  description text,
  assigned_to uuid references public.worker_profiles(id) on delete set null,
  due_date date,
  priority text not null default 'medium',
  status public.work_status not null default 'open',
  created_by uuid references public.worker_profiles(id) on delete set null,
  completed_by uuid references public.worker_profiles(id) on delete set null,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  category text not null,
  item_type text,
  name text not null,
  unit text not null,
  reorder_level numeric(12, 2) not null default 0,
  current_stock numeric(12, 2) not null default 0,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  unique (farm_id, name)
);

create table public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  inventory_item_id uuid not null references public.inventory_items(id) on delete restrict,
  movement_type text not null,
  quantity numeric(12, 2) not null,
  unit_cost numeric(12, 2),
  block_id uuid references public.farm_blocks(id) on delete set null,
  linked_activity text,
  vendor text,
  reference_no text,
  notes text,
  created_by uuid references public.worker_profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  expense_date date not null default current_date,
  cost_type text not null,
  linked_module text,
  block_id uuid references public.farm_blocks(id) on delete set null,
  expense_for text not null,
  amount numeric(12, 2) not null check (amount >= 0),
  paid_by text not null,
  payment_status public.payment_status not null default 'paid',
  notes text,
  created_by uuid references public.worker_profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.harvest_batches (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  block_id uuid references public.farm_blocks(id) on delete set null,
  batch_code text not null,
  crop_family text not null,
  crop_type text not null,
  harvest_date date not null,
  quantity_kg numeric(12, 2) not null default 0,
  buyer text,
  notes text,
  created_by uuid references public.worker_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (farm_id, batch_code)
);

alter table public.farms enable row level security;
alter table public.farm_blocks enable row level security;
alter table public.farm_rows enable row level security;
alter table public.farm_properties enable row level security;
alter table public.worker_profiles enable row level security;
alter table public.worker_block_assignments enable row level security;
alter table public.activity_entries enable row level security;
alter table public.tree_exceptions enable row level security;
alter table public.work_orders enable row level security;
alter table public.inventory_items enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.expenses enable row level security;
alter table public.harvest_batches enable row level security;

create or replace function public.current_worker_role(target_farm_id uuid)
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.worker_profiles
  where auth_user_id = auth.uid()
    and farm_id = target_farm_id
    and status = 'active'
  limit 1
$$;

-- First production pass: authenticated farm workers can read/write farm records.
-- Tighten per-table policies after Supabase Auth users are linked to worker_profiles.
create policy "authenticated workers can read farms"
on public.farms for select
to authenticated
using (true);

create policy "admins and managers can manage farms"
on public.farms for all
to authenticated
using (exists (
  select 1 from public.worker_profiles
  where auth_user_id = auth.uid()
    and role in ('admin', 'manager')
    and status = 'active'
))
with check (exists (
  select 1 from public.worker_profiles
  where auth_user_id = auth.uid()
    and role in ('admin', 'manager')
    and status = 'active'
));

create policy "workers can read blocks"
on public.farm_blocks for select
to authenticated
using (public.current_worker_role(farm_id) is not null);

create policy "admins and managers can manage blocks"
on public.farm_blocks for all
to authenticated
using (public.current_worker_role(farm_id) in ('admin', 'manager'))
with check (public.current_worker_role(farm_id) in ('admin', 'manager'));

create policy "workers can read rows"
on public.farm_rows for select
to authenticated
using (
  exists (
    select 1 from public.farm_blocks b
    where b.id = farm_rows.block_id
      and public.current_worker_role(b.farm_id) is not null
  )
);

create policy "admins and managers can manage rows"
on public.farm_rows for all
to authenticated
using (
  exists (
    select 1 from public.farm_blocks b
    where b.id = farm_rows.block_id
      and public.current_worker_role(b.farm_id) in ('admin', 'manager')
  )
)
with check (
  exists (
    select 1 from public.farm_blocks b
    where b.id = farm_rows.block_id
      and public.current_worker_role(b.farm_id) in ('admin', 'manager')
  )
);

create policy "workers can read farm properties"
on public.farm_properties for select
to authenticated
using (public.current_worker_role(farm_id) is not null);

create policy "admins and managers can manage farm properties"
on public.farm_properties for all
to authenticated
using (public.current_worker_role(farm_id) in ('admin', 'manager'))
with check (public.current_worker_role(farm_id) in ('admin', 'manager'));

create policy "workers can read worker profiles"
on public.worker_profiles for select
to authenticated
using (public.current_worker_role(farm_id) is not null);

create policy "admins can manage worker profiles"
on public.worker_profiles for all
to authenticated
using (public.current_worker_role(farm_id) = 'admin')
with check (public.current_worker_role(farm_id) = 'admin');

create policy "admins and managers can read worker block assignments"
on public.worker_block_assignments for select
to authenticated
using (
  exists (
    select 1
    from public.worker_profiles w
    where w.id = worker_block_assignments.worker_id
      and public.current_worker_role(w.farm_id) in ('admin', 'manager')
  )
);

create policy "admins can manage worker block assignments"
on public.worker_block_assignments for all
to authenticated
using (
  exists (
    select 1
    from public.worker_profiles w
    where w.id = worker_block_assignments.worker_id
      and public.current_worker_role(w.farm_id) = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.worker_profiles w
    where w.id = worker_block_assignments.worker_id
      and public.current_worker_role(w.farm_id) = 'admin'
  )
);

create policy "farm workers can read activity entries"
on public.activity_entries for select
to authenticated
using (public.current_worker_role(farm_id) is not null);

create policy "farm workers can create activity entries"
on public.activity_entries for insert
to authenticated
with check (public.current_worker_role(farm_id) is not null);

create policy "admins and managers can update activity entries"
on public.activity_entries for update
to authenticated
using (public.current_worker_role(farm_id) in ('admin', 'manager'))
with check (public.current_worker_role(farm_id) in ('admin', 'manager'));

create policy "admins can delete activity entries"
on public.activity_entries for delete
to authenticated
using (public.current_worker_role(farm_id) = 'admin');

create policy "farm workers can read tree exceptions"
on public.tree_exceptions for select
to authenticated
using (public.current_worker_role(farm_id) is not null);

create policy "farm workers can create tree exceptions"
on public.tree_exceptions for insert
to authenticated
with check (public.current_worker_role(farm_id) is not null);

create policy "admins and managers can manage tree exceptions"
on public.tree_exceptions for update
to authenticated
using (public.current_worker_role(farm_id) in ('admin', 'manager'))
with check (public.current_worker_role(farm_id) in ('admin', 'manager'));

create policy "farm workers can read work orders"
on public.work_orders for select
to authenticated
using (public.current_worker_role(farm_id) is not null);

create policy "admins and managers can manage work orders"
on public.work_orders for all
to authenticated
using (public.current_worker_role(farm_id) in ('admin', 'manager'))
with check (public.current_worker_role(farm_id) in ('admin', 'manager'));

create policy "farm workers can read inventory items"
on public.inventory_items for select
to authenticated
using (public.current_worker_role(farm_id) is not null);

create policy "admins and managers can manage inventory items"
on public.inventory_items for all
to authenticated
using (public.current_worker_role(farm_id) in ('admin', 'manager'))
with check (public.current_worker_role(farm_id) in ('admin', 'manager'));

create policy "farm workers can read inventory movements"
on public.inventory_movements for select
to authenticated
using (public.current_worker_role(farm_id) is not null);

create policy "admins and managers can manage inventory movements"
on public.inventory_movements for all
to authenticated
using (public.current_worker_role(farm_id) in ('admin', 'manager'))
with check (public.current_worker_role(farm_id) in ('admin', 'manager'));

create policy "farm workers can read expenses"
on public.expenses for select
to authenticated
using (public.current_worker_role(farm_id) is not null);

create policy "admins and managers can create expenses"
on public.expenses for insert
to authenticated
with check (public.current_worker_role(farm_id) in ('admin', 'manager'));

create policy "admins can update expenses"
on public.expenses for update
to authenticated
using (public.current_worker_role(farm_id) = 'admin')
with check (public.current_worker_role(farm_id) = 'admin');

create policy "farm workers can read harvest batches"
on public.harvest_batches for select
to authenticated
using (public.current_worker_role(farm_id) is not null);

create policy "admins and managers can manage harvest batches"
on public.harvest_batches for all
to authenticated
using (public.current_worker_role(farm_id) in ('admin', 'manager'))
with check (public.current_worker_role(farm_id) in ('admin', 'manager'));

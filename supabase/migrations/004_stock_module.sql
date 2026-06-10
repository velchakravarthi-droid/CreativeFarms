create table if not exists public.stock_category (
  category_id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  local_id text,
  category_name text not null,
  description text,
  is_active boolean not null default true,
  sync_status text not null default 'synced',
  device_id text,
  created_at timestamptz not null default now(),
  created_by uuid references public.worker_profiles(id) on delete set null,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.worker_profiles(id) on delete set null,
  is_deleted boolean not null default false,
  unique (farm_id, category_name)
);

create table if not exists public.stock_type (
  stock_type_id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  local_id text,
  category_id uuid not null references public.stock_category(category_id) on delete cascade,
  stock_type_name text not null,
  description text,
  is_active boolean not null default true,
  sync_status text not null default 'synced',
  device_id text,
  created_at timestamptz not null default now(),
  created_by uuid references public.worker_profiles(id) on delete set null,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.worker_profiles(id) on delete set null,
  is_deleted boolean not null default false,
  unique (farm_id, category_id, stock_type_name)
);

create table if not exists public.stock_item (
  item_id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  local_id text,
  category_id uuid not null references public.stock_category(category_id) on delete restrict,
  stock_type_id uuid references public.stock_type(stock_type_id) on delete set null,
  item_name text not null,
  base_unit text not null,
  has_package boolean not null default false,
  package_name text,
  package_quantity numeric(12, 3),
  package_unit text,
  minimum_stock_quantity numeric(12, 3),
  minimum_stock_unit text,
  is_active boolean not null default true,
  sync_status text not null default 'synced',
  device_id text,
  created_at timestamptz not null default now(),
  created_by uuid references public.worker_profiles(id) on delete set null,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.worker_profiles(id) on delete set null,
  is_deleted boolean not null default false,
  unique (farm_id, category_id, stock_type_id, item_name),
  check (minimum_stock_quantity is null or minimum_stock_quantity >= 0),
  check (
    has_package = false
    or (package_name is not null and package_quantity is not null and package_quantity > 0 and package_unit is not null)
  )
);

create table if not exists public.stock_balance (
  balance_id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  local_id text,
  item_id uuid not null references public.stock_item(item_id) on delete cascade,
  current_base_quantity numeric(14, 3) not null default 0 check (current_base_quantity >= 0),
  base_unit text not null,
  current_package_count numeric(14, 3),
  package_name text,
  last_transaction_date date,
  sync_status text not null default 'synced',
  device_id text,
  updated_at timestamptz not null default now(),
  is_deleted boolean not null default false,
  unique (farm_id, item_id)
);

create table if not exists public.stock_transaction (
  transaction_id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  local_id text,
  item_id uuid not null references public.stock_item(item_id) on delete restrict,
  transaction_type text not null check (transaction_type in ('ADD', 'REDUCE')),
  transaction_date date not null,
  quantity numeric(14, 3) not null check (quantity > 0),
  quantity_unit text not null,
  package_count numeric(14, 3),
  package_name text,
  quantity_per_package numeric(14, 3),
  base_quantity numeric(14, 3) not null check (base_quantity > 0),
  base_unit text not null,
  cost_per_unit numeric(14, 2),
  total_cost numeric(14, 2),
  supplier_name text,
  invoice_number text,
  storage_location text,
  used_for text,
  zone_id text,
  row_range text,
  worker_name text,
  notes text,
  sync_status text not null default 'synced',
  device_id text,
  created_at timestamptz not null default now(),
  created_by uuid references public.worker_profiles(id) on delete set null,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.worker_profiles(id) on delete set null,
  is_deleted boolean not null default false
);

create index if not exists stock_transaction_item_date_idx
on public.stock_transaction (farm_id, item_id, transaction_date desc);

create index if not exists stock_balance_low_stock_idx
on public.stock_balance (farm_id, item_id, current_base_quantity);

alter table public.stock_category enable row level security;
alter table public.stock_type enable row level security;
alter table public.stock_item enable row level security;
alter table public.stock_balance enable row level security;
alter table public.stock_transaction enable row level security;

drop policy if exists "farm workers can read stock categories" on public.stock_category;
create policy "farm workers can read stock categories"
on public.stock_category for select to authenticated
using (public.current_worker_role(farm_id) is not null);

drop policy if exists "admins and managers can manage stock categories" on public.stock_category;
create policy "admins and managers can manage stock categories"
on public.stock_category for all to authenticated
using (public.current_worker_role(farm_id) in ('admin', 'manager'))
with check (public.current_worker_role(farm_id) in ('admin', 'manager'));

drop policy if exists "farm workers can read stock types" on public.stock_type;
create policy "farm workers can read stock types"
on public.stock_type for select to authenticated
using (public.current_worker_role(farm_id) is not null);

drop policy if exists "admins and managers can manage stock types" on public.stock_type;
create policy "admins and managers can manage stock types"
on public.stock_type for all to authenticated
using (public.current_worker_role(farm_id) in ('admin', 'manager'))
with check (public.current_worker_role(farm_id) in ('admin', 'manager'));

drop policy if exists "farm workers can read stock items" on public.stock_item;
create policy "farm workers can read stock items"
on public.stock_item for select to authenticated
using (public.current_worker_role(farm_id) is not null);

drop policy if exists "admins and managers can manage stock items" on public.stock_item;
create policy "admins and managers can manage stock items"
on public.stock_item for all to authenticated
using (public.current_worker_role(farm_id) in ('admin', 'manager'))
with check (public.current_worker_role(farm_id) in ('admin', 'manager'));

drop policy if exists "farm workers can read stock balances" on public.stock_balance;
create policy "farm workers can read stock balances"
on public.stock_balance for select to authenticated
using (public.current_worker_role(farm_id) is not null);

drop policy if exists "admins and managers can manage stock balances" on public.stock_balance;
create policy "admins and managers can manage stock balances"
on public.stock_balance for all to authenticated
using (public.current_worker_role(farm_id) in ('admin', 'manager'))
with check (public.current_worker_role(farm_id) in ('admin', 'manager'));

drop policy if exists "farm workers can read stock transactions" on public.stock_transaction;
create policy "farm workers can read stock transactions"
on public.stock_transaction for select to authenticated
using (public.current_worker_role(farm_id) is not null);

drop policy if exists "admins and managers can manage stock transactions" on public.stock_transaction;
create policy "admins and managers can manage stock transactions"
on public.stock_transaction for all to authenticated
using (public.current_worker_role(farm_id) in ('admin', 'manager'))
with check (public.current_worker_role(farm_id) in ('admin', 'manager'));

insert into public.stock_category (farm_id, category_name)
select f.id, c.category_name
from public.farms f
cross join (
  values
    ('Fertilizer'),
    ('Pesticide'),
    ('Fuel / Oil'),
    ('Irrigation Material'),
    ('Farm Tool'),
    ('Spare Part'),
    ('Seed / Sapling'),
    ('Organic Input'),
    ('Packing Material'),
    ('General Supply')
) as c(category_name)
on conflict (farm_id, category_name) do nothing;

insert into public.stock_type (farm_id, category_id, stock_type_name)
select c.farm_id, c.category_id, t.stock_type_name
from public.stock_category c
join (
  values
    ('Fertilizer', 'Nitrogen Fertilizer'),
    ('Fertilizer', 'Phosphorus Fertilizer'),
    ('Fertilizer', 'Potassium Fertilizer'),
    ('Fertilizer', 'Complex NPK Fertilizer'),
    ('Fertilizer', 'Micronutrient'),
    ('Fertilizer', 'Organic Fertilizer'),
    ('Fertilizer', 'Bio-fertilizer'),
    ('Fertilizer', 'Soil Amendment'),
    ('Fertilizer', 'Liquid Fertilizer'),
    ('Fuel / Oil', 'Diesel'),
    ('Fuel / Oil', 'Petrol'),
    ('Fuel / Oil', 'Engine Oil'),
    ('Fuel / Oil', 'Gear Oil'),
    ('Fuel / Oil', 'Grease'),
    ('Irrigation Material', 'Drip Pipe'),
    ('Irrigation Material', 'Lateral Pipe'),
    ('Irrigation Material', 'Main Pipe'),
    ('Irrigation Material', 'Valve'),
    ('Irrigation Material', 'Filter'),
    ('Irrigation Material', 'Connector')
) as t(category_name, stock_type_name)
  on t.category_name = c.category_name
on conflict (farm_id, category_id, stock_type_name) do nothing;

insert into public.stock_item (
  farm_id,
  category_id,
  stock_type_id,
  item_name,
  base_unit,
  has_package,
  package_name,
  package_quantity,
  package_unit,
  minimum_stock_quantity,
  minimum_stock_unit
)
select c.farm_id, c.category_id, st.stock_type_id, i.item_name, i.base_unit, i.has_package, i.package_name, i.package_quantity, i.package_unit, i.minimum_stock_quantity, i.minimum_stock_unit
from (
  values
    ('Fertilizer', 'Nitrogen Fertilizer', 'Urea', 'Kg', true, 'Bag', 45::numeric, 'Kg', 10::numeric, 'Bag'),
    ('Fertilizer', 'Phosphorus Fertilizer', 'DAP', 'Kg', true, 'Bag', 50::numeric, 'Kg', 5::numeric, 'Bag'),
    ('Fuel / Oil', 'Diesel', 'Diesel', 'Litre', false, null, null, null, 100::numeric, 'Litre'),
    ('Irrigation Material', 'Connector', '16mm Drip Connector', 'Piece', false, null, null, null, 50::numeric, 'Piece')
) as i(category_name, stock_type_name, item_name, base_unit, has_package, package_name, package_quantity, package_unit, minimum_stock_quantity, minimum_stock_unit)
join public.stock_category c
  on c.category_name = i.category_name
join public.stock_type st
  on st.farm_id = c.farm_id
 and st.category_id = c.category_id
 and st.stock_type_name = i.stock_type_name
on conflict (farm_id, category_id, stock_type_id, item_name) do nothing;

insert into public.stock_balance (farm_id, item_id, current_base_quantity, base_unit, current_package_count, package_name)
select si.farm_id, si.item_id, 0, si.base_unit, case when si.has_package then 0 else null end, si.package_name
from public.stock_item si
on conflict (farm_id, item_id) do nothing;

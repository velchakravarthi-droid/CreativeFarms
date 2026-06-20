alter table public.expenses
add column if not exists farm_property_id uuid references public.farm_properties(id) on delete set null;

alter table public.expenses
add column if not exists property_count numeric(12, 2) check (property_count is null or property_count >= 0);

create index if not exists expenses_farm_property_idx
on public.expenses (farm_id, farm_property_id, expense_date desc);

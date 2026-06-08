alter table public.tree_exceptions
add column if not exists issue_category text not null default 'pest',
add column if not exists issue_status text not null default 'Open';

alter table public.tree_exceptions
drop constraint if exists tree_exceptions_issue_category_check;

alter table public.tree_exceptions
add constraint tree_exceptions_issue_category_check
check (issue_category in ('pest', 'disease', 'growth'));

alter table public.tree_exceptions
drop constraint if exists tree_exceptions_issue_status_check;

alter table public.tree_exceptions
add constraint tree_exceptions_issue_status_check
check (issue_status in ('Open', 'Treatment In Progress', 'Cured', 'Tree dead'));

create index if not exists tree_exceptions_issue_lookup_idx
on public.tree_exceptions (farm_id, block_id, row_id, issue_category, issue_status, observed_on desc);

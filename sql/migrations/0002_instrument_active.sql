alter table public.instruments
add column if not exists active boolean not null default true;

create index if not exists idx_instruments_active on public.instruments(active);

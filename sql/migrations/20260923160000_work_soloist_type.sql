alter table public.works
  add column if not exists soloist_type text;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'works_soloist_type_check'
      and conrelid = 'public.works'::regclass
  ) then
    alter table public.works add constraint works_soloist_type_check
      check (soloist_type is null or soloist_type in ('none', 'vocal', 'instrumental'));
  end if;
end $$;

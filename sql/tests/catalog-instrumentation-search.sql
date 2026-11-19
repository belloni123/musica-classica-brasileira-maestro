-- Run against a disposable database with a name ending in "_test" and all migrations applied.
begin;
do $$ begin
  if right(current_database(), 5) <> '_test' then raise exception 'Use a disposable test database'; end if;
end $$;

insert into auth.users (id, email)
values ('00000000-0000-4000-8000-000000000031', 'instrumentation-subscriber@example.invalid'),
       ('00000000-0000-4000-8000-000000000032', 'instrumentation-user@example.invalid');
update public.profiles set role = 'subscriber_individual' where id = '00000000-0000-4000-8000-000000000031';
insert into public.composers (id, canonical_name, display_name, slug, publication_status)
values (md5('filter-composer')::uuid, 'Compositor teste', 'Compositor teste', 'filter-composer', 'published');
insert into public.works (id, composer_id, canonical_title, display_title, slug, publication_status)
select md5(slug)::uuid, md5('filter-composer')::uuid, slug, slug, slug, status::public.publication_status
from (values ('filter-match', 'published'), ('filter-unknown', 'published'),
     ('filter-absent', 'published'), ('filter-draft', 'draft')) as fixture(slug,status);
insert into public.instruments (id, name, family)
select md5(key)::uuid, name, 'Família de teste'
from (values ('filter-flute',' Flauta '), ('filter-oboe', U&'Oboe\0301'),
     ('filter-tuba','Tuba'), ('filter-timpani','Tímpanos'), ('filter-strings','Violoncelo')) as fixture(key,name)
on conflict (name) do nothing;
insert into public.work_instrumentation (work_id, instrument_id, minimum_quantity, maximum_quantity, quantity_text)
select md5(work)::uuid, i.id, min_qty, max_qty, qty
from (values
  ('filter-match',' Flauta ',1,1,null),
  ('filter-match',' Flauta ',null,null,'2 – 3'),
  ('filter-match',U&'Oboe\0301',1,null,null),
  ('filter-match','Tuba',null,0,null),
  ('filter-match','Tímpanos',null,null,null),
  ('filter-match','Violoncelo',null,null,null),
  ('filter-unknown',' Flauta ',3,3,null),
  ('filter-unknown',' Flauta ',null,null,'ad libitum'),
  ('filter-absent',' Flauta ',3,3,null),
  ('filter-draft','Tuba',0,0,null)
) as fixture(work,instrument,min_qty,max_qty,qty)
join public.instruments i on i.name = fixture.instrument;

set local role authenticated;
do $test$
declare
  actual text[];
begin
  perform set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000032',true);
  begin
    perform public.search_catalog_instrumentation('{"Tuba":0}',false,false,'','','');
    raise exception 'Ordinary account can read instrumentation results';
  exception when insufficient_privilege then null;
  end;
  perform set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000031',true);

  select array_agg(slug order by slug) into actual
  from public.search_catalog_instrumentation('{"Flauta":3}',false,false,'','','');
  if actual is distinct from array['filter-absent','filter-match'] then
    raise exception 'Range summing or unknown quantity differs: %', actual;
  end if;

  select array_agg(slug order by slug) into actual
  from public.search_catalog_instrumentation('{"Flauta":4,"Oboé":1000,"Tuba":0}',true,true,'Flauta','','');
  if actual is distinct from array['filter-match'] then
    raise exception 'Combined criteria or open upper bound differs: %', actual;
  end if;

  select array_agg(slug order by slug) into actual
  from public.search_catalog_instrumentation('{"Tuba":0}',false,false,'','','');
  if actual is distinct from array['filter-match'] then
    raise exception 'Explicit zero, missing instrument or draft differs: %', actual;
  end if;

  select array_agg(slug order by slug) into actual
  from public.search_catalog_instrumentation('{}',true,true,'','','');
  if actual is distinct from array['filter-match'] then
    raise exception 'Standalone strings and timpani filter differs: %', actual;
  end if;

  select array_agg(slug order by slug) into actual
  from public.search_catalog_instrumentation('{}',false,false,'Flauta','','');
  if actual is distinct from array['filter-absent','filter-match','filter-unknown'] then
    raise exception 'Standalone text filter differs: %', actual;
  end if;
end
$test$;

rollback;

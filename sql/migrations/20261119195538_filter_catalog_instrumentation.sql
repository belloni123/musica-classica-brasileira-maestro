begin;

-- A safe row type for PostgREST embedding. Keep composer_id for the foreign-key join.
create view public.catalog_instrumentation_search_works
with (security_invoker = true) as
select id, composer_id, display_title, slug, composition_year_start, composition_year_end,
       duration_minutes, formation_type, public_summary, publication_status, search_document,
       has_choir, has_soloist, educational_work, youth_work
from public.works
where publication_status = 'published';

revoke all on public.catalog_instrumentation_search_works from public, anon, authenticated;
grant select on public.catalog_instrumentation_search_works to authenticated;

create function catalog_private.instrument_name_key(value text)
returns text language sql immutable strict set search_path = ''
as $$
  select lower(regexp_replace(btrim(normalize(translate(value, U&'\00A0\202F\FEFF', '   '), NFD),
    E' \t\n\r\f\v'), U&'[\0300-\036F]', '', 'g'))
$$;

-- Search inputs are at most 1000. Saturating larger bounds avoids overflow
-- even for long quantity strings already stored in the catalog.
create function catalog_private.catalog_search_bound(value text)
returns integer language sql immutable strict set search_path = ''
as $$
  select case when length(ltrim(value, '0')) > 4 then 1001
    else least(coalesce(nullif(ltrim(value, '0'), '')::integer, 0), 1001) end
$$;

create function catalog_private.search_catalog_instrumentation(
  quantities jsonb, require_timpani boolean, require_strings boolean,
  instrument_query text, solo_query text, voice_query text
)
returns setof public.catalog_instrumentation_search_works
language plpgsql stable security definer set search_path = ''
as $$
declare
  text_matches uuid[];
begin
  if auth.uid() is null or not public.has_catalog_access() then
    raise insufficient_privilege using message = 'Acesso ao catálogo necessário';
  end if;

  if jsonb_typeof(quantities) is distinct from 'object' then
    raise invalid_parameter_value using message = 'Quantidades inválidas';
  end if;
  if exists (
    select 1 from jsonb_each_text(quantities) as q(name, quantity)
    where catalog_private.instrument_name_key(q.name) not in (
      'flauta','oboe','clarinete','fagote','trompa','trompete','trombone','tuba'
    ) or q.quantity is null or q.quantity !~ '^(1000|[0-9]{1,3})$'
  ) then
    raise invalid_parameter_value using message = 'Quantidades inválidas';
  end if;

  if instrument_query <> '' or solo_query <> '' or voice_query <> '' then
    text_matches := catalog_private.find_work_ids(instrument_query, solo_query, voice_query);
  end if;

  if quantities = '{}' and not coalesce(require_timpani, false) and not coalesce(require_strings, false) then
    return query select w.* from public.catalog_instrumentation_search_works w
      where text_matches is null or w.id = any(text_matches);
    return;
  end if;

  return query
  with requested as materialized (
    select catalog_private.instrument_name_key(q.name) as name, q.quantity::integer as quantity
    from jsonb_each_text(quantities) as q(name, quantity)
  ),
  instrument_keys as materialized (
    select i.id, catalog_private.instrument_name_key(i.name) as name
    from public.instruments i
  ),
  relevant as (
    select wi.work_id, k.name, q.quantity as target, wi.minimum_quantity, wi.maximum_quantity,
      case when q.quantity is not null and wi.minimum_quantity is null and wi.maximum_quantity is null
        then regexp_match(translate(wi.quantity_text, U&'\00A0\202F\FEFF', '   '),
          '^[[:space:]]*([0-9]+)(?:[[:space:]]*[-–][[:space:]]*([0-9]+))?[[:space:]]*$')
      end as parsed
    from instrument_keys k
    left join requested q on q.name = k.name
    join public.work_instrumentation wi on wi.instrument_id = k.id
    join public.catalog_instrumentation_search_works w on w.id = wi.work_id
    where (text_matches is null or wi.work_id = any(text_matches))
      and (q.quantity is not null
        or (require_timpani and k.name in ('timpanos','timpano','timpani'))
        or (require_strings and k.name in ('violino','viola','violoncelo','contrabaixo','cordas','strings')))
  ),
  by_instrument as (
    select work_id, name, target,
      count(*) = count(coalesce(minimum_quantity, maximum_quantity, catalog_private.catalog_search_bound(parsed[1])))
        and target >= sum(case when maximum_quantity is not null then coalesce(minimum_quantity, 0)
          else coalesce(minimum_quantity, catalog_private.catalog_search_bound(parsed[1])) end)
        and target <= sum(case when minimum_quantity is not null then coalesce(maximum_quantity, 1001)
          else coalesce(maximum_quantity, catalog_private.catalog_search_bound(coalesce(parsed[2], parsed[1]))) end)
        as meets_quantity
    from relevant group by work_id, name, target
  ),
  matched as (
    select work_id from by_instrument
    group by work_id
    having count(*) filter (where meets_quantity) = (select count(*) from requested)
      and (not coalesce(require_timpani, false) or bool_or(name in ('timpanos','timpano','timpani')))
      and (not coalesce(require_strings, false) or bool_or(name in ('violino','viola','violoncelo','contrabaixo','cordas','strings')))
  )
  select w.* from public.catalog_instrumentation_search_works w join matched m on m.work_id = w.id;
end;
$$;

create function public.search_catalog_instrumentation(
  quantities jsonb, require_timpani boolean, require_strings boolean,
  instrument_query text, solo_query text, voice_query text
)
returns setof public.catalog_instrumentation_search_works
language sql stable security invoker set search_path = ''
as $$
  select * from catalog_private.search_catalog_instrumentation(
    quantities, require_timpani, require_strings, instrument_query, solo_query, voice_query
  )
$$;

revoke all on function catalog_private.instrument_name_key(text), catalog_private.catalog_search_bound(text)
  from public, anon, authenticated;
revoke all on function catalog_private.search_catalog_instrumentation(jsonb, boolean, boolean, text, text, text),
  public.search_catalog_instrumentation(jsonb, boolean, boolean, text, text, text) from public, anon;
grant execute on function catalog_private.search_catalog_instrumentation(jsonb, boolean, boolean, text, text, text),
  public.search_catalog_instrumentation(jsonb, boolean, boolean, text, text, text) to authenticated;
notify pgrst, 'reload schema';

commit;

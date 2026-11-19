-- Run against a disposable database with a name ending in "_test" and all migrations applied.
begin;
do $$ begin
  if right(current_database(), 5) <> '_test' then raise exception 'Use a disposable test database'; end if;
end $$;

insert into auth.users (id, email)
values ('00000000-0000-4000-8000-000000000041', 'sheet-editor@example.invalid');
update public.profiles set role = 'editor' where id = '00000000-0000-4000-8000-000000000041';
insert into public.composers (id,canonical_name,display_name,slug,publication_status)
values (md5('sheet-composer')::uuid,'Compositor Teste','Compositor Teste','sheet-composer','published');
insert into public.instruments (id,name,family)
values (md5('sheet-flauta')::uuid,'Flauta','madeiras'),
       (md5('sheet-oboe')::uuid,'Oboé','madeiras'),
       (md5('sheet-tuba')::uuid,'Tuba','metais'),
       (md5('sheet-harpa')::uuid,'Harpa','outros')
on conflict (name) do nothing;

set local role authenticated;
do $test$
declare
  rows jsonb := '[{"slug":"sheet-work","composer_slug":"sheet-composer","canonical_title":"Obra da planilha",
    "display_title":"Obra da planilha","publication_status":"published","instrumentation":[
      {"instrument":"flauta","minimum_quantity":3,"maximum_quantity":3},
      {"instrument":"OBOE","minimum_quantity":2,"maximum_quantity":3},
      {"instrument":"Tuba","minimum_quantity":0,"maximum_quantity":0}
    ]}]';
  replacement jsonb := '[{"slug":"sheet-work","instrumentation":[
    {"instrument":"Flauta","minimum_quantity":4,"maximum_quantity":4}
  ]}]';
  clear_list jsonb := '[{"slug":"sheet-work","instrumentation":[]}]';
  preview jsonb;
  applied jsonb;
  saved_id uuid;
  flute_id uuid;
  flute_instrument_id uuid;
  harp_instrument_id uuid;
begin
  perform set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000041',true);
  select id into strict flute_instrument_id from public.instruments where name = 'Flauta';
  select id into strict harp_instrument_id from public.instruments where name = 'Harpa';
  begin
    perform public.import_catalog_v1('works',rows ||
      '[{"slug":"sheet-invalid","composer_slug":"sheet-composer","canonical_title":"Inválida","display_title":"Inválida",
        "instrumentation":[{"instrument":"Instrumento inexistente","minimum_quantity":1,"maximum_quantity":1}]}]',
      'invalid.csv');
    raise exception 'Invalid second work was accepted';
  exception when invalid_parameter_value then null;
  end;
  if exists (select 1 from public.works where slug = 'sheet-work') then
    raise exception 'Invalid batch persisted its first work';
  end if;

  preview := public.import_catalog_v1('works',rows,'sheet.csv');
  if (preview #> '{rows,0,changed_fields}') @> '["instrumentation"]' is distinct from true
    or exists (select 1 from public.work_instrumentation where imported_from_sheet)
    or exists (select 1 from public.works where slug = 'sheet-work') then
    raise exception 'Preview failed to report or roll back instrumentation';
  end if;
  applied := public.import_catalog_v1('works',rows,'sheet.csv',false,preview->>'plan');
  if applied->>'batch_id' is null or not exists (
    select 1 from public.search_catalog_instrumentation('{"Flauta":3,"Oboé":2,"Tuba":0}',false,false,'','','')
    where slug = 'sheet-work'
  ) then
    raise exception 'Imported work is missing from quantity search';
  end if;

  select id into strict saved_id from public.works where slug = 'sheet-work';
  select id into strict flute_id from public.work_instrumentation
  where work_id = saved_id and instrument_id = flute_instrument_id;
  preview := public.import_catalog_v1('works',rows,'sheet.csv');
  if preview #>> '{rows,0,action}' is distinct from 'unchanged' then
    raise exception 'Identical sheet import is not idempotent';
  end if;
  preview := public.import_catalog_v1('works',replacement,'sheet.csv');
  insert into public.work_instrumentation (work_id,instrument_id,minimum_quantity,maximum_quantity)
  values (saved_id,harp_instrument_id,1,1);
  begin
    perform public.import_catalog_v1('works',replacement,'sheet.csv',false,preview->>'plan');
    raise exception 'Outdated instrumentation preview was accepted';
  exception when sqlstate 'PBO02' then null;
  end;

  begin
    perform public.import_catalog_v1('works',
      '[{"slug":"sheet-work","instrumentation":[{"instrument":"Harpa","minimum_quantity":2,"maximum_quantity":2}]}]',
      'sheet.csv');
    raise exception 'Import overlapped a manual instrument';
  exception when invalid_parameter_value then null;
  end;

  preview := public.import_catalog_v1('works',replacement,'sheet.csv');
  perform public.import_catalog_v1('works',replacement,'sheet.csv',false,preview->>'plan');
  if not exists (select 1 from public.work_instrumentation where id = flute_id and minimum_quantity = 4)
    or (select count(*) from public.work_instrumentation where work_id = saved_id) <> 2 then
    raise exception 'Replacement did not retain the flute row and preserve manual harp';
  end if;

  preview := public.import_catalog_v1('works','[{"slug":"sheet-work","display_title":"Editada"}]','sheet.csv');
  perform public.import_catalog_v1('works','[{"slug":"sheet-work","display_title":"Editada"}]',
    'sheet.csv',false,preview->>'plan');
  if not exists (select 1 from public.work_instrumentation where id = flute_id) then
    raise exception 'Omitting the instrumentation field modified instruments';
  end if;

  preview := public.import_catalog_v1('works',clear_list,'sheet.csv');
  perform public.import_catalog_v1('works',clear_list,'sheet.csv',false,preview->>'plan');
  if exists (select 1 from public.work_instrumentation where work_id = saved_id and imported_from_sheet)
    or not exists (select 1 from public.work_instrumentation where work_id = saved_id and instrument_id = harp_instrument_id) then
    raise exception 'Clearing the sheet removed manual instruments or left imported rows';
  end if;
end
$test$;

rollback;

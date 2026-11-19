-- Applies and then rolls back test fixtures in an isolated, freshly migrated database.
begin;
do $$ begin
  if current_setting('port') <> '55437' then raise exception 'Use the isolated test database on port 55437'; end if;
end $$;

insert into auth.users(id,email) values
  ('00000000-0000-0000-0000-000000000011','import-editor@example.invalid'),
  ('00000000-0000-0000-0000-000000000012','import-user@example.invalid'),
  ('00000000-0000-0000-0000-000000000013','import-disabled@example.invalid');
update public.profiles set role='editor' where id in (
  '00000000-0000-0000-0000-000000000011','00000000-0000-0000-0000-000000000013');
update public.profiles set status='inactive' where id='00000000-0000-0000-0000-000000000013';

set local role authenticated;
do $test$
declare
  composer jsonb := '[{"slug":"composer-test","canonical_name":"Nome Completo","display_name":"Nome Completo","publication_status":"published","notes":"privado"}]';
  work jsonb := '[{"slug":"work-test","composer_slug":"composer-test","canonical_title":"Obra","display_title":"Obra","soloist_type":"vocal","performance_notes":"privado"}]';
  conductor jsonb := '[{"slug":"conductor-test","canonical_name":"João Regente","display_name":"João Regente","publication_status":"published"}]';
  bad_works jsonb := work || '[{"slug":"second-work","canonical_title":"Obra 2","display_title":"Obra 2"}]';
  result jsonb;
  applied jsonb;
  tested_user uuid;
begin
  foreach tested_user in array array[
    '00000000-0000-0000-0000-000000000012'::uuid,
    '00000000-0000-0000-0000-000000000013'::uuid
  ] loop
    perform set_config('request.jwt.claim.sub', tested_user::text, true);
    begin
      perform public.import_catalog_v1('composers',composer,'test.csv');
      raise exception 'Unauthorized import succeeded';
    exception when insufficient_privilege then null;
    end;
  end loop;
  perform set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000011',true);

  result := public.import_catalog_v1('composers',composer,'test.csv');
  if result #>> '{rows,0,action}' <> 'create' or exists(select id from public.composers where slug='composer-test')
    or exists(select id from public.import_batches where file_name='test.csv') then
    raise exception 'Preview did not roll back';
  end if;
  applied := public.import_catalog_v1('composers',composer,'test.csv',false,result->>'plan');
  if applied->>'batch_id' is null or not exists(select 1 from public.import_rows where batch_id=(applied->>'batch_id')::uuid) then
    raise exception 'Import did not record the batch';
  end if;
  result := public.import_catalog_v1('composers',composer,'test.csv');
  if result #>> '{rows,0,action}' <> 'unchanged' then
    raise exception 'Identical import is not idempotent';
  end if;
  update public.composers set display_name='Editado manualmente' where slug='composer-test';
  begin
    perform public.import_catalog_v1('composers',composer,'test.csv',false,result->>'plan');
    raise exception 'Outdated preview succeeded';
  exception when sqlstate 'PBO02' then null;
  end;
  if (select display_name from public.composers where slug='composer-test') <> 'Editado manualmente' then
    raise exception 'Conflicting import changed the row';
  end if;

  begin
    perform public.import_catalog_v1('works',bad_works,'works.csv');
    raise exception 'Missing composer was accepted';
  exception when invalid_parameter_value then null;
  end;
  if exists(select id from public.works where slug='work-test') then raise exception 'Partial batch persisted'; end if;
  result := public.import_catalog_v1('works',work,'works.csv');
  applied := public.import_catalog_v1('works',work,'works.csv',false,result->>'plan');
  if not EXISTS(select id from public.works where slug='work-test' and has_soloist and publication_status='draft') then
    raise exception 'Work linkage or defaults were incorrect';
  end if;
  result := public.import_catalog_v1('conductors',conductor,'maestros.csv');
  applied := public.import_catalog_v1('conductors',conductor,'maestros.csv',false,result->>'plan');
  if not exists(select id from public.conductors where slug='conductor-test' and search_document like '%joao regente%') then
    raise exception 'Published conductor or normalized search missing';
  end if;
end
$test$;

reset role;
select set_config('request.jwt.claim.sub','',true);
set local role anon;
do $$ begin
  if not exists(select id from public.conductors where slug='conductor-test')
    or exists(select id from public.works where slug='work-test')
    or has_function_privilege('public.import_catalog_v1(text,jsonb,text,boolean,text)','execute') then
    raise exception 'Anonymous catalog or RPC access was incorrect';
  end if;
end $$;
rollback;

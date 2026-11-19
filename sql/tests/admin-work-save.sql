-- Run against a disposable database with a name ending in "_test" and all migrations applied.
begin;
do $$ begin
  if right(current_database(), 5) <> '_test' then raise exception 'Use a disposable test database'; end if;
end $$;

insert into auth.users (id, email) values
  ('00000000-0000-4000-8000-000000000021', 'work-editor@example.invalid'),
  ('00000000-0000-4000-8000-000000000022', 'work-reviewer@example.invalid');
update public.profiles set role = 'editor' where id = '00000000-0000-4000-8000-000000000021';
update public.profiles set role = 'reviewer' where id = '00000000-0000-4000-8000-000000000022';

insert into public.composers (id, canonical_name, display_name, slug)
values ('00000000-0000-4000-8000-000000000023', 'Compositor fictício', 'Compositor fictício', 'compositor-test-save');

-- Simulate a write failure after the work update and the choir delete.
alter table public.voice_requirements add check (voice <> 'test failure') not valid;

set local role authenticated;
do $test$
declare
  fields jsonb := '{
    "composer_id":"00000000-0000-4000-8000-000000000023",
    "canonical_title":"Obra de teste", "display_title":"Título inicial",
    "alternative_titles":[], "reliability_level":"pending", "formation_type":"Formação histórica",
    "has_choir":true, "has_soloist":false, "has_electronics":false, "has_brazilian_instruments":false,
    "educational_work":false, "youth_work":false, "public_domain":false
  }';
  first_id uuid;
  second_id uuid;
  first_voice_id uuid;
begin
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000022', true);
  begin
    perform public.save_editorial_work(null, fields, 'test-work', array['Soprano']);
    raise exception 'Reviewer was allowed to write';
  exception when insufficient_privilege then null;
  end;

  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000021', true);
  first_id := public.save_editorial_work(null, fields, 'test-work', array['Soprano']);
  second_id := public.save_editorial_work(null, fields, 'test-work', array['Tenor']);
  select id into strict first_voice_id from public.voice_requirements where work_id = first_id and voice = 'Soprano';
  if (select slug from public.works where id = second_id) is distinct from 'test-work-2' then
    raise exception 'Conflicting slug was not resolved';
  end if;

  begin
    perform public.save_editorial_work(first_id, fields || '{"display_title":"Falha"}', 'test-work', array['test failure']);
    raise exception 'Expected choir insert to fail';
  exception when check_violation then null;
  end;
  if (select display_title from public.works where id = first_id) is distinct from 'Título inicial'
    or not exists (select 1 from public.voice_requirements where id = first_voice_id) then
    raise exception 'Failed save persisted partial changes';
  end if;

  perform public.save_editorial_work(first_id, fields || '{"display_title":"Atualizado","formation_type":null}',
    'outro-slug', array['Soprano', 'Contralto', 'Contralto']);
  if not exists (select 1 from public.works where id = first_id and slug = 'test-work'
    and display_title = 'Atualizado' and formation_type = 'Formação histórica')
    or not exists (select 1 from public.voice_requirements where id = first_voice_id)
    or (select count(*) from public.voice_requirements where work_id = first_id and type = 'choir') <> 2
    or not exists (select 1 from public.revision_history where entity_id = first_id and field_name = 'display_title') then
    raise exception 'Save failed to preserve data or revision history';
  end if;

  perform public.save_editorial_work(first_id, fields || '{"has_choir":false}', 'test-work', array['Tenor']);
  if exists (select 1 from public.voice_requirements where work_id = first_id and type = 'choir') then
    raise exception 'Choir voices remained after disabling choir';
  end if;
end
$test$;

rollback;

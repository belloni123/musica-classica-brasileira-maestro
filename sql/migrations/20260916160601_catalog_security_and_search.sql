-- Forward-only, data-preserving access boundary. No catalog rows are deleted.
begin;
create schema if not exists catalog_private;
revoke all on schema catalog_private from public, anon, authenticated;
grant usage on schema catalog_private to authenticated;

create or replace function public.normalize_catalog_text(value text)
returns text language sql immutable strict set search_path = '' as $$
  select trim(regexp_replace(translate(lower(value),
    'áàâãäåéèêëíìîïóòôõöúùûüçñ', 'aaaaaaeeeeiiiiooooouuuucn'), '[^a-z0-9]+', ' ', 'g'))
$$;
alter table public.composers add column if not exists search_document text;
alter table public.works add column if not exists search_document text;

create or replace function catalog_private.catalog_search_document()
returns trigger language plpgsql set search_path = '' as $$
begin
  if tg_table_name = 'composers' then
    new.search_document := public.normalize_catalog_text(concat_ws(' ',new.canonical_name,new.display_name,new.surname,
      array_to_string(new.alternative_names,' '),array_to_string(new.pseudonyms,' ')));
  else
    new.search_document := public.normalize_catalog_text(concat_ws(' ',new.canonical_title,new.display_title,
      new.original_title,new.translated_title,array_to_string(new.alternative_titles,' '),new.opus,new.catalog,new.catalog_number));
  end if;
  return new;
end $$;
create trigger catalog_search_document before insert or update on public.composers
for each row execute function catalog_private.catalog_search_document();
create trigger catalog_search_document before insert or update on public.works
for each row execute function catalog_private.catalog_search_document();
update public.composers set search_document = '';
update public.works set search_document = '';

-- RLS remains responsible for rows; column grants protect every direct API path.
revoke select on public.works, public.composers from public, anon, authenticated;
revoke select (subscriber_notes,performance_notes,editorial_notes,main_source,instrumentation_text,created_by,updated_by)
on public.works from public,anon,authenticated;
revoke select (notes,biography_source,created_by,updated_by) on public.composers from public,anon,authenticated;
grant select (id,composer_id,canonical_title,display_title,alternative_titles,original_title,translated_title,slug,
composition_year_start,composition_year_end,composition_date_text,revision_year,opus,catalog,catalog_number,
duration_minutes,duration_minimum,duration_maximum,formation_type,difficulty_level,has_choir,has_soloist,
has_electronics,has_brazilian_instruments,educational_work,youth_work,public_domain,rights_status,work_status,
public_summary,publication_status,reliability_level,created_at,updated_at,search_document)
on public.works to anon,authenticated;
grant select (id,canonical_name,display_name,surname,alternative_names,pseudonyms,slug,birth_date,death_date,
birth_year,death_year,birth_city,birth_state,birth_country,death_city,death_state,nationality,gender,ethnicity_identity,
brazil_region,short_biography,long_biography,official_website,publication_status,reliability_level,created_at,updated_at,search_document)
on public.composers to anon,authenticated;
revoke truncate,trigger,references on all tables in schema public from anon,authenticated;

drop policy "Users can read own profile" on public.profiles;
create policy "Users can read own profile" on public.profiles for select to authenticated
using ((select auth.uid())=id or public.is_admin());

-- Full editorial reads stay behind database-derived role checks, never service_role in the app.
create function catalog_private.editorial_record(entity text, record_id uuid)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare result jsonb;
begin
  if auth.uid() is null or not public.has_editorial_access() then raise insufficient_privilege using message='Acesso editorial necessário'; end if;
  if entity='work' then select to_jsonb(w) into result from public.works w where id=record_id;
  elsif entity='composer' then select to_jsonb(c) into result from public.composers c where id=record_id;
  else raise invalid_parameter_value using message='Entidade inválida'; end if;
  return result;
end $$;
create function public.get_editorial_record(entity text, record_id uuid)
returns jsonb language sql stable security invoker set search_path = '' as $$
  select catalog_private.editorial_record(entity,record_id)
$$;

create function catalog_private.work_details(work_id uuid)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare result jsonb;
begin
  if auth.uid() is null or not public.has_catalog_access() then raise insufficient_privilege using message='Acesso ao catálogo necessário'; end if;
  select jsonb_build_object('subscriber_notes',w.subscriber_notes,'performance_notes',w.performance_notes,
    'main_source',w.main_source,'instrumentation_text',w.instrumentation_text)
  into result from public.works w where w.id=work_id and (w.publication_status='published' or public.has_editorial_access());
  return result;
end $$;
create function public.get_work_details(work_id uuid)
returns jsonb language sql stable security invoker set search_path = '' as $$ select catalog_private.work_details(work_id) $$;

create function catalog_private.find_work_ids(instrument_query text, solo_query text, voice_query text)
returns uuid[] language plpgsql stable security definer set search_path = '' as $$
declare result uuid[];
begin
  if auth.uid() is null or not public.has_catalog_access() then raise insufficient_privilege using message='Acesso ao catálogo necessário'; end if;
  if length(instrument_query)>100 or length(solo_query)>100 or length(voice_query)>100 then raise invalid_parameter_value; end if;
  select coalesce(array_agg(w.id),'{}'::uuid[]) into result from public.works w
  where w.publication_status='published'
    and (instrument_query='' or exists(select 1 from public.work_instrumentation wi join public.instruments i on i.id=wi.instrument_id
      where wi.work_id=w.id and public.normalize_catalog_text(concat_ws(' ',i.name,i.family,array_to_string(i.alternative_names,' ')))
        like '%'||replace(public.normalize_catalog_text(instrument_query),' ','%')||'%'))
    and (solo_query='' or exists(select 1 from public.work_instrumentation wi join public.instruments i on i.id=wi.instrument_id
      where wi.work_id=w.id and public.normalize_catalog_text(coalesce(wi.role,'')) in ('solo','solista')
      and public.normalize_catalog_text(i.name) like '%'||replace(public.normalize_catalog_text(solo_query),' ','%')||'%'))
    and (voice_query='' or exists(select 1 from public.voice_requirements v where v.work_id=w.id
      and public.normalize_catalog_text(concat_ws(' ',v.type,v.voice)) like '%'||replace(public.normalize_catalog_text(voice_query),' ','%')||'%'));
  return result;
end $$;
create function public.find_catalog_work_ids(instrument_query text default '', solo_query text default '', voice_query text default '')
returns uuid[] language sql stable security invoker set search_path = '' as $$
select catalog_private.find_work_ids(instrument_query,solo_query,voice_query) $$;

revoke all on all functions in schema catalog_private from public,anon,authenticated;
grant execute on function catalog_private.editorial_record(text,uuid),catalog_private.work_details(uuid),
catalog_private.find_work_ids(text,text,text) to authenticated;
revoke all on function public.get_editorial_record(text,uuid),public.get_work_details(uuid),public.find_catalog_work_ids(text,text,text) from public,anon;
grant execute on function public.get_editorial_record(text,uuid),public.get_work_details(uuid),public.find_catalog_work_ids(text,text,text) to authenticated;

-- Trusted, atomic provenance is generated by triggers, not caller-authored log rows.
drop policy "Editors can insert revision history" on public.revision_history;
revoke insert,update,delete,truncate on public.revision_history from anon,authenticated;
drop policy "Admins can manage audit logs" on public.audit_logs;
drop policy "Authenticated users can insert own audit events" on public.audit_logs;
create policy "Admins read audit logs" on public.audit_logs for select to authenticated using(public.is_admin());
create policy "Admins record managed user creation" on public.audit_logs for insert to authenticated
with check (public.is_admin() and actor_user_id=auth.uid() and action='user.created' and entity_type='profile');
revoke update,delete,truncate on public.audit_logs from anon,authenticated;
revoke insert on public.audit_logs from anon;

create function catalog_private.editorial_actor()
returns trigger language plpgsql set search_path = '' as $$
begin
  -- Auth maintenance / FK SET NULL runs as a trusted database role, not a Data API caller.
  if current_user not in ('anon','authenticated','authenticator') then return new; end if;
  if tg_op='INSERT' then new.created_by:=auth.uid(); else new.created_by:=old.created_by; end if;
  new.updated_by:=auth.uid();
  return new;
end $$;
create trigger editorial_actor before insert or update on public.works for each row execute function catalog_private.editorial_actor();
create trigger editorial_actor before insert or update on public.composers for each row execute function catalog_private.editorial_actor();

create function catalog_private.record_editorial_change()
returns trigger language plpgsql security definer set search_path = '' as $$
declare previous jsonb; current_value jsonb; field text; record_id uuid; entity text:=tg_argv[0]; actor uuid:=auth.uid();
begin
  if actor is null and session_user in ('authenticator','anon','authenticated') then
    raise insufficient_privilege using message='Ator editorial não autenticado';
  end if;
  if tg_op<>'INSERT' then previous:=to_jsonb(old)-array['updated_at','search_document']; end if;
  if tg_op<>'DELETE' then current_value:=to_jsonb(new)-array['updated_at','search_document']; end if;
  if previous is not distinct from current_value then return null; end if;
  record_id:=coalesce(current_value->>'id',previous->>'id')::uuid;
  for field in select jsonb_object_keys(coalesce(current_value,previous)) loop
    if (previous->field) is distinct from (current_value->field) then
      insert into public.revision_history(entity_type,entity_id,field_name,previous_value,new_value,user_id,reason)
      values(entity,record_id,field,previous->field,current_value->field,actor,lower(tg_op));
    end if;
  end loop;
  insert into public.audit_logs(actor_user_id,action,entity_type,entity_id,metadata_json)
  values(actor,entity||'.'||lower(tg_op),entity,record_id,jsonb_build_object('operation',tg_op,'source','database_trigger'));
  return null;
end $$;
revoke all on function catalog_private.record_editorial_change(),catalog_private.editorial_actor() from public,anon,authenticated;
do $$
declare item text[];
begin
  foreach item slice 1 in array array[
    ['composers','composer'],['works','work'],['instruments','instrument'],['instrument_families','instrument_family'],
    ['work_instrumentation','work_instrumentation'],['movements','movement'],['voice_requirements','voice_requirement'],
    ['source_holders','source_holder'],['work_sources','work_source'],['manuscript_sources','manuscript_source'],
    ['bibliographic_references','bibliographic_reference'],['work_references','work_reference'],['composer_references','composer_reference'],
    ['taxonomies','taxonomy'],['work_taxonomies','work_taxonomy'],['composer_taxonomies','composer_taxonomy']
  ] loop
    execute format('create trigger record_editorial_change after insert or update or delete on public.%I for each row execute function catalog_private.record_editorial_change(%L)',item[1],item[2]);
  end loop;
end $$;
notify pgrst, 'reload schema';
commit;

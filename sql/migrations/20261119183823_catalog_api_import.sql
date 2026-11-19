begin;

create table public.conductors (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) <= 160),
  canonical_name text not null check (length(trim(canonical_name)) >= 2),
  display_name text not null check (length(trim(display_name)) >= 2),
  birth_year integer check (birth_year between 0 and 3000),
  death_year integer check (death_year between 0 and 3000),
  short_biography text,
  long_biography text,
  search_document text generated always as (public.normalize_catalog_text(canonical_name || ' ' || display_name)) stored,
  publication_status public.publication_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.conductors enable row level security;
revoke all on public.conductors from public, anon, authenticated;
grant select on public.conductors to anon, authenticated;
grant insert (slug, canonical_name, display_name, birth_year, death_year, short_biography,
  long_biography, publication_status) on public.conductors to authenticated;
grant update (canonical_name, display_name, birth_year, death_year, short_biography,
  long_biography, publication_status) on public.conductors to authenticated;

create policy "Published conductors are public" on public.conductors for select to anon, authenticated
using (publication_status = 'published' or public.has_editorial_access());
create policy "Editors can insert conductors" on public.conductors for insert to authenticated
with check (public.has_editor_write_access());
create policy "Editors can update conductors" on public.conductors for update to authenticated
using (public.has_editor_write_access()) with check (public.has_editor_write_access());

create index conductors_public_directory on public.conductors (display_name, slug)
where publication_status = 'published';
create trigger set_conductor_updated_at before update on public.conductors
for each row execute function public.set_updated_at();
create trigger record_editorial_change after insert or update on public.conductors
for each row execute function catalog_private.record_editorial_change('conductor');

create function public.import_catalog_v1(
  entity text,
  rows jsonb,
  file_name text,
  dry_run boolean default true,
  expected_plan text default null
)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  target_table text;
  allowed text[];
  input_row jsonb;
  patch jsonb;
  typed_patch jsonb;
  old_record jsonb;
  versions jsonb := '[]'::jsonb;
  results jsonb := '[]'::jsonb;
  affected uuid[] := '{}';
  seen_slugs text[] := '{}';
  record_slug text;
  record_id uuid;
  composer_id uuid;
  composer_slug text;
  changed_fields text[];
  column_list text;
  value_list text;
  assignments text;
  row_number integer := 0;
  changed_count integer := 0;
  action text;
  plan text;
  batch_id uuid;
begin
  if auth.uid() is null or not public.has_editor_write_access() or not exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.status = 'active'
  ) then
    raise insufficient_privilege using message = 'Conta editorial ativa necessária.';
  end if;

  if jsonb_typeof(rows) is distinct from 'array' or length(file_name) not between 1 and 255
    or file_name is null or dry_run is null then
    raise invalid_parameter_value using message = 'Lote inválido.';
  end if;
  if jsonb_array_length(rows) not between 1 and 100 or octet_length(rows::text) > 1048576 then
    raise invalid_parameter_value using message = 'O lote deve ter de 1 a 100 linhas e no máximo 1 MiB.';
  end if;

  case entity
    when 'composers' then
      target_table := 'composers';
      allowed := array['canonical_name','display_name','surname','alternative_names','pseudonyms',
        'birth_date','death_date','birth_year','death_year','birth_city','birth_state','birth_country',
        'death_city','death_state','nationality','gender','ethnicity_identity','brazil_region',
        'short_biography','long_biography','biography_source','official_website','notes','reliability_level'];
    when 'conductors' then
      target_table := 'conductors';
      allowed := array['canonical_name','display_name','birth_year','death_year','short_biography','long_biography'];
    when 'works' then
      target_table := 'works';
      allowed := array['canonical_title','display_title','alternative_titles','original_title','translated_title',
        'composition_year_start','composition_year_end','composition_date_text','revision_year','opus','catalog',
        'catalog_number','duration_minutes','duration_minimum','duration_maximum','formation_type','difficulty_level',
        'soloist_type','has_choir','has_electronics','has_brazilian_instruments','educational_work','youth_work',
        'public_domain','rights_status','work_status','public_summary','subscriber_notes','performance_notes',
        'editorial_notes','main_source','instrumentation_text','reliability_level','composer_slug'];
    else raise invalid_parameter_value using message = 'Entidade inválida.';
  end case;
  allowed := allowed || array['slug','publication_status'];

  -- Serialize imports and lock individual existing rows against edits through the UI.
  perform pg_advisory_xact_lock(781306411);
  begin
    for input_row in select value from jsonb_array_elements(rows) loop
      row_number := row_number + 1;
      record_slug := input_row->>'slug';
      if jsonb_typeof(input_row) is distinct from 'object' or record_slug is null
        or length(record_slug) > 160 or record_slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$' then
        raise invalid_parameter_value using message = 'Slug inválido.';
      end if;
      if record_slug = any(seen_slugs) then
        raise invalid_parameter_value using message = 'Slug repetido no lote.';
      end if;
      seen_slugs := array_append(seen_slugs, record_slug);
      if exists (select 1 from jsonb_object_keys(input_row) k where not (k = any(allowed))) then
        raise invalid_parameter_value using message = 'Campo fora do contrato de importação.';
      end if;

      execute format('select id from public.%I where slug = $1 for update', target_table)
        into record_id using record_slug;
      old_record := null;
      if record_id is not null then
        if entity = 'conductors' then
          select to_jsonb(c) into old_record from public.conductors c where id = record_id;
        else
          old_record := catalog_private.editorial_record(
            case when entity = 'composers' then 'composer' else 'work' end, record_id);
        end if;
      end if;
      versions := versions || jsonb_build_array(jsonb_build_array(record_id, md5(old_record::text)));
      patch := input_row;
      composer_id := null;

      if entity = 'works' and input_row ? 'composer_slug' then
        composer_slug := input_row->>'composer_slug';
        select c.id into composer_id from public.composers c where c.slug = composer_slug for key share;
        if composer_id is null then
          raise invalid_parameter_value using message = 'Compositor não encontrado pelo composer_slug.';
        end if;
        versions := versions || jsonb_build_array(composer_id);
        patch := (patch - 'composer_slug') || jsonb_build_object('composer_id', composer_id);
      end if;
      if entity = 'works' and patch ? 'soloist_type' then
        patch := patch || jsonb_build_object('has_soloist', coalesce(patch->>'soloist_type' in ('vocal','instrumental'), false));
      end if;

      execute format('select to_jsonb(jsonb_populate_record(null::public.%I, $1))', target_table)
        into typed_patch using patch;
      select array_agg(k order by k) into changed_fields
        from jsonb_object_keys(patch) k
        where k <> 'slug' and (old_record is null or old_record->k is distinct from typed_patch->k);
      action := 'unchanged';

      if record_id is null then
        action := 'create';
        if entity = 'works' then
          if composer_id is null or coalesce(length(trim(patch->>'canonical_title')), 0) < 1
            or coalesce(length(trim(patch->>'display_title')), 0) < 1 then
            raise invalid_parameter_value using message = 'Nova obra requer composer_slug, canonical_title e display_title.';
          end if;
        elsif coalesce(length(trim(patch->>'canonical_name')), 0) < 2
          or coalesce(length(trim(patch->>'display_name')), 0) < 2 then
          raise invalid_parameter_value using message = 'Novo cadastro requer canonical_name e display_name.';
        end if;
        select string_agg(format('%I', k), ', ' order by k),
               string_agg(format('(r).%I', k), ', ' order by k)
          into column_list, value_list from jsonb_object_keys(patch) k;
        execute format(
          'insert into public.%I (%s) select %s from (select jsonb_populate_record(null::public.%I, $1) as r) v returning id',
          target_table, column_list, value_list, target_table)
          into record_id using patch;
      elsif changed_fields is not null then
        action := 'update';
        select string_agg(format('%I = (r).%I', k, k), ', ' order by k)
          into assignments from unnest(changed_fields) k;
        execute format(
          'update public.%I set %s from (select jsonb_populate_record(null::public.%I, $1) as r) v where id = $2',
          target_table, assignments, target_table)
          using patch, record_id;
      end if;

      affected := array_append(affected, record_id);
      if action <> 'unchanged' then changed_count := changed_count + 1; end if;
      results := results || jsonb_build_array(jsonb_build_object(
        'row', row_number,
        'slug', record_slug,
        'action', action,
        'previous_status', old_record->>'publication_status',
        'publication_status', coalesce(patch->>'publication_status', old_record->>'publication_status', 'draft'),
        'changed_fields', coalesce(changed_fields, '{}'::text[])
      ));
    end loop;

    plan := md5(jsonb_build_array(entity, rows, file_name, versions)::text);
    if dry_run then
      -- Exercise real constraints and triggers, then roll back every preview write.
      raise sqlstate 'PBO01';
    end if;
    if expected_plan is distinct from plan then
      raise sqlstate 'PBO02' using message = 'O lote ou os registros mudaram. Gere outra prévia antes de aplicar.';
    end if;

    if changed_count > 0 then
      insert into public.import_batches (uploaded_by, file_name, file_type, entity_type, status, total_rows, valid_rows)
      values (auth.uid(), file_name, 'api', entity, 'imported', row_number, row_number)
      returning id into batch_id;
      insert into public.import_rows (batch_id, row_number, status, normalized_json, created_entity_type, created_entity_id)
      select batch_id, ordinal::integer,
        case when result->>'action' = 'unchanged' then 'skipped' else 'imported' end::public.import_row_status,
        result, entity, affected[ordinal::integer]
      from jsonb_array_elements(results) with ordinality r(result, ordinal);
    end if;
  exception
    when sqlstate 'PBO01' then null;
    when data_exception or integrity_constraint_violation then
      raise using errcode = sqlstate, message = sqlerrm, detail = row_number::text;
  end;

  return jsonb_build_object('entity', entity, 'dry_run', dry_run, 'plan', plan, 'batch_id', batch_id,
    'total', row_number, 'changed', changed_count, 'rows', results);
end
$$;

revoke all on function public.import_catalog_v1(text,jsonb,text,boolean,text) from public, anon, authenticated;
grant execute on function public.import_catalog_v1(text,jsonb,text,boolean,text) to authenticated;
notify pgrst, 'reload schema';

commit;

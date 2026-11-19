begin;

create function public.save_editorial_work(
  work_id uuid,
  fields jsonb,
  base_slug text,
  choir_voices text[]
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  incoming public.works := jsonb_populate_record(null::public.works, fields);
  saved_id uuid;
  current_title text;
  current_slug text;
  candidate text := base_slug;
  suffix integer := 2;
  violated_constraint text;
  selected_voices text[] := coalesce(choir_voices, '{}'::text[]);
begin
  if auth.uid() is null or not public.has_editor_write_access() then
    raise insufficient_privilege using message = 'Acesso de edição necessário';
  end if;

  if work_id is not null then
    select w.canonical_title, w.slug into current_title, current_slug
    from public.works w where w.id = work_id for update;
    if not found then raise no_data_found using message = 'Obra não encontrada'; end if;

    if incoming.canonical_title = current_title then
      candidate := current_slug;
    end if;
  end if;

  loop
    begin
      if work_id is null then
        insert into public.works (
          composer_id, canonical_title, display_title, slug, alternative_titles,
          original_title, translated_title, composition_year_start, composition_year_end,
          composition_date_text, revision_year, opus, catalog, catalog_number,
          duration_minutes, duration_minimum, duration_maximum, formation_type, soloist_type,
          difficulty_level, has_choir, has_soloist, has_electronics, has_brazilian_instruments,
          educational_work, youth_work, public_domain, rights_status, work_status, public_summary,
          subscriber_notes, performance_notes, editorial_notes, main_source, instrumentation_text,
          reliability_level
        ) values (
          incoming.composer_id, incoming.canonical_title, incoming.display_title, candidate,
          incoming.alternative_titles, incoming.original_title, incoming.translated_title,
          incoming.composition_year_start, incoming.composition_year_end, incoming.composition_date_text,
          incoming.revision_year, incoming.opus, incoming.catalog, incoming.catalog_number,
          incoming.duration_minutes, incoming.duration_minimum, incoming.duration_maximum,
          incoming.formation_type, incoming.soloist_type, incoming.difficulty_level, incoming.has_choir,
          incoming.has_soloist, incoming.has_electronics, incoming.has_brazilian_instruments,
          incoming.educational_work, incoming.youth_work, incoming.public_domain, incoming.rights_status,
          incoming.work_status, incoming.public_summary, incoming.subscriber_notes,
          incoming.performance_notes, incoming.editorial_notes, incoming.main_source,
          incoming.instrumentation_text, incoming.reliability_level
        ) returning id into saved_id;
      else
        update public.works w set
          composer_id = incoming.composer_id,
          canonical_title = incoming.canonical_title,
          display_title = incoming.display_title,
          slug = candidate,
          composition_year_start = incoming.composition_year_start,
          composition_year_end = null,
          duration_minutes = incoming.duration_minutes,
          formation_type = coalesce(incoming.formation_type, w.formation_type),
          soloist_type = incoming.soloist_type,
          has_soloist = incoming.has_soloist,
          has_choir = incoming.has_choir,
          main_source = incoming.main_source,
          performance_notes = incoming.performance_notes
        where w.id = work_id returning id into saved_id;
        if not found then raise no_data_found using message = 'Obra não encontrada'; end if;
      end if;
      exit;
    exception when unique_violation then
      get stacked diagnostics violated_constraint = constraint_name;
      if violated_constraint <> 'works_slug_key' then raise; end if;
      candidate := base_slug || '-' || suffix;
      suffix := suffix + 1;
    end;
  end loop;

  if not incoming.has_choir then selected_voices := '{}'; end if;

  delete from public.voice_requirements v
  where v.work_id = saved_id and v.type = 'choir'
    and not exists (select 1 from unnest(selected_voices) as selected(voice) where selected.voice = v.voice);

  insert into public.voice_requirements (work_id, type, voice)
  select distinct saved_id, 'choir', selected.voice
  from unnest(selected_voices) as selected(voice)
  where selected.voice is not null and not exists (
    select 1 from public.voice_requirements v
    where v.work_id = saved_id and v.type = 'choir' and v.voice = selected.voice
  );

  return saved_id;
end;
$$;

revoke all on function public.save_editorial_work(uuid, jsonb, text, text[]) from public, anon;
grant execute on function public.save_editorial_work(uuid, jsonb, text, text[]) to authenticated;
notify pgrst, 'reload schema';

commit;

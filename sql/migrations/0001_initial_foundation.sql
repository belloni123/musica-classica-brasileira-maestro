create extension if not exists pgcrypto;

do $$
begin
  create type public.app_role as enum (
    'user',
    'subscriber_individual',
    'subscriber_professional',
    'institution_user',
    'institution_admin',
    'editor',
    'reviewer',
    'admin'
  );
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.publication_status as enum ('draft', 'in_review', 'published', 'archived');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.reliability_level as enum (
    'primary_source_confirmed',
    'secondary_source_confirmed',
    'composer_reported',
    'publisher_reported',
    'inferred',
    'pending'
  );
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.organization_type as enum (
    'orchestra',
    'university',
    'conservatory',
    'library',
    'festival',
    'publisher',
    'archive',
    'research_group',
    'other'
  );
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.organization_member_role as enum ('member', 'manager', 'admin');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.member_status as enum ('invited', 'active', 'suspended', 'removed');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.source_holder_type as enum (
    'publisher',
    'archive',
    'library',
    'composer_estate',
    'institution',
    'website',
    'person',
    'other'
  );
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.material_type as enum (
    'score',
    'parts',
    'perusal_score',
    'recording',
    'program_note',
    'video',
    'link',
    'other'
  );
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.manuscript_source_type as enum (
    'autograph',
    'copyist_manuscript',
    'facsimile',
    'sketch',
    'draft',
    'letter',
    'catalog_record',
    'other'
  );
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.reference_type as enum (
    'book',
    'article',
    'thesis',
    'dissertation',
    'catalog',
    'website',
    'program_note',
    'archive_record',
    'other'
  );
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.taxonomy_type as enum (
    'period',
    'aesthetic_movement',
    'theme',
    'region',
    'formation',
    'programming_occasion',
    'difficulty',
    'pedagogical_profile',
    'brazilian_instrument',
    'curatorial_identity'
  );
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.import_status as enum ('uploaded', 'validating', 'ready', 'imported', 'failed', 'cancelled');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.import_row_status as enum ('pending', 'valid', 'warning', 'error', 'imported', 'skipped');
exception when duplicate_object then null;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.role_definitions (
  role public.app_role primary key,
  label text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role public.app_role not null default 'user',
  institution text,
  phone text,
  country text,
  state text,
  status text not null default 'active',
  accepted_terms_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_login_at timestamptz
);

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type public.organization_type not null default 'other',
  country text,
  state text,
  city text,
  domain text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.organization_member_role not null default 'member',
  status public.member_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create table if not exists public.composers (
  id uuid primary key default gen_random_uuid(),
  canonical_name text not null,
  display_name text not null,
  surname text,
  alternative_names text[] not null default '{}',
  pseudonyms text[] not null default '{}',
  slug text not null unique,
  birth_date date,
  death_date date,
  birth_year integer,
  death_year integer,
  birth_city text,
  birth_state text,
  birth_country text,
  death_city text,
  death_state text,
  nationality text,
  gender text,
  ethnicity_identity text,
  brazil_region text,
  short_biography text,
  long_biography text,
  biography_source text,
  official_website text,
  notes text,
  publication_status public.publication_status not null default 'draft',
  reliability_level public.reliability_level not null default 'pending',
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.works (
  id uuid primary key default gen_random_uuid(),
  composer_id uuid not null references public.composers(id) on delete restrict,
  canonical_title text not null,
  display_title text not null,
  alternative_titles text[] not null default '{}',
  original_title text,
  translated_title text,
  slug text not null unique,
  composition_year_start integer,
  composition_year_end integer,
  composition_date_text text,
  revision_year integer,
  opus text,
  catalog text,
  catalog_number text,
  duration_minutes numeric(6, 2),
  duration_minimum integer,
  duration_maximum integer,
  formation_type text,
  difficulty_level text,
  has_choir boolean not null default false,
  has_soloist boolean not null default false,
  has_electronics boolean not null default false,
  has_brazilian_instruments boolean not null default false,
  educational_work boolean not null default false,
  youth_work boolean not null default false,
  public_domain boolean not null default false,
  rights_status text,
  work_status text,
  public_summary text,
  subscriber_notes text,
  performance_notes text,
  editorial_notes text,
  main_source text,
  instrumentation_text text,
  publication_status public.publication_status not null default 'draft',
  reliability_level public.reliability_level not null default 'pending',
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.instrument_families (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.instruments (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  plural_name text,
  abbreviation text,
  family text not null,
  family_id uuid references public.instrument_families(id) on delete set null,
  subfamily text,
  alternative_names text[] not null default '{}',
  is_brazilian_instrument boolean not null default false,
  display_order integer not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.work_instrumentation (
  id uuid primary key default gen_random_uuid(),
  work_id uuid not null references public.works(id) on delete cascade,
  instrument_id uuid not null references public.instruments(id) on delete restrict,
  minimum_quantity integer,
  maximum_quantity integer,
  quantity_text text,
  required boolean not null default true,
  optional boolean not null default false,
  doubling boolean not null default false,
  doubled_instrument_id uuid references public.instruments(id) on delete set null,
  substitutable boolean not null default false,
  role text,
  notes text,
  source text,
  reliability_level public.reliability_level not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (minimum_quantity is null or minimum_quantity >= 0),
  check (maximum_quantity is null or maximum_quantity >= 0),
  check (
    minimum_quantity is null
    or maximum_quantity is null
    or minimum_quantity <= maximum_quantity
  )
);

create table if not exists public.movements (
  id uuid primary key default gen_random_uuid(),
  work_id uuid not null references public.works(id) on delete cascade,
  display_order integer not null default 0,
  title text,
  tempo_marking text,
  duration_minutes numeric(6, 2),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.voice_requirements (
  id uuid primary key default gen_random_uuid(),
  work_id uuid not null references public.works(id) on delete cascade,
  type text not null,
  voice text,
  quantity integer,
  choir_type text,
  choir_size text,
  optional boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.source_holders (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type public.source_holder_type not null default 'other',
  country text,
  state text,
  city text,
  address text,
  email text,
  phone text,
  website text,
  contact_person text,
  notes text,
  active boolean not null default true,
  last_verified_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.work_sources (
  id uuid primary key default gen_random_uuid(),
  work_id uuid not null references public.works(id) on delete cascade,
  source_holder_id uuid references public.source_holders(id) on delete set null,
  material_type public.material_type not null default 'other',
  score_available boolean not null default false,
  parts_available boolean not null default false,
  perusal_score_url text,
  purchase_url text,
  rental_url text,
  recording_url text,
  program_note_url text,
  video_url text,
  access_conditions text,
  notes text,
  last_verified_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.manuscript_sources (
  id uuid primary key default gen_random_uuid(),
  work_id uuid not null references public.works(id) on delete cascade,
  source_holder_id uuid references public.source_holders(id) on delete set null,
  source_type public.manuscript_source_type not null default 'other',
  archive_code text,
  description text,
  digitized boolean not null default false,
  access_url text,
  public_access boolean not null default false,
  preservation_status text,
  notes text,
  reliability_level public.reliability_level not null default 'pending',
  last_verified_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bibliographic_references (
  id uuid primary key default gen_random_uuid(),
  type public.reference_type not null default 'other',
  author text,
  title text not null,
  year integer,
  publisher text,
  institution text,
  place text,
  doi text,
  url text,
  accessed_at date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.work_references (
  id uuid primary key default gen_random_uuid(),
  work_id uuid not null references public.works(id) on delete cascade,
  reference_id uuid not null references public.bibliographic_references(id) on delete cascade,
  notes text,
  page text,
  relation_type text,
  created_at timestamptz not null default now(),
  unique (work_id, reference_id, page)
);

create table if not exists public.composer_references (
  id uuid primary key default gen_random_uuid(),
  composer_id uuid not null references public.composers(id) on delete cascade,
  reference_id uuid not null references public.bibliographic_references(id) on delete cascade,
  notes text,
  page text,
  relation_type text,
  created_at timestamptz not null default now(),
  unique (composer_id, reference_id, page)
);

create table if not exists public.taxonomies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type public.taxonomy_type not null,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.work_taxonomies (
  id uuid primary key default gen_random_uuid(),
  work_id uuid not null references public.works(id) on delete cascade,
  taxonomy_id uuid not null references public.taxonomies(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (work_id, taxonomy_id)
);

create table if not exists public.composer_taxonomies (
  id uuid primary key default gen_random_uuid(),
  composer_id uuid not null references public.composers(id) on delete cascade,
  taxonomy_id uuid not null references public.taxonomies(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (composer_id, taxonomy_id)
);

create table if not exists public.revision_history (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  field_name text,
  previous_value jsonb,
  new_value jsonb,
  reason text,
  source text,
  user_id uuid references auth.users(id) on delete set null,
  status text not null default 'recorded',
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text,
  entity_id uuid,
  metadata_json jsonb not null default '{}'::jsonb,
  ip_address inet,
  created_at timestamptz not null default now()
);

create table if not exists public.saved_searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  parameters_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  work_id uuid not null references public.works(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, work_id)
);

create table if not exists public.repertoire_lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  private boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.repertoire_list_items (
  id uuid primary key default gen_random_uuid(),
  list_id uuid not null references public.repertoire_lists(id) on delete cascade,
  work_id uuid not null references public.works(id) on delete cascade,
  private_notes text,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (list_id, work_id)
);

create table if not exists public.import_batches (
  id uuid primary key default gen_random_uuid(),
  uploaded_by uuid references auth.users(id) on delete set null,
  file_name text not null,
  file_type text not null,
  entity_type text not null,
  status public.import_status not null default 'uploaded',
  total_rows integer not null default 0,
  valid_rows integer not null default 0,
  error_rows integer not null default 0,
  metadata_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.import_rows (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.import_batches(id) on delete cascade,
  row_number integer not null,
  status public.import_row_status not null default 'pending',
  raw_json jsonb not null default '{}'::jsonb,
  normalized_json jsonb not null default '{}'::jsonb,
  errors_json jsonb not null default '[]'::jsonb,
  created_entity_type text,
  created_entity_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (batch_id, row_number)
);

create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_organization_members_user on public.organization_members(user_id);
create index if not exists idx_organization_members_org on public.organization_members(organization_id);
create index if not exists idx_composers_publication_status on public.composers(publication_status);
create index if not exists idx_composers_slug on public.composers(slug);
create index if not exists idx_composers_birth_year on public.composers(birth_year);
create index if not exists idx_composers_region on public.composers(brazil_region);
create index if not exists idx_composers_alternative_names on public.composers using gin(alternative_names);
create index if not exists idx_works_composer_id on public.works(composer_id);
create index if not exists idx_works_publication_status on public.works(publication_status);
create index if not exists idx_works_slug on public.works(slug);
create index if not exists idx_works_composition_year_start on public.works(composition_year_start);
create index if not exists idx_works_duration_minutes on public.works(duration_minutes);
create index if not exists idx_works_formation_type on public.works(formation_type);
create index if not exists idx_works_alternative_titles on public.works using gin(alternative_titles);
create index if not exists idx_instruments_family on public.instruments(family);
create index if not exists idx_instruments_family_id on public.instruments(family_id);
create index if not exists idx_work_instrumentation_work on public.work_instrumentation(work_id);
create index if not exists idx_work_instrumentation_instrument on public.work_instrumentation(instrument_id);
create index if not exists idx_movements_work on public.movements(work_id);
create index if not exists idx_voice_requirements_work on public.voice_requirements(work_id);
create index if not exists idx_source_holders_type on public.source_holders(type);
create index if not exists idx_work_sources_work on public.work_sources(work_id);
create index if not exists idx_manuscript_sources_work on public.manuscript_sources(work_id);
create index if not exists idx_work_references_work on public.work_references(work_id);
create index if not exists idx_composer_references_composer on public.composer_references(composer_id);
create index if not exists idx_taxonomies_type on public.taxonomies(type);
create index if not exists idx_revision_history_entity on public.revision_history(entity_type, entity_id);
create index if not exists idx_audit_logs_actor on public.audit_logs(actor_user_id);
create index if not exists idx_audit_logs_entity on public.audit_logs(entity_type, entity_id);
create index if not exists idx_saved_searches_user on public.saved_searches(user_id);
create index if not exists idx_favorites_user on public.favorites(user_id);
create index if not exists idx_repertoire_lists_user on public.repertoire_lists(user_id);
create index if not exists idx_import_batches_status on public.import_batches(status);
create index if not exists idx_import_rows_batch on public.import_rows(batch_id);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_organizations_updated_at on public.organizations;
create trigger set_organizations_updated_at
before update on public.organizations
for each row execute function public.set_updated_at();

drop trigger if exists set_organization_members_updated_at on public.organization_members;
create trigger set_organization_members_updated_at
before update on public.organization_members
for each row execute function public.set_updated_at();

drop trigger if exists set_composers_updated_at on public.composers;
create trigger set_composers_updated_at
before update on public.composers
for each row execute function public.set_updated_at();

drop trigger if exists set_works_updated_at on public.works;
create trigger set_works_updated_at
before update on public.works
for each row execute function public.set_updated_at();

drop trigger if exists set_instruments_updated_at on public.instruments;
create trigger set_instruments_updated_at
before update on public.instruments
for each row execute function public.set_updated_at();

drop trigger if exists set_work_instrumentation_updated_at on public.work_instrumentation;
create trigger set_work_instrumentation_updated_at
before update on public.work_instrumentation
for each row execute function public.set_updated_at();

drop trigger if exists set_movements_updated_at on public.movements;
create trigger set_movements_updated_at
before update on public.movements
for each row execute function public.set_updated_at();

drop trigger if exists set_voice_requirements_updated_at on public.voice_requirements;
create trigger set_voice_requirements_updated_at
before update on public.voice_requirements
for each row execute function public.set_updated_at();

drop trigger if exists set_source_holders_updated_at on public.source_holders;
create trigger set_source_holders_updated_at
before update on public.source_holders
for each row execute function public.set_updated_at();

drop trigger if exists set_work_sources_updated_at on public.work_sources;
create trigger set_work_sources_updated_at
before update on public.work_sources
for each row execute function public.set_updated_at();

drop trigger if exists set_manuscript_sources_updated_at on public.manuscript_sources;
create trigger set_manuscript_sources_updated_at
before update on public.manuscript_sources
for each row execute function public.set_updated_at();

drop trigger if exists set_bibliographic_references_updated_at on public.bibliographic_references;
create trigger set_bibliographic_references_updated_at
before update on public.bibliographic_references
for each row execute function public.set_updated_at();

drop trigger if exists set_taxonomies_updated_at on public.taxonomies;
create trigger set_taxonomies_updated_at
before update on public.taxonomies
for each row execute function public.set_updated_at();

drop trigger if exists set_saved_searches_updated_at on public.saved_searches;
create trigger set_saved_searches_updated_at
before update on public.saved_searches
for each row execute function public.set_updated_at();

drop trigger if exists set_repertoire_lists_updated_at on public.repertoire_lists;
create trigger set_repertoire_lists_updated_at
before update on public.repertoire_lists
for each row execute function public.set_updated_at();

drop trigger if exists set_import_batches_updated_at on public.import_batches;
create trigger set_import_batches_updated_at
before update on public.import_batches
for each row execute function public.set_updated_at();

drop trigger if exists set_import_rows_updated_at on public.import_rows;
create trigger set_import_rows_updated_at
before update on public.import_rows
for each row execute function public.set_updated_at();

create or replace function public.current_user_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.has_any_role(required_roles public.app_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() = any(required_roles), false)
$$;

create or replace function public.has_editorial_access()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_any_role(array['admin', 'editor', 'reviewer']::public.app_role[])
$$;

create or replace function public.has_editor_write_access()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_any_role(array['admin', 'editor']::public.app_role[])
$$;

create or replace function public.has_catalog_access()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_any_role(
    array[
      'admin',
      'editor',
      'reviewer',
      'subscriber_individual',
      'subscriber_professional',
      'institution_user',
      'institution_admin'
    ]::public.app_role[]
  )
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_any_role(array['admin']::public.app_role[])
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name')
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(public.profiles.full_name, excluded.full_name);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.role_definitions enable row level security;
alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.composers enable row level security;
alter table public.works enable row level security;
alter table public.instrument_families enable row level security;
alter table public.instruments enable row level security;
alter table public.work_instrumentation enable row level security;
alter table public.movements enable row level security;
alter table public.voice_requirements enable row level security;
alter table public.source_holders enable row level security;
alter table public.work_sources enable row level security;
alter table public.manuscript_sources enable row level security;
alter table public.bibliographic_references enable row level security;
alter table public.work_references enable row level security;
alter table public.composer_references enable row level security;
alter table public.taxonomies enable row level security;
alter table public.work_taxonomies enable row level security;
alter table public.composer_taxonomies enable row level security;
alter table public.revision_history enable row level security;
alter table public.audit_logs enable row level security;
alter table public.saved_searches enable row level security;
alter table public.favorites enable row level security;
alter table public.repertoire_lists enable row level security;
alter table public.repertoire_list_items enable row level security;
alter table public.import_batches enable row level security;
alter table public.import_rows enable row level security;

create policy "Anyone can read role definitions"
on public.role_definitions for select
using (true);

create policy "Users can read own profile"
on public.profiles for select
using (auth.uid() = id or public.has_editorial_access());

create policy "Users can update own non-privileged profile"
on public.profiles for update
using (auth.uid() = id or public.is_admin())
with check (auth.uid() = id or public.is_admin());

create policy "Admins can insert profiles"
on public.profiles for insert
with check (public.is_admin() or auth.uid() = id);

create policy "Organization members can read organizations"
on public.organizations for select
using (
  public.has_editorial_access()
  or exists (
    select 1
    from public.organization_members members
    where members.organization_id = organizations.id
      and members.user_id = auth.uid()
      and members.status = 'active'
  )
);

create policy "Admins can manage organizations"
on public.organizations for all
using (public.is_admin())
with check (public.is_admin());

create policy "Members can read own organization memberships"
on public.organization_members for select
using (user_id = auth.uid() or public.has_editorial_access());

create policy "Admins can manage organization memberships"
on public.organization_members for all
using (public.is_admin())
with check (public.is_admin());

create policy "Published composers are public"
on public.composers for select
using (publication_status = 'published' or public.has_editorial_access());

create policy "Editors can insert composers"
on public.composers for insert
with check (public.has_editor_write_access());

create policy "Editors can update composers"
on public.composers for update
using (public.has_editor_write_access())
with check (public.has_editor_write_access());

create policy "Admins can delete composers"
on public.composers for delete
using (public.is_admin());

create policy "Published works are public"
on public.works for select
using (publication_status = 'published' or public.has_editorial_access());

create policy "Editors can insert works"
on public.works for insert
with check (public.has_editor_write_access());

create policy "Editors can update works"
on public.works for update
using (public.has_editor_write_access())
with check (public.has_editor_write_access());

create policy "Admins can delete works"
on public.works for delete
using (public.is_admin());

create policy "Instrument families are public"
on public.instrument_families for select
using (true);

create policy "Editors can manage instrument families"
on public.instrument_families for all
using (public.has_editor_write_access())
with check (public.has_editor_write_access());

create policy "Instruments are public"
on public.instruments for select
using (true);

create policy "Editors can manage instruments"
on public.instruments for all
using (public.has_editor_write_access())
with check (public.has_editor_write_access());

create policy "Catalog users can read instrumentation for published works"
on public.work_instrumentation for select
using (
  public.has_catalog_access()
  and exists (
    select 1 from public.works
    where works.id = work_instrumentation.work_id
      and (works.publication_status = 'published' or public.has_editorial_access())
  )
);

create policy "Editors can manage work instrumentation"
on public.work_instrumentation for all
using (public.has_editor_write_access())
with check (public.has_editor_write_access());

create policy "Catalog users can read movements for published works"
on public.movements for select
using (
  public.has_catalog_access()
  and exists (
    select 1 from public.works
    where works.id = movements.work_id
      and (works.publication_status = 'published' or public.has_editorial_access())
  )
);

create policy "Editors can manage movements"
on public.movements for all
using (public.has_editor_write_access())
with check (public.has_editor_write_access());

create policy "Catalog users can read voice requirements for published works"
on public.voice_requirements for select
using (
  public.has_catalog_access()
  and exists (
    select 1 from public.works
    where works.id = voice_requirements.work_id
      and (works.publication_status = 'published' or public.has_editorial_access())
  )
);

create policy "Editors can manage voice requirements"
on public.voice_requirements for all
using (public.has_editor_write_access())
with check (public.has_editor_write_access());

create policy "Catalog users can read active source holders"
on public.source_holders for select
using ((active and public.has_catalog_access()) or public.has_editorial_access());

create policy "Editors can manage source holders"
on public.source_holders for all
using (public.has_editor_write_access())
with check (public.has_editor_write_access());

create policy "Catalog users can read work sources"
on public.work_sources for select
using (
  public.has_catalog_access()
  and exists (
    select 1 from public.works
    where works.id = work_sources.work_id
      and (works.publication_status = 'published' or public.has_editorial_access())
  )
);

create policy "Editors can manage work sources"
on public.work_sources for all
using (public.has_editor_write_access())
with check (public.has_editor_write_access());

create policy "Catalog users can read manuscript sources"
on public.manuscript_sources for select
using (
  public.has_catalog_access()
  and exists (
    select 1 from public.works
    where works.id = manuscript_sources.work_id
      and (works.publication_status = 'published' or public.has_editorial_access())
  )
);

create policy "Editors can manage manuscript sources"
on public.manuscript_sources for all
using (public.has_editor_write_access())
with check (public.has_editor_write_access());

create policy "Catalog users can read bibliographic references"
on public.bibliographic_references for select
using (public.has_catalog_access() or public.has_editorial_access());

create policy "Editors can manage bibliographic references"
on public.bibliographic_references for all
using (public.has_editor_write_access())
with check (public.has_editor_write_access());

create policy "Catalog users can read work references"
on public.work_references for select
using (
  public.has_catalog_access()
  and exists (
    select 1 from public.works
    where works.id = work_references.work_id
      and (works.publication_status = 'published' or public.has_editorial_access())
  )
);

create policy "Editors can manage work references"
on public.work_references for all
using (public.has_editor_write_access())
with check (public.has_editor_write_access());

create policy "Catalog users can read composer references"
on public.composer_references for select
using (
  public.has_catalog_access()
  and exists (
    select 1 from public.composers
    where composers.id = composer_references.composer_id
      and (composers.publication_status = 'published' or public.has_editorial_access())
  )
);

create policy "Editors can manage composer references"
on public.composer_references for all
using (public.has_editor_write_access())
with check (public.has_editor_write_access());

create policy "Taxonomies are public"
on public.taxonomies for select
using (true);

create policy "Editors can manage taxonomies"
on public.taxonomies for all
using (public.has_editor_write_access())
with check (public.has_editor_write_access());

create policy "Public can read published work taxonomy links"
on public.work_taxonomies for select
using (
  exists (
    select 1 from public.works
    where works.id = work_taxonomies.work_id
      and (works.publication_status = 'published' or public.has_editorial_access())
  )
);

create policy "Editors can manage work taxonomy links"
on public.work_taxonomies for all
using (public.has_editor_write_access())
with check (public.has_editor_write_access());

create policy "Public can read published composer taxonomy links"
on public.composer_taxonomies for select
using (
  exists (
    select 1 from public.composers
    where composers.id = composer_taxonomies.composer_id
      and (composers.publication_status = 'published' or public.has_editorial_access())
  )
);

create policy "Editors can manage composer taxonomy links"
on public.composer_taxonomies for all
using (public.has_editor_write_access())
with check (public.has_editor_write_access());

create policy "Editorial users can read revision history"
on public.revision_history for select
using (public.has_editorial_access());

create policy "Editors can insert revision history"
on public.revision_history for insert
with check (public.has_editor_write_access());

create policy "Admins can manage audit logs"
on public.audit_logs for all
using (public.is_admin())
with check (public.is_admin());

create policy "Authenticated users can insert own audit events"
on public.audit_logs for insert
with check (actor_user_id = auth.uid());

create policy "Users can manage own saved searches"
on public.saved_searches for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Users can manage own favorites"
on public.favorites for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Users can manage own repertoire lists"
on public.repertoire_lists for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Users can manage own repertoire list items"
on public.repertoire_list_items for all
using (
  exists (
    select 1 from public.repertoire_lists
    where repertoire_lists.id = repertoire_list_items.list_id
      and repertoire_lists.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.repertoire_lists
    where repertoire_lists.id = repertoire_list_items.list_id
      and repertoire_lists.user_id = auth.uid()
  )
);

create policy "Editorial users can read import batches"
on public.import_batches for select
using (public.has_editorial_access());

create policy "Editors can manage import batches"
on public.import_batches for all
using (public.has_editor_write_access())
with check (public.has_editor_write_access());

create policy "Editorial users can read import rows"
on public.import_rows for select
using (public.has_editorial_access());

create policy "Editors can manage import rows"
on public.import_rows for all
using (public.has_editor_write_access())
with check (public.has_editor_write_access());

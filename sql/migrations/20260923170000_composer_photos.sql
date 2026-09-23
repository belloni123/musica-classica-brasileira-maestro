-- Composer portrait storage and editorial access.
alter table public.composers
  add column if not exists photo_path text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'composer-photos',
  'composer-photos',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do update
set name = excluded.name,
    public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Editorial users can upload composer photos" on storage.objects;
create policy "Editorial users can upload composer photos"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'composer-photos'
  and public.has_editor_write_access()
);

drop policy if exists "Editorial users can replace composer photos" on storage.objects;
create policy "Editorial users can replace composer photos"
on storage.objects for update
to authenticated
using (
  bucket_id = 'composer-photos'
  and public.has_editor_write_access()
)
with check (
  bucket_id = 'composer-photos'
  and public.has_editor_write_access()
);

drop policy if exists "Editorial users can inspect composer photos" on storage.objects;
create policy "Editorial users can inspect composer photos"
on storage.objects for select
to authenticated
using (
  bucket_id = 'composer-photos'
  and public.has_editorial_access()
);

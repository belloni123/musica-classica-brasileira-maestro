-- Execute depois de criar o usuario em Authentication > Users no Supabase.
-- A senha deve ser definida no painel do Supabase Auth, nao neste arquivo.

update public.profiles
set
  role = 'admin',
  status = 'active',
  full_name = coalesce(full_name, 'Felipe Belloni'),
  updated_at = now()
where email = 'felipe@agenciab16.com.br';

insert into public.profiles (id, email, full_name, role, status)
select
  users.id,
  users.email,
  coalesce(users.raw_user_meta_data ->> 'full_name', 'Felipe Belloni'),
  'admin',
  'active'
from auth.users users
where users.email = 'felipe@agenciab16.com.br'
on conflict (id) do update
set
  email = excluded.email,
  full_name = coalesce(public.profiles.full_name, excluded.full_name),
  role = 'admin',
  status = 'active',
  updated_at = now();

select id, email, full_name, role, status
from public.profiles
where email = 'felipe@agenciab16.com.br';

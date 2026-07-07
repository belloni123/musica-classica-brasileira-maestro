do $$
begin
  create type public.billing_interval as enum ('month', 'year', 'manual');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.subscription_status as enum (
    'trialing',
    'active',
    'past_due',
    'paused',
    'canceled',
    'expired',
    'manual'
  );
exception when duplicate_object then null;
end $$;

create table if not exists public.subscription_plans (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text,
  role_granted public.app_role not null,
  billing_interval public.billing_interval not null default 'manual',
  price_cents integer,
  currency text not null default 'BRL',
  external_provider text,
  external_price_id text,
  active boolean not null default true,
  metadata_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (price_cents is null or price_cents >= 0)
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id uuid references public.subscription_plans(id) on delete set null,
  status public.subscription_status not null default 'manual',
  source text not null default 'manual',
  external_provider text,
  external_customer_id text,
  external_subscription_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  trial_end timestamptz,
  cancel_at_period_end boolean not null default false,
  canceled_at timestamptz,
  metadata_json jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists idx_subscriptions_external_provider_id
on public.subscriptions(external_provider, external_subscription_id)
where external_provider is not null and external_subscription_id is not null;

create index if not exists idx_subscriptions_user on public.subscriptions(user_id);
create index if not exists idx_subscriptions_status on public.subscriptions(status);
create index if not exists idx_subscription_plans_active on public.subscription_plans(active);

drop trigger if exists set_subscription_plans_updated_at on public.subscription_plans;
create trigger set_subscription_plans_updated_at
before update on public.subscription_plans
for each row execute function public.set_updated_at();

drop trigger if exists set_subscriptions_updated_at on public.subscriptions;
create trigger set_subscriptions_updated_at
before update on public.subscriptions
for each row execute function public.set_updated_at();

alter table public.subscription_plans enable row level security;
alter table public.subscriptions enable row level security;

create policy "Active plans are public"
on public.subscription_plans for select
using (active or public.is_admin());

create policy "Admins can manage subscription plans"
on public.subscription_plans for all
using (public.is_admin())
with check (public.is_admin());

create policy "Users can read own subscriptions"
on public.subscriptions for select
using (user_id = auth.uid() or public.is_admin());

create policy "Admins can manage subscriptions"
on public.subscriptions for all
using (public.is_admin())
with check (public.is_admin());

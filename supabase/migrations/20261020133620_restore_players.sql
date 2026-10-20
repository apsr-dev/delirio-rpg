-- Restore only account identity after the historical schema cleanup.
create table public.players (
  id uuid primary key default gen_random_uuid(),
  telegram_user_id bigint not null unique check (telegram_user_id > 0),
  username text,
  first_name text not null,
  last_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.players enable row level security;

-- Accounts are accessed only by the bot server, never by public API roles.
-- Revoke inherited project defaults before granting the required operations.
revoke all on table public.players from public, anon, authenticated, service_role;
grant usage on schema public to service_role;
grant select, insert, update on table public.players to service_role;

create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  telegram_user_id bigint not null unique,
  username text,
  first_name text,
  last_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.characters (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players(id) on delete cascade,
  name text not null,
  level integer not null default 1,
  experience integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.coin_packages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  coins_amount integer not null check (coins_amount > 0),
  price_brl integer not null check (price_brl > 0),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.wallets (
  player_id uuid primary key references public.players(id) on delete cascade,
  balance integer not null default 0 check (balance >= 0),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players(id) on delete cascade,
  coin_package_id uuid references public.coin_packages(id),
  coins_amount integer not null check (coins_amount > 0),
  amount_brl integer not null check (amount_brl > 0),
  provider text not null,
  provider_payment_id text unique,
  status text not null default 'pending' check (status in ('pending', 'paid', 'expired', 'canceled', 'refunded')),
  payment_url text,
  pix_code text,
  created_at timestamptz not null default now(),
  paid_at timestamptz,
  fulfilled_at timestamptz
);

create table if not exists public.wallet_ledger (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players(id) on delete cascade,
  order_id uuid unique references public.orders(id),
  type text not null check (type in ('purchase', 'spend', 'refund', 'admin_adjustment')),
  amount integer not null,
  created_at timestamptz not null default now()
);

create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  provider_event_id text not null,
  provider_payment_id text,
  event_type text not null,
  payload jsonb not null,
  received_at timestamptz not null default now(),
  unique (provider, provider_event_id)
);

alter table public.players enable row level security;
alter table public.characters enable row level security;
alter table public.coin_packages enable row level security;
alter table public.wallets enable row level security;
alter table public.orders enable row level security;
alter table public.wallet_ledger enable row level security;
alter table public.payment_events enable row level security;

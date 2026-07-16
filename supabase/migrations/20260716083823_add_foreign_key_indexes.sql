create index if not exists characters_player_id_idx
  on public.characters(player_id);

create index if not exists orders_player_id_idx
  on public.orders(player_id);

create index if not exists orders_coin_package_id_idx
  on public.orders(coin_package_id);

create index if not exists wallet_ledger_player_id_idx
  on public.wallet_ledger(player_id);

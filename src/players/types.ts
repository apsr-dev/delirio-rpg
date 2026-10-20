export type TelegramProfile = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
};

export type Player = {
  id: string;
  telegram_user_id: number;
  username: string | null;
  first_name: string;
  last_name: string | null;
  created_at: string;
  updated_at: string;
};

export type PlayerService = {
  ensurePlayer(profile: TelegramProfile): Promise<Player>;
};

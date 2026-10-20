import type { Player } from "../players/types.js";

// Schema owned by this application; keep in sync with the players migration.
export type Database = {
  public: {
    Tables: {
      players: {
        Row: Player;
        Insert: Pick<Player, "telegram_user_id" | "first_name"> &
          Partial<Omit<Player, "telegram_user_id" | "first_name">>;
        Update: Partial<Player>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
  };
};

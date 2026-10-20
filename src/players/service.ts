import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../lib/database.types.js";
import type { PlayerService } from "./types.js";

export function createPlayerService(client: SupabaseClient<Database>): PlayerService {
  return {
    async ensurePlayer(profile) {
      const { data, error } = await client
        .from("players")
        .upsert(
          {
            telegram_user_id: profile.id,
            username: profile.username ?? null,
            first_name: profile.first_name,
            last_name: profile.last_name ?? null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "telegram_user_id" },
        )
        .select("id, telegram_user_id, username, first_name, last_name, created_at, updated_at")
        .abortSignal(AbortSignal.timeout(5_000))
        .single();

      if (error || !data) {
        throw new Error("Player persistence failed", { cause: error });
      }

      return data;
    },
  };
}

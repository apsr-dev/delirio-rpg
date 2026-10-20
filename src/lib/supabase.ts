import { createClient } from "@supabase/supabase-js";
import { requireEnv } from "./env.js";
import type { Database } from "./database.types.js";

export const supabase = createClient<Database>(
  requireEnv("SUPABASE_URL"),
  requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  },
);

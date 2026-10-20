import { PGlite } from "@electric-sql/pglite";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { readdir } from "node:fs/promises";
import type { Database } from "../../src/lib/database.types.js";
import type { Player } from "../../src/players/types.js";

export async function createTestDatabase() {
  const db = new PGlite();
  await db.exec(`
    create role anon;
    create role authenticated;
    create role service_role bypassrls;
    grant usage on schema public to anon, authenticated, service_role;
    alter default privileges in schema public grant all on tables
      to anon, authenticated, service_role;
  `);
  const directory = new URL("../../supabase/migrations/", import.meta.url);
  const migrations = (await readdir(directory)).filter((name) => name.endsWith(".sql")).sort();
  for (const name of migrations) {
    await db.exec(await Bun.file(new URL(name, directory)).text());
  }
  return db;
}

// Controlled Data API boundary: the production Supabase client still builds
// the HTTP request; actual PostgreSQL executes its account upsert in tests.
export function createTestClient(db: PGlite): SupabaseClient<Database> {
  return createClient<Database>("https://database.test", "test-service-key", {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: Object.assign(async (input: Parameters<typeof fetch>[0], init?: Parameters<typeof fetch>[1]) => {
        const request = new Request(input, init);
        const url = new URL(request.url);
        if (
          url.pathname !== "/rest/v1/players" ||
          url.searchParams.get("on_conflict") !== "telegram_user_id" ||
          !url.searchParams.get("select") ||
          request.method !== "POST" ||
          !request.headers.get("prefer")?.includes("resolution=merge-duplicates") ||
          request.headers.get("authorization") !== "Bearer test-service-key"
        ) {
          throw new Error("Unexpected Data API request");
        }
        const row = await request.json() as Database["public"]["Tables"]["players"]["Insert"];
        try {
          const player = await db.transaction(async (tx) => {
            await tx.exec("set local role service_role");
            const result = await tx.query<Player>(`
              insert into public.players
                (telegram_user_id, username, first_name, last_name, updated_at)
              values ($1, $2, $3, $4, $5)
              on conflict (telegram_user_id) do update set
                username = excluded.username,
                first_name = excluded.first_name,
                last_name = excluded.last_name,
                updated_at = excluded.updated_at
              returning *
            `, [row.telegram_user_id, row.username, row.first_name, row.last_name, row.updated_at]);
            return result.rows[0];
          });
          return Response.json(player);
        } catch {
          return Response.json({ code: "42501", message: "Database request failed" }, { status: 400 });
        }
      }, { preconnect: fetch.preconnect }),
    },
  });
}

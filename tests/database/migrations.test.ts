import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import type { PGlite } from "@electric-sql/pglite";
import { createTestDatabase } from "../helpers/database.js";

describe("player schema migration", () => {
  let db: PGlite;
  beforeAll(async () => { db = await createTestDatabase(); }, 30000);
  afterAll(async () => { await db?.close(); });

  test("replays the complete history and restores only players", async () => {
    const result = await db.query<{ tablename: string }>(
      "select tablename from pg_tables where schemaname = 'public' order by tablename",
    );
    expect(result.rows).toEqual([{ tablename: "players" }]);
  });

  test("enables RLS and grants only required server privileges", async () => {
    const result = await db.query<{ relrowsecurity: boolean }>(
      "select relrowsecurity from pg_class where oid = 'public.players'::regclass",
    );
    expect(result.rows[0]?.relrowsecurity).toBe(true);
    for (const role of ["anon", "authenticated", "service_role"]) {
      for (const privilege of ["SELECT", "INSERT", "UPDATE", "DELETE", "TRUNCATE"]) {
        const access = await db.query<{ allowed: boolean }>(
          "select has_table_privilege($1, 'public.players', $2) as allowed", [role, privilege],
        );
        expect(access.rows[0]?.allowed).toBe(
          role === "service_role" && ["SELECT", "INSERT", "UPDATE"].includes(privilege),
        );
      }
    }
  });

  test("public API roles cannot read or create accounts", async () => {
    for (const role of ["anon", "authenticated"]) {
      await db.exec(`set role ${role}`);
      try {
        await expect(db.query("select * from public.players")).rejects.toThrow("permission denied");
        await expect(db.query(
          "insert into public.players (telegram_user_id, first_name) values (1, 'Ana')",
        )).rejects.toThrow("permission denied");
      } finally {
        await db.exec("reset role");
      }
    }
  });

  test("the database itself enforces unique Telegram identity", async () => {
    await db.query("insert into players (telegram_user_id, first_name) values (42, 'Ana')");
    await expect(db.query(
      "insert into players (telegram_user_id, first_name) values (42, 'Outra')",
    )).rejects.toThrow("duplicate key");
  });
});

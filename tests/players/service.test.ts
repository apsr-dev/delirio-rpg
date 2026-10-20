import { afterAll, beforeAll, beforeEach, describe, expect, test } from "bun:test";
import type { PGlite } from "@electric-sql/pglite";
import { createPlayerService } from "../../src/players/service.js";
import { createTestClient, createTestDatabase } from "../helpers/database.js";
import { telegramUser } from "../helpers/telegram.js";

describe("persistent player accounts", () => {
  let db: PGlite;
  beforeAll(async () => { db = await createTestDatabase(); }, 30000);
  afterAll(async () => { await db?.close(); });
  beforeEach(async () => { await db.exec("truncate public.players"); });

  test("creates an account and reloads the same identity in a fresh service", async () => {
    const first = await createPlayerService(createTestClient(db)).ensurePlayer(telegramUser);
    const returning = await createPlayerService(createTestClient(db)).ensurePlayer(telegramUser);
    expect(first.id).toBeString();
    expect(first.telegram_user_id).toBe(telegramUser.id);
    expect(returning.id).toBe(first.id);
    expect(returning.created_at).toEqual(first.created_at);
    expect((await db.query("select * from players")).rows).toHaveLength(1);
  });

  test("concurrent first visits produce a single account", async () => {
    const service = createPlayerService(createTestClient(db));
    const players = await Promise.all(
      Array.from({ length: 8 }, () => service.ensurePlayer(telegramUser)),
    );
    expect(new Set(players.map((player) => player.id)).size).toBe(1);
    expect((await db.query("select * from players")).rows).toHaveLength(1);
  });

  test("refreshes Telegram fields, clears removed optional fields and preserves creation", async () => {
    const service = createPlayerService(createTestClient(db));
    const first = await service.ensurePlayer(telegramUser);
    const updated = await service.ensurePlayer({ id: telegramUser.id, first_name: "Anabela" });
    expect(updated.id).toBe(first.id);
    expect(updated.created_at).toEqual(first.created_at);
    expect(updated.first_name).toBe("Anabela");
    expect(updated.username).toBeNull();
    expect(updated.last_name).toBeNull();
  });

  test("keeps separate identities even when names and usernames match", async () => {
    const service = createPlayerService(createTestClient(db));
    const first = await service.ensurePlayer(telegramUser);
    const other = await service.ensurePlayer({ ...telegramUser, id: 654321 });
    expect(other.id).not.toBe(first.id);
    expect((await db.query("select * from players")).rows).toHaveLength(2);
  });

  test("rejects a failed database write", async () => {
    const service = createPlayerService(createTestClient(db));
    await db.exec("revoke insert on players from service_role");
    try {
      await expect(service.ensurePlayer(telegramUser)).rejects.toThrow("Player persistence failed");
      expect((await db.query("select * from players")).rows).toHaveLength(0);
    } finally {
      await db.exec("grant insert on players to service_role");
    }
  });
});

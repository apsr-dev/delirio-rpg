import { afterAll, beforeAll, beforeEach, describe, expect, spyOn, test } from "bun:test";
import type { PGlite } from "@electric-sql/pglite";
import { createPlayerService } from "../../src/players/service.js";
import type { PlayerService } from "../../src/players/types.js";
import { createTestClient, createTestDatabase } from "../helpers/database.js";
import { callbackUpdate, createTestBot, messageUpdate, telegramUser } from "../helpers/telegram.js";

describe("Telegram onboarding", () => {
  let db: PGlite;
  let players: PlayerService;
  beforeAll(async () => { db = await createTestDatabase(); }, 30000);
  afterAll(async () => { await db?.close(); });
  beforeEach(async () => {
    await db.exec("truncate players");
    players = createPlayerService(createTestClient(db));
  });

  test("/start persists the account before showing only available menu actions", async () => {
    const { bot, replies } = createTestBot(players);
    await bot.handleUpdate(messageUpdate("/start"));
    expect((await db.query("select * from players")).rows).toHaveLength(1);
    expect(replies()).toHaveLength(1);
    expect(replies()[0]?.text).toContain("Seu cadastro está salvo");
    expect(replies()[0]?.reply_markup).toEqual({
      inline_keyboard: [[
        { text: "Meu perfil", callback_data: "onboarding:profile" },
        { text: "Ajuda", callback_data: "onboarding:help" },
      ], [
        { text: "Povos de Oniri", callback_data: "peoples:list" },
        { text: "Essências", callback_data: "essences:list" },
      ]],
    });
  });

  test("/perfil registers a first visit and displays its stored name and date", async () => {
    const { bot, replies } = createTestBot(players);
    await bot.handleUpdate(messageUpdate("/perfil"));
    expect(replies()[0]?.text).toContain("Nome no Telegram: Ana Silva");
    expect(replies()[0]?.text).toContain("Usuário: @ana");
    expect(replies()[0]?.text).toMatch(/Cadastro: \d{2}\/\d{2}\/\d{4} \(UTC\)/);
    expect((await db.query("select * from players")).rows).toHaveLength(1);
  });

  test("a menu from an earlier invocation loads the clicking user's profile", async () => {
    await createTestBot(players).bot.handleUpdate(messageUpdate("/start"));
    const other = { ...telegramUser, id: 987654, first_name: "<b>Bia</b>", username: "bia" };
    const fresh = createTestBot(createPlayerService(createTestClient(db)));
    await fresh.bot.handleUpdate(callbackUpdate("onboarding:profile", other));
    expect(fresh.calls[0]?.method).toBe("answerCallbackQuery");
    expect(fresh.replies()[0]?.text).toContain("<b>Bia</b>");
    expect(fresh.replies()[0]?.text).not.toContain("@ana");
    expect(fresh.replies()[0]?.chat_id).toBe(other.id);
    expect(fresh.replies()[0]?.parse_mode).toBeUndefined();
  });

  test("profiles without optional Telegram fields display a useful fallback", async () => {
    const { bot, replies } = createTestBot(players);
    await bot.handleUpdate(messageUpdate("/perfil", {
      id: telegramUser.id, is_bot: false, first_name: "Ana",
    }));
    expect(replies()[0]?.text).toContain("Nome no Telegram: Ana\n");
    expect(replies()[0]?.text).toContain("Usuário: não informado");
    expect(replies()[0]?.text).not.toMatch(/undefined|null/);
  });

  test("commands cannot select somebody else's account", async () => {
    await players.ensurePlayer({ ...telegramUser, id: 987654, first_name: "Bia" });
    const { bot, replies } = createTestBot(players);
    await bot.handleUpdate(messageUpdate("/perfil 987654"));
    expect(replies()[0]?.text).toContain("Ana Silva");
    expect(replies()[0]?.text).not.toContain("Bia");
  });

  test("help works by command and button without database access", async () => {
    const unavailable: PlayerService = { ensurePlayer: async () => { throw new Error("offline"); } };
    const { bot, replies, calls } = createTestBot(unavailable);
    await bot.handleUpdate(messageUpdate("/ajuda"));
    await bot.handleUpdate(callbackUpdate("onboarding:help"));
    expect(replies()).toHaveLength(2);
    for (const reply of replies()) {
      expect(reply.text).toContain("/start");
      expect(reply.text).toContain("/perfil");
      expect(reply.text).toContain("/ajuda");
      expect(reply.text).toContain("/povos");
      expect(reply.text).toContain("/essencias");
      expect(reply.text).not.toMatch(/rolar|ficha|loja/);
    }
    expect(calls.some((call) => call.method === "answerCallbackQuery")).toBe(true);
  });

  test("database errors give a retry instruction and never a success menu", async () => {
    const log = spyOn(console, "error").mockImplementation(() => {});
    const unavailable: PlayerService = { ensurePlayer: async () => { throw new Error("secret details"); } };
    try {
      const { bot, replies } = createTestBot(unavailable);
      await bot.handleUpdate(messageUpdate("/start"));
      await bot.handleUpdate(callbackUpdate("onboarding:profile"));
      expect(replies()).toHaveLength(2);
      for (const reply of replies()) {
        expect(reply.text).toContain("Tente novamente");
        expect(reply.text).not.toMatch(/cadastro está salvo|secret details/);
        expect(reply.reply_markup).toBeUndefined();
      }
      expect(log).toHaveBeenCalledWith("Player persistence failed");
    } finally {
      log.mockRestore();
    }
  });

  test("the same command succeeds after a transient database failure", async () => {
    let failed = false;
    const intermittent: PlayerService = {
      async ensurePlayer(profile) {
        if (!failed) { failed = true; throw new Error("offline"); }
        return players.ensurePlayer(profile);
      },
    };
    const log = spyOn(console, "error").mockImplementation(() => {});
    try {
      const { bot, replies } = createTestBot(intermittent);
      await bot.handleUpdate(messageUpdate("/start"));
      await bot.handleUpdate(messageUpdate("/start"));
      expect(replies()[0]?.text).toContain("Tente novamente");
      expect(replies()[1]?.text).toContain("cadastro está salvo");
      expect((await db.query("select * from players")).rows).toHaveLength(1);
    } finally { log.mockRestore(); }
  });

  test("group commands and callbacks never save or disclose a profile", async () => {
    const { bot, replies } = createTestBot(players);
    for (const command of ["/start", "/perfil", "/ajuda"]) {
      await bot.handleUpdate(messageUpdate(command, telegramUser, true));
    }
    for (const action of ["onboarding:profile", "onboarding:help"]) {
      await bot.handleUpdate(callbackUpdate(action, telegramUser, true));
    }
    expect(replies()).toHaveLength(5);
    expect(replies().every((reply) => String(reply.text).includes("privado"))).toBe(true);
    expect((await db.query("select * from players")).rows).toHaveLength(0);
  });

  test("removed commands and old dice callbacks have no handlers", async () => {
    const { bot, calls } = createTestBot(players);
    for (const command of ["/rolar", "/ficha", "/loja"]) {
      await bot.handleUpdate(messageUpdate(command));
    }
    await bot.handleUpdate(callbackUpdate("rolar"));
    expect(calls).toHaveLength(0);
    expect((await db.query("select * from players")).rows).toHaveLength(0);
  });
});

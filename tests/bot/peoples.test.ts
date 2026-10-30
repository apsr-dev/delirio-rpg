import { describe, expect, mock, test } from "bun:test";
import { PEOPLES } from "../../src/game/peoples.js";
import { callbackUpdate, createTestBot, messageUpdate, telegramUser } from "../helpers/telegram.js";

function setup() {
  const ensurePlayer = mock(async () => { throw new Error("Database is offline"); });
  return { ...createTestBot({ ensurePlayer }), ensurePlayer };
}

const EXPECTED_LIST = [
  [{ text: "Aetheri", callback_data: "peoples:detail:aetheri" }],
  [{ text: "Shaqyr", callback_data: "peoples:detail:shaqyr" }],
  [{ text: "Uklith", callback_data: "peoples:detail:uklith" }],
  [{ text: "Vahr’Uk", callback_data: "peoples:detail:vahr-uk" }],
  [{ text: "Humano", callback_data: "peoples:detail:humano" }],
  [{ text: "Menu inicial", callback_data: "peoples:menu" }],
];

const EXPECTED_BACK = {
  inline_keyboard: [
    [{ text: "Voltar aos povos", callback_data: "peoples:list" }],
    [{ text: "Menu inicial", callback_data: "peoples:menu" }],
  ],
};

describe("Telegram peoples guide", () => {
  test("first visit by /povos works without registration or database access", async () => {
    const { bot, replies, ensurePlayer } = setup();
    await bot.handleUpdate(messageUpdate("/povos"));
    expect(replies()).toHaveLength(1);
    expect(replies()[0]?.text).toContain("Povos de Oniri");
    expect(replies()[0]?.reply_markup).toEqual({ inline_keyboard: EXPECTED_LIST });
    expect(replies()[0]?.text).not.toContain("+1");
    expect(ensurePlayer).not.toHaveBeenCalled();
  });

  test("the initial-menu button opens the same list and is acknowledged", async () => {
    const { bot, replies, calls, ensurePlayer } = setup();
    await bot.handleUpdate(callbackUpdate("peoples:list"));
    expect(calls[0]?.method).toBe("answerCallbackQuery");
    expect(replies()[0]?.reply_markup).toEqual({ inline_keyboard: EXPECTED_LIST });
    expect(ensurePlayer).not.toHaveBeenCalled();
  });

  test.each(PEOPLES)("$name displays its full content with working back buttons", async (people) => {
    const { bot, replies, calls, ensurePlayer } = setup();
    await bot.handleUpdate(callbackUpdate(`peoples:detail:${people.id}`));
    const reply = replies()[0]!;
    expect(calls[0]?.method).toBe("answerCallbackQuery");
    expect(reply.text).toContain(people.name);
    expect(reply.text).toContain(people.history);
    expect(reply.text).toContain(`Poder: ${people.power.name}`);
    expect(reply.text).toContain(people.power.description);
    const expectedEnergies: Record<string, string> = {
      aetheri: "+1 Mente e +1 Espírito",
      shaqyr: "+1 Corpo e +1 Espírito",
      uklith: "+1 Corpo e +1 Mente",
      "vahr-uk": "+1 Corpo e +1 Espírito",
      humano: "+1 Corpo e +1 Mente",
    };
    expect(reply.text).toContain(`Energias: ${expectedEnergies[people.id]}`);
    expect(reply.reply_markup).toEqual(EXPECTED_BACK);
    expect(reply.parse_mode).toBeUndefined();
    expect(String(reply.text).length).toBeLessThanOrEqual(4096);
    expect(ensurePlayer).not.toHaveBeenCalled();
  });

  test("list, details, another people, and main menu all work after new invocations", async () => {
    const command = setup();
    await command.bot.handleUpdate(messageUpdate("/povos"));
    const first = setup();
    await first.bot.handleUpdate(callbackUpdate("peoples:detail:aetheri"));
    expect(first.replies()[0]?.text).toContain("Vontade de Oniri");
    const back = setup();
    await back.bot.handleUpdate(callbackUpdate("peoples:list"));
    expect(back.replies()[0]?.reply_markup).toEqual({ inline_keyboard: EXPECTED_LIST });
    const second = setup();
    await second.bot.handleUpdate(callbackUpdate("peoples:detail:humano"));
    expect(second.replies()[0]?.text).toContain("Espírito dos Curiosos");
    const menu = setup();
    await menu.bot.handleUpdate(callbackUpdate("peoples:menu"));
    expect(menu.replies()[0]?.text).toContain("Menu inicial");
    expect(menu.replies()[0]?.text).not.toMatch(/cadastro|salvo/);
    expect(menu.replies()[0]?.reply_markup).toEqual({
      inline_keyboard: [
        [
          { text: "Meu perfil", callback_data: "onboarding:profile" },
          { text: "Ajuda", callback_data: "onboarding:help" },
        ],
        [
          { text: "Povos de Oniri", callback_data: "peoples:list" },
          { text: "Essências", callback_data: "essences:list" },
        ],
        [{ text: "Prismas", callback_data: "prisms:list" }, { text: "Trilhas", callback_data: "trails:list" }],
      ],
    });
    for (const instance of [command, first, back, second, menu]) {
      expect(instance.ensurePlayer).not.toHaveBeenCalled();
    }
  });

  test.each([
    "peoples:detail:missing", "peoples:detail:", "peoples:detail:__proto__",
    "peoples:detail:constructor", "peoples:detail:aetheri:invalid",
    "peoples:old:list", "peoples:invalid",
  ])("unknown or obsolete action %s is acknowledged and offers recovery", async (action) => {
    const { bot, calls, replies, ensurePlayer } = setup();
    await bot.handleUpdate(callbackUpdate(action));
    expect(calls[0]?.method).toBe("answerCallbackQuery");
    expect(replies()[0]?.text).toContain("/povos");
    expect(replies()[0]?.text).toContain("não está disponível");
    expect(replies()[0]?.reply_markup).toEqual(EXPECTED_BACK);
    expect(ensurePlayer).not.toHaveBeenCalled();
  });

  test("group commands and every guide action direct users to the private chat", async () => {
    const { bot, replies, calls, ensurePlayer } = setup();
    await bot.handleUpdate(messageUpdate("/povos", telegramUser, true));
    const actions = ["peoples:list", "peoples:detail:aetheri", "peoples:menu", "peoples:old"];
    for (const action of actions) {
      await bot.handleUpdate(callbackUpdate(action, telegramUser, true));
    }
    expect(replies()).toHaveLength(5);
    for (const reply of replies()) {
      expect(reply.text).toContain("privado");
      expect(reply.text).toContain("/povos");
      expect(reply.reply_markup).toBeUndefined();
      expect(reply.text).not.toContain("Vontade de Oniri");
    }
    expect(calls.filter((call) => call.method === "answerCallbackQuery")).toHaveLength(4);
    expect(ensurePlayer).not.toHaveBeenCalled();
  });

  test("inline callbacks without a chat are acknowledged without sending a message", async () => {
    const { bot, calls, ensurePlayer } = setup();
    await bot.handleUpdate({
      update_id: 3,
      callback_query: {
        id: "inline-query", from: telegramUser, chat_instance: "inline-chat",
        inline_message_id: "old-inline-message", data: "peoples:list",
      },
    });
    expect(calls.map((call) => call.method)).toEqual(["answerCallbackQuery"]);
    expect(ensurePlayer).not.toHaveBeenCalled();
  });
});

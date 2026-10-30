import { describe, expect, mock, test } from "bun:test";
import { PRISMS, PRISM_CREATION_NOTES } from "../../src/game/prisms.js";
import { callbackUpdate, createTestBot, messageUpdate, telegramUser } from "../helpers/telegram.js";

function setup() {
  const ensurePlayer = mock(async () => { throw new Error("Database is offline"); });
  return { ...createTestBot({ ensurePlayer }), ensurePlayer };
}

const EXPECTED_LIST = [
  [{ text: "Feiticeiro", callback_data: "prisms:detail:feiticeiro" }],
  [{ text: "Ocultista", callback_data: "prisms:detail:ocultista" }],
  [{ text: "Devoto", callback_data: "prisms:detail:devoto" }],
  [{ text: "Ver Essências", callback_data: "essences:list" }],
  [{ text: "Menu inicial", callback_data: "prisms:menu" }],
];

const EXPECTED_BACK = {
  inline_keyboard: [
    [{ text: "Voltar aos Prismas", callback_data: "prisms:list" }],
    [{ text: "Ver Essências", callback_data: "essences:list" }],
    [{ text: "Menu inicial", callback_data: "prisms:menu" }],
  ],
};

describe("Telegram Prisms guide", () => {
  test("/prismas explains linked Energy and lists all three without registration", async () => {
    const { bot, replies, ensurePlayer } = setup();
    await bot.handleUpdate(messageUpdate("/prismas"));
    expect(replies()).toHaveLength(1);
    expect(replies()[0]?.text).toContain("O Prisma define como seu personagem acessa os Poderes");
    expect(replies()[0]?.text).toContain("Energia Vinculada");
    expect(replies()[0]?.text).toContain("Chance de Acerto, o Dano e a Cura dos Poderes das Escolas de Poder");
    expect(replies()[0]?.reply_markup).toEqual({ inline_keyboard: EXPECTED_LIST });
    expect(String(replies()[0]?.text).length).toBeLessThanOrEqual(4096);
    expect(ensurePlayer).not.toHaveBeenCalled();
  });

  test("the menu button acknowledges the callback and opens the same list", async () => {
    const { bot, replies, calls, ensurePlayer } = setup();
    await bot.handleUpdate(callbackUpdate("prisms:list"));
    expect(calls[0]?.method).toBe("answerCallbackQuery");
    expect(replies()[0]?.reply_markup).toEqual({ inline_keyboard: EXPECTED_LIST });
    expect(ensurePlayer).not.toHaveBeenCalled();
  });

  test.each(PRISMS)("$name displays the complete description, benefits, and creation notes", async (prism) => {
    const { bot, replies, calls, ensurePlayer } = setup();
    await bot.handleUpdate(callbackUpdate(`prisms:detail:${prism.id}`));
    const reply = replies()[0]!;
    expect(calls[0]?.method).toBe("answerCallbackQuery");
    expect(reply.text).toContain(prism.name);
    expect(reply.text).toContain(prism.description);
    expect(reply.text).toContain(`Energia Vinculada: ${prism.linkedEnergy}`);
    for (const benefit of prism.benefits) {
      expect(reply.text).toContain(`${benefit.name}: ${benefit.description}`);
    }
    expect(reply.text).toContain(PRISM_CREATION_NOTES);
    expect(reply.reply_markup).toEqual(EXPECTED_BACK);
    expect(reply.parse_mode).toBeUndefined();
    expect(String(reply.text).length).toBeLessThanOrEqual(4096);
    expect(ensurePlayer).not.toHaveBeenCalled();
  });

  test("older buttons navigate across instances, Essences, and the initial menu", async () => {
    const first = setup();
    await first.bot.handleUpdate(messageUpdate("/prismas"));
    const detail = setup();
    await detail.bot.handleUpdate(callbackUpdate("prisms:detail:feiticeiro"));
    expect(detail.replies()[0]?.text).toContain("Sangue Mágico");
    const back = setup();
    await back.bot.handleUpdate(callbackUpdate("prisms:list"));
    expect(back.replies()[0]?.reply_markup).toEqual({ inline_keyboard: EXPECTED_LIST });
    const other = setup();
    await other.bot.handleUpdate(callbackUpdate("prisms:detail:devoto"));
    expect(other.replies()[0]?.text).toContain("40%");
    const essences = setup();
    await essences.bot.handleUpdate(callbackUpdate("essences:list"));
    expect(essences.calls[0]?.method).toBe("answerCallbackQuery");
    expect(essences.replies()[0]?.text).toContain("Como funciona o Eco");
    const menu = setup();
    await menu.bot.handleUpdate(callbackUpdate("prisms:menu"));
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
        [{ text: "Prismas", callback_data: "prisms:list" }],
      ],
    });
    for (const instance of [first, detail, back, other, essences, menu]) {
      expect(instance.ensurePlayer).not.toHaveBeenCalled();
    }
  });

  test.each([
    "prisms:detail:missing", "prisms:detail:", "prisms:detail:__proto__",
    "prisms:detail:constructor", "prisms:detail:devoto:invalid",
    "prisms:old:list", "prisms:invalid",
  ])("invalid or obsolete callback %s offers acknowledged recovery", async (action) => {
    const { bot, calls, replies, ensurePlayer } = setup();
    await bot.handleUpdate(callbackUpdate(action));
    expect(calls[0]?.method).toBe("answerCallbackQuery");
    expect(replies()[0]?.text).toContain("/prismas");
    expect(replies()[0]?.text).toContain("não está disponível");
    expect(replies()[0]?.reply_markup).toEqual(EXPECTED_BACK);
    expect(ensurePlayer).not.toHaveBeenCalled();
  });

  test("group commands and callbacks offer private-chat instructions only", async () => {
    const { bot, replies, calls, ensurePlayer } = setup();
    await bot.handleUpdate(messageUpdate("/prismas", telegramUser, true));
    for (const action of ["prisms:list", "prisms:detail:feiticeiro", "prisms:menu", "prisms:old"]) {
      await bot.handleUpdate(callbackUpdate(action, telegramUser, true));
    }
    expect(replies()).toHaveLength(5);
    for (const reply of replies()) {
      expect(reply.text).toContain("privado");
      expect(reply.text).toContain("/prismas");
      expect(reply.text).not.toContain("Sangue Mágico");
      expect(reply.reply_markup).toBeUndefined();
    }
    expect(calls.filter((call) => call.method === "answerCallbackQuery")).toHaveLength(4);
    expect(ensurePlayer).not.toHaveBeenCalled();
  });

  test("callbacks without a chat are acknowledged without sending messages", async () => {
    const { bot, calls, ensurePlayer } = setup();
    await bot.handleUpdate({
      update_id: 3,
      callback_query: {
        id: "inline-query", from: telegramUser, chat_instance: "inline-chat",
        inline_message_id: "old-inline-message", data: "prisms:list",
      },
    });
    expect(calls.map((call) => call.method)).toEqual(["answerCallbackQuery"]);
    expect(ensurePlayer).not.toHaveBeenCalled();
  });
});

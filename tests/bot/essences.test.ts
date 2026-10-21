import { describe, expect, mock, test } from "bun:test";
import { ESSENCES, ECHO_RULES_TEXT } from "../../src/game/essences.js";
import { callbackUpdate, createTestBot, messageUpdate, telegramUser } from "../helpers/telegram.js";

function setup() {
  const ensurePlayer = mock(async () => { throw new Error("Database is offline"); });
  return { ...createTestBot({ ensurePlayer }), ensurePlayer };
}

const EXPECTED_LIST = [
  [{ text: "Êxtase", callback_data: "essences:detail:extase" }],
  [{ text: "Melancolia", callback_data: "essences:detail:melancolia" }],
  [{ text: "Serenidade", callback_data: "essences:detail:serenidade" }],
  [{ text: "Cólera", callback_data: "essences:detail:colera" }],
  [{ text: "Confiança", callback_data: "essences:detail:confianca" }],
  [{ text: "Dissimulação", callback_data: "essences:detail:dissimulacao" }],
  [{ text: "Altruísmo", callback_data: "essences:detail:altruismo" }],
  [{ text: "Egoísmo", callback_data: "essences:detail:egoismo" }],
  [{ text: "Menu inicial", callback_data: "essences:menu" }],
];

const EXPECTED_BACK = {
  inline_keyboard: [
    [{ text: "Voltar às Essências", callback_data: "essences:list" }],
    [{ text: "Menu inicial", callback_data: "essences:menu" }],
  ],
};

describe("Telegram Essences guide", () => {
  test("/essencias introduces the rules and all eight options without registration", async () => {
    const { bot, replies, ensurePlayer } = setup();
    await bot.handleUpdate(messageUpdate("/essencias"));
    expect(replies()).toHaveLength(1);
    expect(replies()[0]?.text).toContain("Essências");
    expect(replies()[0]?.text).toContain(ECHO_RULES_TEXT);
    expect(replies()[0]?.reply_markup).toEqual({ inline_keyboard: EXPECTED_LIST });
    expect(String(replies()[0]?.text).length).toBeLessThanOrEqual(4096);
    expect(ensurePlayer).not.toHaveBeenCalled();
  });

  test("the menu button acknowledges the callback and shows the same introduction", async () => {
    const { bot, replies, calls, ensurePlayer } = setup();
    await bot.handleUpdate(callbackUpdate("essences:list"));
    expect(calls[0]?.method).toBe("answerCallbackQuery");
    expect(replies()[0]?.text).toContain(ECHO_RULES_TEXT);
    expect(replies()[0]?.reply_markup).toEqual({ inline_keyboard: EXPECTED_LIST });
    expect(ensurePlayer).not.toHaveBeenCalled();
  });

  test.each(ESSENCES)("$name displays every field and full Echo effect", async (essence) => {
    const { bot, replies, calls, ensurePlayer } = setup();
    await bot.handleUpdate(callbackUpdate(`essences:detail:${essence.id}`));
    const reply = replies()[0]!;
    expect(calls[0]?.method).toBe("answerCallbackQuery");
    expect(reply.text).toContain(essence.name);
    expect(reply.text).toContain(essence.description);
    expect(reply.text).toContain(`Origem da Essência: ${essence.origin}`);
    expect(reply.text).toContain(`Elemento principal: ${essence.primaryElement}`);
    expect(reply.text).toContain(`Elementos secundários: ${essence.secondaryElements.join(", ")}`);
    expect(reply.text).toContain(`Eco: ${essence.echo.name}`);
    expect(reply.text).toContain(essence.echo.description);
    expect(reply.reply_markup).toEqual(EXPECTED_BACK);
    expect(reply.parse_mode).toBeUndefined();
    expect(String(reply.text).length).toBeLessThanOrEqual(4096);
    expect(ensurePlayer).not.toHaveBeenCalled();
  });

  test("old buttons navigate between details, list, menu, and Peoples across new instances", async () => {
    const first = setup();
    await first.bot.handleUpdate(messageUpdate("/essencias"));
    const detail = setup();
    await detail.bot.handleUpdate(callbackUpdate("essences:detail:extase"));
    expect(detail.replies()[0]?.text).toContain("Corrente de Inspiração");
    const list = setup();
    await list.bot.handleUpdate(callbackUpdate("essences:list"));
    expect(list.replies()[0]?.reply_markup).toEqual({ inline_keyboard: EXPECTED_LIST });
    const other = setup();
    await other.bot.handleUpdate(callbackUpdate("essences:detail:egoismo"));
    expect(other.replies()[0]?.text).toContain("Escudo de Carne");
    const menu = setup();
    await menu.bot.handleUpdate(callbackUpdate("essences:menu"));
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
      ],
    });
    const peoples = setup();
    await peoples.bot.handleUpdate(callbackUpdate("peoples:list"));
    expect(peoples.replies()[0]?.text).toContain("Povos de Oniri");
    for (const instance of [first, detail, list, other, menu, peoples]) {
      expect(instance.ensurePlayer).not.toHaveBeenCalled();
    }
  });

  test.each([
    "essences:detail:missing", "essences:detail:", "essences:detail:__proto__",
    "essences:detail:constructor", "essences:detail:extase:invalid",
    "essences:old:list", "essences:invalid",
  ])("invalid or obsolete callback %s offers acknowledged recovery", async (action) => {
    const { bot, calls, replies, ensurePlayer } = setup();
    await bot.handleUpdate(callbackUpdate(action));
    expect(calls[0]?.method).toBe("answerCallbackQuery");
    expect(replies()[0]?.text).toContain("/essencias");
    expect(replies()[0]?.text).toContain("não está disponível");
    expect(replies()[0]?.reply_markup).toEqual(EXPECTED_BACK);
    expect(ensurePlayer).not.toHaveBeenCalled();
  });

  test("group commands and callbacks offer private-chat instructions only", async () => {
    const { bot, replies, calls, ensurePlayer } = setup();
    await bot.handleUpdate(messageUpdate("/essencias", telegramUser, true));
    for (const action of ["essences:list", "essences:detail:extase", "essences:menu", "essences:old"]) {
      await bot.handleUpdate(callbackUpdate(action, telegramUser, true));
    }
    expect(replies()).toHaveLength(5);
    for (const reply of replies()) {
      expect(reply.text).toContain("privado");
      expect(reply.text).toContain("/essencias");
      expect(reply.text).not.toContain("Corrente de Inspiração");
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
        inline_message_id: "old-inline-message", data: "essences:list",
      },
    });
    expect(calls.map((call) => call.method)).toEqual(["answerCallbackQuery"]);
    expect(ensurePlayer).not.toHaveBeenCalled();
  });
});

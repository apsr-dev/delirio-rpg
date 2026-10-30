import { describe, expect, mock, test } from "bun:test";
import { TRAILS, TRAIL_ROLES, POWER_TYPES } from "../../src/game/trails.js";
import { callbackUpdate, createTestBot, messageUpdate, telegramUser } from "../helpers/telegram.js";

function setup() {
  const ensurePlayer = mock(async () => { throw new Error("Database is offline"); });
  return { ...createTestBot({ ensurePlayer }), ensurePlayer };
}

const EXPECTED_ROLES = [
  [{ text: "Protetor", callback_data: "trails:role:protector" }],
  [{ text: "Ofensivo", callback_data: "trails:role:offensive" }],
  [{ text: "Suporte", callback_data: "trails:role:support" }],
  [{ text: "Menu inicial", callback_data: "trails:menu" }],
];

const EXPECTED_RECOVERY = {
  inline_keyboard: [
    [{ text: "Todas as funções", callback_data: "trails:list" }],
    [{ text: "Menu inicial", callback_data: "trails:menu" }],
  ],
};

describe("Telegram Trails guide", () => {
  test("/trilhas introduces roles, the limit, and the complete type legend without registration", async () => {
    const { bot, replies, ensurePlayer } = setup();
    await bot.handleUpdate(messageUpdate("/trilhas"));
    expect(replies()).toHaveLength(1);
    expect(replies()[0]?.text).toContain("até 3 Trilhas, uma de cada Energia");
    for (const line of ["A: Ativo", "P: Passivo", "R: Reação", "C: Concentração"]) {
      expect(replies()[0]?.text).toContain(line);
    }
    for (const role of TRAIL_ROLES) expect(replies()[0]?.text).toContain(role.description);
    expect(replies()[0]?.reply_markup).toEqual({ inline_keyboard: EXPECTED_ROLES });
    expect(ensurePlayer).not.toHaveBeenCalled();
  });

  test("the menu button acknowledges the callback and opens all roles", async () => {
    const { bot, replies, calls, ensurePlayer } = setup();
    await bot.handleUpdate(callbackUpdate("trails:list"));
    expect(calls[0]?.method).toBe("answerCallbackQuery");
    expect(replies()[0]?.reply_markup).toEqual({ inline_keyboard: EXPECTED_ROLES });
    expect(ensurePlayer).not.toHaveBeenCalled();
  });

  test.each(TRAIL_ROLES)("$name lists only its three Trails with their Energies", async (role) => {
    const { bot, calls, replies, ensurePlayer } = setup();
    await bot.handleUpdate(callbackUpdate(`trails:role:${role.id}`));
    expect(calls[0]?.method).toBe("answerCallbackQuery");
    expect(replies()[0]?.text).toContain(`Trilhas: ${role.name}`);
    expect(replies()[0]?.text).toContain(role.description);
    const trails = TRAILS.filter((trail) => trail.roleId === role.id);
    expect(replies()[0]?.reply_markup).toEqual({
      inline_keyboard: [
        ...trails.map((trail) => [{ text: `${trail.name} · ${trail.energy}`, callback_data: `trails:detail:${trail.id}` }]),
        [{ text: "Todas as funções", callback_data: "trails:list" }],
        [{ text: "Menu inicial", callback_data: "trails:menu" }],
      ],
    });
    expect(ensurePlayer).not.toHaveBeenCalled();
  });

  test.each(TRAILS)("$name displays both complete powers and returns to its canonical role", async (trail) => {
    const { bot, replies, calls, ensurePlayer } = setup();
    await bot.handleUpdate(callbackUpdate(`trails:detail:${trail.id}`));
    const reply = replies()[0]!;
    const role = TRAIL_ROLES.find((role) => role.id === trail.roleId)!;
    expect(calls[0]?.method).toBe("answerCallbackQuery");
    expect(reply.text).toContain(trail.name);
    expect(reply.text).toContain(`Função: ${role.name}`);
    expect(reply.text).toContain(`Energia: ${trail.energy}`);
    for (const power of trail.powers) {
      expect(reply.text).toContain(power.name);
      expect(reply.text).toContain(`Tipo: ${POWER_TYPES[power.type]} (${power.type})`);
      expect(reply.text).toContain(power.description);
      if (power.energyCost !== null) {
        expect(reply.text).toContain(`Custo de Energia: ${power.energyCost}`);
      }
    }
    expect(String(reply.text).match(/Custo de Energia:/g) ?? []).toHaveLength(
      trail.powers.filter((power) => power.energyCost !== null).length,
    );
    expect(reply.text).not.toMatch(/Custo de Energia: (?:0|null|undefined)/);
    expect(reply.reply_markup).toEqual({
      inline_keyboard: [
        [{ text: "Voltar à função", callback_data: `trails:role:${role.id}` }],
        [{ text: "Todas as funções", callback_data: "trails:list" }],
        [{ text: "Menu inicial", callback_data: "trails:menu" }],
      ],
    });
    expect(reply.parse_mode).toBeUndefined();
    expect(String(reply.text).length).toBeLessThanOrEqual(4096);
    expect(ensurePlayer).not.toHaveBeenCalled();
  });

  test("root, role, detail, back, another role, and menu work across new invocations", async () => {
    const actions = [
      ["trails:list", "Tipos de Poderes"],
      ["trails:role:offensive", "Trilhas: Ofensivo"],
      ["trails:detail:predador", "Poeira Cegante"],
      ["trails:role:offensive", "Trilhas: Ofensivo"],
      ["trails:list", "Tipos de Poderes"],
      ["trails:role:support", "Trilhas: Suporte"],
      ["trails:detail:bardo", "Público Seleto"],
      ["trails:menu", "Menu inicial"],
      ["prisms:list", "Energia Vinculada"],
    ];
    for (const [action, text] of actions) {
      const { bot, calls, replies, ensurePlayer } = setup();
      await bot.handleUpdate(callbackUpdate(action!));
      expect(calls[0]?.method).toBe("answerCallbackQuery");
      expect(replies()[0]?.text).toContain(text!);
      if (action === "trails:menu") {
        expect(replies()[0]?.text).not.toMatch(/cadastro|salvo/);
        expect(replies()[0]?.reply_markup).toEqual({
          inline_keyboard: [
            [
              { text: "Meu perfil", callback_data: "onboarding:profile" },
              { text: "Ajuda", callback_data: "onboarding:help" },
            ],
            [
              { text: "Povos de Oniri", callback_data: "peoples:list" },
              { text: "Essências", callback_data: "essences:list" },
            ],
            [
              { text: "Prismas", callback_data: "prisms:list" },
              { text: "Trilhas", callback_data: "trails:list" },
            ],
          ],
        });
      }
      expect(ensurePlayer).not.toHaveBeenCalled();
    }
  });

  test.each([
    "trails:role:missing", "trails:role:", "trails:role:__proto__",
    "trails:role:support:invalid", "trails:detail:missing", "trails:detail:",
    "trails:detail:constructor", "trails:detail:sentinela:invalid", "trails:old:list",
  ])("unknown or obsolete callback %s offers acknowledged recovery", async (action) => {
    const { bot, calls, replies, ensurePlayer } = setup();
    await bot.handleUpdate(callbackUpdate(action));
    expect(calls[0]?.method).toBe("answerCallbackQuery");
    expect(replies()[0]?.text).toContain("/trilhas");
    expect(replies()[0]?.text).toContain("não está disponível");
    expect(replies()[0]?.reply_markup).toEqual(EXPECTED_RECOVERY);
    expect(ensurePlayer).not.toHaveBeenCalled();
  });

  test("group requests at all navigation levels offer private-chat instructions only", async () => {
    const { bot, replies, calls, ensurePlayer } = setup();
    await bot.handleUpdate(messageUpdate("/trilhas", telegramUser, true));
    const actions = ["trails:list", "trails:role:protector", "trails:detail:sentinela", "trails:menu", "trails:old"];
    for (const action of actions) {
      await bot.handleUpdate(callbackUpdate(action, telegramUser, true));
    }
    expect(replies()).toHaveLength(6);
    for (const reply of replies()) {
      expect(reply.text).toContain("privado");
      expect(reply.text).toContain("/trilhas");
      expect(reply.text).not.toContain("Muralha Viva");
      expect(reply.reply_markup).toBeUndefined();
    }
    expect(calls.filter((call) => call.method === "answerCallbackQuery")).toHaveLength(5);
    expect(ensurePlayer).not.toHaveBeenCalled();
  });

  test("callbacks without a chat are acknowledged without sending messages", async () => {
    const { bot, calls, ensurePlayer } = setup();
    await bot.handleUpdate({
      update_id: 3,
      callback_query: {
        id: "inline-query", from: telegramUser, chat_instance: "inline-chat",
        inline_message_id: "old-inline-message", data: "trails:role:support",
      },
    });
    expect(calls.map((call) => call.method)).toEqual(["answerCallbackQuery"]);
    expect(ensurePlayer).not.toHaveBeenCalled();
  });
});

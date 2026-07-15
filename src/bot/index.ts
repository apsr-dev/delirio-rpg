import { Bot } from "grammy";
import { rollDiceExpression } from "../game/dice.js";
import { requireEnv } from "../lib/env.js";
import { supabase } from "../lib/supabase.js";

export function createBot() {
  const bot = new Bot(requireEnv("BOT_TOKEN"));

  bot.command("start", async (ctx) => {
    const telegramUser = ctx.from;

    if (telegramUser) {
      await supabase.from("players").upsert(
        {
          telegram_user_id: telegramUser.id,
          username: telegramUser.username ?? null,
          first_name: telegramUser.first_name ?? null,
          last_name: telegramUser.last_name ?? null,
        },
        {
          onConflict: "telegram_user_id",
        },
      );
    }

    await ctx.reply(
      [
        "Bem-vindo ao Delirio RPG.",
        "",
        "Comandos iniciais:",
        "/rolar 1d20",
        "/ficha",
        "/loja",
      ].join("\n"),
    );
  });

  bot.command("rolar", async (ctx) => {
    const expression = ctx.match.trim() || "1d20";

    try {
      const result = rollDiceExpression(expression);

      await ctx.reply(
        `${result.expression}: ${result.parts.join(" + ")} = ${result.total}`,
      );
    } catch (error) {
      await ctx.reply(error instanceof Error ? error.message : "Rolagem invalida.");
    }
  });

  bot.command("ficha", async (ctx) => {
    await ctx.reply("A ficha do personagem ainda sera criada.");
  });

  bot.command("loja", async (ctx) => {
    await ctx.reply("A loja de moedas ainda sera criada.");
  });

  bot.catch((error) => {
    console.error("Bot error", error);
  });

  return bot;
}

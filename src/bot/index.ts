import { Bot, InlineKeyboard, type BotConfig, type Context } from "grammy";
import type { Player, PlayerService } from "../players/types.js";

type BotOptions = {
  token: string;
  players: PlayerService;
  botInfo?: BotConfig<Context>["botInfo"];
};

const HELP = [
  "Ajuda — Delírio RPG",
  "",
  "/start — abrir o menu inicial",
  "/perfil — consultar seu perfil",
  "/ajuda — ver os comandos disponíveis",
].join("\n");

function menu() {
  return new InlineKeyboard()
    .text("Meu perfil", "onboarding:profile")
    .text("Ajuda", "onboarding:help");
}

function formatProfile(player: Player) {
  const name = [player.first_name, player.last_name].filter(Boolean).join(" ");
  const date = new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" })
    .format(new Date(player.created_at));

  return [
    "Meu perfil",
    "",
    `Nome no Telegram: ${name}`,
    `Usuário: ${player.username ? `@${player.username}` : "não informado"}`,
    `Cadastro: ${date} (UTC)`,
  ].join("\n");
}

export function createBot({ token, players, botInfo }: BotOptions) {
  const bot = new Bot(token, botInfo ? { botInfo } : {});

  async function showAccount(ctx: Context, screen: "start" | "profile") {
    if (ctx.chat?.type !== "private" || !ctx.from) {
      await ctx.reply("Para acessar seu perfil, converse comigo no privado e envie /start.");
      return;
    }

    let player: Player;
    try {
      player = await players.ensurePlayer(ctx.from);
    } catch {
      console.error("Player persistence failed");
      await ctx.reply(
        "Não consegui salvar ou consultar seu perfil agora. Tente novamente com /start ou /perfil.",
      );
      return;
    }

    await ctx.reply(
      screen === "profile"
        ? formatProfile(player)
        : "Bem-vindo ao Delírio RPG!\n\nSeu cadastro está salvo. Escolha uma opção abaixo.",
      { reply_markup: menu() },
    );
  }

  async function showHelp(ctx: Context) {
    if (ctx.chat?.type !== "private") {
      await ctx.reply("Para acessar o bot, converse comigo no privado e envie /start.");
      return;
    }
    await ctx.reply(HELP, { reply_markup: menu() });
  }

  bot.command("start", (ctx) => showAccount(ctx, "start"));
  bot.command("perfil", (ctx) => showAccount(ctx, "profile"));
  bot.command("ajuda", showHelp);

  bot.callbackQuery("onboarding:profile", async (ctx) => {
    await ctx.answerCallbackQuery();
    await showAccount(ctx, "profile");
  });
  bot.callbackQuery("onboarding:help", async (ctx) => {
    await ctx.answerCallbackQuery();
    await showHelp(ctx);
  });

  return bot;
}

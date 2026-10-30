import { InlineKeyboard, type Bot, type Context } from "grammy";
import { PRISMS, PRISM_CREATION_NOTES, findPrism, type Prism } from "../game/prisms.js";
import { initialMenu } from "./menu.js";

function guideNavigation() {
  return new InlineKeyboard()
    .text("Voltar aos Prismas", "prisms:list")
    .row()
    .text("Ver Essências", "essences:list")
    .row()
    .text("Menu inicial", "prisms:menu");
}

async function isPrivateChat(ctx: Context) {
  if (ctx.chat?.type === "private") return true;
  if (ctx.chat) {
    await ctx.reply("Para consultar os Prismas, converse comigo no privado e envie /prismas.");
  }
  return false;
}

async function showList(ctx: Context) {
  if (!(await isPrivateChat(ctx))) return;
  const keyboard = new InlineKeyboard();
  for (const prism of PRISMS) {
    keyboard.text(prism.name, `prisms:detail:${prism.id}`).row();
  }
  keyboard.text("Ver Essências", "essences:list").row();
  keyboard.text("Menu inicial", "prisms:menu");
  await ctx.reply(
    [
      "Prismas",
      "",
      "O Prisma define como seu personagem acessa os Poderes do jogo.",
      "",
      "Energia Vinculada",
      "É a Energia que determina a Chance de Acerto, o Dano e a Cura dos Poderes das Escolas de Poder.",
      "",
      "Escolha um Prisma para conhecer sua história e seus benefícios.",
    ].join("\n"),
    { reply_markup: keyboard },
  );
}

function formatPrism(prism: Prism) {
  return [
    prism.name,
    "",
    prism.description,
    "",
    `Energia Vinculada: ${prism.linkedEnergy}`,
    "",
    ...prism.benefits.flatMap((benefit) => [`${benefit.name}: ${benefit.description}`, ""]),
    "Sobre a criação de personagem",
    PRISM_CREATION_NOTES,
  ].join("\n");
}

export function registerPrismsGuide(bot: Bot) {
  bot.command("prismas", showList);
  bot.callbackQuery(/^prisms:/, async (ctx) => {
    await ctx.answerCallbackQuery();
    if (!(await isPrivateChat(ctx))) return;

    const action = ctx.callbackQuery.data;
    if (action === "prisms:list") {
      await showList(ctx);
      return;
    }
    if (action === "prisms:menu") {
      await ctx.reply("Menu inicial\n\nEscolha uma opção abaixo.", {
        reply_markup: initialMenu(),
      });
      return;
    }

    const prism = action.startsWith("prisms:detail:")
      ? findPrism(action.slice("prisms:detail:".length))
      : undefined;
    if (!prism) {
      await ctx.reply(
        "Essa opção não está disponível. Envie /prismas ou use os botões abaixo para abrir o guia.",
        { reply_markup: guideNavigation() },
      );
      return;
    }

    await ctx.reply(formatPrism(prism), { reply_markup: guideNavigation() });
  });
}

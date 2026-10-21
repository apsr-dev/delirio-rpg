import { InlineKeyboard, type Bot, type Context } from "grammy";
import { ESSENCES, ECHO_RULES_TEXT, findEssence, type Essence } from "../game/essences.js";
import { initialMenu } from "./menu.js";

function guideNavigation() {
  return new InlineKeyboard()
    .text("Voltar às Essências", "essences:list")
    .row()
    .text("Menu inicial", "essences:menu");
}

async function isPrivateChat(ctx: Context) {
  if (ctx.chat?.type === "private") return true;
  if (ctx.chat) {
    await ctx.reply("Para consultar as Essências, converse comigo no privado e envie /essencias.");
  }
  return false;
}

async function showList(ctx: Context) {
  if (!(await isPrivateChat(ctx))) return;
  const keyboard = new InlineKeyboard();
  for (const essence of ESSENCES) {
    keyboard.text(essence.name, `essences:detail:${essence.id}`).row();
  }
  keyboard.text("Menu inicial", "essences:menu");
  await ctx.reply(
    [
      "Essências",
      "",
      "A Essência é o sentimento que pulsa no centro do seu personagem, moldando como ele vê o mundo e reage aos desafios. Ela define o Eco da Essência e o acesso a Escolas de Poder.",
      "",
      "Como funciona o Eco",
      ECHO_RULES_TEXT,
      "",
      "Escolha uma Essência para conhecer seus elementos e seu Eco.",
    ].join("\n"),
    { reply_markup: keyboard },
  );
}

function formatEssence(essence: Essence) {
  return [
    essence.name,
    "",
    essence.description,
    "",
    `Origem da Essência: ${essence.origin}`,
    `Elemento principal: ${essence.primaryElement}`,
    `Elementos secundários: ${essence.secondaryElements.join(", ")}`,
    "",
    `Eco: ${essence.echo.name}`,
    essence.echo.description,
  ].join("\n");
}

export function registerEssencesGuide(bot: Bot) {
  bot.command("essencias", showList);
  bot.callbackQuery(/^essences:/, async (ctx) => {
    await ctx.answerCallbackQuery();
    if (!(await isPrivateChat(ctx))) return;

    const action = ctx.callbackQuery.data;
    if (action === "essences:list") {
      await showList(ctx);
      return;
    }
    if (action === "essences:menu") {
      await ctx.reply("Menu inicial\n\nEscolha uma opção abaixo.", {
        reply_markup: initialMenu(),
      });
      return;
    }

    const essence = action.startsWith("essences:detail:")
      ? findEssence(action.slice("essences:detail:".length))
      : undefined;
    if (!essence) {
      await ctx.reply(
        "Essa opção não está disponível. Envie /essencias ou use os botões abaixo para abrir o guia.",
        { reply_markup: guideNavigation() },
      );
      return;
    }

    await ctx.reply(formatEssence(essence), { reply_markup: guideNavigation() });
  });
}

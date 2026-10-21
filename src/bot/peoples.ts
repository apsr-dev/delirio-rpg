import { InlineKeyboard, type Bot, type Context } from "grammy";
import { PEOPLES, findPeople, type Energy, type People } from "../game/peoples.js";
import { initialMenu } from "./menu.js";

const ENERGY_LABELS: Record<Energy, string> = {
  body: "Corpo",
  mind: "Mente",
  spirit: "Espírito",
};

function guideNavigation() {
  return new InlineKeyboard()
    .text("Voltar aos povos", "peoples:list")
    .row()
    .text("Menu inicial", "peoples:menu");
}

async function isPrivateChat(ctx: Context) {
  if (ctx.chat?.type === "private") return true;
  if (ctx.chat) {
    await ctx.reply("Para consultar os povos, converse comigo no privado e envie /povos.");
  }
  return false;
}

async function showList(ctx: Context) {
  if (!(await isPrivateChat(ctx))) return;
  const keyboard = new InlineKeyboard();
  for (const people of PEOPLES) {
    keyboard.text(people.name, `peoples:detail:${people.id}`).row();
  }
  keyboard.text("Menu inicial", "peoples:menu");
  await ctx.reply(
    "Povos de Oniri\n\nEscolha um povo para conhecer sua história, seu poder e suas Energias.",
    { reply_markup: keyboard },
  );
}

function formatPeople(people: People) {
  const energies = (Object.keys(ENERGY_LABELS) as Energy[])
    .filter((energy) => people.energyBonuses[energy] > 0)
    .map((energy) => `+${people.energyBonuses[energy]} ${ENERGY_LABELS[energy]}`)
    .join(" e ");
  return [
    people.name,
    "",
    people.history,
    "",
    `Poder: ${people.power.name}`,
    people.power.description,
    "",
    `Energias: ${energies}`,
  ].join("\n");
}

export function registerPeoplesGuide(bot: Bot) {
  bot.command("povos", showList);
  bot.callbackQuery(/^peoples:/, async (ctx) => {
    await ctx.answerCallbackQuery();
    if (!(await isPrivateChat(ctx))) return;

    const action = ctx.callbackQuery.data;
    if (action === "peoples:list") {
      await showList(ctx);
      return;
    }
    if (action === "peoples:menu") {
      await ctx.reply("Menu inicial\n\nEscolha uma opção abaixo.", {
        reply_markup: initialMenu(),
      });
      return;
    }

    const people = action.startsWith("peoples:detail:")
      ? findPeople(action.slice("peoples:detail:".length))
      : undefined;
    if (!people) {
      await ctx.reply(
        "Essa opção não está disponível. Envie /povos ou use os botões abaixo para abrir o guia.",
        { reply_markup: guideNavigation() },
      );
      return;
    }

    await ctx.reply(formatPeople(people), { reply_markup: guideNavigation() });
  });
}

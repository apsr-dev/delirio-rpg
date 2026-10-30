import { InlineKeyboard, type Bot, type Context } from "grammy";
import {
  TRAILS, TRAIL_ROLES, POWER_TYPES, findTrail, findTrailRole,
  type Trail, type TrailRole,
} from "../game/trails.js";
import { initialMenu } from "./menu.js";

function guideNavigation() {
  return new InlineKeyboard()
    .text("Todas as funções", "trails:list")
    .row()
    .text("Menu inicial", "trails:menu");
}

async function isPrivateChat(ctx: Context) {
  if (ctx.chat?.type === "private") return true;
  if (ctx.chat) {
    await ctx.reply("Para consultar as Trilhas, converse comigo no privado e envie /trilhas.");
  }
  return false;
}

async function showRoles(ctx: Context) {
  const keyboard = new InlineKeyboard();
  for (const role of TRAIL_ROLES) {
    keyboard.text(role.name, `trails:role:${role.id}`).row();
  }
  keyboard.text("Menu inicial", "trails:menu");
  await ctx.reply([
    "Trilhas",
    "",
    "A Trilha reúne técnicas, hábitos e habilidades que moldam como seu personagem enfrenta o mundo.",
    "",
    ...TRAIL_ROLES.map((role) => `${role.name}: ${role.description}`),
    "",
    "Seu personagem pode ter até 3 Trilhas, uma de cada Energia.",
    "",
    "Tipos de Poderes",
    ...Object.entries(POWER_TYPES).map(([type, name]) => `${type}: ${name}`),
    "",
    "Escolha uma função para consultar suas Trilhas.",
  ].join("\n"), { reply_markup: keyboard });
}

async function showRole(ctx: Context, role: TrailRole) {
  const keyboard = new InlineKeyboard();
  for (const trail of TRAILS.filter((trail) => trail.roleId === role.id)) {
    keyboard.text(`${trail.name} · ${trail.energy}`, `trails:detail:${trail.id}`).row();
  }
  keyboard.text("Todas as funções", "trails:list").row();
  keyboard.text("Menu inicial", "trails:menu");
  await ctx.reply(`Trilhas: ${role.name}\n\n${role.description}\n\nEscolha uma Trilha para conhecer seus poderes iniciais.`, {
    reply_markup: keyboard,
  });
}

function formatTrail(trail: Trail, role: TrailRole) {
  return [
    trail.name,
    "",
    `Função: ${role.name}`,
    role.description,
    `Energia: ${trail.energy}`,
    "",
    "Poderes iniciais",
    "",
    ...trail.powers.flatMap((power) => [
      power.name,
      `Tipo: ${POWER_TYPES[power.type]} (${power.type})`,
      ...(power.energyCost === null ? [] : [`Custo de Energia: ${power.energyCost}`]),
      power.description,
      "",
    ]),
  ].join("\n").trimEnd();
}

async function showUnavailable(ctx: Context) {
  await ctx.reply(
    "Essa opção não está disponível. Envie /trilhas ou use os botões abaixo para abrir o guia.",
    { reply_markup: guideNavigation() },
  );
}

export function registerTrailsGuide(bot: Bot) {
  bot.command("trilhas", async (ctx) => {
    if (await isPrivateChat(ctx)) await showRoles(ctx);
  });
  bot.callbackQuery(/^trails:/, async (ctx) => {
    await ctx.answerCallbackQuery();
    if (!(await isPrivateChat(ctx))) return;

    const action = ctx.callbackQuery.data;
    if (action === "trails:list") {
      await showRoles(ctx);
      return;
    }
    if (action === "trails:menu") {
      await ctx.reply("Menu inicial\n\nEscolha uma opção abaixo.", {
        reply_markup: initialMenu(),
      });
      return;
    }
    if (action.startsWith("trails:role:")) {
      const role = findTrailRole(action.slice("trails:role:".length));
      if (role) await showRole(ctx, role);
      else await showUnavailable(ctx);
      return;
    }

    const trail = action.startsWith("trails:detail:")
      ? findTrail(action.slice("trails:detail:".length))
      : undefined;
    const role = trail && findTrailRole(trail.roleId);
    if (!trail || !role) {
      await showUnavailable(ctx);
      return;
    }
    const keyboard = new InlineKeyboard()
      .text("Voltar à função", `trails:role:${role.id}`)
      .row()
      .text("Todas as funções", "trails:list")
      .row()
      .text("Menu inicial", "trails:menu");
    await ctx.reply(formatTrail(trail, role), { reply_markup: keyboard });
  });
}

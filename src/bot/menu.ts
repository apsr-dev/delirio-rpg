import { InlineKeyboard } from "grammy";

export function initialMenu() {
  return new InlineKeyboard()
    .text("Meu perfil", "onboarding:profile")
    .text("Ajuda", "onboarding:help")
    .row()
    .text("Povos de Oniri", "peoples:list")
    .text("Essências", "essences:list");
}

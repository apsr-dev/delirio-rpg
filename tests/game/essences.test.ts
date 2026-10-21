import { describe, expect, test } from "bun:test";
import { ESSENCES, ECHO_RULES_TEXT, findEssence } from "../../src/game/essences.js";

describe("canonical Essences catalog", () => {
  test("contains all eight Essences with unique stable callback ids", () => {
    expect(ESSENCES.map(({ id, name }) => [id, name])).toEqual([
      ["extase", "Êxtase"], ["melancolia", "Melancolia"], ["serenidade", "Serenidade"],
      ["colera", "Cólera"], ["confianca", "Confiança"], ["dissimulacao", "Dissimulação"],
      ["altruismo", "Altruísmo"], ["egoismo", "Egoísmo"],
    ]);
    expect(new Set(ESSENCES.map(({ id }) => id)).size).toBe(8);
    for (const essence of ESSENCES) {
      expect(Buffer.byteLength(`essences:detail:${essence.id}`)).toBeLessThanOrEqual(64);
      expect(new Set([essence.primaryElement, ...essence.secondaryElements]).size).toBe(4);
    }
  });

  test.each([
    {
      id: "extase", marker: "beleza e prazer", origin: "Sonho", primary: "Elétrico",
      secondary: ["Sonoro", "Ar", "Fogo"], echo: "Corrente de Inspiração",
      effect: "Escolha 1 aliado. Nas próximas 2 rodadas o alvo escolhido recebe a Condição Roubo de Vida 50%.",
    },
    {
      id: "melancolia", marker: "profundidade emocional", origin: "Pesadelo", primary: "Gelo",
      secondary: ["Água", "Sangue", "Terra"], echo: "Comunhão da Dor",
      effect: "Escolha 1 aliado. Nas próximas 2 rodadas você absorve metade do dano sofrido pelo alvo. O alvo recebe Proteção +2.",
    },
    {
      id: "serenidade", marker: "acalmar tempestades", origin: "Sonho", primary: "Ar",
      secondary: ["Água", "Terra", "Gelo"], echo: "Aura da Calma",
      effect: "Você fica imune a dano até o início do seu próximo turno.",
    },
    {
      id: "colera", marker: "força devastadora", origin: "Pesadelo", primary: "Fogo",
      secondary: ["Elétrico", "Sangue", "Sonoro"], echo: "Ira Devastadora",
      effect: "Você maximiza o seu próximo Dano, e o alvo que sofreu o dano recebe a Condição Trauma nas próximas 2 rodadas.",
    },
    {
      id: "confianca", marker: "rocha para outros", origin: "Sonho", primary: "Terra",
      secondary: ["Sangue", "Água", "Fogo"], echo: "Juramento do Protetor",
      effect: "Escolha 1 Inimigo. Na próxima rodada, ele irá para o último lugar na Iniciativa, e ele irá atacar você, você recebe Proteção +4 contra esse ataque. Esse Eco transforma Ataque em área em Ataque em alvo.",
    },
    {
      id: "dissimulacao", marker: "máscaras cuidadosamente", origin: "Pesadelo", primary: "Sonoro",
      secondary: ["Gelo", "Ar", "Elétrico"], echo: "Sussurro Venenoso",
      effect: "Escolha 1 Inimigo. Nas próximas 2 rodadas, o Inimigo recebe a Condição Atrapalhado.",
    },
    {
      id: "altruismo", marker: "esquece de si mesmo", origin: "Sonho", primary: "Água",
      secondary: ["Sonoro", "Terra", "Elétrico"], echo: "Atitude Heróica",
      effect: "Escolha 1 aliado. O aliado escolhido será o primeiro da Iniciativa na próxima rodada, além disso, ele recupera 1 ponto de Energia e recebe 1 Reação Extra, que pode ser gasta até o final do combate.",
    },
    {
      id: "egoismo", marker: "grandes feitos", origin: "Pesadelo", primary: "Sangue",
      secondary: ["Fogo", "Ar", "Gelo"], echo: "Escudo de Carne",
      effect: "Escolha 1 Inimigo. Nas próximas 2 rodadas, 50% do dano que você sofrer será redirecionado ao inimigo escolhido.",
    },
  ])("$id preserves its description, origin, elements, and complete Echo effect", (expected) => {
    const essence = findEssence(expected.id);
    expect(essence?.description).toContain(expected.marker);
    expect(essence?.origin).toBe(expected.origin);
    expect(essence?.primaryElement).toBe(expected.primary);
    expect(essence?.secondaryElements).toEqual(expected.secondary);
    expect(essence?.echo).toEqual({ name: expected.echo, description: expected.effect });
  });

  test("the reference explains all general Echo rules with the base chance", () => {
    expect(ECHO_RULES_TEXT).toContain("chance base de receber 1 ponto de Essência é de 30%");
    expect(ECHO_RULES_TEXT).toContain("Com 5 pontos, o Eco fica disponível para uso em combate");
    expect(ECHO_RULES_TEXT).toContain("limite é de 5 pontos; pontos excedentes são perdidos");
    expect(ECHO_RULES_TEXT).toContain("mantidos entre combates até usar o Eco");
    expect(ECHO_RULES_TEXT).toContain("não encerra o turno nem impede sua Reação");
  });

  test("unknown ids and object properties never resolve to an Essence", () => {
    for (const id of ["", "Êxtase", "__proto__", "constructor", "extase:other"]) {
      expect(findEssence(id)).toBeUndefined();
    }
  });
});

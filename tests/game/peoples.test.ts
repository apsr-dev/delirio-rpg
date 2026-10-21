import { describe, expect, test } from "bun:test";
import { PEOPLES, findPeople } from "../../src/game/peoples.js";

describe("canonical peoples catalog", () => {
  test("contains all five peoples with unique stable ids", () => {
    expect(PEOPLES.map(({ id, name }) => [id, name])).toEqual([
      ["aetheri", "Aetheri"],
      ["shaqyr", "Shaqyr"],
      ["uklith", "Uklith"],
      ["vahr-uk", "Vahr’Uk"],
      ["humano", "Humano"],
    ]);
    expect(new Set(PEOPLES.map(({ id }) => id)).size).toBe(5);
  });

  test.each([
    {
      id: "aetheri", landmark: "Gloriosa e Generosa",
      power: "Vontade de Oniri",
      description: "Você recebe um bônus na sua DC igual seu nível de Mente + Espírito.",
      bonuses: { body: 0, mind: 1, spirit: 1 },
    },
    {
      id: "shaqyr", landmark: "Porta dos Segredos",
      power: "Herança Felina",
      description: "Você não gasta Energia para usar Combater com 2 Armas.",
      bonuses: { body: 1, mind: 0, spirit: 1 },
    },
    {
      id: "uklith", landmark: "Uklithron",
      power: "Conexão Gemológica",
      description: "Causa 10% a mais de dano com o Elemento da sua Essência.",
      bonuses: { body: 1, mind: 1, spirit: 0 },
    },
    {
      id: "vahr-uk", landmark: "Kark’Utaua",
      power: "Sangue de Troll",
      description: "Você tem 1 Reação Extra por rodada, a segunda Reação tem seu custo de Energia aumentado em 1.",
      bonuses: { body: 1, mind: 0, spirit: 1 },
    },
    {
      id: "humano", landmark: "Caerya",
      power: "Espírito dos Curiosos",
      description: "Você pode escolher 2 Profissões.",
      bonuses: { body: 1, mind: 1, spirit: 0 },
    },
  ])("$id preserves the rulebook lore, named power, and bonuses", (expected) => {
    const people = findPeople(expected.id);
    expect(people?.history).toContain(expected.landmark);
    expect(people?.power).toEqual({ name: expected.power, description: expected.description });
    expect(people?.energyBonuses).toEqual(expected.bonuses);
  });

  test("unknown ids never resolve to a catalog entry or object property", () => {
    for (const id of ["", "Aetheri", "__proto__", "constructor", "aetheri:other"]) {
      expect(findPeople(id)).toBeUndefined();
    }
  });
});

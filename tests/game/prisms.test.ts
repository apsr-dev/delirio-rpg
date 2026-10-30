import { describe, expect, test } from "bun:test";
import { PRISMS, PRISM_CREATION_NOTES, findPrism } from "../../src/game/prisms.js";

describe("canonical Prisms catalog", () => {
  test("contains all three Prisms with unique stable callback ids", () => {
    expect(PRISMS.map(({ id, name }) => [id, name])).toEqual([
      ["feiticeiro", "Feiticeiro"], ["ocultista", "Ocultista"], ["devoto", "Devoto"],
    ]);
    expect(new Set(PRISMS.map(({ id }) => id)).size).toBe(3);
    for (const prism of PRISMS) {
      expect(Buffer.byteLength(`prisms:detail:${prism.id}`)).toBeLessThanOrEqual(64);
    }
  });

  test.each([
    {
      id: "feiticeiro", marker: "herança genética ancestral", energy: "Corpo",
      benefits: [
        {
          name: "Técnicas Marciais",
          description: "Você começa com 1 Poder novo da Escola Marcial e pode aprender +1 para cada 2 níveis de Corpo. Máx 5.",
        },
        {
          name: "Sangue Mágico",
          description: "Escolha 1 Escola de Poder da sua Essência, você pode aprender 1 Poder novo da Escola escolhida para cada 2 níveis de DC.",
        },
        {
          name: "Conjurador Físico",
          description: "Você usa Corpo como Energia Primária no lugar de Espírito para determinar o nível de Conjurações, o Dano e a Cura dos seus Poderes Prismáticos.",
        },
      ],
    },
    {
      id: "ocultista", marker: "pesquisas minuciosas", energy: "Mente",
      benefits: [
        {
          name: "Revelação Mágica",
          description: "Você pode aprender poderes de todos os Elementos da sua Essência. Você começa com 2 Poderes novos e pode aprender +1 para cada nível de Mente.",
        },
        {
          name: "Conjuração Metódica",
          description: "Você usa Mente como Energia Primária no lugar de Espírito para determinar o nível de Conjurações, o Dano e a Cura dos seus Poderes Prismáticos.",
        },
        {
          name: "Prisma Fortalecido",
          description: "Você usa Mente como Energia Primária no lugar de Espírito para determinar o nível de Bloqueio.",
        },
      ],
    },
    {
      id: "devoto", marker: "devoção absoluta", energy: "Espírito",
      benefits: [
        {
          name: "Devoção Completa",
          description: "Você aumenta para 40% a chance de receber 1 ponto de Essência quando gasta Energia.",
        },
        {
          name: "Epifania Divina",
          description: "Você começa com 1 Poder novo da Escola dos Sonhos ou Pesadelos, conforme a Origem da sua Essência. Você pode aprender +1 Poder dessa escola a cada Categoria acima da Comum.",
        },
        {
          name: "Compreender o Prisma",
          description: "Escolha 2 Escolas de Poder da sua Essência, você começa com 2 Poderes novo das Escolas escolhidas e você pode aprender +1 por nível de Espírito.",
        },
      ],
    },
  ])("$id preserves its linked Energy and all three canonical benefits", (expected) => {
    const prism = findPrism(expected.id);
    expect(prism?.description).toContain(expected.marker);
    expect(prism?.linkedEnergy).toBe(expected.energy);
    expect(prism?.benefits).toEqual(expected.benefits);
  });

  test("creation notes explain the school-switch cutoff and deferred power choice", () => {
    expect(PRISM_CREATION_NOTES).toContain("trocar uma Escola vinculada até aprender seu primeiro Poder nela");
    expect(PRISM_CREATION_NOTES).toContain("Após isso, a troca fica bloqueada");
    expect(PRISM_CREATION_NOTES).toContain("Poderes recebidos podem ser escolhidos após finalizar a criação de personagem");
  });

  test("unknown ids and object properties never resolve to a Prism", () => {
    for (const id of ["", "Feiticeiro", "__proto__", "constructor", "devoto:other"]) {
      expect(findPrism(id)).toBeUndefined();
    }
  });
});

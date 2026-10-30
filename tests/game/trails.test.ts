import { describe, expect, test } from "bun:test";
import { TRAILS, TRAIL_ROLES, POWER_TYPES, findTrail, findTrailRole, type InitialTrailPower } from "../../src/game/trails.js";

const EXPECTED = [
  {
    id: "sentinela", role: "protector", energy: "Corpo",
    powers: [
      { name: "Muralha Viva", type: "A", cost: 1, effects: ["Os próximos 2 ataques", "redirecionados à você"] },
      { name: "Estilo Intocável", type: "P", cost: null, effects: ["Proteção aumenta 1%", "zerado ao final do combate"] },
    ],
  },
  {
    id: "baluarte", role: "protector", energy: "Mente",
    powers: [
      { name: "Vanguarda", type: "R", cost: 1, effects: ["Se acertar seu próximo ataque", "Condição Provocado", "+2 de Proteção contra o próximo ataque"] },
      { name: "Triunfar sob Pressão", type: "P", cost: null, effects: ["Sempre que estiver sofrendo alguma Condição", "+4 de Proteção"] },
    ],
  },
  {
    id: "magespada", role: "protector", energy: "Espírito",
    powers: [
      { name: "Armamento do Éter", type: "C", cost: 1, effects: ["Espírito para determinar Ataque e Dano da sua Arma"] },
      { name: "Guarda Mágica", type: "P", cost: null, effects: ["Sempre que você gasta Energia", "Escudo de 25% do Dano", "em você e todos seus aliados", "cumulativo", "até o final do combate"] },
    ],
  },
  {
    id: "bestial", role: "offensive", energy: "Corpo",
    powers: [
      { name: "Furor de Batalha", type: "C", cost: 1, effects: ["10% de dano na sua DC", "+15% de Dano com sua Arma"] },
      { name: "Passo Voraz", type: "P", cost: null, effects: ["armas Corpo-a-corpo", "Movimentação Recuar", "+2 de Antecipação"] },
    ],
  },
  {
    id: "predador", role: "offensive", energy: "Mente",
    powers: [
      { name: "Engenharia de Caça", type: "A", cost: 1, effects: [
        "1 das 3 situações", "escolhida aleatóriamente",
        "Rede Enredante: O inimigo precisa gastar 1 Energia para usar uma Movimentação.",
        "Poeira Cegante: O próximo ataque do inimigo vai errar, independente do teste.",
        "Gás Paralizante: O inimigo aumenta em 1 o custo do seu próximo gasto de Energia.",
      ] },
      { name: "Diário de Caça", type: "P", cost: null, effects: [
        "duram até o final do combate", "• +2 Ataque", "• +2 Proteção",
        "• Recebe Resistência 1 a um tipo de Dano aleatório.",
        "• Ataques ignoram 1 nível de Resistência do alvo",
      ] },
    ],
  },
  {
    id: "espiritualista", role: "offensive", energy: "Espírito",
    powers: [
      { name: "Vontade Inquebrável", type: "R", cost: 1, effects: ["duração Final do Combate", "Você não pode cancelar o Poder", "você pode recuperar a Energia", "1 Poder por combate"] },
      { name: "Canalização Instintiva", type: "P", cost: null, effects: ["25% de chance de recuperar 1 ponto de Energia"] },
    ],
  },
  {
    id: "sabotador", role: "support", energy: "Corpo",
    powers: [
      { name: "Distração Calculada", type: "P", cost: null, effects: ["1 Reação Extra por rodada"] },
      { name: "Mestre do Caos", type: "R", cost: null, effects: [
        "Se acertar o seu próximo ataque", "escolhida aleatóriamente",
        "Coquetel Molotov: Causa Dano 1 em todos os inimigos.",
        "Unguento Escorregadio: Causa a Condição Derrubado no alvo.",
        "Bomba de Fumaça: Todos os aliados são considerados na Condição Camuflado até o início da sua próxima rodada.",
      ] },
    ],
  },
  {
    id: "estrategista", role: "support", energy: "Mente",
    powers: [
      { name: "Treinador", type: "A", cost: 1, effects: ["Todos seus aliados, exceto você", "50% de chance de recuperar 1 ponto de Energia", "separadamente para cada um"] },
      { name: "Contra-Tática", type: "R", cost: null, effects: ["perde 1 Reação no seu próximo turno"] },
    ],
  },
  {
    id: "bardo", role: "support", energy: "Espírito",
    powers: [
      { name: "Expressão Artística", type: "C", cost: 1, effects: ["1 Poder de Concentração para cada 2 níveis de Espírito", "não gastam Energia e nem travam sua Energia", "30% de chance de encerrar", "também cancela todos Poderes de Concentração que não gastaram Energia"] },
      { name: "Público Seleto", type: "R", cost: 1, effects: ["causa Dano ou Cura", "altera seu Alvo para Área"] },
    ],
  },
] as const;

describe("canonical initial Trails catalog", () => {
  test("provides three roles, all nine Trails, and exactly 18 initial powers", () => {
    expect(TRAIL_ROLES.map(({ id, name }) => [id, name])).toEqual([
      ["protector", "Protetor"], ["offensive", "Ofensivo"], ["support", "Suporte"],
    ]);
    expect(TRAILS.map(({ id }) => id)).toEqual(EXPECTED.map(({ id }) => id));
    expect(new Set(TRAILS.map(({ id }) => id)).size).toBe(9);
    expect(TRAILS.flatMap<InitialTrailPower>(({ powers }) => powers)).toHaveLength(18);
    for (const role of TRAIL_ROLES) {
      expect(TRAILS.filter(({ roleId }) => roleId === role.id)).toHaveLength(3);
    }
    for (const trail of TRAILS) {
      expect(Buffer.byteLength(`trails:detail:${trail.id}`)).toBeLessThanOrEqual(64);
    }
    expect(POWER_TYPES).toEqual({ A: "Ativo", P: "Passivo", R: "Reação", C: "Concentração" });
  });

  test.each(EXPECTED)("$id preserves role, Energy, types, costs, and complete effect details", (expected) => {
    const trail = findTrail(expected.id)!;
    expect(trail.roleId).toBe(expected.role);
    expect(trail.energy).toBe(expected.energy);
    expect(trail.powers).toHaveLength(2);
    expected.powers.forEach((power, index) => {
      const actual = trail.powers[index]!;
      expect(actual.name).toBe(power.name);
      expect(actual.type).toBe(power.type);
      expect(actual.energyCost).toBe(power.cost);
      for (const effect of power.effects) expect(actual.description).toContain(effect);
      expect(actual.description).not.toContain("**");
    });
  });

  test("unknown ids and object properties never resolve to a role or Trail", () => {
    for (const id of ["", "__proto__", "constructor", "Sentinela", "support:extra"]) {
      expect(findTrail(id)).toBeUndefined();
      expect(findTrailRole(id)).toBeUndefined();
    }
  });
});

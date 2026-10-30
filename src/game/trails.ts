export const TRAIL_ROLES = [
  {
    "id": "protector",
    "name": "Protetor",
    "description": "Focado em proteger a si e ao grupo."
  },
  {
    "id": "offensive",
    "name": "Ofensivo",
    "description": "Focado em causar mais dano."
  },
  {
    "id": "support",
    "name": "Suporte",
    "description": "Focado em aprimorar o grupo e prejudicar os inimigos."
  }
] as const;
export type TrailRole = (typeof TRAIL_ROLES)[number];
export type TrailRoleId = TrailRole["id"];
export type TrailEnergy = "Corpo" | "Mente" | "Espírito";

export const POWER_TYPES = { A: "Ativo", P: "Passivo", R: "Reação", C: "Concentração" } as const;
export type InitialTrailPower = {
  readonly name: string;
  readonly type: keyof typeof POWER_TYPES;
  // null means the rulebook does not specify a cost; it never means zero.
  readonly energyCost: number | null;
  readonly description: string;
};
export type Trail = {
  readonly id: string;
  readonly name: string;
  readonly roleId: TrailRoleId;
  readonly energy: TrailEnergy;
  readonly powers: readonly [InitialTrailPower, InitialTrailPower];
};

// Delírio RPG Online, Criação de Personagem → Trilhas.
// Source and content scope: docs/trails-guide.md.
export const TRAILS = [
  {
    "id": "sentinela",
    "name": "Sentinela",
    "roleId": "protector",
    "energy": "Corpo",
    "powers": [
      {
        "name": "Muralha Viva",
        "type": "A",
        "energyCost": 1,
        "description": "Escolha 1 Aliado: Os próximos 2 ataques feitos contra o aliado escolhido serão redirecionados à você."
      },
      {
        "name": "Estilo Intocável",
        "type": "P",
        "energyCost": null,
        "description": "Sempre que sofre dano no combate sua Proteção aumenta 1%, esse bônus é zerado ao final do combate."
      }
    ]
  },
  {
    "id": "baluarte",
    "name": "Baluarte",
    "roleId": "protector",
    "energy": "Mente",
    "powers": [
      {
        "name": "Vanguarda",
        "type": "R",
        "energyCost": 1,
        "description": "Se acertar seu próximo ataque, o alvo sofre a Condição Provocado. Você recebe +2 de Proteção contra o próximo ataque desse inimigo."
      },
      {
        "name": "Triunfar sob Pressão",
        "type": "P",
        "energyCost": null,
        "description": "Sempre que estiver sofrendo alguma Condição você recebe +4 de Proteção."
      }
    ]
  },
  {
    "id": "magespada",
    "name": "Magespada",
    "roleId": "protector",
    "energy": "Espírito",
    "powers": [
      {
        "name": "Armamento do Éter",
        "type": "C",
        "energyCost": 1,
        "description": "Enquanto Armamento do Éter estiver ativo, você utiliza Espírito para determinar Ataque e Dano da sua Arma."
      },
      {
        "name": "Guarda Mágica",
        "type": "P",
        "energyCost": null,
        "description": "Sempre que você gasta Energia, você gera um Escudo de 25% do Dano da sua Arma, em você e todos seus aliados. O escudo é cumulativo e dura até ser zerado, ou até o final do combate."
      }
    ]
  },
  {
    "id": "bestial",
    "name": "Bestial",
    "roleId": "offensive",
    "energy": "Corpo",
    "powers": [
      {
        "name": "Furor de Batalha",
        "type": "C",
        "energyCost": 1,
        "description": "Você sofre 10% de dano na sua DC ao ativar Furor de Batalha, enquanto ele estiver ativo, você causa +15% de Dano com sua Arma."
      },
      {
        "name": "Passo Voraz",
        "type": "P",
        "energyCost": null,
        "description": "Você pode realizar Ataques com armas Corpo-a-corpo contra inimigos que usaram a Movimentação Recuar. Além disso você recebe +2 de Antecipação."
      }
    ]
  },
  {
    "id": "predador",
    "name": "Predador",
    "roleId": "offensive",
    "energy": "Mente",
    "powers": [
      {
        "name": "Engenharia de Caça",
        "type": "A",
        "energyCost": 1,
        "description": "Escolha 1 inimigo. O inimigo sofre 1 das 3 situações abaixo, escolhida aleatóriamente:\n\n• Rede Enredante: O inimigo precisa gastar 1 Energia para usar uma Movimentação.\n• Poeira Cegante: O próximo ataque do inimigo vai errar, independente do teste.\n• Gás Paralizante: O inimigo aumenta em 1 o custo do seu próximo gasto de Energia."
      },
      {
        "name": "Diário de Caça",
        "type": "P",
        "energyCost": null,
        "description": "No início de cada combate você recebe 1 dos bônus abaixo, os bônus duram até o final do combate:\n\n• +2 Ataque\n• +2 Proteção\n• Recebe Resistência 1 a um tipo de Dano aleatório.\n• Ataques ignoram 1 nível de Resistência do alvo"
      }
    ]
  },
  {
    "id": "espiritualista",
    "name": "Espiritualista",
    "roleId": "offensive",
    "energy": "Espírito",
    "powers": [
      {
        "name": "Vontade Inquebrável",
        "type": "R",
        "energyCost": 1,
        "description": "O próximo Poder Concentração que você lançar, terá duração Final do Combate. Você não pode cancelar o Poder e você pode recuperar a Energia gasta nele. Você pode fazer isso com 1 Poder por combate."
      },
      {
        "name": "Canalização Instintiva",
        "type": "P",
        "energyCost": null,
        "description": "Sempre que gasta Energia você tem 25% de chance de recuperar 1 ponto de Energia."
      }
    ]
  },
  {
    "id": "sabotador",
    "name": "Sabotador",
    "roleId": "support",
    "energy": "Corpo",
    "powers": [
      {
        "name": "Distração Calculada",
        "type": "P",
        "energyCost": null,
        "description": "Você recebe 1 Reação Extra por rodada."
      },
      {
        "name": "Mestre do Caos",
        "type": "R",
        "energyCost": null,
        "description": "Se acertar o seu próximo ataque, você também realiza 1 das ações abaixo, escolhida aleatóriamente:\n\n• Coquetel Molotov: Causa Dano 1 em todos os inimigos.\n• Unguento Escorregadio: Causa a Condição Derrubado no alvo.\n• Bomba de Fumaça: Todos os aliados são considerados na Condição Camuflado até o início da sua próxima rodada."
      }
    ]
  },
  {
    "id": "estrategista",
    "name": "Estrategista",
    "roleId": "support",
    "energy": "Mente",
    "powers": [
      {
        "name": "Treinador",
        "type": "A",
        "energyCost": 1,
        "description": "Todos seus aliados, exceto você, tem 50% de chance de recuperar 1 ponto de Energia, o teste é feito separadamente para cada um."
      },
      {
        "name": "Contra-Tática",
        "type": "R",
        "energyCost": null,
        "description": "Escolha 1 inimigo, o inimigo escolhido perde 1 Reação no seu próximo turno."
      }
    ]
  },
  {
    "id": "bardo",
    "name": "Bardo",
    "roleId": "support",
    "energy": "Espírito",
    "powers": [
      {
        "name": "Expressão Artística",
        "type": "C",
        "energyCost": 1,
        "description": "Enquanto estiver com Expressão Artística ativo, 1 Poder de Concentração para cada 2 níveis de Espírito, não gastam Energia e nem travam sua Energia. Porém, sempre que você sofrer dano, tem 30% de chance de encerrar sua Expressão Artística, ao ser encerrada ela também cancela todos Poderes de Concentração que não gastaram Energia."
      },
      {
        "name": "Público Seleto",
        "type": "R",
        "energyCost": 1,
        "description": "Escolha 1 aliado. O próximo Poder que o alvo usar, que causa Dano ou Cura, altera seu Alvo para Área."
      }
    ]
  }
] as const satisfies readonly Trail[];

export function findTrail(id: string): Trail | undefined {
  return TRAILS.find((trail) => trail.id === id);
}

export function findTrailRole(id: string): TrailRole | undefined {
  return TRAIL_ROLES.find((role) => role.id === id);
}

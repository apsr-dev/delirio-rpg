export type EssenceOrigin = "Sonho" | "Pesadelo";
export type EssenceElement = "Elétrico" | "Sonoro" | "Ar" | "Fogo" | "Gelo" | "Água" | "Sangue" | "Terra";

export type Essence = {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly origin: EssenceOrigin;
  readonly primaryElement: EssenceElement;
  readonly secondaryElements: readonly [EssenceElement, EssenceElement, EssenceElement];
  readonly echo: { readonly name: string; readonly description: string };
};

// Delírio RPG Online, Criação de Personagem → Essências.
// Source and content scope: docs/essences-guide.md.
export const ESSENCES = [
  {
    "id": "extase",
    "name": "Êxtase",
    "description": "Um personagem movido pelo Êxtase pode encontrar beleza e prazer até nas situações mais sombrias, mas também corre o risco de se perder em prazeres momentâneos.",
    "origin": "Sonho",
    "primaryElement": "Elétrico",
    "secondaryElements": [
      "Sonoro",
      "Ar",
      "Fogo"
    ],
    "echo": {
      "name": "Corrente de Inspiração",
      "description": "Escolha 1 aliado. Nas próximas 2 rodadas o alvo escolhido recebe a Condição Roubo de Vida 50%."
    }
  },
  {
    "id": "melancolia",
    "name": "Melancolia",
    "description": "Alguém tocado pela Melancolia carrega uma profundidade emocional que permite conexões íntimas com a dor do mundo, mas pode afundar em tristezas que parecem não ter fim.",
    "origin": "Pesadelo",
    "primaryElement": "Gelo",
    "secondaryElements": [
      "Água",
      "Sangue",
      "Terra"
    ],
    "echo": {
      "name": "Comunhão da Dor",
      "description": "Escolha 1 aliado. Nas próximas 2 rodadas você absorve metade do dano sofrido pelo alvo. O alvo recebe Proteção +2."
    }
  },
  {
    "id": "serenidade",
    "name": "Serenidade",
    "description": "A Serenidade oferece uma paz que pode acalmar tempestades e trazer clareza nos momentos mais caóticos, porém pode também levar à inação quando a paixão se faz necessária.",
    "origin": "Sonho",
    "primaryElement": "Ar",
    "secondaryElements": [
      "Água",
      "Terra",
      "Gelo"
    ],
    "echo": {
      "name": "Aura da Calma",
      "description": "Você fica imune a dano até o início do seu próximo turno."
    }
  },
  {
    "id": "colera",
    "name": "Cólera",
    "description": "A Cólera concede força devastadora para enfrentar injustiças, mas ameaça consumir tudo ao redor em chamas de fúria descontrolada.",
    "origin": "Pesadelo",
    "primaryElement": "Fogo",
    "secondaryElements": [
      "Elétrico",
      "Sangue",
      "Sonoro"
    ],
    "echo": {
      "name": "Ira Devastadora",
      "description": "Você maximiza o seu próximo Dano, e o alvo que sofreu o dano recebe a Condição Trauma nas próximas 2 rodadas."
    }
  },
  {
    "id": "confianca",
    "name": "Confiança",
    "description": "A Confiança permite que o personagem seja uma rocha para outros se apoiarem, inspirando lealdade e coragem, mas pode cegar para perigos reais por excesso de otimismo.",
    "origin": "Sonho",
    "primaryElement": "Terra",
    "secondaryElements": [
      "Sangue",
      "Água",
      "Fogo"
    ],
    "echo": {
      "name": "Juramento do Protetor",
      "description": "Escolha 1 Inimigo. Na próxima rodada, ele irá para o último lugar na Iniciativa, e ele irá atacar você, você recebe Proteção +4 contra esse ataque. Esse Eco transforma Ataque em área em Ataque em alvo."
    }
  },
  {
    "id": "dissimulacao",
    "name": "Dissimulação",
    "description": "A Dissimulação oferece a habilidade de navegar por situações complexas através de máscaras cuidadosamente construídas, mas pode eventualmente fazer com que o próprio personagem se perca entre suas mentiras.",
    "origin": "Pesadelo",
    "primaryElement": "Sonoro",
    "secondaryElements": [
      "Gelo",
      "Ar",
      "Elétrico"
    ],
    "echo": {
      "name": "Sussurro Venenoso",
      "description": "Escolha 1 Inimigo. Nas próximas 2 rodadas, o Inimigo recebe a Condição Atrapalhado."
    }
  },
  {
    "id": "altruismo",
    "name": "Altruísmo",
    "description": "O Altruísmo eleva os outros, muitas vezes sendo ele mesmo a força que mantém o grupo de pé. E muitas vezes ao fazer isso, ele esquece de si mesmo, colocando suas necessidades em segundo plano.",
    "origin": "Sonho",
    "primaryElement": "Água",
    "secondaryElements": [
      "Sonoro",
      "Terra",
      "Elétrico"
    ],
    "echo": {
      "name": "Atitude Heróica",
      "description": "Escolha 1 aliado. O aliado escolhido será o primeiro da Iniciativa na próxima rodada, além disso, ele recupera 1 ponto de Energia e recebe 1 Reação Extra, que pode ser gasta até o final do combate."
    }
  },
  {
    "id": "egoismo",
    "name": "Egoísmo",
    "description": "O Egoísmo inspira o personagem a grandes feitos, pois ele não será facilmente desencorajado por obstáculos ou pela desaprovação alheia, mas também pode corroer relacionamentos pois o personagem opera a partir de uma lógica onde suas necessidades são naturalmente mais importantes.",
    "origin": "Pesadelo",
    "primaryElement": "Sangue",
    "secondaryElements": [
      "Fogo",
      "Ar",
      "Gelo"
    ],
    "echo": {
      "name": "Escudo de Carne",
      "description": "Escolha 1 Inimigo. Nas próximas 2 rodadas, 50% do dano que você sofrer será redirecionado ao inimigo escolhido."
    }
  }
] as const satisfies readonly Essence[];

export const ECHO_RULES_TEXT = "Ao gastar Energia, a chance base de receber 1 ponto de Essência é de 30%.\nCom 5 pontos, o Eco fica disponível para uso em combate.\nO limite é de 5 pontos; pontos excedentes são perdidos.\nOs pontos são mantidos entre combates até usar o Eco.\nUsar o Eco não encerra o turno nem impede sua Reação.";

export function findEssence(id: string): Essence | undefined {
  return ESSENCES.find((essence) => essence.id === id);
}

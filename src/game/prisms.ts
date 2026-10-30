export type PrismEnergy = "Corpo" | "Mente" | "Espírito";
export type PrismBenefit = { readonly name: string; readonly description: string };

export type Prism = {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly linkedEnergy: PrismEnergy;
  readonly benefits: readonly [PrismBenefit, PrismBenefit, PrismBenefit];
};

// Delírio RPG Online, Criação de Personagem → Prismas.
// Source and content scope: docs/prisms-guide.md.
export const PRISMS = [
  {
    "id": "feiticeiro",
    "name": "Feiticeiro",
    "description": "A magia corre em seu sangue, sendo parte inseparável de sua própria essência natural. Para você o acesso à magia não depende de estudos ou rituais complexos, mas da herança genética ancestral que corre em suas veias desde o seu nascimento. Essa conexão natural faz com que os Feiticeiros sejam capazes de manifestar as mais diferentes formas de magia.",
    "linkedEnergy": "Corpo",
    "benefits": [
      {
        "name": "Técnicas Marciais",
        "description": "Você começa com 1 Poder novo da Escola Marcial e pode aprender +1 para cada 2 níveis de Corpo. Máx 5."
      },
      {
        "name": "Sangue Mágico",
        "description": "Escolha 1 Escola de Poder da sua Essência, você pode aprender 1 Poder novo da Escola escolhida para cada 2 níveis de DC."
      },
      {
        "name": "Conjurador Físico",
        "description": "Você usa Corpo como Energia Primária no lugar de Espírito para determinar o nível de Conjurações, o Dano e a Cura dos seus Poderes Prismáticos."
      }
    ]
  },
  {
    "id": "ocultista",
    "name": "Ocultista",
    "description": "O verdadeiro mestre do estudo, da compreensão da realidade e sua aplicação. Dotado de grande curiosidade, você desvenda os mistérios da magia através do conhecimento, da pesquisa e da disciplina. Seu caminho é pavimentado por pesquisas minuciosas, experimentos constantes e uma disposição para aprender o que está oculto.",
    "linkedEnergy": "Mente",
    "benefits": [
      {
        "name": "Revelação Mágica",
        "description": "Você pode aprender poderes de todos os Elementos da sua Essência. Você começa com 2 Poderes novos e pode aprender +1 para cada nível de Mente."
      },
      {
        "name": "Conjuração Metódica",
        "description": "Você usa Mente como Energia Primária no lugar de Espírito para determinar o nível de Conjurações, o Dano e a Cura dos seus Poderes Prismáticos."
      },
      {
        "name": "Prisma Fortalecido",
        "description": "Você usa Mente como Energia Primária no lugar de Espírito para determinar o nível de Bloqueio."
      }
    ]
  },
  {
    "id": "devoto",
    "name": "Devoto",
    "description": "Você serve a uma Divindade, e acessa uma fagulha divina, um fragmento ínfimo da fonte de poder daquela Divindade. Não se trata de uma bênção concedida, nem de um presente oferecido. A fagulha é uma consequência natural da devoção absoluta, como a luz que emana de uma chama sem que a chama precise decidir iluminar.",
    "linkedEnergy": "Espírito",
    "benefits": [
      {
        "name": "Devoção Completa",
        "description": "Você aumenta para 40% a chance de receber 1 ponto de Essência quando gasta Energia."
      },
      {
        "name": "Epifania Divina",
        "description": "Você começa com 1 Poder novo da Escola dos Sonhos ou Pesadelos, conforme a Origem da sua Essência. Você pode aprender +1 Poder dessa escola a cada Categoria acima da Comum."
      },
      {
        "name": "Compreender o Prisma",
        "description": "Escolha 2 Escolas de Poder da sua Essência, você começa com 2 Poderes novo das Escolas escolhidas e você pode aprender +1 por nível de Espírito."
      }
    ]
  }
] as const satisfies readonly Prism[];

export const PRISM_CREATION_NOTES = "Escolas de Poder: você pode trocar uma Escola vinculada até aprender seu primeiro Poder nela. Após isso, a troca fica bloqueada.\nPoderes iniciais: os Poderes recebidos podem ser escolhidos após finalizar a criação de personagem.";

export function findPrism(id: string): Prism | undefined {
  return PRISMS.find((prism) => prism.id === id);
}

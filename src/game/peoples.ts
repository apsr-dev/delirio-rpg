export type Energy = "body" | "mind" | "spirit";

export type People = {
  readonly id: string;
  readonly name: string;
  readonly history: string;
  readonly power: { readonly name: string; readonly description: string };
  readonly energyBonuses: Readonly<Record<Energy, number>>;
};

// Delírio RPG Online, Criação de Personagem → Povos e Sexo.
// Source and content scope: docs/peoples-guide.md.
export const PEOPLES = [
  {
    "id": "aetheri",
    "name": "Aetheri",
    "history": "Os Aetheri são seres alados criados pelo último grande sonho da Divina‑Mãe, habitantes de duas ilhas flutuantes continentais, Gloriosa e Generosa, eles vigiam e protegem Oniri dos céus. Sua sociedade é rígida, baseada em disciplina militar e domínio arcano, com ascensão por mérito e uma monarquia definida por feitos. Cultuam apenas as Divindades dos Sonhos, mantêm leis universais e exercem forte influência diplomática.",
    "power": {
      "name": "Vontade de Oniri",
      "description": "Você recebe um bônus na sua DC igual seu nível de Mente + Espírito."
    },
    "energyBonuses": {
      "body": 0,
      "mind": 1,
      "spirit": 1
    }
  },
  {
    "id": "shaqyr",
    "name": "Shaqyr",
    "history": "Um povo nômade nascido no deserto de Shaq’Kesh, cuja sobrevivência transformou o comércio, o movimento e a adaptação em pilares de sua cultura. Governados pela Guilda dos Comerciantes, obtêm poder por meio da riqueza, das rotas, dos contratos e da influência econômica, em vez de reis ou exércitos. Viajam em grandes Cruzadores voadores e utilizam a Porta dos Segredos para transportar mercadorias, mantendo uma presença comercial em praticamente toda Oniri. Sua fé é na negociação e sua cultura valoriza a adaptação, a honestidade e a preservação das boas relações.",
    "power": {
      "name": "Herança Felina",
      "description": "Você não gasta Energia para usar Combater com 2 Armas."
    },
    "energyBonuses": {
      "body": 1,
      "mind": 0,
      "spirit": 1
    }
  },
  {
    "id": "uklith",
    "name": "Uklith",
    "history": "Os Ukliths são um povo nobre dos Morros dos Prismas, uma região formada por montanhas e florestas cristalizadas. Segundo os anciões, seus corpos foram moldados pelo Uklithron, um mineral vivo encontrado nas profundezas do mundo. São mestres na arte de trabalhar gemas e metais, criando joias e artefatos que combinam beleza e poder arcano. Possuem longas orelhas pontudas, corpos imponentes e um único olho feito desse mineral vivo, ele representa sua ligação com o coração mineral de sua origem. Seu reino se estende pelas entranhas das montanhas, onde extraem, lapidam e transformam o Uklithron em obras de perfeição.",
    "power": {
      "name": "Conexão Gemológica",
      "description": "Causa 10% a mais de dano com o Elemento da sua Essência."
    },
    "energyBonuses": {
      "body": 1,
      "mind": 1,
      "spirit": 0
    }
  },
  {
    "id": "vahr-uk",
    "name": "Vahr’Uk",
    "history": "Os Vahr’uk são habitantes das tundras gélidas de Oniri e descendentes distantes dos gigantes trolls. Possuem pele azulada, corpos resistentes ao frio, caninos proeminentes e orelhas pontudas que variam conforme seus clãs. São caçadores excepcionais, graças aos sentidos aguçados, à inteligência e à capacidade de sobreviver em ambientes de extrema escassez. Profundamente supersticiosos, seguem um antigo culto dedicado ao vulcão sagrado Kark’Utaua. Acreditam ser guardiões do equilíbrio entre fogo e gelo, protegendo o mundo contra o aquecimento por meio das nevascas eternas da montanha.",
    "power": {
      "name": "Sangue de Troll",
      "description": "Você tem 1 Reação Extra por rodada, a segunda Reação tem seu custo de Energia aumentado em 1."
    },
    "energyBonuses": {
      "body": 1,
      "mind": 0,
      "spirit": 1
    }
  },
  {
    "id": "humano",
    "name": "Humano",
    "history": "Os Humanos são os primeiros habitantes de Caerya, um outro mundo, distante de Oniri. Movidos pela busca por conhecimentos inalcançáveis se tornaram mestres da Prismaforja e da Cristalquímica, sendo reconhecidos como os mais inteligentes entre os povos dos dois mundos. Sua sociedade segue uma ética própria, baseada na ordem, no poder e no controle, doutrinas que costumam impor a todos que cruzam seu caminho. Durante muito tempo, os Humanos permaneceram restritos a Caerya, mas após a criação dos portais começaram a chegar e estabelecer comunidades em Oniri, carregando fragmentos da sua cultura e desenvolvendo identidades, crenças e costumes próprios.",
    "power": {
      "name": "Espírito dos Curiosos",
      "description": "Você pode escolher 2 Profissões."
    },
    "energyBonuses": {
      "body": 1,
      "mind": 1,
      "spirit": 0
    }
  }
] as const satisfies readonly People[];

export function findPeople(id: string): People | undefined {
  return PEOPLES.find((people) => people.id === id);
}

export interface CidadeData {
  slug: string;
  nome: string;
  populacao: string;
  descricao: string;
  texto: string;
  faq: { pergunta: string; resposta: string }[];
}

export const cidadesData: CidadeData[] = [
  {
    slug: "sorocaba",
    nome: "Sorocaba",
    populacao: "700 mil habitantes",
    descricao: "Sistema de gestão escolar completo para escolas de Sorocaba. Diário de classe digital, controle financeiro, portal do aluno e muito mais.",
    texto: "Sorocaba, com mais de 700 mil habitantes, é um dos maiores polos educacionais do interior paulista. A cidade conta com centenas de escolas particulares e públicas que necessitam de ferramentas modernas de gestão. O i ESCOLAS foi desenvolvido para atender às demandas específicas das instituições de ensino sorocabanas, oferecendo uma plataforma completa que digitaliza processos acadêmicos e administrativos.",
    faq: [
      { pergunta: "O i ESCOLAS atende escolas em Sorocaba?", resposta: "Sim! O i ESCOLAS é uma plataforma de gestão escolar com forte atuação em Sorocaba e toda a região metropolitana, oferecendo suporte local e implementação personalizada." },
      { pergunta: "Quais escolas de Sorocaba usam o i ESCOLAS?", resposta: "Atendemos escolas de educação infantil, ensino fundamental e médio em Sorocaba, incluindo instituições particulares de todos os portes." },
      { pergunta: "Quanto custa o sistema para escolas de Sorocaba?", resposta: "Oferecemos planos a partir de R$ 299/mês, com preço por aluno a partir de R$ 3,90. Consulte nossos planos para encontrar o ideal para sua escola." },
    ],
  },
  {
    slug: "votorantim",
    nome: "Votorantim",
    populacao: "120 mil habitantes",
    descricao: "Gestão escolar digital para escolas de Votorantim. Automatize processos acadêmicos e administrativos com o i ESCOLAS.",
    texto: "Votorantim, cidade vizinha de Sorocaba com cerca de 120 mil habitantes, possui um setor educacional em constante crescimento. As escolas da cidade buscam soluções tecnológicas que otimizem a gestão e melhorem a comunicação com famílias. O i ESCOLAS oferece todas as ferramentas necessárias para escolas de Votorantim modernizarem seus processos.",
    faq: [
      { pergunta: "O i ESCOLAS tem suporte em Votorantim?", resposta: "Sim, oferecemos suporte completo para escolas de Votorantim, incluindo implementação presencial e treinamento da equipe." },
      { pergunta: "Escolas pequenas de Votorantim podem usar o i ESCOLAS?", resposta: "Sim! Temos planos específicos para escolas de todos os portes, desde educação infantil até ensino médio." },
    ],
  },
  {
    slug: "itu",
    nome: "Itu",
    populacao: "175 mil habitantes",
    descricao: "Plataforma de gestão escolar para Itu. Diário digital, financeiro, comunicação com pais e muito mais para escolas ituanas.",
    texto: "Itu, conhecida como a cidade dos exageros, também se destaca no setor educacional com instituições de ensino de qualidade. Com aproximadamente 175 mil habitantes, a cidade demanda soluções digitais que acompanhem o crescimento do setor. O i ESCOLAS está preparado para atender escolas de Itu com tecnologia de ponta em gestão escolar.",
    faq: [
      { pergunta: "O i ESCOLAS funciona em escolas de Itu?", resposta: "Sim! Atendemos escolas de Itu e toda a região, com suporte técnico e implementação completa." },
      { pergunta: "Como contratar o i ESCOLAS em Itu?", resposta: "Basta entrar em contato pelo WhatsApp ou preencher o formulário de cadastro. Nossa equipe fará uma demonstração personalizada." },
    ],
  },
  {
    slug: "salto",
    nome: "Salto",
    populacao: "120 mil habitantes",
    descricao: "Sistema de gestão escolar para escolas de Salto/SP. Modernize sua escola com diário digital, portal do aluno e gestão financeira.",
    texto: "Salto, com cerca de 120 mil habitantes, é uma cidade com forte vocação educacional na região de Sorocaba. As escolas saltenses estão cada vez mais buscando digitalizar seus processos para oferecer melhor experiência a alunos e famílias. O i ESCOLAS é a solução completa para escolas de Salto que desejam evoluir na gestão.",
    faq: [
      { pergunta: "Escolas de Salto podem usar o i ESCOLAS?", resposta: "Sim, atendemos escolas de Salto com todos os módulos da plataforma e suporte dedicado." },
    ],
  },
  {
    slug: "indaiatuba",
    nome: "Indaiatuba",
    populacao: "260 mil habitantes",
    descricao: "Gestão escolar completa para Indaiatuba. Automatize diário de classe, notas, frequência e financeiro da sua escola.",
    texto: "Indaiatuba é uma das cidades que mais cresce no interior de São Paulo, com mais de 260 mil habitantes e um setor educacional robusto. A cidade possui dezenas de escolas particulares que demandam sistemas modernos de gestão. O i ESCOLAS oferece a plataforma ideal para escolas de Indaiatuba que buscam eficiência e inovação.",
    faq: [
      { pergunta: "O i ESCOLAS atende escolas em Indaiatuba?", resposta: "Sim! Indaiatuba faz parte da nossa área de atuação, com suporte completo e implementação personalizada." },
      { pergunta: "Quais módulos estão disponíveis para escolas de Indaiatuba?", resposta: "Todos os módulos: diário de classe, notas, frequência, financeiro, portal do aluno, portal do responsável, comunicação, CRM de matrícula e muito mais." },
    ],
  },
  {
    slug: "aracoiaba-da-serra",
    nome: "Araçoiaba da Serra",
    populacao: "35 mil habitantes",
    descricao: "Sistema de gestão escolar para Araçoiaba da Serra. Plataforma completa para escolas de educação infantil e fundamental.",
    texto: "Araçoiaba da Serra, com aproximadamente 35 mil habitantes, possui escolas que buscam modernizar sua gestão com ferramentas digitais acessíveis. O i ESCOLAS oferece planos adequados para escolas de todos os portes em Araçoiaba, permitindo a digitalização completa dos processos acadêmicos e administrativos.",
    faq: [
      { pergunta: "O i ESCOLAS funciona para escolas pequenas de Araçoiaba da Serra?", resposta: "Sim! Temos planos a partir de R$ 299/mês, ideais para escolas de menor porte." },
    ],
  },
  {
    slug: "piedade",
    nome: "Piedade",
    populacao: "55 mil habitantes",
    descricao: "Plataforma de gestão escolar para escolas de Piedade/SP. Digitalize processos e melhore a comunicação com as famílias.",
    texto: "Piedade, com cerca de 55 mil habitantes na região de Sorocaba, tem escolas que podem se beneficiar da digitalização de processos com o i ESCOLAS. Nossa plataforma oferece todas as ferramentas para gestão acadêmica, financeira e comunicação escolar.",
    faq: [
      { pergunta: "O i ESCOLAS atende escolas de Piedade?", resposta: "Sim, atendemos toda a região de Sorocaba, incluindo Piedade, com suporte remoto e presencial." },
    ],
  },
  {
    slug: "sao-roque",
    nome: "São Roque",
    populacao: "90 mil habitantes",
    descricao: "Gestão escolar digital para São Roque. Sistema completo com diário de classe, portal do aluno e gestão financeira.",
    texto: "São Roque, com cerca de 90 mil habitantes, é uma cidade com tradição educacional na região. As escolas são-roquenses podem contar com o i ESCOLAS para modernizar toda a gestão escolar, desde o diário de classe até o controle financeiro e comunicação com famílias.",
    faq: [
      { pergunta: "Escolas de São Roque podem usar o i ESCOLAS?", resposta: "Sim! Atendemos escolas de São Roque com implementação completa e suporte dedicado." },
    ],
  },
  {
    slug: "mairinque",
    nome: "Mairinque",
    populacao: "48 mil habitantes",
    descricao: "Sistema de gestão escolar para Mairinque. Plataforma completa para digitalizar sua escola.",
    texto: "Mairinque, na região de Sorocaba, tem escolas que podem transformar sua gestão com o i ESCOLAS. Nossa plataforma oferece módulos completos de gestão acadêmica, financeira e administrativa, com planos acessíveis para escolas de todos os portes.",
    faq: [
      { pergunta: "O i ESCOLAS tem planos para escolas de Mairinque?", resposta: "Sim, oferecemos planos a partir de R$ 299/mês com todos os módulos essenciais." },
    ],
  },
  {
    slug: "aluminio",
    nome: "Alumínio",
    populacao: "18 mil habitantes",
    descricao: "Plataforma de gestão escolar para escolas de Alumínio/SP. Digitalize processos acadêmicos e administrativos.",
    texto: "Alumínio, cidade da região de Sorocaba, possui escolas que podem se beneficiar da gestão digital oferecida pelo i ESCOLAS. Com planos acessíveis e módulos completos, é a solução ideal para escolas que desejam modernizar seus processos.",
    faq: [
      { pergunta: "O i ESCOLAS atende a cidade de Alumínio?", resposta: "Sim, atendemos toda a região metropolitana de Sorocaba, incluindo Alumínio." },
    ],
  },
  {
    slug: "ibiuna",
    nome: "Ibiúna",
    populacao: "80 mil habitantes",
    descricao: "Gestão escolar para Ibiúna. Sistema digital completo para escolas de educação infantil, fundamental e médio.",
    texto: "Ibiúna, com aproximadamente 80 mil habitantes, possui escolas em crescimento que demandam soluções modernas de gestão. O i ESCOLAS é a plataforma ideal para escolas de Ibiúna que buscam eficiência, organização e melhor comunicação com as famílias.",
    faq: [
      { pergunta: "Escolas de Ibiúna podem contratar o i ESCOLAS?", resposta: "Sim! Oferecemos suporte para escolas de Ibiúna e toda a região de Sorocaba." },
    ],
  },
  {
    slug: "tatui",
    nome: "Tatuí",
    populacao: "120 mil habitantes",
    descricao: "Sistema de gestão escolar para Tatuí. Diário digital, controle de notas, frequência e gestão financeira em uma só plataforma.",
    texto: "Tatuí, a capital da música com cerca de 120 mil habitantes, possui um cenário educacional diversificado. As escolas tatuianas podem contar com o i ESCOLAS para digitalizar completamente seus processos, desde o diário de classe até a gestão financeira e comunicação com responsáveis.",
    faq: [
      { pergunta: "O i ESCOLAS funciona em Tatuí?", resposta: "Sim! Atendemos escolas de Tatuí e toda a região, com suporte técnico completo." },
    ],
  },
  {
    slug: "boituva",
    nome: "Boituva",
    populacao: "65 mil habitantes",
    descricao: "Plataforma de gestão escolar para Boituva. Modernize sua escola com tecnologia e gestão digital.",
    texto: "Boituva, com cerca de 65 mil habitantes na região de Sorocaba, possui escolas que buscam inovação na gestão. O i ESCOLAS oferece todos os módulos necessários para uma gestão escolar eficiente e moderna em Boituva.",
    faq: [
      { pergunta: "O i ESCOLAS atende escolas de Boituva?", resposta: "Sim, Boituva faz parte da nossa área de atuação com suporte completo." },
    ],
  },
  {
    slug: "cerquilho",
    nome: "Cerquilho",
    populacao: "48 mil habitantes",
    descricao: "Gestão escolar digital para Cerquilho. Sistema completo para escolas de todos os portes.",
    texto: "Cerquilho, na região de Sorocaba, tem escolas que podem se beneficiar da plataforma completa de gestão do i ESCOLAS. Com ferramentas de diário digital, controle financeiro e portal do aluno, modernize a gestão da sua escola em Cerquilho.",
    faq: [
      { pergunta: "Escolas de Cerquilho podem usar o i ESCOLAS?", resposta: "Sim! Oferecemos todos os nossos módulos para escolas de Cerquilho." },
    ],
  },
  {
    slug: "capela-do-alto",
    nome: "Capela do Alto",
    populacao: "20 mil habitantes",
    descricao: "Sistema de gestão escolar para Capela do Alto. Plataforma acessível e completa para sua escola.",
    texto: "Capela do Alto, com aproximadamente 20 mil habitantes na região de Sorocaba, possui escolas que podem modernizar sua gestão com o i ESCOLAS. Oferecemos planos acessíveis e todos os módulos necessários para uma gestão escolar eficiente.",
    faq: [
      { pergunta: "O i ESCOLAS atende Capela do Alto?", resposta: "Sim, atendemos toda a região de Sorocaba, incluindo Capela do Alto, com suporte completo." },
    ],
  },
];

export const getCidadeBySlug = (slug: string): CidadeData | undefined =>
  cidadesData.find((c) => c.slug === slug);

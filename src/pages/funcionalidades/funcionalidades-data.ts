export interface FuncionalidadeData {
  slug: string;
  nome: string;
  titulo: string;
  descricao: string;
  texto: string;
  beneficios: string[];
  icon: string;
  faq: { pergunta: string; resposta: string }[];
}

export const funcionalidadesData: FuncionalidadeData[] = [
  {
    slug: "diario-classe",
    nome: "Diário de Classe Digital",
    titulo: "Diário de Classe Digital | i ESCOLAS",
    descricao: "Diário de classe digital para escolas. Registre aulas, conteúdos e frequência online. Sistema completo de gestão escolar para Sorocaba e região.",
    texto: "O Diário de Classe Digital do i ESCOLAS substitui o caderno físico por uma plataforma intuitiva onde professores registram aulas, conteúdos ministrados, observações e acompanham o progresso das turmas em tempo real. Todas as informações ficam centralizadas e acessíveis a qualquer momento.",
    beneficios: [
      "Registro de aulas e conteúdos online",
      "Controle de frequência integrado",
      "Histórico completo por turma e disciplina",
      "Acesso do coordenador em tempo real",
      "Eliminação de papelada e cadernos físicos",
      "Relatórios automáticos por período",
    ],
    icon: "BookOpen",
    faq: [
      { pergunta: "Como funciona o diário de classe digital?", resposta: "O professor acessa a plataforma, seleciona a turma e disciplina, e registra o conteúdo da aula, frequência dos alunos e observações. Tudo fica salvo automaticamente na nuvem." },
      { pergunta: "É possível migrar o diário físico para o digital?", resposta: "Sim! Oferecemos suporte para importação de dados e treinamento completo da equipe pedagógica." },
    ],
  },
  {
    slug: "gestao-financeira",
    nome: "Gestão Financeira Escolar",
    titulo: "Gestão Financeira Escolar | i ESCOLAS",
    descricao: "Sistema de gestão financeira para escolas. Controle mensalidades, contas a pagar e receber, gere boletos e relatórios financeiros completos.",
    texto: "O módulo de Gestão Financeira do i ESCOLAS oferece controle completo das finanças da sua escola. Gerencie mensalidades, gere boletos e cobranças via PIX, controle inadimplência, emita recibos e tenha relatórios financeiros detalhados para tomada de decisão estratégica.",
    beneficios: [
      "Controle de mensalidades e cobranças",
      "Geração de boletos e PIX automáticos",
      "Relatórios de inadimplência",
      "Contas a pagar e receber",
      "Emissão de recibos digitais",
      "Dashboard financeiro completo",
    ],
    icon: "CreditCard",
    faq: [
      { pergunta: "O sistema gera boletos automaticamente?", resposta: "Sim! Integrado com gateways de pagamento para geração automática de boletos e cobranças via PIX." },
      { pergunta: "É possível controlar a inadimplência?", resposta: "Sim, o sistema oferece relatórios de inadimplência, envio de cobranças automáticas e histórico de negociação." },
    ],
  },
  {
    slug: "portal-aluno",
    nome: "Portal do Aluno",
    titulo: "Portal do Aluno Online | i ESCOLAS",
    descricao: "Portal do aluno digital para escolas. Notas, frequência, materiais didáticos, comunicados e carteirinha digital em uma só plataforma.",
    texto: "O Portal do Aluno do i ESCOLAS oferece um espaço exclusivo onde estudantes acessam suas notas, frequência, materiais didáticos, tarefas, comunicados e carteirinha digital. Uma experiência moderna que engaja o aluno no processo educacional.",
    beneficios: [
      "Consulta de notas e boletins online",
      "Frequência em tempo real",
      "Materiais didáticos e tarefas",
      "Comunicados da escola",
      "Carteirinha digital com QR Code",
      "Interface moderna e intuitiva",
    ],
    icon: "GraduationCap",
    faq: [
      { pergunta: "Os alunos acessam pelo celular?", resposta: "Sim! O portal é totalmente responsivo e pode ser instalado como aplicativo no celular (PWA)." },
      { pergunta: "A carteirinha digital substitui a física?", resposta: "Sim, a carteirinha digital possui QR Code para validação e pode ser apresentada no celular." },
    ],
  },
  {
    slug: "portal-responsavel",
    nome: "Portal do Responsável",
    titulo: "Portal do Responsável | i ESCOLAS",
    descricao: "Portal do responsável para acompanhar o desempenho escolar. Notas, frequência, financeiro, comunicados e nutrição em tempo real.",
    texto: "O Portal do Responsável do i ESCOLAS permite que pais e responsáveis acompanhem de perto a vida escolar dos filhos. Consulte notas, frequência, situação financeira, comunicados, cardápio nutricional e muito mais, tudo pelo celular ou computador.",
    beneficios: [
      "Acompanhamento de notas e frequência",
      "Situação financeira e boletos",
      "Comunicados e avisos da escola",
      "Cardápio nutricional",
      "Acompanhamento maternal",
      "Notificações em tempo real",
    ],
    icon: "Users",
    faq: [
      { pergunta: "Os pais recebem notificações?", resposta: "Sim! O sistema envia notificações sobre notas, faltas, comunicados e vencimento de mensalidades." },
      { pergunta: "É possível ter mais de um responsável por aluno?", resposta: "Sim, cada aluno pode ter múltiplos responsáveis cadastrados, cada um com seu acesso individual." },
    ],
  },
  {
    slug: "comunicacao-escola-familia",
    nome: "Comunicação Escola-Família",
    titulo: "Comunicação Escola-Família Digital | i ESCOLAS",
    descricao: "Sistema de comunicação entre escola e família. Comunicados, avisos, notificações push e canal direto com coordenação pedagógica.",
    texto: "O módulo de Comunicação do i ESCOLAS cria um canal direto e eficiente entre escola e família. Envie comunicados segmentados por turma, série ou aluno, com confirmação de leitura. Notifique sobre eventos, reuniões e informações importantes de forma instantânea.",
    beneficios: [
      "Comunicados segmentados por turma",
      "Confirmação de leitura",
      "Notificações push no celular",
      "Agenda de eventos e reuniões",
      "Canal direto com coordenação",
      "Histórico de comunicações",
    ],
    icon: "MessageSquare",
    faq: [
      { pergunta: "Os pais precisam instalar algum aplicativo?", resposta: "Não é obrigatório. O sistema funciona no navegador, mas também pode ser instalado como PWA para receber notificações push." },
    ],
  },
  {
    slug: "controle-frequencia",
    nome: "Controle de Frequência",
    titulo: "Controle de Frequência Escolar Digital | i ESCOLAS",
    descricao: "Sistema de controle de frequência escolar digital. Registro de presença, faltas, justificativas e relatórios de frequência por aluno.",
    texto: "O Controle de Frequência do i ESCOLAS digitaliza todo o processo de chamada e registro de presença. Professores registram a frequência pelo celular ou computador, e pais são notificados automaticamente sobre faltas. Relatórios completos ajudam na gestão pedagógica.",
    beneficios: [
      "Chamada digital rápida e prática",
      "Notificação automática de faltas",
      "Relatórios de frequência por período",
      "Justificativas de faltas online",
      "Integração com o diário de classe",
      "Percentual de frequência em tempo real",
    ],
    icon: "CheckCircle2",
    faq: [
      { pergunta: "O professor faz a chamada pelo celular?", resposta: "Sim! A chamada pode ser feita pelo celular, tablet ou computador de forma rápida e intuitiva." },
    ],
  },
  {
    slug: "boletins-notas",
    nome: "Boletins e Notas Online",
    titulo: "Boletins e Notas Online | i ESCOLAS",
    descricao: "Sistema de notas e boletins online para escolas. Lançamento de notas, médias automáticas, boletins digitais e relatórios de desempenho.",
    texto: "O módulo de Boletins e Notas do i ESCOLAS automatiza todo o processo de avaliação escolar. Professores lançam notas por avaliação, o sistema calcula médias automaticamente e gera boletins digitais que podem ser consultados por alunos e responsáveis a qualquer momento.",
    beneficios: [
      "Lançamento de notas por avaliação",
      "Cálculo automático de médias",
      "Boletins digitais instantâneos",
      "Relatórios de desempenho por turma",
      "Gráficos de evolução do aluno",
      "Exportação em PDF",
    ],
    icon: "FileText",
    faq: [
      { pergunta: "O sistema calcula as médias automaticamente?", resposta: "Sim! Você configura a fórmula de cálculo (média aritmética, ponderada, etc.) e o sistema calcula automaticamente." },
      { pergunta: "Os boletins podem ser impressos?", resposta: "Sim, os boletins podem ser visualizados online, exportados em PDF ou impressos." },
    ],
  },
  {
    slug: "matricula-crm",
    nome: "Matrícula e CRM",
    titulo: "CRM de Matrícula Escolar | i ESCOLAS",
    descricao: "Sistema de CRM para matrícula escolar. Funil de captação de alunos, gestão de leads, contratos digitais e acompanhamento de conversão.",
    texto: "O CRM de Matrícula do i ESCOLAS transforma o processo de captação de novos alunos. Gerencie leads, acompanhe o funil de conversão, envie propostas personalizadas e digitalize contratos. Aumente suas matrículas com gestão profissional do relacionamento com famílias interessadas.",
    beneficios: [
      "Funil de captação de alunos",
      "Gestão de leads e contatos",
      "Contratos digitais",
      "Acompanhamento de conversão",
      "Propostas personalizadas",
      "Relatórios de captação",
    ],
    icon: "TrendingUp",
    faq: [
      { pergunta: "O CRM ajuda a aumentar matrículas?", resposta: "Sim! Com o funil de captação e gestão de leads, sua escola terá visibilidade completa do processo de matrícula e poderá otimizar a conversão." },
    ],
  },
];

export const getFuncionalidadeBySlug = (slug: string): FuncionalidadeData | undefined =>
  funcionalidadesData.find((f) => f.slug === slug);

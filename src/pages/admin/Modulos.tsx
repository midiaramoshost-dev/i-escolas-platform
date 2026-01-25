import { motion } from "framer-motion";
import {
  Layers,
  GraduationCap,
  DollarSign,
  MessageSquare,
  Calendar,
  FileText,
  Users,
  Settings,
  BookOpen,
  ClipboardCheck,
  BarChart3,
  Bell,
  Shield,
  Smartphone,
  Puzzle,
  Check,
  X,
  Building2,
  AlertTriangle,
  Lock,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { toast } from "sonner";

interface Modulo {
  id: string;
  nome: string;
  descricao: string;
  icone: React.ElementType;
  categoria: "academico" | "financeiro" | "comunicacao" | "administrativo" | "avancado";
  planoMinimo: "Free" | "Start" | "Pro" | "Premium";
  ativo: boolean;
  submodulos?: { id: string; nome: string; ativo: boolean }[];
}

const modulosIniciais: Modulo[] = [
  // Acadêmico
  {
    id: "diario_classe",
    nome: "Diário de Classe Digital",
    descricao: "Registro de aulas, frequência e conteúdo lecionado",
    icone: BookOpen,
    categoria: "academico",
    planoMinimo: "Free",
    ativo: true,
    submodulos: [
      { id: "registro_aulas", nome: "Registro de Aulas", ativo: true },
      { id: "chamada", nome: "Chamada Digital", ativo: true },
      { id: "conteudo", nome: "Conteúdo Programático", ativo: true },
    ],
  },
  {
    id: "notas",
    nome: "Gestão de Notas",
    descricao: "Lançamento e acompanhamento de notas e médias",
    icone: ClipboardCheck,
    categoria: "academico",
    planoMinimo: "Free",
    ativo: true,
    submodulos: [
      { id: "lancamento_notas", nome: "Lançamento de Notas", ativo: true },
      { id: "medias", nome: "Cálculo de Médias", ativo: true },
      { id: "recuperacao", nome: "Recuperação", ativo: true },
    ],
  },
  {
    id: "frequencia",
    nome: "Controle de Frequência",
    descricao: "Gestão de presença e faltas dos alunos",
    icone: Calendar,
    categoria: "academico",
    planoMinimo: "Free",
    ativo: true,
  },
  {
    id: "boletins",
    nome: "Boletins Automáticos",
    descricao: "Geração automática de boletins por bimestre",
    icone: FileText,
    categoria: "academico",
    planoMinimo: "Start",
    ativo: true,
  },
  {
    id: "matriculas",
    nome: "Gestão de Matrículas",
    descricao: "Processo de matrícula e rematrícula online",
    icone: GraduationCap,
    categoria: "academico",
    planoMinimo: "Pro",
    ativo: true,
  },
  // Financeiro
  {
    id: "mensalidades",
    nome: "Gestão de Mensalidades",
    descricao: "Controle de mensalidades, boletos e cobranças",
    icone: DollarSign,
    categoria: "financeiro",
    planoMinimo: "Start",
    ativo: true,
    submodulos: [
      { id: "geracao_boletos", nome: "Geração de Boletos", ativo: true },
      { id: "pix", nome: "Pagamento via Pix", ativo: true },
      { id: "cartao", nome: "Pagamento via Cartão", ativo: true },
      { id: "recorrencia", nome: "Cobrança Recorrente", ativo: true },
    ],
  },
  {
    id: "inadimplencia",
    nome: "Gestão de Inadimplência",
    descricao: "Controle e cobrança de mensalidades atrasadas",
    icone: BarChart3,
    categoria: "financeiro",
    planoMinimo: "Pro",
    ativo: true,
  },
  {
    id: "relatorios_financeiros",
    nome: "Relatórios Financeiros",
    descricao: "Relatórios detalhados de receitas e inadimplência",
    icone: FileText,
    categoria: "financeiro",
    planoMinimo: "Pro",
    ativo: true,
  },
  // Comunicação
  {
    id: "comunicados",
    nome: "Central de Comunicados",
    descricao: "Envio de comunicados para pais e alunos",
    icone: MessageSquare,
    categoria: "comunicacao",
    planoMinimo: "Free",
    ativo: true,
  },
  {
    id: "notificacoes_push",
    nome: "Notificações Push",
    descricao: "Notificações em tempo real no aplicativo",
    icone: Bell,
    categoria: "comunicacao",
    planoMinimo: "Pro",
    ativo: true,
  },
  {
    id: "chat_escola",
    nome: "Chat Escola-Família",
    descricao: "Comunicação direta entre escola e responsáveis",
    icone: Smartphone,
    categoria: "comunicacao",
    planoMinimo: "Premium",
    ativo: false,
  },
  // Administrativo
  {
    id: "gestao_turmas",
    nome: "Gestão de Turmas",
    descricao: "Cadastro e gerenciamento de turmas e séries",
    icone: Users,
    categoria: "administrativo",
    planoMinimo: "Free",
    ativo: true,
  },
  {
    id: "gestao_professores",
    nome: "Gestão de Professores",
    descricao: "Cadastro e gestão de docentes",
    icone: Users,
    categoria: "administrativo",
    planoMinimo: "Free",
    ativo: true,
  },
  {
    id: "configuracoes_escola",
    nome: "Configurações da Escola",
    descricao: "Personalização de logo, cores e dados",
    icone: Settings,
    categoria: "administrativo",
    planoMinimo: "Free",
    ativo: true,
  },
  // Avançado
  {
    id: "api_integracao",
    nome: "API de Integração",
    descricao: "Acesso à API para integrações externas",
    icone: Puzzle,
    categoria: "avancado",
    planoMinimo: "Premium",
    ativo: false,
  },
  {
    id: "sso",
    nome: "Single Sign-On (SSO)",
    descricao: "Login único com Google, Microsoft, etc.",
    icone: Shield,
    categoria: "avancado",
    planoMinimo: "Premium",
    ativo: false,
  },
];

const categorias = [
  { id: "academico", nome: "Acadêmico", icone: GraduationCap, cor: "text-blue-500 bg-blue-500/10" },
  { id: "financeiro", nome: "Financeiro", icone: DollarSign, cor: "text-green-500 bg-green-500/10" },
  { id: "comunicacao", nome: "Comunicação", icone: MessageSquare, cor: "text-purple-500 bg-purple-500/10" },
  { id: "administrativo", nome: "Administrativo", icone: Settings, cor: "text-orange-500 bg-orange-500/10" },
  { id: "avancado", nome: "Avançado", icone: Puzzle, cor: "text-rose-500 bg-rose-500/10" },
];

// Escolas mock para demonstração
const escolasMock = [
  { id: "1", nome: "Colégio São Paulo", plano: "Premium" },
  { id: "2", nome: "Escola Municipal Centro", plano: "Pro" },
  { id: "3", nome: "Instituto Educacional ABC", plano: "Start" },
  { id: "4", nome: "Colégio Novo Horizonte", plano: "Premium" },
  { id: "5", nome: "Escola Estadual Central", plano: "Free" },
  { id: "6", nome: "Colégio Esperança", plano: "Start" },
];

// Hierarquia de planos (índice maior = plano superior)
const planoHierarquia: Record<string, number> = {
  "Free": 0,
  "Start": 1,
  "Pro": 2,
  "Premium": 3,
};

const getPlanoColor = (plano: string) => {
  switch (plano) {
    case "Free": return "bg-muted text-muted-foreground";
    case "Start": return "bg-blue-500/10 text-blue-500";
    case "Pro": return "bg-purple-500/10 text-purple-500";
    case "Premium": return "bg-rose-500/10 text-rose-500";
    default: return "bg-muted text-muted-foreground";
  }
};

// Verifica se o plano da escola permite o módulo
const planoPermiteModulo = (planoEscola: string, planoMinimo: string): boolean => {
  return planoHierarquia[planoEscola] >= planoHierarquia[planoMinimo];
};

export default function AdminModulos() {
  const [modulos, setModulos] = useState<Modulo[]>(modulosIniciais);
  const [escolaSelecionada, setEscolaSelecionada] = useState<string>("global");
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [moduloPendente, setModuloPendente] = useState<{ id: string; nome: string; planoMinimo: string } | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const escolaAtual = escolasMock.find(e => e.id === escolaSelecionada);
  const planoAtual = escolaAtual?.plano || "Premium"; // Global = acesso total

  const handleToggleModulo = (moduloId: string) => {
    const modulo = modulos.find(m => m.id === moduloId);
    if (!modulo) return;

    // Se está desativando, permite sempre
    if (modulo.ativo) {
      setModulos(modulos.map(m => 
        m.id === moduloId ? { ...m, ativo: false } : m
      ));
      toast.success(`Módulo "${modulo.nome}" desativado com sucesso!`);
      return;
    }

    // Se está ativando, verificar plano
    if (escolaSelecionada !== "global" && !planoPermiteModulo(planoAtual, modulo.planoMinimo)) {
      setModuloPendente({ id: modulo.id, nome: modulo.nome, planoMinimo: modulo.planoMinimo });
      setAlertDialogOpen(true);
      return;
    }

    // Plano permite, ativa diretamente
    setModulos(modulos.map(m => 
      m.id === moduloId ? { ...m, ativo: true } : m
    ));
    toast.success(`Módulo "${modulo.nome}" ativado com sucesso!`);
  };

  const handleToggleSubmodulo = (moduloId: string, submoduloId: string) => {
    setModulos(modulos.map(m => 
      m.id === moduloId 
        ? {
            ...m,
            submodulos: m.submodulos?.map(s => 
              s.id === submoduloId ? { ...s, ativo: !s.ativo } : s
            )
          }
        : m
    ));
  };

  const modulosPorCategoria = (categoriaId: string) => 
    modulos.filter(m => m.categoria === categoriaId);

  const totalModulos = modulos.length;
  const modulosAtivos = modulos.filter(m => m.ativo).length;

  // Verifica se módulo está bloqueado para a escola selecionada
  const isModuloBloqueado = (planoMinimo: string): boolean => {
    if (escolaSelecionada === "global") return false;
    return !planoPermiteModulo(planoAtual, planoMinimo);
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Módulos do Sistema</h1>
          <p className="text-muted-foreground">
            Configure quais módulos estarão disponíveis para as escolas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-500/10 text-green-500">
            <Check className="mr-1 h-3 w-3" />
            {modulosAtivos} Ativos
          </Badge>
          <Badge className="bg-muted text-muted-foreground">
            <Layers className="mr-1 h-3 w-3" />
            {totalModulos} Total
          </Badge>
        </div>
      </motion.div>

      {/* Seletor de Escola */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Visualizar por Escola</p>
                  <p className="text-sm text-muted-foreground">
                    Selecione uma escola para verificar quais módulos estão disponíveis para o plano dela
                  </p>
                </div>
              </div>
              <Select value={escolaSelecionada} onValueChange={setEscolaSelecionada}>
                <SelectTrigger className="w-full md:w-72">
                  <SelectValue placeholder="Selecione uma escola" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Configuração Global (Todas)
                    </div>
                  </SelectItem>
                  {escolasMock.map((escola) => (
                    <SelectItem key={escola.id} value={escola.id}>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        {escola.nome}
                        <Badge className={`${getPlanoColor(escola.plano)} ml-2`}>
                          {escola.plano}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {escolaSelecionada !== "global" && escolaAtual && (
              <div className="mt-4 p-3 rounded-lg bg-muted/50 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <p className="text-sm">
                  <span className="font-medium">{escolaAtual.nome}</span> está no plano{" "}
                  <Badge className={getPlanoColor(escolaAtual.plano)}>{escolaAtual.plano}</Badge>.
                  Módulos que exigem um plano superior aparecerão bloqueados.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Resumo por Categoria */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-5">
        {categorias.map((cat) => {
          const modulosCat = modulosPorCategoria(cat.id);
          const ativosCat = modulosCat.filter(m => m.ativo).length;
          return (
            <Card key={cat.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2 ${cat.cor}`}>
                    <cat.icone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{cat.nome}</p>
                    <p className="text-xs text-muted-foreground">{ativosCat}/{modulosCat.length} ativos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      {/* Módulos por Categoria */}
      {categorias.map((cat) => (
        <motion.div key={cat.id} variants={itemVariants}>
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <div className={`rounded-lg p-2 ${cat.cor}`}>
                  <cat.icone className="h-5 w-5" />
                </div>
                {cat.nome}
              </CardTitle>
              <CardDescription>
                Módulos relacionados à gestão {cat.nome.toLowerCase()} da escola
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {modulosPorCategoria(cat.id).map((modulo, index) => (
                <div key={modulo.id}>
                  {index > 0 && <Separator className="my-4" />}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`rounded-lg p-2 ${isModuloBloqueado(modulo.planoMinimo) ? "bg-muted/50" : "bg-muted"}`}>
                          <modulo.icone className={`h-5 w-5 ${isModuloBloqueado(modulo.planoMinimo) ? "text-muted-foreground/50" : "text-muted-foreground"}`} />
                        </div>
                        <div className={isModuloBloqueado(modulo.planoMinimo) ? "opacity-60" : ""}>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{modulo.nome}</p>
                            <Badge className={getPlanoColor(modulo.planoMinimo)}>
                              {modulo.planoMinimo}+
                            </Badge>
                            {isModuloBloqueado(modulo.planoMinimo) && (
                              <Tooltip>
                                <TooltipTrigger>
                                  <Badge className="bg-amber-500/10 text-amber-500">
                                    <Lock className="mr-1 h-3 w-3" />
                                    Bloqueado
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Este módulo requer o plano {modulo.planoMinimo} ou superior.</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    A escola selecionada está no plano {planoAtual}.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{modulo.descricao}</p>
                        </div>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Switch
                              checked={modulo.ativo}
                              onCheckedChange={() => handleToggleModulo(modulo.id)}
                              disabled={isModuloBloqueado(modulo.planoMinimo) && !modulo.ativo}
                            />
                          </div>
                        </TooltipTrigger>
                        {isModuloBloqueado(modulo.planoMinimo) && !modulo.ativo && (
                          <TooltipContent>
                            <p>Faça upgrade do plano para ativar este módulo</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </div>
                    
                    {/* Submódulos */}
                    {modulo.submodulos && modulo.ativo && (
                      <div className="ml-12 pl-4 border-l-2 border-muted space-y-2">
                        {modulo.submodulos.map((sub) => (
                          <div key={sub.id} className="flex items-center justify-between py-1">
                            <span className="text-sm text-muted-foreground">{sub.nome}</span>
                            <Switch
                              checked={sub.ativo}
                              onCheckedChange={() => handleToggleSubmodulo(modulo.id, sub.id)}
                              className="scale-90"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {/* Botão Salvar */}
      <motion.div variants={itemVariants} className="flex justify-end">
        <Button 
          className="bg-rose-500 hover:bg-rose-600"
          onClick={() => toast.success("Configuração de módulos salva com sucesso!")}
        >
          Salvar Configurações
        </Button>
      </motion.div>

      {/* Alert Dialog para módulo bloqueado */}
      <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-amber-500" />
              Módulo não disponível para este plano
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>
                O módulo <span className="font-medium text-foreground">{moduloPendente?.nome}</span> requer 
                o plano <Badge className={getPlanoColor(moduloPendente?.planoMinimo || "")}>{moduloPendente?.planoMinimo}</Badge> ou superior.
              </p>
              <p>
                A escola <span className="font-medium">{escolaAtual?.nome}</span> está atualmente no plano{" "}
                <Badge className={getPlanoColor(planoAtual)}>{planoAtual}</Badge>.
              </p>
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 mt-4">
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  Para ativar este módulo, é necessário fazer upgrade do plano da escola para{" "}
                  <span className="font-medium">{moduloPendente?.planoMinimo}</span> ou superior.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-rose-500 hover:bg-rose-600"
              onClick={() => {
                toast.info("Redirecionando para a página de planos...");
                setAlertDialogOpen(false);
              }}
            >
              Ver Planos
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}

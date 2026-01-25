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
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
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

const getPlanoColor = (plano: string) => {
  switch (plano) {
    case "Free": return "bg-muted text-muted-foreground";
    case "Start": return "bg-blue-500/10 text-blue-500";
    case "Pro": return "bg-purple-500/10 text-purple-500";
    case "Premium": return "bg-rose-500/10 text-rose-500";
    default: return "bg-muted text-muted-foreground";
  }
};

export default function AdminModulos() {
  const [modulos, setModulos] = useState<Modulo[]>(modulosIniciais);

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

  const handleToggleModulo = (moduloId: string) => {
    setModulos(modulos.map(m => 
      m.id === moduloId ? { ...m, ativo: !m.ativo } : m
    ));
    const modulo = modulos.find(m => m.id === moduloId);
    if (modulo) {
      toast.success(`Módulo "${modulo.nome}" ${modulo.ativo ? "desativado" : "ativado"} com sucesso!`);
    }
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
                        <div className="rounded-lg p-2 bg-muted">
                          <modulo.icone className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{modulo.nome}</p>
                            <Badge className={getPlanoColor(modulo.planoMinimo)}>
                              {modulo.planoMinimo}+
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{modulo.descricao}</p>
                        </div>
                      </div>
                      <Switch
                        checked={modulo.ativo}
                        onCheckedChange={() => handleToggleModulo(modulo.id)}
                      />
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
    </motion.div>
  );
}

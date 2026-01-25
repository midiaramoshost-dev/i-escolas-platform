import { motion } from "framer-motion";
import {
  MessageSquare,
  Bell,
  Calendar,
  AlertCircle,
  Info,
  Megaphone,
  CheckCircle,
  ChevronRight,
  Pin,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

const dependentes = [
  { id: "1", nome: "Ana Beatriz", turma: "5º Ano A", iniciais: "AB" },
  { id: "2", nome: "Pedro Silva", turma: "3º Ano B", iniciais: "PS" },
];

const comunicadosGerais = [
  {
    id: "g1",
    titulo: "Reunião de Pais e Mestres - 1º Semestre",
    tipo: "reuniao",
    data: "2024-05-20",
    remetente: "Coordenação Pedagógica",
    lido: false,
    fixado: true,
    conteudo: "Prezados pais e responsáveis, convidamos para a Reunião de Pais e Mestres que acontecerá no dia 25 de maio, às 19h, no auditório da escola.",
    prioridade: "alta",
    paraQuem: "geral",
  },
  {
    id: "g2",
    titulo: "Calendário de Provas - 2º Bimestre",
    tipo: "aviso",
    data: "2024-05-18",
    remetente: "Secretaria Escolar",
    lido: false,
    fixado: true,
    conteudo: "Informamos o calendário de provas do 2º bimestre. As provas iniciam às 7h30.",
    prioridade: "alta",
    paraQuem: "geral",
  },
  {
    id: "g3",
    titulo: "Festa Junina - Participação das Turmas",
    tipo: "evento",
    data: "2024-05-08",
    remetente: "Coordenação de Eventos",
    lido: true,
    fixado: false,
    conteudo: "A Festa Junina acontecerá no dia 29/06. Contamos com a participação de todos!",
    prioridade: "media",
    paraQuem: "geral",
  },
];

const comunicadosPorDependente: Record<string, any[]> = {
  "1": [
    {
      id: "a1",
      titulo: "Desempenho em Matemática - Ana Beatriz",
      tipo: "informativo",
      data: "2024-05-19",
      remetente: "Prof. Carlos - Matemática",
      lido: false,
      fixado: false,
      conteudo: "Informo que Ana Beatriz teve um excelente desempenho na última avaliação de matemática. Continue acompanhando os estudos em casa.",
      prioridade: "baixa",
    },
    {
      id: "a2",
      titulo: "Autorização para Passeio - Museu",
      tipo: "aviso",
      data: "2024-05-15",
      remetente: "Profª Paula - História",
      lido: true,
      fixado: false,
      conteudo: "Favor assinar a autorização para o passeio ao museu no dia 20/06. Custo: R$ 25,00.",
      prioridade: "alta",
    },
  ],
  "2": [
    {
      id: "p1",
      titulo: "Atenção às Faltas - Pedro Silva",
      tipo: "aviso",
      data: "2024-05-21",
      remetente: "Coordenação Pedagógica",
      lido: false,
      fixado: true,
      conteudo: "Gostaríamos de conversar sobre as faltas recentes de Pedro. Por favor, entre em contato com a coordenação.",
      prioridade: "alta",
    },
    {
      id: "p2",
      titulo: "Material Escolar - Reposição",
      tipo: "informativo",
      data: "2024-05-14",
      remetente: "Profª Maria - Classe",
      lido: true,
      fixado: false,
      conteudo: "Solicitamos a reposição dos materiais de artes: cola, tesoura e papel colorido.",
      prioridade: "media",
    },
  ],
};

const getTipoIcon = (tipo: string) => {
  switch (tipo) {
    case "reuniao": return <Calendar className="h-5 w-5" />;
    case "aviso": return <AlertCircle className="h-5 w-5" />;
    case "evento": return <Megaphone className="h-5 w-5" />;
    default: return <Info className="h-5 w-5" />;
  }
};

const getTipoColor = (tipo: string) => {
  switch (tipo) {
    case "reuniao": return "bg-purple-500/10 text-purple-500";
    case "aviso": return "bg-red-500/10 text-red-500";
    case "evento": return "bg-blue-500/10 text-blue-500";
    default: return "bg-gray-500/10 text-gray-500";
  }
};

const getPrioridadeColor = (prioridade: string) => {
  switch (prioridade) {
    case "alta": return "bg-red-500/10 text-red-500 border-red-500/20";
    case "media": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    default: return "bg-green-500/10 text-green-500 border-green-500/20";
  }
};

export default function ResponsavelComunicados() {
  const [tabAtiva, setTabAtiva] = useState("todos");
  const [dependenteSelecionado, setDependenteSelecionado] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const getComunicados = () => {
    let todos = [...comunicadosGerais];
    Object.values(comunicadosPorDependente).forEach(comuns => {
      todos = [...todos, ...comuns];
    });
    todos.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
    
    switch (tabAtiva) {
      case "nao-lidos": return todos.filter(c => !c.lido);
      case "fixados": return todos.filter(c => c.fixado);
      default: return todos;
    }
  };

  const comunicados = getComunicados();
  const totalNaoLidos = getComunicados().filter(c => !c.lido).length;

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Comunicados</h1>
          <p className="text-muted-foreground">Mensagens da escola e dos professores</p>
        </div>
        <Badge className="bg-violet-500/10 text-violet-500 self-start md:self-auto">
          <Bell className="mr-1 h-3 w-3" />
          {totalNaoLidos} não lidos
        </Badge>
      </motion.div>

      {/* Resumo */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-3xl font-bold">{comunicados.length}</p>
              </div>
              <div className="rounded-full p-3 bg-blue-500/10">
                <MessageSquare className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Não Lidos</p>
                <p className="text-3xl font-bold text-orange-500">{totalNaoLidos}</p>
              </div>
              <div className="rounded-full p-3 bg-orange-500/10">
                <Bell className="h-8 w-8 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fixados</p>
                <p className="text-3xl font-bold text-purple-500">{comunicados.filter(c => c.fixado).length}</p>
              </div>
              <div className="rounded-full p-3 bg-purple-500/10">
                <Pin className="h-8 w-8 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Lidos</p>
                <p className="text-3xl font-bold text-green-500">{comunicados.filter(c => c.lido).length}</p>
              </div>
              <div className="rounded-full p-3 bg-green-500/10">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filtro por Dependente */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4 flex-wrap">
              <Users className="h-5 w-5 text-violet-500" />
              <span className="font-medium">Filtrar por filho:</span>
              <div className="flex gap-2">
                <Button
                  variant={dependenteSelecionado === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDependenteSelecionado(null)}
                >
                  Todos
                </Button>
                {dependentes.map((dep) => (
                  <Button
                    key={dep.id}
                    variant={dependenteSelecionado === dep.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDependenteSelecionado(dep.id)}
                    className="flex items-center gap-2"
                  >
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="text-[10px] bg-violet-500 text-white">{dep.iniciais}</AvatarFallback>
                    </Avatar>
                    {dep.nome}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs value={tabAtiva} onValueChange={setTabAtiva}>
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="nao-lidos">Não Lidos</TabsTrigger>
            <TabsTrigger value="fixados">Fixados</TabsTrigger>
          </TabsList>

          <TabsContent value={tabAtiva} className="mt-6">
            <div className="space-y-4">
              {comunicados.map((comunicado) => (
                <motion.div key={comunicado.id} variants={itemVariants} whileHover={{ scale: 1.01 }}>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Card className={`cursor-pointer transition-all hover:shadow-md ${
                        !comunicado.lido ? "border-l-4 border-l-violet-500 bg-violet-500/5" : ""
                      }`}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-full shrink-0 ${getTipoColor(comunicado.tipo)}`}>
                              {getTipoIcon(comunicado.tipo)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-semibold">{comunicado.titulo}</h3>
                                  {comunicado.fixado && <Pin className="h-4 w-4 text-purple-500" />}
                                  {!comunicado.lido && (
                                    <Badge className="bg-violet-500/10 text-violet-500 text-[10px]">Novo</Badge>
                                  )}
                                </div>
                                <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{comunicado.remetente}</p>
                              <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{comunicado.conteudo}</p>
                              <div className="flex items-center gap-3 mt-3">
                                <Badge variant="outline" className={getPrioridadeColor(comunicado.prioridade)}>
                                  {comunicado.prioridade}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(comunicado.data).toLocaleDateString("pt-BR")}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <div className="flex items-center gap-2">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${getTipoColor(comunicado.tipo)}`}>
                            {getTipoIcon(comunicado.tipo)}
                          </div>
                          <div>
                            <DialogTitle>{comunicado.titulo}</DialogTitle>
                            <DialogDescription>
                              {comunicado.remetente} • {new Date(comunicado.data).toLocaleDateString("pt-BR")}
                            </DialogDescription>
                          </div>
                        </div>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <p className="text-sm whitespace-pre-line">{comunicado.conteudo}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getPrioridadeColor(comunicado.prioridade)}>
                            Prioridade {comunicado.prioridade}
                          </Badge>
                          <Badge variant="outline" className={getTipoColor(comunicado.tipo)}>
                            {comunicado.tipo}
                          </Badge>
                        </div>
                        <Button className="w-full bg-violet-500 hover:bg-violet-600">
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Marcar como Lido
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </motion.div>
              ))}

              {comunicados.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-lg">Nenhum comunicado</h3>
                  <p className="text-muted-foreground">Não há comunicados nesta categoria</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}

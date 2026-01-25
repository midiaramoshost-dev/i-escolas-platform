import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Calendar,
  ClipboardCheck,
  MessageSquare,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Bell,
  ChevronRight,
  GraduationCap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const filhos = [
  {
    id: "1",
    nome: "Ana Beatriz",
    turma: "5º Ano A",
    turno: "Manhã",
    foto: null,
    iniciais: "AB",
    cor: "bg-emerald-500",
    mediaGeral: 8.5,
    frequencia: 96,
    tarefasPendentes: 3,
  },
  {
    id: "2",
    nome: "Pedro Silva",
    turma: "3º Ano B",
    turno: "Manhã",
    foto: null,
    iniciais: "PS",
    cor: "bg-blue-500",
    mediaGeral: 7.8,
    frequencia: 92,
    tarefasPendentes: 2,
  },
];

const statsCards = [
  {
    title: "Filhos Matriculados",
    value: "2",
    description: "Ano letivo 2024",
    icon: Users,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  {
    title: "Média Geral",
    value: "8.2",
    description: "Ambos os filhos",
    icon: TrendingUp,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    title: "Comunicados",
    value: "4",
    description: "Não lidos",
    icon: MessageSquare,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    title: "Próximo Vencimento",
    value: "R$ 850",
    description: "Vence em 5 dias",
    icon: CreditCard,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
];

const comunicadosRecentes = [
  {
    id: "1",
    titulo: "Reunião de Pais - 1º Bimestre",
    descricao: "Convocação para reunião dia 28/01 às 19h",
    data: "2024-01-22",
    tipo: "reuniao",
    lido: false,
    filho: "Geral",
  },
  {
    id: "2",
    titulo: "Calendário de Provas - 5º Ano",
    descricao: "Período de provas: 05/02 a 09/02",
    data: "2024-01-20",
    tipo: "aviso",
    lido: false,
    filho: "Ana Beatriz",
  },
  {
    id: "3",
    titulo: "Passeio Pedagógico - 3º Ano",
    descricao: "Autorização necessária até 25/01",
    data: "2024-01-19",
    tipo: "autorizacao",
    lido: false,
    filho: "Pedro Silva",
  },
  {
    id: "4",
    titulo: "Horário de Atendimento Secretaria",
    descricao: "Novo horário: 7h30 às 17h",
    data: "2024-01-18",
    lido: true,
    filho: "Geral",
  },
];

const proximosEventos = [
  { titulo: "Reunião de Pais", data: "28/01", tipo: "reuniao" },
  { titulo: "Início das Provas", data: "05/02", tipo: "prova" },
  { titulo: "Feriado - Carnaval", data: "12/02", tipo: "feriado" },
  { titulo: "Entrega de Boletins", data: "01/03", tipo: "boletim" },
];

export default function ResponsavelDashboard() {
  const [selectedFilho, setSelectedFilho] = useState(filhos[0].id);

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

  const filhoAtual = filhos.find((f) => f.id === selectedFilho) || filhos[0];

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header de Boas-vindas */}
      <motion.div variants={itemVariants} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-violet-500 text-white text-xl">MS</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Olá, Maria Silva! 👋</h1>
            <p className="text-muted-foreground">
              Acompanhe o desempenho escolar dos seus filhos
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Calendário
          </Button>
          <Button className="bg-violet-500 hover:bg-violet-600 text-white">
            <Bell className="mr-2 h-4 w-4" />
            Notificações
            <Badge className="ml-2 bg-white/20 text-white">4</Badge>
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => (
          <motion.div
            key={stat.title}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                  </div>
                  <div className={`rounded-full p-3 ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Cards dos Filhos */}
      <motion.div variants={itemVariants}>
        <h2 className="text-lg font-semibold mb-4">Meus Filhos</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {filhos.map((filho) => (
            <motion.div
              key={filho.id}
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card
                className={`cursor-pointer transition-all ${
                  selectedFilho === filho.id
                    ? "ring-2 ring-violet-500 bg-violet-500/5"
                    : "hover:bg-muted/50"
                }`}
                onClick={() => setSelectedFilho(filho.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={filho.foto || undefined} />
                      <AvatarFallback className={`${filho.cor} text-white text-lg`}>
                        {filho.iniciais}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{filho.nome}</h3>
                          <p className="text-sm text-muted-foreground">
                            {filho.turma} • {filho.turno}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="text-center p-2 rounded-lg bg-muted/50">
                          <p className="text-lg font-bold text-green-500">{filho.mediaGeral}</p>
                          <p className="text-xs text-muted-foreground">Média</p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-muted/50">
                          <p className="text-lg font-bold text-blue-500">{filho.frequencia}%</p>
                          <p className="text-xs text-muted-foreground">Frequência</p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-muted/50">
                          <p className="text-lg font-bold text-orange-500">{filho.tarefasPendentes}</p>
                          <p className="text-xs text-muted-foreground">Tarefas</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Desempenho do Filho Selecionado */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={`${filhoAtual.cor} text-white`}>
                      {filhoAtual.iniciais}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">Desempenho de {filhoAtual.nome}</CardTitle>
                    <CardDescription>{filhoAtual.turma}</CardDescription>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Ver Detalhes
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="notas">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="notas">Notas</TabsTrigger>
                  <TabsTrigger value="frequencia">Frequência</TabsTrigger>
                  <TabsTrigger value="tarefas">Tarefas</TabsTrigger>
                </TabsList>

                <TabsContent value="notas" className="mt-4">
                  <div className="space-y-4">
                    {[
                      { disciplina: "Matemática", av1: 8.5, av2: 9.0, media: 8.75 },
                      { disciplina: "Português", av1: 8.0, av2: 8.5, media: 8.25 },
                      { disciplina: "Ciências", av1: 7.5, av2: 8.0, media: 7.75 },
                      { disciplina: "História", av1: 9.0, av2: 9.5, media: 9.25 },
                      { disciplina: "Geografia", av1: 8.0, av2: 8.0, media: 8.0 },
                    ].map((nota, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <span className="font-medium">{nota.disciplina}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">AV1: {nota.av1}</span>
                          <span className="text-sm text-muted-foreground">AV2: {nota.av2}</span>
                          <span className={`font-bold ${
                            nota.media >= 7 ? "text-green-500" : "text-red-500"
                          }`}>
                            Média: {nota.media.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="frequencia" className="mt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div>
                        <p className="text-2xl font-bold text-blue-500">{filhoAtual.frequencia}%</p>
                        <p className="text-sm text-muted-foreground">Frequência no bimestre</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">48 aulas</p>
                        <p className="text-sm text-muted-foreground">2 faltas</p>
                      </div>
                    </div>
                    <Progress value={filhoAtual.frequencia} className="h-3" />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-green-500/10 text-center">
                        <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-1" />
                        <p className="font-medium text-green-600 dark:text-green-400">Frequência adequada</p>
                        <p className="text-xs text-muted-foreground">Acima de 75%</p>
                      </div>
                      <div className="p-3 rounded-lg bg-blue-500/10 text-center">
                        <Calendar className="h-6 w-6 text-blue-500 mx-auto mb-1" />
                        <p className="font-medium text-blue-600 dark:text-blue-400">Janeiro</p>
                        <p className="text-xs text-muted-foreground">Mês atual</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="tarefas" className="mt-4">
                  <div className="space-y-3">
                    {[
                      { titulo: "Exercícios de Matemática", disciplina: "Matemática", prazo: "25/01", status: "pendente" },
                      { titulo: "Redação: Meio Ambiente", disciplina: "Português", prazo: "26/01", status: "pendente" },
                      { titulo: "Relatório de Experiência", disciplina: "Ciências", prazo: "28/01", status: "pendente" },
                      { titulo: "Questionário Cap. 5", disciplina: "História", prazo: "22/01", status: "entregue" },
                    ].map((tarefa, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div className={`h-2 w-2 rounded-full ${
                            tarefa.status === "entregue" ? "bg-green-500" : "bg-orange-500"
                          }`} />
                          <div>
                            <p className="font-medium text-sm">{tarefa.titulo}</p>
                            <p className="text-xs text-muted-foreground">{tarefa.disciplina}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={tarefa.status === "entregue" ? "default" : "outline"}>
                            {tarefa.status === "entregue" ? "Entregue" : `Prazo: ${tarefa.prazo}`}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* Coluna Lateral */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Comunicados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="h-5 w-5 text-orange-500" />
                Comunicados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {comunicadosRecentes.slice(0, 3).map((comunicado) => (
                <div
                  key={comunicado.id}
                  className={`p-3 rounded-lg transition-colors cursor-pointer ${
                    !comunicado.lido ? "bg-orange-500/5 border border-orange-500/20" : "bg-muted/50 hover:bg-muted"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{comunicado.titulo}</p>
                        {!comunicado.lido && (
                          <span className="h-2 w-2 rounded-full bg-orange-500" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{comunicado.descricao}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-[10px]">{comunicado.filho}</Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(comunicado.data).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                Ver Todos
              </Button>
            </CardContent>
          </Card>

          {/* Próximos Eventos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-blue-500" />
                Próximos Eventos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {proximosEventos.map((evento, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                    <span className="text-xs font-bold text-blue-500">{evento.data}</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{evento.titulo}</p>
                    <Badge variant="outline" className="text-[10px] capitalize">{evento.tipo}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Financeiro Resumo */}
          <Card className="border-blue-500/50 bg-blue-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CreditCard className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="font-medium">Próximo Vencimento</p>
                  <p className="text-2xl font-bold text-blue-500">R$ 850,00</p>
                  <p className="text-xs text-muted-foreground">Vence em 30/01/2024</p>
                </div>
              </div>
              <Button className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white">
                Ver Financeiro
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

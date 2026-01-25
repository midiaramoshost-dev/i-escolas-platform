import { motion } from "framer-motion";
import {
  BookOpen,
  Calendar,
  ClipboardCheck,
  MessageSquare,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Award,
  Target,
  Bell,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const statsCards = [
  {
    title: "Média Geral",
    value: "8.5",
    description: "Excelente desempenho",
    icon: TrendingUp,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    title: "Frequência",
    value: "96%",
    description: "Este bimestre",
    icon: Calendar,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Tarefas Pendentes",
    value: "3",
    description: "Para esta semana",
    icon: FileText,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    title: "Comunicados",
    value: "2",
    description: "Não lidos",
    icon: Bell,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
];

const proximasAulas = [
  { disciplina: "Matemática", horario: "07:30", professor: "Prof. Carlos", sala: "Sala 101" },
  { disciplina: "Português", horario: "08:20", professor: "Profª Ana", sala: "Sala 101" },
  { disciplina: "Ciências", horario: "09:30", professor: "Prof. Roberto", sala: "Lab. Ciências" },
  { disciplina: "História", horario: "10:20", professor: "Profª Paula", sala: "Sala 101" },
];

const tarefasPendentes = [
  {
    id: "1",
    titulo: "Exercícios de Matemática",
    disciplina: "Matemática",
    prazo: "2024-01-25",
    tipo: "exercicio",
  },
  {
    id: "2",
    titulo: "Redação: Meio Ambiente",
    disciplina: "Português",
    prazo: "2024-01-26",
    tipo: "redacao",
  },
  {
    id: "3",
    titulo: "Relatório de Experiência",
    disciplina: "Ciências",
    prazo: "2024-01-28",
    tipo: "trabalho",
  },
];

const notasRecentes = [
  { disciplina: "Matemática", avaliacao: "AV1", nota: 9.0, media: 8.5 },
  { disciplina: "Português", avaliacao: "Trabalho", nota: 8.5, media: 8.2 },
  { disciplina: "Ciências", avaliacao: "AV1", nota: 8.0, media: 7.8 },
  { disciplina: "História", avaliacao: "AV1", nota: 9.5, media: 9.0 },
];

const comunicadosRecentes = [
  {
    id: "1",
    titulo: "Reunião de Pais - 1º Bimestre",
    data: "2024-01-22",
    lido: false,
  },
  {
    id: "2",
    titulo: "Calendário de Provas",
    data: "2024-01-20",
    lido: false,
  },
  {
    id: "3",
    titulo: "Festa Junina - Preparativos",
    data: "2024-01-18",
    lido: true,
  },
];

export default function AlunoDashboard() {
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
            <AvatarFallback className="bg-emerald-500 text-white text-xl">AB</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Olá, Ana Beatriz! 👋</h1>
            <p className="text-muted-foreground">
              5º Ano A • Turno Manhã • Matrícula: 2024001
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Calendário
          </Button>
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
            <Bell className="mr-2 h-4 w-4" />
            Notificações
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

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Próximas Aulas */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-emerald-500" />
                Próximas Aulas - Hoje
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {proximasAulas.map((aula, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                    <span className="text-sm font-bold text-emerald-500">{aula.horario}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{aula.disciplina}</p>
                    <p className="text-xs text-muted-foreground">
                      {aula.professor} • {aula.sala}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Tarefas Pendentes */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-orange-500" />
                Tarefas Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tarefasPendentes.map((tarefa) => (
                <div
                  key={tarefa.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/10 mt-0.5">
                    <FileText className="h-4 w-4 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{tarefa.titulo}</p>
                    <p className="text-xs text-muted-foreground">{tarefa.disciplina}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Prazo: {new Date(tarefa.prazo).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-2">
                Ver Todas as Tarefas
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Comunicados */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="h-5 w-5 text-purple-500" />
                Comunicados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {comunicadosRecentes.map((comunicado) => (
                <div
                  key={comunicado.id}
                  className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                    !comunicado.lido ? "bg-purple-500/5 border border-purple-500/20" : "bg-muted/50 hover:bg-muted"
                  }`}
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    !comunicado.lido ? "bg-purple-500/10" : "bg-muted"
                  }`}>
                    <MessageSquare className={`h-4 w-4 ${!comunicado.lido ? "text-purple-500" : "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{comunicado.titulo}</p>
                      {!comunicado.lido && (
                        <Badge className="bg-purple-500/10 text-purple-500 text-[10px]">Novo</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(comunicado.data).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-2">
                Ver Todos os Comunicados
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Notas Recentes e Desempenho */}
      <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-2">
        {/* Notas Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-green-500" />
              Notas Recentes
            </CardTitle>
            <CardDescription>Últimas avaliações lançadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notasRecentes.map((nota, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                      <BookOpen className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{nota.disciplina}</p>
                      <p className="text-xs text-muted-foreground">{nota.avaliacao}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      nota.nota >= 7 ? "text-green-500" : nota.nota >= 5 ? "text-yellow-500" : "text-red-500"
                    }`}>
                      {nota.nota.toFixed(1)}
                    </p>
                    <p className="text-xs text-muted-foreground">Média: {nota.media.toFixed(1)}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Ver Todas as Notas
            </Button>
          </CardContent>
        </Card>

        {/* Progresso do Bimestre */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              Progresso do Bimestre
            </CardTitle>
            <CardDescription>Acompanhe seu desempenho por disciplina</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { disciplina: "Matemática", media: 8.5, progresso: 85 },
                { disciplina: "Português", media: 8.2, progresso: 82 },
                { disciplina: "Ciências", media: 7.8, progresso: 78 },
                { disciplina: "História", media: 9.0, progresso: 90 },
                { disciplina: "Geografia", media: 8.0, progresso: 80 },
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.disciplina}</span>
                    <span className={`text-sm font-bold ${
                      item.media >= 7 ? "text-green-500" : item.media >= 5 ? "text-yellow-500" : "text-red-500"
                    }`}>
                      {item.media.toFixed(1)}
                    </span>
                  </div>
                  <Progress value={item.progresso} className="h-2" />
                </div>
              ))}
            </div>

            {/* Meta do Bimestre */}
            <div className="mt-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-3">
                <Award className="h-8 w-8 text-emerald-500" />
                <div>
                  <p className="font-medium text-emerald-600 dark:text-emerald-400">Parabéns!</p>
                  <p className="text-sm text-muted-foreground">
                    Você está acima da meta de média 7.0 em todas as disciplinas!
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

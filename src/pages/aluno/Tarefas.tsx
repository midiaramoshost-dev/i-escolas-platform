import { motion } from "framer-motion";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  BookOpen,
  Upload,
  Eye,
  Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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

const tarefasPendentes = [
  {
    id: "1",
    titulo: "Exercícios de Matemática - Capítulo 5",
    disciplina: "Matemática",
    professor: "Prof. Carlos",
    prazo: "2024-05-25",
    tipo: "exercicio",
    descricao: "Resolver os exercícios 1 a 20 do capítulo 5 sobre equações do segundo grau.",
    pontos: 10,
    prioridade: "alta",
  },
  {
    id: "2",
    titulo: "Redação: O Impacto da Tecnologia",
    disciplina: "Português",
    professor: "Profª Ana",
    prazo: "2024-05-26",
    tipo: "redacao",
    descricao: "Produzir uma redação dissertativo-argumentativa sobre o impacto da tecnologia na sociedade contemporânea. Mínimo de 25 linhas.",
    pontos: 15,
    prioridade: "media",
  },
  {
    id: "3",
    titulo: "Relatório de Experiência - Fotossíntese",
    disciplina: "Ciências",
    professor: "Prof. Roberto",
    prazo: "2024-05-28",
    tipo: "trabalho",
    descricao: "Elaborar relatório completo sobre o experimento de fotossíntese realizado em sala. Incluir introdução, materiais, procedimentos, resultados e conclusão.",
    pontos: 20,
    prioridade: "alta",
  },
  {
    id: "4",
    titulo: "Pesquisa sobre a Era Vargas",
    disciplina: "História",
    professor: "Profª Paula",
    prazo: "2024-05-30",
    tipo: "pesquisa",
    descricao: "Pesquisar sobre os principais acontecimentos da Era Vargas e seus impactos na política brasileira.",
    pontos: 10,
    prioridade: "baixa",
  },
];

const tarefasEntregues = [
  {
    id: "5",
    titulo: "Lista de Exercícios - Frações",
    disciplina: "Matemática",
    dataEntrega: "2024-05-15",
    nota: 9.5,
    status: "corrigido",
    feedback: "Excelente trabalho! Apenas pequenos erros de atenção.",
  },
  {
    id: "6",
    titulo: "Análise do Livro 'Dom Casmurro'",
    disciplina: "Português",
    dataEntrega: "2024-05-12",
    nota: 8.5,
    status: "corrigido",
    feedback: "Boa análise, mas poderia explorar mais os aspectos psicológicos dos personagens.",
  },
  {
    id: "7",
    titulo: "Mapa Conceitual - Sistema Solar",
    disciplina: "Ciências",
    dataEntrega: "2024-05-10",
    nota: null,
    status: "aguardando",
    feedback: null,
  },
];

const getPrioridadeColor = (prioridade: string) => {
  switch (prioridade) {
    case "alta":
      return "bg-red-500/10 text-red-500 border-red-500/20";
    case "media":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    default:
      return "bg-green-500/10 text-green-500 border-green-500/20";
  }
};

const getTipoIcon = (tipo: string) => {
  switch (tipo) {
    case "exercicio":
      return <FileText className="h-5 w-5" />;
    case "redacao":
      return <BookOpen className="h-5 w-5" />;
    case "trabalho":
      return <Upload className="h-5 w-5" />;
    default:
      return <FileText className="h-5 w-5" />;
  }
};

const getDiasRestantes = (prazo: string) => {
  const hoje = new Date();
  const dataPrazo = new Date(prazo);
  const diff = Math.ceil((dataPrazo.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
};

export default function AlunoTarefas() {
  const [tabAtiva, setTabAtiva] = useState("pendentes");

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

  const totalPendentes = tarefasPendentes.length;
  const totalEntregues = tarefasEntregues.length;
  const taxaEntrega = (totalEntregues / (totalPendentes + totalEntregues)) * 100;

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
          <h1 className="text-2xl font-bold text-foreground">Minhas Tarefas</h1>
          <p className="text-muted-foreground">
            Gerencie suas atividades e entregas
          </p>
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filtrar
        </Button>
      </motion.div>

      {/* Resumo */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pendentes</p>
                <p className="text-3xl font-bold text-orange-500">{totalPendentes}</p>
                <p className="text-xs text-muted-foreground">tarefas</p>
              </div>
              <div className="rounded-full p-3 bg-orange-500/10">
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Entregues</p>
                <p className="text-3xl font-bold text-green-500">{totalEntregues}</p>
                <p className="text-xs text-muted-foreground">no mês</p>
              </div>
              <div className="rounded-full p-3 bg-green-500/10">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Urgentes</p>
                <p className="text-3xl font-bold text-red-500">2</p>
                <p className="text-xs text-muted-foreground">próximos 3 dias</p>
              </div>
              <div className="rounded-full p-3 bg-red-500/10">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taxa de Entrega</p>
                <p className="text-3xl font-bold text-emerald-500">{taxaEntrega.toFixed(0)}%</p>
                <Progress value={taxaEntrega} className="h-2 mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs value={tabAtiva} onValueChange={setTabAtiva}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="pendentes" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pendentes ({totalPendentes})
            </TabsTrigger>
            <TabsTrigger value="entregues" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Entregues ({totalEntregues})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pendentes" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              {tarefasPendentes.map((tarefa) => {
                const diasRestantes = getDiasRestantes(tarefa.prazo);
                return (
                  <motion.div
                    key={tarefa.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className={`h-full ${diasRestantes <= 3 ? "border-red-500/30" : ""}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                              {getTipoIcon(tarefa.tipo)}
                            </div>
                            <Badge className={getPrioridadeColor(tarefa.prioridade)}>
                              {tarefa.prioridade}
                            </Badge>
                          </div>
                          <Badge variant="outline">{tarefa.pontos} pts</Badge>
                        </div>

                        <h3 className="font-semibold text-sm mb-1">{tarefa.titulo}</h3>
                        <p className="text-xs text-muted-foreground mb-3">
                          {tarefa.disciplina} • {tarefa.professor}
                        </p>

                        <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                          {tarefa.descricao}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs">
                            <Calendar className="h-3 w-3" />
                            <span className={diasRestantes <= 3 ? "text-red-500 font-medium" : "text-muted-foreground"}>
                              {diasRestantes > 0 ? `${diasRestantes} dias restantes` : "Vence hoje!"}
                            </span>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-1" />
                                Ver
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>{tarefa.titulo}</DialogTitle>
                                <DialogDescription>
                                  {tarefa.disciplina} • {tarefa.professor}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium text-sm mb-2">Descrição</h4>
                                  <p className="text-sm text-muted-foreground">{tarefa.descricao}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div>
                                    <span className="text-xs text-muted-foreground">Prazo</span>
                                    <p className="font-medium">{new Date(tarefa.prazo).toLocaleDateString("pt-BR")}</p>
                                  </div>
                                  <div>
                                    <span className="text-xs text-muted-foreground">Valor</span>
                                    <p className="font-medium">{tarefa.pontos} pontos</p>
                                  </div>
                                </div>
                                <Button className="w-full bg-emerald-500 hover:bg-emerald-600">
                                  <Upload className="mr-2 h-4 w-4" />
                                  Entregar Tarefa
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="entregues" className="mt-6">
            <div className="space-y-4">
              {tarefasEntregues.map((tarefa) => (
                <motion.div
                  key={tarefa.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
                            tarefa.status === "corrigido" ? "bg-green-500/10" : "bg-yellow-500/10"
                          }`}>
                            {tarefa.status === "corrigido" ? (
                              <CheckCircle className="h-6 w-6 text-green-500" />
                            ) : (
                              <Clock className="h-6 w-6 text-yellow-500" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold">{tarefa.titulo}</h3>
                            <p className="text-sm text-muted-foreground">
                              {tarefa.disciplina} • Entregue em {new Date(tarefa.dataEntrega).toLocaleDateString("pt-BR")}
                            </p>
                            {tarefa.feedback && (
                              <p className="text-xs text-muted-foreground mt-1 italic">
                                "{tarefa.feedback}"
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          {tarefa.nota !== null ? (
                            <div>
                              <p className={`text-2xl font-bold ${tarefa.nota >= 7 ? "text-green-500" : "text-red-500"}`}>
                                {tarefa.nota.toFixed(1)}
                              </p>
                              <Badge className="bg-green-500/10 text-green-500">Corrigido</Badge>
                            </div>
                          ) : (
                            <Badge className="bg-yellow-500/10 text-yellow-500">Aguardando correção</Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}

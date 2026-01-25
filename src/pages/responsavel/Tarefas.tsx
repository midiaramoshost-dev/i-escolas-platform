import { motion } from "framer-motion";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  BookOpen,
  Users,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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

const tarefasPorDependente: Record<string, { pendentes: any[]; entregues: any[] }> = {
  "1": {
    pendentes: [
      { id: "1", titulo: "Exercícios de Matemática - Capítulo 5", disciplina: "Matemática", prazo: "2024-05-25", prioridade: "alta", pontos: 10 },
      { id: "2", titulo: "Redação: O Impacto da Tecnologia", disciplina: "Português", prazo: "2024-05-26", prioridade: "media", pontos: 15 },
      { id: "3", titulo: "Relatório de Experiência - Fotossíntese", disciplina: "Ciências", prazo: "2024-05-28", prioridade: "alta", pontos: 20 },
    ],
    entregues: [
      { id: "4", titulo: "Lista de Exercícios - Frações", disciplina: "Matemática", dataEntrega: "2024-05-15", nota: 9.5, status: "corrigido" },
      { id: "5", titulo: "Análise do Livro 'Dom Casmurro'", disciplina: "Português", dataEntrega: "2024-05-12", nota: 8.5, status: "corrigido" },
    ],
  },
  "2": {
    pendentes: [
      { id: "6", titulo: "Tabuada do 6 ao 9", disciplina: "Matemática", prazo: "2024-05-24", prioridade: "alta", pontos: 10 },
      { id: "7", titulo: "Desenho: Minha Família", disciplina: "Artes", prazo: "2024-05-27", prioridade: "baixa", pontos: 5 },
    ],
    entregues: [
      { id: "8", titulo: "Leitura: A Cigarra e a Formiga", disciplina: "Português", dataEntrega: "2024-05-18", nota: 10, status: "corrigido" },
      { id: "9", titulo: "Atividade de Recorte", disciplina: "Artes", dataEntrega: "2024-05-16", nota: null, status: "aguardando" },
    ],
  },
};

const getPrioridadeColor = (prioridade: string) => {
  switch (prioridade) {
    case "alta": return "bg-red-500/10 text-red-500 border-red-500/20";
    case "media": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    default: return "bg-green-500/10 text-green-500 border-green-500/20";
  }
};

const getDiasRestantes = (prazo: string) => {
  const hoje = new Date();
  const dataPrazo = new Date(prazo);
  return Math.ceil((dataPrazo.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
};

export default function ResponsavelTarefas() {
  const [dependenteSelecionado, setDependenteSelecionado] = useState("1");
  const [tabAtiva, setTabAtiva] = useState("pendentes");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const dadosAtuais = tarefasPorDependente[dependenteSelecionado];
  const dependenteAtual = dependentes.find(d => d.id === dependenteSelecionado);
  const totalPendentes = dadosAtuais.pendentes.length;
  const totalEntregues = dadosAtuais.entregues.length;
  const taxaEntrega = (totalEntregues / (totalPendentes + totalEntregues)) * 100;

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tarefas</h1>
          <p className="text-muted-foreground">Acompanhe as atividades escolares dos seus filhos</p>
        </div>
      </motion.div>

      {/* Seletor de Dependente */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Users className="h-5 w-5 text-violet-500" />
              <span className="font-medium">Selecionar filho:</span>
              <Tabs value={dependenteSelecionado} onValueChange={setDependenteSelecionado}>
                <TabsList>
                  {dependentes.map((dep) => (
                    <TabsTrigger key={dep.id} value={dep.id} className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs bg-violet-500 text-white">{dep.iniciais}</AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:inline">{dep.nome}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Info do Dependente */}
      {dependenteAtual && (
        <motion.div variants={itemVariants} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="bg-violet-500 text-white text-lg">{dependenteAtual.iniciais}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">{dependenteAtual.nome}</h2>
            <p className="text-muted-foreground">{dependenteAtual.turma}</p>
          </div>
        </motion.div>
      )}

      {/* Resumo */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pendentes</p>
                <p className="text-3xl font-bold text-orange-500">{totalPendentes}</p>
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
                <p className="text-3xl font-bold text-red-500">
                  {dadosAtuais.pendentes.filter(t => getDiasRestantes(t.prazo) <= 3).length}
                </p>
              </div>
              <div className="rounded-full p-3 bg-red-500/10">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Taxa de Entrega</p>
              <p className="text-3xl font-bold text-violet-500">{taxaEntrega.toFixed(0)}%</p>
              <Progress value={taxaEntrega} className="h-2 mt-2" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs value={tabAtiva} onValueChange={setTabAtiva}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="pendentes">Pendentes ({totalPendentes})</TabsTrigger>
            <TabsTrigger value="entregues">Entregues ({totalEntregues})</TabsTrigger>
          </TabsList>

          <TabsContent value="pendentes" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              {dadosAtuais.pendentes.map((tarefa) => {
                const diasRestantes = getDiasRestantes(tarefa.prazo);
                return (
                  <motion.div key={tarefa.id} variants={itemVariants} whileHover={{ scale: 1.02 }}>
                    <Card className={`h-full ${diasRestantes <= 3 ? "border-red-500/30" : ""}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500">
                              <FileText className="h-5 w-5" />
                            </div>
                            <Badge className={getPrioridadeColor(tarefa.prioridade)}>{tarefa.prioridade}</Badge>
                          </div>
                          <Badge variant="outline">{tarefa.pontos} pts</Badge>
                        </div>
                        <h3 className="font-semibold text-sm mb-1">{tarefa.titulo}</h3>
                        <p className="text-xs text-muted-foreground mb-3">{tarefa.disciplina}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs">
                            <Calendar className="h-3 w-3" />
                            <span className={diasRestantes <= 3 ? "text-red-500 font-medium" : "text-muted-foreground"}>
                              {diasRestantes > 0 ? `${diasRestantes} dias` : "Vence hoje!"}
                            </span>
                          </div>
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
              {dadosAtuais.entregues.map((tarefa) => (
                <motion.div key={tarefa.id} variants={itemVariants} whileHover={{ scale: 1.01 }}>
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
                              {tarefa.disciplina} • {new Date(tarefa.dataEntrega).toLocaleDateString("pt-BR")}
                            </p>
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
                            <Badge className="bg-yellow-500/10 text-yellow-500">Aguardando</Badge>
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

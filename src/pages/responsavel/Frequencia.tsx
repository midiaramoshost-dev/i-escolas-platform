import { motion } from "framer-motion";
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  AlertTriangle,
  CalendarDays,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const dependentes = [
  { id: "1", nome: "Ana Beatriz", turma: "5º Ano A", iniciais: "AB" },
  { id: "2", nome: "Pedro Silva", turma: "3º Ano B", iniciais: "PS" },
];

const frequenciaPorDependente: Record<string, any> = {
  "1": {
    frequenciaGeral: 96.5,
    totalDiasLetivos: 101,
    totalPresencas: 97,
    totalFaltas: 4,
    faltasJustificadas: 3,
    meses: [
      { mes: "Janeiro", diasLetivos: 20, presencas: 19, faltas: 1, percentual: 95 },
      { mes: "Fevereiro", diasLetivos: 18, presencas: 18, faltas: 0, percentual: 100 },
      { mes: "Março", diasLetivos: 22, presencas: 21, faltas: 1, percentual: 95.5 },
      { mes: "Abril", diasLetivos: 20, presencas: 20, faltas: 0, percentual: 100 },
      { mes: "Maio", diasLetivos: 21, presencas: 19, faltas: 2, percentual: 90.5 },
    ],
    ultimasFaltas: [
      { data: "2024-05-18", motivo: "Consulta médica", justificada: true },
      { data: "2024-05-15", motivo: null, justificada: false },
      { data: "2024-03-10", motivo: "Acompanhamento familiar", justificada: true },
      { data: "2024-01-22", motivo: "Doença", justificada: true },
    ],
  },
  "2": {
    frequenciaGeral: 92.0,
    totalDiasLetivos: 101,
    totalPresencas: 93,
    totalFaltas: 8,
    faltasJustificadas: 5,
    meses: [
      { mes: "Janeiro", diasLetivos: 20, presencas: 18, faltas: 2, percentual: 90 },
      { mes: "Fevereiro", diasLetivos: 18, presencas: 17, faltas: 1, percentual: 94.4 },
      { mes: "Março", diasLetivos: 22, presencas: 20, faltas: 2, percentual: 90.9 },
      { mes: "Abril", diasLetivos: 20, presencas: 19, faltas: 1, percentual: 95 },
      { mes: "Maio", diasLetivos: 21, presencas: 19, faltas: 2, percentual: 90.5 },
    ],
    ultimasFaltas: [
      { data: "2024-05-20", motivo: "Consulta dentária", justificada: true },
      { data: "2024-05-14", motivo: null, justificada: false },
      { data: "2024-04-08", motivo: "Doença", justificada: true },
      { data: "2024-03-25", motivo: null, justificada: false },
    ],
  },
};

const getStatusColor = (percentual: number) => {
  if (percentual >= 90) return "text-green-500";
  if (percentual >= 75) return "text-yellow-500";
  return "text-red-500";
};

const getStatusBg = (percentual: number) => {
  if (percentual >= 90) return "bg-green-500/10";
  if (percentual >= 75) return "bg-yellow-500/10";
  return "bg-red-500/10";
};

export default function ResponsavelFrequencia() {
  const [dependenteSelecionado, setDependenteSelecionado] = useState("1");

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

  const dadosAtuais = frequenciaPorDependente[dependenteSelecionado];
  const dependenteAtual = dependentes.find(d => d.id === dependenteSelecionado);

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
          <h1 className="text-2xl font-bold text-foreground">Frequência</h1>
          <p className="text-muted-foreground">
            Acompanhe a presença escolar dos seus filhos
          </p>
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
                <p className="text-sm font-medium text-muted-foreground">Frequência Geral</p>
                <p className={`text-3xl font-bold ${getStatusColor(dadosAtuais.frequenciaGeral)}`}>
                  {dadosAtuais.frequenciaGeral.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground">
                  {dadosAtuais.frequenciaGeral >= 90 ? "Excelente!" : dadosAtuais.frequenciaGeral >= 75 ? "Regular" : "Atenção!"}
                </p>
              </div>
              <div className={`rounded-full p-3 ${getStatusBg(dadosAtuais.frequenciaGeral)}`}>
                <TrendingUp className={`h-8 w-8 ${getStatusColor(dadosAtuais.frequenciaGeral)}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Dias Letivos</p>
                <p className="text-3xl font-bold">{dadosAtuais.totalDiasLetivos}</p>
                <p className="text-xs text-muted-foreground">No ano</p>
              </div>
              <div className="rounded-full p-3 bg-blue-500/10">
                <CalendarDays className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Presenças</p>
                <p className="text-3xl font-bold text-green-500">{dadosAtuais.totalPresencas}</p>
                <p className="text-xs text-muted-foreground">Total de dias</p>
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
                <p className="text-sm font-medium text-muted-foreground">Faltas</p>
                <p className="text-3xl font-bold text-orange-500">{dadosAtuais.totalFaltas}</p>
                <p className="text-xs text-muted-foreground">
                  {dadosAtuais.faltasJustificadas} justificadas
                </p>
              </div>
              <div className="rounded-full p-3 bg-orange-500/10">
                <XCircle className="h-8 w-8 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Frequência por Mês */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-violet-500" />
                Frequência por Mês
              </CardTitle>
              <CardDescription>Resumo mensal de presenças e faltas</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mês</TableHead>
                    <TableHead className="text-center">Dias</TableHead>
                    <TableHead className="text-center">Presenças</TableHead>
                    <TableHead className="text-center">Faltas</TableHead>
                    <TableHead className="text-center">%</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dadosAtuais.meses.map((mes: any) => (
                    <TableRow key={mes.mes}>
                      <TableCell className="font-medium">{mes.mes}</TableCell>
                      <TableCell className="text-center">{mes.diasLetivos}</TableCell>
                      <TableCell className="text-center text-green-500">{mes.presencas}</TableCell>
                      <TableCell className="text-center text-orange-500">{mes.faltas}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={`${getStatusBg(mes.percentual)} ${getStatusColor(mes.percentual)}`}>
                          {mes.percentual.toFixed(1)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>

        {/* Últimas Faltas */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-500" />
                Histórico de Faltas
              </CardTitle>
              <CardDescription>Últimas ausências registradas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {dadosAtuais.ultimasFaltas.map((falta: any, index: number) => (
                <div
                  key={index}
                  className={`flex items-center gap-4 p-3 rounded-lg ${
                    falta.justificada ? "bg-green-500/5 border border-green-500/20" : "bg-red-500/5 border border-red-500/20"
                  }`}
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    falta.justificada ? "bg-green-500/10" : "bg-red-500/10"
                  }`}>
                    {falta.justificada ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {new Date(falta.data).toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })}
                    </p>
                    {falta.motivo ? (
                      <p className="text-xs text-muted-foreground">{falta.motivo}</p>
                    ) : (
                      <p className="text-xs text-red-500">Sem justificativa</p>
                    )}
                  </div>
                  <Badge className={falta.justificada ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}>
                    {falta.justificada ? "Justificada" : "Pendente"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Alerta se frequência baixa */}
      {dadosAtuais.frequenciaGeral < 90 && (
        <motion.div variants={itemVariants}>
          <Card className="border-yellow-500/50 bg-yellow-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="font-medium text-yellow-600 dark:text-yellow-400">Atenção à Frequência</p>
                  <p className="text-sm text-muted-foreground">
                    A frequência está abaixo de 90%. É importante manter a presença regular para melhor aproveitamento escolar.
                    O mínimo recomendado é 75% para aprovação.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}

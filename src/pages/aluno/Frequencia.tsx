import { motion } from "framer-motion";
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  AlertTriangle,
  CalendarDays,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const frequenciaPorMes = [
  { mes: "Janeiro", diasLetivos: 20, presencas: 19, faltas: 1, justificadas: 1, percentual: 95 },
  { mes: "Fevereiro", diasLetivos: 18, presencas: 18, faltas: 0, justificadas: 0, percentual: 100 },
  { mes: "Março", diasLetivos: 22, presencas: 21, faltas: 1, justificadas: 0, percentual: 95.5 },
  { mes: "Abril", diasLetivos: 20, presencas: 20, faltas: 0, justificadas: 0, percentual: 100 },
  { mes: "Maio", diasLetivos: 21, presencas: 19, faltas: 2, justificadas: 1, percentual: 90.5 },
];

const historicoDetalhado = [
  { data: "2024-05-20", status: "presente", disciplinas: ["Matemática", "Português", "Ciências", "História"] },
  { data: "2024-05-19", status: "presente", disciplinas: ["Matemática", "Português", "Geografia", "Ed. Física"] },
  { data: "2024-05-18", status: "falta", disciplinas: [], justificativa: "Consulta médica" },
  { data: "2024-05-17", status: "presente", disciplinas: ["Matemática", "Português", "Ciências", "Artes"] },
  { data: "2024-05-16", status: "presente", disciplinas: ["Matemática", "Português", "História", "Geografia"] },
  { data: "2024-05-15", status: "falta", disciplinas: [], justificativa: null },
  { data: "2024-05-14", status: "presente", disciplinas: ["Matemática", "Português", "Ciências", "Ed. Física"] },
  { data: "2024-05-13", status: "presente", disciplinas: ["Matemática", "Português", "Artes", "História"] },
];

const frequenciaPorDisciplina = [
  { disciplina: "Matemática", aulas: 40, presencas: 38, percentual: 95 },
  { disciplina: "Português", aulas: 40, presencas: 39, percentual: 97.5 },
  { disciplina: "Ciências", aulas: 30, presencas: 29, percentual: 96.7 },
  { disciplina: "História", aulas: 25, presencas: 25, percentual: 100 },
  { disciplina: "Geografia", aulas: 25, presencas: 24, percentual: 96 },
  { disciplina: "Ed. Física", aulas: 20, presencas: 20, percentual: 100 },
];

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

export default function AlunoFrequencia() {
  const [mesSelecionado, setMesSelecionado] = useState("5");

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

  const totalDiasLetivos = frequenciaPorMes.reduce((acc, m) => acc + m.diasLetivos, 0);
  const totalPresencas = frequenciaPorMes.reduce((acc, m) => acc + m.presencas, 0);
  const totalFaltas = frequenciaPorMes.reduce((acc, m) => acc + m.faltas, 0);
  const frequenciaGeral = (totalPresencas / totalDiasLetivos) * 100;

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
          <h1 className="text-2xl font-bold text-foreground">Minha Frequência</h1>
          <p className="text-muted-foreground">
            Acompanhe sua presença nas aulas
          </p>
        </div>
        <Select value={mesSelecionado} onValueChange={setMesSelecionado}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Selecione o mês" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Janeiro</SelectItem>
            <SelectItem value="2">Fevereiro</SelectItem>
            <SelectItem value="3">Março</SelectItem>
            <SelectItem value="4">Abril</SelectItem>
            <SelectItem value="5">Maio</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Resumo */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Frequência Geral</p>
                <p className="text-3xl font-bold text-emerald-500">{frequenciaGeral.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">Excelente!</p>
              </div>
              <div className="rounded-full p-3 bg-emerald-500/10">
                <TrendingUp className="h-8 w-8 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Dias Letivos</p>
                <p className="text-3xl font-bold">{totalDiasLetivos}</p>
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
                <p className="text-3xl font-bold text-green-500">{totalPresencas}</p>
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
                <p className="text-3xl font-bold text-orange-500">{totalFaltas}</p>
                <p className="text-xs text-muted-foreground">No ano</p>
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
                <Calendar className="h-5 w-5 text-emerald-500" />
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
                  {frequenciaPorMes.map((mes) => (
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

        {/* Frequência por Disciplina */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                Por Disciplina
              </CardTitle>
              <CardDescription>Frequência em cada matéria</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {frequenciaPorDisciplina.map((disciplina) => (
                <div key={disciplina.disciplina} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{disciplina.disciplina}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {disciplina.presencas}/{disciplina.aulas} aulas
                      </span>
                      <span className={`text-sm font-bold ${getStatusColor(disciplina.percentual)}`}>
                        {disciplina.percentual.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <Progress value={disciplina.percentual} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Histórico Detalhado */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-purple-500" />
              Histórico Recente
            </CardTitle>
            <CardDescription>Últimos dias de aula</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {historicoDetalhado.map((dia, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-4 p-3 rounded-lg ${
                    dia.status === "presente" ? "bg-green-500/5 border border-green-500/20" : "bg-red-500/5 border border-red-500/20"
                  }`}
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    dia.status === "presente" ? "bg-green-500/10" : "bg-red-500/10"
                  }`}>
                    {dia.status === "presente" ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">
                        {new Date(dia.data).toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })}
                      </p>
                      <Badge className={dia.status === "presente" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}>
                        {dia.status === "presente" ? "Presente" : "Falta"}
                      </Badge>
                    </div>
                    {dia.status === "presente" ? (
                      <p className="text-xs text-muted-foreground">
                        {dia.disciplinas.join(", ")}
                      </p>
                    ) : dia.justificativa ? (
                      <p className="text-xs text-muted-foreground">
                        Justificativa: {dia.justificativa}
                      </p>
                    ) : (
                      <p className="text-xs text-orange-500 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Falta não justificada
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

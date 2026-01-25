import { motion } from "framer-motion";
import {
  BookOpen,
  TrendingUp,
  TrendingDown,
  Minus,
  Award,
  Target,
  Calendar,
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

const notasPorDisciplina = [
  {
    disciplina: "Matemática",
    professor: "Prof. Carlos",
    bimestres: [
      { bimestre: 1, av1: 9.0, av2: 8.5, trabalhos: 9.5, media: 9.0 },
      { bimestre: 2, av1: 8.5, av2: 9.0, trabalhos: 8.5, media: 8.7 },
      { bimestre: 3, av1: null, av2: null, trabalhos: null, media: null },
      { bimestre: 4, av1: null, av2: null, trabalhos: null, media: null },
    ],
    mediaGeral: 8.85,
    tendencia: "up",
  },
  {
    disciplina: "Português",
    professor: "Profª Ana",
    bimestres: [
      { bimestre: 1, av1: 8.0, av2: 8.5, trabalhos: 9.0, media: 8.5 },
      { bimestre: 2, av1: 8.5, av2: 8.0, trabalhos: 8.5, media: 8.3 },
      { bimestre: 3, av1: null, av2: null, trabalhos: null, media: null },
      { bimestre: 4, av1: null, av2: null, trabalhos: null, media: null },
    ],
    mediaGeral: 8.4,
    tendencia: "stable",
  },
  {
    disciplina: "Ciências",
    professor: "Prof. Roberto",
    bimestres: [
      { bimestre: 1, av1: 7.5, av2: 8.0, trabalhos: 8.5, media: 8.0 },
      { bimestre: 2, av1: 8.0, av2: 7.5, trabalhos: 8.0, media: 7.8 },
      { bimestre: 3, av1: null, av2: null, trabalhos: null, media: null },
      { bimestre: 4, av1: null, av2: null, trabalhos: null, media: null },
    ],
    mediaGeral: 7.9,
    tendencia: "down",
  },
  {
    disciplina: "História",
    professor: "Profª Paula",
    bimestres: [
      { bimestre: 1, av1: 9.5, av2: 9.0, trabalhos: 9.5, media: 9.3 },
      { bimestre: 2, av1: 9.0, av2: 9.5, trabalhos: 9.0, media: 9.2 },
      { bimestre: 3, av1: null, av2: null, trabalhos: null, media: null },
      { bimestre: 4, av1: null, av2: null, trabalhos: null, media: null },
    ],
    mediaGeral: 9.25,
    tendencia: "up",
  },
  {
    disciplina: "Geografia",
    professor: "Prof. Marcos",
    bimestres: [
      { bimestre: 1, av1: 8.0, av2: 8.5, trabalhos: 8.0, media: 8.2 },
      { bimestre: 2, av1: 8.5, av2: 8.0, trabalhos: 8.5, media: 8.3 },
      { bimestre: 3, av1: null, av2: null, trabalhos: null, media: null },
      { bimestre: 4, av1: null, av2: null, trabalhos: null, media: null },
    ],
    mediaGeral: 8.25,
    tendencia: "up",
  },
];

const getTendenciaIcon = (tendencia: string) => {
  switch (tendencia) {
    case "up":
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    case "down":
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    default:
      return <Minus className="h-4 w-4 text-yellow-500" />;
  }
};

const getNotaColor = (nota: number | null) => {
  if (nota === null) return "text-muted-foreground";
  if (nota >= 7) return "text-green-500";
  if (nota >= 5) return "text-yellow-500";
  return "text-red-500";
};

export default function AlunoNotas() {
  const [bimestreSelecionado, setBimestreSelecionado] = useState("2");

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

  const mediaGeral = notasPorDisciplina.reduce((acc, d) => acc + d.mediaGeral, 0) / notasPorDisciplina.length;

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
          <h1 className="text-2xl font-bold text-foreground">Minhas Notas</h1>
          <p className="text-muted-foreground">
            Acompanhe seu desempenho em todas as disciplinas
          </p>
        </div>
        <Select value={bimestreSelecionado} onValueChange={setBimestreSelecionado}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Selecione o bimestre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1º Bimestre</SelectItem>
            <SelectItem value="2">2º Bimestre</SelectItem>
            <SelectItem value="3">3º Bimestre</SelectItem>
            <SelectItem value="4">4º Bimestre</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Resumo */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Média Geral</p>
                <p className="text-3xl font-bold text-emerald-500">{mediaGeral.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Excelente desempenho</p>
              </div>
              <div className="rounded-full p-3 bg-emerald-500/10">
                <Award className="h-8 w-8 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Melhor Disciplina</p>
                <p className="text-2xl font-bold">História</p>
                <p className="text-xs text-emerald-500">Média 9.25</p>
              </div>
              <div className="rounded-full p-3 bg-blue-500/10">
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Meta do Bimestre</p>
                <p className="text-2xl font-bold">7.0</p>
                <Progress value={100} className="h-2 mt-2" />
                <p className="text-xs text-emerald-500 mt-1">Todas acima da meta!</p>
              </div>
              <div className="rounded-full p-3 bg-purple-500/10">
                <Target className="h-8 w-8 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabela de Notas */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-emerald-500" />
              Notas do {bimestreSelecionado}º Bimestre
            </CardTitle>
            <CardDescription>Detalhamento por disciplina e avaliação</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Disciplina</TableHead>
                  <TableHead>Professor</TableHead>
                  <TableHead className="text-center">AV1</TableHead>
                  <TableHead className="text-center">AV2</TableHead>
                  <TableHead className="text-center">Trabalhos</TableHead>
                  <TableHead className="text-center">Média</TableHead>
                  <TableHead className="text-center">Tendência</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notasPorDisciplina.map((disciplina) => {
                  const bimestreData = disciplina.bimestres[parseInt(bimestreSelecionado) - 1];
                  return (
                    <TableRow key={disciplina.disciplina}>
                      <TableCell className="font-medium">{disciplina.disciplina}</TableCell>
                      <TableCell className="text-muted-foreground">{disciplina.professor}</TableCell>
                      <TableCell className={`text-center font-medium ${getNotaColor(bimestreData.av1)}`}>
                        {bimestreData.av1?.toFixed(1) ?? "-"}
                      </TableCell>
                      <TableCell className={`text-center font-medium ${getNotaColor(bimestreData.av2)}`}>
                        {bimestreData.av2?.toFixed(1) ?? "-"}
                      </TableCell>
                      <TableCell className={`text-center font-medium ${getNotaColor(bimestreData.trabalhos)}`}>
                        {bimestreData.trabalhos?.toFixed(1) ?? "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {bimestreData.media !== null ? (
                          <Badge className={`${bimestreData.media >= 7 ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}>
                            {bimestreData.media.toFixed(1)}
                          </Badge>
                        ) : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {getTendenciaIcon(disciplina.tendencia)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Cards de Disciplinas */}
      <motion.div variants={itemVariants}>
        <h2 className="text-lg font-semibold mb-4">Progresso por Disciplina</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {notasPorDisciplina.map((disciplina) => (
            <motion.div
              key={disciplina.disciplina}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                        <BookOpen className="h-4 w-4 text-emerald-500" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{disciplina.disciplina}</p>
                        <p className="text-xs text-muted-foreground">{disciplina.professor}</p>
                      </div>
                    </div>
                    {getTendenciaIcon(disciplina.tendencia)}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Média Geral</span>
                      <span className={`font-bold ${getNotaColor(disciplina.mediaGeral)}`}>
                        {disciplina.mediaGeral.toFixed(1)}
                      </span>
                    </div>
                    <Progress value={(disciplina.mediaGeral / 10) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

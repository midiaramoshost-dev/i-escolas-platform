import { motion } from "framer-motion";
import {
  BookOpen,
  TrendingUp,
  TrendingDown,
  Minus,
  Award,
  Target,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const dependentes = [
  {
    id: "1",
    nome: "Ana Beatriz",
    turma: "5º Ano A",
    foto: null,
    iniciais: "AB",
  },
  {
    id: "2",
    nome: "Pedro Silva",
    turma: "3º Ano B",
    foto: null,
    iniciais: "PS",
  },
];

const notasPorDependente: Record<string, any[]> = {
  "1": [
    { disciplina: "Matemática", professor: "Prof. Carlos", bimestre1: 9.0, bimestre2: 8.7, media: 8.85, tendencia: "up" },
    { disciplina: "Português", professor: "Profª Ana", bimestre1: 8.5, bimestre2: 8.3, media: 8.4, tendencia: "stable" },
    { disciplina: "Ciências", professor: "Prof. Roberto", bimestre1: 8.0, bimestre2: 7.8, media: 7.9, tendencia: "down" },
    { disciplina: "História", professor: "Profª Paula", bimestre1: 9.3, bimestre2: 9.2, media: 9.25, tendencia: "up" },
    { disciplina: "Geografia", professor: "Prof. Marcos", bimestre1: 8.2, bimestre2: 8.3, media: 8.25, tendencia: "up" },
  ],
  "2": [
    { disciplina: "Matemática", professor: "Profª Maria", bimestre1: 7.5, bimestre2: 8.0, media: 7.75, tendencia: "up" },
    { disciplina: "Português", professor: "Prof. José", bimestre1: 8.0, bimestre2: 8.2, media: 8.1, tendencia: "up" },
    { disciplina: "Ciências", professor: "Profª Clara", bimestre1: 7.0, bimestre2: 7.5, media: 7.25, tendencia: "up" },
    { disciplina: "História", professor: "Prof. Lucas", bimestre1: 8.5, bimestre2: 8.0, media: 8.25, tendencia: "down" },
    { disciplina: "Geografia", professor: "Profª Sofia", bimestre1: 7.8, bimestre2: 8.0, media: 7.9, tendencia: "up" },
  ],
};

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

const getNotaColor = (nota: number) => {
  if (nota >= 7) return "text-green-500";
  if (nota >= 5) return "text-yellow-500";
  return "text-red-500";
};

export default function ResponsavelNotas() {
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

  const notasAtuais = notasPorDependente[dependenteSelecionado] || [];
  const dependenteAtual = dependentes.find(d => d.id === dependenteSelecionado);
  const mediaGeral = notasAtuais.reduce((acc, d) => acc + d.media, 0) / notasAtuais.length;

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
          <h1 className="text-2xl font-bold text-foreground">Notas</h1>
          <p className="text-muted-foreground">
            Acompanhe o desempenho escolar dos seus filhos
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
                        <AvatarImage src={dep.foto || undefined} />
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
            <AvatarImage src={dependenteAtual.foto || undefined} />
            <AvatarFallback className="bg-violet-500 text-white text-lg">{dependenteAtual.iniciais}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">{dependenteAtual.nome}</h2>
            <p className="text-muted-foreground">{dependenteAtual.turma}</p>
          </div>
        </motion.div>
      )}

      {/* Resumo */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Média Geral</p>
                <p className="text-3xl font-bold text-violet-500">{mediaGeral.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">
                  {mediaGeral >= 7 ? "Acima da média" : "Atenção necessária"}
                </p>
              </div>
              <div className="rounded-full p-3 bg-violet-500/10">
                <Award className="h-8 w-8 text-violet-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Melhor Disciplina</p>
                <p className="text-2xl font-bold">
                  {notasAtuais.reduce((max, d) => d.media > max.media ? d : max, notasAtuais[0])?.disciplina}
                </p>
                <p className="text-xs text-green-500">
                  Média {notasAtuais.reduce((max, d) => d.media > max.media ? d : max, notasAtuais[0])?.media.toFixed(1)}
                </p>
              </div>
              <div className="rounded-full p-3 bg-green-500/10">
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Meta de Aprovação</p>
                <p className="text-2xl font-bold">7.0</p>
                <Progress value={(notasAtuais.filter(n => n.media >= 7).length / notasAtuais.length) * 100} className="h-2 mt-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {notasAtuais.filter(n => n.media >= 7).length}/{notasAtuais.length} disciplinas
                </p>
              </div>
              <div className="rounded-full p-3 bg-blue-500/10">
                <Target className="h-8 w-8 text-blue-500" />
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
              <BookOpen className="h-5 w-5 text-violet-500" />
              Notas por Disciplina
            </CardTitle>
            <CardDescription>Desempenho detalhado por bimestre</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Disciplina</TableHead>
                  <TableHead>Professor</TableHead>
                  <TableHead className="text-center">1º Bim</TableHead>
                  <TableHead className="text-center">2º Bim</TableHead>
                  <TableHead className="text-center">Média</TableHead>
                  <TableHead className="text-center">Tendência</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notasAtuais.map((nota) => (
                  <TableRow key={nota.disciplina}>
                    <TableCell className="font-medium">{nota.disciplina}</TableCell>
                    <TableCell className="text-muted-foreground">{nota.professor}</TableCell>
                    <TableCell className={`text-center font-medium ${getNotaColor(nota.bimestre1)}`}>
                      {nota.bimestre1.toFixed(1)}
                    </TableCell>
                    <TableCell className={`text-center font-medium ${getNotaColor(nota.bimestre2)}`}>
                      {nota.bimestre2.toFixed(1)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={`${nota.media >= 7 ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                        {nota.media.toFixed(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {getTendenciaIcon(nota.tendencia)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Cards de Disciplinas */}
      <motion.div variants={itemVariants}>
        <h2 className="text-lg font-semibold mb-4">Progresso por Disciplina</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {notasAtuais.map((nota) => (
            <motion.div
              key={nota.disciplina}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
                        <BookOpen className="h-4 w-4 text-violet-500" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{nota.disciplina}</p>
                        <p className="text-xs text-muted-foreground">{nota.professor}</p>
                      </div>
                    </div>
                    {getTendenciaIcon(nota.tendencia)}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Média Geral</span>
                      <span className={`font-bold ${getNotaColor(nota.media)}`}>
                        {nota.media.toFixed(1)}
                      </span>
                    </div>
                    <Progress value={(nota.media / 10) * 100} className="h-2" />
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

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Calendar,
  Users,
  ClipboardCheck,
  FileText,
  Plus,
  Search,
  Filter,
  Save,
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  Eye,
  MoreHorizontal,
  BookMarked,
  GraduationCap,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";

// Dados mockados
const turmasData = [
  { id: "1", nome: "5º Ano A", serie: "5º Ano", turno: "Manhã", totalAlunos: 28 },
  { id: "2", nome: "7º Ano B", serie: "7º Ano", turno: "Tarde", totalAlunos: 32 },
  { id: "3", nome: "9º Ano A", serie: "9º Ano", turno: "Manhã", totalAlunos: 30 },
  { id: "4", nome: "3º EM A", serie: "3º Médio", turno: "Manhã", totalAlunos: 25 },
];

const disciplinasData = [
  { id: "1", nome: "Matemática" },
  { id: "2", nome: "Português" },
  { id: "3", nome: "Ciências" },
  { id: "4", nome: "História" },
  { id: "5", nome: "Geografia" },
  { id: "6", nome: "Inglês" },
];

const alunosTurma = [
  { id: "1", nome: "Ana Beatriz Silva", matricula: "2024001" },
  { id: "2", nome: "Bruno Costa Santos", matricula: "2024002" },
  { id: "3", nome: "Carolina Mendes", matricula: "2024003" },
  { id: "4", nome: "Daniel Oliveira", matricula: "2024004" },
  { id: "5", nome: "Eduarda Lima", matricula: "2024005" },
  { id: "6", nome: "Felipe Almeida", matricula: "2024006" },
  { id: "7", nome: "Gabriela Ferreira", matricula: "2024007" },
  { id: "8", nome: "Henrique Souza", matricula: "2024008" },
  { id: "9", nome: "Isabela Rodrigues", matricula: "2024009" },
  { id: "10", nome: "João Pedro Costa", matricula: "2024010" },
];

const aulasRegistradas = [
  {
    id: "1",
    data: "2024-01-22",
    turma: "5º Ano A",
    disciplina: "Matemática",
    horario: "07:30 - 08:20",
    conteudo: "Operações com frações",
    presentes: 26,
    ausentes: 2,
    status: "concluida",
  },
  {
    id: "2",
    data: "2024-01-22",
    turma: "5º Ano A",
    disciplina: "Português",
    horario: "08:20 - 09:10",
    conteudo: "Interpretação de textos narrativos",
    presentes: 27,
    ausentes: 1,
    status: "concluida",
  },
  {
    id: "3",
    data: "2024-01-22",
    turma: "7º Ano B",
    disciplina: "Ciências",
    horario: "13:30 - 14:20",
    conteudo: "Sistema digestório",
    presentes: 30,
    ausentes: 2,
    status: "concluida",
  },
  {
    id: "4",
    data: "2024-01-23",
    turma: "9º Ano A",
    disciplina: "História",
    horario: "07:30 - 08:20",
    conteudo: "Revolução Industrial",
    presentes: 0,
    ausentes: 0,
    status: "pendente",
  },
];

const notasLancadas = [
  {
    id: "1",
    aluno: "Ana Beatriz Silva",
    matricula: "2024001",
    av1: 8.5,
    av2: 9.0,
    trabalhos: 8.0,
    media: 8.5,
  },
  {
    id: "2",
    aluno: "Bruno Costa Santos",
    matricula: "2024002",
    av1: 7.0,
    av2: 7.5,
    trabalhos: 7.0,
    media: 7.2,
  },
  {
    id: "3",
    aluno: "Carolina Mendes",
    matricula: "2024003",
    av1: 9.5,
    av2: 9.0,
    trabalhos: 9.0,
    media: 9.2,
  },
  {
    id: "4",
    aluno: "Daniel Oliveira",
    matricula: "2024004",
    av1: 5.5,
    av2: 6.0,
    trabalhos: 6.5,
    media: 6.0,
  },
  {
    id: "5",
    aluno: "Eduarda Lima",
    matricula: "2024005",
    av1: 8.0,
    av2: 9.5,
    trabalhos: 8.5,
    media: 8.7,
  },
];

const conteudosMinistrados = [
  {
    id: "1",
    data: "2024-01-22",
    unidade: "Unidade 1",
    capitulo: "Capítulo 3",
    tema: "Operações com frações",
    descricao: "Adição, subtração, multiplicação e divisão de frações com denominadores diferentes.",
    recursos: ["Livro didático", "Quadro branco", "Material concreto"],
    observacoes: "Alunos demonstraram dificuldade na divisão de frações",
    status: "concluido",
  },
  {
    id: "2",
    data: "2024-01-23",
    unidade: "Unidade 1",
    capitulo: "Capítulo 4",
    tema: "Frações e decimais",
    descricao: "Conversão entre frações e números decimais. Representação na reta numérica.",
    recursos: ["Livro didático", "Projetor", "Atividades impressas"],
    observacoes: "",
    status: "em_andamento",
  },
  {
    id: "3",
    data: "2024-01-25",
    unidade: "Unidade 2",
    capitulo: "Capítulo 1",
    tema: "Porcentagem",
    descricao: "Introdução ao conceito de porcentagem. Cálculos básicos e aplicações no cotidiano.",
    recursos: ["Livro didático", "Exercícios online"],
    observacoes: "",
    status: "planejado",
  },
];

const statsCards = [
  {
    title: "Aulas Registradas",
    value: "156",
    description: "Este bimestre",
    icon: BookOpen,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Frequência Média",
    value: "94.2%",
    description: "Todas as turmas",
    icon: Users,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    title: "Notas Lançadas",
    value: "89%",
    description: "Do total previsto",
    icon: ClipboardCheck,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    title: "Conteúdos",
    value: "42",
    description: "Registrados",
    icon: FileText,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
];

export default function DiarioClasse() {
  const [selectedTurma, setSelectedTurma] = useState<string>("");
  const [selectedDisciplina, setSelectedDisciplina] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [isAulaDialogOpen, setIsAulaDialogOpen] = useState(false);
  const [isChamadaDialogOpen, setIsChamadaDialogOpen] = useState(false);
  const [isNotaDialogOpen, setIsNotaDialogOpen] = useState(false);
  const [isConteudoDialogOpen, setIsConteudoDialogOpen] = useState(false);
  const [presencas, setPresencas] = useState<Record<string, boolean>>({});

  // Inicializar presenças
  const initializePresencas = () => {
    const initial: Record<string, boolean> = {};
    alunosTurma.forEach((aluno) => {
      initial[aluno.id] = true;
    });
    setPresencas(initial);
  };

  const togglePresenca = (alunoId: string) => {
    setPresencas((prev) => ({
      ...prev,
      [alunoId]: !prev[alunoId],
    }));
  };

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "concluida":
      case "concluido":
        return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Concluída</Badge>;
      case "pendente":
      case "planejado":
        return <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">Pendente</Badge>;
      case "em_andamento":
        return <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">Em Andamento</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const presentes = Object.values(presencas).filter(Boolean).length;
  const ausentes = Object.values(presencas).filter((v) => !v).length;

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
          <h1 className="text-3xl font-bold text-foreground">Diário de Classe</h1>
          <p className="text-muted-foreground">
            Gerencie aulas, frequência, notas e conteúdos ministrados
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAulaDialogOpen} onOpenChange={setIsAulaDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-brand text-white">
                <Plus className="mr-2 h-4 w-4" />
                Registrar Aula
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Registrar Nova Aula</DialogTitle>
                <DialogDescription>
                  Preencha os dados para registrar uma nova aula no diário.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="data">Data</Label>
                    <Input id="data" type="date" defaultValue={selectedDate} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="horario">Horário</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o horário" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">07:30 - 08:20</SelectItem>
                        <SelectItem value="2">08:20 - 09:10</SelectItem>
                        <SelectItem value="3">09:30 - 10:20</SelectItem>
                        <SelectItem value="4">10:20 - 11:10</SelectItem>
                        <SelectItem value="5">11:10 - 12:00</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="turma">Turma</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a turma" />
                      </SelectTrigger>
                      <SelectContent>
                        {turmasData.map((turma) => (
                          <SelectItem key={turma.id} value={turma.id}>
                            {turma.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="disciplina">Disciplina</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a disciplina" />
                      </SelectTrigger>
                      <SelectContent>
                        {disciplinasData.map((disc) => (
                          <SelectItem key={disc.id} value={disc.id}>
                            {disc.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="conteudo">Conteúdo Ministrado</Label>
                  <Textarea
                    id="conteudo"
                    placeholder="Descreva o conteúdo trabalhado na aula..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    placeholder="Observações adicionais sobre a aula..."
                    rows={2}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAulaDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button className="gradient-brand text-white" onClick={() => setIsAulaDialogOpen(false)}>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Aula
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => (
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

      {/* Filtros */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <Select value={selectedTurma} onValueChange={setSelectedTurma}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a turma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as turmas</SelectItem>
                    {turmasData.map((turma) => (
                      <SelectItem key={turma.id} value={turma.id}>
                        {turma.nome} - {turma.turno}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <Select value={selectedDisciplina} onValueChange={setSelectedDisciplina}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a disciplina" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as disciplinas</SelectItem>
                    {disciplinasData.map((disc) => (
                      <SelectItem key={disc.id} value={disc.id}>
                        {disc.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-[180px]">
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filtrar
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs principais */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="aulas" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="aulas" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Registro de Aulas</span>
              <span className="sm:hidden">Aulas</span>
            </TabsTrigger>
            <TabsTrigger value="chamada" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Chamada</span>
              <span className="sm:hidden">Chamada</span>
            </TabsTrigger>
            <TabsTrigger value="notas" className="flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Notas</span>
              <span className="sm:hidden">Notas</span>
            </TabsTrigger>
            <TabsTrigger value="conteudos" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Conteúdos</span>
              <span className="sm:hidden">Conteúdos</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab: Registro de Aulas */}
          <TabsContent value="aulas">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Aulas Registradas
                </CardTitle>
                <CardDescription>
                  Visualize e gerencie o registro de aulas ministradas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Horário</TableHead>
                      <TableHead>Turma</TableHead>
                      <TableHead>Disciplina</TableHead>
                      <TableHead>Conteúdo</TableHead>
                      <TableHead className="text-center">Presença</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {aulasRegistradas.map((aula) => (
                      <TableRow key={aula.id}>
                        <TableCell className="font-medium">
                          {new Date(aula.data).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell>{aula.horario}</TableCell>
                        <TableCell>{aula.turma}</TableCell>
                        <TableCell>{aula.disciplina}</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {aula.conteudo}
                        </TableCell>
                        <TableCell className="text-center">
                          {aula.status === "concluida" ? (
                            <div className="flex items-center justify-center gap-2">
                              <span className="text-green-500">{aula.presentes}P</span>
                              <span className="text-muted-foreground">/</span>
                              <span className="text-red-500">{aula.ausentes}A</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(aula.status)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                Visualizar
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Users className="mr-2 h-4 w-4" />
                                Ver Chamada
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Chamada */}
          <TabsContent value="chamada">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Chamada de Frequência
                  </CardTitle>
                  <CardDescription>
                    Registre a presença dos alunos na aula selecionada
                  </CardDescription>
                </div>
                <Dialog open={isChamadaDialogOpen} onOpenChange={setIsChamadaDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gradient-brand text-white" onClick={initializePresencas}>
                      <Plus className="mr-2 h-4 w-4" />
                      Nova Chamada
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Registrar Chamada</DialogTitle>
                      <DialogDescription>
                        Marque os alunos presentes na aula. Por padrão, todos são marcados como presentes.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Turma</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              {turmasData.map((turma) => (
                                <SelectItem key={turma.id} value={turma.id}>
                                  {turma.nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Disciplina</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              {disciplinasData.map((disc) => (
                                <SelectItem key={disc.id} value={disc.id}>
                                  {disc.nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Data</Label>
                          <Input type="date" defaultValue={selectedDate} />
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span className="font-medium">{presentes} Presentes</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <XCircle className="h-5 w-5 text-red-500" />
                            <span className="font-medium">{ausentes} Ausentes</span>
                          </div>
                        </div>
                        <Progress value={(presentes / alunosTurma.length) * 100} className="w-32" />
                      </div>

                      <div className="border rounded-lg">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[100px]">Matrícula</TableHead>
                              <TableHead>Nome do Aluno</TableHead>
                              <TableHead className="text-center w-[120px]">Presença</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {alunosTurma.map((aluno) => (
                              <TableRow key={aluno.id}>
                                <TableCell className="font-mono text-sm">{aluno.matricula}</TableCell>
                                <TableCell>{aluno.nome}</TableCell>
                                <TableCell className="text-center">
                                  <div className="flex items-center justify-center gap-2">
                                    <Button
                                      size="sm"
                                      variant={presencas[aluno.id] ? "default" : "outline"}
                                      className={presencas[aluno.id] ? "bg-green-500 hover:bg-green-600" : ""}
                                      onClick={() => togglePresenca(aluno.id)}
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant={!presencas[aluno.id] ? "default" : "outline"}
                                      className={!presencas[aluno.id] ? "bg-red-500 hover:bg-red-600" : ""}
                                      onClick={() => togglePresenca(aluno.id)}
                                    >
                                      <XCircle className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsChamadaDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button className="gradient-brand text-white" onClick={() => setIsChamadaDialogOpen(false)}>
                        <Save className="mr-2 h-4 w-4" />
                        Salvar Chamada
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Resumo de frequência por turma */}
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {turmasData.map((turma) => (
                      <Card key={turma.id} className="bg-muted/50">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{turma.nome}</span>
                            <Badge variant="outline">{turma.turno}</Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Frequência média</span>
                              <span className="font-medium text-green-500">94.5%</span>
                            </div>
                            <Progress value={94.5} className="h-2" />
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{turma.totalAlunos} alunos</span>
                              <span>Última: 22/01</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Alertas de frequência */}
                  <Card className="border-yellow-500/50 bg-yellow-500/5">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-500">Alunos com frequência baixa</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            3 alunos estão com frequência abaixo de 75% neste bimestre e precisam de atenção.
                          </p>
                          <Button variant="link" className="p-0 h-auto mt-2 text-yellow-500">
                            Ver detalhes →
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Notas */}
          <TabsContent value="notas">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardCheck className="h-5 w-5" />
                    Lançamento de Notas
                  </CardTitle>
                  <CardDescription>
                    Registre e gerencie as notas dos alunos por avaliação
                  </CardDescription>
                </div>
                <Dialog open={isNotaDialogOpen} onOpenChange={setIsNotaDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gradient-brand text-white">
                      <Plus className="mr-2 h-4 w-4" />
                      Lançar Notas
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Lançamento de Notas</DialogTitle>
                      <DialogDescription>
                        Insira as notas dos alunos para a avaliação selecionada.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label>Turma</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              {turmasData.map((turma) => (
                                <SelectItem key={turma.id} value={turma.id}>
                                  {turma.nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Disciplina</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              {disciplinasData.map((disc) => (
                                <SelectItem key={disc.id} value={disc.id}>
                                  {disc.nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Bimestre</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1º Bimestre</SelectItem>
                              <SelectItem value="2">2º Bimestre</SelectItem>
                              <SelectItem value="3">3º Bimestre</SelectItem>
                              <SelectItem value="4">4º Bimestre</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Avaliação</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="av1">AV1</SelectItem>
                              <SelectItem value="av2">AV2</SelectItem>
                              <SelectItem value="trabalho">Trabalho</SelectItem>
                              <SelectItem value="recuperacao">Recuperação</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="border rounded-lg">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[100px]">Matrícula</TableHead>
                              <TableHead>Nome do Aluno</TableHead>
                              <TableHead className="text-center w-[120px]">Nota</TableHead>
                              <TableHead className="w-[200px]">Observação</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {alunosTurma.map((aluno) => (
                              <TableRow key={aluno.id}>
                                <TableCell className="font-mono text-sm">{aluno.matricula}</TableCell>
                                <TableCell>{aluno.nome}</TableCell>
                                <TableCell>
                                  <Input
                                    type="number"
                                    min="0"
                                    max="10"
                                    step="0.1"
                                    placeholder="0.0"
                                    className="text-center"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input placeholder="Opcional..." />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsNotaDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button className="gradient-brand text-white" onClick={() => setIsNotaDialogOpen(false)}>
                        <Save className="mr-2 h-4 w-4" />
                        Salvar Notas
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Matrícula</TableHead>
                      <TableHead>Aluno</TableHead>
                      <TableHead className="text-center">AV1</TableHead>
                      <TableHead className="text-center">AV2</TableHead>
                      <TableHead className="text-center">Trabalhos</TableHead>
                      <TableHead className="text-center">Média</TableHead>
                      <TableHead>Situação</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {notasLancadas.map((nota) => (
                      <TableRow key={nota.id}>
                        <TableCell className="font-mono text-sm">{nota.matricula}</TableCell>
                        <TableCell className="font-medium">{nota.aluno}</TableCell>
                        <TableCell className="text-center">{nota.av1.toFixed(1)}</TableCell>
                        <TableCell className="text-center">{nota.av2.toFixed(1)}</TableCell>
                        <TableCell className="text-center">{nota.trabalhos.toFixed(1)}</TableCell>
                        <TableCell className="text-center font-bold">
                          <span className={nota.media >= 7 ? "text-green-500" : nota.media >= 5 ? "text-yellow-500" : "text-red-500"}>
                            {nota.media.toFixed(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {nota.media >= 7 ? (
                            <Badge className="bg-green-500/10 text-green-500">Aprovado</Badge>
                          ) : nota.media >= 5 ? (
                            <Badge className="bg-yellow-500/10 text-yellow-500">Recuperação</Badge>
                          ) : (
                            <Badge className="bg-red-500/10 text-red-500">Reprovado</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver Detalhes
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar Notas
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <TrendingUp className="mr-2 h-4 w-4" />
                                Histórico
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Conteúdos */}
          <TabsContent value="conteudos">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Conteúdos Ministrados
                  </CardTitle>
                  <CardDescription>
                    Registre e acompanhe os conteúdos programáticos trabalhados
                  </CardDescription>
                </div>
                <Dialog open={isConteudoDialogOpen} onOpenChange={setIsConteudoDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gradient-brand text-white">
                      <Plus className="mr-2 h-4 w-4" />
                      Novo Conteúdo
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Registrar Conteúdo</DialogTitle>
                      <DialogDescription>
                        Adicione um novo conteúdo ao planejamento da disciplina.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Turma</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              {turmasData.map((turma) => (
                                <SelectItem key={turma.id} value={turma.id}>
                                  {turma.nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Disciplina</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              {disciplinasData.map((disc) => (
                                <SelectItem key={disc.id} value={disc.id}>
                                  {disc.nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Data</Label>
                          <Input type="date" defaultValue={selectedDate} />
                        </div>
                        <div className="space-y-2">
                          <Label>Unidade</Label>
                          <Input placeholder="Ex: Unidade 1" />
                        </div>
                        <div className="space-y-2">
                          <Label>Capítulo</Label>
                          <Input placeholder="Ex: Capítulo 3" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Tema</Label>
                        <Input placeholder="Título do conteúdo..." />
                      </div>
                      <div className="space-y-2">
                        <Label>Descrição</Label>
                        <Textarea
                          placeholder="Descreva detalhadamente o conteúdo trabalhado..."
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Recursos Utilizados</Label>
                        <Textarea
                          placeholder="Livro didático, quadro, projetor, material concreto..."
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Observações</Label>
                        <Textarea
                          placeholder="Dificuldades encontradas, sugestões para próximas aulas..."
                          rows={2}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsConteudoDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button className="gradient-brand text-white" onClick={() => setIsConteudoDialogOpen(false)}>
                        <Save className="mr-2 h-4 w-4" />
                        Salvar Conteúdo
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {conteudosMinistrados.map((conteudo) => (
                    <Card key={conteudo.id} className="bg-muted/30">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className="rounded-lg bg-primary/10 p-3">
                              <BookMarked className="h-6 w-6 text-primary" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold">{conteudo.tema}</h4>
                                {getStatusBadge(conteudo.status)}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {conteudo.unidade} • {conteudo.capitulo}
                              </p>
                              <p className="text-sm mt-2">{conteudo.descricao}</p>
                              <div className="flex flex-wrap gap-2 mt-3">
                                {conteudo.recursos.map((recurso, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {recurso}
                                  </Badge>
                                ))}
                              </div>
                              {conteudo.observacoes && (
                                <p className="text-sm text-muted-foreground mt-2 italic">
                                  💡 {conteudo.observacoes}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className="text-sm text-muted-foreground">
                              {new Date(conteudo.data).toLocaleDateString("pt-BR")}
                            </span>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Ver Detalhes
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}

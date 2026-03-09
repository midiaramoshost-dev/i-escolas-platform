import { useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardCheck, Plus, Search, Clock, CheckCircle2, XCircle,
  Eye, Edit, Trash2, MoreHorizontal, Users, BarChart3,
  FileQuestion, Timer, Award, Loader2,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

interface Exam {
  id: string;
  title: string;
  subject: string;
  grade: string;
  teacher: string;
  status: "rascunho" | "agendada" | "em_andamento" | "encerrada";
  questionsCount: number;
  duration: number; // minutes
  startDate?: string;
  endDate?: string;
  attempts: number;
  averageScore: number;
  autoCorrection: boolean;
  questions: Question[];
}

interface Question {
  id: string;
  text: string;
  type: "multipla_escolha" | "verdadeiro_falso" | "dissertativa";
  options?: string[];
  correctAnswer?: string;
  points: number;
}

const initialExams: Exam[] = [
  {
    id: "1", title: "Avaliação 1º Bimestre - Matemática", subject: "Matemática", grade: "7º Ano",
    teacher: "Prof. Carlos", status: "encerrada", questionsCount: 15, duration: 60,
    startDate: "2026-03-01", endDate: "2026-03-01", attempts: 30, averageScore: 7.2,
    autoCorrection: true, questions: [
      { id: "q1", text: "Quanto é 2x + 5 = 15? Qual o valor de x?", type: "multipla_escolha", options: ["3", "5", "7", "10"], correctAnswer: "5", points: 1 },
      { id: "q2", text: "Todo número par é divisível por 2.", type: "verdadeiro_falso", correctAnswer: "Verdadeiro", points: 1 },
      { id: "q3", text: "Explique o conceito de fração equivalente.", type: "dissertativa", points: 2 },
    ],
  },
  {
    id: "2", title: "Prova de Português - Interpretação", subject: "Português", grade: "8º Ano",
    teacher: "Profª. Maria", status: "agendada", questionsCount: 10, duration: 45,
    startDate: "2026-03-15", endDate: "2026-03-15", attempts: 0, averageScore: 0,
    autoCorrection: true, questions: [],
  },
  {
    id: "3", title: "Quiz - Ciências da Natureza", subject: "Ciências", grade: "6º Ano",
    teacher: "Prof. André", status: "em_andamento", questionsCount: 20, duration: 30,
    startDate: "2026-03-09", endDate: "2026-03-09", attempts: 18, averageScore: 6.5,
    autoCorrection: true, questions: [],
  },
];

const subjectOptions = ["Matemática", "Português", "Ciências", "História", "Geografia", "Inglês"];
const gradeOptions = ["6º Ano", "7º Ano", "8º Ano", "9º Ano", "1º EM", "2º EM", "3º EM"];

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function LMSProvas() {
  const [exams, setExams] = useState<Exam[]>(initialExams);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [formData, setFormData] = useState({
    title: "", subject: "", grade: "", teacher: "", duration: "60",
    questionsCount: "10", autoCorrection: true, startDate: "", endDate: "",
  });

  const filteredExams = exams.filter((e) => {
    const matchSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "all" || e.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: exams.length,
    active: exams.filter((e) => e.status === "em_andamento").length,
    completed: exams.filter((e) => e.status === "encerrada").length,
    avgScore: exams.filter((e) => e.averageScore > 0).reduce((a, e) => a + e.averageScore, 0) / Math.max(exams.filter((e) => e.averageScore > 0).length, 1),
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "rascunho": return <Badge variant="secondary">Rascunho</Badge>;
      case "agendada": return <Badge className="bg-blue-500/10 text-blue-600 border-blue-200">Agendada</Badge>;
      case "em_andamento": return <Badge className="bg-amber-500/10 text-amber-600 border-amber-200">Em Andamento</Badge>;
      case "encerrada": return <Badge className="bg-green-500/10 text-green-600 border-green-200">Encerrada</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const handleSave = () => {
    if (!formData.title || !formData.subject) { toast.error("Preencha os campos obrigatórios"); return; }
    const newExam: Exam = {
      id: Date.now().toString(), title: formData.title, subject: formData.subject, grade: formData.grade,
      teacher: formData.teacher, status: "rascunho", questionsCount: parseInt(formData.questionsCount),
      duration: parseInt(formData.duration), startDate: formData.startDate, endDate: formData.endDate,
      attempts: 0, averageScore: 0, autoCorrection: formData.autoCorrection, questions: [],
    };
    setExams((prev) => [...prev, newExam]);
    setDialogOpen(false);
    toast.success("Prova criada!");
  };

  const handleDelete = (id: string) => {
    setExams((prev) => prev.filter((e) => e.id !== id));
    toast.success("Prova removida!");
  };

  return (
    <motion.div className="space-y-6 p-6" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ClipboardCheck className="h-8 w-8 text-primary" />
            LMS - Provas Online
          </h1>
          <p className="text-muted-foreground mt-1">Crie e gerencie avaliações online com correção automática</p>
        </div>
        <Button onClick={() => { setFormData({ title: "", subject: "", grade: "", teacher: "", duration: "60", questionsCount: "10", autoCorrection: true, startDate: "", endDate: "" }); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Nova Prova
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total de Provas", value: stats.total, icon: FileQuestion, color: "text-primary" },
          { label: "Em Andamento", value: stats.active, icon: Timer, color: "text-amber-500" },
          { label: "Encerradas", value: stats.completed, icon: CheckCircle2, color: "text-green-500" },
          { label: "Média Geral", value: stats.avgScore.toFixed(1), icon: Award, color: "text-blue-500" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted"><s.icon className={`h-5 w-5 ${s.color}`} /></div>
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Buscar provas..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos Status</SelectItem>
            <SelectItem value="rascunho">Rascunho</SelectItem>
            <SelectItem value="agendada">Agendada</SelectItem>
            <SelectItem value="em_andamento">Em Andamento</SelectItem>
            <SelectItem value="encerrada">Encerrada</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Exams Table */}
      <motion.div variants={itemVariants}>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Prova</TableHead>
                <TableHead>Disciplina</TableHead>
                <TableHead>Série</TableHead>
                <TableHead>Questões</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Realizações</TableHead>
                <TableHead>Média</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell className="font-medium">{exam.title}</TableCell>
                  <TableCell>{exam.subject}</TableCell>
                  <TableCell>{exam.grade}</TableCell>
                  <TableCell>{exam.questionsCount}</TableCell>
                  <TableCell>{exam.duration}min</TableCell>
                  <TableCell>{exam.attempts}</TableCell>
                  <TableCell>{exam.averageScore > 0 ? exam.averageScore.toFixed(1) : "-"}</TableCell>
                  <TableCell>{getStatusBadge(exam.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setSelectedExam(exam); setViewDialogOpen(true); }}><Eye className="h-4 w-4 mr-2" />Ver Detalhes</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(exam.id)}><Trash2 className="h-4 w-4 mr-2" />Excluir</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </motion.div>

      {/* Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nova Prova Online</DialogTitle>
            <DialogDescription>Configure a avaliação</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Título *</Label>
              <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Ex: Avaliação 1º Bimestre" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Disciplina *</Label>
                <Select value={formData.subject} onValueChange={(v) => setFormData({ ...formData, subject: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{subjectOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Série</Label>
                <Select value={formData.grade} onValueChange={(v) => setFormData({ ...formData, grade: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{gradeOptions.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Duração (min)</Label>
                <Input type="number" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Nº de Questões</Label>
                <Input type="number" value={formData.questionsCount} onChange={(e) => setFormData({ ...formData, questionsCount: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data Início</Label>
                <Input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Data Fim</Label>
                <Input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={formData.autoCorrection} onCheckedChange={(v) => setFormData({ ...formData, autoCorrection: v })} />
              <Label>Correção automática</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Criar Prova</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedExam && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedExam.title}</DialogTitle>
                <DialogDescription>{selectedExam.subject} - {selectedExam.grade} • {selectedExam.teacher}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {getStatusBadge(selectedExam.status)}
                  <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />{selectedExam.duration}min</Badge>
                  <Badge variant="outline">{selectedExam.questionsCount} questões</Badge>
                  {selectedExam.autoCorrection && <Badge variant="outline"><CheckCircle2 className="h-3 w-3 mr-1" />Auto-correção</Badge>}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <Card><CardContent className="p-3 text-center"><p className="text-sm text-muted-foreground">Realizações</p><p className="text-xl font-bold">{selectedExam.attempts}</p></CardContent></Card>
                  <Card><CardContent className="p-3 text-center"><p className="text-sm text-muted-foreground">Média</p><p className="text-xl font-bold">{selectedExam.averageScore > 0 ? selectedExam.averageScore.toFixed(1) : "-"}</p></CardContent></Card>
                  <Card><CardContent className="p-3 text-center"><p className="text-sm text-muted-foreground">Período</p><p className="text-sm font-medium">{selectedExam.startDate || "-"}</p></CardContent></Card>
                </div>
                {selectedExam.questions.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold">Questões</h3>
                    {selectedExam.questions.map((q, i) => (
                      <Card key={q.id}>
                        <CardContent className="p-4">
                          <p className="text-sm font-medium mb-2">{i + 1}. {q.text} <Badge variant="outline" className="ml-2">{q.points}pt</Badge></p>
                          {q.options && (
                            <div className="ml-4 space-y-1">
                              {q.options.map((opt, j) => (
                                <p key={j} className={`text-sm ${opt === q.correctAnswer ? "text-green-600 font-medium" : "text-muted-foreground"}`}>
                                  {String.fromCharCode(65 + j)}) {opt} {opt === q.correctAnswer && "✓"}
                                </p>
                              ))}
                            </div>
                          )}
                          {q.type === "verdadeiro_falso" && <p className="text-sm text-green-600 ml-4">Resposta: {q.correctAnswer}</p>}
                          {q.type === "dissertativa" && <p className="text-sm text-muted-foreground ml-4 italic">Questão dissertativa - correção manual</p>}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

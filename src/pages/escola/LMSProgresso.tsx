import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3, Users, BookOpen, TrendingUp, Award,
  Search, Download, ChevronRight, CheckCircle2, Clock, XCircle,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

interface StudentProgress {
  id: string;
  name: string;
  grade: string;
  coursesEnrolled: number;
  coursesCompleted: number;
  overallProgress: number;
  averageScore: number;
  lastActivity: string;
  totalHours: number;
  status: "ativo" | "inativo" | "concluído";
}

const mockStudents: StudentProgress[] = [
  { id: "1", name: "Ana Silva", grade: "7º Ano", coursesEnrolled: 4, coursesCompleted: 2, overallProgress: 75, averageScore: 8.2, lastActivity: "2026-03-09", totalHours: 32, status: "ativo" },
  { id: "2", name: "Carlos Santos", grade: "7º Ano", coursesEnrolled: 3, coursesCompleted: 1, overallProgress: 45, averageScore: 6.5, lastActivity: "2026-03-08", totalHours: 18, status: "ativo" },
  { id: "3", name: "Maria Oliveira", grade: "8º Ano", coursesEnrolled: 5, coursesCompleted: 4, overallProgress: 92, averageScore: 9.1, lastActivity: "2026-03-09", totalHours: 48, status: "ativo" },
  { id: "4", name: "João Pedro", grade: "8º Ano", coursesEnrolled: 3, coursesCompleted: 0, overallProgress: 20, averageScore: 5.0, lastActivity: "2026-03-01", totalHours: 8, status: "inativo" },
  { id: "5", name: "Beatriz Costa", grade: "9º Ano", coursesEnrolled: 4, coursesCompleted: 3, overallProgress: 85, averageScore: 7.8, lastActivity: "2026-03-09", totalHours: 40, status: "ativo" },
  { id: "6", name: "Lucas Lima", grade: "9º Ano", coursesEnrolled: 2, coursesCompleted: 0, overallProgress: 10, averageScore: 3.5, lastActivity: "2026-02-20", totalHours: 4, status: "inativo" },
  { id: "7", name: "Fernanda Rocha", grade: "6º Ano", coursesEnrolled: 3, coursesCompleted: 3, overallProgress: 100, averageScore: 8.7, lastActivity: "2026-03-07", totalHours: 35, status: "concluído" },
  { id: "8", name: "Pedro Alves", grade: "7º Ano", coursesEnrolled: 4, coursesCompleted: 2, overallProgress: 60, averageScore: 7.0, lastActivity: "2026-03-09", totalHours: 25, status: "ativo" },
];

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function LMSProgresso() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGrade, setFilterGrade] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredStudents = mockStudents.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchGrade = filterGrade === "all" || s.grade === filterGrade;
    const matchStatus = filterStatus === "all" || s.status === filterStatus;
    return matchSearch && matchGrade && matchStatus;
  });

  const stats = {
    totalStudents: mockStudents.length,
    avgProgress: Math.round(mockStudents.reduce((a, s) => a + s.overallProgress, 0) / mockStudents.length),
    avgScore: (mockStudents.reduce((a, s) => a + s.averageScore, 0) / mockStudents.length).toFixed(1),
    totalHours: mockStudents.reduce((a, s) => a + s.totalHours, 0),
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ativo": return <Badge className="bg-green-500/10 text-green-600 border-green-200">Ativo</Badge>;
      case "inativo": return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Inativo</Badge>;
      case "concluído": return <Badge className="bg-blue-500/10 text-blue-600 border-blue-200">Concluído</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "text-green-600";
    if (progress >= 50) return "text-amber-600";
    return "text-destructive";
  };

  const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <motion.div className="space-y-6 p-6" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            LMS - Progresso dos Alunos
          </h1>
          <p className="text-muted-foreground mt-1">Acompanhe o desempenho e engajamento dos alunos nos cursos</p>
        </div>
        <Button variant="outline" onClick={() => toast.success("Relatório exportado!")}>
          <Download className="h-4 w-4 mr-2" /> Exportar Relatório
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Alunos no LMS", value: stats.totalStudents, icon: Users, color: "text-primary" },
          { label: "Progresso Médio", value: `${stats.avgProgress}%`, icon: TrendingUp, color: "text-green-500" },
          { label: "Nota Média", value: stats.avgScore, icon: Award, color: "text-amber-500" },
          { label: "Horas Estudadas", value: `${stats.totalHours}h`, icon: Clock, color: "text-blue-500" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted"><s.icon className={`h-5 w-5 ${s.color}`} /></div>
              <div><p className="text-sm text-muted-foreground">{s.label}</p><p className="text-2xl font-bold">{s.value}</p></div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Buscar aluno..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <Select value={filterGrade} onValueChange={setFilterGrade}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas Séries</SelectItem>
            {["6º Ano", "7º Ano", "8º Ano", "9º Ano"].map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="ativo">Ativo</SelectItem>
            <SelectItem value="inativo">Inativo</SelectItem>
            <SelectItem value="concluído">Concluído</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Students Table */}
      <motion.div variants={itemVariants}>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Aluno</TableHead>
                <TableHead>Série</TableHead>
                <TableHead>Cursos</TableHead>
                <TableHead>Progresso</TableHead>
                <TableHead>Nota Média</TableHead>
                <TableHead>Horas</TableHead>
                <TableHead>Última Atividade</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8"><AvatarFallback className="text-xs">{getInitials(student.name)}</AvatarFallback></Avatar>
                      <span className="font-medium">{student.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{student.grade}</TableCell>
                  <TableCell>{student.coursesCompleted}/{student.coursesEnrolled}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={student.overallProgress} className="h-2 w-20" />
                      <span className={`text-sm font-medium ${getProgressColor(student.overallProgress)}`}>{student.overallProgress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={student.averageScore < 6 ? "text-destructive font-medium" : "font-medium"}>
                      {student.averageScore.toFixed(1)}
                    </span>
                  </TableCell>
                  <TableCell>{student.totalHours}h</TableCell>
                  <TableCell className="text-muted-foreground">{student.lastActivity}</TableCell>
                  <TableCell>{getStatusBadge(student.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </motion.div>

      {/* Top Performers */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" /> Melhores Desempenhos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[...mockStudents].sort((a, b) => b.averageScore - a.averageScore).slice(0, 5).map((s, i) => (
              <div key={s.id} className="flex items-center gap-3">
                <span className="text-lg font-bold text-muted-foreground w-6">{i + 1}º</span>
                <Avatar className="h-8 w-8"><AvatarFallback className="text-xs">{getInitials(s.name)}</AvatarFallback></Avatar>
                <div className="flex-1"><p className="text-sm font-medium">{s.name}</p><p className="text-xs text-muted-foreground">{s.grade}</p></div>
                <Badge variant="outline">{s.averageScore.toFixed(1)}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <XCircle className="h-5 w-5 text-destructive" /> Alunos que Precisam de Atenção
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockStudents.filter((s) => s.overallProgress < 50 || s.status === "inativo").map((s) => (
              <div key={s.id} className="flex items-center gap-3">
                <Avatar className="h-8 w-8"><AvatarFallback className="text-xs">{getInitials(s.name)}</AvatarFallback></Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.grade} • Progresso: {s.overallProgress}%</p>
                </div>
                {getStatusBadge(s.status)}
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

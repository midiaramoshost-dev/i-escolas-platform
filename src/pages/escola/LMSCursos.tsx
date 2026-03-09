import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen, Plus, Search, Users, Clock, PlayCircle, FileText,
  MoreHorizontal, Eye, Edit, Trash2, BarChart3, CheckCircle2,
  Video, File, Link2, GraduationCap, Loader2,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface Course {
  id: string;
  title: string;
  description: string;
  subject: string;
  grade: string;
  teacher: string;
  thumbnail?: string;
  status: "rascunho" | "publicado" | "arquivado";
  studentsEnrolled: number;
  lessonsCount: number;
  progress: number;
  createdAt: string;
  modules: CourseModule[];
}

interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  type: "video" | "pdf" | "text" | "link";
  duration?: string;
  completed?: boolean;
}

const initialCourses: Course[] = [
  {
    id: "1", title: "Matemática Fundamental - 7º Ano", description: "Curso completo de matemática cobrindo álgebra, geometria e estatística básica.",
    subject: "Matemática", grade: "7º Ano", teacher: "Prof. Carlos", status: "publicado", studentsEnrolled: 32, lessonsCount: 24, progress: 75, createdAt: "2026-02-15",
    modules: [
      { id: "m1", title: "Álgebra Básica", lessons: [
        { id: "l1", title: "Introdução às Equações", type: "video", duration: "15min", completed: true },
        { id: "l2", title: "Equações do 1º Grau", type: "video", duration: "20min", completed: true },
        { id: "l3", title: "Material de Apoio - Álgebra", type: "pdf", completed: false },
      ]},
      { id: "m2", title: "Geometria Plana", lessons: [
        { id: "l4", title: "Ângulos e Triângulos", type: "video", duration: "18min", completed: false },
        { id: "l5", title: "Área e Perímetro", type: "text", completed: false },
      ]},
    ],
  },
  {
    id: "2", title: "Português - Interpretação de Texto", description: "Desenvolvimento de habilidades de leitura e interpretação textual.",
    subject: "Português", grade: "8º Ano", teacher: "Profª. Maria", status: "publicado", studentsEnrolled: 28, lessonsCount: 18, progress: 45, createdAt: "2026-02-20",
    modules: [
      { id: "m3", title: "Gêneros Textuais", lessons: [
        { id: "l6", title: "Narrativa e Crônica", type: "video", duration: "22min", completed: true },
        { id: "l7", title: "Texto Dissertativo", type: "text", completed: false },
      ]},
    ],
  },
  {
    id: "3", title: "Ciências - Ecossistemas", description: "Estudo dos ecossistemas brasileiros e biodiversidade.",
    subject: "Ciências", grade: "6º Ano", teacher: "Prof. André", status: "rascunho", studentsEnrolled: 0, lessonsCount: 12, progress: 0, createdAt: "2026-03-01",
    modules: [
      { id: "m4", title: "Biomas Brasileiros", lessons: [
        { id: "l8", title: "Amazônia", type: "video", duration: "25min" },
        { id: "l9", title: "Cerrado e Caatinga", type: "video", duration: "20min" },
        { id: "l10", title: "Links de Referência", type: "link" },
      ]},
    ],
  },
  {
    id: "4", title: "História do Brasil Colonial", description: "Período colonial brasileiro do descobrimento à independência.",
    subject: "História", grade: "9º Ano", teacher: "Profª. Lúcia", status: "publicado", studentsEnrolled: 35, lessonsCount: 20, progress: 60, createdAt: "2026-01-10",
    modules: [],
  },
];

const subjectOptions = ["Matemática", "Português", "Ciências", "História", "Geografia", "Inglês", "Artes", "Educação Física"];
const gradeOptions = ["1º Ano", "2º Ano", "3º Ano", "4º Ano", "5º Ano", "6º Ano", "7º Ano", "8º Ano", "9º Ano", "1º EM", "2º EM", "3º EM"];

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function LMSCursos() {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", subject: "", grade: "", teacher: "" });

  const filteredCourses = courses.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || c.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === "all" || c.subject === filterSubject;
    const matchesStatus = filterStatus === "all" || c.status === filterStatus;
    return matchesSearch && matchesSubject && matchesStatus;
  });

  const stats = {
    total: courses.length,
    published: courses.filter((c) => c.status === "publicado").length,
    students: courses.reduce((a, c) => a + c.studentsEnrolled, 0),
    lessons: courses.reduce((a, c) => a + c.lessonsCount, 0),
  };

  const handleCreate = () => {
    setIsEditing(false);
    setFormData({ title: "", description: "", subject: "", grade: "", teacher: "" });
    setDialogOpen(true);
  };

  const handleEdit = (course: Course) => {
    setIsEditing(true);
    setSelectedCourse(course);
    setFormData({ title: course.title, description: course.description, subject: course.subject, grade: course.grade, teacher: course.teacher });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.subject || !formData.grade) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }
    if (isEditing && selectedCourse) {
      setCourses((prev) => prev.map((c) => c.id === selectedCourse.id ? { ...c, ...formData } : c));
      toast.success("Curso atualizado!");
    } else {
      const newCourse: Course = {
        id: Date.now().toString(), ...formData, status: "rascunho", studentsEnrolled: 0, lessonsCount: 0, progress: 0,
        createdAt: new Date().toISOString().split("T")[0], modules: [],
      };
      setCourses((prev) => [...prev, newCourse]);
      toast.success("Curso criado!");
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
    toast.success("Curso removido!");
  };

  const handleToggleStatus = (course: Course) => {
    const newStatus = course.status === "publicado" ? "rascunho" : "publicado";
    setCourses((prev) => prev.map((c) => c.id === course.id ? { ...c, status: newStatus } : c));
    toast.success(newStatus === "publicado" ? "Curso publicado!" : "Curso despublicado");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "publicado": return <Badge className="bg-green-500/10 text-green-600 border-green-200">Publicado</Badge>;
      case "rascunho": return <Badge variant="secondary">Rascunho</Badge>;
      case "arquivado": return <Badge variant="outline">Arquivado</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="h-4 w-4 text-primary" />;
      case "pdf": return <File className="h-4 w-4 text-destructive" />;
      case "text": return <FileText className="h-4 w-4 text-amber-500" />;
      case "link": return <Link2 className="h-4 w-4 text-blue-500" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <motion.div className="space-y-6 p-6" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            LMS - Cursos
          </h1>
          <p className="text-muted-foreground mt-1">Gerencie cursos, aulas e conteúdos digitais</p>
        </div>
        <Button onClick={handleCreate}><Plus className="h-4 w-4 mr-2" /> Novo Curso</Button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total de Cursos", value: stats.total, icon: BookOpen, color: "text-primary" },
          { label: "Publicados", value: stats.published, icon: CheckCircle2, color: "text-green-500" },
          { label: "Alunos Matriculados", value: stats.students, icon: Users, color: "text-amber-500" },
          { label: "Total de Aulas", value: stats.lessons, icon: PlayCircle, color: "text-blue-500" },
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
          <Input className="pl-9" placeholder="Buscar cursos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <Select value={filterSubject} onValueChange={setFilterSubject}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Disciplina" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas Disciplinas</SelectItem>
            {subjectOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="publicado">Publicados</SelectItem>
            <SelectItem value="rascunho">Rascunhos</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Course Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base line-clamp-2">{course.title}</CardTitle>
                  <CardDescription className="mt-1 line-clamp-2">{course.description}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => { setSelectedCourse(course); setViewDialogOpen(true); }}><Eye className="h-4 w-4 mr-2" />Visualizar</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEdit(course)}><Edit className="h-4 w-4 mr-2" />Editar</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleToggleStatus(course)}>{course.status === "publicado" ? "Despublicar" : "Publicar"}</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(course.id)}><Trash2 className="h-4 w-4 mr-2" />Excluir</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{course.subject}</Badge>
                <Badge variant="outline">{course.grade}</Badge>
                {getStatusBadge(course.status)}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{course.studentsEnrolled}</span>
                <span className="flex items-center gap-1"><PlayCircle className="h-3.5 w-3.5" />{course.lessonsCount} aulas</span>
                <span className="flex items-center gap-1"><GraduationCap className="h-3.5 w-3.5" />{course.teacher}</span>
              </div>
              {course.status === "publicado" && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Progresso médio</span>
                    <span>{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Nenhum curso encontrado</p>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Curso" : "Novo Curso"}</DialogTitle>
            <DialogDescription>Preencha os dados do curso</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Título *</Label>
              <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Ex: Matemática Fundamental" />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Descreva o curso..." />
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
                <Label>Série *</Label>
                <Select value={formData.grade} onValueChange={(v) => setFormData({ ...formData, grade: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{gradeOptions.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Professor</Label>
              <Input value={formData.teacher} onChange={(e) => setFormData({ ...formData, teacher: e.target.value })} placeholder="Nome do professor" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>{isEditing ? "Salvar" : "Criar Curso"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Course Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedCourse && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedCourse.title}</DialogTitle>
                <DialogDescription>{selectedCourse.description}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{selectedCourse.subject}</Badge>
                  <Badge variant="outline">{selectedCourse.grade}</Badge>
                  {getStatusBadge(selectedCourse.status)}
                </div>
                <div className="text-sm text-muted-foreground">Professor: {selectedCourse.teacher} • {selectedCourse.studentsEnrolled} alunos • {selectedCourse.lessonsCount} aulas</div>

                {selectedCourse.modules.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="font-semibold">Módulos e Aulas</h3>
                    {selectedCourse.modules.map((mod) => (
                      <Card key={mod.id}>
                        <CardHeader className="py-3">
                          <CardTitle className="text-sm">{mod.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {mod.lessons.map((lesson) => (
                            <div key={lesson.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50">
                              {getLessonIcon(lesson.type)}
                              <span className="flex-1 text-sm">{lesson.title}</span>
                              {lesson.duration && <span className="text-xs text-muted-foreground">{lesson.duration}</span>}
                              {lesson.completed && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhum módulo adicionado ainda.</p>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

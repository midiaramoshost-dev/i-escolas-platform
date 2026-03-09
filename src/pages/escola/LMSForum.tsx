import { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare, Plus, Search, ThumbsUp, MessageCircle, Pin,
  MoreHorizontal, Eye, Trash2, Users, Clock, Lock, Unlock,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface ForumTopic {
  id: string;
  title: string;
  content: string;
  author: string;
  authorRole: "professor" | "aluno" | "coordenador";
  subject: string;
  grade: string;
  createdAt: string;
  replies: number;
  likes: number;
  views: number;
  pinned: boolean;
  locked: boolean;
  lastReply?: { author: string; date: string };
}

const initialTopics: ForumTopic[] = [
  {
    id: "1", title: "Dúvida sobre equações do 2º grau", content: "Alguém pode me ajudar a entender a fórmula de Bhaskara? Estou com dificuldade nos casos onde o delta é negativo.",
    author: "Ana Silva", authorRole: "aluno", subject: "Matemática", grade: "9º Ano",
    createdAt: "2026-03-08", replies: 5, likes: 3, views: 42, pinned: false, locked: false,
    lastReply: { author: "Prof. Carlos", date: "2026-03-09" },
  },
  {
    id: "2", title: "Material complementar - Era Vargas", content: "Compartilhando um documentário excelente sobre o período Vargas. Link: https://example.com/vargas",
    author: "Profª. Lúcia", authorRole: "professor", subject: "História", grade: "9º Ano",
    createdAt: "2026-03-07", replies: 8, likes: 12, views: 65, pinned: true, locked: false,
    lastReply: { author: "João Pedro", date: "2026-03-09" },
  },
  {
    id: "3", title: "Regras do Fórum - Leia antes de postar", content: "1. Respeite os colegas\n2. Use linguagem adequada\n3. Poste na categoria correta\n4. Sem spam",
    author: "Coord. Pedagógica", authorRole: "coordenador", subject: "Geral", grade: "Todas",
    createdAt: "2026-02-01", replies: 0, likes: 15, views: 230, pinned: true, locked: true,
  },
  {
    id: "4", title: "Grupo de estudos para a prova de Ciências", content: "Vamos montar um grupo de estudos para a prova de ecossistemas? Podemos nos reunir online quinta-feira.",
    author: "Beatriz Costa", authorRole: "aluno", subject: "Ciências", grade: "6º Ano",
    createdAt: "2026-03-06", replies: 12, likes: 8, views: 55, pinned: false, locked: false,
    lastReply: { author: "Lucas Lima", date: "2026-03-08" },
  },
  {
    id: "5", title: "Dica de redação - Como estruturar a dissertação", content: "Segue um guia prático para estruturar sua dissertação argumentativa com introdução, desenvolvimento e conclusão.",
    author: "Profª. Maria", authorRole: "professor", subject: "Português", grade: "8º Ano",
    createdAt: "2026-03-05", replies: 6, likes: 20, views: 88, pinned: false, locked: false,
    lastReply: { author: "Carlos Santos", date: "2026-03-07" },
  },
];

const subjectOptions = ["Geral", "Matemática", "Português", "Ciências", "História", "Geografia", "Inglês"];

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function LMSForum() {
  const [topics, setTopics] = useState<ForumTopic[]>(initialTopics);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<ForumTopic | null>(null);
  const [formData, setFormData] = useState({ title: "", content: "", subject: "Geral" });
  const [replyText, setReplyText] = useState("");

  const sortedTopics = [...topics].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const filteredTopics = sortedTopics.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSubject = filterSubject === "all" || t.subject === filterSubject;
    return matchSearch && matchSubject;
  });

  const stats = {
    total: topics.length,
    replies: topics.reduce((a, t) => a + t.replies, 0),
    activeToday: topics.filter((t) => t.lastReply?.date === "2026-03-09").length,
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "professor": return <Badge className="bg-primary/10 text-primary border-primary/20">Professor</Badge>;
      case "coordenador": return <Badge className="bg-amber-500/10 text-amber-600 border-amber-200">Coordenação</Badge>;
      default: return <Badge variant="secondary">Aluno</Badge>;
    }
  };

  const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const handleCreate = () => {
    if (!formData.title || !formData.content) { toast.error("Preencha título e conteúdo"); return; }
    const newTopic: ForumTopic = {
      id: Date.now().toString(), title: formData.title, content: formData.content,
      author: "Você", authorRole: "professor", subject: formData.subject,
      grade: "Todas", createdAt: new Date().toISOString().split("T")[0],
      replies: 0, likes: 0, views: 0, pinned: false, locked: false,
    };
    setTopics((prev) => [newTopic, ...prev]);
    setDialogOpen(false);
    setFormData({ title: "", content: "", subject: "Geral" });
    toast.success("Tópico criado!");
  };

  const handleDelete = (id: string) => {
    setTopics((prev) => prev.filter((t) => t.id !== id));
    toast.success("Tópico removido!");
  };

  const handleTogglePin = (id: string) => {
    setTopics((prev) => prev.map((t) => t.id === id ? { ...t, pinned: !t.pinned } : t));
    toast.success("Tópico atualizado!");
  };

  const handleToggleLock = (id: string) => {
    setTopics((prev) => prev.map((t) => t.id === id ? { ...t, locked: !t.locked } : t));
    toast.success("Tópico atualizado!");
  };

  const handleReply = () => {
    if (!replyText.trim()) return;
    if (selectedTopic) {
      setTopics((prev) => prev.map((t) => t.id === selectedTopic.id ? { ...t, replies: t.replies + 1, lastReply: { author: "Você", date: "2026-03-09" } } : t));
      setReplyText("");
      toast.success("Resposta enviada!");
    }
  };

  return (
    <motion.div className="space-y-6 p-6" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MessageSquare className="h-8 w-8 text-primary" />
            LMS - Fórum de Discussão
          </h1>
          <p className="text-muted-foreground mt-1">Espaço colaborativo para discussões entre alunos e professores</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}><Plus className="h-4 w-4 mr-2" /> Novo Tópico</Button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
        {[
          { label: "Tópicos", value: stats.total, icon: MessageSquare },
          { label: "Respostas", value: stats.replies, icon: MessageCircle },
          { label: "Ativos Hoje", value: stats.activeToday, icon: Clock },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted"><s.icon className="h-5 w-5 text-primary" /></div>
              <div><p className="text-sm text-muted-foreground">{s.label}</p><p className="text-2xl font-bold">{s.value}</p></div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Buscar tópicos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <Select value={filterSubject} onValueChange={setFilterSubject}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas Disciplinas</SelectItem>
            {subjectOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </motion.div>

      {/* Topics List */}
      <motion.div variants={itemVariants} className="space-y-3">
        {filteredTopics.map((topic) => (
          <Card key={topic.id} className={`hover:shadow-md transition-shadow cursor-pointer ${topic.pinned ? "border-primary/30" : ""}`}
            onClick={() => { setSelectedTopic(topic); setViewDialogOpen(true); }}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="text-xs">{getInitials(topic.author)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {topic.pinned && <Pin className="h-3.5 w-3.5 text-primary" />}
                    {topic.locked && <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
                    <h3 className="font-semibold text-sm truncate">{topic.title}</h3>
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs text-muted-foreground">{topic.author}</span>
                    {getRoleBadge(topic.authorRole)}
                    <Badge variant="outline" className="text-xs">{topic.subject}</Badge>
                    <span className="text-xs text-muted-foreground">{topic.createdAt}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{topic.content}</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground shrink-0">
                  <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" />{topic.replies}</span>
                  <span className="flex items-center gap-1"><ThumbsUp className="h-3.5 w-3.5" />{topic.likes}</span>
                  <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{topic.views}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleTogglePin(topic.id); }}><Pin className="h-4 w-4 mr-2" />{topic.pinned ? "Desafixar" : "Fixar"}</DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleToggleLock(topic.id); }}>{topic.locked ? <><Unlock className="h-4 w-4 mr-2" />Desbloquear</> : <><Lock className="h-4 w-4 mr-2" />Bloquear</>}</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={(e) => { e.stopPropagation(); handleDelete(topic.id); }}><Trash2 className="h-4 w-4 mr-2" />Excluir</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Create Topic Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Novo Tópico</DialogTitle>
            <DialogDescription>Crie uma discussão no fórum</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Título *</Label>
              <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Título do tópico" />
            </div>
            <div className="space-y-2">
              <Label>Disciplina</Label>
              <Select value={formData.subject} onValueChange={(v) => setFormData({ ...formData, subject: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{subjectOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Conteúdo *</Label>
              <Textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} placeholder="Escreva sua mensagem..." rows={5} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate}>Publicar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Topic Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedTopic && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selectedTopic.pinned && <Pin className="h-4 w-4 text-primary" />}
                  {selectedTopic.title}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-2">
                  {selectedTopic.author} • {getRoleBadge(selectedTopic.authorRole)} • {selectedTopic.createdAt}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm whitespace-pre-wrap">{selectedTopic.content}</p>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><ThumbsUp className="h-4 w-4" />{selectedTopic.likes}</span>
                  <span className="flex items-center gap-1"><MessageCircle className="h-4 w-4" />{selectedTopic.replies} respostas</span>
                  <span className="flex items-center gap-1"><Eye className="h-4 w-4" />{selectedTopic.views} visualizações</span>
                </div>
                <Separator />
                {!selectedTopic.locked ? (
                  <div className="space-y-2">
                    <Label>Responder</Label>
                    <Textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Escreva sua resposta..." rows={3} />
                    <Button size="sm" onClick={handleReply}>Enviar Resposta</Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground flex items-center gap-2"><Lock className="h-4 w-4" />Este tópico está bloqueado para novas respostas.</p>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

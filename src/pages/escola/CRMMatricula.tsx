import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  UserPlus, Search, Plus, MoreHorizontal, Eye, Edit, Trash2,
  Phone, Mail, MapPin, FileText, ChevronRight, Calendar,
  MessageSquare, Clock, CheckCircle2, XCircle, ArrowRight,
  TrendingUp, Users, Target, Award, Bell, Send,
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

type FunnelStage = "lead" | "contato" | "visita" | "proposta" | "matricula";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  childName: string;
  childAge: number;
  gradeInterest: string;
  source: string;
  stage: FunnelStage;
  createdAt: string;
  updatedAt: string;
  notes: string;
  history: HistoryEntry[];
  nextFollowUp?: string;
  assignedTo?: string;
  value?: number;
}

interface HistoryEntry {
  id: string;
  date: string;
  type: "note" | "call" | "email" | "whatsapp" | "visit" | "stage_change";
  description: string;
  author: string;
}

const stageConfig: Record<FunnelStage, { label: string; color: string; bgColor: string; icon: typeof UserPlus }> = {
  lead: { label: "Lead", color: "text-blue-600", bgColor: "bg-blue-500/10 border-blue-200", icon: UserPlus },
  contato: { label: "Contato", color: "text-amber-600", bgColor: "bg-amber-500/10 border-amber-200", icon: Phone },
  visita: { label: "Visita", color: "text-purple-600", bgColor: "bg-purple-500/10 border-purple-200", icon: MapPin },
  proposta: { label: "Proposta", color: "text-orange-600", bgColor: "bg-orange-500/10 border-orange-200", icon: FileText },
  matricula: { label: "Matrícula", color: "text-green-600", bgColor: "bg-green-500/10 border-green-200", icon: CheckCircle2 },
};

const stageOrder: FunnelStage[] = ["lead", "contato", "visita", "proposta", "matricula"];

const sourceOptions = ["Site", "Indicação", "Redes Sociais", "Google", "Evento", "Panfleto", "Telefone", "Outro"];
const gradeOptions = ["Educação Infantil", "1º Ano", "2º Ano", "3º Ano", "4º Ano", "5º Ano", "6º Ano", "7º Ano", "8º Ano", "9º Ano", "1º EM", "2º EM", "3º EM"];

const initialLeads: Lead[] = [
  {
    id: "1", name: "Fernanda Rodrigues", email: "fernanda@email.com", phone: "(15) 99876-5432",
    childName: "Pedro Rodrigues", childAge: 10, gradeInterest: "5º Ano", source: "Site",
    stage: "lead", createdAt: "2026-03-08", updatedAt: "2026-03-08", notes: "Encontrou pelo Google. Interesse em período integral.",
    history: [{ id: "h1", date: "2026-03-08", type: "note", description: "Lead captado via formulário do site", author: "Sistema" }],
    nextFollowUp: "2026-03-10",
  },
  {
    id: "2", name: "Ricardo Almeida", email: "ricardo.alm@email.com", phone: "(15) 98765-1234",
    childName: "Julia Almeida", childAge: 7, gradeInterest: "2º Ano", source: "Indicação",
    stage: "contato", createdAt: "2026-03-05", updatedAt: "2026-03-07", notes: "Indicado pela família Silva. Quer escola bilíngue.",
    history: [
      { id: "h2", date: "2026-03-05", type: "note", description: "Lead captado via indicação", author: "Sistema" },
      { id: "h3", date: "2026-03-06", type: "call", description: "Ligação de apresentação. Interesse em bilíngue.", author: "Secretaria" },
      { id: "h4", date: "2026-03-07", type: "whatsapp", description: "Enviado informações sobre o programa bilíngue", author: "Secretaria" },
    ],
    nextFollowUp: "2026-03-11",
  },
  {
    id: "3", name: "Camila Souza", email: "camila.souza@email.com", phone: "(15) 91234-5678",
    childName: "Matheus Souza", childAge: 12, gradeInterest: "7º Ano", source: "Redes Sociais",
    stage: "visita", createdAt: "2026-03-01", updatedAt: "2026-03-08", notes: "Agendou visita para quinta-feira.",
    history: [
      { id: "h5", date: "2026-03-01", type: "note", description: "Lead via Instagram", author: "Sistema" },
      { id: "h6", date: "2026-03-03", type: "email", description: "Enviado e-mail com apresentação da escola", author: "Secretaria" },
      { id: "h7", date: "2026-03-08", type: "visit", description: "Visita agendada para 12/03", author: "Coordenação" },
    ],
    nextFollowUp: "2026-03-12",
  },
  {
    id: "4", name: "André Lima", email: "andre.lima@email.com", phone: "(15) 97654-3210",
    childName: "Isabela Lima", childAge: 15, gradeInterest: "1º EM", source: "Evento",
    stage: "proposta", createdAt: "2026-02-20", updatedAt: "2026-03-07", notes: "Proposta enviada. Aguardando decisão.", value: 1200,
    history: [
      { id: "h8", date: "2026-02-20", type: "note", description: "Conheceu na feira de educação", author: "Direção" },
      { id: "h9", date: "2026-02-25", type: "visit", description: "Visita realizada com sucesso", author: "Coordenação" },
      { id: "h10", date: "2026-03-07", type: "email", description: "Proposta comercial enviada - R$ 1.200/mês", author: "Secretaria" },
    ],
    nextFollowUp: "2026-03-14",
  },
  {
    id: "5", name: "Patricia Costa", email: "patricia@email.com", phone: "(15) 96543-2109",
    childName: "Gabriel Costa", childAge: 6, gradeInterest: "1º Ano", source: "Indicação",
    stage: "matricula", createdAt: "2026-02-10", updatedAt: "2026-03-05", notes: "Matrícula efetivada!", value: 950,
    history: [
      { id: "h11", date: "2026-02-10", type: "note", description: "Indicação da família Oliveira", author: "Sistema" },
      { id: "h12", date: "2026-02-15", type: "visit", description: "Visita realizada", author: "Coordenação" },
      { id: "h13", date: "2026-03-01", type: "email", description: "Proposta aceita", author: "Secretaria" },
      { id: "h14", date: "2026-03-05", type: "stage_change", description: "Matrícula efetivada", author: "Secretaria" },
    ],
  },
  {
    id: "6", name: "Marcos Ferreira", email: "marcos.f@email.com", phone: "(15) 95432-1098",
    childName: "Lucas Ferreira", childAge: 9, gradeInterest: "4º Ano", source: "Google",
    stage: "lead", createdAt: "2026-03-09", updatedAt: "2026-03-09", notes: "",
    history: [{ id: "h15", date: "2026-03-09", type: "note", description: "Lead captado via Google Ads", author: "Sistema" }],
    nextFollowUp: "2026-03-11",
  },
  {
    id: "7", name: "Juliana Neves", email: "juliana.n@email.com", phone: "(15) 94321-0987",
    childName: "Sofia Neves", childAge: 4, gradeInterest: "Educação Infantil", source: "Panfleto",
    stage: "contato", createdAt: "2026-03-04", updatedAt: "2026-03-06", notes: "Interesse em educação infantil bilíngue.",
    history: [
      { id: "h16", date: "2026-03-04", type: "note", description: "Recebeu panfleto na praça", author: "Sistema" },
      { id: "h17", date: "2026-03-06", type: "call", description: "Retornou ligação. Muito interessada.", author: "Secretaria" },
    ],
    nextFollowUp: "2026-03-10",
  },
];

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function CRMMatricula() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStage, setFilterStage] = useState<string>("all");
  const [filterSource, setFilterSource] = useState("all");
  const [activeTab, setActiveTab] = useState("funnel");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [followUpDialogOpen, setFollowUpDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [followUpNote, setFollowUpNote] = useState("");

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", childName: "", childAge: "",
    gradeInterest: "", source: "Site", notes: "",
  });

  const funnelCounts = useMemo(() => {
    const counts: Record<FunnelStage, number> = { lead: 0, contato: 0, visita: 0, proposta: 0, matricula: 0 };
    leads.forEach((l) => counts[l.stage]++);
    return counts;
  }, [leads]);

  const conversionRate = useMemo(() => {
    const total = leads.length;
    if (total === 0) return 0;
    return Math.round((funnelCounts.matricula / total) * 100);
  }, [leads, funnelCounts]);

  const filteredLeads = leads.filter((l) => {
    const matchSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStage = filterStage === "all" || l.stage === filterStage;
    const matchSource = filterSource === "all" || l.source === filterSource;
    return matchSearch && matchStage && matchSource;
  });

  const todayFollowUps = leads.filter((l) => l.nextFollowUp === "2026-03-09" || l.nextFollowUp === "2026-03-10");

  const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const handleCreate = () => {
    setIsEditing(false);
    setFormData({ name: "", email: "", phone: "", childName: "", childAge: "", gradeInterest: "", source: "Site", notes: "" });
    setDialogOpen(true);
  };

  const handleEdit = (lead: Lead) => {
    setIsEditing(true);
    setSelectedLead(lead);
    setFormData({
      name: lead.name, email: lead.email, phone: lead.phone, childName: lead.childName,
      childAge: String(lead.childAge), gradeInterest: lead.gradeInterest, source: lead.source, notes: lead.notes,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.phone) { toast.error("Preencha nome e telefone"); return; }
    if (isEditing && selectedLead) {
      setLeads((prev) => prev.map((l) => l.id === selectedLead.id ? {
        ...l, ...formData, childAge: parseInt(formData.childAge) || 0, updatedAt: "2026-03-09",
      } : l));
      toast.success("Lead atualizado!");
    } else {
      const newLead: Lead = {
        id: Date.now().toString(), ...formData, childAge: parseInt(formData.childAge) || 0,
        stage: "lead", createdAt: "2026-03-09", updatedAt: "2026-03-09",
        history: [{ id: Date.now().toString(), date: "2026-03-09", type: "note", description: "Lead cadastrado manualmente", author: "Secretaria" }],
        nextFollowUp: "2026-03-11",
      };
      setLeads((prev) => [...prev, newLead]);
      toast.success("Lead cadastrado!");
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    toast.success("Lead removido!");
  };

  const handleAdvanceStage = (lead: Lead) => {
    const currentIndex = stageOrder.indexOf(lead.stage);
    if (currentIndex >= stageOrder.length - 1) return;
    const nextStage = stageOrder[currentIndex + 1];
    setLeads((prev) => prev.map((l) => l.id === lead.id ? {
      ...l, stage: nextStage, updatedAt: "2026-03-09",
      history: [...l.history, { id: Date.now().toString(), date: "2026-03-09", type: "stage_change" as const, description: `Avançou para ${stageConfig[nextStage].label}`, author: "Secretaria" }],
    } : l));
    toast.success(`Lead avançou para ${stageConfig[nextStage].label}!`);
  };

  const handleAddNote = () => {
    if (!newNote.trim() || !selectedLead) return;
    setLeads((prev) => prev.map((l) => l.id === selectedLead.id ? {
      ...l, updatedAt: "2026-03-09", notes: newNote,
      history: [...l.history, { id: Date.now().toString(), date: "2026-03-09", type: "note" as const, description: newNote, author: "Secretaria" }],
    } : l));
    setSelectedLead((prev) => prev ? { ...prev, history: [...prev.history, { id: Date.now().toString(), date: "2026-03-09", type: "note", description: newNote, author: "Secretaria" }] } : null);
    setNewNote("");
    toast.success("Nota adicionada!");
  };

  const handleContact = (lead: Lead, type: "whatsapp" | "email" | "call") => {
    const desc = type === "whatsapp" ? "Contato via WhatsApp" : type === "email" ? "E-mail enviado" : "Ligação realizada";
    setLeads((prev) => prev.map((l) => l.id === lead.id ? {
      ...l, updatedAt: "2026-03-09",
      history: [...l.history, { id: Date.now().toString(), date: "2026-03-09", type: type === "call" ? "call" as const : type as "email" | "whatsapp", description: desc, author: "Secretaria" }],
    } : l));
    if (type === "whatsapp") {
      const phone = lead.phone.replace(/\D/g, "");
      window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(`Olá ${lead.name}, tudo bem? Estamos entrando em contato sobre a matrícula de ${lead.childName} na nossa escola.`)}`, "_blank");
    } else if (type === "email") {
      window.open(`mailto:${lead.email}?subject=${encodeURIComponent("Informações sobre matrícula")}&body=${encodeURIComponent(`Olá ${lead.name},\n\nAgradecemos seu interesse em nossa escola para ${lead.childName}.\n\nAtenciosamente,\nSecretaria`)}`, "_blank");
    }
    toast.success(`${desc}!`);
  };

  const handleScheduleFollowUp = () => {
    if (!followUpDate || !selectedLead) return;
    setLeads((prev) => prev.map((l) => l.id === selectedLead.id ? {
      ...l, nextFollowUp: followUpDate, updatedAt: "2026-03-09",
      history: [...l.history, { id: Date.now().toString(), date: "2026-03-09", type: "note" as const, description: `Follow-up agendado para ${followUpDate}${followUpNote ? `: ${followUpNote}` : ""}`, author: "Secretaria" }],
    } : l));
    setFollowUpDialogOpen(false);
    setFollowUpDate("");
    setFollowUpNote("");
    toast.success("Follow-up agendado!");
  };

  const getHistoryIcon = (type: string) => {
    switch (type) {
      case "call": return <Phone className="h-3.5 w-3.5 text-green-500" />;
      case "email": return <Mail className="h-3.5 w-3.5 text-blue-500" />;
      case "whatsapp": return <MessageSquare className="h-3.5 w-3.5 text-green-600" />;
      case "visit": return <MapPin className="h-3.5 w-3.5 text-purple-500" />;
      case "stage_change": return <ArrowRight className="h-3.5 w-3.5 text-primary" />;
      default: return <FileText className="h-3.5 w-3.5 text-muted-foreground" />;
    }
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  return (
    <motion.div className="space-y-6 p-6" variants={containerVariants} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Target className="h-8 w-8 text-primary" />
            CRM de Matrícula
          </h1>
          <p className="text-muted-foreground mt-1">Gestão de captação e funil de matrículas</p>
        </div>
        <div className="flex gap-2">
          {todayFollowUps.length > 0 && (
            <Badge variant="outline" className="gap-1 py-1.5 px-3">
              <Bell className="h-3.5 w-3.5 text-amber-500" />
              {todayFollowUps.length} follow-up(s) pendente(s)
            </Badge>
          )}
          <Button onClick={handleCreate}><Plus className="h-4 w-4 mr-2" /> Novo Lead</Button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {stageOrder.map((stage) => {
          const cfg = stageConfig[stage];
          return (
            <Card key={stage} className={`cursor-pointer transition-all hover:shadow-md ${filterStage === stage ? "ring-2 ring-primary" : ""}`}
              onClick={() => setFilterStage(filterStage === stage ? "all" : stage)}>
              <CardContent className="p-4 text-center">
                <cfg.icon className={`h-6 w-6 mx-auto mb-1 ${cfg.color}`} />
                <p className="text-2xl font-bold">{funnelCounts[stage]}</p>
                <p className="text-xs text-muted-foreground">{cfg.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      {/* Funnel Visualization */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Funil de Conversão</CardTitle>
              <Badge variant="outline" className="gap-1"><TrendingUp className="h-3.5 w-3.5" /> {conversionRate}% conversão</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {stageOrder.map((stage, i) => {
                const cfg = stageConfig[stage];
                const count = funnelCounts[stage];
                const maxCount = Math.max(...Object.values(funnelCounts), 1);
                const width = Math.max(20, (count / maxCount) * 100);
                return (
                  <div key={stage} className="flex items-center gap-2 flex-1">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
                        <span className="text-xs font-bold">{count}</span>
                      </div>
                      <div className="h-8 rounded-md bg-muted overflow-hidden">
                        <motion.div
                          className={`h-full rounded-md ${cfg.bgColor.split(" ")[0].replace("/10", "/30")}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${width}%` }}
                          transition={{ duration: 0.8, delay: i * 0.15 }}
                          style={{ backgroundColor: `hsl(var(--primary) / ${0.15 + i * 0.15})` }}
                        />
                      </div>
                    </div>
                    {i < stageOrder.length - 1 && <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="funnel">Kanban</TabsTrigger>
            <TabsTrigger value="list">Lista</TabsTrigger>
            <TabsTrigger value="followups">Follow-ups</TabsTrigger>
          </TabsList>

          {/* Kanban View */}
          <TabsContent value="funnel" className="mt-4">
            <div className="flex flex-col md:flex-row gap-4 overflow-x-auto pb-4">
              {stageOrder.map((stage) => {
                const cfg = stageConfig[stage];
                const stageLeads = leads.filter((l) => l.stage === stage);
                return (
                  <div key={stage} className="min-w-[280px] flex-1">
                    <div className={`flex items-center gap-2 mb-3 px-2`}>
                      <cfg.icon className={`h-4 w-4 ${cfg.color}`} />
                      <span className="font-semibold text-sm">{cfg.label}</span>
                      <Badge variant="secondary" className="ml-auto">{stageLeads.length}</Badge>
                    </div>
                    <div className="space-y-2">
                      {stageLeads.map((lead) => (
                        <Card key={lead.id} className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => { setSelectedLead(lead); setViewDialogOpen(true); }}>
                          <CardContent className="p-3 space-y-2">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-7 w-7"><AvatarFallback className="text-[10px]">{getInitials(lead.name)}</AvatarFallback></Avatar>
                                <div>
                                  <p className="text-sm font-medium leading-tight">{lead.name}</p>
                                  <p className="text-[11px] text-muted-foreground">{lead.childName} • {lead.gradeInterest}</p>
                                </div>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                  <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-3.5 w-3.5" /></Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleContact(lead, "whatsapp"); }}>
                                    <MessageSquare className="h-4 w-4 mr-2" />WhatsApp
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleContact(lead, "email"); }}>
                                    <Mail className="h-4 w-4 mr-2" />E-mail
                                  </DropdownMenuItem>
                                  {stage !== "matricula" && (
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleAdvanceStage(lead); }}>
                                      <ArrowRight className="h-4 w-4 mr-2" />Avançar Etapa
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEdit(lead); }}>
                                    <Edit className="h-4 w-4 mr-2" />Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-destructive" onClick={(e) => { e.stopPropagation(); handleDelete(lead.id); }}>
                                    <Trash2 className="h-4 w-4 mr-2" />Excluir
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0">{lead.source}</Badge>
                              {lead.nextFollowUp && <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" />{lead.nextFollowUp}</span>}
                            </div>
                            {lead.value && <p className="text-xs font-medium text-green-600">R$ {lead.value.toLocaleString("pt-BR")}/mês</p>}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* List View */}
          <TabsContent value="list" className="mt-4">
            <div className="flex flex-col md:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9" placeholder="Buscar leads..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <Select value={filterStage} onValueChange={setFilterStage}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Etapa" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas Etapas</SelectItem>
                  {stageOrder.map((s) => <SelectItem key={s} value={s}>{stageConfig[s].label}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filterSource} onValueChange={setFilterSource}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Origem" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas Origens</SelectItem>
                  {sourceOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Aluno</TableHead>
                    <TableHead>Série</TableHead>
                    <TableHead>Origem</TableHead>
                    <TableHead>Etapa</TableHead>
                    <TableHead>Follow-up</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => (
                    <TableRow key={lead.id} className="cursor-pointer" onClick={() => { setSelectedLead(lead); setViewDialogOpen(true); }}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8"><AvatarFallback className="text-xs">{getInitials(lead.name)}</AvatarFallback></Avatar>
                          <div><p className="font-medium text-sm">{lead.name}</p><p className="text-xs text-muted-foreground">{lead.phone}</p></div>
                        </div>
                      </TableCell>
                      <TableCell>{lead.childName}</TableCell>
                      <TableCell>{lead.gradeInterest}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{lead.source}</Badge></TableCell>
                      <TableCell><Badge className={stageConfig[lead.stage].bgColor}>{stageConfig[lead.stage].label}</Badge></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{lead.nextFollowUp || "-"}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleContact(lead, "whatsapp"); }}>WhatsApp</DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleContact(lead, "email"); }}>E-mail</DropdownMenuItem>
                            {lead.stage !== "matricula" && <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleAdvanceStage(lead); }}>Avançar Etapa</DropdownMenuItem>}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEdit(lead); }}>Editar</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={(e) => { e.stopPropagation(); handleDelete(lead.id); }}>Excluir</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Follow-ups View */}
          <TabsContent value="followups" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><Bell className="h-5 w-5 text-amber-500" /> Follow-ups Pendentes</CardTitle>
                <CardDescription>Leads que precisam de acompanhamento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {leads.filter((l) => l.nextFollowUp && l.stage !== "matricula").sort((a, b) => (a.nextFollowUp || "").localeCompare(b.nextFollowUp || "")).map((lead) => (
                  <div key={lead.id} className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <Avatar className="h-10 w-10"><AvatarFallback className="text-xs">{getInitials(lead.name)}</AvatarFallback></Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{lead.name}</p>
                      <p className="text-xs text-muted-foreground">{lead.childName} • {lead.gradeInterest}</p>
                    </div>
                    <Badge className={stageConfig[lead.stage].bgColor}>{stageConfig[lead.stage].label}</Badge>
                    <div className="text-right">
                      <p className="text-sm font-medium">{lead.nextFollowUp}</p>
                      <p className="text-xs text-muted-foreground">{lead.history[lead.history.length - 1]?.description.slice(0, 40)}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleContact(lead, "whatsapp")}><MessageSquare className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleContact(lead, "call")}><Phone className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleContact(lead, "email")}><Mail className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Lead" : "Novo Lead"}</DialogTitle>
            <DialogDescription>Dados do responsável e do aluno interessado</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <Separator />
            <p className="text-sm font-semibold">Dados do Responsável</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label>Nome Completo *</Label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Nome do responsável" />
              </div>
              <div className="space-y-2">
                <Label>Telefone *</Label>
                <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })} placeholder="(15) 99999-9999" />
              </div>
              <div className="space-y-2">
                <Label>E-mail</Label>
                <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="email@exemplo.com" />
              </div>
            </div>
            <Separator />
            <p className="text-sm font-semibold">Dados do Aluno</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome do Aluno</Label>
                <Input value={formData.childName} onChange={(e) => setFormData({ ...formData, childName: e.target.value })} placeholder="Nome da criança" />
              </div>
              <div className="space-y-2">
                <Label>Idade</Label>
                <Input type="number" value={formData.childAge} onChange={(e) => setFormData({ ...formData, childAge: e.target.value })} placeholder="Idade" />
              </div>
              <div className="space-y-2">
                <Label>Série de Interesse</Label>
                <Select value={formData.gradeInterest} onValueChange={(v) => setFormData({ ...formData, gradeInterest: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{gradeOptions.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Origem</Label>
                <Select value={formData.source} onValueChange={(v) => setFormData({ ...formData, source: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{sourceOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Observações</Label>
              <Textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Anotações sobre o interesse..." rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>{isEditing ? "Salvar" : "Cadastrar Lead"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Lead Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedLead && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Avatar className="h-8 w-8"><AvatarFallback>{getInitials(selectedLead.name)}</AvatarFallback></Avatar>
                  {selectedLead.name}
                </DialogTitle>
                <DialogDescription>{selectedLead.email} • {selectedLead.phone}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge className={stageConfig[selectedLead.stage].bgColor}>{stageConfig[selectedLead.stage].label}</Badge>
                  <Badge variant="outline">{selectedLead.source}</Badge>
                  <Badge variant="outline">{selectedLead.gradeInterest}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-muted-foreground">Aluno:</span> <strong>{selectedLead.childName}</strong></div>
                  <div><span className="text-muted-foreground">Idade:</span> <strong>{selectedLead.childAge} anos</strong></div>
                  <div><span className="text-muted-foreground">Cadastro:</span> <strong>{selectedLead.createdAt}</strong></div>
                  <div><span className="text-muted-foreground">Atualização:</span> <strong>{selectedLead.updatedAt}</strong></div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleContact(selectedLead, "whatsapp")}><MessageSquare className="h-4 w-4 mr-1" />WhatsApp</Button>
                  <Button size="sm" variant="outline" onClick={() => handleContact(selectedLead, "email")}><Mail className="h-4 w-4 mr-1" />E-mail</Button>
                  <Button size="sm" variant="outline" onClick={() => handleContact(selectedLead, "call")}><Phone className="h-4 w-4 mr-1" />Ligação</Button>
                  <Button size="sm" variant="outline" onClick={() => { setFollowUpDialogOpen(true); }}><Calendar className="h-4 w-4 mr-1" />Agendar Follow-up</Button>
                  {selectedLead.stage !== "matricula" && (
                    <Button size="sm" onClick={() => { handleAdvanceStage(selectedLead); setViewDialogOpen(false); }}><ArrowRight className="h-4 w-4 mr-1" />Avançar Etapa</Button>
                  )}
                </div>

                <Separator />

                {/* History */}
                <div>
                  <h3 className="font-semibold mb-3">Histórico de Atendimento</h3>
                  <ScrollArea className="max-h-[200px]">
                    <div className="space-y-3">
                      {[...selectedLead.history].reverse().map((entry) => (
                        <div key={entry.id} className="flex items-start gap-3">
                          <div className="mt-0.5">{getHistoryIcon(entry.type)}</div>
                          <div className="flex-1">
                            <p className="text-sm">{entry.description}</p>
                            <p className="text-xs text-muted-foreground">{entry.date} • {entry.author}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                <Separator />

                {/* Add Note */}
                <div className="space-y-2">
                  <Label>Adicionar Nota</Label>
                  <div className="flex gap-2">
                    <Input value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Registrar observação..." className="flex-1" />
                    <Button size="sm" onClick={handleAddNote}><Send className="h-4 w-4" /></Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Follow-up Dialog */}
      <Dialog open={followUpDialogOpen} onOpenChange={setFollowUpDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Agendar Follow-up</DialogTitle>
            <DialogDescription>Defina a data do próximo contato</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Data</Label>
              <Input type="date" value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Nota (opcional)</Label>
              <Input value={followUpNote} onChange={(e) => setFollowUpNote(e.target.value)} placeholder="Lembrete..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFollowUpDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleScheduleFollowUp}>Agendar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

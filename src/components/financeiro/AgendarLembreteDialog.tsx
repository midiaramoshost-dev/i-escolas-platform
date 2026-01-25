import { useState, useEffect } from "react";
import { format, addDays, isToday, isPast, isBefore, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Bell,
  Calendar as CalendarIcon,
  Clock,
  Trash2,
  MessageCircle,
  Mail,
  CheckCircle2,
  AlertTriangle,
  Plus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { Inadimplente } from "./EnviarCobrancaDialog";

const STORAGE_KEY = "iescolas_lembretes_cobranca";

export interface LembreteCobranca {
  id: string;
  inadimplenteId: string;
  alunoNome: string;
  responsavelNome: string;
  valorTotal: number;
  dataAgendada: string;
  horario: string;
  canal: "whatsapp" | "email" | "ambos";
  status: "agendado" | "enviado" | "cancelado";
  criadoEm: string;
}

interface AgendarLembreteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inadimplentes: Inadimplente[];
  onEnviarCobranca?: (inadimplente: Inadimplente, canal: "whatsapp" | "email") => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const getLembretesFromStorage = (): LembreteCobranca[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveLembretesToStorage = (lembretes: LembreteCobranca[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lembretes));
};

const generateId = () => `lembrete_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export function AgendarLembreteDialog({
  open,
  onOpenChange,
  inadimplentes,
  onEnviarCobranca,
}: AgendarLembreteDialogProps) {
  const { toast } = useToast();
  const [lembretes, setLembretes] = useState<LembreteCobranca[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [dataAgendada, setDataAgendada] = useState<Date | undefined>(addDays(new Date(), 1));
  const [horario, setHorario] = useState("09:00");
  const [canal, setCanal] = useState<"whatsapp" | "email" | "ambos">("whatsapp");
  const [activeTab, setActiveTab] = useState("agendar");

  // Load lembretes from storage
  useEffect(() => {
    setLembretes(getLembretesFromStorage());
  }, [open]);

  // Check for due reminders every minute
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentTime = format(now, "HH:mm");
      const today = format(now, "yyyy-MM-dd");

      const lembretesAtuais = getLembretesFromStorage();
      const lembretesDue = lembretesAtuais.filter(
        (l) => l.status === "agendado" && l.dataAgendada === today && l.horario === currentTime
      );

      lembretesDue.forEach((lembrete) => {
        // Show notification
        toast({
          title: "🔔 Lembrete de Cobrança",
          description: `Hora de cobrar ${lembrete.responsavelNome} (${lembrete.alunoNome}) - ${formatCurrency(lembrete.valorTotal)}`,
          duration: 10000,
        });

        // Request browser notification permission and show
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Lembrete de Cobrança", {
            body: `Cobrar ${lembrete.responsavelNome} - ${formatCurrency(lembrete.valorTotal)}`,
            icon: "/favicon.ico",
          });
        }

        // Mark as sent
        const updated = lembretesAtuais.map((l) =>
          l.id === lembrete.id ? { ...l, status: "enviado" as const } : l
        );
        saveLembretesToStorage(updated);
        setLembretes(updated);
      });
    };

    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    const interval = setInterval(checkReminders, 60000); // Check every minute
    checkReminders(); // Check immediately on load

    return () => clearInterval(interval);
  }, [toast]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === inadimplentes.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(inadimplentes.map((i) => i.id));
    }
  };

  const agendarLembretes = () => {
    if (selectedIds.length === 0) {
      toast({
        title: "Selecione inadimplentes",
        description: "Escolha ao menos um responsável para agendar o lembrete.",
        variant: "destructive",
      });
      return;
    }

    if (!dataAgendada) {
      toast({
        title: "Selecione uma data",
        description: "Escolha a data para o lembrete.",
        variant: "destructive",
      });
      return;
    }

    const dataFormatada = format(dataAgendada, "yyyy-MM-dd");
    const novosLembretes: LembreteCobranca[] = selectedIds.map((id) => {
      const inadimplente = inadimplentes.find((i) => i.id === id)!;
      return {
        id: generateId(),
        inadimplenteId: inadimplente.id,
        alunoNome: inadimplente.aluno,
        responsavelNome: inadimplente.responsavel,
        valorTotal: inadimplente.valorTotal,
        dataAgendada: dataFormatada,
        horario,
        canal,
        status: "agendado",
        criadoEm: new Date().toISOString(),
      };
    });

    const lembretesAtualizados = [...lembretes, ...novosLembretes];
    saveLembretesToStorage(lembretesAtualizados);
    setLembretes(lembretesAtualizados);
    setSelectedIds([]);

    toast({
      title: "Lembretes agendados!",
      description: `${novosLembretes.length} lembrete(s) agendado(s) para ${format(dataAgendada, "dd/MM/yyyy")} às ${horario}`,
    });

    setActiveTab("agendados");
  };

  const cancelarLembrete = (id: string) => {
    const updated = lembretes.map((l) =>
      l.id === id ? { ...l, status: "cancelado" as const } : l
    );
    saveLembretesToStorage(updated);
    setLembretes(updated);

    toast({
      title: "Lembrete cancelado",
      description: "O lembrete foi removido da agenda.",
    });
  };

  const removerLembrete = (id: string) => {
    const updated = lembretes.filter((l) => l.id !== id);
    saveLembretesToStorage(updated);
    setLembretes(updated);

    toast({
      title: "Lembrete removido",
      description: "O lembrete foi excluído permanentemente.",
    });
  };

  const executarLembrete = (lembrete: LembreteCobranca) => {
    const inadimplente = inadimplentes.find((i) => i.id === lembrete.inadimplenteId);
    if (inadimplente && onEnviarCobranca) {
      if (lembrete.canal === "whatsapp" || lembrete.canal === "ambos") {
        onEnviarCobranca(inadimplente, "whatsapp");
      }
      if (lembrete.canal === "email" || lembrete.canal === "ambos") {
        setTimeout(() => {
          if (inadimplente && onEnviarCobranca) {
            onEnviarCobranca(inadimplente, "email");
          }
        }, 500);
      }

      // Mark as sent
      const updated = lembretes.map((l) =>
        l.id === lembrete.id ? { ...l, status: "enviado" as const } : l
      );
      saveLembretesToStorage(updated);
      setLembretes(updated);
    }
  };

  const lembretesPendentes = lembretes.filter((l) => l.status === "agendado");
  const lembretesEnviados = lembretes.filter((l) => l.status === "enviado");
  const lembretesHoje = lembretesPendentes.filter((l) => l.dataAgendada === format(new Date(), "yyyy-MM-dd"));

  const getStatusBadge = (lembrete: LembreteCobranca) => {
    const dataLembrete = new Date(lembrete.dataAgendada + "T" + lembrete.horario);
    
    if (lembrete.status === "enviado") {
      return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200">Enviado</Badge>;
    }
    if (lembrete.status === "cancelado") {
      return <Badge variant="secondary">Cancelado</Badge>;
    }
    if (isPast(dataLembrete)) {
      return <Badge variant="destructive">Atrasado</Badge>;
    }
    if (isToday(new Date(lembrete.dataAgendada))) {
      return <Badge className="bg-amber-500/10 text-amber-600 border-amber-200">Hoje</Badge>;
    }
    return <Badge variant="outline">Agendado</Badge>;
  };

  const getCanalIcon = (canal: string) => {
    switch (canal) {
      case "whatsapp":
        return <MessageCircle className="h-3 w-3 text-emerald-600" />;
      case "email":
        return <Mail className="h-3 w-3 text-blue-600" />;
      case "ambos":
        return (
          <div className="flex gap-1">
            <MessageCircle className="h-3 w-3 text-emerald-600" />
            <Mail className="h-3 w-3 text-blue-600" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Agendar Lembretes de Cobrança
          </DialogTitle>
          <DialogDescription>
            Programe lembretes automáticos para não esquecer de cobrar inadimplentes
          </DialogDescription>
        </DialogHeader>

        {lembretesHoje.length > 0 && (
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">
                {lembretesHoje.length} lembrete(s) para hoje!
              </span>
            </div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="agendar" className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Agendamento
            </TabsTrigger>
            <TabsTrigger value="agendados" className="gap-2">
              <Clock className="h-4 w-4" />
              Agendados
              {lembretesPendentes.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {lembretesPendentes.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="agendar" className="flex-1 overflow-hidden flex flex-col mt-4">
            <div className="grid gap-4 md:grid-cols-3 mb-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Data do Lembrete</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dataAgendada && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dataAgendada
                        ? format(dataAgendada, "dd/MM/yyyy", { locale: ptBR })
                        : "Selecione"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dataAgendada}
                      onSelect={setDataAgendada}
                      disabled={(date) => isBefore(startOfDay(date), startOfDay(new Date()))}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Horário</label>
                <Select value={horario} onValueChange={setHorario}>
                  <SelectTrigger>
                    <Clock className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["08:00", "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"].map(
                      (h) => (
                        <SelectItem key={h} value={h}>
                          {h}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Canal</label>
                <Select value={canal} onValueChange={(v) => setCanal(v as typeof canal)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whatsapp">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-emerald-600" />
                        WhatsApp
                      </div>
                    </SelectItem>
                    <SelectItem value="email">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-blue-600" />
                        E-mail
                      </div>
                    </SelectItem>
                    <SelectItem value="ambos">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-emerald-600" />
                        <Mail className="h-4 w-4 text-blue-600" />
                        Ambos
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                {selectedIds.length} de {inadimplentes.length} selecionado(s)
              </span>
              <Button variant="ghost" size="sm" onClick={selectAll}>
                {selectedIds.length === inadimplentes.length ? "Desmarcar todos" : "Selecionar todos"}
              </Button>
            </div>

            <ScrollArea className="flex-1 border rounded-lg">
              <div className="p-2 space-y-1">
                {inadimplentes.map((inadimplente) => (
                  <div
                    key={inadimplente.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                      selectedIds.includes(inadimplente.id)
                        ? "bg-primary/10 border border-primary/20"
                        : "hover:bg-muted/50"
                    )}
                    onClick={() => toggleSelect(inadimplente.id)}
                  >
                    <Checkbox
                      checked={selectedIds.includes(inadimplente.id)}
                      onCheckedChange={() => toggleSelect(inadimplente.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{inadimplente.responsavel}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {inadimplente.aluno} • {inadimplente.turma}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-destructive">
                        {formatCurrency(inadimplente.valorTotal)}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        {inadimplente.mesesDevidos} {inadimplente.mesesDevidos === 1 ? "mês" : "meses"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={agendarLembretes} disabled={selectedIds.length === 0}>
                <Bell className="mr-2 h-4 w-4" />
                Agendar {selectedIds.length > 0 && `(${selectedIds.length})`}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="agendados" className="flex-1 overflow-hidden flex flex-col mt-4">
            <ScrollArea className="flex-1">
              {lembretesPendentes.length === 0 && lembretesEnviados.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Bell className="h-12 w-12 mb-4 opacity-20" />
                  <p>Nenhum lembrete agendado</p>
                  <Button
                    variant="link"
                    className="mt-2"
                    onClick={() => setActiveTab("agendar")}
                  >
                    Criar primeiro lembrete
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {lembretesPendentes.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Pendentes ({lembretesPendentes.length})
                      </h4>
                      <div className="space-y-2">
                        {lembretesPendentes.map((lembrete) => (
                          <div
                            key={lembrete.id}
                            className="flex items-center gap-3 p-3 rounded-lg border bg-card"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium truncate">{lembrete.responsavelNome}</p>
                                {getStatusBadge(lembrete)}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {lembrete.alunoNome} • {formatCurrency(lembrete.valorTotal)}
                              </p>
                              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                <CalendarIcon className="h-3 w-3" />
                                {format(new Date(lembrete.dataAgendada), "dd/MM/yyyy")} às {lembrete.horario}
                                <Separator orientation="vertical" className="h-3" />
                                {getCanalIcon(lembrete.canal)}
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                onClick={() => executarLembrete(lembrete)}
                                title="Executar agora"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => cancelarLembrete(lembrete.id)}
                                title="Cancelar"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {lembretesEnviados.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        Enviados ({lembretesEnviados.length})
                      </h4>
                      <div className="space-y-2">
                        {lembretesEnviados.slice(0, 5).map((lembrete) => (
                          <div
                            key={lembrete.id}
                            className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium truncate text-muted-foreground">
                                  {lembrete.responsavelNome}
                                </p>
                                {getStatusBadge(lembrete)}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {lembrete.alunoNome} • {formatCurrency(lembrete.valorTotal)}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => removerLembrete(lembrete.id)}
                              title="Remover"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

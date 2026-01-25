import { useState } from "react";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Edit,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Evento {
  id: string;
  titulo: string;
  data: string;
  tipo: "feriado" | "reuniao" | "evento" | "prova" | "recesso";
  descricao: string;
}

const tipoEventoLabels: Record<string, { label: string; color: string }> = {
  feriado: { label: "Feriado", color: "bg-red-500" },
  reuniao: { label: "Reunião", color: "bg-blue-500" },
  evento: { label: "Evento", color: "bg-green-500" },
  prova: { label: "Prova", color: "bg-yellow-500" },
  recesso: { label: "Recesso", color: "bg-purple-500" },
};

const initialEventos: Evento[] = [
  { id: "1", titulo: "Início das Aulas", data: "2025-02-03", tipo: "evento", descricao: "Primeiro dia letivo do ano" },
  { id: "2", titulo: "Carnaval", data: "2025-03-03", tipo: "feriado", descricao: "Feriado de Carnaval" },
  { id: "3", titulo: "Recesso de Carnaval", data: "2025-03-04", tipo: "recesso", descricao: "Recesso após Carnaval" },
  { id: "4", titulo: "Reunião de Pais 1º Bimestre", data: "2025-04-12", tipo: "reuniao", descricao: "Reunião com responsáveis" },
  { id: "5", titulo: "Semana de Provas 1º Bim", data: "2025-04-21", tipo: "prova", descricao: "Provas do 1º bimestre" },
  { id: "6", titulo: "Tiradentes", data: "2025-04-21", tipo: "feriado", descricao: "Feriado Nacional" },
  { id: "7", titulo: "Dia do Trabalho", data: "2025-05-01", tipo: "feriado", descricao: "Feriado Nacional" },
  { id: "8", titulo: "Festa Junina", data: "2025-06-14", tipo: "evento", descricao: "Festa junina da escola" },
  { id: "9", titulo: "Férias de Julho", data: "2025-07-07", tipo: "recesso", descricao: "Início das férias de julho" },
  { id: "10", titulo: "Retorno às Aulas", data: "2025-07-28", tipo: "evento", descricao: "Retorno do recesso de julho" },
];

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export default function Calendario() {
  const [eventos, setEventos] = useState<Evento[]>(initialEventos);
  const [currentDate, setCurrentDate] = useState(new Date(2025, 1, 1)); // Feb 2025
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    titulo: "",
    data: "",
    tipo: "",
    descricao: "",
  });

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

  const getEventosForDay = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return eventos.filter(e => e.data === dateStr);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleOpenDialog = (evento?: Evento) => {
    if (evento) {
      setIsEditMode(true);
      setSelectedEvento(evento);
      setFormData({
        titulo: evento.titulo,
        data: evento.data,
        tipo: evento.tipo,
        descricao: evento.descricao,
      });
    } else {
      setIsEditMode(false);
      setSelectedEvento(null);
      setFormData({ titulo: "", data: "", tipo: "", descricao: "" });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.titulo || !formData.data || !formData.tipo) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (isEditMode && selectedEvento) {
      setEventos(eventos.map(e =>
        e.id === selectedEvento.id
          ? { ...e, ...formData, tipo: formData.tipo as Evento["tipo"] }
          : e
      ));
      toast.success("Evento atualizado com sucesso!");
    } else {
      const newEvento: Evento = {
        id: String(Date.now()),
        titulo: formData.titulo,
        data: formData.data,
        tipo: formData.tipo as Evento["tipo"],
        descricao: formData.descricao,
      };
      setEventos([...eventos, newEvento]);
      toast.success("Evento criado com sucesso!");
    }
    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (selectedEvento) {
      setEventos(eventos.filter(e => e.id !== selectedEvento.id));
      toast.success("Evento excluído com sucesso!");
      setIsDeleteDialogOpen(false);
      setSelectedEvento(null);
    }
  };

  const handleConfirmDelete = (evento: Evento) => {
    setSelectedEvento(evento);
    setIsDeleteDialogOpen(true);
  };

  const eventosDoMes = eventos.filter(e => {
    const eventDate = new Date(e.data);
    return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendário Acadêmico</h1>
          <p className="text-muted-foreground">
            Gerencie eventos, feriados e datas importantes
          </p>
        </div>
        <Button className="gap-2" onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4" />
          Novo Evento
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <Card className="shadow-card lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={handlePrevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <CardTitle className="min-w-[180px] text-center">
                {meses[currentMonth]} {currentYear}
              </CardTitle>
              <Button variant="outline" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="p-2" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dayEventos = getEventosForDay(day);
                const isToday =
                  new Date().getDate() === day &&
                  new Date().getMonth() === currentMonth &&
                  new Date().getFullYear() === currentYear;

                return (
                  <div
                    key={day}
                    className={`min-h-[80px] rounded-lg border p-1 ${
                      isToday ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <div className={`text-sm font-medium mb-1 ${isToday ? "text-primary" : ""}`}>
                      {day}
                    </div>
                    <div className="space-y-0.5">
                      {dayEventos.slice(0, 2).map((evento) => (
                        <div
                          key={evento.id}
                          className={`text-[10px] px-1 py-0.5 rounded text-white truncate cursor-pointer ${
                            tipoEventoLabels[evento.tipo].color
                          }`}
                          onClick={() => handleOpenDialog(evento)}
                        >
                          {evento.titulo}
                        </div>
                      ))}
                      {dayEventos.length > 2 && (
                        <div className="text-[10px] text-muted-foreground px-1">
                          +{dayEventos.length - 2} mais
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Events List */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Eventos de {meses[currentMonth]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {eventosDoMes.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhum evento neste mês
                </p>
              ) : (
                eventosDoMes
                  .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
                  .map((evento) => (
                    <div
                      key={evento.id}
                      className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className={`w-3 h-3 rounded-full mt-1 ${tipoEventoLabels[evento.tipo].color}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-sm">{evento.titulo}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(evento.data + 'T00:00:00').toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleOpenDialog(evento)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleConfirmDelete(evento)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {tipoEventoLabels[evento.tipo].label}
                        </Badge>
                      </div>
                    </div>
                  ))
              )}
            </div>

            {/* Legend */}
            <div className="mt-6 pt-4 border-t">
              <p className="text-xs font-medium text-muted-foreground mb-2">Legenda</p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(tipoEventoLabels).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${value.color}`} />
                    <span className="text-xs">{value.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Editar Evento" : "Novo Evento"}</DialogTitle>
            <DialogDescription>
              {isEditMode ? "Edite os dados do evento" : "Preencha os dados para criar um novo evento"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título do Evento</Label>
              <Input
                id="titulo"
                placeholder="Ex: Reunião de Pais"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data">Data</Label>
                <Input
                  id="data"
                  type="date"
                  value={formData.data}
                  onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="evento">Evento</SelectItem>
                    <SelectItem value="feriado">Feriado</SelectItem>
                    <SelectItem value="reuniao">Reunião</SelectItem>
                    <SelectItem value="prova">Prova</SelectItem>
                    <SelectItem value="recesso">Recesso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                placeholder="Detalhes do evento..."
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {isEditMode ? "Salvar Alterações" : "Criar Evento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o evento "{selectedEvento?.titulo}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

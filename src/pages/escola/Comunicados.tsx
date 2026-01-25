import { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  MessageSquare,
  Send,
  Users,
  MoreHorizontal,
  Bell,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface Comunicado {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: "informativo" | "urgente" | "evento" | "reuniao";
  destinatarios: string[];
  dataEnvio: string;
  status: "rascunho" | "enviado" | "agendado";
  visualizacoes: number;
}

const tipoLabels: Record<string, { label: string; variant: "default" | "destructive" | "secondary" | "outline" }> = {
  informativo: { label: "Informativo", variant: "default" },
  urgente: { label: "Urgente", variant: "destructive" },
  evento: { label: "Evento", variant: "secondary" },
  reuniao: { label: "Reunião", variant: "outline" },
};

const initialComunicados: Comunicado[] = [
  { id: "1", titulo: "Reunião de Pais - 1º Bimestre", mensagem: "Convidamos todos os responsáveis para a reunião de pais que acontecerá no dia 15/04 às 19h no auditório da escola.", tipo: "reuniao", destinatarios: ["Responsáveis"], dataEnvio: "2025-04-01", status: "enviado", visualizacoes: 456 },
  { id: "2", titulo: "Férias de Julho - Comunicado", mensagem: "Informamos que as aulas serão encerradas no dia 05/07 e retornarão em 28/07. Boas férias a todos!", tipo: "informativo", destinatarios: ["Todos"], dataEnvio: "2025-06-20", status: "agendado", visualizacoes: 0 },
  { id: "3", titulo: "Festa Junina 2025", mensagem: "Nossa tradicional Festa Junina será realizada no dia 14/06, a partir das 14h. Contamos com a participação de todos!", tipo: "evento", destinatarios: ["Todos"], dataEnvio: "2025-05-28", status: "enviado", visualizacoes: 892 },
  { id: "4", titulo: "Alteração no Horário de Entrada", mensagem: "A partir de segunda-feira, o horário de entrada será antecipado para 7h15. Por favor, organizem-se.", tipo: "urgente", destinatarios: ["Responsáveis", "Alunos"], dataEnvio: "2025-03-10", status: "enviado", visualizacoes: 1023 },
  { id: "5", titulo: "Semana de Provas - 2º Bimestre", mensagem: "As provas do 2º bimestre serão realizadas entre os dias 24 e 28 de junho. Consultem o calendário de provas no portal.", tipo: "informativo", destinatarios: ["Alunos", "Responsáveis"], dataEnvio: "2025-06-10", status: "enviado", visualizacoes: 687 },
  { id: "6", titulo: "Novo Comunicado (Rascunho)", mensagem: "Este é um rascunho de comunicado ainda não enviado.", tipo: "informativo", destinatarios: ["Professores"], dataEnvio: "", status: "rascunho", visualizacoes: 0 },
];

const statsCards = [
  { title: "Comunicados Enviados", value: "45", icon: Send, color: "primary" },
  { title: "Visualizações Totais", value: "12.4k", icon: Eye, color: "info" },
  { title: "Este Mês", value: "8", icon: MessageSquare, color: "success" },
];

export default function Comunicados() {
  const [comunicados, setComunicados] = useState<Comunicado[]>(initialComunicados);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedComunicado, setSelectedComunicado] = useState<Comunicado | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    titulo: "",
    mensagem: "",
    tipo: "",
    destinatarios: [] as string[],
  });

  const destinatariosOptions = ["Todos", "Alunos", "Responsáveis", "Professores", "Funcionários"];

  const filteredComunicados = comunicados.filter((com) => {
    const matchesSearch = com.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = filterTipo === "all" || com.tipo === filterTipo;
    const matchesStatus = filterStatus === "all" || com.status === filterStatus;
    return matchesSearch && matchesTipo && matchesStatus;
  });

  const handleOpenDialog = (comunicado?: Comunicado) => {
    if (comunicado) {
      setIsEditMode(true);
      setSelectedComunicado(comunicado);
      setFormData({
        titulo: comunicado.titulo,
        mensagem: comunicado.mensagem,
        tipo: comunicado.tipo,
        destinatarios: comunicado.destinatarios,
      });
    } else {
      setIsEditMode(false);
      setSelectedComunicado(null);
      setFormData({ titulo: "", mensagem: "", tipo: "", destinatarios: [] });
    }
    setIsDialogOpen(true);
  };

  const handleSave = (enviar: boolean = false) => {
    if (!formData.titulo || !formData.mensagem || !formData.tipo) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (enviar && formData.destinatarios.length === 0) {
      toast.error("Selecione pelo menos um destinatário");
      return;
    }

    if (isEditMode && selectedComunicado) {
      setComunicados(comunicados.map(c =>
        c.id === selectedComunicado.id
          ? { 
              ...c, 
              ...formData, 
              tipo: formData.tipo as Comunicado["tipo"],
              status: enviar ? "enviado" : c.status,
              dataEnvio: enviar ? new Date().toISOString().split('T')[0] : c.dataEnvio,
            }
          : c
      ));
      toast.success(enviar ? "Comunicado enviado com sucesso!" : "Comunicado atualizado com sucesso!");
    } else {
      const newComunicado: Comunicado = {
        id: String(Date.now()),
        titulo: formData.titulo,
        mensagem: formData.mensagem,
        tipo: formData.tipo as Comunicado["tipo"],
        destinatarios: formData.destinatarios,
        dataEnvio: enviar ? new Date().toISOString().split('T')[0] : "",
        status: enviar ? "enviado" : "rascunho",
        visualizacoes: 0,
      };
      setComunicados([newComunicado, ...comunicados]);
      toast.success(enviar ? "Comunicado enviado com sucesso!" : "Rascunho salvo com sucesso!");
    }
    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (selectedComunicado) {
      setComunicados(comunicados.filter(c => c.id !== selectedComunicado.id));
      toast.success("Comunicado excluído com sucesso!");
      setIsDeleteDialogOpen(false);
      setSelectedComunicado(null);
    }
  };

  const handleView = (comunicado: Comunicado) => {
    setSelectedComunicado(comunicado);
    setIsViewDialogOpen(true);
  };

  const handleConfirmDelete = (comunicado: Comunicado) => {
    setSelectedComunicado(comunicado);
    setIsDeleteDialogOpen(true);
  };

  const toggleDestinatario = (dest: string) => {
    if (dest === "Todos") {
      setFormData({ 
        ...formData, 
        destinatarios: formData.destinatarios.includes("Todos") ? [] : ["Todos"] 
      });
    } else {
      const newDest = formData.destinatarios.filter(d => d !== "Todos");
      if (newDest.includes(dest)) {
        setFormData({ ...formData, destinatarios: newDest.filter(d => d !== dest) });
      } else {
        setFormData({ ...formData, destinatarios: [...newDest, dest] });
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "enviado":
        return <Badge className="bg-success text-success-foreground">Enviado</Badge>;
      case "rascunho":
        return <Badge variant="secondary">Rascunho</Badge>;
      case "agendado":
        return <Badge className="bg-warning text-warning-foreground">Agendado</Badge>;
      default:
        return <Badge variant="secondary">-</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Comunicados</h1>
          <p className="text-muted-foreground">
            Envie comunicados para a comunidade escolar
          </p>
        </div>
        <Button className="gap-2" onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4" />
          Novo Comunicado
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 text-${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar comunicado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterTipo} onValueChange={setFilterTipo}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  <SelectItem value="informativo">Informativo</SelectItem>
                  <SelectItem value="urgente">Urgente</SelectItem>
                  <SelectItem value="evento">Evento</SelectItem>
                  <SelectItem value="reuniao">Reunião</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="enviado">Enviados</SelectItem>
                  <SelectItem value="rascunho">Rascunhos</SelectItem>
                  <SelectItem value="agendado">Agendados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="shadow-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Destinatários</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Visualizações</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComunicados.map((com) => (
                <TableRow key={com.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{com.titulo}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[250px]">
                        {com.mensagem}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={tipoLabels[com.tipo].variant}>
                      {tipoLabels[com.tipo].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {com.destinatarios.map((dest, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {dest}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {com.dataEnvio 
                      ? new Date(com.dataEnvio + 'T00:00:00').toLocaleDateString('pt-BR')
                      : "-"
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3 text-muted-foreground" />
                      {com.visualizacoes.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(com.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(com)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenDialog(com)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleConfirmDelete(com)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
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

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Editar Comunicado" : "Novo Comunicado"}</DialogTitle>
            <DialogDescription>
              {isEditMode ? "Edite o comunicado" : "Crie um novo comunicado para enviar à comunidade escolar"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                placeholder="Título do comunicado"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="informativo">Informativo</SelectItem>
                  <SelectItem value="urgente">Urgente</SelectItem>
                  <SelectItem value="evento">Evento</SelectItem>
                  <SelectItem value="reuniao">Reunião</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Destinatários</Label>
              <div className="flex flex-wrap gap-4">
                {destinatariosOptions.map((dest) => (
                  <div key={dest} className="flex items-center space-x-2">
                    <Checkbox
                      id={dest}
                      checked={formData.destinatarios.includes(dest)}
                      onCheckedChange={() => toggleDestinatario(dest)}
                    />
                    <label htmlFor={dest} className="text-sm cursor-pointer">
                      {dest}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mensagem">Mensagem</Label>
              <Textarea
                id="mensagem"
                placeholder="Digite a mensagem do comunicado..."
                value={formData.mensagem}
                onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                rows={5}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="secondary" onClick={() => handleSave(false)}>
              Salvar Rascunho
            </Button>
            <Button onClick={() => handleSave(true)} className="gap-2">
              <Send className="h-4 w-4" />
              Enviar Agora
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              {selectedComunicado?.titulo}
            </DialogTitle>
          </DialogHeader>
          {selectedComunicado && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-2">
                <Badge variant={tipoLabels[selectedComunicado.tipo].variant}>
                  {tipoLabels[selectedComunicado.tipo].label}
                </Badge>
                {getStatusBadge(selectedComunicado.status)}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Data de Envio</Label>
                  <p className="font-medium">
                    {selectedComunicado.dataEnvio 
                      ? new Date(selectedComunicado.dataEnvio + 'T00:00:00').toLocaleDateString('pt-BR')
                      : "Não enviado"
                    }
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Visualizações</Label>
                  <p className="font-medium">{selectedComunicado.visualizacoes.toLocaleString()}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Destinatários</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedComunicado.destinatarios.map((dest, idx) => (
                    <Badge key={idx} variant="secondary">{dest}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Mensagem</Label>
                <div className="mt-1 p-4 bg-muted rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{selectedComunicado.mensagem}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Fechar
            </Button>
            <Button onClick={() => {
              setIsViewDialogOpen(false);
              if (selectedComunicado) handleOpenDialog(selectedComunicado);
            }}>
              Editar
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
              Tem certeza que deseja excluir o comunicado "{selectedComunicado?.titulo}"?
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

import { useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Users,
  BookOpen,
  Clock,
  Edit,
  Trash2,
  Eye,
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
import { toast } from "sonner";

interface Turma {
  id: string;
  nome: string;
  serie: string;
  turno: string;
  sala: string;
  alunos: number;
  capacidade: number;
  professor: string;
  status: string;
}

const initialTurmasData: Turma[] = [
  {
    id: "1",
    nome: "1º Ano A",
    serie: "1º Ano",
    turno: "Manhã",
    sala: "Sala 101",
    alunos: 28,
    capacidade: 30,
    professor: "Maria Silva",
    status: "ativa",
  },
  {
    id: "2",
    nome: "1º Ano B",
    serie: "1º Ano",
    turno: "Tarde",
    sala: "Sala 102",
    alunos: 25,
    capacidade: 30,
    professor: "João Santos",
    status: "ativa",
  },
  {
    id: "3",
    nome: "2º Ano A",
    serie: "2º Ano",
    turno: "Manhã",
    sala: "Sala 103",
    alunos: 30,
    capacidade: 30,
    professor: "Ana Costa",
    status: "lotada",
  },
  {
    id: "4",
    nome: "3º Ano A",
    serie: "3º Ano",
    turno: "Manhã",
    sala: "Sala 104",
    alunos: 27,
    capacidade: 30,
    professor: "Carlos Oliveira",
    status: "ativa",
  },
  {
    id: "5",
    nome: "5º Ano A",
    serie: "5º Ano",
    turno: "Manhã",
    sala: "Sala 201",
    alunos: 32,
    capacidade: 35,
    professor: "Patricia Lima",
    status: "ativa",
  },
  {
    id: "6",
    nome: "7º Ano B",
    serie: "7º Ano",
    turno: "Tarde",
    sala: "Sala 301",
    alunos: 28,
    capacidade: 35,
    professor: "Roberto Ferreira",
    status: "ativa",
  },
  {
    id: "7",
    nome: "9º Ano A",
    serie: "9º Ano",
    turno: "Manhã",
    sala: "Sala 401",
    alunos: 30,
    capacidade: 35,
    professor: "Fernanda Souza",
    status: "ativa",
  },
  {
    id: "8",
    nome: "3º EM A",
    serie: "3º Médio",
    turno: "Manhã",
    sala: "Sala 501",
    alunos: 25,
    capacidade: 40,
    professor: "Marcos Almeida",
    status: "ativa",
  },
];

const statsCards = [
  { title: "Total de Turmas", value: "36", icon: BookOpen, color: "primary" },
  { title: "Alunos Matriculados", value: "1.247", icon: Users, color: "info" },
  { title: "Turno Manhã", value: "20", icon: Clock, color: "success" },
  { title: "Turno Tarde", value: "16", icon: Clock, color: "warning" },
];

const seriesOptions = [
  "1º Ano", "2º Ano", "3º Ano", "4º Ano", "5º Ano", 
  "6º Ano", "7º Ano", "8º Ano", "9º Ano", 
  "1º Médio", "2º Médio", "3º Médio"
];

const turnoOptions = ["Manhã", "Tarde", "Noite", "Integral"];

const professoresOptions = [
  "Maria Silva", "João Santos", "Ana Costa", "Carlos Oliveira",
  "Patricia Lima", "Roberto Ferreira", "Fernanda Souza", "Marcos Almeida"
];

export default function Turmas() {
  const [turmas, setTurmas] = useState<Turma[]>(initialTurmasData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSerie, setFilterSerie] = useState("all");
  const [filterTurno, setFilterTurno] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTurma, setSelectedTurma] = useState<Turma | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    nome: "",
    serie: "",
    turno: "",
    sala: "",
    capacidade: "",
    professor: "",
  });

  const filteredTurmas = turmas.filter((turma) => {
    const matchesSearch =
      turma.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      turma.professor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSerie = filterSerie === "all" || turma.serie === filterSerie;
    const matchesTurno = filterTurno === "all" || turma.turno === filterTurno;
    return matchesSearch && matchesSerie && matchesTurno;
  });

  const resetForm = () => {
    setFormData({
      nome: "",
      serie: "",
      turno: "",
      sala: "",
      capacidade: "",
      professor: "",
    });
    setIsEditing(false);
    setSelectedTurma(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (turma: Turma) => {
    setFormData({
      nome: turma.nome,
      serie: turma.serie,
      turno: turma.turno,
      sala: turma.sala,
      capacidade: turma.capacidade.toString(),
      professor: turma.professor,
    });
    setSelectedTurma(turma);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleOpenView = (turma: Turma) => {
    setSelectedTurma(turma);
    setIsViewDialogOpen(true);
  };

  const handleOpenDelete = (turma: Turma) => {
    setSelectedTurma(turma);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.nome || !formData.serie || !formData.turno) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (isEditing && selectedTurma) {
      // Atualizar turma existente
      setTurmas(turmas.map(t => 
        t.id === selectedTurma.id 
          ? {
              ...t,
              nome: formData.nome,
              serie: formData.serie,
              turno: formData.turno,
              sala: formData.sala,
              capacidade: parseInt(formData.capacidade) || t.capacidade,
              professor: formData.professor,
              status: t.alunos >= (parseInt(formData.capacidade) || t.capacidade) ? "lotada" : "ativa",
            }
          : t
      ));
      toast.success("Turma atualizada com sucesso!");
    } else {
      // Criar nova turma
      const novaTurma: Turma = {
        id: Date.now().toString(),
        nome: formData.nome,
        serie: formData.serie,
        turno: formData.turno,
        sala: formData.sala,
        alunos: 0,
        capacidade: parseInt(formData.capacidade) || 30,
        professor: formData.professor,
        status: "ativa",
      };
      setTurmas([...turmas, novaTurma]);
      toast.success("Turma criada com sucesso!");
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (selectedTurma) {
      setTurmas(turmas.filter(t => t.id !== selectedTurma.id));
      toast.success("Turma excluída com sucesso!");
      setIsDeleteDialogOpen(false);
      setSelectedTurma(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Turmas</h1>
          <p className="text-muted-foreground">
            Gerencie as turmas da sua escola
          </p>
        </div>
        <Button className="gap-2" onClick={handleOpenCreate}>
          <Plus className="h-4 w-4" />
          Nova Turma
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                placeholder="Buscar turma ou professor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterSerie} onValueChange={setFilterSerie}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Série" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Séries</SelectItem>
                  {seriesOptions.map(serie => (
                    <SelectItem key={serie} value={serie}>{serie}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterTurno} onValueChange={setFilterTurno}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Turno" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {turnoOptions.map(turno => (
                    <SelectItem key={turno} value={turno}>{turno}</SelectItem>
                  ))}
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
                <TableHead>Turma</TableHead>
                <TableHead>Série</TableHead>
                <TableHead>Turno</TableHead>
                <TableHead>Sala</TableHead>
                <TableHead>Professor</TableHead>
                <TableHead>Alunos</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTurmas.map((turma) => (
                <TableRow key={turma.id}>
                  <TableCell className="font-medium">{turma.nome}</TableCell>
                  <TableCell>{turma.serie}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{turma.turno}</Badge>
                  </TableCell>
                  <TableCell>{turma.sala}</TableCell>
                  <TableCell>{turma.professor}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>
                        {turma.alunos}/{turma.capacidade}
                      </span>
                      <div className="h-2 w-16 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            turma.alunos >= turma.capacidade
                              ? "bg-destructive"
                              : turma.alunos >= turma.capacidade * 0.9
                              ? "bg-warning"
                              : "bg-success"
                          }`}
                          style={{
                            width: `${(turma.alunos / turma.capacidade) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={turma.status === "lotada" ? "destructive" : "default"}
                    >
                      {turma.status === "lotada" ? "Lotada" : "Ativa"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-background">
                        <DropdownMenuItem onClick={() => handleOpenView(turma)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenEdit(turma)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleOpenDelete(turma)}
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

      {/* Dialog de Criar/Editar */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Turma" : "Criar Nova Turma"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Atualize os dados da turma" : "Preencha os dados para criar uma nova turma"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Turma *</Label>
                <Input 
                  id="nome" 
                  placeholder="Ex: 1º Ano A" 
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serie">Série *</Label>
                <Select 
                  value={formData.serie} 
                  onValueChange={(value) => setFormData({...formData, serie: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {seriesOptions.map(serie => (
                      <SelectItem key={serie} value={serie}>{serie}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="turno">Turno *</Label>
                <Select 
                  value={formData.turno} 
                  onValueChange={(value) => setFormData({...formData, turno: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {turnoOptions.map(turno => (
                      <SelectItem key={turno} value={turno}>{turno}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sala">Sala</Label>
                <Input 
                  id="sala" 
                  placeholder="Ex: Sala 101" 
                  value={formData.sala}
                  onChange={(e) => setFormData({...formData, sala: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacidade">Capacidade</Label>
                <Input 
                  id="capacidade" 
                  type="number" 
                  placeholder="30" 
                  value={formData.capacidade}
                  onChange={(e) => setFormData({...formData, capacidade: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="professor">Professor Responsável</Label>
                <Select 
                  value={formData.professor} 
                  onValueChange={(value) => setFormData({...formData, professor: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {professoresOptions.map(prof => (
                      <SelectItem key={prof} value={prof}>{prof}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {setIsDialogOpen(false); resetForm();}}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {isEditing ? "Salvar Alterações" : "Criar Turma"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Visualizar */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detalhes da Turma</DialogTitle>
          </DialogHeader>
          {selectedTurma && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Nome</Label>
                  <p className="font-medium">{selectedTurma.nome}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Série</Label>
                  <p className="font-medium">{selectedTurma.serie}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Turno</Label>
                  <p className="font-medium">{selectedTurma.turno}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Sala</Label>
                  <p className="font-medium">{selectedTurma.sala}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Professor</Label>
                  <p className="font-medium">{selectedTurma.professor}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Capacidade</Label>
                  <p className="font-medium">{selectedTurma.alunos}/{selectedTurma.capacidade} alunos</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <div className="mt-1">
                  <Badge variant={selectedTurma.status === "lotada" ? "destructive" : "default"}>
                    {selectedTurma.status === "lotada" ? "Lotada" : "Ativa"}
                  </Badge>
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
              if (selectedTurma) handleOpenEdit(selectedTurma);
            }}>
              Editar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AlertDialog de Excluir */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a turma "{selectedTurma?.nome}"? Esta ação não pode ser desfeita.
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

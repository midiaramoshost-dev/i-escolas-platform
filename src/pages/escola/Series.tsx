import { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  GraduationCap,
  Users,
  BookOpen,
  MoreHorizontal,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Serie {
  id: string;
  nome: string;
  nivel: string;
  turmas: number;
  alunos: number;
  disciplinas: number;
  status: "ativa" | "inativa";
}

const initialSeries: Serie[] = [
  { id: "1", nome: "1º Ano", nivel: "Fundamental I", turmas: 4, alunos: 112, disciplinas: 8, status: "ativa" },
  { id: "2", nome: "2º Ano", nivel: "Fundamental I", turmas: 3, alunos: 87, disciplinas: 8, status: "ativa" },
  { id: "3", nome: "3º Ano", nivel: "Fundamental I", turmas: 3, alunos: 92, disciplinas: 9, status: "ativa" },
  { id: "4", nome: "4º Ano", nivel: "Fundamental I", turmas: 3, alunos: 88, disciplinas: 9, status: "ativa" },
  { id: "5", nome: "5º Ano", nivel: "Fundamental I", turmas: 4, alunos: 118, disciplinas: 10, status: "ativa" },
  { id: "6", nome: "6º Ano", nivel: "Fundamental II", turmas: 4, alunos: 124, disciplinas: 12, status: "ativa" },
  { id: "7", nome: "7º Ano", nivel: "Fundamental II", turmas: 3, alunos: 96, disciplinas: 12, status: "ativa" },
  { id: "8", nome: "8º Ano", nivel: "Fundamental II", turmas: 3, alunos: 94, disciplinas: 12, status: "ativa" },
  { id: "9", nome: "9º Ano", nivel: "Fundamental II", turmas: 3, alunos: 91, disciplinas: 12, status: "ativa" },
  { id: "10", nome: "1º Médio", nivel: "Ensino Médio", turmas: 4, alunos: 140, disciplinas: 14, status: "ativa" },
  { id: "11", nome: "2º Médio", nivel: "Ensino Médio", turmas: 3, alunos: 105, disciplinas: 14, status: "ativa" },
  { id: "12", nome: "3º Médio", nivel: "Ensino Médio", turmas: 3, alunos: 100, disciplinas: 14, status: "ativa" },
];

const statsCards = [
  { title: "Total de Séries", value: "12", icon: GraduationCap, color: "primary" },
  { title: "Turmas Ativas", value: "40", icon: BookOpen, color: "info" },
  { title: "Total de Alunos", value: "1.247", icon: Users, color: "success" },
];

export default function Series() {
  const [series, setSeries] = useState<Serie[]>(initialSeries);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterNivel, setFilterNivel] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSerie, setSelectedSerie] = useState<Serie | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    nome: "",
    nivel: "",
  });

  const filteredSeries = series.filter((serie) => {
    const matchesSearch = serie.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesNivel = filterNivel === "all" || serie.nivel === filterNivel;
    return matchesSearch && matchesNivel;
  });

  const handleOpenDialog = (serie?: Serie) => {
    if (serie) {
      setIsEditMode(true);
      setSelectedSerie(serie);
      setFormData({ nome: serie.nome, nivel: serie.nivel });
    } else {
      setIsEditMode(false);
      setSelectedSerie(null);
      setFormData({ nome: "", nivel: "" });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.nome || !formData.nivel) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (isEditMode && selectedSerie) {
      setSeries(series.map(s => 
        s.id === selectedSerie.id 
          ? { ...s, nome: formData.nome, nivel: formData.nivel }
          : s
      ));
      toast.success("Série atualizada com sucesso!");
    } else {
      const newSerie: Serie = {
        id: String(Date.now()),
        nome: formData.nome,
        nivel: formData.nivel,
        turmas: 0,
        alunos: 0,
        disciplinas: 0,
        status: "ativa",
      };
      setSeries([...series, newSerie]);
      toast.success("Série criada com sucesso!");
    }
    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (selectedSerie) {
      setSeries(series.filter(s => s.id !== selectedSerie.id));
      toast.success("Série excluída com sucesso!");
      setIsDeleteDialogOpen(false);
      setSelectedSerie(null);
    }
  };

  const handleView = (serie: Serie) => {
    setSelectedSerie(serie);
    setIsViewDialogOpen(true);
  };

  const handleConfirmDelete = (serie: Serie) => {
    setSelectedSerie(serie);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Séries</h1>
          <p className="text-muted-foreground">
            Gerencie as séries da sua escola
          </p>
        </div>
        <Button className="gap-2" onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4" />
          Nova Série
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
                placeholder="Buscar série..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterNivel} onValueChange={setFilterNivel}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Nível" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Níveis</SelectItem>
                <SelectItem value="Fundamental I">Fundamental I</SelectItem>
                <SelectItem value="Fundamental II">Fundamental II</SelectItem>
                <SelectItem value="Ensino Médio">Ensino Médio</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="shadow-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Série</TableHead>
                <TableHead>Nível</TableHead>
                <TableHead>Turmas</TableHead>
                <TableHead>Alunos</TableHead>
                <TableHead>Disciplinas</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSeries.map((serie) => (
                <TableRow key={serie.id}>
                  <TableCell className="font-medium">{serie.nome}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{serie.nivel}</Badge>
                  </TableCell>
                  <TableCell>{serie.turmas}</TableCell>
                  <TableCell>{serie.alunos}</TableCell>
                  <TableCell>{serie.disciplinas}</TableCell>
                  <TableCell>
                    <Badge variant={serie.status === "ativa" ? "default" : "secondary"}>
                      {serie.status === "ativa" ? "Ativa" : "Inativa"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(serie)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenDialog(serie)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleConfirmDelete(serie)}
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Editar Série" : "Nova Série"}</DialogTitle>
            <DialogDescription>
              {isEditMode ? "Edite os dados da série" : "Preencha os dados para criar uma nova série"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome da Série</Label>
              <Input 
                id="nome" 
                placeholder="Ex: 1º Ano" 
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nivel">Nível de Ensino</Label>
              <Select value={formData.nivel} onValueChange={(value) => setFormData({ ...formData, nivel: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o nível" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fundamental I">Fundamental I</SelectItem>
                  <SelectItem value="Fundamental II">Fundamental II</SelectItem>
                  <SelectItem value="Ensino Médio">Ensino Médio</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {isEditMode ? "Salvar Alterações" : "Criar Série"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detalhes da Série</DialogTitle>
          </DialogHeader>
          {selectedSerie && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Nome</Label>
                  <p className="font-medium">{selectedSerie.nome}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Nível</Label>
                  <p className="font-medium">{selectedSerie.nivel}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-muted-foreground">Turmas</Label>
                  <p className="font-medium">{selectedSerie.turmas}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Alunos</Label>
                  <p className="font-medium">{selectedSerie.alunos}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Disciplinas</Label>
                  <p className="font-medium">{selectedSerie.disciplinas}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <Badge variant={selectedSerie.status === "ativa" ? "default" : "secondary"} className="mt-1">
                  {selectedSerie.status === "ativa" ? "Ativa" : "Inativa"}
                </Badge>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Fechar
            </Button>
            <Button onClick={() => {
              setIsViewDialogOpen(false);
              if (selectedSerie) handleOpenDialog(selectedSerie);
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
              Tem certeza que deseja excluir a série "{selectedSerie?.nome}"? 
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

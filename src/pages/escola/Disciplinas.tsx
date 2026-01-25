import { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  BookOpen,
  Users,
  GraduationCap,
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Disciplina {
  id: string;
  nome: string;
  codigo: string;
  cargaHoraria: number;
  professores: number;
  turmas: number;
  nivel: string;
  status: "ativa" | "inativa";
}

const initialDisciplinas: Disciplina[] = [
  { id: "1", nome: "Português", codigo: "PORT", cargaHoraria: 6, professores: 5, turmas: 36, nivel: "Todos", status: "ativa" },
  { id: "2", nome: "Matemática", codigo: "MAT", cargaHoraria: 6, professores: 5, turmas: 36, nivel: "Todos", status: "ativa" },
  { id: "3", nome: "Ciências", codigo: "CIE", cargaHoraria: 4, professores: 3, turmas: 24, nivel: "Fundamental", status: "ativa" },
  { id: "4", nome: "História", codigo: "HIST", cargaHoraria: 3, professores: 3, turmas: 24, nivel: "Fundamental II / Médio", status: "ativa" },
  { id: "5", nome: "Geografia", codigo: "GEO", cargaHoraria: 3, professores: 3, turmas: 24, nivel: "Fundamental II / Médio", status: "ativa" },
  { id: "6", nome: "Inglês", codigo: "ING", cargaHoraria: 2, professores: 4, turmas: 36, nivel: "Todos", status: "ativa" },
  { id: "7", nome: "Educação Física", codigo: "EDF", cargaHoraria: 2, professores: 4, turmas: 36, nivel: "Todos", status: "ativa" },
  { id: "8", nome: "Artes", codigo: "ART", cargaHoraria: 2, professores: 2, turmas: 20, nivel: "Fundamental", status: "ativa" },
  { id: "9", nome: "Física", codigo: "FIS", cargaHoraria: 4, professores: 2, turmas: 10, nivel: "Ensino Médio", status: "ativa" },
  { id: "10", nome: "Química", codigo: "QUI", cargaHoraria: 4, professores: 2, turmas: 10, nivel: "Ensino Médio", status: "ativa" },
  { id: "11", nome: "Biologia", codigo: "BIO", cargaHoraria: 4, professores: 2, turmas: 10, nivel: "Ensino Médio", status: "ativa" },
  { id: "12", nome: "Filosofia", codigo: "FIL", cargaHoraria: 2, professores: 1, turmas: 10, nivel: "Ensino Médio", status: "ativa" },
];

const statsCards = [
  { title: "Total de Disciplinas", value: "15", icon: BookOpen, color: "primary" },
  { title: "Professores Alocados", value: "48", icon: GraduationCap, color: "info" },
  { title: "Carga Horária Total", value: "44h", icon: Users, color: "success" },
];

export default function Disciplinas() {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>(initialDisciplinas);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterNivel, setFilterNivel] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedDisciplina, setSelectedDisciplina] = useState<Disciplina | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    nome: "",
    codigo: "",
    cargaHoraria: "",
    nivel: "",
  });

  const filteredDisciplinas = disciplinas.filter((disciplina) => {
    const matchesSearch = 
      disciplina.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disciplina.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesNivel = filterNivel === "all" || disciplina.nivel.includes(filterNivel);
    return matchesSearch && matchesNivel;
  });

  const handleOpenDialog = (disciplina?: Disciplina) => {
    if (disciplina) {
      setIsEditMode(true);
      setSelectedDisciplina(disciplina);
      setFormData({ 
        nome: disciplina.nome, 
        codigo: disciplina.codigo,
        cargaHoraria: String(disciplina.cargaHoraria),
        nivel: disciplina.nivel,
      });
    } else {
      setIsEditMode(false);
      setSelectedDisciplina(null);
      setFormData({ nome: "", codigo: "", cargaHoraria: "", nivel: "" });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.nome || !formData.codigo || !formData.cargaHoraria) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (isEditMode && selectedDisciplina) {
      setDisciplinas(disciplinas.map(d => 
        d.id === selectedDisciplina.id 
          ? { ...d, nome: formData.nome, codigo: formData.codigo, cargaHoraria: Number(formData.cargaHoraria), nivel: formData.nivel }
          : d
      ));
      toast.success("Disciplina atualizada com sucesso!");
    } else {
      const newDisciplina: Disciplina = {
        id: String(Date.now()),
        nome: formData.nome,
        codigo: formData.codigo.toUpperCase(),
        cargaHoraria: Number(formData.cargaHoraria),
        nivel: formData.nivel,
        professores: 0,
        turmas: 0,
        status: "ativa",
      };
      setDisciplinas([...disciplinas, newDisciplina]);
      toast.success("Disciplina criada com sucesso!");
    }
    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (selectedDisciplina) {
      setDisciplinas(disciplinas.filter(d => d.id !== selectedDisciplina.id));
      toast.success("Disciplina excluída com sucesso!");
      setIsDeleteDialogOpen(false);
      setSelectedDisciplina(null);
    }
  };

  const handleView = (disciplina: Disciplina) => {
    setSelectedDisciplina(disciplina);
    setIsViewDialogOpen(true);
  };

  const handleConfirmDelete = (disciplina: Disciplina) => {
    setSelectedDisciplina(disciplina);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Disciplinas</h1>
          <p className="text-muted-foreground">
            Gerencie as disciplinas da sua escola
          </p>
        </div>
        <Button className="gap-2" onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4" />
          Nova Disciplina
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
                placeholder="Buscar disciplina ou código..."
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
                <SelectItem value="Fundamental">Fundamental</SelectItem>
                <SelectItem value="Médio">Ensino Médio</SelectItem>
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
                <TableHead>Disciplina</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Carga Horária</TableHead>
                <TableHead>Professores</TableHead>
                <TableHead>Turmas</TableHead>
                <TableHead>Nível</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDisciplinas.map((disciplina) => (
                <TableRow key={disciplina.id}>
                  <TableCell className="font-medium">{disciplina.nome}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">{disciplina.codigo}</Badge>
                  </TableCell>
                  <TableCell>{disciplina.cargaHoraria}h/semana</TableCell>
                  <TableCell>{disciplina.professores}</TableCell>
                  <TableCell>{disciplina.turmas}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{disciplina.nivel}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={disciplina.status === "ativa" ? "default" : "secondary"}>
                      {disciplina.status === "ativa" ? "Ativa" : "Inativa"}
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
                        <DropdownMenuItem onClick={() => handleView(disciplina)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenDialog(disciplina)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleConfirmDelete(disciplina)}
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
            <DialogTitle>{isEditMode ? "Editar Disciplina" : "Nova Disciplina"}</DialogTitle>
            <DialogDescription>
              {isEditMode ? "Edite os dados da disciplina" : "Preencha os dados para criar uma nova disciplina"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Disciplina</Label>
                <Input 
                  id="nome" 
                  placeholder="Ex: Matemática" 
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="codigo">Código</Label>
                <Input 
                  id="codigo" 
                  placeholder="Ex: MAT" 
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
                  maxLength={5}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cargaHoraria">Carga Horária (h/semana)</Label>
                <Input 
                  id="cargaHoraria" 
                  type="number"
                  placeholder="Ex: 4" 
                  value={formData.cargaHoraria}
                  onChange={(e) => setFormData({ ...formData, cargaHoraria: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nivel">Nível de Ensino</Label>
                <Select value={formData.nivel} onValueChange={(value) => setFormData({ ...formData, nivel: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todos">Todos os Níveis</SelectItem>
                    <SelectItem value="Fundamental I">Fundamental I</SelectItem>
                    <SelectItem value="Fundamental II">Fundamental II</SelectItem>
                    <SelectItem value="Fundamental">Fundamental (I e II)</SelectItem>
                    <SelectItem value="Ensino Médio">Ensino Médio</SelectItem>
                    <SelectItem value="Fundamental II / Médio">Fund. II e Médio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {isEditMode ? "Salvar Alterações" : "Criar Disciplina"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detalhes da Disciplina</DialogTitle>
          </DialogHeader>
          {selectedDisciplina && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Nome</Label>
                  <p className="font-medium">{selectedDisciplina.nome}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Código</Label>
                  <p className="font-medium font-mono">{selectedDisciplina.codigo}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-muted-foreground">Carga Horária</Label>
                  <p className="font-medium">{selectedDisciplina.cargaHoraria}h/semana</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Professores</Label>
                  <p className="font-medium">{selectedDisciplina.professores}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Turmas</Label>
                  <p className="font-medium">{selectedDisciplina.turmas}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Nível</Label>
                  <Badge variant="secondary" className="mt-1">{selectedDisciplina.nivel}</Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge variant={selectedDisciplina.status === "ativa" ? "default" : "secondary"} className="mt-1">
                    {selectedDisciplina.status === "ativa" ? "Ativa" : "Inativa"}
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
              if (selectedDisciplina) handleOpenDialog(selectedDisciplina);
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
              Tem certeza que deseja excluir a disciplina "{selectedDisciplina?.nome}"? 
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

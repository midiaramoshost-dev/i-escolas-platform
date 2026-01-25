import { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Users,
  UserCheck,
  Phone,
  Mail,
  MoreHorizontal,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { useAlunosResponsaveis, type Responsavel } from "@/contexts/AlunosResponsaveisContext";

const statsCards = [
  { title: "Total de Responsáveis", value: "892", icon: Users, color: "primary" },
  { title: "Responsáveis Ativos", value: "856", icon: UserCheck, color: "success" },
  { title: "Alunos Vinculados", value: "1.247", icon: Users, color: "info" },
];

export default function Responsaveis() {
  // Usar dados do contexto compartilhado
  const { responsaveis, updateResponsavel, deleteResponsavel, setResponsaveis } = useAlunosResponsaveis();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedResponsavel, setSelectedResponsavel] = useState<Responsavel | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    parentesco: "",
  });

  const filteredResponsaveis = responsaveis.filter((resp) => {
    const matchesSearch =
      resp.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resp.alunos.some(a => a.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === "all" || resp.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .slice(0, 14);
  };

  const formatTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 15);
  };

  const handleOpenDialog = (responsavel?: Responsavel) => {
    if (responsavel) {
      setIsEditMode(true);
      setSelectedResponsavel(responsavel);
      setFormData({
        nome: responsavel.nome,
        cpf: responsavel.cpf,
        email: responsavel.email,
        telefone: responsavel.telefone,
        parentesco: responsavel.parentesco,
      });
    } else {
      setIsEditMode(false);
      setSelectedResponsavel(null);
      setFormData({ nome: "", cpf: "", email: "", telefone: "", parentesco: "" });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.nome || !formData.email || !formData.telefone) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (isEditMode && selectedResponsavel) {
      updateResponsavel(selectedResponsavel.id, {
        nome: formData.nome,
        cpf: formData.cpf,
        email: formData.email,
        telefone: formData.telefone,
        parentesco: formData.parentesco,
      });
      toast.success("Responsável atualizado com sucesso!");
    } else {
      const newResponsavel: Responsavel = {
        id: String(Date.now()),
        nome: formData.nome,
        cpf: formData.cpf,
        email: formData.email,
        telefone: formData.telefone,
        endereco: "", // Campo será preenchido posteriormente
        parentesco: formData.parentesco,
        alunos: [],
        alunoIds: [],
        status: "ativo",
      };
      setResponsaveis(prev => [...prev, newResponsavel]);
      toast.success("Responsável cadastrado com sucesso!");
    }
    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (selectedResponsavel) {
      deleteResponsavel(selectedResponsavel.id);
      toast.success("Responsável excluído com sucesso!");
      setIsDeleteDialogOpen(false);
      setSelectedResponsavel(null);
    }
  };

  const handleView = (responsavel: Responsavel) => {
    setSelectedResponsavel(responsavel);
    setIsViewDialogOpen(true);
  };

  const handleConfirmDelete = (responsavel: Responsavel) => {
    setSelectedResponsavel(responsavel);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Responsáveis</h1>
          <p className="text-muted-foreground">
            Gerencie os responsáveis dos alunos
          </p>
        </div>
        <Button className="gap-2" onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4" />
          Novo Responsável
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
                placeholder="Buscar por nome, email ou aluno..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="ativo">Ativos</SelectItem>
                <SelectItem value="inativo">Inativos</SelectItem>
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
                <TableHead>Responsável</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Parentesco</TableHead>
                <TableHead>Alunos Vinculados</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResponsaveis.map((resp) => (
                <TableRow key={resp.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {getInitials(resp.nome)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{resp.nome}</p>
                        <p className="text-xs text-muted-foreground">{resp.cpf}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        {resp.email}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {resp.telefone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{resp.parentesco}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {resp.alunos.map((aluno, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {aluno}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={resp.status === "ativo" ? "default" : "secondary"}>
                      {resp.status === "ativo" ? "Ativo" : "Inativo"}
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
                        <DropdownMenuItem onClick={() => handleView(resp)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenDialog(resp)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleConfirmDelete(resp)}
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
            <DialogTitle>{isEditMode ? "Editar Responsável" : "Novo Responsável"}</DialogTitle>
            <DialogDescription>
              {isEditMode ? "Edite os dados do responsável" : "Preencha os dados para cadastrar um novo responsável"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input
                id="nome"
                placeholder="Nome do responsável"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: formatCPF(e.target.value) })}
                  maxLength={14}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parentesco">Parentesco</Label>
                <Select value={formData.parentesco} onValueChange={(value) => setFormData({ ...formData, parentesco: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mãe">Mãe</SelectItem>
                    <SelectItem value="Pai">Pai</SelectItem>
                    <SelectItem value="Avó">Avó</SelectItem>
                    <SelectItem value="Avô">Avô</SelectItem>
                    <SelectItem value="Tia">Tia</SelectItem>
                    <SelectItem value="Tio">Tio</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  placeholder="(11) 99999-9999"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: formatTelefone(e.target.value) })}
                  maxLength={15}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {isEditMode ? "Salvar Alterações" : "Cadastrar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Responsável</DialogTitle>
          </DialogHeader>
          {selectedResponsavel && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {getInitials(selectedResponsavel.nome)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-lg">{selectedResponsavel.nome}</p>
                  <Badge variant={selectedResponsavel.status === "ativo" ? "default" : "secondary"}>
                    {selectedResponsavel.status === "ativo" ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">CPF</Label>
                  <p className="font-medium">{selectedResponsavel.cpf}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Parentesco</Label>
                  <p className="font-medium">{selectedResponsavel.parentesco}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">E-mail</Label>
                  <p className="font-medium">{selectedResponsavel.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Telefone</Label>
                  <p className="font-medium">{selectedResponsavel.telefone}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Alunos Vinculados</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedResponsavel.alunos.length > 0 ? (
                    selectedResponsavel.alunos.map((aluno, idx) => (
                      <Badge key={idx} variant="secondary">{aluno}</Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhum aluno vinculado</p>
                  )}
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
              if (selectedResponsavel) handleOpenDialog(selectedResponsavel);
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
              Tem certeza que deseja excluir o responsável "{selectedResponsavel?.nome}"?
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

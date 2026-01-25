import { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Users,
  UserCheck,
  Briefcase,
  MoreHorizontal,
  Phone,
  Mail,
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

interface Funcionario {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  cargo: string;
  setor: string;
  dataAdmissao: string;
  status: "ativo" | "inativo" | "ferias";
}

const initialFuncionarios: Funcionario[] = [
  { id: "1", nome: "Helena Costa", cpf: "111.222.333-44", email: "helena.costa@escola.com.br", telefone: "(11) 97777-1111", cargo: "Secretária", setor: "Secretaria", dataAdmissao: "2020-03-15", status: "ativo" },
  { id: "2", nome: "Ricardo Souza", cpf: "222.333.444-55", email: "ricardo.souza@escola.com.br", telefone: "(11) 97777-2222", cargo: "Coordenador Pedagógico", setor: "Coordenação", dataAdmissao: "2018-08-01", status: "ativo" },
  { id: "3", nome: "Amanda Oliveira", cpf: "333.444.555-66", email: "amanda.oliveira@escola.com.br", telefone: "(11) 97777-3333", cargo: "Auxiliar Administrativo", setor: "Administrativo", dataAdmissao: "2021-02-10", status: "ativo" },
  { id: "4", nome: "José Pereira", cpf: "444.555.666-77", email: "jose.pereira@escola.com.br", telefone: "(11) 97777-4444", cargo: "Porteiro", setor: "Segurança", dataAdmissao: "2019-05-20", status: "ativo" },
  { id: "5", nome: "Mariana Lima", cpf: "555.666.777-88", email: "mariana.lima@escola.com.br", telefone: "(11) 97777-5555", cargo: "Bibliotecária", setor: "Biblioteca", dataAdmissao: "2020-09-01", status: "ferias" },
  { id: "6", nome: "Paulo Santos", cpf: "666.777.888-99", email: "paulo.santos@escola.com.br", telefone: "(11) 97777-6666", cargo: "Técnico de Informática", setor: "TI", dataAdmissao: "2022-01-15", status: "ativo" },
  { id: "7", nome: "Sandra Ferreira", cpf: "777.888.999-00", email: "sandra.ferreira@escola.com.br", telefone: "(11) 97777-7777", cargo: "Cozinheira", setor: "Cozinha", dataAdmissao: "2017-03-10", status: "ativo" },
  { id: "8", nome: "Carlos Mendes", cpf: "888.999.000-11", email: "carlos.mendes@escola.com.br", telefone: "(11) 97777-8888", cargo: "Zelador", setor: "Manutenção", dataAdmissao: "2019-11-25", status: "inativo" },
];

const statsCards = [
  { title: "Total de Funcionários", value: "32", icon: Users, color: "primary" },
  { title: "Funcionários Ativos", value: "28", icon: UserCheck, color: "success" },
  { title: "Em Férias", value: "3", icon: Briefcase, color: "warning" },
];

export default function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>(initialFuncionarios);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSetor, setFilterSetor] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedFuncionario, setSelectedFuncionario] = useState<Funcionario | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    cargo: "",
    setor: "",
    dataAdmissao: "",
  });

  const setores = [...new Set(funcionarios.map(f => f.setor))];

  const filteredFuncionarios = funcionarios.filter((func) => {
    const matchesSearch =
      func.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      func.cargo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSetor = filterSetor === "all" || func.setor === filterSetor;
    const matchesStatus = filterStatus === "all" || func.status === filterStatus;
    return matchesSearch && matchesSetor && matchesStatus;
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ativo":
        return <Badge className="bg-success text-success-foreground">Ativo</Badge>;
      case "inativo":
        return <Badge variant="secondary">Inativo</Badge>;
      case "ferias":
        return <Badge className="bg-warning text-warning-foreground">Férias</Badge>;
      default:
        return <Badge variant="secondary">-</Badge>;
    }
  };

  const handleOpenDialog = (funcionario?: Funcionario) => {
    if (funcionario) {
      setIsEditMode(true);
      setSelectedFuncionario(funcionario);
      setFormData({
        nome: funcionario.nome,
        cpf: funcionario.cpf,
        email: funcionario.email,
        telefone: funcionario.telefone,
        cargo: funcionario.cargo,
        setor: funcionario.setor,
        dataAdmissao: funcionario.dataAdmissao,
      });
    } else {
      setIsEditMode(false);
      setSelectedFuncionario(null);
      setFormData({ nome: "", cpf: "", email: "", telefone: "", cargo: "", setor: "", dataAdmissao: "" });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.nome || !formData.cargo || !formData.setor) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (isEditMode && selectedFuncionario) {
      setFuncionarios(funcionarios.map(f =>
        f.id === selectedFuncionario.id
          ? { ...f, ...formData }
          : f
      ));
      toast.success("Funcionário atualizado com sucesso!");
    } else {
      const newFuncionario: Funcionario = {
        id: String(Date.now()),
        ...formData,
        status: "ativo",
      };
      setFuncionarios([...funcionarios, newFuncionario]);
      toast.success("Funcionário cadastrado com sucesso!");
    }
    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (selectedFuncionario) {
      setFuncionarios(funcionarios.filter(f => f.id !== selectedFuncionario.id));
      toast.success("Funcionário excluído com sucesso!");
      setIsDeleteDialogOpen(false);
      setSelectedFuncionario(null);
    }
  };

  const handleView = (funcionario: Funcionario) => {
    setSelectedFuncionario(funcionario);
    setIsViewDialogOpen(true);
  };

  const handleConfirmDelete = (funcionario: Funcionario) => {
    setSelectedFuncionario(funcionario);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Funcionários</h1>
          <p className="text-muted-foreground">
            Gerencie os funcionários da escola
          </p>
        </div>
        <Button className="gap-2" onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4" />
          Novo Funcionário
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
                placeholder="Buscar por nome ou cargo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterSetor} onValueChange={setFilterSetor}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Setor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Setores</SelectItem>
                  {setores.map(setor => (
                    <SelectItem key={setor} value={setor}>{setor}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="ativo">Ativos</SelectItem>
                  <SelectItem value="inativo">Inativos</SelectItem>
                  <SelectItem value="ferias">Férias</SelectItem>
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
                <TableHead>Funcionário</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Setor</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Admissão</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFuncionarios.map((func) => (
                <TableRow key={func.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {getInitials(func.nome)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{func.nome}</p>
                        <p className="text-xs text-muted-foreground">{func.cpf}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{func.cargo}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{func.setor}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="truncate max-w-[150px]">{func.email}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {func.telefone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(func.dataAdmissao + 'T00:00:00').toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>{getStatusBadge(func.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(func)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenDialog(func)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleConfirmDelete(func)}
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
            <DialogTitle>{isEditMode ? "Editar Funcionário" : "Novo Funcionário"}</DialogTitle>
            <DialogDescription>
              {isEditMode ? "Edite os dados do funcionário" : "Preencha os dados para cadastrar um novo funcionário"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input
                id="nome"
                placeholder="Nome do funcionário"
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
                <Label htmlFor="dataAdmissao">Data de Admissão</Label>
                <Input
                  id="dataAdmissao"
                  type="date"
                  value={formData.dataAdmissao}
                  onChange={(e) => setFormData({ ...formData, dataAdmissao: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cargo">Cargo</Label>
                <Input
                  id="cargo"
                  placeholder="Ex: Secretária"
                  value={formData.cargo}
                  onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="setor">Setor</Label>
                <Select value={formData.setor} onValueChange={(value) => setFormData({ ...formData, setor: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Secretaria">Secretaria</SelectItem>
                    <SelectItem value="Coordenação">Coordenação</SelectItem>
                    <SelectItem value="Administrativo">Administrativo</SelectItem>
                    <SelectItem value="TI">TI</SelectItem>
                    <SelectItem value="Biblioteca">Biblioteca</SelectItem>
                    <SelectItem value="Cozinha">Cozinha</SelectItem>
                    <SelectItem value="Manutenção">Manutenção</SelectItem>
                    <SelectItem value="Segurança">Segurança</SelectItem>
                    <SelectItem value="Limpeza">Limpeza</SelectItem>
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
                  placeholder="email@escola.com.br"
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
            <DialogTitle>Detalhes do Funcionário</DialogTitle>
          </DialogHeader>
          {selectedFuncionario && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {getInitials(selectedFuncionario.nome)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-lg">{selectedFuncionario.nome}</p>
                  {getStatusBadge(selectedFuncionario.status)}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">CPF</Label>
                  <p className="font-medium">{selectedFuncionario.cpf}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Data de Admissão</Label>
                  <p className="font-medium">
                    {new Date(selectedFuncionario.dataAdmissao + 'T00:00:00').toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Cargo</Label>
                  <p className="font-medium">{selectedFuncionario.cargo}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Setor</Label>
                  <Badge variant="outline" className="mt-1">{selectedFuncionario.setor}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">E-mail</Label>
                  <p className="font-medium">{selectedFuncionario.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Telefone</Label>
                  <p className="font-medium">{selectedFuncionario.telefone}</p>
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
              if (selectedFuncionario) handleOpenDialog(selectedFuncionario);
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
              Tem certeza que deseja excluir o funcionário "{selectedFuncionario?.nome}"?
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

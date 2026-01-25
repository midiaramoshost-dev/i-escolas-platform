import { useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Mail,
  Phone,
  Edit,
  Trash2,
  Eye,
  Users,
  UserCheck,
  AlertTriangle,
  Download,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAlunosResponsaveis, type Aluno } from "@/contexts/AlunosResponsaveisContext";

const turmasOptions = [
  "1º Ano A", "1º Ano B", "2º Ano A", "3º Ano A", "4º Ano A",
  "5º Ano A", "6º Ano A", "7º Ano B", "8º Ano A", "9º Ano A",
  "1º EM A", "2º EM A", "3º EM A"
];

const seriesOptions = [
  "1º Ano", "2º Ano", "3º Ano", "4º Ano", "5º Ano",
  "6º Ano", "7º Ano", "8º Ano", "9º Ano",
  "1º Médio", "2º Médio", "3º Médio"
];

const turnoOptions = ["Manhã", "Tarde", "Integral"];

const statsCards = [
  { title: "Total de Alunos", value: "1.247", icon: Users, color: "primary" },
  { title: "Frequência Regular", value: "1.180", icon: UserCheck, color: "success" },
  { title: "Em Alerta", value: "52", icon: AlertTriangle, color: "warning" },
  { title: "Situação Crítica", value: "15", icon: AlertTriangle, color: "destructive" },
];

export default function Alunos() {
  // Usar dados do contexto compartilhado
  const { alunos, responsaveis, updateAluno, deleteAluno, setAlunos } = useAlunosResponsaveis();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTurma, setFilterTurma] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    dataNascimento: "",
    endereco: "",
    serie: "",
    turma: "",
    turno: "",
    responsavel: "",
    telefone: "",
    email: "",
    parentesco: "",
  });

  const filteredAlunos = alunos.filter((aluno) => {
    const matchesSearch =
      aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aluno.matricula.includes(searchTerm) ||
      aluno.responsavel.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTurma = filterTurma === "all" || aluno.turma === filterTurma;
    const matchesStatus = filterStatus === "all" || aluno.status === filterStatus;
    return matchesSearch && matchesTurma && matchesStatus;
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "regular":
        return <Badge className="bg-success text-success-foreground">Regular</Badge>;
      case "alerta":
        return <Badge className="bg-warning text-warning-foreground">Alerta</Badge>;
      case "critico":
        return <Badge variant="destructive">Crítico</Badge>;
      default:
        return <Badge variant="secondary">-</Badge>;
    }
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      cpf: "",
      dataNascimento: "",
      endereco: "",
      serie: "",
      turma: "",
      turno: "",
      responsavel: "",
      telefone: "",
      email: "",
      parentesco: "",
    });
    setIsEditing(false);
    setSelectedAluno(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (aluno: Aluno) => {
    setFormData({
      nome: aluno.nome,
      cpf: aluno.cpf,
      dataNascimento: aluno.dataNascimento,
      endereco: aluno.endereco,
      serie: aluno.serie,
      turma: aluno.turma,
      turno: aluno.turno,
      responsavel: aluno.responsavel,
      telefone: aluno.telefone,
      email: aluno.email,
      parentesco: "",
    });
    setSelectedAluno(aluno);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleOpenView = (aluno: Aluno) => {
    setSelectedAluno(aluno);
    setIsViewDialogOpen(true);
  };

  const handleOpenDelete = (aluno: Aluno) => {
    setSelectedAluno(aluno);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.nome || !formData.turma) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    // Encontrar o responsável selecionado para vincular
    const responsavelSelecionado = responsaveis.find(r => r.nome === formData.responsavel);

    if (isEditing && selectedAluno) {
      updateAluno(selectedAluno.id, {
        nome: formData.nome,
        cpf: formData.cpf,
        dataNascimento: formData.dataNascimento,
        endereco: formData.endereco,
        serie: formData.serie,
        turma: formData.turma,
        turno: formData.turno,
        responsavel: formData.responsavel,
        responsavelId: responsavelSelecionado?.id,
        telefone: formData.telefone,
        email: formData.email,
      });
      toast.success("Aluno atualizado com sucesso!");
    } else {
      const novoAluno: Aluno = {
        id: Date.now().toString(),
        matricula: `2024${String(alunos.length + 1).padStart(3, '0')}`,
        nome: formData.nome,
        cpf: formData.cpf,
        dataNascimento: formData.dataNascimento,
        endereco: formData.endereco,
        serie: formData.serie,
        turma: formData.turma,
        turno: formData.turno,
        responsavel: formData.responsavel,
        responsavelId: responsavelSelecionado?.id,
        telefone: formData.telefone,
        email: formData.email,
        frequencia: 100,
        media: 0,
        status: "regular",
      };
      setAlunos(prev => [...prev, novoAluno]);
      toast.success("Aluno matriculado com sucesso!");
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (selectedAluno) {
      deleteAluno(selectedAluno.id);
      toast.success("Matrícula cancelada com sucesso!");
      setIsDeleteDialogOpen(false);
      setSelectedAluno(null);
    }
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return value;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alunos</h1>
          <p className="text-muted-foreground">
            Gerencie os alunos matriculados na escola
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button className="gap-2" onClick={handleOpenCreate}>
            <Plus className="h-4 w-4" />
            Novo Aluno
          </Button>
        </div>
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
                placeholder="Buscar por nome, matrícula ou responsável..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterTurma} onValueChange={setFilterTurma}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Turma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {turmasOptions.map(turma => (
                    <SelectItem key={turma} value={turma}>{turma}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="alerta">Alerta</SelectItem>
                  <SelectItem value="critico">Crítico</SelectItem>
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
                <TableHead>Aluno</TableHead>
                <TableHead>Matrícula</TableHead>
                <TableHead>Turma</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Frequência</TableHead>
                <TableHead>Média</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlunos.map((aluno) => (
                <TableRow key={aluno.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {getInitials(aluno.nome)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{aluno.nome}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {aluno.matricula}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{aluno.turma}</span>
                      <span className="text-xs text-muted-foreground">
                        {aluno.turno}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{aluno.responsavel}</span>
                      <span className="text-xs text-muted-foreground">
                        {aluno.telefone}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-medium ${
                          aluno.frequencia >= 90
                            ? "text-success"
                            : aluno.frequencia >= 75
                            ? "text-warning"
                            : "text-destructive"
                        }`}
                      >
                        {aluno.frequencia}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`font-medium ${
                        aluno.media >= 7
                          ? "text-success"
                          : aluno.media >= 5
                          ? "text-warning"
                          : "text-destructive"
                      }`}
                    >
                      {aluno.media.toFixed(1)}
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(aluno.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-background">
                        <DropdownMenuItem onClick={() => handleOpenView(aluno)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Perfil
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenEdit(aluno)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Contatar Responsável
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleOpenDelete(aluno)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Cancelar Matrícula
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
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Aluno" : "Matricular Aluno"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Atualize os dados do aluno" : "Preencha os dados para realizar a matrícula"}
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="aluno" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="aluno">Dados do Aluno</TabsTrigger>
              <TabsTrigger value="responsavel">Responsável</TabsTrigger>
              <TabsTrigger value="academico">Acadêmico</TabsTrigger>
            </TabsList>
            <TabsContent value="aluno" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input 
                    id="nome" 
                    placeholder="Nome do aluno" 
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nascimento">Data de Nascimento</Label>
                  <Input 
                    id="nascimento" 
                    type="date" 
                    value={formData.dataNascimento}
                    onChange={(e) => setFormData({...formData, dataNascimento: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input 
                    id="cpf" 
                    placeholder="000.000.000-00" 
                    value={formData.cpf}
                    onChange={(e) => setFormData({...formData, cpf: formatCPF(e.target.value)})}
                    maxLength={14}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rg">RG</Label>
                  <Input id="rg" placeholder="00.000.000-0" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço Completo</Label>
                <Input 
                  id="endereco" 
                  placeholder="Rua, número, bairro, cidade" 
                  value={formData.endereco}
                  onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                />
              </div>
            </TabsContent>
            <TabsContent value="responsavel" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="resp-nome">Nome do Responsável</Label>
                  <Input 
                    id="resp-nome" 
                    placeholder="Nome completo" 
                    value={formData.responsavel}
                    onChange={(e) => setFormData({...formData, responsavel: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parentesco">Parentesco</Label>
                  <Select 
                    value={formData.parentesco}
                    onValueChange={(value) => setFormData({...formData, parentesco: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mae">Mãe</SelectItem>
                      <SelectItem value="pai">Pai</SelectItem>
                      <SelectItem value="avo">Avó/Avô</SelectItem>
                      <SelectItem value="tio">Tio/Tia</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="resp-email">E-mail</Label>
                  <Input 
                    id="resp-email" 
                    type="email" 
                    placeholder="email@exemplo.com" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resp-telefone">Telefone</Label>
                  <Input 
                    id="resp-telefone" 
                    placeholder="(11) 99999-9999" 
                    value={formData.telefone}
                    onChange={(e) => setFormData({...formData, telefone: formatPhone(e.target.value)})}
                    maxLength={15}
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="academico" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Série *</Label>
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
                <div className="space-y-2">
                  <Label>Turma *</Label>
                  <Select 
                    value={formData.turma}
                    onValueChange={(value) => setFormData({...formData, turma: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {turmasOptions.map(turma => (
                        <SelectItem key={turma} value={turma}>{turma}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Turno</Label>
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
            </TabsContent>
          </Tabs>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => {setIsDialogOpen(false); resetForm();}}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {isEditing ? "Salvar Alterações" : "Matricular Aluno"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Visualizar */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Perfil do Aluno</DialogTitle>
          </DialogHeader>
          {selectedAluno && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {getInitials(selectedAluno.nome)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{selectedAluno.nome}</h3>
                  <p className="text-muted-foreground">Matrícula: {selectedAluno.matricula}</p>
                  {getStatusBadge(selectedAluno.status)}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Turma</Label>
                  <p className="font-medium">{selectedAluno.turma}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Turno</Label>
                  <p className="font-medium">{selectedAluno.turno}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Frequência</Label>
                  <p className={`font-medium ${selectedAluno.frequencia >= 90 ? "text-success" : selectedAluno.frequencia >= 75 ? "text-warning" : "text-destructive"}`}>
                    {selectedAluno.frequencia}%
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Média Geral</Label>
                  <p className={`font-medium ${selectedAluno.media >= 7 ? "text-success" : selectedAluno.media >= 5 ? "text-warning" : "text-destructive"}`}>
                    {selectedAluno.media.toFixed(1)}
                  </p>
                </div>
              </div>
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Responsável</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Nome</Label>
                    <p className="font-medium">{selectedAluno.responsavel}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Telefone</Label>
                    <p className="font-medium">{selectedAluno.telefone}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <Label className="text-muted-foreground">E-mail</Label>
                  <p className="font-medium">{selectedAluno.email}</p>
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
              if (selectedAluno) handleOpenEdit(selectedAluno);
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
            <AlertDialogTitle>Cancelar Matrícula</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar a matrícula de "{selectedAluno?.nome}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Cancelar Matrícula
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

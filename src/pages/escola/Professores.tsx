import { useState } from "react";
import {
  Plus,
  Search,
  Mail,
  Phone,
  Edit,
  Trash2,
  Eye,
  GraduationCap,
  BookOpen,
  Award,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

interface Professor {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  disciplinas: string[];
  turmas: string[];
  formacao: string;
  status: string;
  avatar: string;
}

const initialProfessoresData: Professor[] = [
  {
    id: "1",
    nome: "Maria Silva",
    email: "maria.silva@escola.com.br",
    telefone: "(11) 99999-1111",
    cpf: "123.456.789-00",
    disciplinas: ["Português", "Redação"],
    turmas: ["1º Ano A", "2º Ano A"],
    formacao: "Letras - USP",
    status: "ativo",
    avatar: "",
  },
  {
    id: "2",
    nome: "João Santos",
    email: "joao.santos@escola.com.br",
    telefone: "(11) 99999-2222",
    cpf: "234.567.890-11",
    disciplinas: ["Matemática"],
    turmas: ["1º Ano B", "3º Ano A", "5º Ano A"],
    formacao: "Matemática - UNICAMP",
    status: "ativo",
    avatar: "",
  },
  {
    id: "3",
    nome: "Ana Costa",
    email: "ana.costa@escola.com.br",
    telefone: "(11) 99999-3333",
    cpf: "345.678.901-22",
    disciplinas: ["Ciências", "Biologia"],
    turmas: ["2º Ano A", "6º Ano A"],
    formacao: "Biologia - UNESP",
    status: "ativo",
    avatar: "",
  },
  {
    id: "4",
    nome: "Carlos Oliveira",
    email: "carlos.oliveira@escola.com.br",
    telefone: "(11) 99999-4444",
    cpf: "456.789.012-33",
    disciplinas: ["História", "Geografia"],
    turmas: ["3º Ano A", "4º Ano A"],
    formacao: "História - PUC",
    status: "ativo",
    avatar: "",
  },
  {
    id: "5",
    nome: "Patricia Lima",
    email: "patricia.lima@escola.com.br",
    telefone: "(11) 99999-5555",
    cpf: "567.890.123-44",
    disciplinas: ["Inglês"],
    turmas: ["5º Ano A", "6º Ano A", "7º Ano B"],
    formacao: "Letras Inglês - USP",
    status: "licenca",
    avatar: "",
  },
  {
    id: "6",
    nome: "Roberto Ferreira",
    email: "roberto.ferreira@escola.com.br",
    telefone: "(11) 99999-6666",
    cpf: "678.901.234-55",
    disciplinas: ["Educação Física"],
    turmas: ["7º Ano B", "8º Ano A", "9º Ano A"],
    formacao: "Ed. Física - UNIFESP",
    status: "ativo",
    avatar: "",
  },
  {
    id: "7",
    nome: "Fernanda Souza",
    email: "fernanda.souza@escola.com.br",
    telefone: "(11) 99999-7777",
    cpf: "789.012.345-66",
    disciplinas: ["Física", "Química"],
    turmas: ["9º Ano A", "1º EM A", "2º EM A"],
    formacao: "Física - UNICAMP",
    status: "ativo",
    avatar: "",
  },
  {
    id: "8",
    nome: "Marcos Almeida",
    email: "marcos.almeida@escola.com.br",
    telefone: "(11) 99999-8888",
    cpf: "890.123.456-77",
    disciplinas: ["Filosofia", "Sociologia"],
    turmas: ["3º EM A", "3º EM B"],
    formacao: "Filosofia - USP",
    status: "ativo",
    avatar: "",
  },
];

const statsCards = [
  { title: "Total de Professores", value: "48", icon: GraduationCap, color: "primary" },
  { title: "Disciplinas", value: "15", icon: BookOpen, color: "info" },
  { title: "Professores Ativos", value: "45", icon: Award, color: "success" },
  { title: "Em Licença", value: "3", icon: GraduationCap, color: "warning" },
];

const disciplinasOptions = [
  "Português", "Matemática", "Ciências", "História", "Geografia", 
  "Inglês", "Educação Física", "Artes", "Biologia", "Física", 
  "Química", "Filosofia", "Sociologia", "Redação"
];

const turmasOptions = [
  "1º Ano A", "1º Ano B", "2º Ano A", "3º Ano A", "4º Ano A",
  "5º Ano A", "6º Ano A", "7º Ano B", "8º Ano A", "9º Ano A",
  "1º EM A", "2º EM A", "3º EM A", "3º EM B"
];

export default function Professores() {
  const [professores, setProfessores] = useState<Professor[]>(initialProfessoresData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    formacao: "",
    disciplinas: [] as string[],
    turmas: [] as string[],
    status: "ativo",
  });

  const filteredProfessores = professores.filter((prof) => {
    const matchesSearch =
      prof.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prof.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prof.disciplinas.some((d) =>
        d.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesStatus = filterStatus === "all" || prof.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      email: "",
      telefone: "",
      cpf: "",
      formacao: "",
      disciplinas: [],
      turmas: [],
      status: "ativo",
    });
    setIsEditing(false);
    setSelectedProfessor(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (professor: Professor) => {
    setFormData({
      nome: professor.nome,
      email: professor.email,
      telefone: professor.telefone,
      cpf: professor.cpf,
      formacao: professor.formacao,
      disciplinas: professor.disciplinas,
      turmas: professor.turmas,
      status: professor.status,
    });
    setSelectedProfessor(professor);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleOpenView = (professor: Professor) => {
    setSelectedProfessor(professor);
    setIsViewDialogOpen(true);
  };

  const handleOpenDelete = (professor: Professor) => {
    setSelectedProfessor(professor);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.nome || !formData.email) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (isEditing && selectedProfessor) {
      setProfessores(professores.map(p => 
        p.id === selectedProfessor.id 
          ? {
              ...p,
              ...formData,
            }
          : p
      ));
      toast.success("Professor atualizado com sucesso!");
    } else {
      const novoProfessor: Professor = {
        id: Date.now().toString(),
        ...formData,
        avatar: "",
      };
      setProfessores([...professores, novoProfessor]);
      toast.success("Professor cadastrado com sucesso!");
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (selectedProfessor) {
      setProfessores(professores.filter(p => p.id !== selectedProfessor.id));
      toast.success("Professor removido com sucesso!");
      setIsDeleteDialogOpen(false);
      setSelectedProfessor(null);
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
          <h1 className="text-3xl font-bold tracking-tight">Professores</h1>
          <p className="text-muted-foreground">
            Gerencie o corpo docente da sua escola
          </p>
        </div>
        <Button className="gap-2" onClick={handleOpenCreate}>
          <Plus className="h-4 w-4" />
          Novo Professor
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
                placeholder="Buscar por nome, e-mail ou disciplina..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="ativo">Ativos</SelectItem>
                  <SelectItem value="licenca">Em Licença</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professors Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProfessores.map((professor) => (
          <Card key={professor.id} className="shadow-card hover:shadow-soft transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20 mb-4">
                  <AvatarImage src={professor.avatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {getInitials(professor.nome)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">{professor.nome}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {professor.formacao}
                </p>
                <Badge
                  variant={professor.status === "ativo" ? "default" : "secondary"}
                  className="mb-4"
                >
                  {professor.status === "ativo" ? "Ativo" : "Em Licença"}
                </Badge>

                <div className="w-full space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{professor.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{professor.telefone}</span>
                  </div>
                </div>

                <div className="w-full mt-4">
                  <p className="text-xs text-muted-foreground mb-2">Disciplinas</p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {professor.disciplinas.map((disc) => (
                      <Badge key={disc} variant="outline" className="text-xs">
                        {disc}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="w-full mt-4">
                  <p className="text-xs text-muted-foreground mb-2">Turmas ({professor.turmas.length})</p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {professor.turmas.slice(0, 3).map((turma) => (
                      <Badge key={turma} variant="secondary" className="text-xs">
                        {turma}
                      </Badge>
                    ))}
                    {professor.turmas.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{professor.turmas.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 mt-4 w-full">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleOpenView(professor)}>
                    <Eye className="h-4 w-4 mr-1" />
                    Ver
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleOpenEdit(professor)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog de Criar/Editar */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Professor" : "Cadastrar Professor"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Atualize os dados do professor" : "Preencha os dados para cadastrar um novo professor"}
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="dados" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="dados">Dados Pessoais</TabsTrigger>
              <TabsTrigger value="academico">Dados Acadêmicos</TabsTrigger>
            </TabsList>
            <TabsContent value="dados" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input 
                    id="nome" 
                    placeholder="Nome do professor" 
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  />
                </div>
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
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail *</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="email@escola.com.br" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input 
                    id="telefone" 
                    placeholder="(11) 99999-9999" 
                    value={formData.telefone}
                    onChange={(e) => setFormData({...formData, telefone: formatPhone(e.target.value)})}
                    maxLength={15}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData({...formData, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="licenca">Em Licença</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
            <TabsContent value="academico" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="formacao">Formação Acadêmica</Label>
                <Input 
                  id="formacao" 
                  placeholder="Ex: Letras - USP" 
                  value={formData.formacao}
                  onChange={(e) => setFormData({...formData, formacao: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Disciplinas</Label>
                <Select 
                  onValueChange={(value) => {
                    if (!formData.disciplinas.includes(value)) {
                      setFormData({...formData, disciplinas: [...formData.disciplinas, value]});
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione as disciplinas" />
                  </SelectTrigger>
                  <SelectContent>
                    {disciplinasOptions.map(disc => (
                      <SelectItem key={disc} value={disc}>{disc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.disciplinas.map((disc) => (
                    <Badge 
                      key={disc} 
                      variant="secondary" 
                      className="cursor-pointer"
                      onClick={() => setFormData({
                        ...formData, 
                        disciplinas: formData.disciplinas.filter(d => d !== disc)
                      })}
                    >
                      {disc} ×
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Turmas</Label>
                <Select 
                  onValueChange={(value) => {
                    if (!formData.turmas.includes(value)) {
                      setFormData({...formData, turmas: [...formData.turmas, value]});
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione as turmas" />
                  </SelectTrigger>
                  <SelectContent>
                    {turmasOptions.map(turma => (
                      <SelectItem key={turma} value={turma}>{turma}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.turmas.map((turma) => (
                    <Badge 
                      key={turma} 
                      variant="secondary" 
                      className="cursor-pointer"
                      onClick={() => setFormData({
                        ...formData, 
                        turmas: formData.turmas.filter(t => t !== turma)
                      })}
                    >
                      {turma} ×
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => {setIsDialogOpen(false); resetForm();}}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {isEditing ? "Salvar Alterações" : "Cadastrar Professor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Visualizar */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Professor</DialogTitle>
          </DialogHeader>
          {selectedProfessor && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {getInitials(selectedProfessor.nome)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{selectedProfessor.nome}</h3>
                  <p className="text-muted-foreground">{selectedProfessor.formacao}</p>
                  <Badge variant={selectedProfessor.status === "ativo" ? "default" : "secondary"}>
                    {selectedProfessor.status === "ativo" ? "Ativo" : "Em Licença"}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">E-mail</Label>
                  <p className="font-medium">{selectedProfessor.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Telefone</Label>
                  <p className="font-medium">{selectedProfessor.telefone}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">CPF</Label>
                <p className="font-medium">{selectedProfessor.cpf}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Disciplinas</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedProfessor.disciplinas.map((disc) => (
                    <Badge key={disc} variant="outline">{disc}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Turmas</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedProfessor.turmas.map((turma) => (
                    <Badge key={turma} variant="secondary">{turma}</Badge>
                  ))}
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
              if (selectedProfessor) handleOpenEdit(selectedProfessor);
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
              Tem certeza que deseja remover o professor "{selectedProfessor?.nome}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

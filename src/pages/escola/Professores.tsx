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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const professoresData = [
  {
    id: "1",
    nome: "Maria Silva",
    email: "maria.silva@escola.com.br",
    telefone: "(11) 99999-1111",
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

export default function Professores() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredProfessores = professoresData.filter((prof) => {
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Professor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Cadastrar Professor</DialogTitle>
              <DialogDescription>
                Preencha os dados para cadastrar um novo professor
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
                    <Label htmlFor="nome">Nome Completo</Label>
                    <Input id="nome" placeholder="Nome do professor" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input id="cpf" placeholder="000.000.000-00" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" placeholder="email@escola.com.br" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input id="telefone" placeholder="(11) 99999-9999" />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="academico" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="formacao">Formação Acadêmica</Label>
                  <Input id="formacao" placeholder="Ex: Letras - USP" />
                </div>
                <div className="space-y-2">
                  <Label>Disciplinas</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione as disciplinas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="portugues">Português</SelectItem>
                      <SelectItem value="matematica">Matemática</SelectItem>
                      <SelectItem value="ciencias">Ciências</SelectItem>
                      <SelectItem value="historia">História</SelectItem>
                      <SelectItem value="geografia">Geografia</SelectItem>
                      <SelectItem value="ingles">Inglês</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Turmas</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione as turmas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1a">1º Ano A</SelectItem>
                      <SelectItem value="1b">1º Ano B</SelectItem>
                      <SelectItem value="2a">2º Ano A</SelectItem>
                      <SelectItem value="3a">3º Ano A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
            </Tabs>
            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>
                Cadastrar Professor
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-1" />
                    Ver
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

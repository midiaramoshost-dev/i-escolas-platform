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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const alunosData = [
  {
    id: "1",
    matricula: "2024001",
    nome: "Ana Beatriz Silva",
    turma: "5º Ano A",
    serie: "5º Ano",
    turno: "Manhã",
    responsavel: "Maria Silva",
    telefone: "(11) 98888-1111",
    email: "maria.silva@email.com",
    frequencia: 96,
    media: 8.5,
    status: "regular",
  },
  {
    id: "2",
    matricula: "2024002",
    nome: "Bruno Costa Santos",
    turma: "5º Ano A",
    serie: "5º Ano",
    turno: "Manhã",
    responsavel: "Carlos Santos",
    telefone: "(11) 98888-2222",
    email: "carlos.santos@email.com",
    frequencia: 88,
    media: 7.2,
    status: "alerta",
  },
  {
    id: "3",
    matricula: "2024003",
    nome: "Carolina Mendes",
    turma: "7º Ano B",
    serie: "7º Ano",
    turno: "Tarde",
    responsavel: "Paula Mendes",
    telefone: "(11) 98888-3333",
    email: "paula.mendes@email.com",
    frequencia: 94,
    media: 9.1,
    status: "regular",
  },
  {
    id: "4",
    matricula: "2024004",
    nome: "Daniel Oliveira",
    turma: "9º Ano A",
    serie: "9º Ano",
    turno: "Manhã",
    responsavel: "Roberto Oliveira",
    telefone: "(11) 98888-4444",
    email: "roberto.oliveira@email.com",
    frequencia: 72,
    media: 5.8,
    status: "critico",
  },
  {
    id: "5",
    matricula: "2024005",
    nome: "Eduarda Lima",
    turma: "3º Ano A",
    serie: "3º Ano",
    turno: "Manhã",
    responsavel: "Fernanda Lima",
    telefone: "(11) 98888-5555",
    email: "fernanda.lima@email.com",
    frequencia: 98,
    media: 8.9,
    status: "regular",
  },
  {
    id: "6",
    matricula: "2024006",
    nome: "Felipe Almeida",
    turma: "1º Ano A",
    serie: "1º Ano",
    turno: "Manhã",
    responsavel: "Juliana Almeida",
    telefone: "(11) 98888-6666",
    email: "juliana.almeida@email.com",
    frequencia: 95,
    media: 8.0,
    status: "regular",
  },
  {
    id: "7",
    matricula: "2024007",
    nome: "Gabriela Ferreira",
    turma: "3º EM A",
    serie: "3º Médio",
    turno: "Manhã",
    responsavel: "Marcos Ferreira",
    telefone: "(11) 98888-7777",
    email: "marcos.ferreira@email.com",
    frequencia: 91,
    media: 7.8,
    status: "regular",
  },
  {
    id: "8",
    matricula: "2024008",
    nome: "Henrique Souza",
    turma: "7º Ano B",
    serie: "7º Ano",
    turno: "Tarde",
    responsavel: "Luciana Souza",
    telefone: "(11) 98888-8888",
    email: "luciana.souza@email.com",
    frequencia: 85,
    media: 6.5,
    status: "alerta",
  },
];

const statsCards = [
  { title: "Total de Alunos", value: "1.247", icon: Users, color: "primary" },
  { title: "Frequência Regular", value: "1.180", icon: UserCheck, color: "success" },
  { title: "Em Alerta", value: "52", icon: AlertTriangle, color: "warning" },
  { title: "Situação Crítica", value: "15", icon: AlertTriangle, color: "destructive" },
];

export default function Alunos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTurma, setFilterTurma] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredAlunos = alunosData.filter((aluno) => {
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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Aluno
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Matricular Aluno</DialogTitle>
                <DialogDescription>
                  Preencha os dados para realizar a matrícula
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
                      <Label htmlFor="nome">Nome Completo</Label>
                      <Input id="nome" placeholder="Nome do aluno" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nascimento">Data de Nascimento</Label>
                      <Input id="nascimento" type="date" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF</Label>
                      <Input id="cpf" placeholder="000.000.000-00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rg">RG</Label>
                      <Input id="rg" placeholder="00.000.000-0" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endereco">Endereço Completo</Label>
                    <Input id="endereco" placeholder="Rua, número, bairro, cidade" />
                  </div>
                </TabsContent>
                <TabsContent value="responsavel" className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="resp-nome">Nome do Responsável</Label>
                      <Input id="resp-nome" placeholder="Nome completo" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="parentesco">Parentesco</Label>
                      <Select>
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
                      <Input id="resp-email" type="email" placeholder="email@exemplo.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="resp-telefone">Telefone</Label>
                      <Input id="resp-telefone" placeholder="(11) 99999-9999" />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="academico" className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Série</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1ano">1º Ano</SelectItem>
                          <SelectItem value="2ano">2º Ano</SelectItem>
                          <SelectItem value="3ano">3º Ano</SelectItem>
                          <SelectItem value="4ano">4º Ano</SelectItem>
                          <SelectItem value="5ano">5º Ano</SelectItem>
                          <SelectItem value="6ano">6º Ano</SelectItem>
                          <SelectItem value="7ano">7º Ano</SelectItem>
                          <SelectItem value="8ano">8º Ano</SelectItem>
                          <SelectItem value="9ano">9º Ano</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Turma</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="a">Turma A</SelectItem>
                          <SelectItem value="b">Turma B</SelectItem>
                          <SelectItem value="c">Turma C</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Turno</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manha">Manhã</SelectItem>
                        <SelectItem value="tarde">Tarde</SelectItem>
                        <SelectItem value="integral">Integral</SelectItem>
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
                  Matricular Aluno
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
                  <SelectItem value="1º Ano A">1º Ano A</SelectItem>
                  <SelectItem value="3º Ano A">3º Ano A</SelectItem>
                  <SelectItem value="5º Ano A">5º Ano A</SelectItem>
                  <SelectItem value="7º Ano B">7º Ano B</SelectItem>
                  <SelectItem value="9º Ano A">9º Ano A</SelectItem>
                  <SelectItem value="3º EM A">3º EM A</SelectItem>
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
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Perfil
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Contatar Responsável
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
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
    </div>
  );
}

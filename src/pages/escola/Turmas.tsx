import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const turmasData = [
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

export default function Turmas() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSerie, setFilterSerie] = useState("all");
  const [filterTurno, setFilterTurno] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredTurmas = turmasData.filter((turma) => {
    const matchesSearch =
      turma.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      turma.professor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSerie = filterSerie === "all" || turma.serie === filterSerie;
    const matchesTurno = filterTurno === "all" || turma.turno === filterTurno;
    return matchesSearch && matchesSerie && matchesTurno;
  });

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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Turma
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Criar Nova Turma</DialogTitle>
              <DialogDescription>
                Preencha os dados para criar uma nova turma
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome da Turma</Label>
                  <Input id="nome" placeholder="Ex: 1º Ano A" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serie">Série</Label>
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
                      <SelectItem value="1medio">1º Médio</SelectItem>
                      <SelectItem value="2medio">2º Médio</SelectItem>
                      <SelectItem value="3medio">3º Médio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="turno">Turno</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manha">Manhã</SelectItem>
                      <SelectItem value="tarde">Tarde</SelectItem>
                      <SelectItem value="noite">Noite</SelectItem>
                      <SelectItem value="integral">Integral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sala">Sala</Label>
                  <Input id="sala" placeholder="Ex: Sala 101" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacidade">Capacidade</Label>
                  <Input id="capacidade" type="number" placeholder="30" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="professor">Professor Responsável</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maria">Maria Silva</SelectItem>
                      <SelectItem value="joao">João Santos</SelectItem>
                      <SelectItem value="ana">Ana Costa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>
                Criar Turma
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
                  <SelectItem value="1º Ano">1º Ano</SelectItem>
                  <SelectItem value="2º Ano">2º Ano</SelectItem>
                  <SelectItem value="3º Ano">3º Ano</SelectItem>
                  <SelectItem value="5º Ano">5º Ano</SelectItem>
                  <SelectItem value="7º Ano">7º Ano</SelectItem>
                  <SelectItem value="9º Ano">9º Ano</SelectItem>
                  <SelectItem value="3º Médio">3º Médio</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterTurno} onValueChange={setFilterTurno}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Turno" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Manhã">Manhã</SelectItem>
                  <SelectItem value="Tarde">Tarde</SelectItem>
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
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
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
    </div>
  );
}

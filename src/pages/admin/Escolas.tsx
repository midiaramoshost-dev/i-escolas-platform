import { motion } from "framer-motion";
import {
  Building2,
  Plus,
  Search,
  MoreVertical,
  MapPin,
  Users,
  GraduationCap,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useState } from "react";
import { EditarEscolaDialog, Escola } from "@/components/admin/EditarEscolaDialog";
import { DetalhesEscolaDialog } from "@/components/admin/DetalhesEscolaDialog";
import { CadastrarEscolaDialog } from "@/components/admin/CadastrarEscolaDialog";
import { toast } from "sonner";

const escolasIniciais: Escola[] = [
  { id: "1", nome: "Colégio São Paulo", cnpj: "12.345.678/0001-90", cidade: "São Paulo", uf: "SP", porte: "Grande", plano: "Premium", alunos: 1250, professores: 85, status: "ativo", datacadastro: "2023-01-15" },
  { id: "2", nome: "Escola Municipal Centro", cnpj: "23.456.789/0001-01", cidade: "Rio de Janeiro", uf: "RJ", porte: "Grande", plano: "Pro", alunos: 850, professores: 52, status: "ativo", datacadastro: "2023-03-20" },
  { id: "3", nome: "Instituto Educacional ABC", cnpj: "34.567.890/0001-12", cidade: "Belo Horizonte", uf: "MG", porte: "Médio", plano: "Start", alunos: 420, professores: 28, status: "trial", datacadastro: "2024-01-10" },
  { id: "4", nome: "Colégio Novo Horizonte", cnpj: "45.678.901/0001-23", cidade: "Curitiba", uf: "PR", porte: "Grande", plano: "Premium", alunos: 980, professores: 65, status: "ativo", datacadastro: "2023-06-05" },
  { id: "5", nome: "Escola Estadual Central", cnpj: "56.789.012/0001-34", cidade: "Salvador", uf: "BA", porte: "Médio", plano: "Free", alunos: 320, professores: 22, status: "ativo", datacadastro: "2023-09-12" },
  { id: "6", nome: "Colégio Esperança", cnpj: "67.890.123/0001-45", cidade: "Fortaleza", uf: "CE", porte: "Pequeno", plano: "Start", alunos: 180, professores: 15, status: "inativo", datacadastro: "2023-04-18" },
  { id: "7", nome: "Instituto Federal Norte", cnpj: "78.901.234/0001-56", cidade: "Manaus", uf: "AM", porte: "Grande", plano: "Pro", alunos: 720, professores: 48, status: "ativo", datacadastro: "2023-07-22" },
  { id: "8", nome: "Escola Técnica Sul", cnpj: "89.012.345/0001-67", cidade: "Porto Alegre", uf: "RS", porte: "Médio", plano: "Pro", alunos: 560, professores: 38, status: "ativo", datacadastro: "2023-11-30" },
];

const getPlanoColor = (plano: string) => {
  switch (plano.toLowerCase()) {
    case "premium": return "bg-rose-500/10 text-rose-500";
    case "pro": return "bg-purple-500/10 text-purple-500";
    case "start": return "bg-blue-500/10 text-blue-500";
    default: return "bg-gray-500/10 text-gray-500";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "ativo": return "bg-green-500/10 text-green-500";
    case "trial": return "bg-yellow-500/10 text-yellow-500";
    case "inativo": return "bg-red-500/10 text-red-500";
    default: return "bg-gray-500/10 text-gray-500";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "ativo": return <CheckCircle className="h-4 w-4" />;
    case "trial": return <Clock className="h-4 w-4" />;
    case "inativo": return <XCircle className="h-4 w-4" />;
    default: return null;
  }
};

export default function AdminEscolas() {
  const [escolas, setEscolas] = useState<Escola[]>(escolasIniciais);
  const [busca, setBusca] = useState("");
  const [filtroPlano, setFiltroPlano] = useState("todos");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detalhesDialogOpen, setDetalhesDialogOpen] = useState(false);
  const [escolaSelecionada, setEscolaSelecionada] = useState<Escola | null>(null);

  const handleVerDetalhes = (escola: Escola) => {
    setEscolaSelecionada(escola);
    setDetalhesDialogOpen(true);
  };

  const handleEditEscola = (escola: Escola) => {
    setEscolaSelecionada(escola);
    setEditDialogOpen(true);
  };

  const handleSaveEscola = (escolaAtualizada: Escola) => {
    setEscolas(escolas.map(e => e.id === escolaAtualizada.id ? escolaAtualizada : e));
  };

  const handleAddEscola = (novaEscola: Escola) => {
    setEscolas([novaEscola, ...escolas]);
  };

  const handleDesativarEscola = (escola: Escola) => {
    const novoStatus = escola.status === "inativo" ? "ativo" : "inativo";
    setEscolas(escolas.map(e => e.id === escola.id ? { ...e, status: novoStatus } : e));
    toast.success(`Escola ${novoStatus === "inativo" ? "desativada" : "ativada"} com sucesso!`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const escolasFiltradas = escolas.filter((escola) => {
    const matchBusca = escola.nome.toLowerCase().includes(busca.toLowerCase()) ||
                       escola.cidade.toLowerCase().includes(busca.toLowerCase());
    const matchPlano = filtroPlano === "todos" || escola.plano.toLowerCase() === filtroPlano.toLowerCase();
    const matchStatus = filtroStatus === "todos" || escola.status === filtroStatus;
    return matchBusca && matchPlano && matchStatus;
  });

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestão de Escolas</h1>
          <p className="text-muted-foreground">
            Cadastre e gerencie escolas na plataforma
          </p>
        </div>
        <Button className="bg-rose-500 hover:bg-rose-600" onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Escola
        </Button>

        <CadastrarEscolaDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSave={handleAddEscola}
        />
      </motion.div>

      {/* Resumo */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-3xl font-bold">{escolas.length}</p>
              </div>
              <div className="rounded-full p-3 bg-rose-500/10">
                <Building2 className="h-6 w-6 text-rose-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ativos</p>
                <p className="text-3xl font-bold text-green-500">{escolas.filter(e => e.status === "ativo").length}</p>
              </div>
              <div className="rounded-full p-3 bg-green-500/10">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Em Trial</p>
                <p className="text-3xl font-bold text-yellow-500">{escolas.filter(e => e.status === "trial").length}</p>
              </div>
              <div className="rounded-full p-3 bg-yellow-500/10">
                <Clock className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Inativos</p>
                <p className="text-3xl font-bold text-red-500">{escolas.filter(e => e.status === "inativo").length}</p>
              </div>
              <div className="rounded-full p-3 bg-red-500/10">
                <XCircle className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filtros */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou cidade..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filtroPlano} onValueChange={setFiltroPlano}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Plano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos Planos</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="start">Start</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos Status</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="trial">Trial</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabela */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Escola</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead className="text-center">Alunos</TableHead>
                  <TableHead className="text-center">Professores</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {escolasFiltradas.map((escola) => (
                  <TableRow key={escola.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{escola.nome}</p>
                        <p className="text-xs text-muted-foreground">{escola.cnpj}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span className="text-sm">{escola.cidade} - {escola.uf}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPlanoColor(escola.plano)}>{escola.plano}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        <span>{escola.alunos.toLocaleString()}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{escola.professores}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(escola.status)} flex items-center gap-1 w-fit`}>
                        {getStatusIcon(escola.status)}
                        {escola.status === "ativo" ? "Ativo" : escola.status === "trial" ? "Trial" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-background border shadow-lg z-50">
                          <DropdownMenuItem 
                            className="cursor-pointer"
                            onClick={() => handleVerDetalhes(escola)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="cursor-pointer"
                            onClick={() => handleEditEscola(escola)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-500 cursor-pointer"
                            onClick={() => handleDesativarEscola(escola)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {escola.status === "inativo" ? "Ativar" : "Desativar"}
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
      </motion.div>

      {/* Dialog de Detalhes */}
      <DetalhesEscolaDialog
        escola={escolaSelecionada}
        open={detalhesDialogOpen}
        onOpenChange={setDetalhesDialogOpen}
      />

      {/* Dialog de Edição */}
      <EditarEscolaDialog
        escola={escolaSelecionada}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveEscola}
      />
    </motion.div>
  );
}

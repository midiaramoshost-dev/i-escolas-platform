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
  Link2,
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
import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { EditarEscolaDialog, Escola } from "@/components/admin/EditarEscolaDialog";
import { DetalhesEscolaDialog } from "@/components/admin/DetalhesEscolaDialog";
import { CadastrarEscolaDialog } from "@/components/admin/CadastrarEscolaDialog";
import { toast } from "sonner";
import { useActivityLog } from "@/contexts/ActivityLogContext";
import { supabase } from "@/integrations/supabase/client";

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
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [escolas, setEscolas] = useState<Escola[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [filtroPlano, setFiltroPlano] = useState("todos");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detalhesDialogOpen, setDetalhesDialogOpen] = useState(false);
  const [escolaSelecionada, setEscolaSelecionada] = useState<Escola | null>(null);
  const [abaInicial, setAbaInicial] = useState<string | undefined>();
  const { registrarAtividade } = useActivityLog();

  const fetchEscolas = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("escolas")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao carregar escolas:", error);
      toast.error("Erro ao carregar escolas");
    } else {
      setEscolas(
        (data || []).map((e: any) => ({
          id: e.id,
          nome: e.nome,
          cnpj: e.cnpj,
          cidade: e.cidade,
          uf: e.uf,
          porte: e.porte,
          plano: e.plano,
          alunos: e.alunos,
          professores: e.professores,
          status: e.status,
          datacadastro: e.datacadastro,
          linkAcesso: e.link_acesso,
          modulos: e.modulos || [],
          emailDiretor: e.email_diretor,
        }))
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEscolas();
  }, [fetchEscolas]);

  // Processar parâmetros da URL para abrir dialog de edição
  useEffect(() => {
    const editarId = searchParams.get("editar");
    const aba = searchParams.get("aba");
    
    if (editarId) {
      const escola = escolas.find(e => e.id === editarId);
      if (escola) {
        setEscolaSelecionada(escola);
        setAbaInicial(aba || undefined);
        setEditDialogOpen(true);
        setSearchParams({});
      }
    }
  }, [searchParams, escolas, setSearchParams]);

  const handleVerDetalhes = (escola: Escola) => {
    setEscolaSelecionada(escola);
    setDetalhesDialogOpen(true);
  };

  const handleEditEscola = (escola: Escola) => {
    setEscolaSelecionada(escola);
    setEditDialogOpen(true);
  };

  const handleSaveEscola = async (escolaAtualizada: Escola) => {
    const { error } = await supabase
      .from("escolas")
      .update({
        nome: escolaAtualizada.nome,
        cnpj: escolaAtualizada.cnpj,
        cidade: escolaAtualizada.cidade,
        uf: escolaAtualizada.uf,
        porte: escolaAtualizada.porte,
        plano: escolaAtualizada.plano,
        alunos: escolaAtualizada.alunos,
        professores: escolaAtualizada.professores,
        status: escolaAtualizada.status,
        modulos: escolaAtualizada.modulos || [],
        email_diretor: escolaAtualizada.emailDiretor,
        link_acesso: escolaAtualizada.linkAcesso,
      })
      .eq("id", escolaAtualizada.id);

    if (error) {
      console.error("Erro ao atualizar escola:", error);
      toast.error("Erro ao salvar alterações");
      return;
    }

    await fetchEscolas();
    registrarAtividade(
      "escola_editada",
      `Escola "${escolaAtualizada.nome}" foi editada`,
      `Plano: ${escolaAtualizada.plano}, Cidade: ${escolaAtualizada.cidade}`,
      "Escola",
      escolaAtualizada.id
    );
  };

  const handleAddEscola = async (novaEscola: Escola) => {
    const { error } = await supabase.from("escolas").insert({
      id: novaEscola.id,
      nome: novaEscola.nome,
      cnpj: novaEscola.cnpj,
      cidade: novaEscola.cidade,
      uf: novaEscola.uf,
      porte: novaEscola.porte,
      plano: novaEscola.plano,
      alunos: novaEscola.alunos,
      professores: novaEscola.professores,
      status: novaEscola.status,
      datacadastro: novaEscola.datacadastro,
      link_acesso: novaEscola.linkAcesso,
      modulos: novaEscola.modulos || [],
      email_diretor: novaEscola.emailDiretor,
      user_id: novaEscola.id, // userId from edge function
    });

    if (error) {
      console.error("Erro ao salvar escola:", error);
      toast.error("Erro ao salvar escola no banco de dados");
      return;
    }

    await fetchEscolas();
    registrarAtividade(
      "escola_criada",
      `Nova escola "${novaEscola.nome}" foi cadastrada`,
      `Plano: ${novaEscola.plano}, Cidade: ${novaEscola.cidade}`,
      "Escola",
      novaEscola.id
    );
  };

  const handleDesativarEscola = async (escola: Escola) => {
    const novoStatus = escola.status === "inativo" ? "ativo" : "inativo";
    const { error } = await supabase
      .from("escolas")
      .update({ status: novoStatus })
      .eq("id", escola.id);

    if (error) {
      console.error("Erro ao alterar status:", error);
      toast.error("Erro ao alterar status da escola");
      return;
    }

    await fetchEscolas();
    toast.success(`Escola ${novoStatus === "inativo" ? "desativada" : "ativada"} com sucesso!`);
    registrarAtividade(
      novoStatus === "ativo" ? "escola_ativada" : "escola_desativada",
      `Escola "${escola.nome}" foi ${novoStatus === "ativo" ? "ativada" : "desativada"}`,
      `Status anterior: ${escola.status}`,
      "Escola",
      escola.id
    );
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
                            className="cursor-pointer"
                            onClick={() => {
                              if (escola.linkAcesso) {
                                navigator.clipboard.writeText(escola.linkAcesso);
                                toast.success("Link de acesso copiado!");
                              }
                            }}
                          >
                            <Link2 className="mr-2 h-4 w-4" />
                            Copiar Link de Acesso
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
        onOpenChange={(open) => {
          setEditDialogOpen(open);
          if (!open) setAbaInicial(undefined);
        }}
        onSave={handleSaveEscola}
        destacarPlano={abaInicial === "plano"}
      />
    </motion.div>
  );
}

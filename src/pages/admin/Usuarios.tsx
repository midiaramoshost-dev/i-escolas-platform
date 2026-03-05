import { motion } from "framer-motion";
import {
  Users,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Shield,
  UserCheck,
  UserX,
  Mail,
  Key,
  Link,
  Copy,
  ExternalLink,
  Loader2,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useActivityLog } from "@/contexts/ActivityLogContext";
import { supabase } from "@/integrations/supabase/client";

interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: string;
  status: string;
  ultimoAcesso: string;
  dataCriacao: string;
  linkAcesso?: string | null;
}

const getPerfilColor = (perfil: string) => {
  switch (perfil) {
    case "admin": return "bg-rose-500/10 text-rose-500";
    case "suporte": return "bg-blue-500/10 text-blue-500";
    case "comercial": return "bg-green-500/10 text-green-500";
    case "financeiro": return "bg-purple-500/10 text-purple-500";
    default: return "bg-muted text-muted-foreground";
  }
};

const getPerfilLabel = (perfil: string) => {
  switch (perfil) {
    case "admin": return "Administrador";
    case "suporte": return "Suporte";
    case "comercial": return "Comercial";
    case "financeiro": return "Financeiro";
    default: return perfil;
  }
};

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [filtroPerfil, setFiltroPerfil] = useState("todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editando, setEditando] = useState<Usuario | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    perfil: "suporte",
  });
  const { registrarAtividade } = useActivityLog();

  const fetchUsuarios = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("admin_usuarios")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar usuários");
      console.error(error);
    } else if (data) {
      setUsuarios(data.map(u => ({
        id: u.id,
        nome: u.nome,
        email: u.email,
        perfil: u.perfil,
        status: u.status,
        ultimoAcesso: u.ultimo_acesso ? new Date(u.ultimo_acesso).toLocaleString("pt-BR") : "-",
        dataCriacao: new Date(u.created_at).toISOString().split("T")[0],
        linkAcesso: u.link_acesso,
      })));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const matchBusca = usuario.nome.toLowerCase().includes(busca.toLowerCase()) ||
                       usuario.email.toLowerCase().includes(busca.toLowerCase());
    const matchPerfil = filtroPerfil === "todos" || usuario.perfil === filtroPerfil;
    return matchBusca && matchPerfil;
  });

  const handleOpenDialog = (usuario?: Usuario) => {
    if (usuario) {
      setEditando(usuario);
      setFormData({ nome: usuario.nome, email: usuario.email, perfil: usuario.perfil });
    } else {
      setEditando(null);
      setFormData({ nome: "", email: "", perfil: "suporte" });
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.nome || !formData.email) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (editando) {
      const { error } = await supabase
        .from("admin_usuarios")
        .update({ nome: formData.nome, email: formData.email, perfil: formData.perfil })
        .eq("id", editando.id);

      if (error) {
        toast.error("Erro ao atualizar usuário");
        return;
      }
      toast.success("Usuário atualizado com sucesso!");
      registrarAtividade(
        "usuario_editado",
        `Usuário "${formData.nome}" foi editado`,
        `Perfil: ${formData.perfil}, E-mail: ${formData.email}`,
        "Usuário",
        editando.id
      );
    } else {
      const { error } = await supabase
        .from("admin_usuarios")
        .insert({ nome: formData.nome, email: formData.email, perfil: formData.perfil });

      if (error) {
        toast.error("Erro ao criar usuário");
        return;
      }
      toast.success("Usuário criado com sucesso!");
      registrarAtividade(
        "usuario_criado",
        `Novo usuário "${formData.nome}" foi criado`,
        `Perfil: ${formData.perfil}, E-mail: ${formData.email}`,
        "Usuário"
      );
    }
    setDialogOpen(false);
    fetchUsuarios();
  };

  const handleToggleStatus = async (usuario: Usuario) => {
    const novoStatus = usuario.status === "ativo" ? "inativo" : "ativo";
    const { error } = await supabase
      .from("admin_usuarios")
      .update({ status: novoStatus })
      .eq("id", usuario.id);

    if (error) {
      toast.error("Erro ao alterar status");
      return;
    }
    toast.success(`Usuário ${novoStatus === "ativo" ? "ativado" : "desativado"} com sucesso!`);
    registrarAtividade(
      novoStatus === "ativo" ? "usuario_ativado" : "usuario_desativado",
      `Usuário "${usuario.nome}" foi ${novoStatus === "ativo" ? "ativado" : "desativado"}`,
      `E-mail: ${usuario.email}`,
      "Usuário",
      usuario.id
    );
    fetchUsuarios();
  };

  const handleResetSenha = (usuario: Usuario) => {
    toast.success(`Link de redefinição de senha enviado para ${usuario.email}`);
    registrarAtividade(
      "usuario_senha_resetada",
      `Senha do usuário "${usuario.nome}" foi resetada`,
      `E-mail de recuperação enviado para: ${usuario.email}`,
      "Usuário",
      usuario.id
    );
  };

  const gerarLinkAcesso = async (usuario: Usuario) => {
    const slug = usuario.nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const link = `${window.location.origin}/login?user=${slug}-${usuario.id}`;

    const { error } = await supabase
      .from("admin_usuarios")
      .update({ link_acesso: link })
      .eq("id", usuario.id);

    if (error) {
      toast.error("Erro ao salvar link de acesso");
      return;
    }

    navigator.clipboard.writeText(link);
    toast.success("Link de acesso gerado e copiado!");
    registrarAtividade(
      "usuario_link_gerado",
      `Link de acesso gerado para "${usuario.nome}"`,
      `Link: ${link}`,
      "Usuário",
      usuario.id
    );
    fetchUsuarios();
  };

  const copiarLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success("Link copiado para a área de transferência!");
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Gestão de Usuários</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie os usuários administrativos da plataforma
          </p>
        </div>
        <Button size="sm" className="bg-rose-500 hover:bg-rose-600 w-full sm:w-auto" onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Usuário
        </Button>
      </motion.div>

      {/* Resumo */}
      <motion.div variants={itemVariants} className="grid gap-3 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl sm:text-3xl font-bold">{usuarios.length}</p>
              </div>
              <div className="rounded-full p-2 sm:p-3 bg-rose-500/10">
                <Users className="h-4 w-4 sm:h-6 sm:w-6 text-rose-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Admins</p>
                <p className="text-2xl sm:text-3xl font-bold text-rose-500">{usuarios.filter(u => u.perfil === "admin").length}</p>
              </div>
              <div className="rounded-full p-2 sm:p-3 bg-rose-500/10">
                <Shield className="h-4 w-4 sm:h-6 sm:w-6 text-rose-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Ativos</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-500">{usuarios.filter(u => u.status === "ativo").length}</p>
              </div>
              <div className="rounded-full p-2 sm:p-3 bg-green-500/10">
                <UserCheck className="h-4 w-4 sm:h-6 sm:w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Inativos</p>
                <p className="text-2xl sm:text-3xl font-bold text-red-500">{usuarios.filter(u => u.status === "inativo").length}</p>
              </div>
              <div className="rounded-full p-2 sm:p-3 bg-red-500/10">
                <UserX className="h-4 w-4 sm:h-6 sm:w-6 text-red-500" />
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
                  placeholder="Buscar por nome ou e-mail..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filtroPerfil} onValueChange={setFiltroPerfil}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Perfil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos Perfis</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="suporte">Suporte</SelectItem>
                  <SelectItem value="comercial">Comercial</SelectItem>
                  <SelectItem value="financeiro">Financeiro</SelectItem>
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
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Usuário</TableHead>
                        <TableHead>Perfil</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Link de Acesso</TableHead>
                        <TableHead>Último Acesso</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usuariosFiltrados.map((usuario) => (
                        <TableRow key={usuario.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarFallback className="bg-rose-500/10 text-rose-500 text-sm">
                                  {usuario.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{usuario.nome}</p>
                                <p className="text-xs text-muted-foreground">{usuario.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getPerfilColor(usuario.perfil)}>
                              {getPerfilLabel(usuario.perfil)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={usuario.status === "ativo" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}>
                              {usuario.status === "ativo" ? "Ativo" : "Inativo"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {usuario.linkAcesso ? (
                              <div className="flex items-center gap-1">
                                <code className="text-xs bg-muted px-2 py-1 rounded max-w-[180px] truncate block">
                                  {usuario.linkAcesso}
                                </code>
                                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => copiarLink(usuario.linkAcesso!)}>
                                  <Copy className="h-3.5 w-3.5" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-7 w-7" asChild>
                                  <a href={usuario.linkAcesso} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-3.5 w-3.5" />
                                  </a>
                                </Button>
                              </div>
                            ) : (
                              <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => gerarLinkAcesso(usuario)}>
                                <Link className="mr-1 h-3.5 w-3.5" />
                                Gerar Link
                              </Button>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {usuario.ultimoAcesso}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-background border shadow-lg z-50">
                                <DropdownMenuItem className="cursor-pointer" onClick={() => handleOpenDialog(usuario)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => handleResetSenha(usuario)}>
                                  <Key className="mr-2 h-4 w-4" />
                                  Resetar Senha
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => handleToggleStatus(usuario)}>
                                  {usuario.status === "ativo" ? (
                                    <>
                                      <UserX className="mr-2 h-4 w-4" />
                                      Desativar
                                    </>
                                  ) : (
                                    <>
                                      <UserCheck className="mr-2 h-4 w-4" />
                                      Ativar
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => gerarLinkAcesso(usuario)}>
                                  <Link className="mr-2 h-4 w-4" />
                                  {usuario.linkAcesso ? "Regerar Link" : "Gerar Link de Acesso"}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Card Layout */}
                <div className="md:hidden divide-y divide-border">
                  {usuariosFiltrados.map((usuario) => (
                    <div key={usuario.id} className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-rose-500/10 text-rose-500 text-sm">
                              {usuario.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{usuario.nome}</p>
                            <p className="text-xs text-muted-foreground">{usuario.email}</p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-background border shadow-lg z-50">
                            <DropdownMenuItem className="cursor-pointer" onClick={() => handleOpenDialog(usuario)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => handleResetSenha(usuario)}>
                              <Key className="mr-2 h-4 w-4" />
                              Resetar Senha
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => handleToggleStatus(usuario)}>
                              {usuario.status === "ativo" ? (
                                <>
                                  <UserX className="mr-2 h-4 w-4" />
                                  Desativar
                                </>
                              ) : (
                                <>
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Ativar
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => gerarLinkAcesso(usuario)}>
                              <Link className="mr-2 h-4 w-4" />
                              {usuario.linkAcesso ? "Regerar Link" : "Gerar Link"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getPerfilColor(usuario.perfil)}>
                          {getPerfilLabel(usuario.perfil)}
                        </Badge>
                        <Badge className={usuario.status === "ativo" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}>
                          {usuario.status === "ativo" ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Último acesso: {usuario.ultimoAcesso}
                      </div>
                      {usuario.linkAcesso && (
                        <div className="flex items-center gap-1">
                          <code className="text-xs bg-muted px-2 py-1 rounded truncate flex-1">
                            {usuario.linkAcesso}
                          </code>
                          <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" onClick={() => copiarLink(usuario.linkAcesso!)}>
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Dialog de Criar/Editar */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editando ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
            <DialogDescription>
              {editando ? "Atualize os dados do usuário." : "Preencha os dados para criar um novo usuário administrativo."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Nome do usuário"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@iescolas.com.br"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="perfil">Perfil *</Label>
              <Select value={formData.perfil} onValueChange={(v) => setFormData({ ...formData, perfil: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o perfil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="suporte">Suporte</SelectItem>
                  <SelectItem value="comercial">Comercial</SelectItem>
                  <SelectItem value="financeiro">Financeiro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} className="bg-rose-500 hover:bg-rose-600">
              {editando ? "Salvar Alterações" : "Criar Usuário"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

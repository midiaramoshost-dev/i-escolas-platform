import { motion } from "framer-motion";
import {
  ClipboardList,
  Search,
  Calendar,
  User,
  Building2,
  Settings,
  Layers,
  Users,
  Trash2,
  Download,
  Filter,
  Clock,
  Shield,
  ArrowUpRight,
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit,
  Plus,
  Key,
  LogIn,
  LogOut,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useActivityLog, ActivityType, ActivityLog } from "@/contexts/ActivityLogContext";
import { cn } from "@/lib/utils";

const tipoAtividadeInfo: Record<ActivityType, { label: string; icon: React.ElementType; cor: string }> = {
  escola_criada: { label: "Escola Criada", icon: Plus, cor: "text-green-500 bg-green-500/10" },
  escola_editada: { label: "Escola Editada", icon: Edit, cor: "text-blue-500 bg-blue-500/10" },
  escola_ativada: { label: "Escola Ativada", icon: CheckCircle, cor: "text-green-500 bg-green-500/10" },
  escola_desativada: { label: "Escola Desativada", icon: XCircle, cor: "text-red-500 bg-red-500/10" },
  usuario_criado: { label: "Usuário Criado", icon: Plus, cor: "text-green-500 bg-green-500/10" },
  usuario_editado: { label: "Usuário Editado", icon: Edit, cor: "text-blue-500 bg-blue-500/10" },
  usuario_ativado: { label: "Usuário Ativado", icon: CheckCircle, cor: "text-green-500 bg-green-500/10" },
  usuario_desativado: { label: "Usuário Desativado", icon: XCircle, cor: "text-red-500 bg-red-500/10" },
  usuario_senha_resetada: { label: "Senha Resetada", icon: Key, cor: "text-amber-500 bg-amber-500/10" },
  plano_editado: { label: "Plano Editado", icon: Layers, cor: "text-purple-500 bg-purple-500/10" },
  modulo_ativado: { label: "Módulo Ativado", icon: CheckCircle, cor: "text-green-500 bg-green-500/10" },
  modulo_desativado: { label: "Módulo Desativado", icon: XCircle, cor: "text-red-500 bg-red-500/10" },
  configuracao_alterada: { label: "Config. Alterada", icon: Settings, cor: "text-slate-500 bg-slate-500/10" },
  login: { label: "Login", icon: LogIn, cor: "text-blue-500 bg-blue-500/10" },
  logout: { label: "Logout", icon: LogOut, cor: "text-slate-500 bg-slate-500/10" },
  outro: { label: "Outro", icon: AlertCircle, cor: "text-slate-500 bg-slate-500/10" },
};

export default function AdminLogAtividades() {
  const { logs, limparLogs } = useActivityLog();
  const [busca, setBusca] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [dataInicio, setDataInicio] = useState<Date | undefined>();
  const [dataFim, setDataFim] = useState<Date | undefined>();

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

  // Filtrar logs
  const logsFiltrados = logs.filter((log) => {
    const matchBusca = 
      log.descricao.toLowerCase().includes(busca.toLowerCase()) ||
      log.usuario.nome.toLowerCase().includes(busca.toLowerCase()) ||
      log.usuario.email.toLowerCase().includes(busca.toLowerCase()) ||
      (log.entidade && log.entidade.toLowerCase().includes(busca.toLowerCase()));
    
    const matchTipo = filtroTipo === "todos" || log.tipo === filtroTipo;
    
    let matchData = true;
    if (dataInicio || dataFim) {
      const dataLog = new Date(log.dataHora);
      if (dataInicio && dataLog < dataInicio) matchData = false;
      if (dataFim) {
        const fimDoDia = new Date(dataFim);
        fimDoDia.setHours(23, 59, 59, 999);
        if (dataLog > fimDoDia) matchData = false;
      }
    }
    
    return matchBusca && matchTipo && matchData;
  });

  const handleExportar = () => {
    const csvContent = [
      ["Data/Hora", "Tipo", "Descrição", "Detalhes", "Usuário", "E-mail"].join(";"),
      ...logsFiltrados.map(log => [
        format(new Date(log.dataHora), "dd/MM/yyyy HH:mm:ss"),
        tipoAtividadeInfo[log.tipo]?.label || log.tipo,
        log.descricao,
        log.detalhes || "",
        log.usuario.nome,
        log.usuario.email,
      ].join(";"))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `log-atividades-${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
    toast.success("Log de atividades exportado com sucesso!");
  };

  const handleLimparLogs = () => {
    limparLogs();
    toast.success("Histórico de atividades limpo com sucesso!");
  };

  const limparFiltros = () => {
    setBusca("");
    setFiltroTipo("todos");
    setDataInicio(undefined);
    setDataFim(undefined);
  };

  // Estatísticas
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const logsHoje = logs.filter(l => new Date(l.dataHora) >= hoje).length;
  const logsSemana = logs.filter(l => {
    const dataLog = new Date(l.dataHora);
    const umaSemanaAtras = new Date();
    umaSemanaAtras.setDate(umaSemanaAtras.getDate() - 7);
    return dataLog >= umaSemanaAtras;
  }).length;

  const usuariosUnicos = [...new Set(logs.map(l => l.usuario.id))].length;

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
          <h1 className="text-2xl font-bold text-foreground">Log de Atividades</h1>
          <p className="text-muted-foreground">
            Histórico de ações realizadas no painel administrativo
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExportar} disabled={logsFiltrados.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-red-500 hover:text-red-600" disabled={logs.length === 0}>
                <Trash2 className="mr-2 h-4 w-4" />
                Limpar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Limpar histórico de atividades?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação irá remover permanentemente todos os {logs.length} registros de atividade. Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleLimparLogs} className="bg-red-500 hover:bg-red-600">
                  Limpar Tudo
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </motion.div>

      {/* Resumo */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Registros</p>
                <p className="text-3xl font-bold">{logs.length}</p>
              </div>
              <div className="rounded-full p-3 bg-rose-500/10">
                <ClipboardList className="h-6 w-6 text-rose-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hoje</p>
                <p className="text-3xl font-bold text-green-500">{logsHoje}</p>
              </div>
              <div className="rounded-full p-3 bg-green-500/10">
                <Clock className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Última Semana</p>
                <p className="text-3xl font-bold text-blue-500">{logsSemana}</p>
              </div>
              <div className="rounded-full p-3 bg-blue-500/10">
                <Calendar className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Usuários Ativos</p>
                <p className="text-3xl font-bold text-purple-500">{usuariosUnicos}</p>
              </div>
              <div className="rounded-full p-3 bg-purple-500/10">
                <Users className="h-6 w-6 text-purple-500" />
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
                  placeholder="Buscar por descrição, usuário ou entidade..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Tipos</SelectItem>
                  <SelectItem value="escola_criada">Escola Criada</SelectItem>
                  <SelectItem value="escola_editada">Escola Editada</SelectItem>
                  <SelectItem value="escola_ativada">Escola Ativada</SelectItem>
                  <SelectItem value="escola_desativada">Escola Desativada</SelectItem>
                  <SelectItem value="usuario_criado">Usuário Criado</SelectItem>
                  <SelectItem value="usuario_editado">Usuário Editado</SelectItem>
                  <SelectItem value="plano_editado">Plano Editado</SelectItem>
                  <SelectItem value="modulo_ativado">Módulo Ativado</SelectItem>
                  <SelectItem value="modulo_desativado">Módulo Desativado</SelectItem>
                  <SelectItem value="configuracao_alterada">Configuração Alterada</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                  <SelectItem value="logout">Logout</SelectItem>
                </SelectContent>
              </Select>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full md:w-40", dataInicio && "text-foreground")}>
                    <Calendar className="mr-2 h-4 w-4" />
                    {dataInicio ? format(dataInicio, "dd/MM/yy") : "Data Início"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={dataInicio}
                    onSelect={setDataInicio}
                    locale={ptBR}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full md:w-40", dataFim && "text-foreground")}>
                    <Calendar className="mr-2 h-4 w-4" />
                    {dataFim ? format(dataFim, "dd/MM/yy") : "Data Fim"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={dataFim}
                    onSelect={setDataFim}
                    locale={ptBR}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {(busca || filtroTipo !== "todos" || dataInicio || dataFim) && (
                <Button variant="ghost" onClick={limparFiltros} className="text-muted-foreground">
                  <Filter className="mr-2 h-4 w-4" />
                  Limpar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabela de Logs */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <ClipboardList className="h-5 w-5 text-rose-500" />
              Histórico de Atividades
            </CardTitle>
            <CardDescription>
              {logsFiltrados.length} registro(s) encontrado(s)
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {logsFiltrados.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <ClipboardList className="h-12 w-12 mb-4 opacity-50" />
                <p className="text-lg font-medium">Nenhuma atividade registrada</p>
                <p className="text-sm">As ações realizadas no painel aparecerão aqui</p>
              </div>
            ) : (
              <ScrollArea className="h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-44">Data/Hora</TableHead>
                      <TableHead className="w-40">Tipo</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead className="w-48">Usuário</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logsFiltrados.map((log) => {
                      const tipoInfo = tipoAtividadeInfo[log.tipo] || tipoAtividadeInfo.outro;
                      const TipoIcon = tipoInfo.icon;
                      return (
                        <TableRow key={log.id}>
                          <TableCell className="font-mono text-sm">
                            <div className="flex flex-col">
                              <span>{format(new Date(log.dataHora), "dd/MM/yyyy")}</span>
                              <span className="text-muted-foreground text-xs">
                                {format(new Date(log.dataHora), "HH:mm:ss")}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={cn("flex items-center gap-1 w-fit", tipoInfo.cor)}>
                              <TipoIcon className="h-3 w-3" />
                              {tipoInfo.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{log.descricao}</p>
                              {log.detalhes && (
                                <p className="text-sm text-muted-foreground">{log.detalhes}</p>
                              )}
                              {log.entidade && (
                                <Badge variant="outline" className="mt-1 text-xs">
                                  {log.entidade}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-rose-500/10 text-rose-500 text-xs">
                                  {log.usuario.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">{log.usuario.nome}</span>
                                <span className="text-xs text-muted-foreground">{log.usuario.email}</span>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

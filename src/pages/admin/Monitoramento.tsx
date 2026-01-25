import { motion } from "framer-motion";
import {
  Activity,
  Users,
  Clock,
  TrendingUp,
  Server,
  Database,
  Wifi,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Cpu,
  HardDrive,
  Globe,
  Building2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const statusSistema = {
  api: { status: "online", uptime: "99.98%", latencia: "45ms" },
  database: { status: "online", uptime: "99.99%", uso: "42%" },
  storage: { status: "online", usado: "1.2 TB", total: "5 TB" },
  cdn: { status: "online", latencia: "12ms" },
};

const metricas = [
  {
    title: "Usuários Online",
    value: "2.847",
    change: "+12%",
    icon: Users,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    title: "Requisições/min",
    value: "12.5K",
    change: "+8%",
    icon: Activity,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Tempo Médio",
    value: "127ms",
    change: "-15%",
    icon: Clock,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    title: "Taxa de Erro",
    value: "0.02%",
    change: "-5%",
    icon: AlertCircle,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
];

const escolasMaisAtivas = [
  { nome: "Colégio São Paulo", acessos: 15420, usuarios: 1250, ultimoAcesso: "Agora" },
  { nome: "Escola Municipal Centro", acessos: 12850, usuarios: 850, ultimoAcesso: "1 min atrás" },
  { nome: "Colégio Novo Horizonte", acessos: 11200, usuarios: 980, ultimoAcesso: "2 min atrás" },
  { nome: "Instituto Federal Norte", acessos: 9840, usuarios: 720, ultimoAcesso: "5 min atrás" },
  { nome: "Escola Técnica Sul", acessos: 8560, usuarios: 560, ultimoAcesso: "8 min atrás" },
];

const modulosMaisUsados = [
  { modulo: "Diário de Classe", acessos: 45200, percentual: 28 },
  { modulo: "Portal do Aluno", acessos: 38500, percentual: 24 },
  { modulo: "Portal do Responsável", acessos: 32100, percentual: 20 },
  { modulo: "Notas e Boletins", acessos: 25800, percentual: 16 },
  { modulo: "Comunicados", acessos: 19400, percentual: 12 },
];

const alertasRecentes = [
  { tipo: "warning", mensagem: "Alto uso de CPU detectado no servidor principal", hora: "14:32" },
  { tipo: "info", mensagem: "Backup automático concluído com sucesso", hora: "14:00" },
  { tipo: "success", mensagem: "Atualização de segurança aplicada", hora: "12:45" },
  { tipo: "info", mensagem: "Nova versão disponível (v2.5.1)", hora: "10:30" },
];

export default function AdminMonitoramento() {
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

  const storageUsado = (1.2 / 5) * 100;

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
          <h1 className="text-2xl font-bold text-foreground">Monitoramento</h1>
          <p className="text-muted-foreground">
            Status da plataforma e métricas de uso em tempo real
          </p>
        </div>
        <Badge className="bg-green-500/10 text-green-500 self-start md:self-auto text-sm px-3 py-1">
          <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
          Todos os sistemas operacionais
        </Badge>
      </motion.div>

      {/* Status do Sistema */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <Server className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">API</p>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500/10 text-green-500">Online</Badge>
                  <span className="text-xs text-muted-foreground">{statusSistema.api.latencia}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <Database className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Database</p>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500/10 text-green-500">Online</Badge>
                  <span className="text-xs text-muted-foreground">{statusSistema.database.uso} uso</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <HardDrive className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Storage</p>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500/10 text-green-500">Online</Badge>
                  <span className="text-xs text-muted-foreground">{statusSistema.storage.usado}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <Globe className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">CDN</p>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500/10 text-green-500">Online</Badge>
                  <span className="text-xs text-muted-foreground">{statusSistema.cdn.latencia}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Métricas em Tempo Real */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-4">
        {metricas.map((metrica) => (
          <Card key={metrica.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metrica.title}</p>
                  <p className="text-2xl font-bold">{metrica.value}</p>
                  <p className="text-xs text-green-500">{metrica.change} vs. ontem</p>
                </div>
                <div className={`rounded-full p-3 ${metrica.bgColor}`}>
                  <metrica.icon className={`h-6 w-6 ${metrica.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Escolas Mais Ativas */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-rose-500" />
                Escolas Mais Ativas
              </CardTitle>
              <CardDescription>Top 5 por acessos nas últimas 24h</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Escola</TableHead>
                    <TableHead className="text-center">Acessos</TableHead>
                    <TableHead className="text-center">Usuários</TableHead>
                    <TableHead className="text-right">Último Acesso</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {escolasMaisAtivas.map((escola, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">#{index + 1}</span>
                          {escola.nome}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{escola.acessos.toLocaleString()}</TableCell>
                      <TableCell className="text-center">{escola.usuarios.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{escola.ultimoAcesso}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>

        {/* Alertas */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Alertas Recentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {alertasRecentes.map((alerta, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-3 rounded-lg ${
                    alerta.tipo === "warning" ? "bg-yellow-500/5 border border-yellow-500/20" :
                    alerta.tipo === "success" ? "bg-green-500/5 border border-green-500/20" :
                    "bg-blue-500/5 border border-blue-500/20"
                  }`}
                >
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full shrink-0 ${
                    alerta.tipo === "warning" ? "bg-yellow-500/10" :
                    alerta.tipo === "success" ? "bg-green-500/10" :
                    "bg-blue-500/10"
                  }`}>
                    {alerta.tipo === "warning" ? (
                      <AlertCircle className="h-3 w-3 text-yellow-500" />
                    ) : alerta.tipo === "success" ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <Activity className="h-3 w-3 text-blue-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs">{alerta.mensagem}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alerta.hora}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Módulos Mais Usados */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-500" />
              Módulos Mais Utilizados
            </CardTitle>
            <CardDescription>Distribuição de uso por módulo nas últimas 24h</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {modulosMaisUsados.map((modulo) => (
                <div key={modulo.modulo} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{modulo.modulo}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{modulo.acessos.toLocaleString()} acessos</span>
                      <span className="text-sm font-medium">{modulo.percentual}%</span>
                    </div>
                  </div>
                  <Progress value={modulo.percentual} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recursos do Sistema */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                <Cpu className="h-6 w-6 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">CPU</p>
                <p className="text-xl font-bold">45%</p>
                <Progress value={45} className="h-2 mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10">
                <Database className="h-6 w-6 text-purple-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Memória RAM</p>
                <p className="text-xl font-bold">62%</p>
                <Progress value={62} className="h-2 mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                <HardDrive className="h-6 w-6 text-green-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Storage</p>
                <p className="text-xl font-bold">24%</p>
                <Progress value={24} className="h-2 mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

import { motion } from "framer-motion";
import {
  Building2,
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  School,
  GraduationCap,
  UserCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const kpis = [
  {
    title: "Total de Escolas",
    value: "127",
    change: "+12%",
    trend: "up",
    description: "vs. mês anterior",
    icon: Building2,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
  },
  {
    title: "Alunos Ativos",
    value: "45.890",
    change: "+8%",
    trend: "up",
    description: "vs. mês anterior",
    icon: GraduationCap,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Receita Mensal",
    value: "R$ 892.450",
    change: "+15%",
    trend: "up",
    description: "vs. mês anterior",
    icon: DollarSign,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    title: "Taxa de Churn",
    value: "2.3%",
    change: "-0.5%",
    trend: "down",
    description: "vs. mês anterior",
    icon: Activity,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
];

const escolasRecentes = [
  { id: "1", nome: "Colégio São Paulo", cidade: "São Paulo - SP", plano: "Premium", alunos: 1250, status: "ativo" },
  { id: "2", nome: "Escola Municipal Centro", cidade: "Rio de Janeiro - RJ", plano: "Pro", alunos: 850, status: "ativo" },
  { id: "3", nome: "Instituto Educacional ABC", cidade: "Belo Horizonte - MG", plano: "Start", alunos: 420, status: "trial" },
  { id: "4", nome: "Colégio Novo Horizonte", cidade: "Curitiba - PR", plano: "Premium", alunos: 980, status: "ativo" },
  { id: "5", nome: "Escola Estadual Central", cidade: "Salvador - BA", plano: "Free", alunos: 320, status: "ativo" },
];

const alertas = [
  { tipo: "warning", mensagem: "3 escolas com pagamento pendente há mais de 15 dias", data: "Hoje" },
  { tipo: "info", mensagem: "5 novas solicitações de cadastro aguardando aprovação", data: "Hoje" },
  { tipo: "success", mensagem: "Backup automático concluído com sucesso", data: "Ontem" },
];

const planoDistribuicao = [
  { plano: "Free", escolas: 25, percentual: 19.7, cor: "bg-gray-500" },
  { plano: "Start", escolas: 35, percentual: 27.6, cor: "bg-blue-500" },
  { plano: "Pro", escolas: 42, percentual: 33.1, cor: "bg-purple-500" },
  { plano: "Premium", escolas: 25, percentual: 19.6, cor: "bg-rose-500" },
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

export default function AdminDashboard() {
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
          <h1 className="text-2xl font-bold text-foreground">Dashboard ADM Master</h1>
          <p className="text-muted-foreground">
            Visão geral da plataforma i ESCOLAS
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Activity className="mr-2 h-4 w-4" />
            Relatórios
          </Button>
          <Button className="bg-rose-500 hover:bg-rose-600">
            <Building2 className="mr-2 h-4 w-4" />
            Nova Escola
          </Button>
        </div>
      </motion.div>

      {/* KPIs */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <motion.div
            key={kpi.title}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                    <p className="text-2xl font-bold">{kpi.value}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {kpi.trend === "up" ? (
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-green-500" />
                      )}
                      <span className="text-xs text-green-500">{kpi.change}</span>
                      <span className="text-xs text-muted-foreground">{kpi.description}</span>
                    </div>
                  </div>
                  <div className={`rounded-full p-3 ${kpi.bgColor}`}>
                    <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Alertas */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Alertas do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {alertas.map((alerta, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-3 rounded-lg ${
                    alerta.tipo === "warning" ? "bg-yellow-500/5 border border-yellow-500/20" :
                    alerta.tipo === "success" ? "bg-green-500/5 border border-green-500/20" :
                    "bg-blue-500/5 border border-blue-500/20"
                  }`}
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full shrink-0 ${
                    alerta.tipo === "warning" ? "bg-yellow-500/10" :
                    alerta.tipo === "success" ? "bg-green-500/10" :
                    "bg-blue-500/10"
                  }`}>
                    {alerta.tipo === "warning" ? (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    ) : alerta.tipo === "success" ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{alerta.mensagem}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alerta.data}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Distribuição por Plano */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-rose-500" />
                Distribuição por Plano
              </CardTitle>
              <CardDescription>Escolas por tipo de assinatura</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {planoDistribuicao.map((item) => (
                  <div key={item.plano} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${item.cor}`} />
                        <span className="font-medium">{item.plano}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{item.escolas} escolas</span>
                        <span className="text-sm font-medium">{item.percentual}%</span>
                      </div>
                    </div>
                    <Progress value={item.percentual} className="h-2" />
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-4 gap-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-2xl font-bold">127</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-500">118</p>
                  <p className="text-xs text-muted-foreground">Ativos</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-500">6</p>
                  <p className="text-xs text-muted-foreground">Trial</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-500">3</p>
                  <p className="text-xs text-muted-foreground">Inativos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Escolas Recentes */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-rose-500" />
                  Escolas Recentes
                </CardTitle>
                <CardDescription>Últimas escolas cadastradas na plataforma</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                Ver Todas
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Escola</TableHead>
                  <TableHead>Cidade</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead className="text-center">Alunos</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {escolasRecentes.map((escola) => (
                  <TableRow key={escola.id}>
                    <TableCell className="font-medium">{escola.nome}</TableCell>
                    <TableCell className="text-muted-foreground">{escola.cidade}</TableCell>
                    <TableCell>
                      <Badge className={getPlanoColor(escola.plano)}>{escola.plano}</Badge>
                    </TableCell>
                    <TableCell className="text-center">{escola.alunos.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(escola.status)}>
                        {escola.status === "ativo" ? "Ativo" : escola.status === "trial" ? "Trial" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost">
                        Ver Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

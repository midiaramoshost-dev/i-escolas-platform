import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Receipt,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Calendar,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const kpisFinanceiros = [
  {
    title: "Receita Mensal",
    value: "R$ 892.450",
    change: "+15%",
    trend: "up",
    icon: DollarSign,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    title: "Receita Anual",
    value: "R$ 8.2M",
    change: "+22%",
    trend: "up",
    icon: TrendingUp,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Inadimplência",
    value: "R$ 45.890",
    change: "-8%",
    trend: "down",
    icon: AlertTriangle,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    title: "Ticket Médio",
    value: "R$ 7.028",
    change: "+5%",
    trend: "up",
    icon: Receipt,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
];

const receitaPorPlano = [
  { plano: "Premium", valor: 374850, percentual: 42, escolas: 25 },
  { plano: "Pro", valor: 312600, percentual: 35, escolas: 42 },
  { plano: "Start", valor: 156800, percentual: 17.5, escolas: 35 },
  { plano: "Free", valor: 48200, percentual: 5.5, escolas: 25 },
];

const pagamentosRecentes = [
  { id: "1", escola: "Colégio São Paulo", plano: "Premium", valor: 15680, data: "2024-05-20", status: "pago" },
  { id: "2", escola: "Escola Municipal Centro", plano: "Pro", valor: 8450, data: "2024-05-20", status: "pago" },
  { id: "3", escola: "Instituto Educacional ABC", plano: "Start", valor: 2890, data: "2024-05-19", status: "pendente" },
  { id: "4", escola: "Colégio Novo Horizonte", plano: "Premium", valor: 12350, data: "2024-05-18", status: "pago" },
  { id: "5", escola: "Escola Estadual Central", plano: "Free", valor: 0, data: "2024-05-18", status: "pago" },
  { id: "6", escola: "Colégio Esperança", plano: "Start", valor: 3200, data: "2024-05-15", status: "atrasado" },
];

const inadimplentes = [
  { escola: "Colégio Esperança", valor: 9600, diasAtraso: 45, ultimoPagamento: "2024-03-10" },
  { escola: "Escola Técnica Norte", valor: 12450, diasAtraso: 30, ultimoPagamento: "2024-04-05" },
  { escola: "Instituto Educar", valor: 6780, diasAtraso: 22, ultimoPagamento: "2024-04-18" },
  { escola: "Centro Educacional Sul", valor: 8950, diasAtraso: 15, ultimoPagamento: "2024-05-01" },
];

const formatCurrency = (value: number) => {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

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
    case "pago": return "bg-green-500/10 text-green-500";
    case "pendente": return "bg-yellow-500/10 text-yellow-500";
    case "atrasado": return "bg-red-500/10 text-red-500";
    default: return "bg-gray-500/10 text-gray-500";
  }
};

export default function AdminFinanceiro() {
  const [periodoSelecionado, setPeriodoSelecionado] = useState("mes");

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
          <h1 className="text-2xl font-bold text-foreground">Painel Financeiro</h1>
          <p className="text-muted-foreground">
            Acompanhe receitas, pagamentos e inadimplência
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={periodoSelecionado} onValueChange={setPeriodoSelecionado}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semana">Esta Semana</SelectItem>
              <SelectItem value="mes">Este Mês</SelectItem>
              <SelectItem value="trimestre">Trimestre</SelectItem>
              <SelectItem value="ano">Este Ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </motion.div>

      {/* KPIs */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpisFinanceiros.map((kpi) => (
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
        {/* Receita por Plano */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-rose-500" />
                Receita por Plano
              </CardTitle>
              <CardDescription>Distribuição da receita mensal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {receitaPorPlano.map((item) => (
                  <div key={item.plano} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={getPlanoColor(item.plano)}>{item.plano}</Badge>
                        <span className="text-sm text-muted-foreground">({item.escolas} escolas)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{formatCurrency(item.valor)}</span>
                        <span className="text-xs text-muted-foreground">({item.percentual}%)</span>
                      </div>
                    </div>
                    <Progress value={item.percentual} className="h-2" />
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total do Mês</span>
                  <span className="text-xl font-bold text-green-500">
                    {formatCurrency(receitaPorPlano.reduce((acc, p) => acc + p.valor, 0))}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Inadimplentes */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Inadimplência
              </CardTitle>
              <CardDescription>Escolas com pagamentos em atraso</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {inadimplentes.map((escola, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/20"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
                    <Building2 className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{escola.escola}</p>
                    <p className="text-xs text-muted-foreground">
                      {escola.diasAtraso} dias em atraso
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-500">{formatCurrency(escola.valor)}</p>
                  </div>
                </div>
              ))}

              <Button variant="outline" className="w-full mt-2">
                Ver Todos
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Pagamentos Recentes */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-blue-500" />
                  Pagamentos Recentes
                </CardTitle>
                <CardDescription>Últimas transações na plataforma</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                Ver Histórico Completo
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Escola</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagamentosRecentes.map((pagamento) => (
                  <TableRow key={pagamento.id}>
                    <TableCell className="font-medium">{pagamento.escola}</TableCell>
                    <TableCell>
                      <Badge className={getPlanoColor(pagamento.plano)}>{pagamento.plano}</Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(pagamento.valor)}</TableCell>
                    <TableCell>{new Date(pagamento.data).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(pagamento.status)} flex items-center gap-1 w-fit`}>
                        {pagamento.status === "pago" ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : pagamento.status === "pendente" ? (
                          <Clock className="h-3 w-3" />
                        ) : (
                          <AlertTriangle className="h-3 w-3" />
                        )}
                        {pagamento.status === "pago" ? "Pago" : pagamento.status === "pendente" ? "Pendente" : "Atrasado"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {pagamento.status === "pago" ? (
                        <Button size="sm" variant="ghost">
                          <Download className="h-4 w-4 mr-1" />
                          NF
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline">
                          Cobrar
                        </Button>
                      )}
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

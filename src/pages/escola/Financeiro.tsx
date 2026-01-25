import { useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  Calendar,
  Download,
  Filter,
  Search,
  ChevronDown,
  Eye,
  Send,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  FileText,
  QrCode,
  MessageCircle,
  Mail,
  Bell,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { EnviarCobrancaDialog, Inadimplente } from "@/components/financeiro/EnviarCobrancaDialog";
import { AgendarLembreteDialog } from "@/components/financeiro/AgendarLembreteDialog";
import { useToast } from "@/hooks/use-toast";

// Mock data
const kpis = {
  receitaMes: 245680,
  receitaMesAnterior: 232450,
  aReceber: 78540,
  inadimplencia: 15230,
  taxaInadimplencia: 5.8,
  alunosPagantes: 342,
  alunosInadimplentes: 23,
};

const receitaMensal = [
  { mes: "Jul", recebido: 198000, previsto: 210000 },
  { mes: "Ago", recebido: 215000, previsto: 220000 },
  { mes: "Set", recebido: 228000, previsto: 225000 },
  { mes: "Out", recebido: 232450, previsto: 235000 },
  { mes: "Nov", recebido: 245680, previsto: 240000 },
  { mes: "Dez", recebido: 0, previsto: 250000 },
];

const pagamentosPorMetodo = [
  { name: "Pix", value: 45, color: "#10b981" },
  { name: "Boleto", value: 35, color: "#3b82f6" },
  { name: "Cartão", value: 15, color: "#8b5cf6" },
  { name: "Outros", value: 5, color: "#6b7280" },
];

const inadimplenciaPorTurma = [
  { turma: "1º Ano A", inadimplentes: 2, total: 28 },
  { turma: "2º Ano A", inadimplentes: 3, total: 30 },
  { turma: "3º Ano B", inadimplentes: 5, total: 32 },
  { turma: "4º Ano A", inadimplentes: 4, total: 29 },
  { turma: "5º Ano B", inadimplentes: 6, total: 31 },
  { turma: "6º Ano A", inadimplentes: 3, total: 27 },
];

const pagamentosRecentes = [
  {
    id: "PAG001",
    aluno: "João Pedro Silva",
    turma: "5º Ano A",
    responsavel: "Maria Silva",
    valor: 850,
    tipo: "Mensalidade",
    referencia: "Nov/2024",
    metodo: "pix",
    status: "pago",
    dataPagamento: "2024-11-10",
  },
  {
    id: "PAG002",
    aluno: "Ana Clara Santos",
    turma: "3º Ano B",
    responsavel: "Carlos Santos",
    valor: 850,
    tipo: "Mensalidade",
    referencia: "Nov/2024",
    metodo: "boleto",
    status: "pago",
    dataPagamento: "2024-11-08",
  },
  {
    id: "PAG003",
    aluno: "Lucas Oliveira",
    turma: "7º Ano A",
    responsavel: "Fernanda Oliveira",
    valor: 950,
    tipo: "Mensalidade",
    referencia: "Nov/2024",
    metodo: "cartao",
    status: "pago",
    dataPagamento: "2024-11-05",
  },
  {
    id: "PAG004",
    aluno: "Beatriz Costa",
    turma: "2º Ano A",
    responsavel: "Roberto Costa",
    valor: 750,
    tipo: "Mensalidade",
    referencia: "Nov/2024",
    metodo: "pix",
    status: "pago",
    dataPagamento: "2024-11-03",
  },
  {
    id: "PAG005",
    aluno: "Gabriel Almeida",
    turma: "4º Ano B",
    responsavel: "Juliana Almeida",
    valor: 850,
    tipo: "Mensalidade",
    referencia: "Nov/2024",
    metodo: "boleto",
    status: "pago",
    dataPagamento: "2024-11-01",
  },
];

const inadimplentesData: Inadimplente[] = [
  {
    id: "INAD001",
    aluno: "Pedro Henrique Lima",
    turma: "3º Ano B",
    responsavel: "Amanda Lima",
    telefone: "(11) 99999-1234",
    email: "amanda.lima@email.com",
    mesesDevidos: 2,
    valorTotal: 1700,
    ultimoContato: "2024-10-28",
    status: "negociando",
  },
  {
    id: "INAD002",
    aluno: "Mariana Ferreira",
    turma: "5º Ano B",
    responsavel: "Paulo Ferreira",
    telefone: "(11) 99888-5678",
    email: "paulo.ferreira@email.com",
    mesesDevidos: 1,
    valorTotal: 850,
    ultimoContato: "2024-11-02",
    status: "pendente",
  },
  {
    id: "INAD003",
    aluno: "Rafael Souza",
    turma: "6º Ano A",
    responsavel: "Camila Souza",
    telefone: "(11) 97777-9012",
    email: "camila.souza@email.com",
    mesesDevidos: 3,
    valorTotal: 2850,
    ultimoContato: "2024-10-15",
    status: "atrasado",
  },
  {
    id: "INAD004",
    aluno: "Isabella Rodrigues",
    turma: "4º Ano A",
    responsavel: "Marcos Rodrigues",
    telefone: "(11) 96666-3456",
    email: "marcos.rodrigues@email.com",
    mesesDevidos: 1,
    valorTotal: 850,
    ultimoContato: "2024-11-05",
    status: "promessa",
  },
];

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

export default function EscolaFinanceiro() {
  const [searchTerm, setSearchTerm] = useState("");
  const [periodoFiltro, setPeriodoFiltro] = useState("mes");
  const [cobrancaDialogOpen, setCobrancaDialogOpen] = useState(false);
  const [lembreteDialogOpen, setLembreteDialogOpen] = useState(false);
  const [selectedInadimplente, setSelectedInadimplente] = useState<string | null>(null);
  const [inadimplentes, setInadimplentes] = useState<Inadimplente[]>(inadimplentesData);
  const { toast } = useToast();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      pago: { label: "Pago", variant: "default" },
      pendente: { label: "Pendente", variant: "secondary" },
      negociando: { label: "Em negociação", variant: "outline" },
      promessa: { label: "Promessa pag.", variant: "secondary" },
      atrasado: { label: "Atrasado", variant: "destructive" },
    };
    const config = statusConfig[status] || { label: status, variant: "secondary" as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getMetodoBadge = (metodo: string) => {
    const metodoConfig: Record<string, { label: string; icon: React.ReactNode }> = {
      pix: { label: "Pix", icon: <QrCode className="h-3 w-3" /> },
      boleto: { label: "Boleto", icon: <FileText className="h-3 w-3" /> },
      cartao: { label: "Cartão", icon: <CreditCard className="h-3 w-3" /> },
    };
    const config = metodoConfig[metodo];
    return (
      <Badge variant="outline" className="gap-1">
        {config?.icon}
        {config?.label || metodo}
      </Badge>
    );
  };

  const handleContatoRegistrado = (id: string, tipo: 'whatsapp' | 'email') => {
    // Update ultimo contato
    setInadimplentes(prev => prev.map(i => 
      i.id === id 
        ? { ...i, ultimoContato: new Date().toISOString().split('T')[0] }
        : i
    ));
  };

  const enviarWhatsAppIndividual = (inadimplente: Inadimplente) => {
    const phone = inadimplente.telefone.replace(/\D/g, "");
    const phoneWithCountry = phone.startsWith("55") ? phone : `55${phone}`;
    const mesesTexto = inadimplente.mesesDevidos === 1 ? "1 mensalidade" : `${inadimplente.mesesDevidos} mensalidades`;
    const mensagem = `Olá ${inadimplente.responsavel.split(" ")[0]}! Identificamos que há ${mesesTexto} em aberto referente ao(à) aluno(a) *${inadimplente.aluno}* (${inadimplente.turma}). Valor: ${formatCurrency(inadimplente.valorTotal)}. Entre em contato para regularizar.`;
    const encodedMessage = encodeURIComponent(mensagem);
    
    window.open(`https://wa.me/${phoneWithCountry}?text=${encodedMessage}`, "_blank");
    handleContatoRegistrado(inadimplente.id, 'whatsapp');
    
    toast({
      title: "WhatsApp aberto",
      description: `Mensagem preparada para ${inadimplente.responsavel}`,
    });
  };

  const enviarEmailIndividual = (inadimplente: Inadimplente) => {
    const assunto = encodeURIComponent(`Pendência financeira - ${inadimplente.aluno}`);
    const mesesTexto = inadimplente.mesesDevidos === 1 ? "1 mensalidade" : `${inadimplente.mesesDevidos} mensalidades`;
    const corpo = encodeURIComponent(
      `Prezado(a) ${inadimplente.responsavel},\n\nIdentificamos que há ${mesesTexto} em aberto referente ao(à) aluno(a) ${inadimplente.aluno} (${inadimplente.turma}).\n\nValor total pendente: ${formatCurrency(inadimplente.valorTotal)}\n\nPor favor, entre em contato conosco para regularizar a situação.\n\nAtenciosamente,\nSecretaria Financeira`
    );
    
    window.open(`mailto:${inadimplente.email}?subject=${assunto}&body=${corpo}`, "_blank");
    handleContatoRegistrado(inadimplente.id, 'email');
    
    toast({
      title: "E-mail preparado",
      description: `Mensagem preparada para ${inadimplente.email}`,
    });
  };

  const variacaoReceita = ((kpis.receitaMes - kpis.receitaMesAnterior) / kpis.receitaMesAnterior) * 100;

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
          <h1 className="text-3xl font-bold text-foreground">Financeiro</h1>
          <p className="text-muted-foreground">
            Acompanhe receitas, pagamentos e inadimplências
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={periodoFiltro} onValueChange={setPeriodoFiltro}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semana">Esta semana</SelectItem>
              <SelectItem value="mes">Este mês</SelectItem>
              <SelectItem value="trimestre">Trimestre</SelectItem>
              <SelectItem value="ano">Este ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita do Mês
            </CardTitle>
            <div className="rounded-full bg-emerald-500/10 p-2">
              <DollarSign className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(kpis.receitaMes)}</div>
            <div className="flex items-center gap-1 text-sm">
              {variacaoReceita > 0 ? (
                <>
                  <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                  <span className="text-emerald-500">+{variacaoReceita.toFixed(1)}%</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-4 w-4 text-destructive" />
                  <span className="text-destructive">{variacaoReceita.toFixed(1)}%</span>
                </>
              )}
              <span className="text-muted-foreground">vs. mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              A Receber
            </CardTitle>
            <div className="rounded-full bg-blue-500/10 p-2">
              <Clock className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(kpis.aReceber)}</div>
            <p className="text-sm text-muted-foreground">
              Vencimentos em aberto
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Inadimplência
            </CardTitle>
            <div className="rounded-full bg-amber-500/10 p-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(kpis.inadimplencia)}</div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Taxa:</span>
              <Badge variant="secondary" className="bg-amber-500/10 text-amber-600">
                {kpis.taxaInadimplencia}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-violet-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Alunos
            </CardTitle>
            <div className="rounded-full bg-violet-500/10 p-2">
              <Users className="h-4 w-4 text-violet-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.alunosPagantes}</div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span className="text-muted-foreground">Em dia</span>
              <span className="text-muted-foreground">|</span>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span className="text-muted-foreground">{kpis.alunosInadimplentes} inadimplentes</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts */}
      <motion.div variants={itemVariants} className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Evolução da Receita</CardTitle>
            <CardDescription>Comparativo recebido vs. previsto</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={receitaMensal}>
                  <defs>
                    <linearGradient id="colorRecebido" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="mes" className="text-xs" />
                  <YAxis 
                    className="text-xs" 
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="recebido"
                    stroke="hsl(var(--primary))"
                    fill="url(#colorRecebido)"
                    strokeWidth={2}
                    name="Recebido"
                  />
                  <Area
                    type="monotone"
                    dataKey="previsto"
                    stroke="hsl(var(--muted-foreground))"
                    fill="transparent"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Previsto"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Métodos de Pagamento</CardTitle>
            <CardDescription>Distribuição por tipo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pagamentosPorMetodo}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pagamentosPorMetodo.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => `${value}%`}
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {pagamentosPorMetodo.map((metodo) => (
                <div key={metodo.name} className="flex items-center gap-2">
                  <div 
                    className="h-3 w-3 rounded-full" 
                    style={{ backgroundColor: metodo.color }}
                  />
                  <span className="text-sm text-muted-foreground">{metodo.name}</span>
                  <span className="ml-auto text-sm font-medium">{metodo.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Inadimplência por Turma */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Inadimplência por Turma</CardTitle>
            <CardDescription>Quantidade de alunos inadimplentes por turma</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inadimplenciaPorTurma.map((turma) => {
                const percentual = (turma.inadimplentes / turma.total) * 100;
                return (
                  <div key={turma.turma} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{turma.turma}</span>
                      <span className="text-muted-foreground">
                        {turma.inadimplentes} de {turma.total} alunos ({percentual.toFixed(0)}%)
                      </span>
                    </div>
                    <Progress value={percentual} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs - Pagamentos e Inadimplentes */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="pagamentos" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pagamentos" className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Pagamentos Recentes
            </TabsTrigger>
            <TabsTrigger value="inadimplentes" className="gap-2">
              <AlertTriangle className="h-4 w-4" />
              Inadimplentes
              <Badge variant="destructive" className="ml-1">
                {inadimplentes.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pagamentos" className="space-y-4">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle>Pagamentos Recebidos</CardTitle>
                    <CardDescription>Últimos pagamentos confirmados</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Buscar aluno..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 w-[200px]"
                      />
                    </div>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Aluno</TableHead>
                      <TableHead>Referência</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Método</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagamentosRecentes
                      .filter((p) =>
                        p.aluno.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((pagamento) => (
                        <TableRow key={pagamento.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{pagamento.aluno}</p>
                              <p className="text-sm text-muted-foreground">
                                {pagamento.turma}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{pagamento.tipo}</p>
                              <p className="text-sm text-muted-foreground">
                                {pagamento.referencia}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(pagamento.valor)}
                          </TableCell>
                          <TableCell>{getMetodoBadge(pagamento.metodo)}</TableCell>
                          <TableCell>
                            {new Date(pagamento.dataPagamento).toLocaleDateString("pt-BR")}
                          </TableCell>
                          <TableCell>{getStatusBadge(pagamento.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inadimplentes" className="space-y-4">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle>Alunos Inadimplentes</CardTitle>
                    <CardDescription>
                      Gerencie cobranças e negociações
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      onClick={() => setLembreteDialogOpen(true)}
                    >
                      <Bell className="mr-2 h-4 w-4" />
                      Agendar Lembretes
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setCobrancaDialogOpen(true)}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Enviar Cobranças
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Aluno</TableHead>
                      <TableHead>Responsável</TableHead>
                      <TableHead>Meses</TableHead>
                      <TableHead>Valor Total</TableHead>
                      <TableHead>Último Contato</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inadimplentes.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.aluno}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.turma}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.responsavel}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.telefone}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={item.mesesDevidos >= 3 ? "destructive" : "secondary"}>
                            {item.mesesDevidos} {item.mesesDevidos === 1 ? "mês" : "meses"}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium text-destructive">
                          {formatCurrency(item.valorTotal)}
                        </TableCell>
                        <TableCell>
                          {new Date(item.ultimoContato).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver detalhes
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => enviarWhatsAppIndividual(item)}>
                                <MessageCircle className="mr-2 h-4 w-4 text-emerald-600" />
                                Cobrar via WhatsApp
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => enviarEmailIndividual(item)}>
                                <Mail className="mr-2 h-4 w-4 text-blue-600" />
                                Cobrar via E-mail
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <FileText className="mr-2 h-4 w-4" />
                                Registrar contato
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
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Dialog de Envio de Cobranças */}
      <EnviarCobrancaDialog
        open={cobrancaDialogOpen}
        onOpenChange={setCobrancaDialogOpen}
        inadimplentes={inadimplentes}
        onContatoRegistrado={handleContatoRegistrado}
      />

      {/* Dialog de Agendamento de Lembretes */}
      <AgendarLembreteDialog
        open={lembreteDialogOpen}
        onOpenChange={setLembreteDialogOpen}
        inadimplentes={inadimplentes}
        onEnviarCobranca={(inadimplente, canal) => {
          if (canal === "whatsapp") {
            enviarWhatsAppIndividual(inadimplente);
          } else {
            enviarEmailIndividual(inadimplente);
          }
        }}
      />
    </motion.div>
  );
}

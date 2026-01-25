import { motion } from "framer-motion";
import {
  CreditCard,
  Receipt,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  Users,
  Eye,
  Wallet,
  FileText,
  Bell,
  Settings,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import { PaymentDialog } from "@/components/payments/PaymentDialog";
import { paymentProviders, getMethodLabel } from "@/lib/payments/providers";
import { toast } from "@/hooks/use-toast";
import { usePaymentNotifications } from "@/hooks/usePaymentNotifications";
import { NotificacoesConfigDialog } from "@/components/financeiro/NotificacoesConfigDialog";

const dependentes = [
  { id: "1", nome: "Ana Beatriz Silva", turma: "5º Ano A", iniciais: "AB", mensalidade: 1200 },
  { id: "2", nome: "Pedro Silva", turma: "3º Ano B", iniciais: "PS", mensalidade: 1100 },
];

const mensalidadesPorDependente: Record<string, any[]> = {
  "1": [
    { id: "m1", mes: "Janeiro", ano: 2024, valor: 1200, vencimento: "2024-01-10", status: "pago", dataPagamento: "2024-01-08" },
    { id: "m2", mes: "Fevereiro", ano: 2024, valor: 1200, vencimento: "2024-02-10", status: "pago", dataPagamento: "2024-02-10" },
    { id: "m3", mes: "Março", ano: 2024, valor: 1200, vencimento: "2024-03-10", status: "pago", dataPagamento: "2024-03-09" },
    { id: "m4", mes: "Abril", ano: 2024, valor: 1200, vencimento: "2024-04-10", status: "pago", dataPagamento: "2024-04-10" },
    { id: "m5", mes: "Maio", ano: 2024, valor: 1200, vencimento: "2024-05-10", status: "pendente", dataPagamento: null },
    { id: "m6", mes: "Junho", ano: 2024, valor: 1200, vencimento: "2024-06-10", status: "futuro", dataPagamento: null },
  ],
  "2": [
    { id: "m7", mes: "Janeiro", ano: 2024, valor: 1100, vencimento: "2024-01-10", status: "pago", dataPagamento: "2024-01-08" },
    { id: "m8", mes: "Fevereiro", ano: 2024, valor: 1100, vencimento: "2024-02-10", status: "pago", dataPagamento: "2024-02-12" },
    { id: "m9", mes: "Março", ano: 2024, valor: 1100, vencimento: "2024-03-10", status: "pago", dataPagamento: "2024-03-10" },
    { id: "m10", mes: "Abril", ano: 2024, valor: 1100, vencimento: "2024-04-10", status: "atrasado", dataPagamento: null },
    { id: "m11", mes: "Maio", ano: 2024, valor: 1100, vencimento: "2024-05-10", status: "pendente", dataPagamento: null },
    { id: "m12", mes: "Junho", ano: 2024, valor: 1100, vencimento: "2024-06-10", status: "futuro", dataPagamento: null },
  ],
};

const historicoGeral = [
  { id: "p1", descricao: "Mensalidade Janeiro - Ana Beatriz", valor: 1200, data: "2024-01-08", tipo: "mensalidade" },
  { id: "p2", descricao: "Mensalidade Janeiro - Pedro", valor: 1100, data: "2024-01-08", tipo: "mensalidade" },
  { id: "p3", descricao: "Material Didático - Ana Beatriz", valor: 350, data: "2024-01-15", tipo: "material" },
  { id: "p4", descricao: "Mensalidade Fevereiro - Ana Beatriz", valor: 1200, data: "2024-02-10", tipo: "mensalidade" },
  { id: "p5", descricao: "Mensalidade Fevereiro - Pedro", valor: 1100, data: "2024-02-12", tipo: "mensalidade" },
  { id: "p6", descricao: "Passeio Escolar - Ana Beatriz", valor: 85, data: "2024-02-20", tipo: "evento" },
  { id: "p7", descricao: "Mensalidade Março - Ana Beatriz", valor: 1200, data: "2024-03-09", tipo: "mensalidade" },
  { id: "p8", descricao: "Mensalidade Março - Pedro", valor: 1100, data: "2024-03-10", tipo: "mensalidade" },
  { id: "p9", descricao: "Mensalidade Abril - Ana Beatriz", valor: 1200, data: "2024-04-10", tipo: "mensalidade" },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "pago":
      return "bg-green-500/10 text-green-500";
    case "pendente":
      return "bg-yellow-500/10 text-yellow-500";
    case "atrasado":
      return "bg-red-500/10 text-red-500";
    default:
      return "bg-gray-500/10 text-gray-500";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "pago":
      return "Pago";
    case "pendente":
      return "Pendente";
    case "atrasado":
      return "Atrasado";
    default:
      return "A vencer";
  }
};

const formatCurrency = (value: number) => {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

export default function ResponsavelFinanceiro() {
  const [dependenteSelecionado, setDependenteSelecionado] = useState<string | null>(null);
  const [tabAtiva, setTabAtiva] = useState("resumo");
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<{ amount: number; description: string } | null>(null);
  const [notificacoesDialogOpen, setNotificacoesDialogOpen] = useState(false);

  // Payment notifications hook
  const {
    settings: notificationSettings,
    updateSettings: updateNotificationSettings,
    requestPermission,
    permissionGranted,
    checkPayments,
  } = usePaymentNotifications();

  // Check payments on load and periodically
  useEffect(() => {
    // Prepare mensalidades with aluno names
    const allMensalidades = dependentes.flatMap(dep => 
      (mensalidadesPorDependente[dep.id] || []).map(m => ({
        ...m,
        alunoNome: dep.nome,
      }))
    );
    
    // Check immediately
    checkPayments(allMensalidades);

    // Check every hour
    const interval = setInterval(() => {
      checkPayments(allMensalidades);
    }, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [checkPayments]);

  const handleOpenPayment = (amount: number, description: string) => {
    setSelectedPayment({ amount, description });
    setPaymentDialogOpen(true);
  };

  const handlePaymentSuccess = () => {
    toast({
      title: "Pagamento realizado!",
      description: "Seu pagamento foi processado com sucesso.",
    });
    setPaymentDialogOpen(false);
    setSelectedPayment(null);
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

  // Cálculos gerais
  const totalMensalMensal = dependentes.reduce((acc, d) => acc + d.mensalidade, 0);
  
  const todasMensalidades = Object.values(mensalidadesPorDependente).flat();
  const totalPago = todasMensalidades.filter(m => m.status === "pago").reduce((acc, m) => acc + m.valor, 0);
  const totalPendente = todasMensalidades.filter(m => m.status === "pendente").reduce((acc, m) => acc + m.valor, 0);
  const totalAtrasado = todasMensalidades.filter(m => m.status === "atrasado").reduce((acc, m) => acc + m.valor, 0);

  const getMensalidadesFiltradas = () => {
    if (dependenteSelecionado) {
      return mensalidadesPorDependente[dependenteSelecionado] || [];
    }
    return [];
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
          <h1 className="text-2xl font-bold text-foreground">Financeiro</h1>
          <p className="text-muted-foreground">
            Acompanhe mensalidades e pagamentos
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setNotificacoesDialogOpen(true)}
            className="relative"
          >
            <Bell className="h-4 w-4 mr-2" />
            Notificações
            {notificationSettings.enabled && permissionGranted && (
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
            )}
          </Button>
          <Button className="bg-violet-500 hover:bg-violet-600">
            <Download className="h-4 w-4 mr-2" />
            Exportar Extrato
          </Button>
        </div>
      </motion.div>

      {/* Resumo Geral */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mensalidade Total</p>
                <p className="text-2xl font-bold">{formatCurrency(totalMensalMensal)}</p>
                <p className="text-xs text-muted-foreground">/mês</p>
              </div>
              <div className="rounded-full p-3 bg-violet-500/10">
                <CreditCard className="h-8 w-8 text-violet-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Pago</p>
                <p className="text-2xl font-bold text-green-500">{formatCurrency(totalPago)}</p>
                <p className="text-xs text-muted-foreground">este ano</p>
              </div>
              <div className="rounded-full p-3 bg-green-500/10">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pendente</p>
                <p className="text-2xl font-bold text-yellow-500">{formatCurrency(totalPendente)}</p>
                <p className="text-xs text-muted-foreground">a vencer</p>
              </div>
              <div className="rounded-full p-3 bg-yellow-500/10">
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Em Atraso</p>
                <p className="text-2xl font-bold text-red-500">{formatCurrency(totalAtrasado)}</p>
                <p className="text-xs text-muted-foreground">regularizar</p>
              </div>
              <div className="rounded-full p-3 bg-red-500/10">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Alerta de Atraso */}
      {totalAtrasado > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="border-red-500/50 bg-red-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <AlertTriangle className="h-8 w-8 text-red-500" />
                <div className="flex-1">
                  <p className="font-medium text-red-600 dark:text-red-400">Você possui mensalidades em atraso</p>
                  <p className="text-sm text-muted-foreground">
                    Regularize sua situação para evitar juros e manter os serviços ativos.
                  </p>
                </div>
                <Button variant="destructive">
                  Regularizar Agora
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs value={tabAtiva} onValueChange={setTabAtiva}>
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="resumo">Resumo</TabsTrigger>
            <TabsTrigger value="mensalidades">Mensalidades</TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
          </TabsList>

          {/* Resumo por Dependente */}
          <TabsContent value="resumo" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              {dependentes.map((dep) => {
                const mensalidades = mensalidadesPorDependente[dep.id] || [];
                const pagas = mensalidades.filter(m => m.status === "pago").length;
                const total = mensalidades.filter(m => m.status !== "futuro").length;
                const atrasadas = mensalidades.filter(m => m.status === "atrasado").length;
                
                return (
                  <motion.div
                    key={dep.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className={atrasadas > 0 ? "border-red-500/30" : ""}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <Avatar className="h-14 w-14">
                            <AvatarFallback className="bg-violet-500 text-white text-lg">{dep.iniciais}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-semibold">{dep.nome}</h3>
                            <p className="text-sm text-muted-foreground">{dep.turma}</p>
                          </div>
                          {atrasadas > 0 && (
                            <Badge className="bg-red-500/10 text-red-500">
                              {atrasadas} em atraso
                            </Badge>
                          )}
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Mensalidade</span>
                            <span className="font-semibold">{formatCurrency(dep.mensalidade)}</span>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Pagamentos em dia</span>
                              <span>{pagas}/{total}</span>
                            </div>
                            <Progress value={(pagas / total) * 100} className="h-2" />
                          </div>

                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                              setDependenteSelecionado(dep.id);
                              setTabAtiva("mensalidades");
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalhes
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* Mensalidades */}
          <TabsContent value="mensalidades" className="mt-6 space-y-4">
            {/* Seletor de Dependente */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <Users className="h-5 w-5 text-violet-500" />
                  <span className="font-medium">Selecionar filho:</span>
                  <div className="flex gap-2">
                    {dependentes.map((dep) => (
                      <Button
                        key={dep.id}
                        variant={dependenteSelecionado === dep.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setDependenteSelecionado(dep.id)}
                        className={dependenteSelecionado === dep.id ? "bg-violet-500 hover:bg-violet-600" : ""}
                      >
                        <Avatar className="h-5 w-5 mr-2">
                          <AvatarFallback className="text-[10px] bg-violet-500 text-white">{dep.iniciais}</AvatarFallback>
                        </Avatar>
                        {dep.nome}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {dependenteSelecionado ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="h-5 w-5 text-violet-500" />
                    Mensalidades {new Date().getFullYear()}
                  </CardTitle>
                  <CardDescription>
                    {dependentes.find(d => d.id === dependenteSelecionado)?.nome}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mês</TableHead>
                        <TableHead>Vencimento</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data Pagamento</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getMensalidadesFiltradas().map((mensalidade) => (
                        <TableRow key={mensalidade.id}>
                          <TableCell className="font-medium">{mensalidade.mes}</TableCell>
                          <TableCell>
                            {new Date(mensalidade.vencimento).toLocaleDateString("pt-BR")}
                          </TableCell>
                          <TableCell>{formatCurrency(mensalidade.valor)}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(mensalidade.status)}>
                              {getStatusLabel(mensalidade.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {mensalidade.dataPagamento
                              ? new Date(mensalidade.dataPagamento).toLocaleDateString("pt-BR")
                              : "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            {mensalidade.status === "pago" ? (
                              <Button size="sm" variant="ghost">
                                <Download className="h-4 w-4 mr-1" />
                                Recibo
                              </Button>
                            ) : mensalidade.status !== "futuro" ? (
                              <Button 
                                size="sm" 
                                className="bg-violet-500 hover:bg-violet-600"
                                onClick={() => handleOpenPayment(
                                  mensalidade.valor,
                                  `Mensalidade ${mensalidade.mes}/${mensalidade.ano} - ${dependentes.find(d => d.id === dependenteSelecionado)?.nome}`
                                )}
                              >
                                <CreditCard className="h-4 w-4 mr-1" />
                                Pagar
                              </Button>
                            ) : null}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-lg">Selecione um filho</h3>
                <p className="text-muted-foreground">Escolha um dependente para ver as mensalidades</p>
              </div>
            )}
          </TabsContent>

          {/* Histórico */}
          <TabsContent value="historico" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  Histórico de Pagamentos
                </CardTitle>
                <CardDescription>Todos os pagamentos realizados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {historicoGeral.map((pagamento) => (
                    <div
                      key={pagamento.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{pagamento.descricao}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(pagamento.data).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-500">{formatCurrency(pagamento.valor)}</p>
                        <Badge variant="outline" className="text-xs">
                          {pagamento.tipo === "mensalidade" ? "Mensalidade" : 
                           pagamento.tipo === "material" ? "Material" : "Evento"}
                        </Badge>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Payment Dialog */}
      {selectedPayment && (
        <PaymentDialog
          open={paymentDialogOpen}
          onOpenChange={setPaymentDialogOpen}
          amount={selectedPayment.amount}
          description={selectedPayment.description}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* Notifications Config Dialog */}
      <NotificacoesConfigDialog
        open={notificacoesDialogOpen}
        onOpenChange={setNotificacoesDialogOpen}
        settings={notificationSettings}
        onUpdateSettings={updateNotificationSettings}
        permissionGranted={permissionGranted}
        onRequestPermission={requestPermission}
      />
    </motion.div>
  );
}

import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Receipt,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Plus,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Pagamento {
  id: string;
  escola_id: string;
  escola_nome: string;
  escola_plano: string;
  valor: number;
  data_vencimento: string;
  data_pagamento: string | null;
  status: string;
  metodo_pagamento: string | null;
  referencia: string | null;
}

interface EscolaOption {
  id: string;
  nome: string;
  plano: string;
}

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

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
    case "cancelado": return "bg-gray-500/10 text-gray-500";
    default: return "bg-gray-500/10 text-gray-500";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "pago": return "Pago";
    case "pendente": return "Pendente";
    case "atrasado": return "Atrasado";
    case "cancelado": return "Cancelado";
    default: return status;
  }
};

export default function AdminFinanceiro() {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [escolas, setEscolas] = useState<EscolaOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    escola_id: "",
    valor: "",
    data_vencimento: "",
    status: "pendente",
    metodo_pagamento: "",
    referencia: "",
  });

  const fetchData = useCallback(async () => {
    setLoading(true);

    const [pagRes, escRes] = await Promise.all([
      supabase
        .from("pagamentos")
        .select("*, escolas(nome, plano)")
        .order("data_vencimento", { ascending: false }),
      supabase.from("escolas").select("id, nome, plano").order("nome"),
    ]);

    if (escRes.data) setEscolas(escRes.data);

    if (pagRes.data) {
      setPagamentos(
        pagRes.data.map((p: any) => ({
          id: p.id,
          escola_id: p.escola_id,
          escola_nome: p.escolas?.nome || "—",
          escola_plano: p.escolas?.plano || "Free",
          valor: Number(p.valor),
          data_vencimento: p.data_vencimento,
          data_pagamento: p.data_pagamento,
          status: p.status,
          metodo_pagamento: p.metodo_pagamento,
          referencia: p.referencia,
        }))
      );
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalReceita = pagamentos
    .filter((p) => p.status === "pago")
    .reduce((acc, p) => acc + p.valor, 0);

  const totalPendente = pagamentos
    .filter((p) => p.status === "pendente")
    .reduce((acc, p) => acc + p.valor, 0);

  const totalAtrasado = pagamentos
    .filter((p) => p.status === "atrasado")
    .reduce((acc, p) => acc + p.valor, 0);

  const ticketMedio =
    pagamentos.filter((p) => p.status === "pago").length > 0
      ? totalReceita / pagamentos.filter((p) => p.status === "pago").length
      : 0;

  const inadimplentes = pagamentos.filter((p) => p.status === "atrasado");

  // Receita por plano
  const planos = ["Free", "Start", "Pro", "Premium"];
  const receitaPorPlano = planos.map((plano) => {
    const pagosPorPlano = pagamentos.filter(
      (p) => p.escola_plano.toLowerCase() === plano.toLowerCase() && p.status === "pago"
    );
    const valor = pagosPorPlano.reduce((acc, p) => acc + p.valor, 0);
    return {
      plano,
      valor,
      escolas: new Set(pagosPorPlano.map((p) => p.escola_id)).size,
      percentual: totalReceita > 0 ? Math.round((valor / totalReceita) * 1000) / 10 : 0,
    };
  });

  const handleSave = async () => {
    if (!formData.escola_id || !formData.valor || !formData.data_vencimento) {
      toast.error("Preencha escola, valor e data de vencimento");
      return;
    }

    const { error } = await supabase.from("pagamentos").insert({
      escola_id: formData.escola_id,
      valor: parseFloat(formData.valor),
      data_vencimento: formData.data_vencimento,
      status: formData.status as any,
      metodo_pagamento: formData.metodo_pagamento || null,
      referencia: formData.referencia || null,
      data_pagamento: formData.status === "pago" ? formData.data_vencimento : null,
    });

    if (error) {
      toast.error("Erro ao registrar pagamento");
      console.error(error);
      return;
    }

    toast.success("Pagamento registrado!");
    setDialogOpen(false);
    setFormData({ escola_id: "", valor: "", data_vencimento: "", status: "pendente", metodo_pagamento: "", referencia: "" });
    fetchData();
  };

  const handleMarcarPago = async (pagamento: Pagamento) => {
    const { error } = await supabase
      .from("pagamentos")
      .update({ status: "pago", data_pagamento: new Date().toISOString().split("T")[0] })
      .eq("id", pagamento.id);

    if (error) {
      toast.error("Erro ao marcar como pago");
      return;
    }
    toast.success("Pagamento confirmado!");
    fetchData();
  };

  const kpis = [
    { title: "Receita Total", value: formatCurrency(totalReceita), icon: DollarSign, color: "text-green-500", bgColor: "bg-green-500/10" },
    { title: "Pendente", value: formatCurrency(totalPendente), icon: Clock, color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
    { title: "Inadimplência", value: formatCurrency(totalAtrasado), icon: AlertTriangle, color: "text-red-500", bgColor: "bg-red-500/10" },
    { title: "Ticket Médio", value: formatCurrency(ticketMedio), icon: Receipt, color: "text-purple-500", bgColor: "bg-purple-500/10" },
  ];

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Painel Financeiro</h1>
          <p className="text-muted-foreground">Acompanhe receitas, pagamentos e inadimplência</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData}>
            <Download className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
          <Button className="bg-rose-500 hover:bg-rose-600" onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Pagamento
          </Button>
        </div>
      </motion.div>

      {/* KPIs */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <motion.div key={kpi.title} variants={itemVariants} whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                    <p className="text-2xl font-bold">{kpi.value}</p>
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
              <CardDescription>Distribuição da receita recebida</CardDescription>
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
                  <span className="font-semibold">Total Recebido</span>
                  <span className="text-xl font-bold text-green-500">{formatCurrency(totalReceita)}</span>
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
              <CardDescription>Pagamentos em atraso</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {inadimplentes.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">Nenhum pagamento atrasado 🎉</p>
              ) : (
                inadimplentes.slice(0, 5).map((p) => (
                  <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
                      <Building2 className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{p.escola_nome}</p>
                      <p className="text-xs text-muted-foreground">
                        Venc: {new Date(p.data_vencimento).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-red-500">{formatCurrency(p.valor)}</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Pagamentos Recentes */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-blue-500" />
              Todos os Pagamentos
            </CardTitle>
            <CardDescription>{pagamentos.length} registros</CardDescription>
          </CardHeader>
          <CardContent>
            {pagamentos.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Nenhum pagamento registrado ainda.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Escola</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagamentos.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.escola_nome}</TableCell>
                      <TableCell>
                        <Badge className={getPlanoColor(p.escola_plano)}>{p.escola_plano}</Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(p.valor)}</TableCell>
                      <TableCell>{new Date(p.data_vencimento).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(p.status)} flex items-center gap-1 w-fit`}>
                          {p.status === "pago" ? <CheckCircle className="h-3 w-3" /> :
                           p.status === "pendente" ? <Clock className="h-3 w-3" /> :
                           <AlertTriangle className="h-3 w-3" />}
                          {getStatusLabel(p.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {p.status !== "pago" && p.status !== "cancelado" && (
                          <Button size="sm" variant="outline" onClick={() => handleMarcarPago(p)}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Confirmar
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Dialog Novo Pagamento */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Pagamento</DialogTitle>
            <DialogDescription>Registre um pagamento ou cobrança para uma escola.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Escola *</Label>
              <Select value={formData.escola_id} onValueChange={(v) => setFormData({ ...formData, escola_id: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a escola" />
                </SelectTrigger>
                <SelectContent>
                  {escolas.map((e) => (
                    <SelectItem key={e.id} value={e.id}>{e.nome} ({e.plano})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valor (R$) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label>Vencimento *</Label>
                <Input
                  type="date"
                  value={formData.data_vencimento}
                  onChange={(e) => setFormData({ ...formData, data_vencimento: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="pago">Pago</SelectItem>
                    <SelectItem value="atrasado">Atrasado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Método</Label>
                <Input
                  value={formData.metodo_pagamento}
                  onChange={(e) => setFormData({ ...formData, metodo_pagamento: e.target.value })}
                  placeholder="PIX, Boleto..."
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Referência</Label>
              <Input
                value={formData.referencia}
                onChange={(e) => setFormData({ ...formData, referencia: e.target.value })}
                placeholder="Mensalidade 02/2026..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} className="bg-rose-500 hover:bg-rose-600">Registrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

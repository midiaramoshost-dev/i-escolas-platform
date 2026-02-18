import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import {
  Receipt,
  Plus,
  Send,
  Settings2,
  Building2,
  CheckCircle,
  Clock,
  AlertTriangle,
  Loader2,
  Key,
  Eye,
  EyeOff,
  Zap,
  Calendar,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// ── Types ──────────────────────────────────────────────
interface Escola {
  id: string;
  nome: string;
  plano: string;
  status: string;
}

interface Cobranca {
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

interface GatewayConfig {
  id: string;
  name: string;
  logo: string;
  enabled: boolean;
  apiKey: string;
  secretKey: string;
  sandbox: boolean;
}

// ── Helpers ────────────────────────────────────────────
const formatCurrency = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const PLANO_PRECOS: Record<string, number> = {
  free: 0,
  start: 199,
  pro: 399,
  premium: 699,
};

const getStatusBadge = (status: string) => {
  const map: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
    pago: { label: "Pago", className: "bg-green-500/10 text-green-500", icon: <CheckCircle className="h-3 w-3" /> },
    pendente: { label: "Pendente", className: "bg-yellow-500/10 text-yellow-500", icon: <Clock className="h-3 w-3" /> },
    atrasado: { label: "Atrasado", className: "bg-red-500/10 text-red-500", icon: <AlertTriangle className="h-3 w-3" /> },
  };
  const s = map[status] || { label: status, className: "bg-muted text-muted-foreground", icon: null };
  return (
    <Badge className={`${s.className} flex items-center gap-1 w-fit`}>
      {s.icon}{s.label}
    </Badge>
  );
};

const GATEWAYS_KEY = "iescolas_payment_gateways";

const defaultGateways: GatewayConfig[] = [
  { id: "mercadopago", name: "Mercado Pago", logo: "🟡", enabled: false, apiKey: "", secretKey: "", sandbox: true },
  { id: "asaas", name: "Asaas", logo: "🔵", enabled: false, apiKey: "", secretKey: "", sandbox: true },
  { id: "stripe", name: "Stripe", logo: "💳", enabled: false, apiKey: "", secretKey: "", sandbox: true },
  { id: "pagseguro", name: "PagSeguro", logo: "🟢", enabled: false, apiKey: "", secretKey: "", sandbox: true },
];

// ── Main Component ─────────────────────────────────────
export default function AdminCobrancas() {
  const [loading, setLoading] = useState(true);
  const [escolas, setEscolas] = useState<Escola[]>([]);
  const [cobrancas, setCobrancas] = useState<Cobranca[]>([]);
  const [gateways, setGateways] = useState<GatewayConfig[]>([]);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  // Dialogs
  const [gerarDialog, setGerarDialog] = useState(false);
  const [gerarForm, setGerarForm] = useState({
    modo: "individual" as "individual" | "lote",
    escola_id: "",
    mes_referencia: new Date().toISOString().slice(0, 7),
    observacoes: "",
  });
  const [generating, setGenerating] = useState(false);

  // ── Data fetching ──
  const fetchData = useCallback(async () => {
    setLoading(true);
    const [escRes, pagRes] = await Promise.all([
      supabase.from("escolas").select("id, nome, plano, status").order("nome"),
      supabase.from("pagamentos").select("*, escolas(nome, plano)").order("data_vencimento", { ascending: false }),
    ]);
    if (escRes.data) setEscolas(escRes.data);
    if (pagRes.data) {
      setCobrancas(
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
    // Gateways from localStorage
    const saved = localStorage.getItem(GATEWAYS_KEY);
    setGateways(saved ? JSON.parse(saved) : defaultGateways);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Save gateways ──
  const saveGateways = (updated: GatewayConfig[]) => {
    setGateways(updated);
    localStorage.setItem(GATEWAYS_KEY, JSON.stringify(updated));
    toast.success("Configurações de gateway salvas!");
  };

  const updateGateway = (id: string, field: keyof GatewayConfig, value: any) => {
    setGateways((prev) =>
      prev.map((g) => (g.id === id ? { ...g, [field]: value } : g))
    );
  };

  // ── Generate charges ──
  const handleGerarCobrancas = async () => {
    setGenerating(true);
    const mesRef = gerarForm.mes_referencia;
    const [ano, mes] = mesRef.split("-");
    const vencimento = `${ano}-${mes}-10`;

    let targets: Escola[] = [];
    if (gerarForm.modo === "individual") {
      const e = escolas.find((e) => e.id === gerarForm.escola_id);
      if (e) targets = [e];
    } else {
      targets = escolas.filter((e) => e.status === "ativo" && e.plano.toLowerCase() !== "free");
    }

    if (targets.length === 0) {
      toast.error("Nenhuma escola elegível encontrada");
      setGenerating(false);
      return;
    }

    // Check for existing charges in the same month
    const { data: existing } = await supabase
      .from("pagamentos")
      .select("escola_id")
      .gte("data_vencimento", `${ano}-${mes}-01`)
      .lte("data_vencimento", `${ano}-${mes}-28`);

    const existingIds = new Set(existing?.map((e: any) => e.escola_id) || []);
    const newTargets = targets.filter((t) => !existingIds.has(t.id));

    if (newTargets.length === 0) {
      toast.info("Todas as cobranças já foram geradas para este mês");
      setGenerating(false);
      return;
    }

    const inserts = newTargets.map((e) => ({
      escola_id: e.id,
      valor: PLANO_PRECOS[e.plano.toLowerCase()] || 0,
      data_vencimento: vencimento,
      status: "pendente" as any,
      referencia: `Mensalidade ${mes}/${ano} - Plano ${e.plano}`,
      observacoes: gerarForm.observacoes || null,
    }));

    const { error } = await supabase.from("pagamentos").insert(inserts);
    if (error) {
      toast.error("Erro ao gerar cobranças");
      console.error(error);
    } else {
      toast.success(`${newTargets.length} cobrança(s) gerada(s) com sucesso!`);
      setGerarDialog(false);
      fetchData();
    }
    setGenerating(false);
  };

  // ── Mark as paid ──
  const handleMarcarPago = async (id: string) => {
    const { error } = await supabase
      .from("pagamentos")
      .update({ status: "pago", data_pagamento: new Date().toISOString().split("T")[0] })
      .eq("id", id);
    if (error) { toast.error("Erro ao confirmar"); return; }
    toast.success("Pagamento confirmado!");
    fetchData();
  };

  // ── KPIs ──
  const totalGerado = cobrancas.reduce((a, c) => a + c.valor, 0);
  const totalPago = cobrancas.filter((c) => c.status === "pago").reduce((a, c) => a + c.valor, 0);
  const totalPendente = cobrancas.filter((c) => c.status === "pendente").reduce((a, c) => a + c.valor, 0);
  const totalAtrasado = cobrancas.filter((c) => c.status === "atrasado").reduce((a, c) => a + c.valor, 0);
  const gatewaysAtivos = gateways.filter((g) => g.enabled).length;

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
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
          <h1 className="text-2xl font-bold text-foreground">Cobranças & Gateways</h1>
          <p className="text-muted-foreground">Gere cobranças para escolas e configure APIs de recebimento</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
          <Button className="bg-rose-500 hover:bg-rose-600" onClick={() => setGerarDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Gerar Cobranças
          </Button>
        </div>
      </motion.div>

      {/* KPIs */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[
          { title: "Total Gerado", value: formatCurrency(totalGerado), icon: Receipt, color: "text-blue-500", bg: "bg-blue-500/10" },
          { title: "Recebido", value: formatCurrency(totalPago), icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/10" },
          { title: "Pendente", value: formatCurrency(totalPendente), icon: Clock, color: "text-yellow-500", bg: "bg-yellow-500/10" },
          { title: "Atrasado", value: formatCurrency(totalAtrasado), icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10" },
          { title: "Gateways Ativos", value: `${gatewaysAtivos}/4`, icon: Key, color: "text-purple-500", bg: "bg-purple-500/10" },
        ].map((kpi) => (
          <Card key={kpi.title}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                  <p className="text-xl font-bold">{kpi.value}</p>
                </div>
                <div className={`rounded-full p-3 ${kpi.bg}`}>
                  <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="cobrancas">
          <TabsList>
            <TabsTrigger value="cobrancas" className="gap-2">
              <Receipt className="h-4 w-4" />
              Cobranças
            </TabsTrigger>
            <TabsTrigger value="gateways" className="gap-2">
              <Settings2 className="h-4 w-4" />
              Gateways de Pagamento
            </TabsTrigger>
          </TabsList>

          {/* ── Tab: Cobranças ── */}
          <TabsContent value="cobrancas" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-rose-500" />
                  Cobranças Geradas
                </CardTitle>
                <CardDescription>{cobrancas.length} registros</CardDescription>
              </CardHeader>
              <CardContent>
                {cobrancas.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Nenhuma cobrança gerada ainda. Clique em "Gerar Cobranças" para começar.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Escola</TableHead>
                          <TableHead>Plano</TableHead>
                          <TableHead>Valor</TableHead>
                          <TableHead>Referência</TableHead>
                          <TableHead>Vencimento</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cobrancas.map((c) => (
                          <TableRow key={c.id}>
                            <TableCell className="font-medium">{c.escola_nome}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{c.escola_plano}</Badge>
                            </TableCell>
                            <TableCell>{formatCurrency(c.valor)}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{c.referencia || "—"}</TableCell>
                            <TableCell>{new Date(c.data_vencimento).toLocaleDateString("pt-BR")}</TableCell>
                            <TableCell>{getStatusBadge(c.status)}</TableCell>
                            <TableCell className="text-right">
                              {c.status !== "pago" && c.status !== "cancelado" && (
                                <Button size="sm" variant="outline" onClick={() => handleMarcarPago(c.id)}>
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Confirmar
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Tab: Gateways ── */}
          <TabsContent value="gateways" className="mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Configurar Gateways de Pagamento</h3>
                  <p className="text-sm text-muted-foreground">Insira as chaves API dos provedores que deseja utilizar para receber pagamentos.</p>
                </div>
                <Button onClick={() => saveGateways(gateways)} className="bg-rose-500 hover:bg-rose-600">
                  Salvar Configurações
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {gateways.map((gw) => (
                  <Card key={gw.id} className={gw.enabled ? "border-primary/30" : ""}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <span className="text-2xl">{gw.logo}</span>
                          {gw.name}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`switch-${gw.id}`} className="text-xs text-muted-foreground">
                            {gw.enabled ? "Ativo" : "Inativo"}
                          </Label>
                          <Switch
                            id={`switch-${gw.id}`}
                            checked={gw.enabled}
                            onCheckedChange={(v) => updateGateway(gw.id, "enabled", v)}
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Chave Pública / API Key</Label>
                        <div className="flex gap-2">
                          <Input
                            type={showSecrets[`${gw.id}-api`] ? "text" : "password"}
                            value={gw.apiKey}
                            onChange={(e) => updateGateway(gw.id, "apiKey", e.target.value)}
                            placeholder={`${gw.name} API Key`}
                            disabled={!gw.enabled}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowSecrets((p) => ({ ...p, [`${gw.id}-api`]: !p[`${gw.id}-api`] }))}
                          >
                            {showSecrets[`${gw.id}-api`] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Chave Secreta / Secret Key</Label>
                        <div className="flex gap-2">
                          <Input
                            type={showSecrets[`${gw.id}-secret`] ? "text" : "password"}
                            value={gw.secretKey}
                            onChange={(e) => updateGateway(gw.id, "secretKey", e.target.value)}
                            placeholder={`${gw.name} Secret Key`}
                            disabled={!gw.enabled}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowSecrets((p) => ({ ...p, [`${gw.id}-secret`]: !p[`${gw.id}-secret`] }))}
                          >
                            {showSecrets[`${gw.id}-secret`] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <Switch
                          id={`sandbox-${gw.id}`}
                          checked={gw.sandbox}
                          onCheckedChange={(v) => updateGateway(gw.id, "sandbox", v)}
                          disabled={!gw.enabled}
                        />
                        <Label htmlFor={`sandbox-${gw.id}`} className="text-xs text-muted-foreground">
                          Modo Sandbox (testes)
                        </Label>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* ── Dialog: Gerar Cobranças ── */}
      <Dialog open={gerarDialog} onOpenChange={setGerarDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-rose-500" />
              Gerar Cobranças
            </DialogTitle>
            <DialogDescription>
              Gere cobranças automaticamente para todas as escolas ativas ou selecione uma escola específica.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Modo de Geração</Label>
              <Select value={gerarForm.modo} onValueChange={(v: any) => setGerarForm({ ...gerarForm, modo: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lote">
                    <div className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Em lote (todas as escolas ativas com plano pago)
                    </div>
                  </SelectItem>
                  <SelectItem value="individual">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Individual (selecionar escola)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {gerarForm.modo === "individual" && (
              <div className="space-y-2">
                <Label>Escola</Label>
                <Select value={gerarForm.escola_id} onValueChange={(v) => setGerarForm({ ...gerarForm, escola_id: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a escola" />
                  </SelectTrigger>
                  <SelectContent>
                    {escolas.map((e) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.nome} ({e.plano})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label>Mês de Referência</Label>
              <Input
                type="month"
                value={gerarForm.mes_referencia}
                onChange={(e) => setGerarForm({ ...gerarForm, mes_referencia: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Observações (opcional)</Label>
              <Textarea
                value={gerarForm.observacoes}
                onChange={(e) => setGerarForm({ ...gerarForm, observacoes: e.target.value })}
                placeholder="Informações adicionais..."
                rows={2}
              />
            </div>

            {gerarForm.modo === "lote" && (
              <div className="rounded-lg border p-3 bg-muted/50">
                <p className="text-sm font-medium mb-1">Resumo:</p>
                <p className="text-xs text-muted-foreground">
                  {escolas.filter((e) => e.status === "ativo" && e.plano.toLowerCase() !== "free").length} escola(s) elegíveis serão cobradas com base no valor do plano.
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGerarDialog(false)}>Cancelar</Button>
            <Button onClick={handleGerarCobrancas} disabled={generating} className="bg-rose-500 hover:bg-rose-600">
              {generating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Zap className="h-4 w-4 mr-2" />}
              Gerar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

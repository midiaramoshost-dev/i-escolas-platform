import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Mail,
  Phone,
  Users,
  Clock,
  DollarSign,
  Target,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
} from "lucide-react";

interface MetricasCobrancaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data for metrics
const kpisCobranca = {
  totalRecuperado: 45680,
  metaMensal: 60000,
  taxaSucessoGeral: 68,
  tempoMedioResposta: 2.3,
  contatosRealizados: 156,
  acordosFechados: 42,
  inadimplentesAtivos: 23,
  ticketMedio: 1088,
};

const successByChannel = [
  { canal: "WhatsApp", enviados: 89, respondidos: 72, acordos: 28, taxa: 81, cor: "#25D366" },
  { canal: "E-mail", enviados: 45, respondidos: 18, acordos: 8, taxa: 40, cor: "#EA4335" },
  { canal: "Telefone", enviados: 22, respondidos: 19, acordos: 6, taxa: 86, cor: "#4285F4" },
];

const evolutionData = [
  { mes: "Jul", recuperado: 28500, meta: 50000, taxa: 57, contatos: 98 },
  { mes: "Ago", recuperado: 32100, meta: 52000, taxa: 62, contatos: 112 },
  { mes: "Set", recuperado: 38900, meta: 55000, taxa: 71, contatos: 134 },
  { mes: "Out", recuperado: 41200, meta: 58000, taxa: 71, contatos: 145 },
  { mes: "Nov", recuperado: 43500, meta: 58000, taxa: 75, contatos: 152 },
  { mes: "Dez", recuperado: 45680, meta: 60000, taxa: 76, contatos: 156 },
];

const responseTimeByChannel = [
  { canal: "WhatsApp", tempo: 1.2, meta: 2 },
  { canal: "E-mail", tempo: 4.8, meta: 24 },
  { canal: "Telefone", tempo: 0.5, meta: 1 },
];

const statusNegociacao = [
  { name: "Acordo Fechado", value: 42, color: "#22c55e" },
  { name: "Em Negociação", value: 18, color: "#eab308" },
  { name: "Sem Resposta", value: 12, color: "#ef4444" },
  { name: "Recusado", value: 5, color: "#6b7280" },
];

const topRecuperadores = [
  { nome: "Maria Silva", recuperado: 12500, acordos: 15, taxa: 78 },
  { nome: "João Santos", recuperado: 10200, acordos: 12, taxa: 72 },
  { nome: "Ana Costa", recuperado: 9800, acordos: 10, taxa: 68 },
  { nome: "Pedro Lima", recuperado: 8180, acordos: 8, taxa: 62 },
];

const formatCurrency = (value: number) => {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

export function MetricasCobrancaDialog({
  open,
  onOpenChange,
}: MetricasCobrancaDialogProps) {
  const [periodo, setPeriodo] = useState("mes");

  const progressoMeta = (kpisCobranca.totalRecuperado / kpisCobranca.metaMensal) * 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <BarChart3 className="h-6 w-6 text-primary" />
                Métricas de Cobrança
              </DialogTitle>
              <DialogDescription>
                Acompanhe a performance das ações de recuperação de crédito
              </DialogDescription>
            </div>
            <Select value={periodo} onValueChange={setPeriodo}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semana">Última Semana</SelectItem>
                <SelectItem value="mes">Este Mês</SelectItem>
                <SelectItem value="trimestre">Trimestre</SelectItem>
                <SelectItem value="ano">Este Ano</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* KPIs Principais */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Valor Recuperado</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(kpisCobranca.totalRecuperado)}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <TrendingUp className="h-3 w-3" />
                      +12% vs mês anterior
                    </div>
                  </div>
                  <div className="rounded-full p-3 bg-green-500/10">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
                    <p className="text-2xl font-bold text-primary">
                      {kpisCobranca.taxaSucessoGeral}%
                    </p>
                    <div className="flex items-center gap-1 text-xs text-primary">
                      <TrendingUp className="h-3 w-3" />
                      +5% vs mês anterior
                    </div>
                  </div>
                  <div className="rounded-full p-3 bg-primary/10">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Tempo Médio Resposta</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {kpisCobranca.tempoMedioResposta}h
                    </p>
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <TrendingDown className="h-3 w-3" />
                      -0.5h vs mês anterior
                    </div>
                  </div>
                  <div className="rounded-full p-3 bg-blue-500/10">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Acordos Fechados</p>
                    <p className="text-2xl font-bold">
                      {kpisCobranca.acordosFechados}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      de {kpisCobranca.contatosRealizados} contatos
                    </p>
                  </div>
                  <div className="rounded-full p-3 bg-muted">
                    <CheckCircle className="h-6 w-6 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progresso da Meta */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium">Progresso da Meta Mensal</p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(kpisCobranca.totalRecuperado)} de {formatCurrency(kpisCobranca.metaMensal)}
                  </p>
                </div>
                <Badge variant={progressoMeta >= 100 ? "default" : "secondary"} className={progressoMeta >= 100 ? "bg-green-500" : ""}>
                  {progressoMeta.toFixed(0)}%
                </Badge>
              </div>
              <Progress value={Math.min(progressoMeta, 100)} className="h-3" />
              <p className="text-xs text-muted-foreground mt-2">
                Faltam {formatCurrency(Math.max(0, kpisCobranca.metaMensal - kpisCobranca.totalRecuperado))} para atingir a meta
              </p>
            </CardContent>
          </Card>

          <Tabs defaultValue="canais" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="canais">Por Canal</TabsTrigger>
              <TabsTrigger value="evolucao">Evolução</TabsTrigger>
              <TabsTrigger value="status">Status</TabsTrigger>
              <TabsTrigger value="equipe">Equipe</TabsTrigger>
            </TabsList>

            {/* Taxa de Sucesso por Canal */}
            <TabsContent value="canais" className="space-y-4 mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Taxa de Sucesso por Canal</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={successByChannel} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                          <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                          <YAxis type="category" dataKey="canal" width={80} />
                          <Tooltip formatter={(value) => `${value}%`} />
                          <Bar dataKey="taxa" radius={[0, 4, 4, 0]}>
                            {successByChannel.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.cor} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Detalhamento por Canal</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {successByChannel.map((canal) => (
                        <div key={canal.canal} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {canal.canal === "WhatsApp" && <MessageSquare className="h-4 w-4" style={{ color: canal.cor }} />}
                              {canal.canal === "E-mail" && <Mail className="h-4 w-4" style={{ color: canal.cor }} />}
                              {canal.canal === "Telefone" && <Phone className="h-4 w-4" style={{ color: canal.cor }} />}
                              <span className="font-medium">{canal.canal}</span>
                            </div>
                            <Badge style={{ backgroundColor: `${canal.cor}20`, color: canal.cor }}>
                              {canal.taxa}% sucesso
                            </Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div className="text-center p-2 rounded bg-muted/50">
                              <p className="text-muted-foreground text-xs">Enviados</p>
                              <p className="font-semibold">{canal.enviados}</p>
                            </div>
                            <div className="text-center p-2 rounded bg-muted/50">
                              <p className="text-muted-foreground text-xs">Respondidos</p>
                              <p className="font-semibold">{canal.respondidos}</p>
                            </div>
                            <div className="text-center p-2 rounded bg-muted/50">
                              <p className="text-muted-foreground text-xs">Acordos</p>
                              <p className="font-semibold">{canal.acordos}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tempo de Resposta */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Tempo Médio de Resposta por Canal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    {responseTimeByChannel.map((canal) => {
                      const performancePercent = ((canal.meta - canal.tempo) / canal.meta) * 100;
                      const isGood = canal.tempo <= canal.meta;
                      
                      return (
                        <div key={canal.canal} className="p-4 rounded-lg border">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{canal.canal}</span>
                            {isGood ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            )}
                          </div>
                          <p className="text-2xl font-bold">{canal.tempo}h</p>
                          <p className="text-xs text-muted-foreground">
                            Meta: {canal.meta}h
                          </p>
                          <Progress 
                            value={isGood ? 100 : (canal.meta / canal.tempo) * 100} 
                            className="h-2 mt-2" 
                          />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Evolução Temporal */}
            <TabsContent value="evolucao" className="space-y-4 mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Valor Recuperado vs Meta</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={evolutionData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="mes" />
                          <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                          <Tooltip 
                            formatter={(value: number) => formatCurrency(value)}
                            labelFormatter={(label) => `Mês: ${label}`}
                          />
                          <Legend />
                          <Area 
                            type="monotone" 
                            dataKey="meta" 
                            stroke="hsl(var(--muted-foreground))" 
                            fill="hsl(var(--muted))" 
                            strokeDasharray="5 5"
                            name="Meta"
                          />
                          <Area 
                            type="monotone" 
                            dataKey="recuperado" 
                            stroke="hsl(var(--primary))" 
                            fill="hsl(var(--primary) / 0.3)" 
                            name="Recuperado"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Taxa de Sucesso ao Longo do Tempo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={evolutionData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="mes" />
                          <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                          <Tooltip formatter={(value) => `${value}%`} />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="taxa" 
                            stroke="#22c55e" 
                            strokeWidth={2}
                            dot={{ fill: "#22c55e" }}
                            name="Taxa de Sucesso"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Volume de Contatos Realizados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={evolutionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mes" />
                        <YAxis />
                        <Tooltip />
                        <Bar 
                          dataKey="contatos" 
                          fill="hsl(var(--primary))" 
                          radius={[4, 4, 0, 0]}
                          name="Contatos"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Status das Negociações */}
            <TabsContent value="status" className="space-y-4 mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Distribuição por Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statusNegociacao}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={2}
                            dataKey="value"
                            label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                          >
                            {statusNegociacao.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Detalhamento por Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {statusNegociacao.map((status) => {
                        const total = statusNegociacao.reduce((acc, s) => acc + s.value, 0);
                        const percent = (status.value / total) * 100;
                        
                        return (
                          <div key={status.name} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: status.color }}
                                />
                                <span>{status.name}</span>
                              </div>
                              <span className="font-semibold">{status.value}</span>
                            </div>
                            <Progress 
                              value={percent} 
                              className="h-2"
                              style={{ 
                                ["--progress-background" as string]: status.color 
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-6 p-4 rounded-lg bg-muted/50">
                      <p className="text-sm font-medium mb-2">Resumo</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Total em Negociação</p>
                          <p className="font-semibold text-lg">{statusNegociacao.reduce((acc, s) => acc + s.value, 0)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Taxa de Conversão</p>
                          <p className="font-semibold text-lg text-green-600">
                            {((statusNegociacao[0].value / statusNegociacao.reduce((acc, s) => acc + s.value, 0)) * 100).toFixed(0)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Performance da Equipe */}
            <TabsContent value="equipe" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Ranking de Recuperação
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topRecuperadores.map((pessoa, index) => (
                      <div 
                        key={pessoa.nome} 
                        className="flex items-center gap-4 p-4 rounded-lg border"
                      >
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                          index === 0 ? "bg-yellow-500 text-white" :
                          index === 1 ? "bg-gray-400 text-white" :
                          index === 2 ? "bg-amber-700 text-white" :
                          "bg-muted text-muted-foreground"
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{pessoa.nome}</p>
                          <p className="text-sm text-muted-foreground">
                            {pessoa.acordos} acordos fechados
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">
                            {formatCurrency(pessoa.recuperado)}
                          </p>
                          <Badge variant="secondary" className="text-xs">
                            {pessoa.taxa}% sucesso
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <Card className="bg-muted/50">
                      <CardContent className="p-4 text-center">
                        <p className="text-sm text-muted-foreground">Total Recuperado</p>
                        <p className="text-xl font-bold text-green-600">
                          {formatCurrency(topRecuperadores.reduce((acc, p) => acc + p.recuperado, 0))}
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/50">
                      <CardContent className="p-4 text-center">
                        <p className="text-sm text-muted-foreground">Total Acordos</p>
                        <p className="text-xl font-bold">
                          {topRecuperadores.reduce((acc, p) => acc + p.acordos, 0)}
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/50">
                      <CardContent className="p-4 text-center">
                        <p className="text-sm text-muted-foreground">Ticket Médio</p>
                        <p className="text-xl font-bold">
                          {formatCurrency(kpisCobranca.ticketMedio)}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Cell,
} from "recharts";
import {
  Trophy, TrendingDown, TrendingUp, Users, AlertTriangle, ArrowUpRight, ArrowDownRight,
  Medal, Target, BookOpen, GraduationCap, BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// ── Mock Data ──────────────────────────────────────────────────
const rankingTurmas = [
  { turma: "5º Ano A", media: 8.7, frequencia: 96, aprovacao: 98, posicao: 1, variacao: 0 },
  { turma: "3º Ano A", media: 8.5, frequencia: 95, aprovacao: 97, posicao: 2, variacao: 1 },
  { turma: "1º Ano A", media: 8.2, frequencia: 94, aprovacao: 96, posicao: 3, variacao: -1 },
  { turma: "3º EM A", media: 7.9, frequencia: 92, aprovacao: 94, posicao: 4, variacao: 2 },
  { turma: "7º Ano B", media: 7.5, frequencia: 90, aprovacao: 91, posicao: 5, variacao: 0 },
  { turma: "4º Ano A", media: 7.3, frequencia: 89, aprovacao: 90, posicao: 6, variacao: -2 },
  { turma: "9º Ano A", media: 6.8, frequencia: 85, aprovacao: 86, posicao: 7, variacao: -1 },
  { turma: "4º Ano B", media: 6.5, frequencia: 83, aprovacao: 84, posicao: 8, variacao: 0 },
  { turma: "2º Ano A", media: 8.0, frequencia: 93, aprovacao: 95, posicao: 9, variacao: 3 },
];

const rankingAlunos = [
  { nome: "Carolina Mendes", turma: "7º Ano B", media: 9.6, posicao: 1 },
  { nome: "Eduarda Lima", turma: "3º Ano A", media: 9.4, posicao: 2 },
  { nome: "Ana Beatriz Silva", turma: "5º Ano A", media: 9.1, posicao: 3 },
  { nome: "Felipe Almeida", turma: "1º Ano A", media: 8.9, posicao: 4 },
  { nome: "Gabriela Ferreira", turma: "3º EM A", media: 8.7, posicao: 5 },
  { nome: "Marina Almeida", turma: "4º Ano B", media: 8.5, posicao: 6 },
  { nome: "Lucas Mendes", turma: "4º Ano A", media: 8.3, posicao: 7 },
  { nome: "Bruno Costa Santos", turma: "5º Ano A", media: 7.8, posicao: 8 },
  { nome: "Henrique Souza", turma: "7º Ano B", media: 7.2, posicao: 9 },
  { nome: "Daniel Oliveira", turma: "9º Ano A", media: 5.8, posicao: 10 },
];

const comparativoTurmas = [
  { disciplina: "Português", "5º Ano A": 8.5, "7º Ano B": 7.8, "9º Ano A": 6.2, "3º EM A": 7.5 },
  { disciplina: "Matemática", "5º Ano A": 9.0, "7º Ano B": 6.5, "9º Ano A": 5.8, "3º EM A": 7.0 },
  { disciplina: "Ciências", "5º Ano A": 8.2, "7º Ano B": 8.0, "9º Ano A": 6.5, "3º EM A": 7.8 },
  { disciplina: "História", "5º Ano A": 8.8, "7º Ano B": 7.2, "9º Ano A": 7.0, "3º EM A": 8.2 },
  { disciplina: "Geografia", "5º Ano A": 8.0, "7º Ano B": 7.5, "9º Ano A": 6.8, "3º EM A": 7.6 },
  { disciplina: "Inglês", "5º Ano A": 9.2, "7º Ano B": 6.8, "9º Ano A": 5.5, "3º EM A": 8.0 },
];

const radarData = [
  { subject: "Português", A: 8.5, B: 7.0, fullMark: 10 },
  { subject: "Matemática", A: 9.0, B: 6.5, fullMark: 10 },
  { subject: "Ciências", A: 8.2, B: 7.5, fullMark: 10 },
  { subject: "História", A: 8.8, B: 7.0, fullMark: 10 },
  { subject: "Geografia", A: 8.0, B: 7.2, fullMark: 10 },
  { subject: "Inglês", A: 9.2, B: 6.0, fullMark: 10 },
];

const evasaoMensal = [
  { mes: "Jan", taxa: 0.5, alunos: 6 },
  { mes: "Fev", taxa: 0.3, alunos: 4 },
  { mes: "Mar", taxa: 0.8, alunos: 10 },
  { mes: "Abr", taxa: 1.2, alunos: 15 },
  { mes: "Mai", taxa: 0.6, alunos: 7 },
  { mes: "Jun", taxa: 1.5, alunos: 19 },
  { mes: "Jul", taxa: 2.0, alunos: 25 },
  { mes: "Ago", taxa: 0.9, alunos: 11 },
  { mes: "Set", taxa: 0.7, alunos: 9 },
  { mes: "Out", taxa: 1.0, alunos: 12 },
  { mes: "Nov", taxa: 0.4, alunos: 5 },
  { mes: "Dez", taxa: 0.2, alunos: 2 },
];

const evasaoPorSerie = [
  { serie: "1º Ano", taxa: 0.5, cor: "hsl(var(--primary))" },
  { serie: "2º Ano", taxa: 0.8, cor: "hsl(var(--primary))" },
  { serie: "3º Ano", taxa: 0.3, cor: "hsl(var(--primary))" },
  { serie: "4º Ano", taxa: 1.2, cor: "hsl(var(--primary))" },
  { serie: "5º Ano", taxa: 0.6, cor: "hsl(var(--primary))" },
  { serie: "6º Ano", taxa: 2.1, cor: "hsl(var(--destructive))" },
  { serie: "7º Ano", taxa: 2.8, cor: "hsl(var(--destructive))" },
  { serie: "8º Ano", taxa: 3.5, cor: "hsl(var(--destructive))" },
  { serie: "9º Ano", taxa: 4.2, cor: "hsl(var(--destructive))" },
  { serie: "1º EM", taxa: 5.0, cor: "hsl(var(--destructive))" },
  { serie: "2º EM", taxa: 3.8, cor: "hsl(var(--destructive))" },
  { serie: "3º EM", taxa: 2.5, cor: "hsl(var(--primary))" },
];

const motivosEvasao = [
  { motivo: "Financeiro", quantidade: 42, percentual: 33.6 },
  { motivo: "Mudança de cidade", quantidade: 28, percentual: 22.4 },
  { motivo: "Baixo desempenho", quantidade: 18, percentual: 14.4 },
  { motivo: "Transferência", quantidade: 22, percentual: 17.6 },
  { motivo: "Outros", quantidade: 15, percentual: 12.0 },
];

const evolucaoDesempenho = [
  { bimestre: "1º Bim", media: 7.2, frequencia: 93, aprovacao: 91 },
  { bimestre: "2º Bim", media: 7.5, frequencia: 92, aprovacao: 92 },
  { bimestre: "3º Bim", media: 7.8, frequencia: 91, aprovacao: 93 },
  { bimestre: "4º Bim", media: 7.6, frequencia: 90, aprovacao: 92 },
];

const PIE_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

// ── Component ──────────────────────────────────────────────────
export default function DashboardAnalitico() {
  const [turmaCompare1, setTurmaCompare1] = useState("5º Ano A");
  const [turmaCompare2, setTurmaCompare2] = useState("9º Ano A");

  const getMedalColor = (pos: number) => {
    if (pos === 1) return "text-yellow-500";
    if (pos === 2) return "text-gray-400";
    if (pos === 3) return "text-amber-700";
    return "text-muted-foreground";
  };

  const getVariacaoIcon = (v: number) => {
    if (v > 0) return <ArrowUpRight className="h-4 w-4 text-green-500" />;
    if (v < 0) return <ArrowDownRight className="h-4 w-4 text-destructive" />;
    return <span className="text-xs text-muted-foreground">—</span>;
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Média Geral", value: "7.8", sub: "+0.3 vs bimestre anterior", icon: Target, trend: "up" },
          { title: "Taxa de Aprovação", value: "92.4%", sub: "+1.2% vs ano anterior", icon: GraduationCap, trend: "up" },
          { title: "Taxa de Evasão", value: "2.1%", sub: "-0.5% vs ano anterior", icon: TrendingDown, trend: "down" },
          { title: "Alunos em Risco", value: "23", sub: "3 críticos, 20 em alerta", icon: AlertTriangle, trend: "neutral" },
        ].map((kpi, i) => (
          <motion.div key={kpi.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-muted">
                  <kpi.icon className={`h-5 w-5 ${kpi.trend === "up" ? "text-green-500" : kpi.trend === "down" ? "text-green-500" : "text-amber-500"}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{kpi.title}</p>
                  <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground">{kpi.sub}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="rankings" className="space-y-4">
        <TabsList className="flex-wrap">
          <TabsTrigger value="rankings">Rankings</TabsTrigger>
          <TabsTrigger value="comparativo">Comparativo</TabsTrigger>
          <TabsTrigger value="evasao">Evasão</TabsTrigger>
          <TabsTrigger value="evolucao">Evolução</TabsTrigger>
        </TabsList>

        {/* ── Rankings ── */}
        <TabsContent value="rankings" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Ranking Turmas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5 text-yellow-500" /> Ranking de Turmas</CardTitle>
                <CardDescription>Classificação por média geral ponderada</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">#</TableHead>
                      <TableHead>Turma</TableHead>
                      <TableHead>Média</TableHead>
                      <TableHead>Freq.</TableHead>
                      <TableHead>Aprov.</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rankingTurmas.sort((a, b) => a.posicao - b.posicao).map((t) => (
                      <TableRow key={t.turma}>
                        <TableCell>
                          {t.posicao <= 3 ? <Medal className={`h-5 w-5 ${getMedalColor(t.posicao)}`} /> : <span className="text-muted-foreground font-medium">{t.posicao}</span>}
                        </TableCell>
                        <TableCell className="font-medium text-foreground">{t.turma}</TableCell>
                        <TableCell><Badge variant={t.media >= 7 ? "default" : "destructive"}>{t.media.toFixed(1)}</Badge></TableCell>
                        <TableCell className="text-muted-foreground">{t.frequencia}%</TableCell>
                        <TableCell className="text-muted-foreground">{t.aprovacao}%</TableCell>
                        <TableCell>{getVariacaoIcon(t.variacao)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Ranking Alunos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><GraduationCap className="h-5 w-5 text-primary" /> Top Alunos</CardTitle>
                <CardDescription>Maiores médias gerais do período</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">#</TableHead>
                      <TableHead>Aluno</TableHead>
                      <TableHead>Turma</TableHead>
                      <TableHead>Média</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rankingAlunos.map((a) => (
                      <TableRow key={a.nome}>
                        <TableCell>
                          {a.posicao <= 3 ? <Medal className={`h-5 w-5 ${getMedalColor(a.posicao)}`} /> : <span className="text-muted-foreground font-medium">{a.posicao}</span>}
                        </TableCell>
                        <TableCell className="font-medium text-foreground">{a.nome}</TableCell>
                        <TableCell className="text-muted-foreground">{a.turma}</TableCell>
                        <TableCell><Badge variant={a.media >= 7 ? "default" : "destructive"}>{a.media.toFixed(1)}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Comparativo ── */}
        <TabsContent value="comparativo" className="space-y-4">
          <div className="flex gap-3 items-center">
            <Select value={turmaCompare1} onValueChange={setTurmaCompare1}>
              <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["5º Ano A", "7º Ano B", "9º Ano A", "3º EM A"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
            <span className="text-muted-foreground font-medium">vs</span>
            <Select value={turmaCompare2} onValueChange={setTurmaCompare2}>
              <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["5º Ano A", "7º Ano B", "9º Ano A", "3º EM A"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" /> Comparativo por Disciplina</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={comparativoTurmas}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="disciplina" className="text-muted-foreground" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 10]} className="text-muted-foreground" tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                    <Legend />
                    <Bar dataKey={turmaCompare1} fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey={turmaCompare2} fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" /> Radar de Competências</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <RadarChart data={radarData}>
                    <PolarGrid className="stroke-border" />
                    <PolarAngleAxis dataKey="subject" className="text-muted-foreground" tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fontSize: 10 }} />
                    <Radar name={turmaCompare1} dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                    <Radar name={turmaCompare2} dataKey="B" stroke="hsl(var(--chart-3))" fill="hsl(var(--chart-3))" fillOpacity={0.3} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Detail comparison table */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhamento Comparativo</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Disciplina</TableHead>
                    <TableHead>{turmaCompare1}</TableHead>
                    <TableHead>{turmaCompare2}</TableHead>
                    <TableHead>Diferença</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comparativoTurmas.map((row) => {
                    const v1 = (row as Record<string, number | string>)[turmaCompare1] as number || 0;
                    const v2 = (row as Record<string, number | string>)[turmaCompare2] as number || 0;
                    const diff = v1 - v2;
                    return (
                      <TableRow key={row.disciplina}>
                        <TableCell className="font-medium text-foreground">{row.disciplina}</TableCell>
                        <TableCell>{v1.toFixed(1)}</TableCell>
                        <TableCell>{v2.toFixed(1)}</TableCell>
                        <TableCell className={diff > 0 ? "text-green-500 font-medium" : diff < 0 ? "text-destructive font-medium" : "text-muted-foreground"}>
                          {diff > 0 ? "+" : ""}{diff.toFixed(1)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Evasão ── */}
        <TabsContent value="evasao" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center space-y-1">
                <TrendingDown className="h-8 w-8 text-destructive mx-auto" />
                <p className="text-3xl font-bold text-foreground">125</p>
                <p className="text-sm text-muted-foreground">Evasões no ano</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center space-y-1">
                <Target className="h-8 w-8 text-amber-500 mx-auto" />
                <p className="text-3xl font-bold text-foreground">2.1%</p>
                <p className="text-sm text-muted-foreground">Taxa média de evasão</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center space-y-1">
                <Users className="h-8 w-8 text-primary mx-auto" />
                <p className="text-3xl font-bold text-foreground">9º Ano</p>
                <p className="text-sm text-muted-foreground">Maior taxa (4.2%)</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Evolução Mensal da Evasão</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={evasaoMensal}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="mes" className="text-muted-foreground" tick={{ fontSize: 11 }} />
                    <YAxis className="text-muted-foreground" tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                    <Area type="monotone" dataKey="taxa" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive))" fillOpacity={0.15} name="Taxa (%)" />
                    <Area type="monotone" dataKey="alunos" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.1} name="Alunos" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Evasão por Série</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={evasaoPorSerie} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis type="number" domain={[0, 6]} className="text-muted-foreground" tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="serie" width={60} className="text-muted-foreground" tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                    <Bar dataKey="taxa" name="Taxa (%)" radius={[0, 4, 4, 0]}>
                      {evasaoPorSerie.map((entry, index) => (
                        <Cell key={index} fill={entry.taxa > 2 ? "hsl(var(--destructive))" : "hsl(var(--primary))"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Motivos de Evasão</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-8">
                <ResponsiveContainer width="50%" height={220}>
                  <PieChart>
                    <Pie data={motivosEvasao} dataKey="quantidade" nameKey="motivo" cx="50%" cy="50%" outerRadius={80} label={false}>
                      {motivosEvasao.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 flex-1">
                  {motivosEvasao.map((m, i) => (
                    <div key={m.motivo} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                          <span className="text-foreground">{m.motivo}</span>
                        </span>
                        <span className="text-muted-foreground">{m.percentual}%</span>
                      </div>
                      <Progress value={m.percentual} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alunos com Risco de Evasão</CardTitle>
                <CardDescription>Identificados pelo sistema de IA</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Aluno</TableHead>
                      <TableHead>Turma</TableHead>
                      <TableHead>Risco</TableHead>
                      <TableHead>Indicador</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { nome: "Daniel Oliveira", turma: "9º Ano A", risco: 85, indicador: "Faltas + notas baixas" },
                      { nome: "Henrique Souza", turma: "7º Ano B", risco: 62, indicador: "Notas em queda" },
                      { nome: "Pedro Santos", turma: "4º Ano B", risco: 55, indicador: "Frequência irregular" },
                      { nome: "Larissa Costa", turma: "8º Ano A", risco: 48, indicador: "Desengajamento" },
                      { nome: "Rafael Lima", turma: "6º Ano A", risco: 42, indicador: "Faltas consecutivas" },
                    ].map((a) => (
                      <TableRow key={a.nome}>
                        <TableCell className="font-medium text-foreground">{a.nome}</TableCell>
                        <TableCell className="text-muted-foreground">{a.turma}</TableCell>
                        <TableCell>
                          <Badge variant={a.risco > 70 ? "destructive" : a.risco > 50 ? "secondary" : "outline"}>
                            {a.risco}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{a.indicador}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Evolução ── */}
        <TabsContent value="evolucao" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Evolução por Bimestre</CardTitle>
                <CardDescription>Média, frequência e aprovação ao longo do ano</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={evolucaoDesempenho}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="bimestre" className="text-muted-foreground" tick={{ fontSize: 11 }} />
                    <YAxis className="text-muted-foreground" tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                    <Legend />
                    <Line type="monotone" dataKey="media" stroke="hsl(var(--primary))" strokeWidth={2} name="Média" />
                    <Line type="monotone" dataKey="frequencia" stroke="hsl(var(--chart-2))" strokeWidth={2} name="Frequência (%)" />
                    <Line type="monotone" dataKey="aprovacao" stroke="hsl(var(--chart-3))" strokeWidth={2} name="Aprovação (%)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Indicadores por Série</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { serie: "Ensino Fundamental I", media: 8.2, freq: 94, aprov: 96 },
                    { serie: "Ensino Fundamental II", media: 7.3, freq: 89, aprov: 90 },
                    { serie: "Ensino Médio", media: 7.6, freq: 91, aprov: 93 },
                  ].map((s) => (
                    <div key={s.serie} className="p-4 rounded-lg bg-muted/50 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-foreground">{s.serie}</span>
                        <Badge>{s.media.toFixed(1)}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Frequência</span>
                          <Progress value={s.freq} className="h-2 mt-1" />
                          <span className="text-xs text-muted-foreground">{s.freq}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Aprovação</span>
                          <Progress value={s.aprov} className="h-2 mt-1" />
                          <span className="text-xs text-muted-foreground">{s.aprov}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

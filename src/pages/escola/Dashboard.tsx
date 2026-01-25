import {
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const statsCards = [
  {
    title: "Total de Alunos",
    value: "1.247",
    change: "+12",
    changeLabel: "este mês",
    trend: "up",
    icon: GraduationCap,
    color: "primary",
  },
  {
    title: "Professores Ativos",
    value: "48",
    change: "+2",
    changeLabel: "este mês",
    trend: "up",
    icon: Users,
    color: "info",
  },
  {
    title: "Turmas",
    value: "36",
    change: "0",
    changeLabel: "sem alterações",
    trend: "neutral",
    icon: BookOpen,
    color: "success",
  },
  {
    title: "Frequência Média",
    value: "94.2%",
    change: "-1.3%",
    changeLabel: "vs. mês anterior",
    trend: "down",
    icon: CheckCircle,
    color: "warning",
  },
];

const frequencyData = [
  { month: "Jan", frequencia: 96 },
  { month: "Fev", frequencia: 94 },
  { month: "Mar", frequencia: 95 },
  { month: "Abr", frequencia: 93 },
  { month: "Mai", frequencia: 94 },
  { month: "Jun", frequencia: 92 },
];

const performanceData = [
  { serie: "1º Ano", media: 7.8 },
  { serie: "2º Ano", media: 7.5 },
  { serie: "3º Ano", media: 8.1 },
  { serie: "4º Ano", media: 7.9 },
  { serie: "5º Ano", media: 7.6 },
  { serie: "6º Ano", media: 7.2 },
  { serie: "7º Ano", media: 7.4 },
  { serie: "8º Ano", media: 7.0 },
  { serie: "9º Ano", media: 7.3 },
];

const segmentData = [
  { name: "Fundamental I", value: 520, color: "hsl(217, 91%, 40%)" },
  { name: "Fundamental II", value: 480, color: "hsl(199, 89%, 48%)" },
  { name: "Ensino Médio", value: 247, color: "hsl(142, 76%, 36%)" },
];

const recentAlerts = [
  {
    type: "warning",
    title: "Frequência baixa",
    description: "3 alunos do 7º Ano B com frequência abaixo de 75%",
    time: "Há 2 horas",
  },
  {
    type: "info",
    title: "Notas lançadas",
    description: "Professor Carlos finalizou notas de Matemática - 9º Ano",
    time: "Há 4 horas",
  },
  {
    type: "success",
    title: "Matrícula confirmada",
    description: "Nova aluna Maria Santos - 5º Ano A",
    time: "Há 5 horas",
  },
  {
    type: "warning",
    title: "Reunião pendente",
    description: "Conselho de classe do 3º bimestre não agendado",
    time: "Há 1 dia",
  },
];

const upcomingEvents = [
  { title: "Conselho de Classe", date: "15 Mar", type: "meeting" },
  { title: "Reunião de Pais", date: "18 Mar", type: "event" },
  { title: "Prova Bimestral", date: "22 Mar", type: "exam" },
  { title: "Feriado - Páscoa", date: "29 Mar", type: "holiday" },
];

export default function EscolaDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo de volta! Aqui está o resumo da sua escola.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="shadow-card hover:shadow-soft transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`rounded-lg p-2 bg-${stat.color}/10`}>
                <stat.icon className={`h-5 w-5 text-${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {stat.trend === "up" && (
                  <ArrowUpRight className="h-4 w-4 text-success" />
                )}
                {stat.trend === "down" && (
                  <ArrowDownRight className="h-4 w-4 text-destructive" />
                )}
                <span
                  className={`text-sm ${
                    stat.trend === "up"
                      ? "text-success"
                      : stat.trend === "down"
                      ? "text-destructive"
                      : "text-muted-foreground"
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-sm text-muted-foreground">
                  {stat.changeLabel}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Frequency Chart */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Frequência Mensal</CardTitle>
            <CardDescription>
              Taxa média de presença dos alunos por mês
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={frequencyData}>
                  <defs>
                    <linearGradient id="colorFreq" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(217, 91%, 40%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(217, 91%, 40%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis domain={[85, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="frequencia"
                    stroke="hsl(217, 91%, 40%)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorFreq)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Performance Chart */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Desempenho por Série</CardTitle>
            <CardDescription>
              Média geral de notas por série/ano
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="serie" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis domain={[0, 10]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="media"
                    fill="hsl(199, 89%, 48%)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Segment Distribution */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Distribuição por Segmento</CardTitle>
            <CardDescription>Alunos matriculados por nível</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={segmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {segmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {segmentData.map((segment) => (
                <div key={segment.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: segment.color }}
                    />
                    <span className="text-sm">{segment.name}</span>
                  </div>
                  <span className="text-sm font-medium">{segment.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Alertas Recentes</CardTitle>
              <CardDescription>Atividades que requerem atenção</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              Ver todos
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAlerts.map((alert, index) => (
                <div key={index} className="flex gap-3">
                  <div
                    className={`mt-0.5 rounded-full p-1 ${
                      alert.type === "warning"
                        ? "bg-warning/10"
                        : alert.type === "success"
                        ? "bg-success/10"
                        : "bg-info/10"
                    }`}
                  >
                    {alert.type === "warning" ? (
                      <AlertTriangle className="h-4 w-4 text-warning" />
                    ) : alert.type === "success" ? (
                      <CheckCircle className="h-4 w-4 text-success" />
                    ) : (
                      <Clock className="h-4 w-4 text-info" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {alert.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {alert.description}
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      {alert.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Próximos Eventos</CardTitle>
              <CardDescription>Agenda da semana</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              <Calendar className="h-4 w-4 mr-1" />
              Calendário
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                      <span className="text-xs text-primary font-medium">
                        {event.date.split(" ")[1]}
                      </span>
                      <span className="text-lg font-bold text-primary">
                        {event.date.split(" ")[0]}
                      </span>
                    </div>
                    <span className="font-medium">{event.title}</span>
                  </div>
                  <Badge
                    variant={
                      event.type === "exam"
                        ? "destructive"
                        : event.type === "holiday"
                        ? "secondary"
                        : "default"
                    }
                  >
                    {event.type === "meeting"
                      ? "Reunião"
                      : event.type === "exam"
                      ? "Prova"
                      : event.type === "event"
                      ? "Evento"
                      : "Feriado"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

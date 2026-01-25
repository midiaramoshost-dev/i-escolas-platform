import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  FileSpreadsheet,
  FileText,
  Download,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  LineChart,
  Line,
} from "recharts";
import { useToast } from "@/hooks/use-toast";
import type { Inadimplente } from "./EnviarCobrancaDialog";
import { getAllHistoricos, type StatusNegociacao } from "./HistoricoNegociacaoDialog";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

interface RelatorioInadimplenciaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inadimplentes: Inadimplente[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

// Mock historical data for evolution charts
const evolucaoMensal = [
  { mes: "Jul/24", inadimplentes: 18, valor: 12500, taxa: 4.2, recuperado: 8200 },
  { mes: "Ago/24", inadimplentes: 21, valor: 14800, taxa: 4.8, recuperado: 9100 },
  { mes: "Set/24", inadimplentes: 19, valor: 13200, taxa: 4.5, recuperado: 11500 },
  { mes: "Out/24", inadimplentes: 22, valor: 15900, taxa: 5.2, recuperado: 10800 },
  { mes: "Nov/24", inadimplentes: 23, valor: 15230, taxa: 5.8, recuperado: 12300 },
  { mes: "Dez/24", inadimplentes: 20, valor: 14100, taxa: 5.1, recuperado: 13500 },
];

const inadimplenciaPorTurma = [
  { turma: "1º Ano A", inadimplentes: 2, valor: 1700, percentual: 7.1 },
  { turma: "2º Ano A", inadimplentes: 3, valor: 2550, percentual: 10.0 },
  { turma: "3º Ano B", inadimplentes: 5, valor: 4250, percentual: 15.6 },
  { turma: "4º Ano A", inadimplentes: 4, valor: 3400, percentual: 13.8 },
  { turma: "5º Ano B", inadimplentes: 6, valor: 5100, percentual: 19.4 },
  { turma: "6º Ano A", inadimplentes: 3, valor: 2550, percentual: 11.1 },
];

const statusDistribution = [
  { name: "Pendente", value: 35, color: "hsl(var(--muted-foreground))" },
  { name: "Negociando", value: 25, color: "hsl(45, 93%, 47%)" },
  { name: "Acordo Feito", value: 20, color: "hsl(142, 76%, 36%)" },
  { name: "Sem Resposta", value: 15, color: "hsl(24, 95%, 53%)" },
  { name: "Recusado", value: 5, color: "hsl(0, 84%, 60%)" },
];

const COLORS = ["#6b7280", "#eab308", "#22c55e", "#f97316", "#ef4444"];

export function RelatorioInadimplenciaDialog({
  open,
  onOpenChange,
  inadimplentes,
}: RelatorioInadimplenciaDialogProps) {
  const { toast } = useToast();
  const [periodo, setPeriodo] = useState("6m");
  const [exporting, setExporting] = useState(false);

  // Calculate metrics
  const totalInadimplentes = inadimplentes.length;
  const valorTotal = inadimplentes.reduce((acc, i) => acc + i.valorTotal, 0);
  const mediaMeses = inadimplentes.reduce((acc, i) => acc + i.mesesDevidos, 0) / totalInadimplentes || 0;
  const taxaRecuperacao = 67.5; // Mock value
  const valorRecuperado = evolucaoMensal.reduce((acc, m) => acc + m.recuperado, 0);

  const exportToPDF = async () => {
    setExporting(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Header
      doc.setFontSize(20);
      doc.setTextColor(37, 99, 235);
      doc.text("i ESCOLAS", 14, 20);
      
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text("Relatório de Inadimplência", 14, 35);
      
      doc.setFontSize(10);
      doc.setTextColor(107, 114, 128);
      doc.text(`Gerado em: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`, 14, 42);
      doc.text(`Período: Últimos 6 meses`, 14, 48);

      // KPIs Section
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("Resumo Executivo", 14, 60);
      
      const kpiData = [
        ["Total Inadimplentes", `${totalInadimplentes} alunos`],
        ["Valor Total em Aberto", formatCurrency(valorTotal)],
        ["Média de Meses Devidos", `${mediaMeses.toFixed(1)} meses`],
        ["Taxa de Recuperação", `${taxaRecuperacao}%`],
        ["Valor Recuperado (6 meses)", formatCurrency(valorRecuperado)],
      ];

      autoTable(doc, {
        startY: 65,
        head: [["Métrica", "Valor"]],
        body: kpiData,
        theme: "grid",
        headStyles: { fillColor: [37, 99, 235] },
        margin: { left: 14, right: 14 },
      });

      // Inadimplentes table
      doc.addPage();
      doc.setFontSize(14);
      doc.text("Lista de Inadimplentes", 14, 20);

      const tableData = inadimplentes.map((i) => [
        i.aluno,
        i.turma,
        i.responsavel,
        `${i.mesesDevidos}`,
        formatCurrency(i.valorTotal),
        format(new Date(i.ultimoContato), "dd/MM/yyyy"),
        i.status,
      ]);

      autoTable(doc, {
        startY: 25,
        head: [["Aluno", "Turma", "Responsável", "Meses", "Valor", "Últ. Contato", "Status"]],
        body: tableData,
        theme: "striped",
        headStyles: { fillColor: [37, 99, 235], fontSize: 8 },
        bodyStyles: { fontSize: 7 },
        columnStyles: {
          0: { cellWidth: 35 },
          1: { cellWidth: 22 },
          2: { cellWidth: 35 },
          3: { cellWidth: 15 },
          4: { cellWidth: 25 },
          5: { cellWidth: 22 },
          6: { cellWidth: 22 },
        },
        margin: { left: 14, right: 14 },
      });

      // Evolution by month
      doc.addPage();
      doc.setFontSize(14);
      doc.text("Evolução Mensal da Inadimplência", 14, 20);

      const evolucaoData = evolucaoMensal.map((m) => [
        m.mes,
        `${m.inadimplentes}`,
        formatCurrency(m.valor),
        `${m.taxa}%`,
        formatCurrency(m.recuperado),
      ]);

      autoTable(doc, {
        startY: 25,
        head: [["Mês", "Inadimplentes", "Valor Total", "Taxa (%)", "Valor Recuperado"]],
        body: evolucaoData,
        theme: "grid",
        headStyles: { fillColor: [37, 99, 235] },
        margin: { left: 14, right: 14 },
      });

      // By class
      doc.text("Inadimplência por Turma", 14, (doc as any).lastAutoTable.finalY + 20);

      const turmaData = inadimplenciaPorTurma.map((t) => [
        t.turma,
        `${t.inadimplentes}`,
        formatCurrency(t.valor),
        `${t.percentual}%`,
      ]);

      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 25,
        head: [["Turma", "Inadimplentes", "Valor", "% da Turma"]],
        body: turmaData,
        theme: "grid",
        headStyles: { fillColor: [37, 99, 235] },
        margin: { left: 14, right: 14 },
      });

      // Footer on all pages
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
          `Página ${i} de ${pageCount}`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: "center" }
        );
      }

      doc.save(`relatorio-inadimplencia-${format(new Date(), "yyyy-MM-dd")}.pdf`);
      
      toast({
        title: "PDF exportado!",
        description: "O relatório foi baixado com sucesso.",
      });
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast({
        title: "Erro ao exportar",
        description: "Não foi possível gerar o PDF.",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  const exportToExcel = async () => {
    setExporting(true);
    try {
      const workbook = XLSX.utils.book_new();

      // Resumo sheet
      const resumoData = [
        ["Relatório de Inadimplência - i ESCOLAS"],
        [`Gerado em: ${format(new Date(), "dd/MM/yyyy HH:mm")}`],
        [],
        ["RESUMO EXECUTIVO"],
        ["Métrica", "Valor"],
        ["Total de Inadimplentes", totalInadimplentes],
        ["Valor Total em Aberto", valorTotal],
        ["Média de Meses Devidos", mediaMeses.toFixed(1)],
        ["Taxa de Recuperação (%)", taxaRecuperacao],
        ["Valor Recuperado (6 meses)", valorRecuperado],
      ];
      const wsResumo = XLSX.utils.aoa_to_sheet(resumoData);
      wsResumo["!cols"] = [{ wch: 30 }, { wch: 20 }];
      XLSX.utils.book_append_sheet(workbook, wsResumo, "Resumo");

      // Inadimplentes sheet
      const inadimplentesData = [
        ["Aluno", "Turma", "Responsável", "Telefone", "Email", "Meses Devidos", "Valor Total", "Último Contato", "Status"],
        ...inadimplentes.map((i) => [
          i.aluno,
          i.turma,
          i.responsavel,
          i.telefone,
          i.email,
          i.mesesDevidos,
          i.valorTotal,
          format(new Date(i.ultimoContato), "dd/MM/yyyy"),
          i.status,
        ]),
      ];
      const wsInadimplentes = XLSX.utils.aoa_to_sheet(inadimplentesData);
      wsInadimplentes["!cols"] = [
        { wch: 25 }, { wch: 12 }, { wch: 25 }, { wch: 15 }, 
        { wch: 25 }, { wch: 12 }, { wch: 15 }, { wch: 12 }, { wch: 15 }
      ];
      XLSX.utils.book_append_sheet(workbook, wsInadimplentes, "Inadimplentes");

      // Evolução Mensal sheet
      const evolucaoSheetData = [
        ["Mês", "Nº Inadimplentes", "Valor Total", "Taxa (%)", "Valor Recuperado"],
        ...evolucaoMensal.map((m) => [m.mes, m.inadimplentes, m.valor, m.taxa, m.recuperado]),
      ];
      const wsEvolucao = XLSX.utils.aoa_to_sheet(evolucaoSheetData);
      wsEvolucao["!cols"] = [{ wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 10 }, { wch: 18 }];
      XLSX.utils.book_append_sheet(workbook, wsEvolucao, "Evolução Mensal");

      // Por Turma sheet
      const turmaSheetData = [
        ["Turma", "Nº Inadimplentes", "Valor Total", "% da Turma"],
        ...inadimplenciaPorTurma.map((t) => [t.turma, t.inadimplentes, t.valor, t.percentual]),
      ];
      const wsTurma = XLSX.utils.aoa_to_sheet(turmaSheetData);
      wsTurma["!cols"] = [{ wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 12 }];
      XLSX.utils.book_append_sheet(workbook, wsTurma, "Por Turma");

      XLSX.writeFile(workbook, `relatorio-inadimplencia-${format(new Date(), "yyyy-MM-dd")}.xlsx`);

      toast({
        title: "Excel exportado!",
        description: "A planilha foi baixada com sucesso.",
      });
    } catch (error) {
      console.error("Error exporting Excel:", error);
      toast({
        title: "Erro ao exportar",
        description: "Não foi possível gerar o Excel.",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Relatório de Inadimplência
          </DialogTitle>
          <DialogDescription>
            Análise completa da inadimplência com gráficos de evolução
          </DialogDescription>
        </DialogHeader>

        {/* Filters and Export */}
        <div className="flex items-center justify-between gap-4">
          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">Últimos 3 meses</SelectItem>
              <SelectItem value="6m">Últimos 6 meses</SelectItem>
              <SelectItem value="12m">Últimos 12 meses</SelectItem>
              <SelectItem value="ano">Este ano</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={exportToExcel}
              disabled={exporting}
            >
              <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-600" />
              Exportar Excel
            </Button>
            <Button 
              variant="outline" 
              onClick={exportToPDF}
              disabled={exporting}
            >
              <FileText className="mr-2 h-4 w-4 text-red-600" />
              Exportar PDF
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-6 pb-4">
            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Inadimplentes
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalInadimplentes}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <ArrowDownRight className="h-3 w-3 text-emerald-500 mr-1" />
                    <span className="text-emerald-500">-3</span>
                    <span className="ml-1">vs. mês anterior</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Valor em Aberto
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">
                    {formatCurrency(valorTotal)}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <ArrowDownRight className="h-3 w-3 text-emerald-500 mr-1" />
                    <span className="text-emerald-500">-5.2%</span>
                    <span className="ml-1">vs. mês anterior</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Taxa Recuperação
                  </CardTitle>
                  <Percent className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-emerald-600">
                    {taxaRecuperacao}%
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-1" />
                    <span className="text-emerald-500">+8.3%</span>
                    <span className="ml-1">vs. mês anterior</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Valor Recuperado
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-emerald-600">
                    {formatCurrency(valorRecuperado)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Nos últimos 6 meses
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <Tabs defaultValue="evolucao" className="space-y-4">
              <TabsList>
                <TabsTrigger value="evolucao" className="gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Evolução
                </TabsTrigger>
                <TabsTrigger value="turmas" className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Por Turma
                </TabsTrigger>
                <TabsTrigger value="status" className="gap-2">
                  <PieChartIcon className="h-4 w-4" />
                  Por Status
                </TabsTrigger>
                <TabsTrigger value="detalhado" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Detalhado
                </TabsTrigger>
              </TabsList>

              <TabsContent value="evolucao">
                <Card>
                  <CardHeader>
                    <CardTitle>Evolução da Inadimplência</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={evolucaoMensal}>
                          <defs>
                            <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorRecuperado" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="mes" className="text-xs" />
                          <YAxis 
                            className="text-xs" 
                            tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                          />
                          <Tooltip 
                            formatter={(value: number, name: string) => [
                              formatCurrency(value), 
                              name === "valor" ? "Em aberto" : "Recuperado"
                            ]}
                            contentStyle={{ 
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px"
                            }}
                          />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="valor"
                            stroke="hsl(0, 84%, 60%)"
                            fill="url(#colorValor)"
                            strokeWidth={2}
                            name="Valor em Aberto"
                          />
                          <Area
                            type="monotone"
                            dataKey="recuperado"
                            stroke="hsl(142, 76%, 36%)"
                            fill="url(#colorRecuperado)"
                            strokeWidth={2}
                            name="Valor Recuperado"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Taxa evolution */}
                    <div className="mt-6">
                      <h4 className="text-sm font-medium mb-4">Taxa de Inadimplência (%)</h4>
                      <div className="h-[150px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={evolucaoMensal}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis dataKey="mes" className="text-xs" />
                            <YAxis className="text-xs" domain={[0, 10]} />
                            <Tooltip 
                              formatter={(value: number) => [`${value}%`, "Taxa"]}
                              contentStyle={{ 
                                backgroundColor: "hsl(var(--card))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "8px"
                              }}
                            />
                            <Line
                              type="monotone"
                              dataKey="taxa"
                              stroke="hsl(var(--primary))"
                              strokeWidth={2}
                              dot={{ fill: "hsl(var(--primary))" }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="turmas">
                <Card>
                  <CardHeader>
                    <CardTitle>Inadimplência por Turma</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={inadimplenciaPorTurma} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis type="number" tickFormatter={(v) => formatCurrency(v)} className="text-xs" />
                          <YAxis type="category" dataKey="turma" className="text-xs" width={80} />
                          <Tooltip 
                            formatter={(value: number) => formatCurrency(value)}
                            contentStyle={{ 
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px"
                            }}
                          />
                          <Bar dataKey="valor" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <Table className="mt-4">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Turma</TableHead>
                          <TableHead className="text-center">Inadimplentes</TableHead>
                          <TableHead className="text-right">Valor</TableHead>
                          <TableHead className="text-right">% da Turma</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {inadimplenciaPorTurma.map((t) => (
                          <TableRow key={t.turma}>
                            <TableCell className="font-medium">{t.turma}</TableCell>
                            <TableCell className="text-center">
                              <Badge variant="secondary">{t.inadimplentes}</Badge>
                            </TableCell>
                            <TableCell className="text-right text-destructive font-medium">
                              {formatCurrency(t.valor)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge 
                                variant="outline" 
                                className={t.percentual > 15 ? "text-destructive border-destructive" : ""}
                              >
                                {t.percentual}%
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="status">
                <Card>
                  <CardHeader>
                    <CardTitle>Distribuição por Status de Negociação</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={statusDistribution}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              paddingAngle={2}
                              dataKey="value"
                            >
                              {statusDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index]} />
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

                      <div className="space-y-3">
                        {statusDistribution.map((status, index) => (
                          <div key={status.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div 
                                className="h-4 w-4 rounded-full" 
                                style={{ backgroundColor: COLORS[index] }}
                              />
                              <span className="font-medium">{status.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold">{status.value}%</span>
                              <span className="text-sm text-muted-foreground">
                                ({Math.round(totalInadimplentes * status.value / 100)} alunos)
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="detalhado">
                <Card>
                  <CardHeader>
                    <CardTitle>Lista Detalhada de Inadimplentes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Aluno</TableHead>
                          <TableHead>Turma</TableHead>
                          <TableHead>Responsável</TableHead>
                          <TableHead className="text-center">Meses</TableHead>
                          <TableHead className="text-right">Valor</TableHead>
                          <TableHead>Último Contato</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {inadimplentes.map((i) => (
                          <TableRow key={i.id}>
                            <TableCell className="font-medium">{i.aluno}</TableCell>
                            <TableCell>{i.turma}</TableCell>
                            <TableCell>{i.responsavel}</TableCell>
                            <TableCell className="text-center">
                              <Badge variant={i.mesesDevidos >= 3 ? "destructive" : "secondary"}>
                                {i.mesesDevidos}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium text-destructive">
                              {formatCurrency(i.valorTotal)}
                            </TableCell>
                            <TableCell>
                              {format(new Date(i.ultimoContato), "dd/MM/yyyy")}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{i.status}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

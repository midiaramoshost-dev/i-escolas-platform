import { useState, useCallback } from "react";
import {
  FileText,
  Download,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  GraduationCap,
  DollarSign,
  Calendar,
  Filter,
  Check,
  Loader2,
  Search,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

interface Relatorio {
  id: string;
  nome: string;
  descricao: string;
  categoria: "academico" | "financeiro" | "frequencia" | "geral";
  icon: React.ElementType;
  formato: string[];
}

const relatorios: Relatorio[] = [
  {
    id: "1",
    nome: "Boletim Geral",
    descricao: "Relatório completo de notas de todos os alunos por turma e bimestre",
    categoria: "academico",
    icon: GraduationCap,
    formato: ["PDF", "Excel"],
  },
  {
    id: "2",
    nome: "Frequência por Turma",
    descricao: "Análise detalhada de frequência e faltas por turma",
    categoria: "frequencia",
    icon: Calendar,
    formato: ["PDF", "Excel"],
  },
  {
    id: "3",
    nome: "Alunos em Risco",
    descricao: "Lista de alunos com frequência ou notas abaixo da média",
    categoria: "academico",
    icon: TrendingUp,
    formato: ["PDF", "Excel"],
  },
  {
    id: "4",
    nome: "Desempenho por Disciplina",
    descricao: "Comparativo de desempenho entre disciplinas e turmas",
    categoria: "academico",
    icon: BarChart3,
    formato: ["PDF", "Excel"],
  },
  {
    id: "5",
    nome: "Inadimplência",
    descricao: "Relatório de mensalidades em atraso e status de pagamentos",
    categoria: "financeiro",
    icon: DollarSign,
    formato: ["PDF", "Excel"],
  },
  {
    id: "6",
    nome: "Receita Mensal",
    descricao: "Análise financeira com receitas e projeções mensais",
    categoria: "financeiro",
    icon: PieChart,
    formato: ["PDF", "Excel"],
  },
  {
    id: "7",
    nome: "Listagem de Alunos",
    descricao: "Lista completa de alunos matriculados com dados de contato",
    categoria: "geral",
    icon: Users,
    formato: ["PDF", "Excel"],
  },
  {
    id: "8",
    nome: "Resumo Institucional",
    descricao: "Visão geral da escola com métricas e indicadores principais",
    categoria: "geral",
    icon: FileText,
    formato: ["PDF"],
  },
  {
    id: "9",
    nome: "Listagem de Professores",
    descricao: "Lista completa de professores com disciplinas e turmas vinculadas",
    categoria: "geral",
    icon: Users,
    formato: ["PDF", "Excel"],
  },
  {
    id: "10",
    nome: "Histórico de Pagamentos",
    descricao: "Extrato completo de pagamentos recebidos por período",
    categoria: "financeiro",
    icon: DollarSign,
    formato: ["PDF", "Excel"],
  },
];

const categoriaLabels: Record<string, { label: string; color: string }> = {
  academico: { label: "Acadêmico", color: "bg-blue-500" },
  financeiro: { label: "Financeiro", color: "bg-green-500" },
  frequencia: { label: "Frequência", color: "bg-purple-500" },
  geral: { label: "Geral", color: "bg-gray-500" },
};

const turmasDisponiveis = [
  "1º Ano A", "2º Ano A", "3º Ano A", "4º Ano A", "4º Ano B",
  "5º Ano A", "7º Ano B", "9º Ano A", "3º EM A",
];

const seriesDisponiveis = [
  "1º Ano", "2º Ano", "3º Ano", "4º Ano", "5º Ano",
  "6º Ano", "7º Ano", "8º Ano", "9º Ano", "1º Médio", "2º Médio", "3º Médio",
];

const disciplinasDisponiveis = [
  "Matemática", "Português", "Ciências", "História", "Geografia",
  "Inglês", "Ed. Física", "Artes",
];

// Mock data generator for reports
function generateMockData(relatorio: Relatorio, filters: {
  periodo: string; turma: string; serie: string; disciplina: string;
}) {
  const periodoLabel = filters.periodo === "atual" ? "2026" :
    filters.periodo === "1bim" ? "1º Bimestre 2026" :
    filters.periodo === "2bim" ? "2º Bimestre 2026" :
    filters.periodo === "3bim" ? "3º Bimestre 2026" :
    filters.periodo === "4bim" ? "4º Bimestre 2026" : "2025";

  const turmaLabel = filters.turma === "all" ? "Todas" : filters.turma;
  const serieLabel = filters.serie === "all" ? "Todas" : filters.serie;

  switch (relatorio.id) {
    case "1": // Boletim Geral
      return {
        title: `Boletim Geral - ${periodoLabel}`,
        subtitle: `Turma: ${turmaLabel} | Série: ${serieLabel}`,
        headers: ["Aluno", "Matrícula", "Turma", "Português", "Matemática", "Ciências", "Média"],
        rows: [
          ["Ana Beatriz Silva", "2024001", "5º Ano A", "8.5", "9.0", "8.0", "8.5"],
          ["Bruno Costa Santos", "2024002", "5º Ano A", "7.0", "6.5", "8.0", "7.2"],
          ["Carolina Mendes", "2024003", "7º Ano B", "9.5", "8.5", "9.2", "9.1"],
          ["Daniel Oliveira", "2024004", "9º Ano A", "5.5", "6.0", "6.0", "5.8"],
          ["Eduarda Lima", "2024005", "3º Ano A", "9.0", "8.5", "9.2", "8.9"],
          ["Felipe Almeida", "2024006", "1º Ano A", "8.0", "7.5", "8.5", "8.0"],
          ["Gabriela Ferreira", "2024007", "3º EM A", "7.5", "8.0", "8.0", "7.8"],
          ["Henrique Souza", "2024008", "7º Ano B", "6.5", "6.0", "7.0", "6.5"],
        ],
      };
    case "2": // Frequência por Turma
      return {
        title: `Frequência por Turma - ${periodoLabel}`,
        subtitle: `Turma: ${turmaLabel}`,
        headers: ["Aluno", "Turma", "Aulas", "Presenças", "Faltas", "Frequência (%)"],
        rows: [
          ["Ana Beatriz Silva", "5º Ano A", "80", "77", "3", "96%"],
          ["Bruno Costa Santos", "5º Ano A", "80", "70", "10", "88%"],
          ["Carolina Mendes", "7º Ano B", "80", "75", "5", "94%"],
          ["Daniel Oliveira", "9º Ano A", "80", "58", "22", "72%"],
          ["Eduarda Lima", "3º Ano A", "80", "78", "2", "98%"],
        ],
      };
    case "3": // Alunos em Risco
      return {
        title: `Alunos em Risco - ${periodoLabel}`,
        subtitle: `Série: ${serieLabel}`,
        headers: ["Aluno", "Turma", "Média", "Frequência", "Status", "Observação"],
        rows: [
          ["Daniel Oliveira", "9º Ano A", "5.8", "72%", "Crítico", "Baixa frequência e notas"],
          ["Bruno Costa Santos", "5º Ano A", "7.2", "88%", "Alerta", "Frequência abaixo da meta"],
          ["Henrique Souza", "7º Ano B", "6.5", "85%", "Alerta", "Notas em declínio"],
        ],
      };
    case "5": // Inadimplência
      return {
        title: `Inadimplência - ${periodoLabel}`,
        subtitle: `Filtros aplicados`,
        headers: ["Responsável", "Aluno", "Meses em Atraso", "Valor Total", "Status"],
        rows: [
          ["Roberto Oliveira", "Daniel Oliveira", "3", "R$ 2.850,00", "Em negociação"],
          ["Luciana Souza", "Henrique Souza", "1", "R$ 950,00", "Pendente"],
          ["Carlos Santos", "Bruno Costa Santos", "2", "R$ 1.900,00", "Notificado"],
        ],
      };
    case "7": // Listagem de Alunos
      return {
        title: `Listagem de Alunos - ${periodoLabel}`,
        subtitle: `Turma: ${turmaLabel} | Série: ${serieLabel}`,
        headers: ["Matrícula", "Nome", "Turma", "Série", "Turno", "Responsável", "Telefone", "Status"],
        rows: [
          ["2024001", "Ana Beatriz Silva", "5º Ano A", "5º Ano", "Manhã", "Maria Silva", "(11) 98888-1111", "Regular"],
          ["2024002", "Bruno Costa Santos", "5º Ano A", "5º Ano", "Manhã", "Carlos Santos", "(11) 98888-2222", "Alerta"],
          ["2024003", "Carolina Mendes", "7º Ano B", "7º Ano", "Tarde", "Paula Mendes", "(11) 98888-3333", "Regular"],
          ["2024004", "Daniel Oliveira", "9º Ano A", "9º Ano", "Manhã", "Roberto Oliveira", "(11) 98888-4444", "Crítico"],
          ["2024005", "Eduarda Lima", "3º Ano A", "3º Ano", "Manhã", "Fernanda Lima", "(11) 98888-5555", "Regular"],
          ["2024006", "Felipe Almeida", "1º Ano A", "1º Ano", "Manhã", "Juliana Almeida", "(11) 98888-6666", "Regular"],
          ["2024007", "Gabriela Ferreira", "3º EM A", "3º Médio", "Manhã", "Marcos Ferreira", "(11) 98888-7777", "Regular"],
          ["2024008", "Henrique Souza", "7º Ano B", "7º Ano", "Tarde", "Luciana Souza", "(11) 98888-8888", "Alerta"],
          ["2024009", "Lucas Mendes", "4º Ano A", "4º Ano", "Manhã", "Paula Mendes", "(11) 98888-3333", "Regular"],
          ["2024010", "Marina Almeida", "4º Ano B", "4º Ano", "Tarde", "Juliana Almeida", "(11) 98888-6666", "Regular"],
        ],
      };
    default:
      return {
        title: `${relatorio.nome} - ${periodoLabel}`,
        subtitle: `Turma: ${turmaLabel}`,
        headers: ["Item", "Valor", "Detalhes"],
        rows: [
          ["Dado 1", "Valor 1", "Detalhe exemplo"],
          ["Dado 2", "Valor 2", "Detalhe exemplo"],
          ["Dado 3", "Valor 3", "Detalhe exemplo"],
        ],
      };
  }
}

function downloadPDF(data: { title: string; subtitle: string; headers: string[]; rows: string[][] }) {
  const doc = new jsPDF();
  const schoolName = localStorage.getItem("escola_nome") || "i ESCOLAS";

  // Header
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(schoolName, 14, 20);
  doc.setFontSize(14);
  doc.text(data.title, 14, 30);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(data.subtitle, 14, 37);
  doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}`, 14, 43);

  // Table
  autoTable(doc, {
    head: [data.headers],
    body: data.rows,
    startY: 50,
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [30, 64, 175], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    margin: { left: 14, right: 14 },
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128);
    doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: "center" });
  }

  doc.save(`${data.title.replace(/\s+/g, "_")}.pdf`);
}

function downloadExcel(data: { title: string; headers: string[]; rows: string[][] }) {
  const wsData = [data.headers, ...data.rows];
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  
  // Auto-width columns
  const colWidths = data.headers.map((h, i) => {
    const maxLen = Math.max(h.length, ...data.rows.map(r => (r[i] || "").length));
    return { wch: Math.min(maxLen + 4, 40) };
  });
  ws["!cols"] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Relatório");
  XLSX.writeFile(wb, `${data.title.replace(/\s+/g, "_")}.xlsx`);
}

export default function Relatorios() {
  const [filterCategoria, setFilterCategoria] = useState("all");
  const [filterPeriodo, setFilterPeriodo] = useState("atual");
  const [filterTurma, setFilterTurma] = useState("all");
  const [filterSerie, setFilterSerie] = useState("all");
  const [filterDisciplina, setFilterDisciplina] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [generating, setGenerating] = useState<string | null>(null);
  const [batchGenerating, setBatchGenerating] = useState(false);

  const filteredRelatorios = relatorios.filter((rel) => {
    const matchCategoria = filterCategoria === "all" || rel.categoria === filterCategoria;
    const matchSearch = searchTerm === "" || rel.nome.toLowerCase().includes(searchTerm.toLowerCase()) || rel.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategoria && matchSearch;
  });

  const toggleSelect = (id: string) => {
    setSelectedReports(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedReports.length === filteredRelatorios.length) {
      setSelectedReports([]);
    } else {
      setSelectedReports(filteredRelatorios.map(r => r.id));
    }
  };

  const filters = { periodo: filterPeriodo, turma: filterTurma, serie: filterSerie, disciplina: filterDisciplina };

  const handleGenerate = useCallback(async (relatorio: Relatorio, formato: string) => {
    setGenerating(`${relatorio.id}-${formato}`);
    const data = generateMockData(relatorio, filters);

    // Small delay for UX feedback
    await new Promise(resolve => setTimeout(resolve, 300));

    if (formato === "PDF") {
      downloadPDF(data);
    } else {
      downloadExcel(data);
    }

    toast.success(`"${relatorio.nome}" baixado em ${formato}!`);
    setGenerating(null);
  }, [filters]);

  const handleBatchDownload = async (formato: "PDF" | "Excel") => {
    if (selectedReports.length === 0) {
      toast.error("Selecione ao menos um relatório.");
      return;
    }

    setBatchGenerating(true);
    for (const id of selectedReports) {
      const rel = relatorios.find(r => r.id === id);
      if (rel && rel.formato.includes(formato)) {
        const data = generateMockData(rel, filters);
        if (formato === "PDF") {
          downloadPDF(data);
        } else {
          downloadExcel(data);
        }
        await new Promise(resolve => setTimeout(resolve, 400));
      }
    }
    toast.success(`${selectedReports.length} relatório(s) baixados em ${formato}!`);
    setBatchGenerating(false);
    setSelectedReports([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground">
            Selecione, filtre e baixe relatórios detalhados da sua escola
          </p>
        </div>
        {selectedReports.length > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm">
              {selectedReports.length} selecionado(s)
            </Badge>
            <Button
              size="sm"
              variant="outline"
              disabled={batchGenerating}
              onClick={() => handleBatchDownload("PDF")}
              className="gap-1"
            >
              {batchGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Baixar PDF
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={batchGenerating}
              onClick={() => handleBatchDownload("Excel")}
              className="gap-1"
            >
              {batchGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Baixar Excel
            </Button>
          </div>
        )}
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Filter className="h-4 w-4" />
              Filtros do Relatório
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar relatório por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="grid gap-3 md:grid-cols-5">
              <Select value={filterCategoria} onValueChange={setFilterCategoria}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas Categorias</SelectItem>
                  <SelectItem value="academico">Acadêmico</SelectItem>
                  <SelectItem value="financeiro">Financeiro</SelectItem>
                  <SelectItem value="frequencia">Frequência</SelectItem>
                  <SelectItem value="geral">Geral</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPeriodo} onValueChange={setFilterPeriodo}>
                <SelectTrigger>
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="atual">Ano Atual (2026)</SelectItem>
                  <SelectItem value="1bim">1º Bimestre</SelectItem>
                  <SelectItem value="2bim">2º Bimestre</SelectItem>
                  <SelectItem value="3bim">3º Bimestre</SelectItem>
                  <SelectItem value="4bim">4º Bimestre</SelectItem>
                  <SelectItem value="2025">Ano 2025</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterSerie} onValueChange={setFilterSerie}>
                <SelectTrigger>
                  <SelectValue placeholder="Série" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas Séries</SelectItem>
                  {seriesDisponiveis.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterTurma} onValueChange={setFilterTurma}>
                <SelectTrigger>
                  <SelectValue placeholder="Turma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas Turmas</SelectItem>
                  {turmasDisponiveis.map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterDisciplina} onValueChange={setFilterDisciplina}>
                <SelectTrigger>
                  <SelectValue placeholder="Disciplina" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas Disciplinas</SelectItem>
                  {disciplinasDisponiveis.map(d => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Select All */}
      <div className="flex items-center gap-3">
        <Checkbox
          checked={selectedReports.length === filteredRelatorios.length && filteredRelatorios.length > 0}
          onCheckedChange={selectAll}
        />
        <span className="text-sm text-muted-foreground">
          Selecionar todos ({filteredRelatorios.length} relatórios)
        </span>
      </div>

      {/* Reports Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredRelatorios.map((relatorio) => {
          const isSelected = selectedReports.includes(relatorio.id);
          return (
            <Card
              key={relatorio.id}
              className={`shadow-card hover:shadow-soft transition-all cursor-pointer ${isSelected ? "ring-2 ring-primary" : ""}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleSelect(relatorio.id)}
                    />
                    <div className={`p-2 rounded-lg ${categoriaLabels[relatorio.categoria].color} bg-opacity-10`}>
                      <relatorio.icon className={`h-5 w-5 ${categoriaLabels[relatorio.categoria].color.replace("bg-", "text-")}`} />
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {categoriaLabels[relatorio.categoria].label}
                  </Badge>
                </div>
                <CardTitle className="text-lg mt-3">{relatorio.nome}</CardTitle>
                <CardDescription>{relatorio.descricao}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {relatorio.formato.map((formato) => (
                    <Button
                      key={formato}
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1"
                      disabled={generating === `${relatorio.id}-${formato}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGenerate(relatorio, formato);
                      }}
                    >
                      {generating === `${relatorio.id}-${formato}` ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                      {formato}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredRelatorios.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">Nenhum relatório encontrado</p>
          <p className="text-sm">Tente ajustar os filtros de busca.</p>
        </div>
      )}

      {/* Quick Stats */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Resumo Rápido
          </CardTitle>
          <CardDescription>
            Indicadores principais do período selecionado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-sm text-muted-foreground">Total de Alunos</p>
              <p className="text-2xl font-bold text-blue-600">1.247</p>
              <p className="text-xs text-blue-600/70">+5% vs. ano anterior</p>
            </div>
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-sm text-muted-foreground">Média Geral</p>
              <p className="text-2xl font-bold text-green-600">7.8</p>
              <p className="text-xs text-green-600/70">+0.3 vs. bimestre anterior</p>
            </div>
            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <p className="text-sm text-muted-foreground">Frequência Média</p>
              <p className="text-2xl font-bold text-purple-600">92%</p>
              <p className="text-xs text-purple-600/70">Meta: 95%</p>
            </div>
            <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <p className="text-sm text-muted-foreground">Inadimplência</p>
              <p className="text-2xl font-bold text-orange-600">4.2%</p>
              <p className="text-xs text-orange-600/70">-1.8% vs. mês anterior</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

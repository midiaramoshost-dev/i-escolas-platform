import { useState } from "react";
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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

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
];

const categoriaLabels: Record<string, { label: string; color: string }> = {
  academico: { label: "Acadêmico", color: "bg-blue-500" },
  financeiro: { label: "Financeiro", color: "bg-green-500" },
  frequencia: { label: "Frequência", color: "bg-purple-500" },
  geral: { label: "Geral", color: "bg-gray-500" },
};

export default function Relatorios() {
  const [filterCategoria, setFilterCategoria] = useState("all");
  const [filterPeriodo, setFilterPeriodo] = useState("atual");
  const [filterTurma, setFilterTurma] = useState("all");
  const [generating, setGenerating] = useState<string | null>(null);

  const filteredRelatorios = relatorios.filter((rel) => {
    return filterCategoria === "all" || rel.categoria === filterCategoria;
  });

  const handleGenerate = async (relatorio: Relatorio, formato: string) => {
    setGenerating(`${relatorio.id}-${formato}`);
    
    // Simulate generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success(`Relatório "${relatorio.nome}" gerado em ${formato}!`, {
      description: "O download começará automaticamente.",
    });
    
    setGenerating(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground">
            Gere relatórios detalhados da sua escola
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              Filtros:
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={filterCategoria} onValueChange={setFilterCategoria}>
                <SelectTrigger className="w-[160px]">
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
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="atual">Ano Atual (2025)</SelectItem>
                  <SelectItem value="1bim">1º Bimestre</SelectItem>
                  <SelectItem value="2bim">2º Bimestre</SelectItem>
                  <SelectItem value="3bim">3º Bimestre</SelectItem>
                  <SelectItem value="4bim">4º Bimestre</SelectItem>
                  <SelectItem value="2024">Ano 2024</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterTurma} onValueChange={setFilterTurma}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Turma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Turmas</SelectItem>
                  <SelectItem value="1a">1º Ano A</SelectItem>
                  <SelectItem value="2a">2º Ano A</SelectItem>
                  <SelectItem value="3a">3º Ano A</SelectItem>
                  <SelectItem value="5a">5º Ano A</SelectItem>
                  <SelectItem value="7b">7º Ano B</SelectItem>
                  <SelectItem value="9a">9º Ano A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredRelatorios.map((relatorio) => (
          <Card key={relatorio.id} className="shadow-card hover:shadow-soft transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-lg ${categoriaLabels[relatorio.categoria].color} bg-opacity-10`}>
                  <relatorio.icon className={`h-5 w-5 ${categoriaLabels[relatorio.categoria].color.replace('bg-', 'text-')}`} />
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
                    onClick={() => handleGenerate(relatorio, formato)}
                  >
                    {generating === `${relatorio.id}-${formato}` ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    {formato}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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

      {/* Recent Reports */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Relatórios Recentes
          </CardTitle>
          <CardDescription>
            Últimos relatórios gerados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { nome: "Boletim Geral - 1º Bimestre", data: "15/04/2025", formato: "PDF" },
              { nome: "Frequência por Turma - Março", data: "01/04/2025", formato: "Excel" },
              { nome: "Inadimplência - Março 2025", data: "28/03/2025", formato: "PDF" },
              { nome: "Alunos em Risco - 1º Bim", data: "20/03/2025", formato: "Excel" },
            ].map((rel, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{rel.nome}</p>
                    <p className="text-xs text-muted-foreground">{rel.data}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{rel.formato}</Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Building2,
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  FileText,
  Shield,
  RefreshCw,
  Eye,
  Calendar,
  BarChart3,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// ── Types ──────────────────────────────────────────────────────────
interface CensoSection {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  fields: number;
  filled: number;
  status: "completo" | "parcial" | "pendente";
  lastUpdate: string;
}

interface ReportTemplate {
  id: string;
  name: string;
  category: "censo" | "saeb" | "ideb" | "enade" | "inep";
  description: string;
  format: string[];
  deadline?: string;
}

interface ValidationItem {
  field: string;
  section: string;
  severity: "error" | "warning" | "info";
  message: string;
}

// ── Mock Data ──────────────────────────────────────────────────────
const censoSections: CensoSection[] = [
  { id: "escola", title: "Dados da Escola", icon: Building2, description: "Identificação, infraestrutura e funcionamento", fields: 42, filled: 42, status: "completo", lastUpdate: "2025-03-01" },
  { id: "turmas", title: "Turmas", icon: BookOpen, description: "Turmas oferecidas e modalidades de ensino", fields: 28, filled: 28, status: "completo", lastUpdate: "2025-03-01" },
  { id: "alunos", title: "Matrículas", icon: GraduationCap, description: "Dados individuais de matrícula dos alunos", fields: 56, filled: 48, status: "parcial", lastUpdate: "2025-02-28" },
  { id: "docentes", title: "Docentes", icon: Users, description: "Dados de professores e formação acadêmica", fields: 35, filled: 35, status: "completo", lastUpdate: "2025-03-01" },
  { id: "profissionais", title: "Profissionais", icon: Users, description: "Profissionais escolares em sala de aula", fields: 20, filled: 12, status: "parcial", lastUpdate: "2025-02-15" },
];

const reportTemplates: ReportTemplate[] = [
  { id: "censo-escolar", name: "Censo Escolar - Situação do Aluno", category: "censo", description: "Relatório de situação do aluno ao final do ano letivo", format: ["CSV", "XML"], deadline: "Fevereiro" },
  { id: "censo-matricula", name: "Censo Escolar - Matrícula Inicial", category: "censo", description: "Dados de matrícula inicial para o Censo", format: ["CSV", "XML"], deadline: "Maio" },
  { id: "censo-infra", name: "Censo Escolar - Infraestrutura", category: "censo", description: "Dados de infraestrutura e equipamentos", format: ["CSV", "XML"], deadline: "Maio" },
  { id: "saeb-resultados", name: "SAEB - Resultados por Turma", category: "saeb", description: "Compilação de resultados do SAEB por turma e disciplina", format: ["PDF", "Excel"] },
  { id: "ideb-projecao", name: "IDEB - Projeção e Metas", category: "ideb", description: "Projeção de metas do IDEB e indicadores de fluxo", format: ["PDF", "Excel"] },
  { id: "ideb-historico", name: "IDEB - Histórico de Resultados", category: "ideb", description: "Série histórica de resultados do IDEB", format: ["PDF", "Excel"] },
  { id: "inep-indicadores", name: "INEP - Indicadores Educacionais", category: "inep", description: "Taxa de rendimento, distorção idade-série e médias", format: ["PDF", "Excel", "CSV"] },
  { id: "inep-rendimento", name: "INEP - Taxa de Rendimento", category: "inep", description: "Aprovação, reprovação e abandono por série", format: ["PDF", "CSV"] },
];

const validationItems: ValidationItem[] = [
  { field: "CPF do Aluno", section: "Matrículas", severity: "error", message: "8 alunos sem CPF cadastrado" },
  { field: "NIS", section: "Matrículas", severity: "warning", message: "15 alunos sem NIS informado" },
  { field: "Cor/Raça", section: "Matrículas", severity: "warning", message: "3 alunos sem declaração de cor/raça" },
  { field: "Código INEP", section: "Dados da Escola", severity: "info", message: "Código INEP validado com sucesso" },
  { field: "Escolaridade", section: "Profissionais", severity: "error", message: "2 profissionais sem escolaridade informada" },
  { field: "Deficiência", section: "Matrículas", severity: "warning", message: "Verificar campo de necessidades especiais" },
];

const statsCards = [
  { title: "Campos Preenchidos", value: "165/181", icon: CheckCircle2, pct: 91, color: "text-green-600" },
  { title: "Validações Pendentes", value: "6", icon: AlertTriangle, pct: null, color: "text-amber-600" },
  { title: "Última Exportação", value: "01/03/2025", icon: Clock, pct: null, color: "text-blue-600" },
  { title: "Prazo Censo", value: "31/05/2025", icon: Calendar, pct: null, color: "text-purple-600" },
];

const categoryLabels: Record<string, { label: string; color: string }> = {
  censo: { label: "Censo Escolar", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
  saeb: { label: "SAEB", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
  ideb: { label: "IDEB", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" },
  inep: { label: "INEP", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300" },
  enade: { label: "ENADE", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
};

// ── Component ──────────────────────────────────────────────────────
export default function IntegracaoMEC() {
  const [anoReferencia, setAnoReferencia] = useState("2025");
  const [filterCategory, setFilterCategory] = useState("todos");
  const [exporting, setExporting] = useState<string | null>(null);
  const [previewReport, setPreviewReport] = useState<ReportTemplate | null>(null);
  const [validating, setValidating] = useState(false);

  const filteredReports = filterCategory === "todos"
    ? reportTemplates
    : reportTemplates.filter((r) => r.category === filterCategory);

  const totalFields = censoSections.reduce((a, s) => a + s.fields, 0);
  const totalFilled = censoSections.reduce((a, s) => a + s.filled, 0);
  const overallProgress = Math.round((totalFilled / totalFields) * 100);

  const handleExport = async (reportId: string, format: string) => {
    setExporting(reportId);
    await new Promise((r) => setTimeout(r, 2000));
    setExporting(null);
    toast.success(`Relatório exportado em ${format} com sucesso!`);
  };

  const handleValidate = async () => {
    setValidating(true);
    await new Promise((r) => setTimeout(r, 2500));
    setValidating(false);
    toast.success("Validação concluída! 6 itens requerem atenção.");
  };

  const handleExportCenso = async () => {
    setExporting("censo-full");
    await new Promise((r) => setTimeout(r, 3000));
    setExporting(null);
    toast.success("Arquivo do Censo Escolar gerado com sucesso!");
  };

  const getStatusBadge = (status: CensoSection["status"]) => {
    const map = {
      completo: <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Completo</Badge>,
      parcial: <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">Parcial</Badge>,
      pendente: <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">Pendente</Badge>,
    };
    return map[status];
  };

  const getSeverityIcon = (severity: ValidationItem["severity"]) => {
    if (severity === "error") return <AlertTriangle className="h-4 w-4 text-destructive" />;
    if (severity === "warning") return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    return <CheckCircle2 className="h-4 w-4 text-green-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Shield className="h-7 w-7 text-primary" />
            Integração MEC
          </h1>
          <p className="text-muted-foreground mt-1">Exportação para Censo Escolar e relatórios educacionais padronizados</p>
        </div>
        <div className="flex gap-2">
          <Select value={anoReferencia} onValueChange={setAnoReferencia}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleValidate} disabled={validating}>
            {validating ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
            Validar Dados
          </Button>
          <Button onClick={handleExportCenso} disabled={exporting === "censo-full"}>
            {exporting === "censo-full" ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
            Exportar Censo
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-muted">
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{s.title}</p>
                  <p className="text-xl font-bold text-foreground">{s.value}</p>
                  {s.pct !== null && <Progress value={s.pct} className="mt-1 h-1.5" />}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="censo" className="space-y-4">
        <TabsList>
          <TabsTrigger value="censo">Censo Escolar</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios MEC</TabsTrigger>
          <TabsTrigger value="validacao">Validação</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>

        {/* ── Censo Escolar ── */}
        <TabsContent value="censo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><FileSpreadsheet className="h-5 w-5 text-primary" /> Progresso do Censo Escolar {anoReferencia}</CardTitle>
              <CardDescription>Preencha todas as seções para a exportação completa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Progresso geral</span>
                <span className="font-semibold text-foreground">{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-3" />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {censoSections.map((section) => {
              const pct = Math.round((section.filled / section.fields) * 100);
              return (
                <motion.div key={section.id} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <section.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{section.title}</h3>
                            <p className="text-xs text-muted-foreground">{section.description}</p>
                          </div>
                        </div>
                        {getStatusBadge(section.status)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{section.filled}/{section.fields} campos</span>
                          <span>{pct}%</span>
                        </div>
                        <Progress value={pct} className="h-2" />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Atualizado: {new Date(section.lastUpdate).toLocaleDateString("pt-BR")}</span>
                        <Button variant="ghost" size="sm"><Eye className="h-4 w-4 mr-1" /> Revisar</Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        {/* ── Relatórios MEC ── */}
        <TabsContent value="relatorios" className="space-y-4">
          <div className="flex items-center gap-3">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="censo">Censo Escolar</SelectItem>
                <SelectItem value="saeb">SAEB</SelectItem>
                <SelectItem value="ideb">IDEB</SelectItem>
                <SelectItem value="inep">INEP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReports.map((report) => (
              <motion.div key={report.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary" />
                          <h3 className="font-semibold text-foreground text-sm">{report.name}</h3>
                        </div>
                        <p className="text-xs text-muted-foreground">{report.description}</p>
                      </div>
                      <Badge className={categoryLabels[report.category].color}>
                        {categoryLabels[report.category].label}
                      </Badge>
                    </div>
                    {report.deadline && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" /> Prazo: {report.deadline}/{anoReferencia}
                      </div>
                    )}
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {report.format.map((f) => (
                          <Badge key={f} variant="outline" className="text-xs">{f}</Badge>
                        ))}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setPreviewReport(report)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {report.format.map((f) => (
                          <Button key={f} variant="outline" size="sm" onClick={() => handleExport(report.id, f)} disabled={exporting === report.id}>
                            {exporting === report.id ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3 mr-1" />}
                            {f}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* ── Validação ── */}
        <TabsContent value="validacao" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-amber-500" /> Validação de Dados</CardTitle>
              <CardDescription>Verifique inconsistências antes de enviar ao MEC</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10"></TableHead>
                    <TableHead>Campo</TableHead>
                    <TableHead>Seção</TableHead>
                    <TableHead>Severidade</TableHead>
                    <TableHead>Mensagem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {validationItems.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>{getSeverityIcon(item.severity)}</TableCell>
                      <TableCell className="font-medium text-foreground">{item.field}</TableCell>
                      <TableCell className="text-muted-foreground">{item.section}</TableCell>
                      <TableCell>
                        <Badge variant={item.severity === "error" ? "destructive" : item.severity === "warning" ? "secondary" : "outline"}>
                          {item.severity === "error" ? "Erro" : item.severity === "warning" ? "Aviso" : "Info"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{item.message}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center space-y-2">
                <div className="text-3xl font-bold text-destructive">2</div>
                <p className="text-sm text-muted-foreground">Erros críticos</p>
                <p className="text-xs text-muted-foreground">Devem ser corrigidos antes da exportação</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center space-y-2">
                <div className="text-3xl font-bold text-amber-500">3</div>
                <p className="text-sm text-muted-foreground">Avisos</p>
                <p className="text-xs text-muted-foreground">Recomendada a correção</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center space-y-2">
                <div className="text-3xl font-bold text-green-500">1</div>
                <p className="text-sm text-muted-foreground">Validados</p>
                <p className="text-xs text-muted-foreground">Campos verificados com sucesso</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Histórico ── */}
        <TabsContent value="historico" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" /> Histórico de Exportações</CardTitle>
              <CardDescription>Registros de exportações realizadas</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Relatório</TableHead>
                    <TableHead>Formato</TableHead>
                    <TableHead>Ano Ref.</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { date: "01/03/2025", report: "Censo Escolar - Matrícula Inicial", format: "XML", year: "2025", status: "success" },
                    { date: "28/02/2025", report: "INEP - Indicadores Educacionais", format: "PDF", year: "2024", status: "success" },
                    { date: "15/02/2025", report: "IDEB - Projeção e Metas", format: "Excel", year: "2024", status: "success" },
                    { date: "10/02/2025", report: "Censo Escolar - Situação do Aluno", format: "CSV", year: "2024", status: "success" },
                    { date: "05/01/2025", report: "SAEB - Resultados por Turma", format: "PDF", year: "2024", status: "error" },
                  ].map((h, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-foreground">{h.date}</TableCell>
                      <TableCell className="font-medium text-foreground">{h.report}</TableCell>
                      <TableCell><Badge variant="outline">{h.format}</Badge></TableCell>
                      <TableCell className="text-muted-foreground">{h.year}</TableCell>
                      <TableCell>
                        <Badge className={h.status === "success" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"}>
                          {h.status === "success" ? "Sucesso" : "Erro"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Preview Dialog */}
      <Dialog open={!!previewReport} onOpenChange={() => setPreviewReport(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{previewReport?.name}</DialogTitle>
            <DialogDescription>{previewReport?.description}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className={previewReport ? categoryLabels[previewReport.category].color : ""}>{previewReport && categoryLabels[previewReport.category].label}</Badge>
              {previewReport?.deadline && <span className="text-sm text-muted-foreground">Prazo: {previewReport.deadline}/{anoReferencia}</span>}
            </div>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-foreground">Dados incluídos:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-center gap-2"><ChevronRight className="h-3 w-3" /> Identificação da instituição e código INEP</li>
                <li className="flex items-center gap-2"><ChevronRight className="h-3 w-3" /> Dados de matrícula e rendimento</li>
                <li className="flex items-center gap-2"><ChevronRight className="h-3 w-3" /> Indicadores de fluxo escolar</li>
                <li className="flex items-center gap-2"><ChevronRight className="h-3 w-3" /> Informações de infraestrutura</li>
              </ul>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Formatos disponíveis:</span>
              <div className="flex gap-1">
                {previewReport?.format.map((f) => (
                  <Button key={f} size="sm" onClick={() => { setPreviewReport(null); handleExport(previewReport.id, f); }}>
                    <Download className="h-3 w-3 mr-1" /> {f}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

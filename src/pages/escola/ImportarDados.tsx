import { useState, useRef } from "react";
import {
  Upload,
  FileSpreadsheet,
  Database,
  CheckCircle2,
  AlertTriangle,
  X,
  Download,
  Eye,
  Trash2,
  FileText,
  ArrowRight,
  Package,
  Truck,
  BookOpen,
  BookMarked,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import * as XLSX from "xlsx";

// ---------- types ----------
type ImportType = "cadastro" | "historico" | "estoque" | "fornecedores" | "biblioteca" | "emprestimos" | "financeiro";

interface ImportRecord {
  [key: string]: string | number | boolean | null;
}

interface ImportJob {
  id: string;
  fileName: string;
  type: ImportType;
  source: "csv" | "excel" | "sql";
  status: "pendente" | "validando" | "pronto" | "importado" | "erro";
  records: ImportRecord[];
  headers: string[];
  errors: string[];
  createdAt: string;
  detectedTables?: { table: string; count: number; suggestedType: ImportType }[];
}

// ---------- category config ----------
const IMPORT_CATEGORIES: { type: ImportType; label: string; description: string; icon: React.ElementType }[] = [
  { type: "cadastro", label: "Dados Cadastrais", description: "Alunos, responsáveis, turmas, endereços, contatos e matrículas.", icon: FileSpreadsheet },
  { type: "historico", label: "Histórico Escolar", description: "Notas, frequência, resultados por disciplina e ano letivo.", icon: Database },
  { type: "estoque", label: "Estoque / Almoxarifado", description: "Produtos, preços, quantidades e fornecedores.", icon: Package },
  { type: "fornecedores", label: "Fornecedores", description: "Cadastro de fornecedores com contato e endereço.", icon: Truck },
  { type: "biblioteca", label: "Biblioteca", description: "Acervo de livros com autor, editora e localização.", icon: BookOpen },
  { type: "emprestimos", label: "Empréstimos", description: "Empréstimos de livros com datas e devoluções.", icon: BookMarked },
  { type: "financeiro", label: "Financeiro", description: "Boletos, cobranças, valores e situação de pagamento.", icon: DollarSign },
];

// ---------- field maps ----------
const CADASTRO_FIELDS = [
  { key: "nome", label: "Nome Completo", required: true },
  { key: "cpf", label: "CPF", required: false },
  { key: "dataNascimento", label: "Data de Nascimento", required: false },
  { key: "endereco", label: "Endereço", required: false },
  { key: "serie", label: "Série", required: false },
  { key: "turma", label: "Turma", required: true },
  { key: "turno", label: "Turno", required: false },
  { key: "responsavel", label: "Responsável", required: false },
  { key: "telefone", label: "Telefone", required: false },
  { key: "email", label: "E-mail", required: false },
  { key: "matricula", label: "Matrícula", required: false },
];

const HISTORICO_FIELDS = [
  { key: "aluno", label: "Aluno (ID ou Nome)", required: true },
  { key: "turma", label: "Turma", required: false },
  { key: "bimestre", label: "Bimestre", required: false },
  { key: "disciplina", label: "Disciplina", required: true },
  { key: "nota", label: "Nota", required: false },
  { key: "faltas", label: "Faltas", required: false },
  { key: "recuperacao", label: "Recuperação", required: false },
  { key: "media", label: "Média", required: false },
  { key: "ano_letivo", label: "Ano Letivo", required: true },
];

const ESTOQUE_FIELDS = [
  { key: "nome", label: "Nome do Produto", required: true },
  { key: "categoria", label: "Categoria", required: false },
  { key: "preco_custo", label: "Preço de Custo", required: false },
  { key: "preco_venda", label: "Preço de Venda", required: false },
  { key: "estoque", label: "Qtd. em Estoque", required: false },
  { key: "fornecedor", label: "Fornecedor", required: false },
  { key: "qtd", label: "Quantidade", required: false },
];

const FORNECEDORES_FIELDS = [
  { key: "nome", label: "Nome / Razão Social", required: true },
  { key: "email", label: "E-mail", required: false },
  { key: "telefone", label: "Telefone", required: false },
  { key: "nome_contato", label: "Nome do Contato", required: false },
  { key: "site", label: "Site", required: false },
  { key: "cep", label: "CEP", required: false },
  { key: "endereco", label: "Endereço", required: false },
  { key: "numero", label: "Número", required: false },
  { key: "complemento", label: "Complemento", required: false },
  { key: "bairro", label: "Bairro", required: false },
  { key: "estado", label: "Estado", required: false },
  { key: "cidade", label: "Cidade", required: false },
];

const BIBLIOTECA_FIELDS = [
  { key: "titulo", label: "Título", required: true },
  { key: "autor", label: "Autor", required: false },
  { key: "editora", label: "Editora", required: false },
  { key: "ano", label: "Ano", required: false },
  { key: "codigo", label: "Código", required: false },
  { key: "localizacao", label: "Localização", required: false },
  { key: "categoria", label: "Categoria", required: false },
];

const EMPRESTIMOS_FIELDS = [
  { key: "livro", label: "Livro", required: true },
  { key: "aluno_funcionario", label: "Aluno / Funcionário", required: true },
  { key: "data_emprestimo", label: "Data do Empréstimo", required: false },
  { key: "data_devolucao", label: "Data Prevista Devolução", required: false },
  { key: "data_devolvido", label: "Data Devolvido", required: false },
];

const FINANCEIRO_FIELDS = [
  { key: "sacado", label: "Sacado / Pagador", required: true },
  { key: "valor", label: "Valor", required: false },
  { key: "data_vencimento", label: "Data de Vencimento", required: false },
  { key: "situacao", label: "Situação", required: false },
  { key: "banco", label: "Banco", required: false },
  { key: "observacoes", label: "Observações", required: false },
  { key: "data_pagamento", label: "Data de Pagamento", required: false },
];

function getFieldsForType(type: ImportType) {
  switch (type) {
    case "cadastro": return CADASTRO_FIELDS;
    case "historico": return HISTORICO_FIELDS;
    case "estoque": return ESTOQUE_FIELDS;
    case "fornecedores": return FORNECEDORES_FIELDS;
    case "biblioteca": return BIBLIOTECA_FIELDS;
    case "emprestimos": return EMPRESTIMOS_FIELDS;
    case "financeiro": return FINANCEIRO_FIELDS;
  }
}

// ---------- excluded fields from legacy SQL ----------
const EXCLUDED_FIELDS = new Set([
  "login", "senha", "password", "hash", "nome_meta", "foto", "txt_meta",
  "time", "ordem", "star", "lancamentos", "cont", "lang", "status",
  "txtcurto", "varias_categorias", "subcategorias", "categorias2",
]);

// ---------- table-to-category detection ----------
function detectTableCategory(tableName: string): ImportType {
  const t = tableName.toLowerCase();
  if (t.includes("boletim") || t.includes("bimestre")) return "historico";
  if (t.includes("almoxarifados_produto") || t.includes("produtos1_cate")) return "estoque";
  if (t.includes("almoxarifados_fornecedor") || t.includes("fornecedores1_cate")) return "fornecedores";
  if (t.includes("biblioteca_emprestimo")) return "emprestimos";
  if (t.includes("biblioteca")) return "biblioteca";
  if (t.includes("boleto") || t.includes("financeiro") || t.includes("contas")) return "financeiro";
  if (t.includes("aluno") || t.includes("categorias1") || t.includes("cadastro")) return "cadastro";
  return "cadastro";
}

// ---------- helpers ----------
function parseCSV(text: string): { headers: string[]; records: ImportRecord[] } {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return { headers: [], records: [] };
  const sep = lines[0].includes(";") ? ";" : ",";
  const headers = lines[0].split(sep).map((h) => h.trim().replace(/^"|"$/g, ""));
  const records = lines.slice(1).map((line) => {
    const values = line.split(sep).map((v) => v.trim().replace(/^"|"$/g, ""));
    const obj: ImportRecord = {};
    headers.forEach((h, i) => {
      obj[h] = values[i] ?? "";
    });
    return obj;
  });
  return { headers, records };
}

/**
 * Parses SQL INSERT statements including multi-row VALUES:
 * INSERT INTO table (col1, col2) VALUES (v1, v2), (v3, v4);
 * Also supports single-row per INSERT.
 * Returns all tables detected with their records.
 */
function parseSQLInserts(sql: string): {
  headers: string[];
  records: ImportRecord[];
  tables: { table: string; count: number; suggestedType: ImportType }[];
} {
  // Remove comments
  const cleaned = sql
    .replace(/--.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^(SET|CREATE|ALTER|DROP|USE|\/\*!\d+).*?;/gims, "");

  const allRecords: ImportRecord[] = [];
  let allHeaders: string[] = [];
  const tableMap = new Map<string, number>();

  // Match INSERT INTO ... VALUES blocks
  const insertRegex = /INSERT\s+INTO\s+[`"']?(\w+)[`"']?\s*\(([^)]+)\)\s*VALUES\s*([\s\S]*?)(?:;\s*$|;\s*(?=INSERT|CREATE|ALTER|DROP|SET|\/\*|$))/gim;

  let match: RegExpExecArray | null;
  while ((match = insertRegex.exec(cleaned)) !== null) {
    const tableName = match[1];
    const cols = match[2]
      .split(",")
      .map((c) => c.trim().replace(/[`"'\[\]]/g, ""));

    // Filter out excluded columns
    const colIndices: number[] = [];
    const filteredCols: string[] = [];
    cols.forEach((c, i) => {
      if (!EXCLUDED_FIELDS.has(c.toLowerCase())) {
        colIndices.push(i);
        filteredCols.push(c);
      }
    });

    if (!allHeaders.length) allHeaders = filteredCols;

    // Parse the VALUES block - extract individual row tuples
    const valuesBlock = match[3];
    const rows = extractValueRows(valuesBlock);

    let tableCount = tableMap.get(tableName) || 0;

    rows.forEach((rowValues) => {
      const obj: ImportRecord = {};
      colIndices.forEach((origIdx, filteredIdx) => {
        const val = rowValues[origIdx];
        obj[filteredCols[filteredIdx]] = val !== undefined ? val : "";
      });
      allRecords.push(obj);
      tableCount++;
    });

    tableMap.set(tableName, tableCount);
  }

  const tables = Array.from(tableMap.entries()).map(([table, count]) => ({
    table,
    count,
    suggestedType: detectTableCategory(table),
  }));

  // If first parse got nothing, update headers from the records
  if (allRecords.length > 0 && !allHeaders.length) {
    allHeaders = Object.keys(allRecords[0]);
  }

  return { headers: allHeaders, records: allRecords, tables };
}

/**
 * Extract individual row value tuples from a VALUES block like:
 * (val1, val2), (val3, val4), ...
 * Handles quoted strings with commas, parentheses, and escaped quotes inside.
 */
function extractValueRows(valuesBlock: string): string[][] {
  const rows: string[][] = [];
  let i = 0;
  const len = valuesBlock.length;

  while (i < len) {
    // Find opening paren
    while (i < len && valuesBlock[i] !== "(") i++;
    if (i >= len) break;
    i++; // skip '('

    // Parse values inside parens
    const values: string[] = [];
    let current = "";
    let inQuote = false;

    while (i < len) {
      const ch = valuesBlock[i];

      if (inQuote) {
        if (ch === "'" && i + 1 < len && valuesBlock[i + 1] === "'") {
          // Escaped quote
          current += "'";
          i += 2;
          continue;
        }
        if (ch === "\\" && i + 1 < len) {
          // Backslash escape
          current += valuesBlock[i + 1];
          i += 2;
          continue;
        }
        if (ch === "'") {
          inQuote = false;
          i++;
          continue;
        }
        current += ch;
        i++;
        continue;
      }

      if (ch === "'") {
        inQuote = true;
        i++;
        continue;
      }

      if (ch === ",") {
        values.push(current.trim());
        current = "";
        i++;
        continue;
      }

      if (ch === ")") {
        values.push(current.trim());
        rows.push(values);
        i++;
        break;
      }

      current += ch;
      i++;
    }
  }

  return rows;
}

function downloadTemplate(type: ImportType) {
  const fields = getFieldsForType(type);
  const catLabel = IMPORT_CATEGORIES.find((c) => c.type === type)?.label || type;
  const ws = XLSX.utils.aoa_to_sheet([fields.map((f) => f.label)]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, catLabel.substring(0, 31));
  XLSX.writeFile(wb, `modelo_${type}.xlsx`);
  toast.success(`Modelo de "${catLabel}" baixado!`);
}

// ---------- component ----------
export default function ImportarDados() {
  const [activeTab, setActiveTab] = useState<"upload" | "sql">("upload");
  const [importType, setImportType] = useState<ImportType>("cadastro");
  const [jobs, setJobs] = useState<ImportJob[]>([]);
  const [previewJob, setPreviewJob] = useState<ImportJob | null>(null);
  const [sqlText, setSqlText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({});
  const [mappingJob, setMappingJob] = useState<ImportJob | null>(null);
  const [detectedTables, setDetectedTables] = useState<{ table: string; count: number; suggestedType: ImportType }[]>([]);
  const [showTableDialog, setShowTableDialog] = useState(false);
  const [pendingSqlData, setPendingSqlData] = useState<{ headers: string[]; records: ImportRecord[] } | null>(null);

  // --- file upload ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["csv", "xls", "xlsx", "sql"].includes(ext || "")) {
      toast.error("Formato não suportado. Use CSV, Excel (.xls/.xlsx) ou SQL (.sql).");
      return;
    }

    try {
      let headers: string[] = [];
      let records: ImportRecord[] = [];

      if (ext === "sql") {
        const text = await file.text();
        const parsed = parseSQLInserts(text);
        headers = parsed.headers;
        records = parsed.records;

        if (parsed.tables.length > 0) {
          // Show table detection dialog
          setDetectedTables(parsed.tables);
          setPendingSqlData({ headers, records });
          setShowTableDialog(true);

          // Auto-select suggested type from first table
          const suggested = parsed.tables[0].suggestedType;
          setImportType(suggested);
        }

        if (!records.length) {
          toast.error("Nenhum INSERT válido encontrado no arquivo SQL.");
          return;
        }

        const job: ImportJob = {
          id: Date.now().toString(),
          fileName: file.name,
          type: parsed.tables.length > 0 ? parsed.tables[0].suggestedType : importType,
          source: "sql",
          status: "pendente",
          records,
          headers,
          errors: [],
          createdAt: new Date().toLocaleString("pt-BR"),
          detectedTables: parsed.tables,
        };

        setJobs((prev) => [job, ...prev]);
        openMapping(job);
        toast.success(`${records.length} registros extraídos de ${file.name} (${parsed.tables.length} tabela(s) detectada(s))`);
      } else if (ext === "csv") {
        const text = await file.text();
        const parsed = parseCSV(text);
        headers = parsed.headers;
        records = parsed.records;

        if (!records.length) {
          toast.error("Nenhum registro encontrado no arquivo.");
          return;
        }

        const job: ImportJob = {
          id: Date.now().toString(),
          fileName: file.name,
          type: importType,
          source: "csv",
          status: "pendente",
          records,
          headers,
          errors: [],
          createdAt: new Date().toLocaleString("pt-BR"),
        };

        setJobs((prev) => [job, ...prev]);
        openMapping(job);
        toast.success(`${records.length} registros carregados de ${file.name}`);
      } else {
        const buffer = await file.arrayBuffer();
        const wb = XLSX.read(buffer, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json<ImportRecord>(ws);
        if (data.length > 0) {
          headers = Object.keys(data[0]);
          records = data;
        }

        if (!records.length) {
          toast.error("Nenhum registro encontrado no arquivo.");
          return;
        }

        const job: ImportJob = {
          id: Date.now().toString(),
          fileName: file.name,
          type: importType,
          source: "excel",
          status: "pendente",
          records,
          headers,
          errors: [],
          createdAt: new Date().toLocaleString("pt-BR"),
        };

        setJobs((prev) => [job, ...prev]);
        openMapping(job);
        toast.success(`${records.length} registros carregados de ${file.name}`);
      }
    } catch {
      toast.error("Erro ao ler o arquivo. Verifique o formato.");
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // --- SQL import ---
  const handleSQLImport = () => {
    if (!sqlText.trim()) {
      toast.error("Cole um SQL com INSERT INTO para importação.");
      return;
    }
    const { headers, records, tables } = parseSQLInserts(sqlText);
    if (!records.length) {
      toast.error("Nenhum INSERT válido encontrado. Use formato: INSERT INTO tabela (col1, col2) VALUES ('v1', 'v2');");
      return;
    }

    const autoType = tables.length > 0 ? tables[0].suggestedType : importType;

    if (tables.length > 0) {
      setDetectedTables(tables);
      setImportType(autoType);
    }

    const job: ImportJob = {
      id: Date.now().toString(),
      fileName: "SQL importado",
      type: autoType,
      source: "sql",
      status: "pendente",
      records,
      headers,
      errors: [],
      createdAt: new Date().toLocaleString("pt-BR"),
      detectedTables: tables,
    };
    setJobs((prev) => [job, ...prev]);
    openMapping(job);
    setSqlText("");
    toast.success(`${records.length} registros extraídos do SQL (${tables.length} tabela(s): ${tables.map(t => t.table).join(", ")})`);
  };

  // --- field mapping ---
  const openMapping = (job: ImportJob) => {
    const fields = getFieldsForType(job.type);
    const autoMap: Record<string, string> = {};
    fields.forEach((f) => {
      const match = job.headers.find(
        (h) => h.toLowerCase().replace(/[^a-z0-9]/g, "") === f.key.toLowerCase().replace(/[^a-z0-9]/g, "")
      );
      if (match) autoMap[f.key] = match;
    });
    setFieldMapping(autoMap);
    setMappingJob(job);
  };

  const applyMapping = () => {
    if (!mappingJob) return;
    const fields = getFieldsForType(mappingJob.type);
    const requiredFields = fields.filter((f) => f.required);
    const missingRequired = requiredFields.filter((f) => !fieldMapping[f.key]);

    if (missingRequired.length) {
      toast.error(`Mapeie os campos obrigatórios: ${missingRequired.map((f) => f.label).join(", ")}`);
      return;
    }

    const errors: string[] = [];
    const mappedRecords = mappingJob.records.map((r, idx) => {
      const mapped: ImportRecord = {};
      Object.entries(fieldMapping).forEach(([targetKey, sourceCol]) => {
        mapped[targetKey] = r[sourceCol] ?? "";
      });
      requiredFields.forEach((f) => {
        if (!mapped[f.key] || String(mapped[f.key]).trim() === "") {
          errors.push(`Linha ${idx + 2}: campo "${f.label}" vazio`);
        }
      });
      return mapped;
    });

    const updatedJob: ImportJob = {
      ...mappingJob,
      records: mappedRecords,
      errors: errors.slice(0, 50),
      status: errors.length ? "erro" : "pronto",
    };

    setJobs((prev) => prev.map((j) => (j.id === updatedJob.id ? updatedJob : j)));
    setMappingJob(null);
    setFieldMapping({});

    if (errors.length) {
      toast.warning(`${errors.length} problema(s) encontrado(s). Revise antes de importar.`);
    } else {
      toast.success("Dados validados com sucesso! Pronto para importar.");
    }
  };

  // --- import action (localStorage mock) ---
  const executeImport = (job: ImportJob) => {
    const storageKey = `import_${job.type}`;
    const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");
    const merged = [...existing, ...job.records];
    localStorage.setItem(storageKey, JSON.stringify(merged));

    setJobs((prev) =>
      prev.map((j) => (j.id === job.id ? { ...j, status: "importado" as const } : j))
    );
    toast.success(`${job.records.length} registros importados com sucesso!`);
  };

  const removeJob = (id: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
    toast.message("Importação removida.");
  };

  const statusBadge = (status: ImportJob["status"]) => {
    const map: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      pendente: { variant: "secondary", label: "Pendente" },
      validando: { variant: "outline", label: "Validando..." },
      pronto: { variant: "default", label: "Pronto" },
      importado: { variant: "default", label: "Importado" },
      erro: { variant: "destructive", label: "Com Erros" },
    };
    const s = map[status];
    return <Badge variant={s.variant}>{s.label}</Badge>;
  };

  const typeLabelMap: Record<ImportType, string> = {
    cadastro: "Cadastral",
    historico: "Histórico",
    estoque: "Estoque",
    fornecedores: "Fornecedores",
    biblioteca: "Biblioteca",
    emprestimos: "Empréstimos",
    financeiro: "Financeiro",
  };

  const currentFields = getFieldsForType(mappingJob?.type || importType);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Importar Dados</h1>
          <p className="text-muted-foreground">
            Importe dados de outros sistemas via CSV, Excel ou SQL. Suporta dumps MySQL com INSERT multi-row.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select onValueChange={(v) => downloadTemplate(v as ImportType)}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="⬇ Baixar Modelo..." />
            </SelectTrigger>
            <SelectContent>
              {IMPORT_CATEGORIES.map((cat) => (
                <SelectItem key={cat.type} value={cat.type}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Import Type Selection - 7 categories grid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tipo de Importação</CardTitle>
          <CardDescription>Selecione o tipo de dado que deseja importar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {IMPORT_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = importType === cat.type;
              return (
                <button
                  key={cat.type}
                  type="button"
                  onClick={() => setImportType(cat.type)}
                  className={`flex items-start gap-3 rounded-lg border-2 p-4 text-left transition-all ${
                    isActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                  }`}
                >
                  <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                  <div className="min-w-0">
                    <p className="font-semibold text-sm">{cat.label}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{cat.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upload / SQL Tabs */}
      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "upload" | "sql")}>
            <TabsList className="mb-4">
              <TabsTrigger value="upload" className="gap-2">
                <Upload className="h-4 w-4" />
                Arquivo (CSV / Excel / SQL)
              </TabsTrigger>
              <TabsTrigger value="sql" className="gap-2">
                <Database className="h-4 w-4" />
                Colar SQL (INSERT)
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload">
              <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-border p-10">
                <Upload className="h-10 w-10 text-muted-foreground" />
                <div className="text-center">
                  <p className="font-medium">Arraste um arquivo ou clique para selecionar</p>
                  <p className="text-sm text-muted-foreground">Formatos aceitos: .csv, .xls, .xlsx, .sql</p>
                </div>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xls,.xlsx,.sql"
                  className="max-w-xs"
                  onChange={handleFileUpload}
                />
              </div>
            </TabsContent>

            <TabsContent value="sql">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Cole os comandos INSERT INTO do sistema legado (suporta multi-row VALUES)</Label>
                  <textarea
                    value={sqlText}
                    onChange={(e) => setSqlText(e.target.value)}
                    placeholder={`INSERT INTO alunos (nome, cpf, turma) VALUES\n('Maria Silva', '123.456.789-00', '3º Ano A'),\n('João Santos', '987.654.321-00', '2º Ano B');`}
                    className="min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
                <Button onClick={handleSQLImport} className="gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Processar SQL
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Detected Tables Info */}
      {detectedTables.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tabelas Detectadas no SQL</CardTitle>
            <CardDescription>O parser identificou as seguintes tabelas no arquivo importado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {detectedTables.map((t) => (
                <div key={t.table} className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <p className="font-mono text-sm font-medium">{t.table}</p>
                    <p className="text-xs text-muted-foreground">{t.count} registro(s)</p>
                  </div>
                  <Badge variant="outline">{typeLabelMap[t.suggestedType]}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Jobs List */}
      {jobs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Importações</CardTitle>
            <CardDescription>Gerencie e execute as importações carregadas</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Arquivo / Fonte</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Registros</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {job.fileName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{typeLabelMap[job.type]}</Badge>
                    </TableCell>
                    <TableCell>{job.records.length}</TableCell>
                    <TableCell>{statusBadge(job.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{job.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="sm" variant="ghost" onClick={() => setPreviewJob(job)} title="Visualizar">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {job.status === "pronto" && (
                          <Button size="sm" onClick={() => executeImport(job)} className="gap-1">
                            <CheckCircle2 className="h-4 w-4" />
                            Importar
                          </Button>
                        )}
                        {job.status === "erro" && (
                          <Button size="sm" variant="outline" onClick={() => openMapping(job)} className="gap-1">
                            Remapear
                          </Button>
                        )}
                        {job.status !== "importado" && (
                          <Button size="sm" variant="ghost" onClick={() => removeJob(job.id)} title="Remover">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Como importar?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">1</div>
              <div>
                <p className="font-medium">Escolha a categoria</p>
                <p className="text-sm text-muted-foreground">Selecione o tipo de dado (Cadastro, Notas, Estoque, etc.) e baixe o modelo se necessário.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">2</div>
              <div>
                <p className="font-medium">Envie o arquivo</p>
                <p className="text-sm text-muted-foreground">Faça upload de CSV, Excel ou arquivo .sql. Também pode colar SQL com INSERT INTO diretamente.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">3</div>
              <div>
                <p className="font-medium">Mapeie e importe</p>
                <p className="text-sm text-muted-foreground">Associe as colunas do arquivo aos campos do sistema, valide e confirme a importação.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Field Mapping Dialog */}
      <Dialog open={!!mappingJob} onOpenChange={() => { setMappingJob(null); setFieldMapping({}); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Mapeamento de Campos — {mappingJob ? typeLabelMap[mappingJob.type] : ""}</DialogTitle>
            <DialogDescription>
              Associe as colunas do seu arquivo aos campos do sistema. Campos com * são obrigatórios.
            </DialogDescription>
          </DialogHeader>
          {mappingJob && (
            <div className="max-h-[400px] overflow-y-auto space-y-3">
              {getFieldsForType(mappingJob.type).map((f) => (
                <div key={f.key} className="grid grid-cols-2 items-center gap-4">
                  <Label className="text-right">
                    {f.label} {f.required && <span className="text-destructive">*</span>}
                  </Label>
                  <Select
                    value={fieldMapping[f.key] || "__none__"}
                    onValueChange={(v) =>
                      setFieldMapping((prev) => ({
                        ...prev,
                        [f.key]: v === "__none__" ? "" : v,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a coluna" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">— Não mapear —</SelectItem>
                      {mappingJob.headers.map((h) => (
                        <SelectItem key={h} value={h}>{h}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setMappingJob(null); setFieldMapping({}); }}>
              Cancelar
            </Button>
            <Button onClick={applyMapping} className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Validar e Aplicar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!previewJob} onOpenChange={() => setPreviewJob(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              Pré-visualização — {previewJob?.fileName}
              <Badge variant="outline" className="ml-2">
                {previewJob?.records.length} registros
              </Badge>
            </DialogTitle>
          </DialogHeader>
          {previewJob && (
            <div className="space-y-4 overflow-auto">
              {previewJob.errors.length > 0 && (
                <div className="rounded-md border border-destructive/50 bg-destructive/5 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <span className="font-medium text-destructive">
                      {previewJob.errors.length} erro(s) encontrado(s)
                    </span>
                  </div>
                  <ul className="max-h-32 overflow-y-auto space-y-1 text-sm text-destructive">
                    {previewJob.errors.slice(0, 10).map((err, i) => (
                      <li key={i}>• {err}</li>
                    ))}
                    {previewJob.errors.length > 10 && (
                      <li className="font-medium">... e mais {previewJob.errors.length - 10} erro(s)</li>
                    )}
                  </ul>
                </div>
              )}
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">#</TableHead>
                      {Object.keys(previewJob.records[0] || {}).map((key) => (
                        <TableHead key={key}>{key}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewJob.records.slice(0, 50).map((record, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="text-muted-foreground">{idx + 1}</TableCell>
                        {Object.values(record).map((val, i) => (
                          <TableCell key={i} className="max-w-[200px] truncate">
                            {String(val ?? "")}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {previewJob.records.length > 50 && (
                <p className="text-center text-sm text-muted-foreground">
                  Mostrando 50 de {previewJob.records.length} registros
                </p>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewJob(null)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

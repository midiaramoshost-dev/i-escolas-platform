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
interface ImportRecord {
  [key: string]: string | number | boolean | null;
}

interface ImportJob {
  id: string;
  fileName: string;
  type: "cadastro" | "historico";
  source: "csv" | "excel" | "sql";
  status: "pendente" | "validando" | "pronto" | "importado" | "erro";
  records: ImportRecord[];
  headers: string[];
  errors: string[];
  createdAt: string;
}

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
  { key: "matricula", label: "Matrícula", required: true },
  { key: "nomeAluno", label: "Nome do Aluno", required: true },
  { key: "disciplina", label: "Disciplina", required: true },
  { key: "ano", label: "Ano Letivo", required: true },
  { key: "bimestre", label: "Bimestre", required: false },
  { key: "nota", label: "Nota", required: false },
  { key: "faltas", label: "Faltas", required: false },
  { key: "resultado", label: "Resultado (Aprovado/Reprovado)", required: false },
];

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

function parseSQLInserts(sql: string): { headers: string[]; records: ImportRecord[] } {
  const insertRegex = /INSERT\s+INTO\s+\S+\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/gi;
  let match: RegExpExecArray | null;
  let headers: string[] = [];
  const records: ImportRecord[] = [];

  while ((match = insertRegex.exec(sql)) !== null) {
    const cols = match[1].split(",").map((c) => c.trim().replace(/[`"[\]]/g, ""));
    if (!headers.length) headers = cols;
    const vals = match[2].split(",").map((v) => v.trim().replace(/^'|'$/g, ""));
    const obj: ImportRecord = {};
    cols.forEach((c, i) => {
      obj[c] = vals[i] ?? "";
    });
    records.push(obj);
  }
  return { headers, records };
}

function downloadTemplate(type: "cadastro" | "historico") {
  const fields = type === "cadastro" ? CADASTRO_FIELDS : HISTORICO_FIELDS;
  const ws = XLSX.utils.aoa_to_sheet([fields.map((f) => f.label)]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, type === "cadastro" ? "Cadastro" : "Historico");
  XLSX.writeFile(wb, `modelo_${type}.xlsx`);
  toast.success(`Modelo de ${type === "cadastro" ? "dados cadastrais" : "histórico"} baixado!`);
}

// ---------- component ----------
export default function ImportarDados() {
  const [activeTab, setActiveTab] = useState<"upload" | "sql">("upload");
  const [importType, setImportType] = useState<"cadastro" | "historico">("cadastro");
  const [jobs, setJobs] = useState<ImportJob[]>([]);
  const [previewJob, setPreviewJob] = useState<ImportJob | null>(null);
  const [sqlText, setSqlText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({});
  const [mappingJob, setMappingJob] = useState<ImportJob | null>(null);

  // --- file upload ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["csv", "xls", "xlsx"].includes(ext || "")) {
      toast.error("Formato não suportado. Use CSV ou Excel (.xls/.xlsx).");
      return;
    }

    try {
      let headers: string[] = [];
      let records: ImportRecord[] = [];

      if (ext === "csv") {
        const text = await file.text();
        const parsed = parseCSV(text);
        headers = parsed.headers;
        records = parsed.records;
      } else {
        const buffer = await file.arrayBuffer();
        const wb = XLSX.read(buffer, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json<ImportRecord>(ws);
        if (data.length > 0) {
          headers = Object.keys(data[0]);
          records = data;
        }
      }

      if (!records.length) {
        toast.error("Nenhum registro encontrado no arquivo.");
        return;
      }

      const job: ImportJob = {
        id: Date.now().toString(),
        fileName: file.name,
        type: importType,
        source: ext === "csv" ? "csv" : "excel",
        status: "pendente",
        records,
        headers,
        errors: [],
        createdAt: new Date().toLocaleString("pt-BR"),
      };

      setJobs((prev) => [job, ...prev]);
      openMapping(job);
      toast.success(`${records.length} registros carregados de ${file.name}`);
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
    const { headers, records } = parseSQLInserts(sqlText);
    if (!records.length) {
      toast.error("Nenhum INSERT válido encontrado. Use formato: INSERT INTO tabela (col1, col2) VALUES ('v1', 'v2');");
      return;
    }
    const job: ImportJob = {
      id: Date.now().toString(),
      fileName: "SQL importado",
      type: importType,
      source: "sql",
      status: "pendente",
      records,
      headers,
      errors: [],
      createdAt: new Date().toLocaleString("pt-BR"),
    };
    setJobs((prev) => [job, ...prev]);
    openMapping(job);
    setSqlText("");
    toast.success(`${records.length} registros extraídos do SQL.`);
  };

  // --- field mapping ---
  const openMapping = (job: ImportJob) => {
    const fields = job.type === "cadastro" ? CADASTRO_FIELDS : HISTORICO_FIELDS;
    const autoMap: Record<string, string> = {};
    fields.forEach((f) => {
      const match = job.headers.find(
        (h) => h.toLowerCase().replace(/[^a-z]/g, "") === f.key.toLowerCase().replace(/[^a-z]/g, "")
      );
      if (match) autoMap[f.key] = match;
    });
    setFieldMapping(autoMap);
    setMappingJob(job);
  };

  const applyMapping = () => {
    if (!mappingJob) return;
    const fields = mappingJob.type === "cadastro" ? CADASTRO_FIELDS : HISTORICO_FIELDS;
    const requiredFields = fields.filter((f) => f.required);
    const missingRequired = requiredFields.filter((f) => !fieldMapping[f.key]);

    if (missingRequired.length) {
      toast.error(`Mapeie os campos obrigatórios: ${missingRequired.map((f) => f.label).join(", ")}`);
      return;
    }

    // Validate and map records
    const errors: string[] = [];
    const mappedRecords = mappingJob.records.map((r, idx) => {
      const mapped: ImportRecord = {};
      Object.entries(fieldMapping).forEach(([targetKey, sourceCol]) => {
        mapped[targetKey] = r[sourceCol] ?? "";
      });
      // Check required
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
    const storageKey = job.type === "cadastro" ? "import_cadastro" : "import_historico";
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

  const fields = importType === "cadastro" ? CADASTRO_FIELDS : HISTORICO_FIELDS;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Importar Dados</h1>
          <p className="text-muted-foreground">
            Importe dados cadastrais e histórico escolar de outros sistemas via CSV, Excel ou SQL.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => downloadTemplate("cadastro")}>
            <Download className="h-4 w-4" />
            Modelo Cadastro
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => downloadTemplate("historico")}>
            <Download className="h-4 w-4" />
            Modelo Histórico
          </Button>
        </div>
      </div>

      {/* Import Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tipo de Importação</CardTitle>
          <CardDescription>Selecione o tipo de dado que deseja importar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <button
              type="button"
              onClick={() => setImportType("cadastro")}
              className={`flex items-start gap-4 rounded-lg border-2 p-4 text-left transition-all ${
                importType === "cadastro" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
              }`}
            >
              <FileSpreadsheet className={`mt-0.5 h-6 w-6 ${importType === "cadastro" ? "text-primary" : "text-muted-foreground"}`} />
              <div>
                <p className="font-semibold">Dados Cadastrais</p>
                <p className="text-sm text-muted-foreground">
                  Alunos, responsáveis, turmas, endereços, contatos e matrículas.
                </p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setImportType("historico")}
              className={`flex items-start gap-4 rounded-lg border-2 p-4 text-left transition-all ${
                importType === "historico" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
              }`}
            >
              <Database className={`mt-0.5 h-6 w-6 ${importType === "historico" ? "text-primary" : "text-muted-foreground"}`} />
              <div>
                <p className="font-semibold">Histórico Escolar</p>
                <p className="text-sm text-muted-foreground">
                  Notas, frequência, resultados por disciplina e ano letivo.
                </p>
              </div>
            </button>
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
                Arquivo (CSV / Excel)
              </TabsTrigger>
              <TabsTrigger value="sql" className="gap-2">
                <Database className="h-4 w-4" />
                SQL (INSERT)
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload">
              <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-border p-10">
                <Upload className="h-10 w-10 text-muted-foreground" />
                <div className="text-center">
                  <p className="font-medium">Arraste um arquivo ou clique para selecionar</p>
                  <p className="text-sm text-muted-foreground">Formatos aceitos: .csv, .xls, .xlsx</p>
                </div>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xls,.xlsx"
                  className="max-w-xs"
                  onChange={handleFileUpload}
                />
              </div>
            </TabsContent>

            <TabsContent value="sql">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Cole os comandos INSERT INTO do sistema legado</Label>
                  <textarea
                    value={sqlText}
                    onChange={(e) => setSqlText(e.target.value)}
                    placeholder={`INSERT INTO alunos (nome, cpf, turma) VALUES ('Maria Silva', '123.456.789-00', '3º Ano A');\nINSERT INTO alunos (nome, cpf, turma) VALUES ('João Santos', '987.654.321-00', '2º Ano B');`}
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
                      <Badge variant="outline">
                        {job.type === "cadastro" ? "Cadastral" : "Histórico"}
                      </Badge>
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
                <p className="font-medium">Baixe o modelo</p>
                <p className="text-sm text-muted-foreground">Use os botões acima para baixar o template Excel com as colunas corretas.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">2</div>
              <div>
                <p className="font-medium">Preencha e envie</p>
                <p className="text-sm text-muted-foreground">Preencha os dados no modelo, salve e faça o upload aqui. Ou cole SQL com INSERT INTO.</p>
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
            <DialogTitle>Mapeamento de Campos</DialogTitle>
            <DialogDescription>
              Associe as colunas do seu arquivo aos campos do sistema. Campos com * são obrigatórios.
            </DialogDescription>
          </DialogHeader>
          {mappingJob && (
            <div className="max-h-[400px] overflow-y-auto space-y-3">
              {fields.map((f) => (
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

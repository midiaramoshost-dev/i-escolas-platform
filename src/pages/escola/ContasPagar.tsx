import { useState, useRef } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Printer,
  FileText,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  Settings,
  Save,
  Users,
  FileCheck,
  Receipt,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useAlunosResponsaveis } from "@/contexts/AlunosResponsaveisContext";

// ─── Types ───────────────────────────────────────────────────────────

interface ContaPagar {
  id: string;
  descricao: string;
  fornecedor: string;
  categoria: string;
  valor: number;
  dataVencimento: string;
  dataPagamento?: string;
  status: "pendente" | "pago" | "vencido";
  anexo?: string;
  observacoes?: string;
}

interface DocTemplate {
  id: string;
  title: string;
  fileName: string;
  content: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Data ────────────────────────────────────────────────────────────

const initialContas: ContaPagar[] = [
  { id: "1", descricao: "Energia Elétrica - Janeiro", fornecedor: "CPFL Energia", categoria: "Utilidades", valor: 2850.0, dataVencimento: "2024-01-25", status: "pendente" },
  { id: "2", descricao: "Internet Fibra", fornecedor: "Vivo Empresas", categoria: "Telecomunicações", valor: 450.0, dataVencimento: "2024-01-20", dataPagamento: "2024-01-18", status: "pago" },
  { id: "3", descricao: "Material de Limpeza", fornecedor: "Distribuidora Clean", categoria: "Suprimentos", valor: 1200.0, dataVencimento: "2024-01-15", status: "vencido" },
  { id: "4", descricao: "Manutenção Ar Condicionado", fornecedor: "Clima Tech", categoria: "Manutenção", valor: 800.0, dataVencimento: "2024-01-30", status: "pendente" },
  { id: "5", descricao: "Material Didático", fornecedor: "Editora Educação", categoria: "Material Pedagógico", valor: 5500.0, dataVencimento: "2024-02-05", status: "pendente" },
];

const categorias = ["Utilidades", "Telecomunicações", "Suprimentos", "Manutenção", "Material Pedagógico", "Alimentação", "Transporte", "Outros"];

type PaymentProviderKey = "mercadopago" | "pagarme" | "stripe" | "asaas";

const contractVariables = [
  { key: "{{NOME_RESPONSAVEL}}", desc: "Nome do responsável" },
  { key: "{{CPF_RESPONSAVEL}}", desc: "CPF do responsável" },
  { key: "{{ENDERECO_RESPONSAVEL}}", desc: "Endereço do responsável" },
  { key: "{{TELEFONE_RESPONSAVEL}}", desc: "Telefone do responsável" },
  { key: "{{EMAIL_RESPONSAVEL}}", desc: "E-mail do responsável" },
  { key: "{{PARENTESCO}}", desc: "Parentesco" },
  { key: "{{NOME_ALUNO}}", desc: "Nome do aluno" },
  { key: "{{MATRICULA}}", desc: "Matrícula do aluno" },
  { key: "{{TURMA}}", desc: "Turma do aluno" },
  { key: "{{SERIE}}", desc: "Série do aluno" },
  { key: "{{DATA_ATUAL}}", desc: "Data de hoje" },
];

// ─── Helpers ─────────────────────────────────────────────────────────

function loadTemplates(key: string): DocTemplate[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function persistTemplates(key: string, list: DocTemplate[]) {
  localStorage.setItem(key, JSON.stringify(list));
}

function printDocument(title: string, content: string, fileName: string) {
  const w = window.open("", "_blank");
  if (!w) { toast.error("Popup bloqueado. Permita popups para imprimir."); return; }
  const escaped = content.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  w.document.open();
  w.document.write(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"/><title>${title}</title>
<style>body{font-family:Arial,Helvetica,sans-serif;padding:40px;max-width:800px;margin:0 auto}h1{font-size:20px;margin:0 0 8px;border-bottom:2px solid #333;padding-bottom:8px}.meta{color:#666;font-size:12px;margin-bottom:24px}.content{white-space:pre-wrap;word-wrap:break-word;font-size:14px;line-height:1.6}@media print{body{padding:20px}}</style>
</head><body><h1>${title}</h1><div class="meta">Arquivo: ${fileName || "(sem anexo)"} — Impresso em ${new Date().toLocaleDateString("pt-BR")}</div><div class="content">${escaped}</div><script>window.onload=function(){window.print();}<\/script></body></html>`);
  w.document.close();
  toast.success("Documento enviado para impressão");
}

// ─── Component ───────────────────────────────────────────────────────

export default function ContasPagar() {
  const { responsaveis, alunos, getAlunosComResponsaveis } = useAlunosResponsaveis();

  // Contas state
  const [contas, setContas] = useState<ContaPagar[]>(initialContas);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedConta, setSelectedConta] = useState<ContaPagar | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Payment config
  const [isPaymentsConfigOpen, setIsPaymentsConfigOpen] = useState(false);
  const [paymentsConfig, setPaymentsConfig] = useState({
    provider: "mercadopago" as PaymentProviderKey,
    environment: "sandbox" as "sandbox" | "production",
    apiKey: "", publicKey: "", webhookUrl: "",
    enabledMethods: { pix: true, boleto: true, card: true },
  });

  // ─── Recibos (templates) ───
  const recibosInputRef = useRef<HTMLInputElement>(null);
  const [isRecibosOpen, setIsRecibosOpen] = useState(false);
  const [isRecibosEditing, setIsRecibosEditing] = useState(false);
  const [selectedReciboId, setSelectedReciboId] = useState<string | null>(null);
  const [recibosForm, setRecibosForm] = useState({ title: "", fileName: "", content: "" });
  const [reciboTemplates, setReciboTemplates] = useState<DocTemplate[]>(() => loadTemplates("school:receiptTemplates"));

  const saveReciboTemplates = (list: DocTemplate[]) => { setReciboTemplates(list); persistTemplates("school:receiptTemplates", list); };

  // ─── Contratos (templates) ───
  const contratosInputRef = useRef<HTMLInputElement>(null);
  const [isContratosOpen, setIsContratosOpen] = useState(false);
  const [isContratosEditing, setIsContratosEditing] = useState(false);
  const [selectedContratoId, setSelectedContratoId] = useState<string | null>(null);
  const [contratosForm, setContratosForm] = useState({ title: "", fileName: "", content: "" });
  const [contratoTemplates, setContratoTemplates] = useState<DocTemplate[]>(() => loadTemplates("school:contractTemplates"));
  const [isBatchDialogOpen, setIsBatchDialogOpen] = useState(false);
  const [selectedResponsavelIds, setSelectedResponsavelIds] = useState<string[]>([]);

  const saveContratoTemplates = (list: DocTemplate[]) => { setContratoTemplates(list); persistTemplates("school:contractTemplates", list); };

  // Form data for contas
  const [formData, setFormData] = useState({ descricao: "", fornecedor: "", categoria: "", valor: "", dataVencimento: "", observacoes: "" });

  // ─── Contas logic ──────────────────────────────────────────────────

  const filteredContas = contas.filter((c) => {
    const matchesSearch = c.descricao.toLowerCase().includes(searchTerm.toLowerCase()) || c.fornecedor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch && (filterStatus === "all" || c.status === filterStatus);
  });

  const totalPendente = contas.filter((c) => c.status === "pendente").reduce((a, c) => a + c.valor, 0);
  const totalVencido = contas.filter((c) => c.status === "vencido").reduce((a, c) => a + c.valor, 0);
  const totalPago = contas.filter((c) => c.status === "pago").reduce((a, c) => a + c.valor, 0);

  const resetForm = () => { setFormData({ descricao: "", fornecedor: "", categoria: "", valor: "", dataVencimento: "", observacoes: "" }); setIsEditing(false); setSelectedConta(null); };
  const handleOpenCreate = () => { resetForm(); setIsDialogOpen(true); };
  const handleOpenEdit = (conta: ContaPagar) => { setFormData({ descricao: conta.descricao, fornecedor: conta.fornecedor, categoria: conta.categoria, valor: conta.valor.toString(), dataVencimento: conta.dataVencimento, observacoes: conta.observacoes || "" }); setSelectedConta(conta); setIsEditing(true); setIsDialogOpen(true); };
  const handleOpenView = (conta: ContaPagar) => { setSelectedConta(conta); setIsViewDialogOpen(true); };
  const handleOpenDelete = (conta: ContaPagar) => { setSelectedConta(conta); setIsDeleteDialogOpen(true); };

  const handleSave = () => {
    if (!formData.descricao || !formData.fornecedor || !formData.valor) { toast.error("Preencha todos os campos obrigatórios"); return; }
    if (isEditing && selectedConta) {
      setContas(contas.map((c) => c.id === selectedConta.id ? { ...c, descricao: formData.descricao, fornecedor: formData.fornecedor, categoria: formData.categoria, valor: parseFloat(formData.valor), dataVencimento: formData.dataVencimento, observacoes: formData.observacoes } : c));
      toast.success("Conta atualizada com sucesso!");
    } else {
      setContas([...contas, { id: Date.now().toString(), descricao: formData.descricao, fornecedor: formData.fornecedor, categoria: formData.categoria, valor: parseFloat(formData.valor), dataVencimento: formData.dataVencimento, status: "pendente", observacoes: formData.observacoes }]);
      toast.success("Conta criada com sucesso!");
    }
    setIsDialogOpen(false); resetForm();
  };

  const handleDelete = () => { if (selectedConta) { setContas(contas.filter((c) => c.id !== selectedConta.id)); toast.success("Conta excluída com sucesso!"); setIsDeleteDialogOpen(false); setSelectedConta(null); } };
  const handlePrint = () => { window.print(); toast.success("Relatório enviado para impressão"); };

  const handleExport = () => {
    const csvContent = [["Descrição", "Fornecedor", "Categoria", "Valor", "Vencimento", "Status"].join(","), ...filteredContas.map((c) => [c.descricao, c.fornecedor, c.categoria, c.valor.toFixed(2), c.dataVencimento, c.status].join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "contas_pagar.csv"; a.click();
    toast.success("Arquivo exportado com sucesso!");
  };

  const handleUpload = () => { fileInputRef.current?.click(); };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) toast.success(`Arquivo "${file.name}" anexado com sucesso!`); };

  // Payment config
  const handleOpenPaymentsConfig = () => { try { const raw = localStorage.getItem("school:paymentsConfig"); if (raw) setPaymentsConfig(JSON.parse(raw)); } catch {} setIsPaymentsConfigOpen(true); };
  const handleSavePaymentsConfig = () => { try { localStorage.setItem("school:paymentsConfig", JSON.stringify(paymentsConfig)); toast.success("Configurações de pagamento salvas!"); setIsPaymentsConfigOpen(false); } catch { toast.error("Não foi possível salvar as configurações"); } };

  // ─── Template CRUD (generic) ───────────────────────────────────────

  const handleTemplateSave = (
    form: { title: string; fileName: string; content: string },
    templates: DocTemplate[],
    save: (l: DocTemplate[]) => void,
    isEditingFlag: boolean,
    selectedId: string | null,
    resetFn: () => void,
  ) => {
    if (!form.title.trim()) { toast.error("Informe o título do modelo"); return; }
    if (isEditingFlag && selectedId) {
      save(templates.map((t) => t.id === selectedId ? { ...t, title: form.title, fileName: form.fileName, content: form.content, updatedAt: new Date().toISOString() } : t));
      toast.success("Modelo atualizado!");
    } else {
      const newT: DocTemplate = { id: Date.now().toString(), title: form.title, fileName: form.fileName, content: form.content, isDefault: templates.length === 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      save([...templates, newT]);
      toast.success("Modelo salvo!");
    }
    resetFn();
  };

  const handleTemplateDelete = (id: string, templates: DocTemplate[], save: (l: DocTemplate[]) => void, selectedId: string | null, resetFn: () => void) => {
    const updated = templates.filter((t) => t.id !== id);
    if (updated.length > 0 && !updated.some((t) => t.isDefault)) updated[0].isDefault = true;
    save(updated);
    if (selectedId === id) resetFn();
    toast.success("Modelo excluído");
  };

  const handleTemplateSetDefault = (id: string, templates: DocTemplate[], save: (l: DocTemplate[]) => void) => {
    save(templates.map((t) => ({ ...t, isDefault: t.id === id })));
    toast.success("Modelo definido como padrão!");
  };

  // Recibos handlers
  const resetRecibosForm = () => { setRecibosForm({ title: "", fileName: "", content: "" }); setIsRecibosEditing(false); setSelectedReciboId(null); };
  const handleReciboFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (!f) return; setRecibosForm((p) => ({ ...p, fileName: f.name, title: p.title || f.name })); toast.success(`Arquivo "${f.name}" carregado.`); };

  // Contratos handlers
  const resetContratosForm = () => { setContratosForm({ title: "", fileName: "", content: "" }); setIsContratosEditing(false); setSelectedContratoId(null); };
  const handleContratoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (!f) return; setContratosForm((p) => ({ ...p, fileName: f.name, title: p.title || f.name })); toast.success(`Arquivo "${f.name}" carregado.`); };

  // ─── Batch contract generation ─────────────────────────────────────

  const defaultContrato = contratoTemplates.find((t) => t.isDefault);

  const substituirVariaveis = (content: string, responsavelId: string): string => {
    const resp = responsaveis.find((r) => r.id === responsavelId);
    if (!resp) return content;
    const alunosDoResp = alunos.filter((a) => a.responsavelId === responsavelId);
    const aluno = alunosDoResp[0];
    let result = content;
    result = result.replace(/\{\{NOME_RESPONSAVEL\}\}/g, resp.nome);
    result = result.replace(/\{\{CPF_RESPONSAVEL\}\}/g, resp.cpf);
    result = result.replace(/\{\{ENDERECO_RESPONSAVEL\}\}/g, resp.endereco);
    result = result.replace(/\{\{TELEFONE_RESPONSAVEL\}\}/g, resp.telefone);
    result = result.replace(/\{\{EMAIL_RESPONSAVEL\}\}/g, resp.email);
    result = result.replace(/\{\{PARENTESCO\}\}/g, resp.parentesco);
    result = result.replace(/\{\{NOME_ALUNO\}\}/g, aluno?.nome || "—");
    result = result.replace(/\{\{MATRICULA\}\}/g, aluno?.matricula || "—");
    result = result.replace(/\{\{TURMA\}\}/g, aluno?.turma || "—");
    result = result.replace(/\{\{SERIE\}\}/g, aluno?.serie || "—");
    result = result.replace(/\{\{DATA_ATUAL\}\}/g, new Date().toLocaleDateString("pt-BR"));
    return result;
  };

  const handleOpenBatch = () => {
    if (!defaultContrato) { toast.error("Crie e defina um modelo de contrato como padrão primeiro."); return; }
    setSelectedResponsavelIds(responsaveis.filter((r) => r.status === "ativo").map((r) => r.id));
    setIsBatchDialogOpen(true);
  };

  const handleGenerateBatch = () => {
    if (!defaultContrato) return;
    if (selectedResponsavelIds.length === 0) { toast.error("Selecione ao menos um responsável"); return; }
    const w = window.open("", "_blank");
    if (!w) { toast.error("Popup bloqueado. Permita popups para imprimir."); return; }

    const pages = selectedResponsavelIds.map((rId) => {
      const content = substituirVariaveis(defaultContrato.content, rId);
      const resp = responsaveis.find((r) => r.id === rId);
      return `<div class="page"><h2>${defaultContrato.title}</h2><p class="meta">Responsável: ${resp?.nome || "—"} — Gerado em ${new Date().toLocaleDateString("pt-BR")}</p><div class="content">${content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div></div>`;
    }).join("");

    w.document.open();
    w.document.write(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"/><title>Contratos em Lote</title>
<style>
body{font-family:Arial,Helvetica,sans-serif;margin:0;padding:0}
.page{padding:40px;max-width:800px;margin:0 auto;page-break-after:always}
.page:last-child{page-break-after:auto}
h2{font-size:18px;margin:0 0 8px;border-bottom:2px solid #333;padding-bottom:6px}
.meta{color:#666;font-size:12px;margin-bottom:20px}
.content{white-space:pre-wrap;word-wrap:break-word;font-size:14px;line-height:1.6}
@media print{.page{padding:20px}}
</style></head><body>${pages}<script>window.onload=function(){window.print();}<\/script></body></html>`);
    w.document.close();
    toast.success(`${selectedResponsavelIds.length} contratos gerados para impressão!`);
    setIsBatchDialogOpen(false);
  };

  const toggleResponsavel = (id: string) => {
    setSelectedResponsavelIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const toggleAllResponsaveis = () => {
    const activeIds = responsaveis.filter((r) => r.status === "ativo").map((r) => r.id);
    setSelectedResponsavelIds((prev) => prev.length === activeIds.length ? [] : activeIds);
  };

  // ─── Status badge ──────────────────────────────────────────────────

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pago": return <Badge className="bg-success text-success-foreground">Pago</Badge>;
      case "pendente": return <Badge className="bg-warning text-warning-foreground">Pendente</Badge>;
      case "vencido": return <Badge variant="destructive">Vencido</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // ─── Template list component ───────────────────────────────────────

  const renderTemplateList = (
    templates: DocTemplate[],
    save: (l: DocTemplate[]) => void,
    onEdit: (t: DocTemplate) => void,
    selectedId: string | null,
    resetFn: () => void,
  ) => (
    templates.length > 0 ? (
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Modelos Salvos</Label>
        <div className="rounded-lg border divide-y max-h-[200px] overflow-y-auto">
          {templates.map((t) => (
            <div key={t.id} className={`flex items-center justify-between px-3 py-2 text-sm ${t.id === selectedId ? "bg-primary/5" : ""}`}>
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="truncate font-medium">{t.title}</span>
                {t.isDefault && <Badge variant="secondary" className="text-xs shrink-0">Padrão</Badge>}
                {t.fileName && <span className="text-xs text-muted-foreground truncate">({t.fileName})</span>}
              </div>
              <div className="flex items-center gap-1 shrink-0 ml-2">
                {!t.isDefault && <Button variant="ghost" size="sm" onClick={() => handleTemplateSetDefault(t.id, templates, save)} title="Definir como padrão"><CheckCircle className="h-3.5 w-3.5" /></Button>}
                <Button variant="ghost" size="sm" onClick={() => onEdit(t)} title="Editar"><Edit className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="sm" onClick={() => printDocument(t.title, t.content, t.fileName)} title="Imprimir"><Printer className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleTemplateDelete(t.id, templates, save, selectedId, resetFn)} title="Excluir"><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : null
  );

  const renderTemplateForm = (
    form: { title: string; fileName: string; content: string },
    setForm: React.Dispatch<React.SetStateAction<{ title: string; fileName: string; content: string }>>,
    isEditingFlag: boolean,
    resetFn: () => void,
    onUpload: () => void,
    onSave: () => void,
    placeholder: string,
    showVariables?: boolean,
  ) => (
    <div className="rounded-lg border p-4 space-y-4 bg-muted/20">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold">{isEditingFlag ? "Editando Modelo" : "Novo Modelo"}</Label>
        {isEditingFlag && <Button variant="ghost" size="sm" onClick={resetFn}>Cancelar Edição</Button>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Título *</Label>
          <Input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Ex: Recibo de Mensalidade" />
        </div>
        <div className="space-y-2">
          <Label>Arquivo (PDF/DOC/DOCX)</Label>
          <div className="flex gap-2">
            <Input value={form.fileName} readOnly placeholder="Nenhum arquivo selecionado" />
            <Button type="button" variant="outline" onClick={onUpload}><Upload className="h-4 w-4 mr-2" />Enviar</Button>
          </div>
        </div>
      </div>
      {showVariables && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Variáveis disponíveis (clique para inserir)</Label>
          <div className="flex flex-wrap gap-1">
            {contractVariables.map((v) => (
              <Badge key={v.key} variant="outline" className="cursor-pointer hover:bg-primary/10 text-xs" title={v.desc}
                onClick={() => setForm((p) => ({ ...p, content: p.content + v.key }))}>
                {v.key}
              </Badge>
            ))}
          </div>
        </div>
      )}
      <div className="space-y-2">
        <Label>Conteúdo (edição no painel)</Label>
        <Textarea value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} placeholder={placeholder} className="min-h-[200px]" />
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={() => printDocument(form.title || "Documento", form.content || "", form.fileName)} disabled={!form.content && !form.title}>
          <Printer className="h-4 w-4 mr-2" />Imprimir
        </Button>
        <Button onClick={onSave}><Save className="h-4 w-4 mr-2" />{isEditingFlag ? "Atualizar Modelo" : "Salvar Modelo"}</Button>
      </div>
    </div>
  );

  // ─── Render ────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.doc,.docx,.xls,.xlsx" />
      <input type="file" ref={recibosInputRef} onChange={handleReciboFileChange} className="hidden" accept=".pdf,.doc,.docx" />
      <input type="file" ref={contratosInputRef} onChange={handleContratoFileChange} className="hidden" accept=".pdf,.doc,.docx" />

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contas a Pagar</h1>
          <p className="text-muted-foreground">Gerencie as contas e despesas da escola</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleOpenPaymentsConfig}><Settings className="h-4 w-4 mr-2" />APIs de Pagamento</Button>
          <Button variant="outline" onClick={() => { resetRecibosForm(); setIsRecibosOpen(true); }}><Receipt className="h-4 w-4 mr-2" />Recibos</Button>
          <Button variant="outline" onClick={() => { resetContratosForm(); setIsContratosOpen(true); }}><FileCheck className="h-4 w-4 mr-2" />Contratos</Button>
          <Button variant="outline" onClick={handlePrint}><Printer className="h-4 w-4 mr-2" />Imprimir</Button>
          <Button variant="outline" onClick={handleExport}><Download className="h-4 w-4 mr-2" />Exportar</Button>
          <Button variant="outline" onClick={handleUpload}><Upload className="h-4 w-4 mr-2" />Importar</Button>
          <Button onClick={handleOpenCreate}><Plus className="h-4 w-4 mr-2" />Nova Conta</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Pendente</CardTitle><Clock className="h-5 w-5 text-warning" /></CardHeader>
          <CardContent><div className="text-2xl font-bold text-warning">R$ {totalPendente.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div></CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Vencido</CardTitle><AlertCircle className="h-5 w-5 text-destructive" /></CardHeader>
          <CardContent><div className="text-2xl font-bold text-destructive">R$ {totalVencido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div></CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Pago (Mês)</CardTitle><CheckCircle className="h-5 w-5 text-success" /></CardHeader>
          <CardContent><div className="text-2xl font-bold text-success">R$ {totalPago.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div></CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Buscar por descrição ou fornecedor..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="pago">Pago</SelectItem>
                <SelectItem value="vencido">Vencido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="shadow-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContas.map((conta) => (
                <TableRow key={conta.id}>
                  <TableCell className="font-medium">{conta.descricao}</TableCell>
                  <TableCell>{conta.fornecedor}</TableCell>
                  <TableCell><Badge variant="outline">{conta.categoria}</Badge></TableCell>
                  <TableCell className="font-medium">R$ {conta.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>{new Date(conta.dataVencimento).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell>{getStatusBadge(conta.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-background">
                        <DropdownMenuItem onClick={() => handleOpenView(conta)}><Eye className="mr-2 h-4 w-4" />Visualizar</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenEdit(conta)}><Edit className="mr-2 h-4 w-4" />Editar</DropdownMenuItem>
                        <DropdownMenuItem onClick={handleUpload}><Upload className="mr-2 h-4 w-4" />Anexar Arquivo</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleOpenDelete(conta)}><Trash2 className="mr-2 h-4 w-4" />Excluir</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ─── Dialog: APIs de Pagamento ─── */}
      <Dialog open={isPaymentsConfigOpen} onOpenChange={setIsPaymentsConfigOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Configurar APIs de Pagamento</DialogTitle>
            <DialogDescription>Configure o provedor e credenciais usadas nos pagamentos (Pix, Boleto e Cartão).</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Provedor</Label>
                <Select value={paymentsConfig.provider} onValueChange={(v) => setPaymentsConfig((p) => ({ ...p, provider: v as PaymentProviderKey }))}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mercadopago">Mercado Pago</SelectItem>
                    <SelectItem value="pagarme">Pagar.me</SelectItem>
                    <SelectItem value="stripe">Stripe</SelectItem>
                    <SelectItem value="asaas">Asaas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Ambiente</Label>
                <Select value={paymentsConfig.environment} onValueChange={(v) => setPaymentsConfig((p) => ({ ...p, environment: v as "sandbox" | "production" }))}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sandbox">Sandbox / Teste</SelectItem>
                    <SelectItem value="production">Produção</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>API Key / Token</Label><Input value={paymentsConfig.apiKey} onChange={(e) => setPaymentsConfig((p) => ({ ...p, apiKey: e.target.value }))} placeholder="Ex: xxxxx" /></div>
              <div className="space-y-2"><Label>Public Key (opcional)</Label><Input value={paymentsConfig.publicKey} onChange={(e) => setPaymentsConfig((p) => ({ ...p, publicKey: e.target.value }))} placeholder="Ex: pk_xxxxx" /></div>
            </div>
            <div className="space-y-2"><Label>Webhook URL (opcional)</Label><Input value={paymentsConfig.webhookUrl} onChange={(e) => setPaymentsConfig((p) => ({ ...p, webhookUrl: e.target.value }))} placeholder="https://.../webhook" /></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(["pix", "boleto", "card"] as const).map((method) => (
                <button key={method} type="button" onClick={() => setPaymentsConfig((p) => ({ ...p, enabledMethods: { ...p.enabledMethods, [method]: !p.enabledMethods[method] } }))}
                  className={`flex items-center justify-between p-3 rounded-lg border ${paymentsConfig.enabledMethods[method] ? "border-primary bg-primary/5" : "border-border"}`}>
                  <span className="text-sm font-medium capitalize">{method === "card" ? "Cartão" : method === "boleto" ? "Boleto" : "Pix"}</span>
                  <Badge variant={paymentsConfig.enabledMethods[method] ? "default" : "secondary"}>{paymentsConfig.enabledMethods[method] ? "Ativo" : "Inativo"}</Badge>
                </button>
              ))}
            </div>
            <div className="rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground">Dica: por enquanto estas configurações ficam salvas no navegador (localStorage).</div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentsConfigOpen(false)}>Cancelar</Button>
            <Button onClick={handleSavePaymentsConfig}><Save className="h-4 w-4 mr-2" />Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Dialog: Recibos ─── */}
      <Dialog open={isRecibosOpen} onOpenChange={setIsRecibosOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Receipt className="h-5 w-5" /> Modelos de Recibos</DialogTitle>
            <DialogDescription>Crie, edite e gerencie seus modelos de recibos. Defina um como padrão.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            {renderTemplateList(reciboTemplates, saveReciboTemplates, (t) => { setRecibosForm({ title: t.title, fileName: t.fileName, content: t.content }); setIsRecibosEditing(true); setSelectedReciboId(t.id); }, selectedReciboId, resetRecibosForm)}
            {renderTemplateForm(recibosForm, setRecibosForm, isRecibosEditing, resetRecibosForm, () => recibosInputRef.current?.click(),
              () => handleTemplateSave(recibosForm, reciboTemplates, saveReciboTemplates, isRecibosEditing, selectedReciboId, resetRecibosForm),
              "Cole/edite aqui o texto do recibo.")}
            <div className="rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground">Os modelos ficam salvos no navegador (localStorage). O primeiro modelo salvo é automaticamente definido como padrão.</div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setIsRecibosOpen(false)}>Fechar</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Dialog: Contratos ─── */}
      <Dialog open={isContratosOpen} onOpenChange={setIsContratosOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><FileCheck className="h-5 w-5" /> Modelos de Contratos</DialogTitle>
            <DialogDescription>Crie modelos de contrato com variáveis dinâmicas e gere em lote para todos os responsáveis.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            {/* Batch button */}
            <div className="flex items-center justify-between rounded-lg border p-3 bg-primary/5">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Geração em Lote</p>
                  <p className="text-xs text-muted-foreground">{responsaveis.filter((r) => r.status === "ativo").length} responsáveis ativos cadastrados</p>
                </div>
              </div>
              <Button size="sm" onClick={handleOpenBatch} disabled={contratoTemplates.length === 0}>
                <Printer className="h-4 w-4 mr-2" />Gerar Contratos
              </Button>
            </div>

            {renderTemplateList(contratoTemplates, saveContratoTemplates, (t) => { setContratosForm({ title: t.title, fileName: t.fileName, content: t.content }); setIsContratosEditing(true); setSelectedContratoId(t.id); }, selectedContratoId, resetContratosForm)}
            {renderTemplateForm(contratosForm, setContratosForm, isContratosEditing, resetContratosForm, () => contratosInputRef.current?.click(),
              () => handleTemplateSave(contratosForm, contratoTemplates, saveContratoTemplates, isContratosEditing, selectedContratoId, resetContratosForm),
              "Use variáveis como {{NOME_RESPONSAVEL}}, {{NOME_ALUNO}}, {{CPF_RESPONSAVEL}} no texto do contrato.",
              true)}
            <div className="rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground">
              Os modelos ficam salvos no navegador (localStorage). Use as variáveis dinâmicas para personalizar os contratos ao gerar em lote.
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setIsContratosOpen(false)}>Fechar</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Dialog: Geração em Lote ─── */}
      <Dialog open={isBatchDialogOpen} onOpenChange={setIsBatchDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Gerar Contratos em Lote</DialogTitle>
            <DialogDescription>
              Modelo padrão: <strong>{defaultContrato?.title || "—"}</strong>. Selecione os responsáveis para gerar os contratos.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Responsáveis ({selectedResponsavelIds.length} selecionados)</Label>
              <Button variant="ghost" size="sm" onClick={toggleAllResponsaveis}>
                {selectedResponsavelIds.length === responsaveis.filter((r) => r.status === "ativo").length ? "Desmarcar Todos" : "Selecionar Todos"}
              </Button>
            </div>
            <div className="rounded-lg border divide-y max-h-[300px] overflow-y-auto">
              {responsaveis.filter((r) => r.status === "ativo").map((r) => {
                const alunosDoResp = alunos.filter((a) => a.responsavelId === r.id);
                return (
                  <label key={r.id} className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-muted/50">
                    <Checkbox checked={selectedResponsavelIds.includes(r.id)} onCheckedChange={() => toggleResponsavel(r.id)} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{r.nome}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {r.parentesco} — {alunosDoResp.map((a) => a.nome).join(", ") || "Sem alunos"}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs shrink-0">{r.cpf}</Badge>
                  </label>
                );
              })}
            </div>
            {responsaveis.filter((r) => r.status === "inativo").length > 0 && (
              <p className="text-xs text-muted-foreground">{responsaveis.filter((r) => r.status === "inativo").length} responsável(is) inativo(s) oculto(s).</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBatchDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleGenerateBatch} disabled={selectedResponsavelIds.length === 0}>
              <Printer className="h-4 w-4 mr-2" />Gerar {selectedResponsavelIds.length} Contrato(s)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Dialog: Nova/Editar Conta ─── */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Conta" : "Nova Conta a Pagar"}</DialogTitle>
            <DialogDescription>{isEditing ? "Atualize os dados da conta" : "Cadastre uma nova conta a pagar"}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2"><Label htmlFor="descricao">Descrição *</Label><Input id="descricao" placeholder="Ex: Energia Elétrica - Janeiro" value={formData.descricao} onChange={(e) => setFormData({ ...formData, descricao: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="fornecedor">Fornecedor *</Label><Input id="fornecedor" placeholder="Nome do fornecedor" value={formData.fornecedor} onChange={(e) => setFormData({ ...formData, fornecedor: e.target.value })} /></div>
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Select value={formData.categoria} onValueChange={(value) => setFormData({ ...formData, categoria: value })}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{categorias.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="valor">Valor *</Label><Input id="valor" type="number" step="0.01" placeholder="0,00" value={formData.valor} onChange={(e) => setFormData({ ...formData, valor: e.target.value })} /></div>
              <div className="space-y-2"><Label htmlFor="vencimento">Data Vencimento</Label><Input id="vencimento" type="date" value={formData.dataVencimento} onChange={(e) => setFormData({ ...formData, dataVencimento: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label htmlFor="observacoes">Observações</Label><Textarea id="observacoes" placeholder="Informações adicionais..." value={formData.observacoes} onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>Cancelar</Button>
            <Button onClick={handleSave}>{isEditing ? "Salvar Alterações" : "Cadastrar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Visualizar */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader><DialogTitle>Detalhes da Conta</DialogTitle></DialogHeader>
          {selectedConta && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-muted-foreground">Descrição</Label><p className="font-medium">{selectedConta.descricao}</p></div>
                <div><Label className="text-muted-foreground">Status</Label><div className="mt-1">{getStatusBadge(selectedConta.status)}</div></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-muted-foreground">Fornecedor</Label><p className="font-medium">{selectedConta.fornecedor}</p></div>
                <div><Label className="text-muted-foreground">Categoria</Label><p className="font-medium">{selectedConta.categoria}</p></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-muted-foreground">Valor</Label><p className="font-medium text-lg">R$ {selectedConta.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p></div>
                <div><Label className="text-muted-foreground">Vencimento</Label><p className="font-medium">{new Date(selectedConta.dataVencimento).toLocaleDateString("pt-BR")}</p></div>
              </div>
              {selectedConta.observacoes && <div><Label className="text-muted-foreground">Observações</Label><p className="font-medium">{selectedConta.observacoes}</p></div>}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Fechar</Button>
            <Button onClick={() => { setIsViewDialogOpen(false); if (selectedConta) handleOpenEdit(selectedConta); }}>Editar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AlertDialog de Excluir */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>Tem certeza que deseja excluir a conta "{selectedConta?.descricao}"? Esta ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

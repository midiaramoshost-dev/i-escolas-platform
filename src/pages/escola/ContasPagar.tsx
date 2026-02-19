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
import { toast } from "sonner";

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

const initialContas: ContaPagar[] = [
  {
    id: "1",
    descricao: "Energia Elétrica - Janeiro",
    fornecedor: "CPFL Energia",
    categoria: "Utilidades",
    valor: 2850.0,
    dataVencimento: "2024-01-25",
    status: "pendente",
  },
  {
    id: "2",
    descricao: "Internet Fibra",
    fornecedor: "Vivo Empresas",
    categoria: "Telecomunicações",
    valor: 450.0,
    dataVencimento: "2024-01-20",
    dataPagamento: "2024-01-18",
    status: "pago",
  },
  {
    id: "3",
    descricao: "Material de Limpeza",
    fornecedor: "Distribuidora Clean",
    categoria: "Suprimentos",
    valor: 1200.0,
    dataVencimento: "2024-01-15",
    status: "vencido",
  },
  {
    id: "4",
    descricao: "Manutenção Ar Condicionado",
    fornecedor: "Clima Tech",
    categoria: "Manutenção",
    valor: 800.0,
    dataVencimento: "2024-01-30",
    status: "pendente",
  },
  {
    id: "5",
    descricao: "Material Didático",
    fornecedor: "Editora Educação",
    categoria: "Material Pedagógico",
    valor: 5500.0,
    dataVencimento: "2024-02-05",
    status: "pendente",
  },
];

const categorias = [
  "Utilidades",
  "Telecomunicações",
  "Suprimentos",
  "Manutenção",
  "Material Pedagógico",
  "Alimentação",
  "Transporte",
  "Outros",
];

type PaymentProviderKey = "mercadopago" | "pagarme" | "stripe" | "asaas";

export default function ContasPagar() {
  const [contas, setContas] = useState<ContaPagar[]>(initialContas);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedConta, setSelectedConta] = useState<ContaPagar | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Config de APIs de pagamento (mínimo: só UI + persistência local)
  const [isPaymentsConfigOpen, setIsPaymentsConfigOpen] = useState(false);
  const [paymentsConfig, setPaymentsConfig] = useState({
    provider: "mercadopago" as PaymentProviderKey,
    environment: "sandbox" as "sandbox" | "production",
    apiKey: "",
    publicKey: "",
    webhookUrl: "",
    enabledMethods: {
      pix: true,
      boleto: true,
      card: true,
    },
  });

  // Recibos/Contratos: gestão de modelos com localStorage
  interface DocTemplate {
    id: string;
    title: string;
    fileName: string;
    content: string;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
  }

  const docsInputRef = useRef<HTMLInputElement>(null);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isDocsEditing, setIsDocsEditing] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [docsForm, setDocsForm] = useState({
    title: "",
    fileName: "",
    content: "",
  });
  const [templates, setTemplates] = useState<DocTemplate[]>(() => {
    try {
      const raw = localStorage.getItem("school:docTemplates");
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  });

  const saveTemplates = (updated: DocTemplate[]) => {
    setTemplates(updated);
    localStorage.setItem("school:docTemplates", JSON.stringify(updated));
  };

  const [formData, setFormData] = useState({
    descricao: "",
    fornecedor: "",
    categoria: "",
    valor: "",
    dataVencimento: "",
    observacoes: "",
  });

  const filteredContas = contas.filter((conta) => {
    const matchesSearch =
      conta.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conta.fornecedor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || conta.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPendente = contas
    .filter((c) => c.status === "pendente")
    .reduce((acc, c) => acc + c.valor, 0);

  const totalVencido = contas
    .filter((c) => c.status === "vencido")
    .reduce((acc, c) => acc + c.valor, 0);

  const totalPago = contas
    .filter((c) => c.status === "pago")
    .reduce((acc, c) => acc + c.valor, 0);

  const resetForm = () => {
    setFormData({
      descricao: "",
      fornecedor: "",
      categoria: "",
      valor: "",
      dataVencimento: "",
      observacoes: "",
    });
    setIsEditing(false);
    setSelectedConta(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (conta: ContaPagar) => {
    setFormData({
      descricao: conta.descricao,
      fornecedor: conta.fornecedor,
      categoria: conta.categoria,
      valor: conta.valor.toString(),
      dataVencimento: conta.dataVencimento,
      observacoes: conta.observacoes || "",
    });
    setSelectedConta(conta);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleOpenView = (conta: ContaPagar) => {
    setSelectedConta(conta);
    setIsViewDialogOpen(true);
  };

  const handleOpenDelete = (conta: ContaPagar) => {
    setSelectedConta(conta);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.descricao || !formData.fornecedor || !formData.valor) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (isEditing && selectedConta) {
      setContas(
        contas.map((c) =>
          c.id === selectedConta.id
            ? {
                ...c,
                descricao: formData.descricao,
                fornecedor: formData.fornecedor,
                categoria: formData.categoria,
                valor: parseFloat(formData.valor),
                dataVencimento: formData.dataVencimento,
                observacoes: formData.observacoes,
              }
            : c
        )
      );
      toast.success("Conta atualizada com sucesso!");
    } else {
      const novaConta: ContaPagar = {
        id: Date.now().toString(),
        descricao: formData.descricao,
        fornecedor: formData.fornecedor,
        categoria: formData.categoria,
        valor: parseFloat(formData.valor),
        dataVencimento: formData.dataVencimento,
        status: "pendente",
        observacoes: formData.observacoes,
      };
      setContas([...contas, novaConta]);
      toast.success("Conta criada com sucesso!");
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (selectedConta) {
      setContas(contas.filter((c) => c.id !== selectedConta.id));
      toast.success("Conta excluída com sucesso!");
      setIsDeleteDialogOpen(false);
      setSelectedConta(null);
    }
  };

  const handlePrint = () => {
    window.print();
    toast.success("Relatório enviado para impressão");
  };

  const handleExport = () => {
    const csvContent = [
      ["Descrição", "Fornecedor", "Categoria", "Valor", "Vencimento", "Status"].join(","
      ),
      ...filteredContas.map((c) =>
        [
          c.descricao,
          c.fornecedor,
          c.categoria,
          c.valor.toFixed(2),
          c.dataVencimento,
          c.status,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contas_pagar.csv";
    a.click();
    toast.success("Arquivo exportado com sucesso!");
  };

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.success(`Arquivo "${file.name}" anexado com sucesso!`);
    }
  };

  const handleOpenPaymentsConfig = () => {
    // tenta carregar do localStorage para simular persistência
    try {
      const raw = localStorage.getItem("school:paymentsConfig");
      if (raw) setPaymentsConfig(JSON.parse(raw));
    } catch {
      // ignore
    }
    setIsPaymentsConfigOpen(true);
  };

  const handleSavePaymentsConfig = () => {
    try {
      localStorage.setItem("school:paymentsConfig", JSON.stringify(paymentsConfig));
      toast.success("Configurações de pagamento salvas!");
      setIsPaymentsConfigOpen(false);
    } catch {
      toast.error("Não foi possível salvar as configurações");
    }
  };

  const handleOpenDocs = () => {
    setDocsForm({ title: "", fileName: "", content: "" });
    setIsDocsEditing(false);
    setSelectedTemplateId(null);
    setIsDocsOpen(true);
  };

  const handleDocsUpload = () => {
    docsInputRef.current?.click();
  };

  const handleDocsFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext !== "pdf" && ext !== "doc" && ext !== "docx") {
      toast.error("Envie um arquivo .pdf, .doc ou .docx");
      return;
    }
    setDocsForm((prev) => ({
      ...prev,
      fileName: file.name,
      title: prev.title || file.name,
    }));
    toast.success(`Arquivo "${file.name}" carregado.`);
  };

  const handleDocsSave = () => {
    if (!docsForm.title.trim()) {
      toast.error("Informe o título do modelo");
      return;
    }
    if (isDocsEditing && selectedTemplateId) {
      const updated = templates.map((t) =>
        t.id === selectedTemplateId
          ? { ...t, title: docsForm.title, fileName: docsForm.fileName, content: docsForm.content, updatedAt: new Date().toISOString() }
          : t
      );
      saveTemplates(updated);
      toast.success("Modelo atualizado!");
    } else {
      const newTemplate: DocTemplate = {
        id: Date.now().toString(),
        title: docsForm.title,
        fileName: docsForm.fileName,
        content: docsForm.content,
        isDefault: templates.length === 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveTemplates([...templates, newTemplate]);
      toast.success("Modelo salvo!");
    }
    setDocsForm({ title: "", fileName: "", content: "" });
    setIsDocsEditing(false);
    setSelectedTemplateId(null);
  };

  const handleDocsEdit = (t: DocTemplate) => {
    setDocsForm({ title: t.title, fileName: t.fileName, content: t.content });
    setIsDocsEditing(true);
    setSelectedTemplateId(t.id);
  };

  const handleDocsDelete = (id: string) => {
    const updated = templates.filter((t) => t.id !== id);
    if (updated.length > 0 && !updated.some((t) => t.isDefault)) {
      updated[0].isDefault = true;
    }
    saveTemplates(updated);
    if (selectedTemplateId === id) {
      setDocsForm({ title: "", fileName: "", content: "" });
      setIsDocsEditing(false);
      setSelectedTemplateId(null);
    }
    toast.success("Modelo excluído");
  };

  const handleDocsSetDefault = (id: string) => {
    const updated = templates.map((t) => ({ ...t, isDefault: t.id === id }));
    saveTemplates(updated);
    toast.success("Modelo definido como padrão!");
  };

  const printDocument = (title: string, content: string, fileName: string) => {
    const w = window.open("", "_blank");
    if (!w) {
      toast.error("Popup bloqueado. Permita popups para imprimir.");
      return;
    }
    const escaped = content.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    w.document.open();
    w.document.write(`<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <style>
    body{font-family: Arial, Helvetica, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto;}
    h1{font-size: 20px; margin: 0 0 8px; border-bottom: 2px solid #333; padding-bottom: 8px;}
    .meta{color:#666; font-size: 12px; margin-bottom: 24px;}
    .content{white-space: pre-wrap; word-wrap: break-word; font-size: 14px; line-height: 1.6;}
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <div class="meta">Arquivo: ${fileName || "(sem anexo)"} — Impresso em ${new Date().toLocaleDateString("pt-BR")}</div>
  <div class="content">${escaped}</div>
  <script>window.onload=function(){window.print();}</script>
</body>
</html>`);
    w.document.close();
    toast.success("Documento enviado para impressão");
  };

  const handleDocsPrint = () => {
    printDocument(docsForm.title || "Documento", docsForm.content || "", docsForm.fileName);
  };

  const handleDocsPrintTemplate = (t: DocTemplate) => {
    printDocument(t.title, t.content, t.fileName);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pago":
        return <Badge className="bg-success text-success-foreground">Pago</Badge>;
      case "pendente":
        return <Badge className="bg-warning text-warning-foreground">Pendente</Badge>;
      case "vencido":
        return <Badge variant="destructive">Vencido</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.doc,.docx,.xls,.xlsx"
      />

      <input
        type="file"
        ref={docsInputRef}
        onChange={handleDocsFileChange}
        className="hidden"
        accept=".pdf,.doc,.docx"
      />

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contas a Pagar</h1>
          <p className="text-muted-foreground">Gerencie as contas e despesas da escola</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleOpenPaymentsConfig}>
            <Settings className="h-4 w-4 mr-2" />
            APIs de Pagamento
          </Button>
          <Button variant="outline" onClick={handleOpenDocs}>
            <FileText className="h-4 w-4 mr-2" />
            Recibos e Contratos
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" onClick={handleUpload}>
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
          <Button onClick={handleOpenCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Conta
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pendente</CardTitle>
            <Clock className="h-5 w-5 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              R$ {totalPendente.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Vencido</CardTitle>
            <AlertCircle className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              R$ {totalVencido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pago (Mês)</CardTitle>
            <CheckCircle className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              R$ {totalPago.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por descrição ou fornecedor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
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
                  <TableCell>
                    <Badge variant="outline">{conta.categoria}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    R$ {conta.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>{new Date(conta.dataVencimento).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell>{getStatusBadge(conta.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-background">
                        <DropdownMenuItem onClick={() => handleOpenView(conta)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenEdit(conta)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleUpload}>
                          <Upload className="mr-2 h-4 w-4" />
                          Anexar Arquivo
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleOpenDelete(conta)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog de Configurar APIs de pagamento */}
      <Dialog open={isPaymentsConfigOpen} onOpenChange={setIsPaymentsConfigOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Configurar APIs de Pagamento</DialogTitle>
            <DialogDescription>
              Configure o provedor e credenciais usadas nos pagamentos (Pix, Boleto e Cartão).
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Provedor</Label>
                <Select
                  value={paymentsConfig.provider}
                  onValueChange={(v) =>
                    setPaymentsConfig((p) => ({ ...p, provider: v as PaymentProviderKey }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
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
                <Select
                  value={paymentsConfig.environment}
                  onValueChange={(v) =>
                    setPaymentsConfig((p) => ({ ...p, environment: v as "sandbox" | "production" }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sandbox">Sandbox / Teste</SelectItem>
                    <SelectItem value="production">Produção</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>API Key / Token</Label>
                <Input
                  value={paymentsConfig.apiKey}
                  onChange={(e) => setPaymentsConfig((p) => ({ ...p, apiKey: e.target.value }))}
                  placeholder="Ex: xxxxx"
                />
              </div>
              <div className="space-y-2">
                <Label>Public Key (opcional)</Label>
                <Input
                  value={paymentsConfig.publicKey}
                  onChange={(e) => setPaymentsConfig((p) => ({ ...p, publicKey: e.target.value }))}
                  placeholder="Ex: pk_xxxxx"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Webhook URL (opcional)</Label>
              <Input
                value={paymentsConfig.webhookUrl}
                onChange={(e) => setPaymentsConfig((p) => ({ ...p, webhookUrl: e.target.value }))}
                placeholder="https://.../webhook"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() =>
                  setPaymentsConfig((p) => ({ ...p, enabledMethods: { ...p.enabledMethods, pix: !p.enabledMethods.pix } }))
                }
                className={`flex items-center justify-between p-3 rounded-lg border ${paymentsConfig.enabledMethods.pix ? "border-primary bg-primary/5" : "border-border"}`}
              >
                <span className="text-sm font-medium">Pix</span>
                <Badge variant={paymentsConfig.enabledMethods.pix ? "default" : "secondary"}>
                  {paymentsConfig.enabledMethods.pix ? "Ativo" : "Inativo"}
                </Badge>
              </button>
              <button
                type="button"
                onClick={() =>
                  setPaymentsConfig((p) => ({ ...p, enabledMethods: { ...p.enabledMethods, boleto: !p.enabledMethods.boleto } }))
                }
                className={`flex items-center justify-between p-3 rounded-lg border ${paymentsConfig.enabledMethods.boleto ? "border-primary bg-primary/5" : "border-border"}`}
              >
                <span className="text-sm font-medium">Boleto</span>
                <Badge variant={paymentsConfig.enabledMethods.boleto ? "default" : "secondary"}>
                  {paymentsConfig.enabledMethods.boleto ? "Ativo" : "Inativo"}
                </Badge>
              </button>
              <button
                type="button"
                onClick={() =>
                  setPaymentsConfig((p) => ({ ...p, enabledMethods: { ...p.enabledMethods, card: !p.enabledMethods.card } }))
                }
                className={`flex items-center justify-between p-3 rounded-lg border ${paymentsConfig.enabledMethods.card ? "border-primary bg-primary/5" : "border-border"}`}
              >
                <span className="text-sm font-medium">Cartão</span>
                <Badge variant={paymentsConfig.enabledMethods.card ? "default" : "secondary"}>
                  {paymentsConfig.enabledMethods.card ? "Ativo" : "Inativo"}
                </Badge>
              </button>
            </div>

            <div className="rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground">
              Dica: por enquanto estas configurações ficam salvas no navegador (localStorage). Depois podemos plugar com Supabase para ficar por escola/usuário.
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentsConfigOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSavePaymentsConfig}>
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Recibos e Contratos */}
      <Dialog open={isDocsOpen} onOpenChange={setIsDocsOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Recibos e Contratos — Modelos</DialogTitle>
            <DialogDescription>
              Crie, edite e gerencie seus modelos de recibos e contratos. Defina um como padrão.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            {/* Lista de modelos salvos */}
            {templates.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Modelos Salvos</Label>
                <div className="rounded-lg border divide-y max-h-[200px] overflow-y-auto">
                  {templates.map((t) => (
                    <div key={t.id} className={`flex items-center justify-between px-3 py-2 text-sm ${t.id === selectedTemplateId ? "bg-primary/5" : ""}`}>
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="truncate font-medium">{t.title}</span>
                        {t.isDefault && (
                          <Badge variant="secondary" className="text-xs shrink-0">Padrão</Badge>
                        )}
                        {t.fileName && (
                          <span className="text-xs text-muted-foreground truncate">({t.fileName})</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        {!t.isDefault && (
                          <Button variant="ghost" size="sm" onClick={() => handleDocsSetDefault(t.id)} title="Definir como padrão">
                            <CheckCircle className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => handleDocsEdit(t)} title="Editar">
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDocsPrintTemplate(t)} title="Imprimir">
                          <Printer className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDocsDelete(t.id)} title="Excluir">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Formulário de criação / edição */}
            <div className="rounded-lg border p-4 space-y-4 bg-muted/20">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">
                  {isDocsEditing ? "Editando Modelo" : "Novo Modelo"}
                </Label>
                {isDocsEditing && (
                  <Button variant="ghost" size="sm" onClick={() => {
                    setDocsForm({ title: "", fileName: "", content: "" });
                    setIsDocsEditing(false);
                    setSelectedTemplateId(null);
                  }}>
                    Cancelar Edição
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Título *</Label>
                  <Input
                    value={docsForm.title}
                    onChange={(e) => setDocsForm((p) => ({ ...p, title: e.target.value }))}
                    placeholder="Ex: Contrato de Prestação de Serviços"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Arquivo (PDF/DOC/DOCX)</Label>
                  <div className="flex gap-2">
                    <Input value={docsForm.fileName} readOnly placeholder="Nenhum arquivo selecionado" />
                    <Button type="button" variant="outline" onClick={handleDocsUpload}>
                      <Upload className="h-4 w-4 mr-2" />
                      Enviar
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Conteúdo (edição no painel)</Label>
                <Textarea
                  value={docsForm.content}
                  onChange={(e) => setDocsForm((p) => ({ ...p, content: e.target.value }))}
                  placeholder="Cole/edite aqui o texto do recibo/contrato."
                  className="min-h-[200px]"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleDocsPrint} disabled={!docsForm.content && !docsForm.title}>
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir
                </Button>
                <Button onClick={handleDocsSave}>
                  <Save className="h-4 w-4 mr-2" />
                  {isDocsEditing ? "Atualizar Modelo" : "Salvar Modelo"}
                </Button>
              </div>
            </div>

            <div className="rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground">
              Os modelos ficam salvos no navegador (localStorage). O primeiro modelo salvo é automaticamente definido como padrão.
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDocsOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Conta" : "Nova Conta a Pagar"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Atualize os dados da conta" : "Cadastre uma nova conta a pagar"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Input
                id="descricao"
                placeholder="Ex: Energia Elétrica - Janeiro"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fornecedor">Fornecedor *</Label>
                <Input
                  id="fornecedor"
                  placeholder="Nome do fornecedor"
                  value={formData.fornecedor}
                  onChange={(e) => setFormData({ ...formData, fornecedor: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Select
                  value={formData.categoria}
                  onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="valor">Valor *</Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vencimento">Data Vencimento</Label>
                <Input
                  id="vencimento"
                  type="date"
                  value={formData.dataVencimento}
                  onChange={(e) => setFormData({ ...formData, dataVencimento: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                placeholder="Informações adicionais..."
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                resetForm();
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleSave}>{isEditing ? "Salvar Alterações" : "Cadastrar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Visualizar */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detalhes da Conta</DialogTitle>
          </DialogHeader>
          {selectedConta && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Descrição</Label>
                  <p className="font-medium">{selectedConta.descricao}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedConta.status)}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Fornecedor</Label>
                  <p className="font-medium">{selectedConta.fornecedor}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Categoria</Label>
                  <p className="font-medium">{selectedConta.categoria}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Valor</Label>
                  <p className="font-medium text-lg">
                    R$ {selectedConta.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Vencimento</Label>
                  <p className="font-medium">
                    {new Date(selectedConta.dataVencimento).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
              {selectedConta.observacoes && (
                <div>
                  <Label className="text-muted-foreground">Observações</Label>
                  <p className="font-medium">{selectedConta.observacoes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Fechar
            </Button>
            <Button
              onClick={() => {
                setIsViewDialogOpen(false);
                if (selectedConta) handleOpenEdit(selectedConta);
              }}
            >
              Editar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AlertDialog de Excluir */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a conta "{selectedConta?.descricao}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

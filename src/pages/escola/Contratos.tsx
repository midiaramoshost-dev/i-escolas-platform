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
  CheckCircle,
  Clock,
  AlertCircle,
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

interface Contrato {
  id: string;
  numero: string;
  tipo: string;
  parte: string;
  descricao: string;
  valorMensal?: number;
  valorTotal?: number;
  dataInicio: string;
  dataFim: string;
  status: "ativo" | "expirado" | "cancelado" | "pendente";
  anexo?: string;
  observacoes?: string;
}

const initialContratos: Contrato[] = [
  {
    id: "1",
    numero: "CTR-2024-0001",
    tipo: "Prestação de Serviço",
    parte: "Maria Silva (Responsável - Ana Beatriz)",
    descricao: "Contrato de Prestação de Serviços Educacionais - Ano Letivo 2024",
    valorMensal: 1200.00,
    dataInicio: "2024-02-01",
    dataFim: "2024-12-20",
    status: "ativo",
  },
  {
    id: "2",
    numero: "CTR-2024-0002",
    tipo: "Fornecimento",
    parte: "Distribuidora Clean Ltda",
    descricao: "Contrato de Fornecimento de Material de Limpeza",
    valorMensal: 2500.00,
    dataInicio: "2024-01-01",
    dataFim: "2024-12-31",
    status: "ativo",
  },
  {
    id: "3",
    numero: "CTR-2024-0003",
    tipo: "Locação",
    parte: "Imobiliária Central",
    descricao: "Locação de Espaço para Atividades Extracurriculares",
    valorMensal: 3000.00,
    dataInicio: "2024-03-01",
    dataFim: "2024-11-30",
    status: "pendente",
  },
  {
    id: "4",
    numero: "CTR-2023-0045",
    tipo: "Prestação de Serviço",
    parte: "TechEdu Sistemas",
    descricao: "Contrato de Manutenção de Sistemas",
    valorMensal: 1500.00,
    dataInicio: "2023-01-01",
    dataFim: "2023-12-31",
    status: "expirado",
  },
  {
    id: "5",
    numero: "CTR-2024-0004",
    tipo: "Prestação de Serviço",
    parte: "Carlos Santos (Responsável - Bruno Costa)",
    descricao: "Contrato de Prestação de Serviços Educacionais - Ano Letivo 2024",
    valorMensal: 1200.00,
    dataInicio: "2024-02-01",
    dataFim: "2024-12-20",
    status: "ativo",
  },
];

const tipos = ["Prestação de Serviço", "Fornecimento", "Locação", "Trabalho", "Parceria", "Outros"];

export default function Contratos() {
  const [contratos, setContratos] = useState<Contrato[]>(initialContratos);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterTipo, setFilterTipo] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedContrato, setSelectedContrato] = useState<Contrato | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    tipo: "",
    parte: "",
    descricao: "",
    valorMensal: "",
    dataInicio: "",
    dataFim: "",
    observacoes: "",
  });

  const filteredContratos = contratos.filter((contrato) => {
    const matchesSearch =
      contrato.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contrato.parte.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contrato.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || contrato.status === filterStatus;
    const matchesTipo = filterTipo === "all" || contrato.tipo === filterTipo;
    return matchesSearch && matchesStatus && matchesTipo;
  });

  const totalAtivos = contratos.filter(c => c.status === "ativo").length;
  const totalPendentes = contratos.filter(c => c.status === "pendente").length;
  const totalExpirados = contratos.filter(c => c.status === "expirado").length;
  const valorMensalTotal = contratos
    .filter(c => c.status === "ativo")
    .reduce((acc, c) => acc + (c.valorMensal || 0), 0);

  const gerarNumeroContrato = () => {
    const ano = new Date().getFullYear();
    const numero = String(contratos.length + 1).padStart(4, '0');
    return `CTR-${ano}-${numero}`;
  };

  const resetForm = () => {
    setFormData({
      tipo: "",
      parte: "",
      descricao: "",
      valorMensal: "",
      dataInicio: "",
      dataFim: "",
      observacoes: "",
    });
    setIsEditing(false);
    setSelectedContrato(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (contrato: Contrato) => {
    setFormData({
      tipo: contrato.tipo,
      parte: contrato.parte,
      descricao: contrato.descricao,
      valorMensal: contrato.valorMensal?.toString() || "",
      dataInicio: contrato.dataInicio,
      dataFim: contrato.dataFim,
      observacoes: contrato.observacoes || "",
    });
    setSelectedContrato(contrato);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleOpenView = (contrato: Contrato) => {
    setSelectedContrato(contrato);
    setIsViewDialogOpen(true);
  };

  const handleOpenDelete = (contrato: Contrato) => {
    setSelectedContrato(contrato);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.parte || !formData.descricao || !formData.dataInicio || !formData.dataFim) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (isEditing && selectedContrato) {
      setContratos(contratos.map(c => 
        c.id === selectedContrato.id 
          ? {
              ...c,
              tipo: formData.tipo,
              parte: formData.parte,
              descricao: formData.descricao,
              valorMensal: parseFloat(formData.valorMensal) || undefined,
              dataInicio: formData.dataInicio,
              dataFim: formData.dataFim,
              observacoes: formData.observacoes,
            }
          : c
      ));
      toast.success("Contrato atualizado com sucesso!");
    } else {
      const novoContrato: Contrato = {
        id: Date.now().toString(),
        numero: gerarNumeroContrato(),
        tipo: formData.tipo,
        parte: formData.parte,
        descricao: formData.descricao,
        valorMensal: parseFloat(formData.valorMensal) || undefined,
        dataInicio: formData.dataInicio,
        dataFim: formData.dataFim,
        status: "pendente",
        observacoes: formData.observacoes,
      };
      setContratos([novoContrato, ...contratos]);
      toast.success("Contrato criado com sucesso!");
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (selectedContrato) {
      setContratos(contratos.map(c => 
        c.id === selectedContrato.id 
          ? { ...c, status: "cancelado" as const }
          : c
      ));
      toast.success("Contrato cancelado com sucesso!");
      setIsDeleteDialogOpen(false);
      setSelectedContrato(null);
    }
  };

  const handleAtivar = (contrato: Contrato) => {
    setContratos(contratos.map(c => 
      c.id === contrato.id 
        ? { ...c, status: "ativo" as const }
        : c
    ));
    toast.success("Contrato ativado!");
  };

  const handlePrint = (contrato?: Contrato) => {
    if (contrato) {
      const printContent = `
        <html>
          <head><title>Contrato ${contrato.numero}</title></head>
          <body style="font-family: Arial; padding: 20px;">
            <h1>CONTRATO ${contrato.numero}</h1>
            <p><strong>Tipo:</strong> ${contrato.tipo}</p>
            <p><strong>Parte:</strong> ${contrato.parte}</p>
            <p><strong>Descrição:</strong> ${contrato.descricao}</p>
            <p><strong>Vigência:</strong> ${new Date(contrato.dataInicio).toLocaleDateString('pt-BR')} a ${new Date(contrato.dataFim).toLocaleDateString('pt-BR')}</p>
            ${contrato.valorMensal ? `<p><strong>Valor Mensal:</strong> R$ ${contrato.valorMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>` : ''}
            <p><strong>Status:</strong> ${contrato.status.toUpperCase()}</p>
          </body>
        </html>
      `;
      const printWindow = window.open('', '_blank');
      printWindow?.document.write(printContent);
      printWindow?.document.close();
      printWindow?.print();
    } else {
      window.print();
    }
    toast.success("Enviado para impressão");
  };

  const handleExport = () => {
    const csvContent = [
      ["Número", "Tipo", "Parte", "Descrição", "Valor Mensal", "Início", "Fim", "Status"].join(","),
      ...filteredContratos.map(c => 
        [c.numero, c.tipo, c.parte, `"${c.descricao}"`, c.valorMensal?.toFixed(2) || "", c.dataInicio, c.dataFim, c.status].join(",")
      )
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contratos.csv";
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

  const handleDownloadContrato = (contrato: Contrato) => {
    const content = `
CONTRATO ${contrato.numero}
========================================
Tipo: ${contrato.tipo}
Parte: ${contrato.parte}
Descrição: ${contrato.descricao}
Vigência: ${new Date(contrato.dataInicio).toLocaleDateString('pt-BR')} a ${new Date(contrato.dataFim).toLocaleDateString('pt-BR')}
${contrato.valorMensal ? `Valor Mensal: R$ ${contrato.valorMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : ''}
Status: ${contrato.status.toUpperCase()}
${contrato.observacoes ? `\nObservações: ${contrato.observacoes}` : ''}
    `;
    
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${contrato.numero}.txt`;
    a.click();
    toast.success("Contrato baixado!");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ativo":
        return <Badge className="bg-success text-success-foreground">Ativo</Badge>;
      case "pendente":
        return <Badge className="bg-warning text-warning-foreground">Pendente</Badge>;
      case "expirado":
        return <Badge variant="secondary">Expirado</Badge>;
      case "cancelado":
        return <Badge variant="destructive">Cancelado</Badge>;
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
        accept=".pdf,.doc,.docx"
      />

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contratos</h1>
          <p className="text-muted-foreground">
            Gestão de contratos e documentos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handlePrint()}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimir Lista
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
            Novo Contrato
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Contratos Ativos
            </CardTitle>
            <CheckCircle className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{totalAtivos}</div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pendentes
            </CardTitle>
            <Clock className="h-5 w-5 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{totalPendentes}</div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Expirados
            </CardTitle>
            <AlertCircle className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExpirados}</div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Valor Mensal (Ativos)
            </CardTitle>
            <FileText className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              R$ {valorMensalTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
                placeholder="Buscar por número, parte ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterTipo} onValueChange={setFilterTipo}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {tipos.map(tipo => (
                  <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="expirado">Expirado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
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
                <TableHead>Número</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Parte</TableHead>
                <TableHead>Vigência</TableHead>
                <TableHead>Valor Mensal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContratos.map((contrato) => (
                <TableRow key={contrato.id}>
                  <TableCell className="font-mono text-sm">{contrato.numero}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{contrato.tipo}</Badge>
                  </TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate">{contrato.parte}</TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      <span>{new Date(contrato.dataInicio).toLocaleDateString('pt-BR')}</span>
                      <span className="text-muted-foreground">até {new Date(contrato.dataFim).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {contrato.valorMensal 
                      ? `R$ ${contrato.valorMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                      : '-'
                    }
                  </TableCell>
                  <TableCell>{getStatusBadge(contrato.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-background">
                        <DropdownMenuItem onClick={() => handleOpenView(contrato)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                        {contrato.status !== "cancelado" && (
                          <DropdownMenuItem onClick={() => handleOpenEdit(contrato)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                        )}
                        {contrato.status === "pendente" && (
                          <DropdownMenuItem onClick={() => handleAtivar(contrato)}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Ativar
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={handleUpload}>
                          <Upload className="mr-2 h-4 w-4" />
                          Anexar Arquivo
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePrint(contrato)}>
                          <Printer className="mr-2 h-4 w-4" />
                          Imprimir
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownloadContrato(contrato)}>
                          <Download className="mr-2 h-4 w-4" />
                          Baixar
                        </DropdownMenuItem>
                        {contrato.status !== "cancelado" && (
                          <DropdownMenuItem className="text-destructive" onClick={() => handleOpenDelete(contrato)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Cancelar
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog de Criar/Editar */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Contrato" : "Novo Contrato"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Atualize os dados do contrato" : "Cadastre um novo contrato"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Select 
                  value={formData.tipo}
                  onValueChange={(value) => setFormData({...formData, tipo: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {tipos.map(tipo => (
                      <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="valorMensal">Valor Mensal</Label>
                <Input 
                  id="valorMensal" 
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={formData.valorMensal}
                  onChange={(e) => setFormData({...formData, valorMensal: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="parte">Parte Contratante *</Label>
              <Input 
                id="parte" 
                placeholder="Nome da parte contratante"
                value={formData.parte}
                onChange={(e) => setFormData({...formData, parte: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataInicio">Data Início *</Label>
                <Input 
                  id="dataInicio" 
                  type="date"
                  value={formData.dataInicio}
                  onChange={(e) => setFormData({...formData, dataInicio: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataFim">Data Fim *</Label>
                <Input 
                  id="dataFim" 
                  type="date"
                  value={formData.dataFim}
                  onChange={(e) => setFormData({...formData, dataFim: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Textarea 
                id="descricao" 
                placeholder="Descrição do contrato..."
                value={formData.descricao}
                onChange={(e) => setFormData({...formData, descricao: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea 
                id="observacoes" 
                placeholder="Observações adicionais..."
                value={formData.observacoes}
                onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {setIsDialogOpen(false); resetForm();}}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {isEditing ? "Salvar Alterações" : "Criar Contrato"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Visualizar */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Contrato</DialogTitle>
          </DialogHeader>
          {selectedContrato && (
            <div className="space-y-4 py-4">
              <div className="text-center border-b pb-4">
                <h2 className="text-2xl font-bold">{selectedContrato.numero}</h2>
                {getStatusBadge(selectedContrato.status)}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Tipo</Label>
                  <p className="font-medium">{selectedContrato.tipo}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Valor Mensal</Label>
                  <p className="font-medium">
                    {selectedContrato.valorMensal 
                      ? `R$ ${selectedContrato.valorMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                      : '-'
                    }
                  </p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Parte Contratante</Label>
                <p className="font-medium">{selectedContrato.parte}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Descrição</Label>
                <p className="font-medium">{selectedContrato.descricao}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Data Início</Label>
                  <p className="font-medium">{new Date(selectedContrato.dataInicio).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Data Fim</Label>
                  <p className="font-medium">{new Date(selectedContrato.dataFim).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
              {selectedContrato.observacoes && (
                <div>
                  <Label className="text-muted-foreground">Observações</Label>
                  <p className="font-medium">{selectedContrato.observacoes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => handlePrint(selectedContrato!)}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            <Button onClick={() => handleDownloadContrato(selectedContrato!)}>
              <Download className="h-4 w-4 mr-2" />
              Baixar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AlertDialog de Cancelar */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar Contrato</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar o contrato "{selectedContrato?.numero}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Cancelar Contrato
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

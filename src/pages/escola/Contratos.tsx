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
  Copy,
  Save,
  FileSignature,
  BookTemplate,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  modeloId?: string;
}

interface ModeloContrato {
  id: string;
  nome: string;
  tipo: string;
  descricao: string;
  conteudo: string;
  criadoEm: string;
  atualizadoEm: string;
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

const initialModelos: ModeloContrato[] = [
  {
    id: "1",
    nome: "Contrato de Matrícula Padrão",
    tipo: "Prestação de Serviço",
    descricao: "Modelo padrão para matrícula de alunos",
    conteudo: `CONTRATO DE PRESTAÇÃO DE SERVIÇOS EDUCACIONAIS

CONTRATANTE: {{NOME_RESPONSAVEL}}, portador(a) do CPF nº {{CPF_RESPONSAVEL}}, residente e domiciliado(a) em {{ENDERECO_RESPONSAVEL}}.

CONTRATADA: {{NOME_ESCOLA}}, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº {{CNPJ_ESCOLA}}, com sede em {{ENDERECO_ESCOLA}}.

ALUNO(A): {{NOME_ALUNO}}, nascido(a) em {{DATA_NASCIMENTO_ALUNO}}.

CLÁUSULA PRIMEIRA - DO OBJETO
O presente contrato tem por objeto a prestação de serviços educacionais pela CONTRATADA ao ALUNO(A) acima qualificado(a), referente ao ano letivo de {{ANO_LETIVO}}, na série/turma {{SERIE_TURMA}}.

CLÁUSULA SEGUNDA - DO VALOR E FORMA DE PAGAMENTO
2.1. O valor total da anuidade escolar é de R$ {{VALOR_ANUAL}} ({{VALOR_ANUAL_EXTENSO}}), que poderá ser pago em {{NUMERO_PARCELAS}} parcelas mensais de R$ {{VALOR_PARCELA}} ({{VALOR_PARCELA_EXTENSO}}).
2.2. O vencimento das parcelas será todo dia {{DIA_VENCIMENTO}} de cada mês.
2.3. O atraso no pagamento acarretará multa de 2% e juros de 1% ao mês.

CLÁUSULA TERCEIRA - DAS OBRIGAÇÕES DA CONTRATADA
3.1. Ministrar aulas conforme o calendário escolar aprovado;
3.2. Fornecer material didático básico necessário às atividades escolares;
3.3. Manter quadro docente qualificado;
3.4. Informar aos pais ou responsáveis sobre o desempenho escolar do aluno.

CLÁUSULA QUARTA - DAS OBRIGAÇÕES DO CONTRATANTE
4.1. Efetuar o pagamento das mensalidades pontualmente;
4.2. Acompanhar o desempenho escolar do aluno;
4.3. Comparecer às reuniões convocadas pela escola;
4.4. Manter atualizado o cadastro junto à secretaria.

CLÁUSULA QUINTA - DA VIGÊNCIA
Este contrato tem vigência de {{DATA_INICIO}} a {{DATA_FIM}}.

{{CIDADE}}, {{DATA_ASSINATURA}}.

_____________________________
CONTRATANTE

_____________________________
CONTRATADA`,
    criadoEm: "2024-01-15",
    atualizadoEm: "2024-01-15",
  },
  {
    id: "2",
    nome: "Contrato de Fornecimento",
    tipo: "Fornecimento",
    descricao: "Modelo para contratos com fornecedores",
    conteudo: `CONTRATO DE FORNECIMENTO

CONTRATANTE: {{NOME_ESCOLA}}, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº {{CNPJ_ESCOLA}}.

CONTRATADA: {{NOME_FORNECEDOR}}, inscrita no CNPJ sob o nº {{CNPJ_FORNECEDOR}}.

CLÁUSULA PRIMEIRA - DO OBJETO
Fornecimento de {{DESCRICAO_PRODUTOS}} conforme especificações anexas.

CLÁUSULA SEGUNDA - DO VALOR
O valor total do contrato é de R$ {{VALOR_TOTAL}}, a ser pago em {{CONDICAO_PAGAMENTO}}.

CLÁUSULA TERCEIRA - DO PRAZO
Vigência de {{DATA_INICIO}} a {{DATA_FIM}}.

CLÁUSULA QUARTA - DA ENTREGA
Os produtos deverão ser entregues em {{LOCAL_ENTREGA}}, no prazo de {{PRAZO_ENTREGA}} dias úteis após a confirmação do pedido.

{{CIDADE}}, {{DATA_ASSINATURA}}.

_____________________________
CONTRATANTE

_____________________________
CONTRATADA`,
    criadoEm: "2024-01-20",
    atualizadoEm: "2024-02-10",
  },
  {
    id: "3",
    nome: "Contrato de Locação",
    tipo: "Locação",
    descricao: "Modelo para locação de espaços e equipamentos",
    conteudo: `CONTRATO DE LOCAÇÃO

LOCADOR: {{NOME_LOCADOR}}, inscrito no CPF/CNPJ sob o nº {{CPF_CNPJ_LOCADOR}}.

LOCATÁRIO: {{NOME_ESCOLA}}, inscrita no CNPJ sob o nº {{CNPJ_ESCOLA}}.

CLÁUSULA PRIMEIRA - DO OBJETO
Locação do imóvel/equipamento situado em {{ENDERECO_IMOVEL}}, destinado a {{FINALIDADE}}.

CLÁUSULA SEGUNDA - DO VALOR
O valor mensal do aluguel é de R$ {{VALOR_MENSAL}}, a ser pago até o dia {{DIA_VENCIMENTO}} de cada mês.

CLÁUSULA TERCEIRA - DO PRAZO
A locação terá início em {{DATA_INICIO}} e término em {{DATA_FIM}}, podendo ser renovada mediante acordo entre as partes.

{{CIDADE}}, {{DATA_ASSINATURA}}.

_____________________________
LOCADOR

_____________________________
LOCATÁRIO`,
    criadoEm: "2024-02-01",
    atualizadoEm: "2024-02-01",
  },
];

const tipos = ["Prestação de Serviço", "Fornecimento", "Locação", "Trabalho", "Parceria", "Outros"];

const variaveisDisponiveis = [
  { variavel: "{{NOME_ESCOLA}}", descricao: "Nome da escola" },
  { variavel: "{{CNPJ_ESCOLA}}", descricao: "CNPJ da escola" },
  { variavel: "{{ENDERECO_ESCOLA}}", descricao: "Endereço da escola" },
  { variavel: "{{NOME_RESPONSAVEL}}", descricao: "Nome do responsável" },
  { variavel: "{{CPF_RESPONSAVEL}}", descricao: "CPF do responsável" },
  { variavel: "{{ENDERECO_RESPONSAVEL}}", descricao: "Endereço do responsável" },
  { variavel: "{{NOME_ALUNO}}", descricao: "Nome do aluno" },
  { variavel: "{{DATA_NASCIMENTO_ALUNO}}", descricao: "Data de nascimento" },
  { variavel: "{{SERIE_TURMA}}", descricao: "Série/Turma" },
  { variavel: "{{ANO_LETIVO}}", descricao: "Ano letivo" },
  { variavel: "{{VALOR_ANUAL}}", descricao: "Valor anual" },
  { variavel: "{{VALOR_PARCELA}}", descricao: "Valor da parcela" },
  { variavel: "{{NUMERO_PARCELAS}}", descricao: "Número de parcelas" },
  { variavel: "{{DIA_VENCIMENTO}}", descricao: "Dia de vencimento" },
  { variavel: "{{DATA_INICIO}}", descricao: "Data de início" },
  { variavel: "{{DATA_FIM}}", descricao: "Data de término" },
  { variavel: "{{CIDADE}}", descricao: "Cidade" },
  { variavel: "{{DATA_ASSINATURA}}", descricao: "Data de assinatura" },
];

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

  // Estados para modelos
  const [modelos, setModelos] = useState<ModeloContrato[]>(initialModelos);
  const [isModeloDialogOpen, setIsModeloDialogOpen] = useState(false);
  const [isEditingModelo, setIsEditingModelo] = useState(false);
  const [selectedModelo, setSelectedModelo] = useState<ModeloContrato | null>(null);
  const [isViewModeloDialogOpen, setIsViewModeloDialogOpen] = useState(false);
  const [isDeleteModeloDialogOpen, setIsDeleteModeloDialogOpen] = useState(false);
  const [modeloFormData, setModeloFormData] = useState({
    nome: "",
    tipo: "",
    descricao: "",
    conteudo: "",
  });

  const resetModeloForm = () => {
    setModeloFormData({
      nome: "",
      tipo: "",
      descricao: "",
      conteudo: "",
    });
    setIsEditingModelo(false);
    setSelectedModelo(null);
  };

  const handleOpenCreateModelo = () => {
    resetModeloForm();
    setIsModeloDialogOpen(true);
  };

  const handleOpenEditModelo = (modelo: ModeloContrato) => {
    setModeloFormData({
      nome: modelo.nome,
      tipo: modelo.tipo,
      descricao: modelo.descricao,
      conteudo: modelo.conteudo,
    });
    setSelectedModelo(modelo);
    setIsEditingModelo(true);
    setIsModeloDialogOpen(true);
  };

  const handleOpenViewModelo = (modelo: ModeloContrato) => {
    setSelectedModelo(modelo);
    setIsViewModeloDialogOpen(true);
  };

  const handleOpenDeleteModelo = (modelo: ModeloContrato) => {
    setSelectedModelo(modelo);
    setIsDeleteModeloDialogOpen(true);
  };

  const handleSaveModelo = () => {
    if (!modeloFormData.nome || !modeloFormData.tipo || !modeloFormData.conteudo) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const hoje = new Date().toISOString().split("T")[0];

    if (isEditingModelo && selectedModelo) {
      setModelos(modelos.map(m => 
        m.id === selectedModelo.id 
          ? {
              ...m,
              nome: modeloFormData.nome,
              tipo: modeloFormData.tipo,
              descricao: modeloFormData.descricao,
              conteudo: modeloFormData.conteudo,
              atualizadoEm: hoje,
            }
          : m
      ));
      toast.success("Modelo atualizado com sucesso!");
    } else {
      const novoModelo: ModeloContrato = {
        id: Date.now().toString(),
        nome: modeloFormData.nome,
        tipo: modeloFormData.tipo,
        descricao: modeloFormData.descricao,
        conteudo: modeloFormData.conteudo,
        criadoEm: hoje,
        atualizadoEm: hoje,
      };
      setModelos([novoModelo, ...modelos]);
      toast.success("Modelo criado com sucesso!");
    }
    
    setIsModeloDialogOpen(false);
    resetModeloForm();
  };

  const handleDeleteModelo = () => {
    if (selectedModelo) {
      setModelos(modelos.filter(m => m.id !== selectedModelo.id));
      toast.success("Modelo excluído com sucesso!");
      setIsDeleteModeloDialogOpen(false);
      setSelectedModelo(null);
    }
  };

  const handleDuplicateModelo = (modelo: ModeloContrato) => {
    const novoModelo: ModeloContrato = {
      id: Date.now().toString(),
      nome: `${modelo.nome} (Cópia)`,
      tipo: modelo.tipo,
      descricao: modelo.descricao,
      conteudo: modelo.conteudo,
      criadoEm: new Date().toISOString().split("T")[0],
      atualizadoEm: new Date().toISOString().split("T")[0],
    };
    setModelos([novoModelo, ...modelos]);
    toast.success("Modelo duplicado!");
  };

  const handleDownloadModelo = (modelo: ModeloContrato) => {
    const blob = new Blob([modelo.conteudo], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${modelo.nome.replace(/\s+/g, '_')}.txt`;
    a.click();
    toast.success("Modelo baixado!");
  };

  const insertVariavel = (variavel: string) => {
    setModeloFormData(prev => ({
      ...prev,
      conteudo: prev.conteudo + variavel,
    }));
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
            Gestão de contratos, documentos e modelos
          </p>
        </div>
      </div>

      {/* Tabs principais */}
      <Tabs defaultValue="contratos" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="contratos" className="flex items-center gap-2">
            <FileSignature className="h-4 w-4" />
            Contratos
          </TabsTrigger>
          <TabsTrigger value="modelos" className="flex items-center gap-2">
            <BookTemplate className="h-4 w-4" />
            Modelos
          </TabsTrigger>
        </TabsList>

        {/* Tab: Contratos */}
        <TabsContent value="contratos" className="space-y-6">
          {/* Actions */}
          <div className="flex justify-end gap-2">
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
        </TabsContent>

        {/* Tab: Modelos */}
        <TabsContent value="modelos" className="space-y-6">
          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button onClick={handleOpenCreateModelo}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Modelo
            </Button>
          </div>

          {/* Info Card */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <BookTemplate className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Modelos de Contratos</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Crie e edite modelos de contratos reutilizáveis. Use variáveis como <code className="bg-muted px-1 rounded">{"{{NOME_ALUNO}}"}</code> para preenchimento automático.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Modelos Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {modelos.map((modelo) => (
              <Card key={modelo.id} className="shadow-card hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{modelo.nome}</CardTitle>
                      <CardDescription>{modelo.descricao}</CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-background">
                        <DropdownMenuItem onClick={() => handleOpenViewModelo(modelo)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenEditModelo(modelo)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicateModelo(modelo)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownloadModelo(modelo)}>
                          <Download className="mr-2 h-4 w-4" />
                          Baixar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleOpenDeleteModelo(modelo)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Badge variant="outline">{modelo.tipo}</Badge>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>Criado em: {new Date(modelo.criadoEm).toLocaleDateString('pt-BR')}</p>
                      <p>Atualizado em: {new Date(modelo.atualizadoEm).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleOpenViewModelo(modelo)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Ver
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleOpenEditModelo(modelo)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog de Criar/Editar Contrato */}
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

      {/* Dialog de Visualizar Contrato */}
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

      {/* AlertDialog de Cancelar Contrato */}
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

      {/* Dialog de Criar/Editar Modelo */}
      <Dialog open={isModeloDialogOpen} onOpenChange={setIsModeloDialogOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditingModelo ? "Editar Modelo" : "Novo Modelo de Contrato"}</DialogTitle>
            <DialogDescription>
              {isEditingModelo ? "Atualize o modelo de contrato" : "Crie um modelo reutilizável para contratos"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="modelo-nome">Nome do Modelo *</Label>
                <Input 
                  id="modelo-nome" 
                  placeholder="Ex: Contrato de Matrícula"
                  value={modeloFormData.nome}
                  onChange={(e) => setModeloFormData({...modeloFormData, nome: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modelo-tipo">Tipo *</Label>
                <Select 
                  value={modeloFormData.tipo}
                  onValueChange={(value) => setModeloFormData({...modeloFormData, tipo: value})}
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="modelo-descricao">Descrição</Label>
              <Input 
                id="modelo-descricao" 
                placeholder="Breve descrição do modelo..."
                value={modeloFormData.descricao}
                onChange={(e) => setModeloFormData({...modeloFormData, descricao: e.target.value})}
              />
            </div>
            
            {/* Variáveis disponíveis */}
            <div className="space-y-2">
              <Label>Variáveis Disponíveis</Label>
              <Card className="bg-muted/50">
                <CardContent className="pt-4">
                  <div className="flex flex-wrap gap-2">
                    {variaveisDisponiveis.map((v) => (
                      <Button
                        key={v.variavel}
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => insertVariavel(v.variavel)}
                        title={v.descricao}
                      >
                        {v.variavel}
                      </Button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Clique em uma variável para inserir no conteúdo. Elas serão substituídas automaticamente ao gerar um contrato.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              <Label htmlFor="modelo-conteudo">Conteúdo do Modelo *</Label>
              <Textarea 
                id="modelo-conteudo" 
                placeholder="Digite o conteúdo do contrato. Use variáveis como {{NOME_ALUNO}} para campos dinâmicos..."
                value={modeloFormData.conteudo}
                onChange={(e) => setModeloFormData({...modeloFormData, conteudo: e.target.value})}
                className="min-h-[300px] font-mono text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {setIsModeloDialogOpen(false); resetModeloForm();}}>
              Cancelar
            </Button>
            <Button onClick={handleSaveModelo}>
              <Save className="h-4 w-4 mr-2" />
              {isEditingModelo ? "Salvar Alterações" : "Criar Modelo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Visualizar Modelo */}
      <Dialog open={isViewModeloDialogOpen} onOpenChange={setIsViewModeloDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {selectedModelo?.nome}
            </DialogTitle>
            <DialogDescription>{selectedModelo?.descricao}</DialogDescription>
          </DialogHeader>
          {selectedModelo && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <Badge variant="outline">{selectedModelo.tipo}</Badge>
                <span className="text-xs text-muted-foreground">
                  Atualizado em: {new Date(selectedModelo.atualizadoEm).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <Card className="bg-muted/30">
                <CardContent className="pt-4">
                  <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                    {selectedModelo.conteudo}
                  </pre>
                </CardContent>
              </Card>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModeloDialogOpen(false)}>
              Fechar
            </Button>
            <Button variant="outline" onClick={() => selectedModelo && handleDownloadModelo(selectedModelo)}>
              <Download className="h-4 w-4 mr-2" />
              Baixar
            </Button>
            <Button onClick={() => {
              setIsViewModeloDialogOpen(false);
              if (selectedModelo) handleOpenEditModelo(selectedModelo);
            }}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AlertDialog de Excluir Modelo */}
      <AlertDialog open={isDeleteModeloDialogOpen} onOpenChange={setIsDeleteModeloDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Modelo</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o modelo "{selectedModelo?.nome}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteModelo} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir Modelo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

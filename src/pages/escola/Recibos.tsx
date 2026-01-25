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
  Receipt,
  FileText,
  CheckCircle,
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

interface Recibo {
  id: string;
  numero: string;
  tipo: string;
  pagador: string;
  descricao: string;
  valor: number;
  dataEmissao: string;
  dataPagamento?: string;
  formaPagamento: string;
  status: "emitido" | "pago" | "cancelado";
  anexo?: string;
}

const initialRecibos: Recibo[] = [
  {
    id: "1",
    numero: "REC-2024-0001",
    tipo: "Mensalidade",
    pagador: "Maria Silva",
    descricao: "Mensalidade Janeiro/2024 - Aluno: Ana Beatriz Silva",
    valor: 1200.00,
    dataEmissao: "2024-01-08",
    dataPagamento: "2024-01-08",
    formaPagamento: "Pix",
    status: "pago",
  },
  {
    id: "2",
    numero: "REC-2024-0002",
    tipo: "Material",
    pagador: "Paula Mendes",
    descricao: "Material Escolar 2024 - Aluno: Carolina Mendes",
    valor: 450.00,
    dataEmissao: "2024-01-15",
    dataPagamento: "2024-01-15",
    formaPagamento: "Cartão de Crédito",
    status: "pago",
  },
  {
    id: "3",
    numero: "REC-2024-0003",
    tipo: "Evento",
    pagador: "Fernanda Lima",
    descricao: "Excursão Pedagógica - Aluno: Eduarda Lima",
    valor: 180.00,
    dataEmissao: "2024-01-20",
    formaPagamento: "Boleto",
    status: "emitido",
  },
  {
    id: "4",
    numero: "REC-2024-0004",
    tipo: "Mensalidade",
    pagador: "Roberto Oliveira",
    descricao: "Mensalidade Janeiro/2024 - Aluno: Daniel Oliveira",
    valor: 1200.00,
    dataEmissao: "2024-01-10",
    dataPagamento: "2024-01-10",
    formaPagamento: "Dinheiro",
    status: "pago",
  },
  {
    id: "5",
    numero: "REC-2024-0005",
    tipo: "Taxa",
    pagador: "Carlos Santos",
    descricao: "Taxa de Matrícula 2024 - Aluno: Bruno Costa Santos",
    valor: 350.00,
    dataEmissao: "2024-01-05",
    formaPagamento: "Pix",
    status: "cancelado",
  },
];

const tipos = ["Mensalidade", "Material", "Evento", "Taxa", "Outros"];
const formasPagamento = ["Pix", "Boleto", "Cartão de Crédito", "Cartão de Débito", "Dinheiro", "Transferência"];

export default function Recibos() {
  const [recibos, setRecibos] = useState<Recibo[]>(initialRecibos);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterTipo, setFilterTipo] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRecibo, setSelectedRecibo] = useState<Recibo | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    tipo: "",
    pagador: "",
    descricao: "",
    valor: "",
    formaPagamento: "",
  });

  const filteredRecibos = recibos.filter((recibo) => {
    const matchesSearch =
      recibo.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recibo.pagador.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recibo.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || recibo.status === filterStatus;
    const matchesTipo = filterTipo === "all" || recibo.tipo === filterTipo;
    return matchesSearch && matchesStatus && matchesTipo;
  });

  const totalEmitidos = recibos.filter(r => r.status === "emitido").length;
  const totalPagos = recibos.filter(r => r.status === "pago").length;
  const valorTotal = recibos.filter(r => r.status === "pago").reduce((acc, r) => acc + r.valor, 0);

  const gerarNumeroRecibo = () => {
    const ano = new Date().getFullYear();
    const numero = String(recibos.length + 1).padStart(4, '0');
    return `REC-${ano}-${numero}`;
  };

  const resetForm = () => {
    setFormData({
      tipo: "",
      pagador: "",
      descricao: "",
      valor: "",
      formaPagamento: "",
    });
    setIsEditing(false);
    setSelectedRecibo(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (recibo: Recibo) => {
    setFormData({
      tipo: recibo.tipo,
      pagador: recibo.pagador,
      descricao: recibo.descricao,
      valor: recibo.valor.toString(),
      formaPagamento: recibo.formaPagamento,
    });
    setSelectedRecibo(recibo);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleOpenView = (recibo: Recibo) => {
    setSelectedRecibo(recibo);
    setIsViewDialogOpen(true);
  };

  const handleOpenDelete = (recibo: Recibo) => {
    setSelectedRecibo(recibo);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.pagador || !formData.descricao || !formData.valor) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (isEditing && selectedRecibo) {
      setRecibos(recibos.map(r => 
        r.id === selectedRecibo.id 
          ? {
              ...r,
              tipo: formData.tipo,
              pagador: formData.pagador,
              descricao: formData.descricao,
              valor: parseFloat(formData.valor),
              formaPagamento: formData.formaPagamento,
            }
          : r
      ));
      toast.success("Recibo atualizado com sucesso!");
    } else {
      const novoRecibo: Recibo = {
        id: Date.now().toString(),
        numero: gerarNumeroRecibo(),
        tipo: formData.tipo,
        pagador: formData.pagador,
        descricao: formData.descricao,
        valor: parseFloat(formData.valor),
        dataEmissao: new Date().toISOString().split('T')[0],
        formaPagamento: formData.formaPagamento,
        status: "emitido",
      };
      setRecibos([novoRecibo, ...recibos]);
      toast.success("Recibo emitido com sucesso!");
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (selectedRecibo) {
      setRecibos(recibos.map(r => 
        r.id === selectedRecibo.id 
          ? { ...r, status: "cancelado" as const }
          : r
      ));
      toast.success("Recibo cancelado com sucesso!");
      setIsDeleteDialogOpen(false);
      setSelectedRecibo(null);
    }
  };

  const handleConfirmarPagamento = (recibo: Recibo) => {
    setRecibos(recibos.map(r => 
      r.id === recibo.id 
        ? { ...r, status: "pago" as const, dataPagamento: new Date().toISOString().split('T')[0] }
        : r
    ));
    toast.success("Pagamento confirmado!");
  };

  const handlePrint = (recibo?: Recibo) => {
    if (recibo) {
      // Imprimir recibo individual
      const printContent = `
        <html>
          <head><title>Recibo ${recibo.numero}</title></head>
          <body style="font-family: Arial; padding: 20px;">
            <h1>RECIBO</h1>
            <p><strong>Número:</strong> ${recibo.numero}</p>
            <p><strong>Data:</strong> ${new Date(recibo.dataEmissao).toLocaleDateString('pt-BR')}</p>
            <p><strong>Pagador:</strong> ${recibo.pagador}</p>
            <p><strong>Descrição:</strong> ${recibo.descricao}</p>
            <p><strong>Valor:</strong> R$ ${recibo.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <p><strong>Forma de Pagamento:</strong> ${recibo.formaPagamento}</p>
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
      ["Número", "Tipo", "Pagador", "Descrição", "Valor", "Data Emissão", "Status"].join(","),
      ...filteredRecibos.map(r => 
        [r.numero, r.tipo, r.pagador, `"${r.descricao}"`, r.valor.toFixed(2), r.dataEmissao, r.status].join(",")
      )
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "recibos.csv";
    a.click();
    toast.success("Arquivo exportado com sucesso!");
  };

  const handleDownloadRecibo = (recibo: Recibo) => {
    const content = `
RECIBO ${recibo.numero}
========================
Data: ${new Date(recibo.dataEmissao).toLocaleDateString('pt-BR')}
Pagador: ${recibo.pagador}
Descrição: ${recibo.descricao}
Valor: R$ ${recibo.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
Forma de Pagamento: ${recibo.formaPagamento}
Status: ${recibo.status.toUpperCase()}
    `;
    
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${recibo.numero}.txt`;
    a.click();
    toast.success("Recibo baixado!");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pago":
        return <Badge className="bg-success text-success-foreground">Pago</Badge>;
      case "emitido":
        return <Badge className="bg-warning text-warning-foreground">Emitido</Badge>;
      case "cancelado":
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recibos</h1>
          <p className="text-muted-foreground">
            Emissão e controle de recibos
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
          <Button onClick={handleOpenCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Recibo
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Recibos Emitidos
            </CardTitle>
            <FileText className="h-5 w-5 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{totalEmitidos}</div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pagamentos Confirmados
            </CardTitle>
            <CheckCircle className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{totalPagos}</div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Valor Total Recebido
            </CardTitle>
            <Receipt className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
                placeholder="Buscar por número, pagador ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterTipo} onValueChange={setFilterTipo}>
              <SelectTrigger className="w-[150px]">
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
                <SelectItem value="emitido">Emitido</SelectItem>
                <SelectItem value="pago">Pago</SelectItem>
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
                <TableHead>Pagador</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecibos.map((recibo) => (
                <TableRow key={recibo.id}>
                  <TableCell className="font-mono text-sm">{recibo.numero}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{recibo.tipo}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{recibo.pagador}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{recibo.descricao}</TableCell>
                  <TableCell className="font-medium">
                    R$ {recibo.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>{new Date(recibo.dataEmissao).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{getStatusBadge(recibo.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-background">
                        <DropdownMenuItem onClick={() => handleOpenView(recibo)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                        {recibo.status === "emitido" && (
                          <>
                            <DropdownMenuItem onClick={() => handleOpenEdit(recibo)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleConfirmarPagamento(recibo)}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Confirmar Pagamento
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem onClick={() => handlePrint(recibo)}>
                          <Printer className="mr-2 h-4 w-4" />
                          Imprimir
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownloadRecibo(recibo)}>
                          <Download className="mr-2 h-4 w-4" />
                          Baixar
                        </DropdownMenuItem>
                        {recibo.status !== "cancelado" && (
                          <DropdownMenuItem className="text-destructive" onClick={() => handleOpenDelete(recibo)}>
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Recibo" : "Novo Recibo"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Atualize os dados do recibo" : "Emita um novo recibo"}
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
                <Label htmlFor="formaPagamento">Forma de Pagamento</Label>
                <Select 
                  value={formData.formaPagamento}
                  onValueChange={(value) => setFormData({...formData, formaPagamento: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {formasPagamento.map(fp => (
                      <SelectItem key={fp} value={fp}>{fp}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pagador">Pagador *</Label>
                <Input 
                  id="pagador" 
                  placeholder="Nome do pagador"
                  value={formData.pagador}
                  onChange={(e) => setFormData({...formData, pagador: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valor">Valor *</Label>
                <Input 
                  id="valor" 
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={formData.valor}
                  onChange={(e) => setFormData({...formData, valor: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Textarea 
                id="descricao" 
                placeholder="Descrição detalhada do recibo..."
                value={formData.descricao}
                onChange={(e) => setFormData({...formData, descricao: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {setIsDialogOpen(false); resetForm();}}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {isEditing ? "Salvar Alterações" : "Emitir Recibo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Visualizar */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Recibo</DialogTitle>
          </DialogHeader>
          {selectedRecibo && (
            <div className="space-y-4 py-4">
              <div className="text-center border-b pb-4">
                <h2 className="text-2xl font-bold">{selectedRecibo.numero}</h2>
                {getStatusBadge(selectedRecibo.status)}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Data Emissão</Label>
                  <p className="font-medium">{new Date(selectedRecibo.dataEmissao).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Tipo</Label>
                  <p className="font-medium">{selectedRecibo.tipo}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Pagador</Label>
                <p className="font-medium">{selectedRecibo.pagador}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Descrição</Label>
                <p className="font-medium">{selectedRecibo.descricao}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Valor</Label>
                  <p className="font-medium text-lg">
                    R$ {selectedRecibo.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Forma de Pagamento</Label>
                  <p className="font-medium">{selectedRecibo.formaPagamento}</p>
                </div>
              </div>
              {selectedRecibo.dataPagamento && (
                <div>
                  <Label className="text-muted-foreground">Data do Pagamento</Label>
                  <p className="font-medium">{new Date(selectedRecibo.dataPagamento).toLocaleDateString('pt-BR')}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => handlePrint(selectedRecibo!)}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            <Button onClick={() => handleDownloadRecibo(selectedRecibo!)}>
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
            <AlertDialogTitle>Cancelar Recibo</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar o recibo "{selectedRecibo?.numero}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Cancelar Recibo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

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
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  Send,
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

interface ContaReceber {
  id: string;
  descricao: string;
  aluno: string;
  responsavel: string;
  tipo: string;
  valor: number;
  dataVencimento: string;
  dataPagamento?: string;
  status: "pendente" | "pago" | "vencido";
  observacoes?: string;
}

const initialContas: ContaReceber[] = [
  {
    id: "1",
    descricao: "Mensalidade Janeiro/2024",
    aluno: "Ana Beatriz Silva",
    responsavel: "Maria Silva",
    tipo: "Mensalidade",
    valor: 1200.00,
    dataVencimento: "2024-01-10",
    dataPagamento: "2024-01-08",
    status: "pago",
  },
  {
    id: "2",
    descricao: "Mensalidade Janeiro/2024",
    aluno: "Bruno Costa Santos",
    responsavel: "Carlos Santos",
    tipo: "Mensalidade",
    valor: 1200.00,
    dataVencimento: "2024-01-10",
    status: "vencido",
  },
  {
    id: "3",
    descricao: "Material Escolar 2024",
    aluno: "Carolina Mendes",
    responsavel: "Paula Mendes",
    tipo: "Material",
    valor: 450.00,
    dataVencimento: "2024-01-20",
    status: "pendente",
  },
  {
    id: "4",
    descricao: "Mensalidade Janeiro/2024",
    aluno: "Daniel Oliveira",
    responsavel: "Roberto Oliveira",
    tipo: "Mensalidade",
    valor: 1200.00,
    dataVencimento: "2024-01-10",
    dataPagamento: "2024-01-10",
    status: "pago",
  },
  {
    id: "5",
    descricao: "Excursão Pedagógica",
    aluno: "Eduarda Lima",
    responsavel: "Fernanda Lima",
    tipo: "Evento",
    valor: 180.00,
    dataVencimento: "2024-02-01",
    status: "pendente",
  },
];

const tipos = ["Mensalidade", "Material", "Evento", "Taxa", "Multa", "Outros"];

export default function ContasReceber() {
  const [contas, setContas] = useState<ContaReceber[]>(initialContas);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterTipo, setFilterTipo] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedConta, setSelectedConta] = useState<ContaReceber | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    descricao: "",
    aluno: "",
    responsavel: "",
    tipo: "",
    valor: "",
    dataVencimento: "",
    observacoes: "",
  });

  const filteredContas = contas.filter((conta) => {
    const matchesSearch =
      conta.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conta.aluno.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conta.responsavel.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || conta.status === filterStatus;
    const matchesTipo = filterTipo === "all" || conta.tipo === filterTipo;
    return matchesSearch && matchesStatus && matchesTipo;
  });

  const totalPendente = contas
    .filter(c => c.status === "pendente")
    .reduce((acc, c) => acc + c.valor, 0);
  
  const totalVencido = contas
    .filter(c => c.status === "vencido")
    .reduce((acc, c) => acc + c.valor, 0);
  
  const totalRecebido = contas
    .filter(c => c.status === "pago")
    .reduce((acc, c) => acc + c.valor, 0);

  const resetForm = () => {
    setFormData({
      descricao: "",
      aluno: "",
      responsavel: "",
      tipo: "",
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

  const handleOpenEdit = (conta: ContaReceber) => {
    setFormData({
      descricao: conta.descricao,
      aluno: conta.aluno,
      responsavel: conta.responsavel,
      tipo: conta.tipo,
      valor: conta.valor.toString(),
      dataVencimento: conta.dataVencimento,
      observacoes: conta.observacoes || "",
    });
    setSelectedConta(conta);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleOpenView = (conta: ContaReceber) => {
    setSelectedConta(conta);
    setIsViewDialogOpen(true);
  };

  const handleOpenDelete = (conta: ContaReceber) => {
    setSelectedConta(conta);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.descricao || !formData.aluno || !formData.valor) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (isEditing && selectedConta) {
      setContas(contas.map(c => 
        c.id === selectedConta.id 
          ? {
              ...c,
              descricao: formData.descricao,
              aluno: formData.aluno,
              responsavel: formData.responsavel,
              tipo: formData.tipo,
              valor: parseFloat(formData.valor),
              dataVencimento: formData.dataVencimento,
              observacoes: formData.observacoes,
            }
          : c
      ));
      toast.success("Conta atualizada com sucesso!");
    } else {
      const novaConta: ContaReceber = {
        id: Date.now().toString(),
        descricao: formData.descricao,
        aluno: formData.aluno,
        responsavel: formData.responsavel,
        tipo: formData.tipo,
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
      setContas(contas.filter(c => c.id !== selectedConta.id));
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
      ["Descrição", "Aluno", "Responsável", "Tipo", "Valor", "Vencimento", "Status"].join(","),
      ...filteredContas.map(c => 
        [c.descricao, c.aluno, c.responsavel, c.tipo, c.valor.toFixed(2), c.dataVencimento, c.status].join(",")
      )
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contas_receber.csv";
    a.click();
    toast.success("Arquivo exportado com sucesso!");
  };

  const handleSendReminder = (conta: ContaReceber) => {
    toast.success(`Lembrete enviado para ${conta.responsavel}`);
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
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contas a Receber</h1>
          <p className="text-muted-foreground">
            Gerencie as receitas e cobranças da escola
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={handleOpenCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Cobrança
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              A Receber
            </CardTitle>
            <Clock className="h-5 w-5 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              R$ {totalPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Em Atraso
            </CardTitle>
            <AlertCircle className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              R$ {totalVencido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Recebido (Mês)
            </CardTitle>
            <CheckCircle className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              R$ {totalRecebido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
                placeholder="Buscar por aluno, responsável ou descrição..."
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
                <TableHead>Aluno</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Tipo</TableHead>
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
                  <TableCell>{conta.aluno}</TableCell>
                  <TableCell>{conta.responsavel}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{conta.tipo}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    R$ {conta.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>{new Date(conta.dataVencimento).toLocaleDateString('pt-BR')}</TableCell>
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
                        {conta.status !== "pago" && (
                          <DropdownMenuItem onClick={() => handleSendReminder(conta)}>
                            <Send className="mr-2 h-4 w-4" />
                            Enviar Lembrete
                          </DropdownMenuItem>
                        )}
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

      {/* Dialog de Criar/Editar */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Cobrança" : "Nova Cobrança"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Atualize os dados da cobrança" : "Cadastre uma nova cobrança"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Input 
                id="descricao" 
                placeholder="Ex: Mensalidade Janeiro/2024"
                value={formData.descricao}
                onChange={(e) => setFormData({...formData, descricao: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="aluno">Aluno *</Label>
                <Input 
                  id="aluno" 
                  placeholder="Nome do aluno"
                  value={formData.aluno}
                  onChange={(e) => setFormData({...formData, aluno: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="responsavel">Responsável</Label>
                <Input 
                  id="responsavel" 
                  placeholder="Nome do responsável"
                  value={formData.responsavel}
                  onChange={(e) => setFormData({...formData, responsavel: e.target.value})}
                />
              </div>
            </div>
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
              <Label htmlFor="vencimento">Data Vencimento</Label>
              <Input 
                id="vencimento" 
                type="date"
                value={formData.dataVencimento}
                onChange={(e) => setFormData({...formData, dataVencimento: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea 
                id="observacoes" 
                placeholder="Informações adicionais..."
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
              {isEditing ? "Salvar Alterações" : "Cadastrar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Visualizar */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detalhes da Cobrança</DialogTitle>
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
                  <Label className="text-muted-foreground">Aluno</Label>
                  <p className="font-medium">{selectedConta.aluno}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Responsável</Label>
                  <p className="font-medium">{selectedConta.responsavel}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Valor</Label>
                  <p className="font-medium text-lg">
                    R$ {selectedConta.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Vencimento</Label>
                  <p className="font-medium">
                    {new Date(selectedConta.dataVencimento).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Fechar
            </Button>
            <Button onClick={() => {
              setIsViewDialogOpen(false);
              if (selectedConta) handleOpenEdit(selectedConta);
            }}>
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
              Tem certeza que deseja excluir a cobrança "{selectedConta?.descricao}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

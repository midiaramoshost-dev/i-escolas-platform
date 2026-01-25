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
  Package,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  BarChart3,
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

interface ItemEstoque {
  id: string;
  codigo: string;
  nome: string;
  categoria: string;
  quantidade: number;
  quantidadeMinima: number;
  unidade: string;
  valorUnitario: number;
  localizacao: string;
  fornecedor?: string;
  ultimaMovimentacao?: string;
  status: "normal" | "baixo" | "critico";
}

const initialItens: ItemEstoque[] = [
  {
    id: "1",
    codigo: "MAT001",
    nome: "Papel A4 - Resma 500 folhas",
    categoria: "Material de Escritório",
    quantidade: 150,
    quantidadeMinima: 50,
    unidade: "Resma",
    valorUnitario: 25.90,
    localizacao: "Almoxarifado A - Prateleira 1",
    fornecedor: "Papelaria Central",
    ultimaMovimentacao: "2024-01-20",
    status: "normal",
  },
  {
    id: "2",
    codigo: "LIM001",
    nome: "Detergente Neutro 5L",
    categoria: "Material de Limpeza",
    quantidade: 8,
    quantidadeMinima: 10,
    unidade: "Galão",
    valorUnitario: 18.50,
    localizacao: "Almoxarifado B - Prateleira 3",
    fornecedor: "Distribuidora Clean",
    ultimaMovimentacao: "2024-01-18",
    status: "baixo",
  },
  {
    id: "3",
    codigo: "MAT002",
    nome: "Caneta Esferográfica Azul",
    categoria: "Material de Escritório",
    quantidade: 500,
    quantidadeMinima: 200,
    unidade: "Unidade",
    valorUnitario: 1.20,
    localizacao: "Almoxarifado A - Prateleira 2",
    fornecedor: "Papelaria Central",
    ultimaMovimentacao: "2024-01-22",
    status: "normal",
  },
  {
    id: "4",
    codigo: "PED001",
    nome: "Giz de Cera (Caixa 12 cores)",
    categoria: "Material Pedagógico",
    quantidade: 3,
    quantidadeMinima: 20,
    unidade: "Caixa",
    valorUnitario: 8.90,
    localizacao: "Sala dos Professores",
    fornecedor: "Editora Educação",
    ultimaMovimentacao: "2024-01-15",
    status: "critico",
  },
  {
    id: "5",
    codigo: "LIM002",
    nome: "Álcool 70% 1L",
    categoria: "Material de Limpeza",
    quantidade: 45,
    quantidadeMinima: 30,
    unidade: "Litro",
    valorUnitario: 9.90,
    localizacao: "Almoxarifado B - Prateleira 1",
    fornecedor: "Farmácia Escolar",
    ultimaMovimentacao: "2024-01-21",
    status: "normal",
  },
];

const categorias = [
  "Material de Escritório", "Material de Limpeza", "Material Pedagógico", 
  "Equipamentos", "Alimentação", "Manutenção", "Outros"
];

const unidades = ["Unidade", "Caixa", "Pacote", "Resma", "Galão", "Litro", "Kg", "Metro"];

export default function Estoque() {
  const [itens, setItens] = useState<ItemEstoque[]>(initialItens);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isMovimentacaoDialogOpen, setIsMovimentacaoDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemEstoque | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    codigo: "",
    nome: "",
    categoria: "",
    quantidade: "",
    quantidadeMinima: "",
    unidade: "",
    valorUnitario: "",
    localizacao: "",
    fornecedor: "",
  });

  const [movimentacao, setMovimentacao] = useState({
    tipo: "entrada",
    quantidade: "",
    motivo: "",
  });

  const filteredItens = itens.filter((item) => {
    const matchesSearch =
      item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria = filterCategoria === "all" || item.categoria === filterCategoria;
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesCategoria && matchesStatus;
  });

  const totalItens = itens.length;
  const itensBaixos = itens.filter(i => i.status === "baixo").length;
  const itensCriticos = itens.filter(i => i.status === "critico").length;
  const valorTotal = itens.reduce((acc, i) => acc + (i.quantidade * i.valorUnitario), 0);

  const getStatus = (quantidade: number, minimo: number): "normal" | "baixo" | "critico" => {
    if (quantidade <= minimo * 0.3) return "critico";
    if (quantidade <= minimo) return "baixo";
    return "normal";
  };

  const resetForm = () => {
    setFormData({
      codigo: "",
      nome: "",
      categoria: "",
      quantidade: "",
      quantidadeMinima: "",
      unidade: "",
      valorUnitario: "",
      localizacao: "",
      fornecedor: "",
    });
    setIsEditing(false);
    setSelectedItem(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: ItemEstoque) => {
    setFormData({
      codigo: item.codigo,
      nome: item.nome,
      categoria: item.categoria,
      quantidade: item.quantidade.toString(),
      quantidadeMinima: item.quantidadeMinima.toString(),
      unidade: item.unidade,
      valorUnitario: item.valorUnitario.toString(),
      localizacao: item.localizacao,
      fornecedor: item.fornecedor || "",
    });
    setSelectedItem(item);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleOpenView = (item: ItemEstoque) => {
    setSelectedItem(item);
    setIsViewDialogOpen(true);
  };

  const handleOpenDelete = (item: ItemEstoque) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleOpenMovimentacao = (item: ItemEstoque) => {
    setSelectedItem(item);
    setMovimentacao({ tipo: "entrada", quantidade: "", motivo: "" });
    setIsMovimentacaoDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.codigo || !formData.nome || !formData.quantidade) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const qtd = parseInt(formData.quantidade);
    const qtdMin = parseInt(formData.quantidadeMinima) || 10;

    if (isEditing && selectedItem) {
      setItens(itens.map(i => 
        i.id === selectedItem.id 
          ? {
              ...i,
              codigo: formData.codigo,
              nome: formData.nome,
              categoria: formData.categoria,
              quantidade: qtd,
              quantidadeMinima: qtdMin,
              unidade: formData.unidade,
              valorUnitario: parseFloat(formData.valorUnitario) || 0,
              localizacao: formData.localizacao,
              fornecedor: formData.fornecedor,
              status: getStatus(qtd, qtdMin),
            }
          : i
      ));
      toast.success("Item atualizado com sucesso!");
    } else {
      const novoItem: ItemEstoque = {
        id: Date.now().toString(),
        codigo: formData.codigo,
        nome: formData.nome,
        categoria: formData.categoria,
        quantidade: qtd,
        quantidadeMinima: qtdMin,
        unidade: formData.unidade,
        valorUnitario: parseFloat(formData.valorUnitario) || 0,
        localizacao: formData.localizacao,
        fornecedor: formData.fornecedor,
        ultimaMovimentacao: new Date().toISOString().split('T')[0],
        status: getStatus(qtd, qtdMin),
      };
      setItens([...itens, novoItem]);
      toast.success("Item cadastrado com sucesso!");
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (selectedItem) {
      setItens(itens.filter(i => i.id !== selectedItem.id));
      toast.success("Item excluído com sucesso!");
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
    }
  };

  const handleMovimentacao = () => {
    if (!movimentacao.quantidade || !selectedItem) {
      toast.error("Informe a quantidade");
      return;
    }

    const qtdMov = parseInt(movimentacao.quantidade);
    const novaQtd = movimentacao.tipo === "entrada" 
      ? selectedItem.quantidade + qtdMov 
      : selectedItem.quantidade - qtdMov;

    if (novaQtd < 0) {
      toast.error("Quantidade insuficiente em estoque");
      return;
    }

    setItens(itens.map(i => 
      i.id === selectedItem.id 
        ? {
            ...i,
            quantidade: novaQtd,
            ultimaMovimentacao: new Date().toISOString().split('T')[0],
            status: getStatus(novaQtd, i.quantidadeMinima),
          }
        : i
    ));

    toast.success(`${movimentacao.tipo === "entrada" ? "Entrada" : "Saída"} registrada com sucesso!`);
    setIsMovimentacaoDialogOpen(false);
    setSelectedItem(null);
  };

  const handlePrint = () => {
    window.print();
    toast.success("Relatório enviado para impressão");
  };

  const handleExport = () => {
    const csvContent = [
      ["Código", "Nome", "Categoria", "Quantidade", "Mínimo", "Unidade", "Valor Unit.", "Status"].join(","),
      ...filteredItens.map(i => 
        [i.codigo, i.nome, i.categoria, i.quantidade, i.quantidadeMinima, i.unidade, i.valorUnitario.toFixed(2), i.status].join(",")
      )
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "estoque.csv";
    a.click();
    toast.success("Arquivo exportado com sucesso!");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "normal":
        return <Badge className="bg-success text-success-foreground">Normal</Badge>;
      case "baixo":
        return <Badge className="bg-warning text-warning-foreground">Estoque Baixo</Badge>;
      case "critico":
        return <Badge variant="destructive">Crítico</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Estoque</h1>
          <p className="text-muted-foreground">
            Controle de materiais e suprimentos
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
            Novo Item
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Itens
            </CardTitle>
            <Package className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItens}</div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Estoque Baixo
            </CardTitle>
            <TrendingDown className="h-5 w-5 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{itensBaixos}</div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Críticos
            </CardTitle>
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{itensCriticos}</div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Valor Total
            </CardTitle>
            <BarChart3 className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
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
                placeholder="Buscar por nome ou código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategoria} onValueChange={setFilterCategoria}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {categorias.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="baixo">Estoque Baixo</SelectItem>
                <SelectItem value="critico">Crítico</SelectItem>
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
                <TableHead>Código</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead>Valor Unit.</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItens.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-sm">{item.codigo}</TableCell>
                  <TableCell className="font-medium">{item.nome}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.categoria}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${
                      item.status === "critico" ? "text-destructive" : 
                      item.status === "baixo" ? "text-warning" : ""
                    }`}>
                      {item.quantidade} / {item.quantidadeMinima}
                    </span>
                  </TableCell>
                  <TableCell>{item.unidade}</TableCell>
                  <TableCell>
                    R$ {item.valorUnitario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-background">
                        <DropdownMenuItem onClick={() => handleOpenView(item)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenEdit(item)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenMovimentacao(item)}>
                          <TrendingUp className="mr-2 h-4 w-4" />
                          Movimentação
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleOpenDelete(item)}>
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
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Item" : "Novo Item de Estoque"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Atualize os dados do item" : "Cadastre um novo item no estoque"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codigo">Código *</Label>
                <Input 
                  id="codigo" 
                  placeholder="Ex: MAT001"
                  value={formData.codigo}
                  onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Select 
                  value={formData.categoria}
                  onValueChange={(value) => setFormData({...formData, categoria: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input 
                id="nome" 
                placeholder="Nome do item"
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantidade">Quantidade *</Label>
                <Input 
                  id="quantidade" 
                  type="number"
                  placeholder="0"
                  value={formData.quantidade}
                  onChange={(e) => setFormData({...formData, quantidade: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minimo">Mínimo</Label>
                <Input 
                  id="minimo" 
                  type="number"
                  placeholder="10"
                  value={formData.quantidadeMinima}
                  onChange={(e) => setFormData({...formData, quantidadeMinima: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unidade">Unidade</Label>
                <Select 
                  value={formData.unidade}
                  onValueChange={(value) => setFormData({...formData, unidade: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {unidades.map(un => (
                      <SelectItem key={un} value={un}>{un}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="valor">Valor Unit.</Label>
                <Input 
                  id="valor" 
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={formData.valorUnitario}
                  onChange={(e) => setFormData({...formData, valorUnitario: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="localizacao">Localização</Label>
                <Input 
                  id="localizacao" 
                  placeholder="Ex: Almoxarifado A - Prateleira 1"
                  value={formData.localizacao}
                  onChange={(e) => setFormData({...formData, localizacao: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fornecedor">Fornecedor</Label>
                <Input 
                  id="fornecedor" 
                  placeholder="Nome do fornecedor"
                  value={formData.fornecedor}
                  onChange={(e) => setFormData({...formData, fornecedor: e.target.value})}
                />
              </div>
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

      {/* Dialog de Movimentação */}
      <Dialog open={isMovimentacaoDialogOpen} onOpenChange={setIsMovimentacaoDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Movimentação de Estoque</DialogTitle>
            <DialogDescription>
              {selectedItem?.nome}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Tipo de Movimentação</Label>
              <Select 
                value={movimentacao.tipo}
                onValueChange={(value) => setMovimentacao({...movimentacao, tipo: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrada">Entrada</SelectItem>
                  <SelectItem value="saida">Saída</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="qtdMov">Quantidade</Label>
              <Input 
                id="qtdMov" 
                type="number"
                placeholder="0"
                value={movimentacao.quantidade}
                onChange={(e) => setMovimentacao({...movimentacao, quantidade: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="motivo">Motivo</Label>
              <Textarea 
                id="motivo" 
                placeholder="Motivo da movimentação..."
                value={movimentacao.motivo}
                onChange={(e) => setMovimentacao({...movimentacao, motivo: e.target.value})}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Estoque atual: <strong>{selectedItem?.quantidade} {selectedItem?.unidade}</strong>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMovimentacaoDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleMovimentacao}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Visualizar */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Item</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Código</Label>
                  <p className="font-mono font-medium">{selectedItem.codigo}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedItem.status)}</div>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Nome</Label>
                <p className="font-medium">{selectedItem.nome}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Categoria</Label>
                  <p className="font-medium">{selectedItem.categoria}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Localização</Label>
                  <p className="font-medium">{selectedItem.localizacao}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-muted-foreground">Quantidade</Label>
                  <p className="font-medium text-lg">{selectedItem.quantidade}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Mínimo</Label>
                  <p className="font-medium">{selectedItem.quantidadeMinima}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Valor Unit.</Label>
                  <p className="font-medium">
                    R$ {selectedItem.valorUnitario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
              {selectedItem.fornecedor && (
                <div>
                  <Label className="text-muted-foreground">Fornecedor</Label>
                  <p className="font-medium">{selectedItem.fornecedor}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Fechar
            </Button>
            <Button onClick={() => {
              setIsViewDialogOpen(false);
              if (selectedItem) handleOpenEdit(selectedItem);
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
              Tem certeza que deseja excluir o item "{selectedItem?.nome}"? Esta ação não pode ser desfeita.
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

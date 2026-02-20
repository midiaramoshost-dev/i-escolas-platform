import { useState } from "react";
import {
  Apple,
  UtensilsCrossed,
  AlertTriangle,
  Heart,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Scale,
  Ruler,
  CalendarDays,
  Download,
  MoreHorizontal,
  Baby,
  Leaf,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// --- Mock Data ---

const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

const initialCardapio = [
  {
    id: "1",
    dia: "Segunda",
    lanche_manha: "Pão integral com queijo, suco de laranja",
    almoco: "Arroz, feijão, frango grelhado, salada, fruta",
    lanche_tarde: "Biscoito de aveia, leite",
    semana: "2026-02-16",
  },
  {
    id: "2",
    dia: "Terça",
    lanche_manha: "Mingau de aveia, banana",
    almoco: "Macarrão integral, carne moída, legumes, suco",
    lanche_tarde: "Fruta picada, iogurte natural",
    semana: "2026-02-16",
  },
  {
    id: "3",
    dia: "Quarta",
    lanche_manha: "Vitamina de frutas, torrada",
    almoco: "Arroz, lentilha, peixe assado, salada verde",
    lanche_tarde: "Bolo de cenoura integral, suco",
    semana: "2026-02-16",
  },
  {
    id: "4",
    dia: "Quinta",
    lanche_manha: "Tapioca com queijo, suco de uva",
    almoco: "Arroz, feijão preto, carne assada, legumes",
    lanche_tarde: "Frutas da estação, biscoito",
    semana: "2026-02-16",
  },
  {
    id: "5",
    dia: "Sexta",
    lanche_manha: "Pão com manteiga, achocolatado",
    almoco: "Arroz, strogonoff de frango, batata, salada",
    lanche_tarde: "Gelatina, suco natural",
    semana: "2026-02-16",
  },
];

const alunosComRestricao = [
  {
    id: "1",
    nome: "Ana Beatriz Silva",
    turma: "Maternal II",
    alergias: ["Leite de vaca", "Amendoim"],
    intolerancia: ["Lactose"],
    dietaEspecial: "Substituir leite por bebida vegetal. Evitar derivados de amendoim.",
    observacoes: "Mãe envia lanche alternativo às sextas.",
  },
  {
    id: "2",
    nome: "Lucas Oliveira",
    turma: "5º Ano A",
    alergias: ["Glúten"],
    intolerancia: [],
    dietaEspecial: "Celíaco. Todas as refeições devem ser sem glúten.",
    observacoes: "Laudo médico atualizado em jan/2026.",
  },
  {
    id: "3",
    nome: "Maria Eduarda Costa",
    turma: "3º Ano B",
    alergias: [],
    intolerancia: ["Frutose"],
    dietaEspecial: "Reduzir frutas de alto teor de frutose. Preferir opções como morango e kiwi.",
    observacoes: "",
  },
  {
    id: "4",
    nome: "Pedro Henrique Santos",
    turma: "Maternal I",
    alergias: ["Ovo", "Soja"],
    intolerancia: [],
    dietaEspecial: "Evitar preparações com ovo e soja. Substituir por alternativas proteicas.",
    observacoes: "Pais solicitam relatório mensal.",
  },
];

const relatorioNutricional = [
  { id: "1", nome: "Ana Beatriz Silva", turma: "Maternal II", idade: "3 anos", peso: "14.2 kg", altura: "98 cm", imc: "14.8", classificacao: "Adequado", dataAvaliacao: "10/02/2026" },
  { id: "2", nome: "Lucas Oliveira", turma: "5º Ano A", idade: "10 anos", peso: "35.0 kg", altura: "140 cm", imc: "17.9", classificacao: "Adequado", dataAvaliacao: "10/02/2026" },
  { id: "3", nome: "Maria Eduarda Costa", turma: "3º Ano B", idade: "8 anos", peso: "30.5 kg", altura: "130 cm", imc: "18.0", classificacao: "Adequado", dataAvaliacao: "10/02/2026" },
  { id: "4", nome: "Pedro Henrique Santos", turma: "Maternal I", idade: "2 anos", peso: "11.8 kg", altura: "88 cm", imc: "15.2", classificacao: "Adequado", dataAvaliacao: "10/02/2026" },
  { id: "5", nome: "Julia Fernandes", turma: "7º Ano B", idade: "12 anos", peso: "52.0 kg", altura: "155 cm", imc: "21.6", classificacao: "Sobrepeso", dataAvaliacao: "10/02/2026" },
  { id: "6", nome: "Gabriel Lima", turma: "2º Ano A", idade: "7 anos", peso: "19.0 kg", altura: "118 cm", imc: "13.6", classificacao: "Baixo peso", dataAvaliacao: "10/02/2026" },
];

const statsCards = [
  { title: "Alunos com Restrição", value: "38", icon: AlertTriangle, color: "text-amber-500" },
  { title: "Dietas Especiais Ativas", value: "24", icon: Leaf, color: "text-emerald-500" },
  { title: "Avaliações este Mês", value: "156", icon: Scale, color: "text-blue-500" },
  { title: "Alertas Nutricionais", value: "6", icon: Heart, color: "text-red-500" },
];

function getClassificacaoBadge(classificacao: string) {
  switch (classificacao) {
    case "Adequado": return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Adequado</Badge>;
    case "Sobrepeso": return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Sobrepeso</Badge>;
    case "Baixo peso": return <Badge className="bg-red-100 text-red-700 border-red-200">Baixo peso</Badge>;
    case "Obesidade": return <Badge className="bg-red-200 text-red-800 border-red-300">Obesidade</Badge>;
    default: return <Badge variant="outline">{classificacao}</Badge>;
  }
}

export default function Nutricao() {
  const [cardapio, setCardapio] = useState(initialCardapio);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCardapioDialogOpen, setIsCardapioDialogOpen] = useState(false);
  const [isDietaDialogOpen, setIsDietaDialogOpen] = useState(false);
  const [isViewDietaOpen, setIsViewDietaOpen] = useState(false);
  const [selectedDieta, setSelectedDieta] = useState<typeof alunosComRestricao[0] | null>(null);
  const [editingCardapioDay, setEditingCardapioDay] = useState<typeof initialCardapio[0] | null>(null);
  const [cardapioForm, setCardapioForm] = useState({ dia: "", lanche_manha: "", almoco: "", lanche_tarde: "" });

  const filteredRestricoes = alunosComRestricao.filter(
    (a) => a.nome.toLowerCase().includes(searchTerm.toLowerCase()) || a.turma.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditCardapio = (item: typeof initialCardapio[0]) => {
    setEditingCardapioDay(item);
    setCardapioForm({ dia: item.dia, lanche_manha: item.lanche_manha, almoco: item.almoco, lanche_tarde: item.lanche_tarde });
    setIsCardapioDialogOpen(true);
  };

  const handleSaveCardapio = () => {
    if (editingCardapioDay) {
      setCardapio((prev) =>
        prev.map((c) => (c.id === editingCardapioDay.id ? { ...c, ...cardapioForm } : c))
      );
    }
    setIsCardapioDialogOpen(false);
    toast.success("Cardápio atualizado com sucesso!");
  };

  const handleViewDieta = (aluno: typeof alunosComRestricao[0]) => {
    setSelectedDieta(aluno);
    setIsViewDietaOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Apple className="h-7 w-7 text-emerald-500" />
            Nutrição e Alimentação
          </h1>
          <p className="text-muted-foreground mt-1">Cardápio semanal, dietas especiais e acompanhamento nutricional</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-muted`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="cardapio" className="space-y-4">
        <TabsList>
          <TabsTrigger value="cardapio" className="gap-2">
            <UtensilsCrossed className="h-4 w-4" />
            Cardápio Semanal
          </TabsTrigger>
          <TabsTrigger value="dietas" className="gap-2">
            <Leaf className="h-4 w-4" />
            Dietas Especiais
          </TabsTrigger>
          <TabsTrigger value="relatorio" className="gap-2">
            <Scale className="h-4 w-4" />
            Relatório Nutricional
          </TabsTrigger>
        </TabsList>

        {/* === Cardápio Semanal === */}
        <TabsContent value="cardapio">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Cardápio da Semana</CardTitle>
                  <CardDescription>Semana de 16/02/2026 a 20/02/2026</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Dia</TableHead>
                    <TableHead>Lanche da Manhã</TableHead>
                    <TableHead>Almoço</TableHead>
                    <TableHead>Lanche da Tarde</TableHead>
                    <TableHead className="w-[60px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cardapio.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.dia}</TableCell>
                      <TableCell className="text-sm">{item.lanche_manha}</TableCell>
                      <TableCell className="text-sm">{item.almoco}</TableCell>
                      <TableCell className="text-sm">{item.lanche_tarde}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => handleEditCardapio(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* === Dietas Especiais === */}
        <TabsContent value="dietas">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle className="text-lg">Alunos com Dieta Especial</CardTitle>
                  <CardDescription>Alergias, intolerâncias e planos alimentares individuais</CardDescription>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar aluno..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aluno</TableHead>
                    <TableHead>Turma</TableHead>
                    <TableHead>Alergias</TableHead>
                    <TableHead>Intolerâncias</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRestricoes.map((aluno) => (
                    <TableRow key={aluno.id}>
                      <TableCell className="font-medium">{aluno.nome}</TableCell>
                      <TableCell>{aluno.turma}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {aluno.alergias.length > 0
                            ? aluno.alergias.map((a) => (
                                <Badge key={a} variant="destructive" className="text-xs">{a}</Badge>
                              ))
                            : <span className="text-muted-foreground text-xs">Nenhuma</span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {aluno.intolerancia.length > 0
                            ? aluno.intolerancia.map((i) => (
                                <Badge key={i} className="bg-amber-100 text-amber-700 border-amber-200 text-xs">{i}</Badge>
                              ))
                            : <span className="text-muted-foreground text-xs">Nenhuma</span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => handleViewDieta(aluno)}>
                          <Eye className="h-4 w-4 mr-1" /> Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* === Relatório Nutricional === */}
        <TabsContent value="relatorio">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Acompanhamento Nutricional</CardTitle>
                  <CardDescription>Peso, altura e IMC dos alunos</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Relatório
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aluno</TableHead>
                    <TableHead>Turma</TableHead>
                    <TableHead>Idade</TableHead>
                    <TableHead>Peso</TableHead>
                    <TableHead>Altura</TableHead>
                    <TableHead>IMC</TableHead>
                    <TableHead>Classificação</TableHead>
                    <TableHead>Avaliação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {relatorioNutricional.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.nome}</TableCell>
                      <TableCell>{r.turma}</TableCell>
                      <TableCell>{r.idade}</TableCell>
                      <TableCell>{r.peso}</TableCell>
                      <TableCell>{r.altura}</TableCell>
                      <TableCell className="font-mono">{r.imc}</TableCell>
                      <TableCell>{getClassificacaoBadge(r.classificacao)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{r.dataAvaliacao}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog: Editar Cardápio */}
      <Dialog open={isCardapioDialogOpen} onOpenChange={setIsCardapioDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Cardápio — {cardapioForm.dia}</DialogTitle>
            <DialogDescription>Atualize as refeições do dia</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Lanche da Manhã</Label>
              <Textarea value={cardapioForm.lanche_manha} onChange={(e) => setCardapioForm((f) => ({ ...f, lanche_manha: e.target.value }))} />
            </div>
            <div>
              <Label>Almoço</Label>
              <Textarea value={cardapioForm.almoco} onChange={(e) => setCardapioForm((f) => ({ ...f, almoco: e.target.value }))} />
            </div>
            <div>
              <Label>Lanche da Tarde</Label>
              <Textarea value={cardapioForm.lanche_tarde} onChange={(e) => setCardapioForm((f) => ({ ...f, lanche_tarde: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCardapioDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveCardapio}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Detalhes da Dieta */}
      <Dialog open={isViewDietaOpen} onOpenChange={setIsViewDietaOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Ficha Nutricional
            </DialogTitle>
            <DialogDescription>{selectedDieta?.nome}</DialogDescription>
          </DialogHeader>
          {selectedDieta && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-xs">Turma</Label>
                  <p className="font-medium">{selectedDieta.turma}</p>
                </div>
              </div>
              <Separator />
              <div>
                <Label className="text-muted-foreground text-xs">Alergias Alimentares</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedDieta.alergias.length > 0
                    ? selectedDieta.alergias.map((a) => <Badge key={a} variant="destructive">{a}</Badge>)
                    : <span className="text-sm text-muted-foreground">Nenhuma registrada</span>}
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Intolerâncias</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedDieta.intolerancia.length > 0
                    ? selectedDieta.intolerancia.map((i) => <Badge key={i} className="bg-amber-100 text-amber-700">{i}</Badge>)
                    : <span className="text-sm text-muted-foreground">Nenhuma registrada</span>}
                </div>
              </div>
              <Separator />
              <div>
                <Label className="text-muted-foreground text-xs">Plano Alimentar Especial</Label>
                <p className="text-sm mt-1 bg-muted p-3 rounded-lg">{selectedDieta.dietaEspecial}</p>
              </div>
              {selectedDieta.observacoes && (
                <div>
                  <Label className="text-muted-foreground text-xs">Observações</Label>
                  <p className="text-sm mt-1 bg-muted p-3 rounded-lg">{selectedDieta.observacoes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

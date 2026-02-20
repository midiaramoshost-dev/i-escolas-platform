import { useState } from "react";
import {
  Apple,
  UtensilsCrossed,
  AlertTriangle,
  Heart,
  Leaf,
  Scale,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

// Mock data — would come from the school's data in production
const filhos = [
  {
    id: "1",
    nome: "Ana Beatriz",
    turma: "Maternal II",
    alergias: ["Leite de vaca", "Amendoim"],
    intolerancia: ["Lactose"],
    dietaEspecial: "Substituir leite por bebida vegetal. Evitar derivados de amendoim.",
    peso: "14.2 kg",
    altura: "98 cm",
    imc: "14.8",
    classificacao: "Adequado",
  },
  {
    id: "2",
    nome: "Pedro Silva",
    turma: "3º Ano B",
    alergias: [],
    intolerancia: [],
    dietaEspecial: "",
    peso: "28.0 kg",
    altura: "128 cm",
    imc: "17.1",
    classificacao: "Adequado",
  },
];

const cardapioSemana = [
  { dia: "Segunda", lanche_manha: "Pão integral com queijo, suco de laranja", almoco: "Arroz, feijão, frango grelhado, salada, fruta", lanche_tarde: "Biscoito de aveia, leite" },
  { dia: "Terça", lanche_manha: "Mingau de aveia, banana", almoco: "Macarrão integral, carne moída, legumes, suco", lanche_tarde: "Fruta picada, iogurte natural" },
  { dia: "Quarta", lanche_manha: "Vitamina de frutas, torrada", almoco: "Arroz, lentilha, peixe assado, salada verde", lanche_tarde: "Bolo de cenoura integral, suco" },
  { dia: "Quinta", lanche_manha: "Tapioca com queijo, suco de uva", almoco: "Arroz, feijão preto, carne assada, legumes", lanche_tarde: "Frutas da estação, biscoito" },
  { dia: "Sexta", lanche_manha: "Pão com manteiga, achocolatado", almoco: "Arroz, strogonoff de frango, batata, salada", lanche_tarde: "Gelatina, suco natural" },
];

function getClassificacaoBadge(classificacao: string) {
  switch (classificacao) {
    case "Adequado": return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Adequado</Badge>;
    case "Sobrepeso": return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Sobrepeso</Badge>;
    case "Baixo peso": return <Badge className="bg-red-100 text-red-700 border-red-200">Baixo peso</Badge>;
    default: return <Badge variant="outline">{classificacao}</Badge>;
  }
}

export default function ResponsavelNutricao() {
  const [selectedFilho, setSelectedFilho] = useState(filhos[0].id);
  const filhoAtual = filhos.find((f) => f.id === selectedFilho) || filhos[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Apple className="h-7 w-7 text-emerald-500" />
          Nutrição e Alimentação
        </h1>
        <p className="text-muted-foreground mt-1">Cardápio escolar, restrições alimentares e acompanhamento nutricional</p>
      </div>

      {/* Seletor de Filho */}
      <div className="flex gap-3">
        {filhos.map((filho) => (
          <Card
            key={filho.id}
            className={`cursor-pointer transition-all ${selectedFilho === filho.id ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
            onClick={() => setSelectedFilho(filho.id)}
          >
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold text-sm">
                {filho.nome.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <p className="font-medium text-sm">{filho.nome}</p>
                <p className="text-xs text-muted-foreground">{filho.turma}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="cardapio" className="space-y-4">
        <TabsList>
          <TabsTrigger value="cardapio" className="gap-2">
            <UtensilsCrossed className="h-4 w-4" />
            Cardápio
          </TabsTrigger>
          <TabsTrigger value="restricoes" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            Restrições
          </TabsTrigger>
          <TabsTrigger value="saude" className="gap-2">
            <Scale className="h-4 w-4" />
            Saúde
          </TabsTrigger>
        </TabsList>

        {/* Cardápio */}
        <TabsContent value="cardapio">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cardápio Semanal da Escola</CardTitle>
              <CardDescription>Semana de 16/02/2026 a 20/02/2026</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cardapioSemana.map((dia) => (
                <div key={dia.dia} className="border rounded-lg p-4 space-y-2">
                  <h3 className="font-semibold text-foreground">{dia.dia}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground text-xs font-medium">Lanche da Manhã</span>
                      <p>{dia.lanche_manha}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs font-medium">Almoço</span>
                      <p>{dia.almoco}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs font-medium">Lanche da Tarde</span>
                      <p>{dia.lanche_tarde}</p>
                    </div>
                  </div>
                  {/* Alert if child has restrictions matching menu items */}
                  {filhoAtual.alergias.length > 0 && (
                    <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-950/30 p-2 rounded text-xs text-amber-700 dark:text-amber-400">
                      <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                      <span>
                        <strong>{filhoAtual.nome}</strong> possui restrições: {filhoAtual.alergias.join(", ")}. A escola serve refeições adaptadas.
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Restrições */}
        <TabsContent value="restricoes">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Ficha Nutricional — {filhoAtual.nome}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-muted-foreground text-xs font-medium">Alergias Alimentares</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {filhoAtual.alergias.length > 0
                    ? filhoAtual.alergias.map((a) => <Badge key={a} variant="destructive">{a}</Badge>)
                    : <span className="text-sm text-muted-foreground">Nenhuma registrada</span>}
                </div>
              </div>
              <Separator />
              <div>
                <span className="text-muted-foreground text-xs font-medium">Intolerâncias</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {filhoAtual.intolerancia.length > 0
                    ? filhoAtual.intolerancia.map((i) => <Badge key={i} className="bg-amber-100 text-amber-700">{i}</Badge>)
                    : <span className="text-sm text-muted-foreground">Nenhuma registrada</span>}
                </div>
              </div>
              <Separator />
              <div>
                <span className="text-muted-foreground text-xs font-medium">Dieta Especial</span>
                {filhoAtual.dietaEspecial ? (
                  <p className="text-sm mt-1 bg-muted p-3 rounded-lg">{filhoAtual.dietaEspecial}</p>
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">Nenhum plano alimentar especial cadastrado.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Saúde */}
        <TabsContent value="saude">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Scale className="h-5 w-5 text-blue-500" />
                Acompanhamento — {filhoAtual.nome}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-foreground">{filhoAtual.peso}</p>
                  <p className="text-xs text-muted-foreground">Peso</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-foreground">{filhoAtual.altura}</p>
                  <p className="text-xs text-muted-foreground">Altura</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-foreground">{filhoAtual.imc}</p>
                  <p className="text-xs text-muted-foreground">IMC</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  {getClassificacaoBadge(filhoAtual.classificacao)}
                  <p className="text-xs text-muted-foreground mt-1">Classificação</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

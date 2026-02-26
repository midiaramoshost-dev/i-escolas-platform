import { useState } from "react";
import {
  Baby,
  Clock,
  Heart,
  Smile,
  Moon,
  Sun,
  Droplets,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

const filhos = [
  {
    id: "1",
    nome: "Ana Beatriz",
    turma: "Maternal II",
    idade: "2 anos e 8 meses",
    professora: "Profª. Carla Mendes",
    periodo: "Integral",
    foto: null,
  },
  {
    id: "2",
    nome: "Lucas Silva",
    turma: "Maternal I",
    idade: "1 ano e 5 meses",
    professora: "Profª. Juliana Costa",
    periodo: "Manhã",
    foto: null,
  },
];

const rotinaHoje = [
  { horario: "07:30", atividade: "Acolhimento e roda de conversa", icon: Smile, status: "concluido" },
  { horario: "08:00", atividade: "Lanche da manhã", icon: Heart, status: "concluido" },
  { horario: "08:30", atividade: "Atividade pedagógica — Pintura com as mãos", icon: Sun, status: "concluido" },
  { horario: "09:30", atividade: "Parquinho / Área externa", icon: Smile, status: "em_andamento" },
  { horario: "10:30", atividade: "Higiene e troca", icon: Droplets, status: "pendente" },
  { horario: "11:00", atividade: "Almoço", icon: Heart, status: "pendente" },
  { horario: "12:00", atividade: "Soneca", icon: Moon, status: "pendente" },
  { horario: "14:00", atividade: "Lanche da tarde", icon: Heart, status: "pendente" },
  { horario: "14:30", atividade: "Contação de histórias", icon: MessageSquare, status: "pendente" },
  { horario: "15:30", atividade: "Brincadeira livre e saída", icon: Smile, status: "pendente" },
];

const diarioRecados = [
  {
    data: "26/02/2026",
    professora: "Profª. Carla Mendes",
    mensagem: "Ana Beatriz participou muito bem da atividade de pintura hoje! Está cada vez mais sociável com os colegas. Comeu todo o almoço e dormiu bem na soneca.",
    humor: "Feliz",
    alimentacao: "Comeu bem",
    sono: "Dormiu 1h30",
  },
  {
    data: "25/02/2026",
    professora: "Profª. Carla Mendes",
    mensagem: "Dia agitado, Ana quis brincar bastante no parquinho. Resistiu um pouco na hora da soneca mas acabou dormindo. Lanche da tarde foi parcial.",
    humor: "Agitada",
    alimentacao: "Comeu parcialmente",
    sono: "Dormiu 1h",
  },
  {
    data: "24/02/2026",
    professora: "Profª. Carla Mendes",
    mensagem: "Ótimo dia! Participou da atividade de massinha e adorou. Interagiu muito bem com os amigos. Alimentação excelente.",
    humor: "Feliz",
    alimentacao: "Comeu bem",
    sono: "Dormiu 1h30",
  },
];

const marcos = [
  { area: "Linguagem", descricao: "Forma frases com 3+ palavras", progresso: 80 },
  { area: "Motor", descricao: "Corre e pula com equilíbrio", progresso: 90 },
  { area: "Social", descricao: "Brinca em grupo, compartilha", progresso: 70 },
  { area: "Cognitivo", descricao: "Identifica cores e formas", progresso: 75 },
  { area: "Autonomia", descricao: "Usa colher sozinha, pede ajuda", progresso: 65 },
];

function getStatusBadge(status: string) {
  switch (status) {
    case "concluido":
      return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px]">✓</Badge>;
    case "em_andamento":
      return <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-[10px]">Agora</Badge>;
    default:
      return <Badge variant="outline" className="text-[10px]">—</Badge>;
  }
}

function getHumorBadge(humor: string) {
  switch (humor) {
    case "Feliz": return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">😊 Feliz</Badge>;
    case "Agitada": return <Badge className="bg-amber-100 text-amber-700 border-amber-200">🏃 Agitada</Badge>;
    case "Calma": return <Badge className="bg-blue-100 text-blue-700 border-blue-200">😌 Calma</Badge>;
    default: return <Badge variant="outline">{humor}</Badge>;
  }
}

export default function ResponsavelMaternal() {
  const [selectedFilho, setSelectedFilho] = useState(filhos[0].id);
  const filhoAtual = filhos.find((f) => f.id === selectedFilho) || filhos[0];

  const atividadesConcluidas = rotinaHoje.filter((r) => r.status === "concluido").length;
  const progressoDia = Math.round((atividadesConcluidas / rotinaHoje.length) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Baby className="h-7 w-7 text-pink-500" />
          Maternal
        </h1>
        <p className="text-muted-foreground mt-1">Rotina diária, diário de recados e desenvolvimento do seu filho</p>
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
              <div className="h-10 w-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold text-sm">
                {filho.nome.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <p className="font-medium text-sm">{filho.nome}</p>
                <p className="text-xs text-muted-foreground">{filho.turma} · {filho.periodo}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info do filho */}
      <Card>
        <CardContent className="p-4 flex flex-wrap gap-6 text-sm">
          <div><span className="text-muted-foreground text-xs">Turma</span><p className="font-medium">{filhoAtual.turma}</p></div>
          <div><span className="text-muted-foreground text-xs">Idade</span><p className="font-medium">{filhoAtual.idade}</p></div>
          <div><span className="text-muted-foreground text-xs">Professora</span><p className="font-medium">{filhoAtual.professora}</p></div>
          <div><span className="text-muted-foreground text-xs">Período</span><p className="font-medium">{filhoAtual.periodo}</p></div>
        </CardContent>
      </Card>

      <Tabs defaultValue="rotina" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rotina" className="gap-2"><Clock className="h-4 w-4" />Rotina do Dia</TabsTrigger>
          <TabsTrigger value="diario" className="gap-2"><MessageSquare className="h-4 w-4" />Diário</TabsTrigger>
          <TabsTrigger value="desenvolvimento" className="gap-2"><Heart className="h-4 w-4" />Desenvolvimento</TabsTrigger>
        </TabsList>

        {/* Rotina */}
        <TabsContent value="rotina">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rotina de Hoje — {filhoAtual.nome}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <span>Progresso: {atividadesConcluidas}/{rotinaHoje.length} atividades</span>
                <Progress value={progressoDia} className="w-32 h-2" />
                <span className="text-xs font-medium">{progressoDia}%</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {rotinaHoje.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    item.status === "em_andamento" ? "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800" :
                    item.status === "concluido" ? "bg-muted/50" : ""
                  }`}
                >
                  <span className="text-xs font-mono text-muted-foreground w-12">{item.horario}</span>
                  <item.icon className={`h-4 w-4 shrink-0 ${
                    item.status === "em_andamento" ? "text-blue-500" :
                    item.status === "concluido" ? "text-emerald-500" : "text-muted-foreground"
                  }`} />
                  <span className={`flex-1 text-sm ${item.status === "concluido" ? "line-through text-muted-foreground" : ""}`}>
                    {item.atividade}
                  </span>
                  {getStatusBadge(item.status)}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Diário */}
        <TabsContent value="diario">
          <div className="space-y-4">
            {diarioRecados.map((recado, idx) => (
              <Card key={idx}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{recado.data}</CardTitle>
                    <span className="text-xs text-muted-foreground">{recado.professora}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-foreground">{recado.mensagem}</p>
                  <div className="flex flex-wrap gap-2">
                    {getHumorBadge(recado.humor)}
                    <Badge variant="outline" className="text-xs">🍽️ {recado.alimentacao}</Badge>
                    <Badge variant="outline" className="text-xs">😴 {recado.sono}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Desenvolvimento */}
        <TabsContent value="desenvolvimento">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Marcos de Desenvolvimento — {filhoAtual.nome}</CardTitle>
              <CardDescription>Avaliação pedagógica do trimestre atual</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {marcos.map((marco) => (
                <div key={marco.area} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{marco.area}</span>
                    <span className="text-muted-foreground text-xs">{marco.progresso}%</span>
                  </div>
                  <Progress value={marco.progresso} className="h-2" />
                  <p className="text-xs text-muted-foreground">{marco.descricao}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

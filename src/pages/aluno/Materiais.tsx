import { motion } from "framer-motion";
import {
  BookOpen,
  FileText,
  Video,
  Image,
  Download,
  ExternalLink,
  Search,
  Filter,
  Folder,
  File,
  Play,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const materiais = [
  {
    id: "1",
    titulo: "Apostila de Matemática - Capítulo 5",
    disciplina: "Matemática",
    professor: "Prof. Carlos",
    tipo: "pdf",
    tamanho: "2.5 MB",
    dataUpload: "2024-05-20",
    descricao: "Material sobre equações do segundo grau com exercícios resolvidos.",
  },
  {
    id: "2",
    titulo: "Videoaula: Figuras de Linguagem",
    disciplina: "Português",
    professor: "Profª Ana",
    tipo: "video",
    duracao: "15:32",
    dataUpload: "2024-05-18",
    descricao: "Explicação completa sobre metáfora, metonímia e outras figuras.",
  },
  {
    id: "3",
    titulo: "Slides - Sistema Solar",
    disciplina: "Ciências",
    professor: "Prof. Roberto",
    tipo: "slides",
    tamanho: "5.8 MB",
    dataUpload: "2024-05-15",
    descricao: "Apresentação sobre os planetas e suas características.",
  },
  {
    id: "4",
    titulo: "Mapa Mental - Era Vargas",
    disciplina: "História",
    professor: "Profª Paula",
    tipo: "imagem",
    tamanho: "1.2 MB",
    dataUpload: "2024-05-12",
    descricao: "Resumo visual dos principais eventos do período Vargas.",
  },
  {
    id: "5",
    titulo: "Lista de Exercícios - Frações",
    disciplina: "Matemática",
    professor: "Prof. Carlos",
    tipo: "pdf",
    tamanho: "850 KB",
    dataUpload: "2024-05-10",
    descricao: "50 exercícios de frações com gabarito comentado.",
  },
  {
    id: "6",
    titulo: "Videoaula: Regiões do Brasil",
    disciplina: "Geografia",
    professor: "Prof. Marcos",
    tipo: "video",
    duracao: "22:15",
    dataUpload: "2024-05-08",
    descricao: "Características geográficas e econômicas de cada região.",
  },
  {
    id: "7",
    titulo: "Texto de Apoio - Romantismo",
    disciplina: "Português",
    professor: "Profª Ana",
    tipo: "pdf",
    tamanho: "1.8 MB",
    dataUpload: "2024-05-05",
    descricao: "Contexto histórico e principais autores do Romantismo brasileiro.",
  },
  {
    id: "8",
    titulo: "Infográfico - Ciclo da Água",
    disciplina: "Ciências",
    professor: "Prof. Roberto",
    tipo: "imagem",
    tamanho: "980 KB",
    dataUpload: "2024-05-02",
    descricao: "Ilustração detalhada do ciclo hidrológico.",
  },
];

const disciplinas = ["Todas", "Matemática", "Português", "Ciências", "História", "Geografia"];

const getTipoIcon = (tipo: string) => {
  switch (tipo) {
    case "pdf":
      return <FileText className="h-5 w-5" />;
    case "video":
      return <Video className="h-5 w-5" />;
    case "slides":
      return <Folder className="h-5 w-5" />;
    case "imagem":
      return <Image className="h-5 w-5" />;
    default:
      return <File className="h-5 w-5" />;
  }
};

const getTipoColor = (tipo: string) => {
  switch (tipo) {
    case "pdf":
      return "bg-red-500/10 text-red-500";
    case "video":
      return "bg-purple-500/10 text-purple-500";
    case "slides":
      return "bg-orange-500/10 text-orange-500";
    case "imagem":
      return "bg-blue-500/10 text-blue-500";
    default:
      return "bg-gray-500/10 text-gray-500";
  }
};

const getTipoBadge = (tipo: string) => {
  switch (tipo) {
    case "pdf":
      return "PDF";
    case "video":
      return "Vídeo";
    case "slides":
      return "Slides";
    case "imagem":
      return "Imagem";
    default:
      return tipo;
  }
};

export default function AlunoMateriais() {
  const [busca, setBusca] = useState("");
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState("Todas");
  const [tipoSelecionado, setTipoSelecionado] = useState("todos");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const materiaisFiltrados = materiais.filter((material) => {
    const matchBusca = material.titulo.toLowerCase().includes(busca.toLowerCase()) ||
                       material.descricao.toLowerCase().includes(busca.toLowerCase());
    const matchDisciplina = disciplinaSelecionada === "Todas" || material.disciplina === disciplinaSelecionada;
    const matchTipo = tipoSelecionado === "todos" || material.tipo === tipoSelecionado;
    return matchBusca && matchDisciplina && matchTipo;
  });

  const totalPorTipo = {
    pdf: materiais.filter(m => m.tipo === "pdf").length,
    video: materiais.filter(m => m.tipo === "video").length,
    slides: materiais.filter(m => m.tipo === "slides").length,
    imagem: materiais.filter(m => m.tipo === "imagem").length,
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Materiais Didáticos</h1>
          <p className="text-muted-foreground">
            Acesse apostilas, vídeos e materiais de apoio
          </p>
        </div>
      </motion.div>

      {/* Resumo por Tipo */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setTipoSelecionado("pdf")}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Documentos</p>
                <p className="text-3xl font-bold">{totalPorTipo.pdf}</p>
                <p className="text-xs text-muted-foreground">PDFs</p>
              </div>
              <div className="rounded-full p-3 bg-red-500/10">
                <FileText className="h-8 w-8 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setTipoSelecionado("video")}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Videoaulas</p>
                <p className="text-3xl font-bold">{totalPorTipo.video}</p>
                <p className="text-xs text-muted-foreground">vídeos</p>
              </div>
              <div className="rounded-full p-3 bg-purple-500/10">
                <Video className="h-8 w-8 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setTipoSelecionado("slides")}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Apresentações</p>
                <p className="text-3xl font-bold">{totalPorTipo.slides}</p>
                <p className="text-xs text-muted-foreground">slides</p>
              </div>
              <div className="rounded-full p-3 bg-orange-500/10">
                <Folder className="h-8 w-8 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setTipoSelecionado("imagem")}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Imagens</p>
                <p className="text-3xl font-bold">{totalPorTipo.imagem}</p>
                <p className="text-xs text-muted-foreground">arquivos</p>
              </div>
              <div className="rounded-full p-3 bg-blue-500/10">
                <Image className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filtros */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar materiais..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={disciplinaSelecionada} onValueChange={setDisciplinaSelecionada}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Disciplina" />
                </SelectTrigger>
                <SelectContent>
                  {disciplinas.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={tipoSelecionado} onValueChange={setTipoSelecionado}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="pdf">PDFs</SelectItem>
                  <SelectItem value="video">Vídeos</SelectItem>
                  <SelectItem value="slides">Slides</SelectItem>
                  <SelectItem value="imagem">Imagens</SelectItem>
                </SelectContent>
              </Select>
              {(busca || disciplinaSelecionada !== "Todas" || tipoSelecionado !== "todos") && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setBusca("");
                    setDisciplinaSelecionada("Todas");
                    setTipoSelecionado("todos");
                  }}
                >
                  Limpar filtros
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Lista de Materiais */}
      <motion.div variants={itemVariants}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {materiaisFiltrados.map((material) => (
            <motion.div
              key={material.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg shrink-0 ${getTipoColor(material.tipo)}`}>
                      {getTipoIcon(material.tipo)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={getTipoColor(material.tipo)}>
                          {getTipoBadge(material.tipo)}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-sm line-clamp-2">{material.titulo}</h3>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {material.descricao}
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <span>{material.disciplina}</span>
                    <span>{material.professor}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {material.tipo === "video" ? material.duracao : material.tamanho}
                    </span>
                    <div className="flex gap-2">
                      {material.tipo === "video" ? (
                        <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600">
                          <Play className="h-4 w-4 mr-1" />
                          Assistir
                        </Button>
                      ) : (
                        <>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                          <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600">
                            <Download className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {materiaisFiltrados.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-lg">Nenhum material encontrado</h3>
            <p className="text-muted-foreground">Tente ajustar os filtros de busca</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

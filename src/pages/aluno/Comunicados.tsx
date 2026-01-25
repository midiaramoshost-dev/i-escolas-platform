import { motion } from "framer-motion";
import {
  MessageSquare,
  Bell,
  Calendar,
  AlertCircle,
  Info,
  Megaphone,
  CheckCircle,
  ChevronRight,
  Pin,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

const comunicados = [
  {
    id: "1",
    titulo: "Reunião de Pais e Mestres - 1º Semestre",
    tipo: "reuniao",
    data: "2024-05-20",
    remetente: "Coordenação Pedagógica",
    lido: false,
    fixado: true,
    conteudo: "Prezados pais e responsáveis, convidamos para a Reunião de Pais e Mestres que acontecerá no dia 25 de maio, às 19h, no auditório da escola. Pauta: Apresentação do desempenho do 1º bimestre e planejamento pedagógico para o 2º semestre.",
    prioridade: "alta",
  },
  {
    id: "2",
    titulo: "Calendário de Provas - 2º Bimestre",
    tipo: "aviso",
    data: "2024-05-18",
    remetente: "Secretaria Escolar",
    lido: false,
    fixado: true,
    conteudo: "Informamos o calendário de provas do 2º bimestre:\n\n• 03/06 - Matemática\n• 04/06 - Português\n• 05/06 - Ciências\n• 06/06 - História\n• 07/06 - Geografia\n\nAs provas iniciam às 7h30. Favor estudar o conteúdo conforme orientação dos professores.",
    prioridade: "alta",
  },
  {
    id: "3",
    titulo: "Feira de Ciências - Inscrições Abertas",
    tipo: "evento",
    data: "2024-05-15",
    remetente: "Prof. Roberto - Ciências",
    lido: true,
    fixado: false,
    conteudo: "Estão abertas as inscrições para a Feira de Ciências 2024! Alunos interessados devem formar grupos de até 3 pessoas e apresentar o projeto até 30/05. Temas: Sustentabilidade, Tecnologia ou Saúde.",
    prioridade: "media",
  },
  {
    id: "4",
    titulo: "Biblioteca - Novos Títulos Disponíveis",
    tipo: "informativo",
    data: "2024-05-12",
    remetente: "Biblioteca",
    lido: true,
    fixado: false,
    conteudo: "A biblioteca recebeu novos títulos de literatura juvenil e paradidáticos. Venha conferir! Horário de funcionamento: Segunda a sexta, das 7h às 17h.",
    prioridade: "baixa",
  },
  {
    id: "5",
    titulo: "Aula de Campo - Museu de História Natural",
    tipo: "evento",
    data: "2024-05-10",
    remetente: "Profª Paula - História",
    lido: true,
    fixado: false,
    conteudo: "No dia 20/06, realizaremos uma visita ao Museu de História Natural. A autorização deve ser assinada pelos responsáveis e entregue até 15/06. Custo: R$ 25,00 (transporte + ingresso).",
    prioridade: "media",
  },
  {
    id: "6",
    titulo: "Festa Junina - Participação das Turmas",
    tipo: "evento",
    data: "2024-05-08",
    remetente: "Coordenação de Eventos",
    lido: true,
    fixado: false,
    conteudo: "A Festa Junina acontecerá no dia 29/06. Nossa turma ficará responsável pela barraca de pescaria. Os ensaios da quadrilha começam na próxima semana. Contamos com a participação de todos!",
    prioridade: "baixa",
  },
];

const getTipoIcon = (tipo: string) => {
  switch (tipo) {
    case "reuniao":
      return <Calendar className="h-5 w-5" />;
    case "aviso":
      return <AlertCircle className="h-5 w-5" />;
    case "evento":
      return <Megaphone className="h-5 w-5" />;
    default:
      return <Info className="h-5 w-5" />;
  }
};

const getTipoColor = (tipo: string) => {
  switch (tipo) {
    case "reuniao":
      return "bg-purple-500/10 text-purple-500";
    case "aviso":
      return "bg-red-500/10 text-red-500";
    case "evento":
      return "bg-blue-500/10 text-blue-500";
    default:
      return "bg-gray-500/10 text-gray-500";
  }
};

const getPrioridadeColor = (prioridade: string) => {
  switch (prioridade) {
    case "alta":
      return "bg-red-500/10 text-red-500 border-red-500/20";
    case "media":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    default:
      return "bg-green-500/10 text-green-500 border-green-500/20";
  }
};

export default function AlunoComunicados() {
  const [tabAtiva, setTabAtiva] = useState("todos");

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

  const comunicadosNaoLidos = comunicados.filter(c => !c.lido);
  const comunicadosFixados = comunicados.filter(c => c.fixado);

  const getComunicadosFiltrados = () => {
    switch (tabAtiva) {
      case "nao-lidos":
        return comunicadosNaoLidos;
      case "fixados":
        return comunicadosFixados;
      default:
        return comunicados;
    }
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
          <h1 className="text-2xl font-bold text-foreground">Comunicados</h1>
          <p className="text-muted-foreground">
            Fique por dentro das novidades da escola
          </p>
        </div>
        <Badge className="bg-emerald-500/10 text-emerald-500 self-start md:self-auto">
          <Bell className="mr-1 h-3 w-3" />
          {comunicadosNaoLidos.length} não lidos
        </Badge>
      </motion.div>

      {/* Resumo */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-3xl font-bold">{comunicados.length}</p>
                <p className="text-xs text-muted-foreground">comunicados</p>
              </div>
              <div className="rounded-full p-3 bg-blue-500/10">
                <MessageSquare className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Não Lidos</p>
                <p className="text-3xl font-bold text-orange-500">{comunicadosNaoLidos.length}</p>
                <p className="text-xs text-muted-foreground">pendentes</p>
              </div>
              <div className="rounded-full p-3 bg-orange-500/10">
                <Bell className="h-8 w-8 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fixados</p>
                <p className="text-3xl font-bold text-purple-500">{comunicadosFixados.length}</p>
                <p className="text-xs text-muted-foreground">importantes</p>
              </div>
              <div className="rounded-full p-3 bg-purple-500/10">
                <Pin className="h-8 w-8 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Lidos</p>
                <p className="text-3xl font-bold text-green-500">{comunicados.length - comunicadosNaoLidos.length}</p>
                <p className="text-xs text-muted-foreground">concluídos</p>
              </div>
              <div className="rounded-full p-3 bg-green-500/10">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs value={tabAtiva} onValueChange={setTabAtiva}>
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="nao-lidos">Não Lidos</TabsTrigger>
            <TabsTrigger value="fixados">Fixados</TabsTrigger>
          </TabsList>

          <TabsContent value={tabAtiva} className="mt-6">
            <div className="space-y-4">
              {getComunicadosFiltrados().map((comunicado) => (
                <motion.div
                  key={comunicado.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Dialog>
                    <DialogTrigger asChild>
                      <Card className={`cursor-pointer transition-all hover:shadow-md ${
                        !comunicado.lido ? "border-l-4 border-l-emerald-500 bg-emerald-500/5" : ""
                      }`}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-full shrink-0 ${getTipoColor(comunicado.tipo)}`}>
                              {getTipoIcon(comunicado.tipo)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-semibold">{comunicado.titulo}</h3>
                                  {comunicado.fixado && (
                                    <Pin className="h-4 w-4 text-purple-500" />
                                  )}
                                  {!comunicado.lido && (
                                    <Badge className="bg-emerald-500/10 text-emerald-500 text-[10px]">Novo</Badge>
                                  )}
                                </div>
                                <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{comunicado.remetente}</p>
                              <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                                {comunicado.conteudo}
                              </p>
                              <div className="flex items-center gap-3 mt-3">
                                <Badge variant="outline" className={getPrioridadeColor(comunicado.prioridade)}>
                                  {comunicado.prioridade}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(comunicado.data).toLocaleDateString("pt-BR")}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <div className="flex items-center gap-2">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${getTipoColor(comunicado.tipo)}`}>
                            {getTipoIcon(comunicado.tipo)}
                          </div>
                          <div>
                            <DialogTitle>{comunicado.titulo}</DialogTitle>
                            <DialogDescription>
                              {comunicado.remetente} • {new Date(comunicado.data).toLocaleDateString("pt-BR")}
                            </DialogDescription>
                          </div>
                        </div>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="prose prose-sm dark:prose-invert">
                          <p className="text-sm whitespace-pre-line">{comunicado.conteudo}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getPrioridadeColor(comunicado.prioridade)}>
                            Prioridade {comunicado.prioridade}
                          </Badge>
                          <Badge variant="outline" className={getTipoColor(comunicado.tipo)}>
                            {comunicado.tipo}
                          </Badge>
                        </div>
                        <Button className="w-full bg-emerald-500 hover:bg-emerald-600">
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Marcar como Lido
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </motion.div>
              ))}

              {getComunicadosFiltrados().length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-lg">Nenhum comunicado</h3>
                  <p className="text-muted-foreground">Não há comunicados nesta categoria</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}

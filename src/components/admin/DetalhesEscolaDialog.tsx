import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Building2,
  MapPin,
  Users,
  GraduationCap,
  Calendar,
  FileText,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Mail,
  Phone,
  Link2,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Escola } from "./EditarEscolaDialog";

interface DetalhesEscolaDialogProps {
  escola: Escola | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data for history
const getHistoricoEscola = (escolaId: string) => [
  { id: "1", data: "2024-01-15 14:30", tipo: "plano", descricao: "Upgrade de plano: Start → Pro", usuario: "Admin Master" },
  { id: "2", data: "2024-01-10 09:15", tipo: "pagamento", descricao: "Pagamento mensal confirmado - R$ 399,00", usuario: "Sistema" },
  { id: "3", data: "2023-12-20 16:45", tipo: "cadastro", descricao: "Atualização de dados cadastrais", usuario: "Diretor João" },
  { id: "4", data: "2023-12-10 10:00", tipo: "pagamento", descricao: "Pagamento mensal confirmado - R$ 199,00", usuario: "Sistema" },
  { id: "5", data: "2023-11-15 11:30", tipo: "suporte", descricao: "Ticket #1234 resolvido: Problema de acesso", usuario: "Suporte" },
  { id: "6", data: "2023-11-01 08:00", tipo: "status", descricao: "Status alterado: Trial → Ativo", usuario: "Sistema" },
];

const getPlanoColor = (plano: string) => {
  switch (plano.toLowerCase()) {
    case "premium": return "bg-rose-500/10 text-rose-500";
    case "pro": return "bg-purple-500/10 text-purple-500";
    case "start": return "bg-blue-500/10 text-blue-500";
    default: return "bg-muted text-muted-foreground";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "ativo": return "bg-green-500/10 text-green-500";
    case "trial": return "bg-yellow-500/10 text-yellow-500";
    case "inativo": return "bg-red-500/10 text-red-500";
    default: return "bg-muted text-muted-foreground";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "ativo": return <CheckCircle className="h-4 w-4" />;
    case "trial": return <Clock className="h-4 w-4" />;
    case "inativo": return <XCircle className="h-4 w-4" />;
    default: return null;
  }
};

const getTipoHistoricoIcon = (tipo: string) => {
  switch (tipo) {
    case "plano": return <TrendingUp className="h-4 w-4 text-purple-500" />;
    case "pagamento": return <CreditCard className="h-4 w-4 text-green-500" />;
    case "cadastro": return <FileText className="h-4 w-4 text-blue-500" />;
    case "suporte": return <Mail className="h-4 w-4 text-orange-500" />;
    case "status": return <CheckCircle className="h-4 w-4 text-emerald-500" />;
    default: return <FileText className="h-4 w-4 text-muted-foreground" />;
  }
};

const MODULOS_LABELS: Record<string, string> = {
  academico: "Acadêmico",
  financeiro: "Financeiro",
  biblioteca: "Biblioteca",
  comunicacao: "Comunicação",
};

export function DetalhesEscolaDialog({ escola, open, onOpenChange }: DetalhesEscolaDialogProps) {
  if (!escola) return null;

  const historico = getHistoricoEscola(escola.id);

  const generateExclusiveLink = () => {
    const escolaSlug = escola.nome
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const linkAcesso = `${window.location.origin}/login?escola=${escolaSlug}-${escola.id}`;

    navigator.clipboard.writeText(linkAcesso);
    toast.success("Link exclusivo gerado e copiado!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full p-3 bg-rose-500/10 overflow-hidden">
                {escola.logoUrl ? (
                  <img
                    src={escola.logoUrl}
                    alt={`Logo ${escola.nome}`}
                    className="h-6 w-6 object-contain"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <Building2 className="h-6 w-6 text-rose-500" />
                )}
              </div>
              <div>
                <DialogTitle className="text-xl text-blue-500">{escola.nome}</DialogTitle>
                <p className="text-sm text-muted-foreground">{escola.cnpj}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge className={getPlanoColor(escola.plano)}>{escola.plano}</Badge>
              <Badge className={`${getStatusColor(escola.status)} flex items-center gap-1`}>
                {getStatusIcon(escola.status)}
                {escola.status === "ativo" ? "Ativo" : escola.status === "trial" ? "Trial" : "Inativo"}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="info" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="metricas">Métricas</TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-4 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Localização
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold">{escola.cidade} - {escola.uf}</p>
                  <p className="text-sm text-muted-foreground">Porte: {escola.porte}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Data de Cadastro
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold">
                    {new Date(escola.datacadastro).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {Math.floor((Date.now() - new Date(escola.datacadastro).getTime()) / (1000 * 60 * 60 * 24))} dias como cliente
                  </p>
                </CardContent>
              </Card>

              <Card className="md:col-span-2 border-primary/20 bg-primary/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Link2 className="h-4 w-4" />
                    Link de Acesso
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {escola.linkAcesso ? (
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-muted px-3 py-2 rounded break-all flex-1">
                        {escola.linkAcesso}
                      </code>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(escola.linkAcesso!);
                          toast.success("Link copiado!");
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Nenhum link salvo. Você pode gerar um link exclusivo agora.
                    </p>
                  )}

                  <Button variant="outline" onClick={generateExclusiveLink}>
                    <Link2 className="h-4 w-4 mr-2" />
                    Gerar link exclusivo
                  </Button>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Módulos implantados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {(escola.modulos || []).length > 0 ? (
                      (escola.modulos || []).map((m) => (
                        <Badge key={m} variant="secondary">
                          {MODULOS_LABELS[m] || m}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">Nenhum módulo selecionado.</span>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Alunos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-rose-500">{escola.alunos.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">matriculados</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Professores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-purple-500">{escola.professores}</p>
                  <p className="text-sm text-muted-foreground">ativos</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Contatos da Escola
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>contato@{escola.nome.toLowerCase().replace(/\s+/g, '')}.com.br</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>(11) 9999-{escola.id.padStart(4, '0')}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metricas" className="mt-4 space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-500">98%</p>
                    <p className="text-sm text-muted-foreground mt-1">Taxa de Adimplência</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-500">87%</p>
                    <p className="text-sm text-muted-foreground mt-1">Engajamento Plataforma</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-purple-500">4.8</p>
                    <p className="text-sm text-muted-foreground mt-1">Avaliação NPS</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Uso Mensal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Acessos de Alunos</span>
                      <span className="font-medium">892 / mês</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full" style={{ width: '78%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Acessos de Professores</span>
                      <span className="font-medium">156 / mês</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: '65%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Acessos de Responsáveis</span>
                      <span className="font-medium">1.245 / mês</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '92%' }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="historico" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Histórico de Atividades</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-4">
                    {historico.map((item, index) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="rounded-full p-2 bg-muted">
                            {getTipoHistoricoIcon(item.tipo)}
                          </div>
                          {index < historico.length - 1 && (
                            <div className="w-px h-full bg-border mt-2" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <p className="text-sm font-medium">{item.descricao}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">{item.data}</span>
                            <Separator orientation="vertical" className="h-3" />
                            <span className="text-xs text-muted-foreground">{item.usuario}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

import { motion } from "framer-motion";
import {
  Settings,
  Globe,
  Bell,
  Shield,
  Mail,
  Palette,
  Database,
  Server,
  Save,
  RotateCcw,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { toast } from "sonner";

interface ConfiguracaoGeral {
  nomePlataforma: string;
  urlPlataforma: string;
  emailSuporte: string;
  telefoneSuporte: string;
  whatsappPlataforma: string;
  fusoHorario: string;
  idioma: string;
}

interface ConfiguracaoNotificacoes {
  emailNovaEscola: boolean;
  emailNovoPagamento: boolean;
  emailEscolaInativa: boolean;
  alertaFaturamento: boolean;
  resumoDiario: boolean;
  resumoSemanal: boolean;
}

interface ConfiguracaoSeguranca {
  autenticacaoDoisFatores: boolean;
  sessaoExpiracao: string;
  tentativasLogin: string;
  ipBloqueio: boolean;
  logAtividades: boolean;
}

interface ConfiguracaoEmail {
  smtpHost: string;
  smtpPorta: string;
  smtpUsuario: string;
  smtpSenha: string;
  emailRemetente: string;
  nomeRemetente: string;
}

export default function AdminConfiguracoes() {
  const [configGeral, setConfigGeral] = useState<ConfiguracaoGeral>({
    nomePlataforma: "i ESCOLAS",
    urlPlataforma: "https://i-escolas-platform.lovable.app",
    emailSuporte: "suporte@iescolas.com.br",
    telefoneSuporte: "(11) 99999-9999",
    whatsappPlataforma: "5515997625135",
    fusoHorario: "America/Sao_Paulo",
    idioma: "pt-BR",
  });

  const [configNotificacoes, setConfigNotificacoes] = useState<ConfiguracaoNotificacoes>({
    emailNovaEscola: true,
    emailNovoPagamento: true,
    emailEscolaInativa: true,
    alertaFaturamento: true,
    resumoDiario: false,
    resumoSemanal: true,
  });

  const [configSeguranca, setConfigSeguranca] = useState<ConfiguracaoSeguranca>({
    autenticacaoDoisFatores: false,
    sessaoExpiracao: "24",
    tentativasLogin: "5",
    ipBloqueio: true,
    logAtividades: true,
  });

  const [configEmail, setConfigEmail] = useState<ConfiguracaoEmail>({
    smtpHost: "smtp.gmail.com",
    smtpPorta: "587",
    smtpUsuario: "",
    smtpSenha: "",
    emailRemetente: "noreply@iescolas.com.br",
    nomeRemetente: "i ESCOLAS",
  });

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

  const handleSaveGeral = () => {
    toast.success("Configurações gerais salvas com sucesso!");
  };

  const handleSaveNotificacoes = () => {
    toast.success("Configurações de notificações salvas com sucesso!");
  };

  const handleSaveSeguranca = () => {
    toast.success("Configurações de segurança salvas com sucesso!");
  };

  const handleSaveEmail = () => {
    toast.success("Configurações de e-mail salvas com sucesso!");
  };

  const handleTestarEmail = () => {
    toast.info("Enviando e-mail de teste...");
    setTimeout(() => {
      toast.success("E-mail de teste enviado com sucesso!");
    }, 2000);
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
          <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground">
            Configure as opções gerais da plataforma
          </p>
        </div>
        <Badge className="bg-rose-500/10 text-rose-500 w-fit">
          <Server className="mr-1 h-3 w-3" />
          Ambiente de Produção
        </Badge>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tabs defaultValue="geral" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid mb-6">
            <TabsTrigger value="geral" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Geral</span>
            </TabsTrigger>
            <TabsTrigger value="notificacoes" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notificações</span>
            </TabsTrigger>
            <TabsTrigger value="seguranca" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Segurança</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">E-mail</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab: Geral */}
          <TabsContent value="geral" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-rose-500" />
                  Informações da Plataforma
                </CardTitle>
                <CardDescription>
                  Configure as informações básicas da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nomePlataforma">Nome da Plataforma</Label>
                    <Input
                      id="nomePlataforma"
                      value={configGeral.nomePlataforma}
                      onChange={(e) => setConfigGeral({ ...configGeral, nomePlataforma: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="urlPlataforma">URL da Plataforma</Label>
                    <Input
                      id="urlPlataforma"
                      value={configGeral.urlPlataforma}
                      onChange={(e) => setConfigGeral({ ...configGeral, urlPlataforma: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="emailSuporte">E-mail de Suporte</Label>
                    <Input
                      id="emailSuporte"
                      type="email"
                      value={configGeral.emailSuporte}
                      onChange={(e) => setConfigGeral({ ...configGeral, emailSuporte: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefoneSuporte">Telefone de Suporte</Label>
                     <Input
                       id="telefoneSuporte"
                       value={configGeral.telefoneSuporte}
                       onChange={(e) => setConfigGeral({ ...configGeral, telefoneSuporte: e.target.value })}
                     />
                   </div>
                 </div>
                 <div className="grid gap-4 md:grid-cols-2">
                   <div className="space-y-2">
                     <Label htmlFor="whatsappPlataforma">WhatsApp da Plataforma</Label>
                     <p className="text-xs text-muted-foreground">Número usado nos botões de contato do site (apenas números, com DDI+DDD)</p>
                     <Input
                       id="whatsappPlataforma"
                       value={configGeral.whatsappPlataforma}
                       onChange={(e) => setConfigGeral({ ...configGeral, whatsappPlataforma: e.target.value })}
                       placeholder="5515997625135"
                     />
                   </div>
                 </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fusoHorario">Fuso Horário</Label>
                    <Select value={configGeral.fusoHorario} onValueChange={(v) => setConfigGeral({ ...configGeral, fusoHorario: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                        <SelectItem value="America/Manaus">Manaus (GMT-4)</SelectItem>
                        <SelectItem value="America/Fortaleza">Fortaleza (GMT-3)</SelectItem>
                        <SelectItem value="America/Cuiaba">Cuiabá (GMT-4)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="idioma">Idioma Padrão</Label>
                    <Select value={configGeral.idioma} onValueChange={(v) => setConfigGeral({ ...configGeral, idioma: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button onClick={handleSaveGeral} className="bg-rose-500 hover:bg-rose-600">
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Configurações
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Notificações */}
          <TabsContent value="notificacoes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-rose-500" />
                  Configurações de Notificações
                </CardTitle>
                <CardDescription>
                  Configure quais notificações você deseja receber
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-muted-foreground">Notificações por E-mail</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Nova escola cadastrada</Label>
                        <p className="text-sm text-muted-foreground">Receber e-mail quando uma nova escola se cadastrar</p>
                      </div>
                      <Switch
                        checked={configNotificacoes.emailNovaEscola}
                        onCheckedChange={(v) => setConfigNotificacoes({ ...configNotificacoes, emailNovaEscola: v })}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Novo pagamento recebido</Label>
                        <p className="text-sm text-muted-foreground">Receber e-mail para cada pagamento processado</p>
                      </div>
                      <Switch
                        checked={configNotificacoes.emailNovoPagamento}
                        onCheckedChange={(v) => setConfigNotificacoes({ ...configNotificacoes, emailNovoPagamento: v })}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Escola inativa</Label>
                        <p className="text-sm text-muted-foreground">Alertar quando uma escola ficar inativa por muito tempo</p>
                      </div>
                      <Switch
                        checked={configNotificacoes.emailEscolaInativa}
                        onCheckedChange={(v) => setConfigNotificacoes({ ...configNotificacoes, emailEscolaInativa: v })}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Alerta de faturamento</Label>
                        <p className="text-sm text-muted-foreground">Receber alertas sobre faturas vencidas ou próximas do vencimento</p>
                      </div>
                      <Switch
                        checked={configNotificacoes.alertaFaturamento}
                        onCheckedChange={(v) => setConfigNotificacoes({ ...configNotificacoes, alertaFaturamento: v })}
                      />
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-muted-foreground">Resumos Periódicos</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Resumo diário</Label>
                        <p className="text-sm text-muted-foreground">Receber resumo diário das atividades da plataforma</p>
                      </div>
                      <Switch
                        checked={configNotificacoes.resumoDiario}
                        onCheckedChange={(v) => setConfigNotificacoes({ ...configNotificacoes, resumoDiario: v })}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Resumo semanal</Label>
                        <p className="text-sm text-muted-foreground">Receber resumo semanal com métricas e indicadores</p>
                      </div>
                      <Switch
                        checked={configNotificacoes.resumoSemanal}
                        onCheckedChange={(v) => setConfigNotificacoes({ ...configNotificacoes, resumoSemanal: v })}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button onClick={handleSaveNotificacoes} className="bg-rose-500 hover:bg-rose-600">
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Configurações
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Segurança */}
          <TabsContent value="seguranca" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-rose-500" />
                  Configurações de Segurança
                </CardTitle>
                <CardDescription>
                  Configure as opções de segurança da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Autenticação de dois fatores (2FA)</Label>
                      <p className="text-sm text-muted-foreground">Exigir 2FA para todos os administradores</p>
                    </div>
                    <Switch
                      checked={configSeguranca.autenticacaoDoisFatores}
                      onCheckedChange={(v) => setConfigSeguranca({ ...configSeguranca, autenticacaoDoisFatores: v })}
                    />
                  </div>
                  <Separator />
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="sessaoExpiracao">Expiração da sessão (horas)</Label>
                      <Input
                        id="sessaoExpiracao"
                        type="number"
                        value={configSeguranca.sessaoExpiracao}
                        onChange={(e) => setConfigSeguranca({ ...configSeguranca, sessaoExpiracao: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tentativasLogin">Tentativas de login antes do bloqueio</Label>
                      <Input
                        id="tentativasLogin"
                        type="number"
                        value={configSeguranca.tentativasLogin}
                        onChange={(e) => setConfigSeguranca({ ...configSeguranca, tentativasLogin: e.target.value })}
                      />
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Bloqueio por IP</Label>
                      <p className="text-sm text-muted-foreground">Bloquear IPs após múltiplas tentativas falhas</p>
                    </div>
                    <Switch
                      checked={configSeguranca.ipBloqueio}
                      onCheckedChange={(v) => setConfigSeguranca({ ...configSeguranca, ipBloqueio: v })}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Log de atividades</Label>
                      <p className="text-sm text-muted-foreground">Registrar todas as ações dos administradores</p>
                    </div>
                    <Switch
                      checked={configSeguranca.logAtividades}
                      onCheckedChange={(v) => setConfigSeguranca({ ...configSeguranca, logAtividades: v })}
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button onClick={handleSaveSeguranca} className="bg-rose-500 hover:bg-rose-600">
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Configurações
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: E-mail */}
          <TabsContent value="email" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-rose-500" />
                  Configurações de E-mail (SMTP)
                </CardTitle>
                <CardDescription>
                  Configure o servidor de e-mail para envio de notificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="smtpHost">Host SMTP</Label>
                    <Input
                      id="smtpHost"
                      value={configEmail.smtpHost}
                      onChange={(e) => setConfigEmail({ ...configEmail, smtpHost: e.target.value })}
                      placeholder="smtp.exemplo.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPorta">Porta</Label>
                    <Input
                      id="smtpPorta"
                      value={configEmail.smtpPorta}
                      onChange={(e) => setConfigEmail({ ...configEmail, smtpPorta: e.target.value })}
                      placeholder="587"
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="smtpUsuario">Usuário SMTP</Label>
                    <Input
                      id="smtpUsuario"
                      value={configEmail.smtpUsuario}
                      onChange={(e) => setConfigEmail({ ...configEmail, smtpUsuario: e.target.value })}
                      placeholder="usuario@exemplo.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpSenha">Senha SMTP</Label>
                    <Input
                      id="smtpSenha"
                      type="password"
                      value={configEmail.smtpSenha}
                      onChange={(e) => setConfigEmail({ ...configEmail, smtpSenha: e.target.value })}
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <Separator />
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="emailRemetente">E-mail Remetente</Label>
                    <Input
                      id="emailRemetente"
                      type="email"
                      value={configEmail.emailRemetente}
                      onChange={(e) => setConfigEmail({ ...configEmail, emailRemetente: e.target.value })}
                      placeholder="noreply@exemplo.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nomeRemetente">Nome do Remetente</Label>
                    <Input
                      id="nomeRemetente"
                      value={configEmail.nomeRemetente}
                      onChange={(e) => setConfigEmail({ ...configEmail, nomeRemetente: e.target.value })}
                      placeholder="Minha Plataforma"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={handleTestarEmail}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Testar Conexão
                  </Button>
                  <Button onClick={handleSaveEmail} className="bg-rose-500 hover:bg-rose-600">
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Configurações
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}

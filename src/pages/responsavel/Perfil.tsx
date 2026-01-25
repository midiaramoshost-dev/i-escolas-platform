import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit,
  Camera,
  Shield,
  Bell,
  Moon,
  Sun,
  Save,
  Lock,
  Users,
  CreditCard,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";

const dadosResponsavel = {
  nome: "Maria Silva Santos",
  email: "maria.silva@email.com",
  cpf: "123.456.789-00",
  telefone: "(11) 91234-5678",
  telefoneAlternativo: "(11) 3456-7890",
  endereco: "Rua das Flores, 123 - Centro",
  cidade: "São Paulo - SP",
  cep: "01234-567",
  dependentes: [
    { nome: "Ana Beatriz Silva", turma: "5º Ano A", matricula: "2024001" },
    { nome: "Pedro Silva", turma: "3º Ano B", matricula: "2024002" },
  ],
};

export default function ResponsavelPerfil() {
  const { theme, setTheme } = useTheme();
  const [editando, setEditando] = useState(false);
  const [notificacoes, setNotificacoes] = useState({
    email: true,
    push: true,
    sms: true,
    whatsapp: true,
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
          <h1 className="text-2xl font-bold text-foreground">Meu Perfil</h1>
          <p className="text-muted-foreground">
            Gerencie suas informações pessoais e preferências
          </p>
        </div>
      </motion.div>

      {/* Card Principal do Perfil */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-violet-500 text-white text-2xl">MS</AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-violet-500 hover:bg-violet-600"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold">{dadosResponsavel.nome}</h2>
                <p className="text-muted-foreground">{dadosResponsavel.email}</p>
                <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                  <Badge className="bg-violet-500/10 text-violet-500">
                    <Users className="h-3 w-3 mr-1" />
                    {dadosResponsavel.dependentes.length} dependentes
                  </Badge>
                  <Badge variant="outline">Responsável</Badge>
                </div>
              </div>
              <Button variant="outline" onClick={() => setEditando(!editando)}>
                <Edit className="h-4 w-4 mr-2" />
                {editando ? "Cancelar" : "Editar"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="dados" className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="dados">Dados Pessoais</TabsTrigger>
          <TabsTrigger value="dependentes">Dependentes</TabsTrigger>
          <TabsTrigger value="preferencias">Preferências</TabsTrigger>
          <TabsTrigger value="seguranca">Segurança</TabsTrigger>
        </TabsList>

        {/* Dados Pessoais */}
        <TabsContent value="dados">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-violet-500" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Nome Completo</Label>
                    <Input value={dadosResponsavel.nome} disabled={!editando} />
                  </div>
                  <div className="space-y-2">
                    <Label>CPF</Label>
                    <Input value={dadosResponsavel.cpf} disabled />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>E-mail</Label>
                    <div className="flex gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground mt-3" />
                      <Input value={dadosResponsavel.email} disabled={!editando} className="flex-1" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Telefone Principal</Label>
                    <div className="flex gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground mt-3" />
                      <Input value={dadosResponsavel.telefone} disabled={!editando} className="flex-1" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Telefone Alternativo</Label>
                  <div className="flex gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground mt-3" />
                    <Input value={dadosResponsavel.telefoneAlternativo} disabled={!editando} className="flex-1" />
                  </div>
                </div>

                <Separator />

                <h4 className="font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  Endereço
                </h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label>Endereço</Label>
                    <Input value={dadosResponsavel.endereco} disabled={!editando} />
                  </div>
                  <div className="space-y-2">
                    <Label>Cidade/Estado</Label>
                    <Input value={dadosResponsavel.cidade} disabled={!editando} />
                  </div>
                  <div className="space-y-2">
                    <Label>CEP</Label>
                    <Input value={dadosResponsavel.cep} disabled={!editando} />
                  </div>
                </div>

                {editando && (
                  <Button className="w-full bg-violet-500 hover:bg-violet-600">
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Alterações
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Dependentes */}
        <TabsContent value="dependentes">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Meus Dependentes
                </CardTitle>
                <CardDescription>
                  Alunos vinculados à sua conta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {dadosResponsavel.dependentes.map((dependente, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-lg bg-muted/50"
                  >
                    <Avatar className="h-14 w-14">
                      <AvatarFallback className="bg-violet-500 text-white">
                        {dependente.nome.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold">{dependente.nome}</h4>
                      <p className="text-sm text-muted-foreground">
                        {dependente.turma} • Matrícula: {dependente.matricula}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Preferências */}
        <TabsContent value="preferencias">
          <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-orange-500" />
                  Notificações
                </CardTitle>
                <CardDescription>
                  Escolha como deseja receber notificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificações por E-mail</Label>
                    <p className="text-xs text-muted-foreground">
                      Receba atualizações por e-mail
                    </p>
                  </div>
                  <Switch
                    checked={notificacoes.email}
                    onCheckedChange={(checked) => setNotificacoes({ ...notificacoes, email: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificações Push</Label>
                    <p className="text-xs text-muted-foreground">
                      Receba notificações no navegador
                    </p>
                  </div>
                  <Switch
                    checked={notificacoes.push}
                    onCheckedChange={(checked) => setNotificacoes({ ...notificacoes, push: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificações por SMS</Label>
                    <p className="text-xs text-muted-foreground">
                      Receba SMS para avisos importantes
                    </p>
                  </div>
                  <Switch
                    checked={notificacoes.sms}
                    onCheckedChange={(checked) => setNotificacoes({ ...notificacoes, sms: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>WhatsApp</Label>
                    <p className="text-xs text-muted-foreground">
                      Receba mensagens via WhatsApp
                    </p>
                  </div>
                  <Switch
                    checked={notificacoes.whatsapp}
                    onCheckedChange={(checked) => setNotificacoes({ ...notificacoes, whatsapp: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {theme === "dark" ? <Moon className="h-5 w-5 text-purple-500" /> : <Sun className="h-5 w-5 text-yellow-500" />}
                  Aparência
                </CardTitle>
                <CardDescription>
                  Personalize a aparência do portal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Modo Escuro</Label>
                    <p className="text-xs text-muted-foreground">
                      Alterne entre tema claro e escuro
                    </p>
                  </div>
                  <Switch
                    checked={theme === "dark"}
                    onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Segurança */}
        <TabsContent value="seguranca">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-500" />
                  Segurança da Conta
                </CardTitle>
                <CardDescription>
                  Gerencie a segurança do seu acesso
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Alterar Senha
                  </h4>
                  <div className="grid gap-4 max-w-md">
                    <div className="space-y-2">
                      <Label>Senha Atual</Label>
                      <Input type="password" placeholder="Digite sua senha atual" />
                    </div>
                    <div className="space-y-2">
                      <Label>Nova Senha</Label>
                      <Input type="password" placeholder="Digite a nova senha" />
                    </div>
                    <div className="space-y-2">
                      <Label>Confirmar Nova Senha</Label>
                      <Input type="password" placeholder="Confirme a nova senha" />
                    </div>
                    <Button className="bg-violet-500 hover:bg-violet-600">
                      Alterar Senha
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-2">Último Acesso</h4>
                  <p className="text-sm text-muted-foreground">
                    25/01/2026 às 19:45 - São Paulo, SP
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

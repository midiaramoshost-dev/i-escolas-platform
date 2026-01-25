import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  Building2, 
  Key, 
  CreditCard, 
  Settings, 
  Copy, 
  Eye, 
  EyeOff,
  Check,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Escola } from "./EditarEscolaDialog";

interface CadastrarEscolaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (escola: Escola) => void;
}

const UF_OPTIONS = ["SP", "RJ", "MG", "PR", "BA", "CE", "AM", "RS", "SC", "PE", "GO", "DF"];
const PORTE_OPTIONS = ["Pequeno", "Médio", "Grande"];
const PLANO_OPTIONS = ["Free", "Start", "Pro", "Premium"];

interface PaymentProvider {
  id: string;
  name: string;
  logo: string;
  description: string;
}

const paymentProviders: PaymentProvider[] = [
  { id: "stripe", name: "Stripe", logo: "💳", description: "Pagamentos internacionais" },
  { id: "mercadopago", name: "Mercado Pago", logo: "🟡", description: "Líder na América Latina" },
  { id: "asaas", name: "Asaas", logo: "🔵", description: "Gestão de cobranças" },
  { id: "pagseguro", name: "PagSeguro", logo: "🟢", description: "Popular no Brasil" },
  { id: "pagarme", name: "Pagar.me", logo: "🟣", description: "API completa" },
  { id: "cielo", name: "Cielo", logo: "🔷", description: "Maior adquirente BR" },
];

interface FormData {
  // Dados básicos
  nome: string;
  cnpj: string;
  cidade: string;
  uf: string;
  porte: string;
  plano: string;
  emailDiretor: string;
  telefoneDiretor: string;
  
  // Credenciais
  loginProvisorio: string;
  senhaProvisoria: string;
  
  // Implantação
  valorImplantacao: string;
  descricaoCobranca: string;
  dataVencimento: string;
  
  // Provedor de pagamento
  provedorPagamento: string;
  apiKey: string;
  apiSecret: string;
  webhookUrl: string;
  ambiente: "sandbox" | "producao";
}

const generatePassword = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const generateLogin = (nome: string) => {
  const base = nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "")
    .substring(0, 10);
  const suffix = Math.floor(Math.random() * 1000);
  return `${base}${suffix}`;
};

export function CadastrarEscolaDialog({ open, onOpenChange, onSave }: CadastrarEscolaDialogProps) {
  const [activeTab, setActiveTab] = useState("dados");
  const [showPassword, setShowPassword] = useState(false);
  const [showApiSecret, setShowApiSecret] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    cnpj: "",
    cidade: "",
    uf: "",
    porte: "",
    plano: "",
    emailDiretor: "",
    telefoneDiretor: "",
    loginProvisorio: "",
    senhaProvisoria: "",
    valorImplantacao: "",
    descricaoCobranca: "Taxa de implantação do sistema i ESCOLAS",
    dataVencimento: "",
    provedorPagamento: "",
    apiKey: "",
    apiSecret: "",
    webhookUrl: "",
    ambiente: "sandbox",
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-gerar login quando nome é preenchido
    if (field === "nome" && value.length > 3 && !formData.loginProvisorio) {
      setFormData(prev => ({
        ...prev,
        nome: value,
        loginProvisorio: generateLogin(value),
        senhaProvisoria: generatePassword(),
      }));
    }
  };

  const handleGenerateCredentials = () => {
    setFormData(prev => ({
      ...prev,
      loginProvisorio: generateLogin(formData.nome || "escola"),
      senhaProvisoria: generatePassword(),
    }));
    toast.success("Credenciais geradas com sucesso!");
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado para a área de transferência!`);
  };

  const validateTab = (tab: string): boolean => {
    switch (tab) {
      case "dados":
        if (!formData.nome || !formData.cnpj || !formData.cidade || !formData.uf || !formData.porte || !formData.plano || !formData.emailDiretor) {
          toast.error("Preencha todos os campos obrigatórios dos dados básicos");
          return false;
        }
        return true;
      case "acesso":
        if (!formData.loginProvisorio || !formData.senhaProvisoria) {
          toast.error("Gere ou preencha as credenciais de acesso");
          return false;
        }
        return true;
      case "cobranca":
        if (!formData.valorImplantacao) {
          toast.error("Informe o valor da implantação");
          return false;
        }
        return true;
      case "pagamento":
        if (!formData.provedorPagamento) {
          toast.error("Selecione um provedor de pagamento");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNextTab = () => {
    const tabs = ["dados", "acesso", "cobranca", "pagamento"];
    const currentIndex = tabs.indexOf(activeTab);
    if (validateTab(activeTab) && currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const handlePrevTab = () => {
    const tabs = ["dados", "acesso", "cobranca", "pagamento"];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  const handleSave = () => {
    // Validar todas as abas
    const tabs = ["dados", "acesso", "cobranca", "pagamento"];
    for (const tab of tabs) {
      if (!validateTab(tab)) {
        setActiveTab(tab);
        return;
      }
    }

    const novaEscola: Escola = {
      id: Date.now().toString(),
      nome: formData.nome,
      cnpj: formData.cnpj,
      cidade: formData.cidade,
      uf: formData.uf,
      porte: formData.porte,
      plano: formData.plano,
      alunos: 0,
      professores: 0,
      status: "trial",
      datacadastro: new Date().toISOString().split("T")[0],
    };

    onSave(novaEscola);
    toast.success("Escola cadastrada com sucesso! Credenciais enviadas por e-mail.");
    
    // Reset form
    setFormData({
      nome: "",
      cnpj: "",
      cidade: "",
      uf: "",
      porte: "",
      plano: "",
      emailDiretor: "",
      telefoneDiretor: "",
      loginProvisorio: "",
      senhaProvisoria: "",
      valorImplantacao: "",
      descricaoCobranca: "Taxa de implantação do sistema i ESCOLAS",
      dataVencimento: "",
      provedorPagamento: "",
      apiKey: "",
      apiSecret: "",
      webhookUrl: "",
      ambiente: "sandbox",
    });
    setActiveTab("dados");
    onOpenChange(false);
  };

  const getTabStatus = (tab: string): "complete" | "current" | "pending" => {
    const tabs = ["dados", "acesso", "cobranca", "pagamento"];
    const currentIndex = tabs.indexOf(activeTab);
    const tabIndex = tabs.indexOf(tab);
    
    if (tabIndex < currentIndex) return "complete";
    if (tabIndex === currentIndex) return "current";
    return "pending";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-rose-500" />
            Cadastrar Nova Escola
          </DialogTitle>
          <DialogDescription>
            Complete todas as etapas para cadastrar a escola na plataforma.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="dados" className="flex items-center gap-2">
              {getTabStatus("dados") === "complete" && <Check className="h-4 w-4 text-green-500" />}
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Dados</span>
            </TabsTrigger>
            <TabsTrigger value="acesso" className="flex items-center gap-2">
              {getTabStatus("acesso") === "complete" && <Check className="h-4 w-4 text-green-500" />}
              <Key className="h-4 w-4" />
              <span className="hidden sm:inline">Acesso</span>
            </TabsTrigger>
            <TabsTrigger value="cobranca" className="flex items-center gap-2">
              {getTabStatus("cobranca") === "complete" && <Check className="h-4 w-4 text-green-500" />}
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Cobrança</span>
            </TabsTrigger>
            <TabsTrigger value="pagamento" className="flex items-center gap-2">
              {getTabStatus("pagamento") === "complete" && <Check className="h-4 w-4 text-green-500" />}
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Pagamentos</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab: Dados Básicos */}
          <TabsContent value="dados" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Escola *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => handleInputChange("nome", e.target.value)}
                  placeholder="Ex: Colégio São Paulo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ *</Label>
                <Input
                  id="cnpj"
                  value={formData.cnpj}
                  onChange={(e) => handleInputChange("cnpj", e.target.value)}
                  placeholder="00.000.000/0001-00"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade *</Label>
                <Input
                  id="cidade"
                  value={formData.cidade}
                  onChange={(e) => handleInputChange("cidade", e.target.value)}
                  placeholder="São Paulo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="uf">UF *</Label>
                <Select value={formData.uf} onValueChange={(v) => handleInputChange("uf", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {UF_OPTIONS.map((uf) => (
                      <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="porte">Porte *</Label>
                <Select value={formData.porte} onValueChange={(v) => handleInputChange("porte", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {PORTE_OPTIONS.map((porte) => (
                      <SelectItem key={porte} value={porte}>{porte}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="plano">Plano *</Label>
                <Select value={formData.plano} onValueChange={(v) => handleInputChange("plano", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o plano" />
                  </SelectTrigger>
                  <SelectContent>
                    {PLANO_OPTIONS.map((plano) => (
                      <SelectItem key={plano} value={plano}>{plano}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="emailDiretor">E-mail do Diretor *</Label>
                <Input
                  id="emailDiretor"
                  type="email"
                  value={formData.emailDiretor}
                  onChange={(e) => handleInputChange("emailDiretor", e.target.value)}
                  placeholder="diretor@escola.com.br"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefoneDiretor">Telefone do Diretor</Label>
              <Input
                id="telefoneDiretor"
                value={formData.telefoneDiretor}
                onChange={(e) => handleInputChange("telefoneDiretor", e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>
          </TabsContent>

          {/* Tab: Acesso Provisório */}
          <TabsContent value="acesso" className="space-y-4">
            <Card className="border-dashed border-2 border-rose-200 bg-rose-50/50 dark:bg-rose-950/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-rose-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-rose-700 dark:text-rose-400">Credenciais de Acesso Provisório</p>
                    <p className="text-sm text-rose-600/80 dark:text-rose-400/80">
                      Estas credenciais serão enviadas ao e-mail do diretor. Recomenda-se alterar a senha no primeiro acesso.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleGenerateCredentials}
                className="border-rose-300 text-rose-600 hover:bg-rose-50"
              >
                <Key className="mr-2 h-4 w-4" />
                Gerar Novas Credenciais
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="loginProvisorio">Login Provisório *</Label>
                <div className="flex gap-2">
                  <Input
                    id="loginProvisorio"
                    value={formData.loginProvisorio}
                    onChange={(e) => handleInputChange("loginProvisorio", e.target.value)}
                    placeholder="login.escola"
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    size="icon" 
                    variant="outline"
                    onClick={() => copyToClipboard(formData.loginProvisorio, "Login")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="senhaProvisoria">Senha Provisória *</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      id="senhaProvisoria"
                      type={showPassword ? "text" : "password"}
                      value={formData.senhaProvisoria}
                      onChange={(e) => handleInputChange("senhaProvisoria", e.target.value)}
                      placeholder="••••••••"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Button 
                    type="button" 
                    size="icon" 
                    variant="outline"
                    onClick={() => copyToClipboard(formData.senhaProvisoria, "Senha")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {formData.loginProvisorio && formData.senhaProvisoria && (
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-2">Resumo das credenciais:</p>
                  <div className="font-mono text-sm bg-background p-3 rounded-md">
                    <p><strong>Login:</strong> {formData.loginProvisorio}</p>
                    <p><strong>Senha:</strong> {showPassword ? formData.senhaProvisoria : "••••••••••••"}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab: Cobrança de Implantação */}
          <TabsContent value="cobranca" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="valorImplantacao">Valor da Implantação (R$) *</Label>
                <Input
                  id="valorImplantacao"
                  type="number"
                  value={formData.valorImplantacao}
                  onChange={(e) => handleInputChange("valorImplantacao", e.target.value)}
                  placeholder="1500.00"
                  step="0.01"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataVencimento">Data de Vencimento</Label>
                <Input
                  id="dataVencimento"
                  type="date"
                  value={formData.dataVencimento}
                  onChange={(e) => handleInputChange("dataVencimento", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricaoCobranca">Descrição da Cobrança</Label>
              <Input
                id="descricaoCobranca"
                value={formData.descricaoCobranca}
                onChange={(e) => handleInputChange("descricaoCobranca", e.target.value)}
                placeholder="Taxa de implantação do sistema"
              />
            </div>

            {formData.valorImplantacao && (
              <Card className="bg-green-50/50 dark:bg-green-950/20 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Cobrança a ser gerada:</p>
                      <p className="font-medium">{formData.descricaoCobranca}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        R$ {Number(formData.valorImplantacao).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      {formData.dataVencimento && (
                        <p className="text-sm text-muted-foreground">
                          Venc: {new Date(formData.dataVencimento + "T00:00:00").toLocaleDateString('pt-BR')}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab: Configuração de Pagamentos */}
          <TabsContent value="pagamento" className="space-y-4">
            <div className="space-y-3">
              <Label>Provedor de Pagamento *</Label>
              <p className="text-sm text-muted-foreground">
                Selecione o provedor que a escola usará para cobrar os alunos
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {paymentProviders.map((provider) => (
                  <button
                    key={provider.id}
                    type="button"
                    onClick={() => handleInputChange("provedorPagamento", provider.id)}
                    className={cn(
                      "relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
                      "hover:border-rose-300 hover:bg-rose-50/50 dark:hover:bg-rose-950/20",
                      formData.provedorPagamento === provider.id
                        ? "border-rose-500 bg-rose-50 dark:bg-rose-950/30"
                        : "border-border"
                    )}
                  >
                    {formData.provedorPagamento === provider.id && (
                      <div className="absolute top-2 right-2">
                        <Check className="h-4 w-4 text-rose-500" />
                      </div>
                    )}
                    <span className="text-3xl">{provider.logo}</span>
                    <span className="font-medium text-sm">{provider.name}</span>
                    <span className="text-xs text-muted-foreground">{provider.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {formData.provedorPagamento && (
              <Card className="border-rose-200">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-rose-500" />
                    <span className="font-medium">
                      Configurar API - {paymentProviders.find(p => p.id === formData.provedorPagamento)?.name}
                    </span>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="apiKey">Chave da API (Public Key)</Label>
                      <Input
                        id="apiKey"
                        value={formData.apiKey}
                        onChange={(e) => handleInputChange("apiKey", e.target.value)}
                        placeholder="pk_live_..."
                        className="font-mono text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apiSecret">Chave Secreta (Secret Key)</Label>
                      <div className="relative">
                        <Input
                          id="apiSecret"
                          type={showApiSecret ? "text" : "password"}
                          value={formData.apiSecret}
                          onChange={(e) => handleInputChange("apiSecret", e.target.value)}
                          placeholder="sk_live_..."
                          className="font-mono text-sm pr-10"
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowApiSecret(!showApiSecret)}
                        >
                          {showApiSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="webhookUrl">URL do Webhook (opcional)</Label>
                    <Input
                      id="webhookUrl"
                      value={formData.webhookUrl}
                      onChange={(e) => handleInputChange("webhookUrl", e.target.value)}
                      placeholder="https://api.escola.com/webhook/pagamentos"
                      className="font-mono text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Ambiente</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={formData.ambiente === "sandbox" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleInputChange("ambiente", "sandbox")}
                        className={formData.ambiente === "sandbox" ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                      >
                        🧪 Sandbox (Testes)
                      </Button>
                      <Button
                        type="button"
                        variant={formData.ambiente === "producao" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleInputChange("ambiente", "producao")}
                        className={formData.ambiente === "producao" ? "bg-green-500 hover:bg-green-600" : ""}
                      >
                        🚀 Produção
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 rounded-md bg-muted/50">
                    <Badge variant={formData.ambiente === "producao" ? "default" : "secondary"}>
                      {formData.ambiente === "producao" ? "PRODUÇÃO" : "SANDBOX"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {formData.ambiente === "producao" 
                        ? "As transações serão reais" 
                        : "Ambiente de testes - sem cobrança real"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex gap-2 w-full sm:w-auto">
            {activeTab !== "dados" && (
              <Button variant="outline" onClick={handlePrevTab} className="flex-1 sm:flex-none">
                Voltar
              </Button>
            )}
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 sm:flex-none">
              Cancelar
            </Button>
          </div>
          {activeTab !== "pagamento" ? (
            <Button onClick={handleNextTab} className="bg-rose-500 hover:bg-rose-600 w-full sm:w-auto">
              Próximo
            </Button>
          ) : (
            <Button onClick={handleSave} className="bg-rose-500 hover:bg-rose-600 w-full sm:w-auto">
              Cadastrar Escola
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

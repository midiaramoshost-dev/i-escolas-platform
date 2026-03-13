import { useEffect, useRef, useState } from "react";
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
  AlertCircle,
  Link2,
  Trash2,
  Sparkles,
} from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Escola } from "./EditarEscolaDialog";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface CadastrarEscolaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (escola: Escola) => Promise<void> | void;
}

const UF_OPTIONS = ["SP", "RJ", "MG", "PR", "BA", "CE", "AM", "RS", "SC", "PE", "GO", "DF"];
const PORTE_OPTIONS = ["Pequeno", "Médio", "Grande"];
const PLANO_OPTIONS = ["Free", "Start", "Pro", "Premium"];

const MODULOS_OPTIONS = [
  // Acadêmico
  { id: "diario_classe", label: "Diário de Classe", categoria: "Acadêmico" },
  { id: "notas", label: "Gestão de Notas", categoria: "Acadêmico" },
  { id: "frequencia", label: "Controle de Frequência", categoria: "Acadêmico" },
  { id: "boletins", label: "Boletins Automáticos", categoria: "Acadêmico", planoMinimo: "Start" },
  { id: "matriculas", label: "Gestão de Matrículas", categoria: "Acadêmico", planoMinimo: "Pro" },
  { id: "maternal", label: "Maternal", categoria: "Acadêmico", planoMinimo: "Start" },
  { id: "nutricao", label: "Nutrição e Alimentação", categoria: "Acadêmico", planoMinimo: "Start" },
  // Financeiro
  { id: "mensalidades", label: "Gestão de Mensalidades", categoria: "Financeiro", planoMinimo: "Start" },
  { id: "inadimplencia", label: "Gestão de Inadimplência", categoria: "Financeiro", planoMinimo: "Pro" },
  { id: "relatorios_financeiros", label: "Relatórios Financeiros", categoria: "Financeiro", planoMinimo: "Pro" },
  { id: "folha_pagamento", label: "Folha de Pagamento", categoria: "Financeiro", planoMinimo: "Pro" },
  // Comunicação
  { id: "comunicados", label: "Central de Comunicados", categoria: "Comunicação" },
  { id: "notificacoes_push", label: "Notificações Push", categoria: "Comunicação", planoMinimo: "Pro" },
  { id: "chat_escola", label: "Chat Escola-Família", categoria: "Comunicação", planoMinimo: "Premium" },
  // Administrativo
  { id: "gestao_turmas", label: "Gestão de Turmas", categoria: "Administrativo" },
  { id: "gestao_professores", label: "Gestão de Professores", categoria: "Administrativo" },
  { id: "configuracoes_escola", label: "Configurações da Escola", categoria: "Administrativo" },
  { id: "biblioteca", label: "Biblioteca", categoria: "Administrativo" },
  // Portais
  { id: "portal_aluno", label: "Portal do Aluno", categoria: "Portais", planoMinimo: "Start" },
  { id: "portal_responsavel", label: "Portal do Responsável", categoria: "Portais", planoMinimo: "Start" },
  // Avançado
  { id: "api_integracao", label: "API de Integração", categoria: "Avançado", planoMinimo: "Premium" },
  { id: "sso", label: "Single Sign-On (SSO)", categoria: "Avançado", planoMinimo: "Premium" },
  // Migração
  { id: "importacao", label: "Importação (Migração)", categoria: "Migração" },
];

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
  logoUrl: string;

  // Credenciais
  loginProvisorio: string;
  senhaProvisoria: string;

  // Implantação
  valorImplantacao: string;
  descricaoCobranca: string;
  dataVencimento: string;

  // Módulos (implantação)
  modulos: string[];

  // Pagamentos
  integrarPagamentos: boolean;

  // Provedor de pagamento
  provedorPagamento: string;
  apiKey: string;
  apiSecret: string;
  webhookUrl: string;
  ambiente: "sandbox" | "producao";

  // UI: habilitar/desabilitar seleção do provedor
  habilitarSelecaoProvedor: boolean;

  // Upload temporário (localStorage)
  fotoBase64: string;
}

const TEMP_FOTO_KEY = "temp_foto_cadastros";

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

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

const formatCNPJ = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
};

const formatPhone = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 10) {
    return digits.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
  }
  return digits.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
};

// Herdado por padrão quando o ADM MASTER implanta uma nova escola.
// (Mínimo para nascer operacional + migração estratégica)
const DEFAULT_MODULOS_ESCOLA = [
  "diario_classe",
  "notas",
  "frequencia",
  "comunicados",
  "gestao_turmas",
  "gestao_professores",
  "configuracoes_escola",
  "importacao",
];

export function CadastrarEscolaDialog({ open, onOpenChange, onSave }: CadastrarEscolaDialogProps) {
  const [activeTab, setActiveTab] = useState("dados");
  const [showPassword, setShowPassword] = useState(false);
  const [showApiSecret, setShowApiSecret] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fotoInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState<FormData>({
    nome: "",
    cnpj: "",
    cidade: "",
    uf: "",
    porte: "",
    plano: "",
    emailDiretor: "",
    telefoneDiretor: "",
    logoUrl: "",
    loginProvisorio: "",
    senhaProvisoria: "",
    valorImplantacao: "",
    descricaoCobranca: "Taxa de implantação do sistema i ESCOLAS",
    dataVencimento: "",
    modulos: [],
    integrarPagamentos: true,
    provedorPagamento: "",
    apiKey: "",
    apiSecret: "",
    webhookUrl: "",
    ambiente: "sandbox",
    habilitarSelecaoProvedor: false,
    fotoBase64: "",
  });

  // Carrega foto temporária do localStorage ao abrir
  useEffect(() => {
    if (!open) return;
    const cached = localStorage.getItem(TEMP_FOTO_KEY);
    if (cached && !formData.fotoBase64) {
      setFormData((prev) => ({ ...prev, fotoBase64: cached }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Auto-gerar login quando nome é preenchido
    if (field === "nome" && typeof value === "string" && value.length > 3 && !formData.loginProvisorio) {
      setFormData((prev) => ({
        ...prev,
        nome: value,
        loginProvisorio: generateLogin(value),
        senhaProvisoria: generatePassword(),
      }));
    }

    // Se desligar integração de pagamentos, limpamos os campos pra não "forçar" config
    if (field === "integrarPagamentos" && value === false) {
      setFormData((prev) => ({
        ...prev,
        integrarPagamentos: false,
        provedorPagamento: "",
        apiKey: "",
        apiSecret: "",
        webhookUrl: "",
        ambiente: "sandbox",
      }));
    }

    // Se desabilitar seleção de provedor, limpamos provedor/chaves
    if (field === "habilitarSelecaoProvedor" && value === false) {
      setFormData((prev) => ({
        ...prev,
        habilitarSelecaoProvedor: false,
        provedorPagamento: "",
        apiKey: "",
        apiSecret: "",
        webhookUrl: "",
        ambiente: "sandbox",
      }));
    }
  };

  const uploadLogo = async (file: File) => {
    try {
      setIsUploadingLogo(true);

      const ext = (file.name.split(".").pop() || "png").toLowerCase();
      const safeExt = ["png", "jpg", "jpeg", "webp", "svg"].includes(ext) ? ext : "png";
      const filePath = `escolas/${Date.now()}-${Math.random().toString(16).slice(2)}.${safeExt}`;

      const { error: uploadError } = await supabase.storage.from("public").upload(filePath, file, {
        upsert: false,
        cacheControl: "3600",
        contentType: file.type || undefined,
      });

      if (uploadError) {
        console.error(uploadError);
        toast.error("Não foi possível enviar a logo. Tente novamente.");
        return;
      }

      const { data } = supabase.storage.from("public").getPublicUrl(filePath);
      const publicUrl = data?.publicUrl;

      if (!publicUrl) {
        toast.error("Upload concluído, mas não foi possível obter a URL pública.");
        return;
      }

      setFormData((prev) => ({ ...prev, logoUrl: publicUrl }));
      toast.success("Logo enviada e vinculada à escola!");
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleFotoUploadTemp = async (file: File) => {
    const maxBytes = 2 * 1024 * 1024;
    if (file.size > maxBytes) {
      toast.error("A foto deve ter no máximo 2MB (armazenamento temporário).");
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      localStorage.setItem(TEMP_FOTO_KEY, dataUrl);
      setFormData((prev) => ({ ...prev, fotoBase64: dataUrl }));
      toast.success("Foto carregada (temporária)!");
    } catch (e) {
      console.error(e);
      toast.error("Não foi possível ler a foto.");
    }
  };

  const clearFotoTemp = () => {
    localStorage.removeItem(TEMP_FOTO_KEY);
    setFormData((prev) => ({ ...prev, fotoBase64: "" }));
    toast.message("Foto removida (temporária)");
  };

  const toggleModulo = (id: string) => {
    setFormData((prev) => {
      const current = new Set(prev.modulos || []);
      if (current.has(id)) current.delete(id);
      else current.add(id);
      return { ...prev, modulos: Array.from(current) };
    });
  };

  const handleGenerateCredentials = () => {
    setFormData((prev) => ({
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
        // Tudo é opcional nesta aba – provedor e chaves podem ser configurados depois
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

  const handleSave = async () => {
    // Validar todas as abas
    const tabs = ["dados", "acesso", "cobranca", "pagamento"];
    for (const tab of tabs) {
      if (!validateTab(tab)) {
        setActiveTab(tab);
        return;
      }
    }

    setIsCreating(true);

    try {
      // 1) Criar usuário no Supabase Auth via edge function
      const response = await supabase.functions.invoke("create-school-user", {
        body: {
          email: formData.emailDiretor,
          password: formData.senhaProvisoria,
          name: formData.nome,
          phone: formData.telefoneDiretor || null,
        },
      });

      const fnData = response.data;
      const fnError = response.error;

      if (fnError || fnData?.error) {
        // When edge function returns non-2xx, supabase-js puts the parsed body in fnError.context
        let errorMsg = fnData?.error || "Erro desconhecido";
        if (fnError && !fnData?.error) {
          try {
            const ctx = (fnError as any)?.context;
            if (ctx?.json) {
              const parsed = await ctx.json();
              errorMsg = parsed?.error || fnError.message || errorMsg;
            } else {
              errorMsg = fnError.message || errorMsg;
            }
          } catch {
            errorMsg = fnError.message || errorMsg;
          }
        }
        console.error("Edge function error:", fnError, fnData);
        if (errorMsg.includes("já está cadastrado") || errorMsg.includes("already been registered")) {
          toast.error("Este e-mail já está cadastrado no sistema. Use outro e-mail para o diretor.");
        } else {
          toast.error(errorMsg);
        }
        setIsCreating(false);
        return;
      }

      const escolaSlug = formData.nome
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      const escolaId = fnData?.userId || Date.now().toString();
      const linkAcesso = `${window.location.origin}/login?escola=${escolaSlug}-${escolaId}`;

      // 2) Módulos herdados
      // Regra: se o ADM não selecionou nenhum, a escola herda automaticamente os módulos ativos (default).
      const modulosSelecionados = (formData.modulos || []).length > 0 ? formData.modulos : DEFAULT_MODULOS_ESCOLA;

      const novaEscola: Escola = {
        id: escolaId,
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
        linkAcesso,
        modulos: modulosSelecionados,
        emailDiretor: formData.emailDiretor,
        logoUrl: (formData.logoUrl || "").trim() || undefined,
      };

      // Importante: aguardar o onSave persistir no banco antes de fechar/resetar
      await onSave(novaEscola);

      toast.success("Escola cadastrada com sucesso! Conteúdo padrão criado.", {
        description: `O diretor pode acessar com o e-mail ${formData.emailDiretor}`,
      });

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
        logoUrl: "",
        loginProvisorio: "",
        senhaProvisoria: "",
        valorImplantacao: "",
        descricaoCobranca: "Taxa de implantação do sistema i ESCOLAS",
        dataVencimento: "",
        modulos: [],
        integrarPagamentos: true,
        provedorPagamento: "",
        apiKey: "",
        apiSecret: "",
        webhookUrl: "",
        ambiente: "sandbox",
        habilitarSelecaoProvedor: false,
        fotoBase64: "",
      });
      // Foto é temporária e global; não limpamos automaticamente ao salvar.
      setActiveTab("dados");
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating school:", error);
      toast.error("Erro inesperado ao cadastrar escola. Tente novamente.");
    } finally {
      setIsCreating(false);
    }
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
          <DialogDescription>Complete todas as etapas para cadastrar a escola na plataforma.</DialogDescription>
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
            {/* Foto (temporária em localStorage) */}
            <div className="space-y-2">
              <Label>Foto (Aluno/Professor/Responsável/Funcionário) - temporária</Label>
              <div className="flex flex-wrap items-center gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-full border bg-muted/20">
                  {formData.fotoBase64 ? (
                    <img src={formData.fotoBase64} alt="Prévia da foto" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">Sem foto</div>
                  )}
                </div>

                <input
                  ref={fotoInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    await handleFotoUploadTemp(file);
                    e.currentTarget.value = "";
                  }}
                />

                <Button type="button" variant="outline" onClick={() => fotoInputRef.current?.click()}>
                  Enviar foto
                </Button>

                {formData.fotoBase64 && (
                  <Button type="button" variant="ghost" onClick={clearFotoTemp}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remover
                  </Button>
                )}

                <p className="text-xs text-muted-foreground">
                  VibeCoding: por enquanto salvamos só no <code>localStorage</code> (chave: <code>{TEMP_FOTO_KEY}</code>).
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Escola *</Label>
                <Input id="nome" value={formData.nome} onChange={(e) => handleInputChange("nome", e.target.value)} placeholder="Ex: Colégio São Paulo" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ *</Label>
                <Input
                  id="cnpj"
                  value={formData.cnpj}
                  onChange={(e) => handleInputChange("cnpj", formatCNPJ(e.target.value))}
                  placeholder="00.000.000/0001-00"
                  maxLength={18}
                />
              </div>
            </div>

            {/* Logo */}
            <div className="space-y-2">
              <Label>Logo da escola</Label>

              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Input
                    id="logoUrl"
                    value={formData.logoUrl}
                    onChange={(e) => handleInputChange("logoUrl", e.target.value)}
                    placeholder="Cole uma URL pública (opcional) ou envie um arquivo"
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      await uploadLogo(file);
                      // permite enviar o mesmo arquivo de novo se precisar
                      e.currentTarget.value = "";
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingLogo}
                  >
                    {isUploadingLogo && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isUploadingLogo ? "Enviando..." : "Enviar logo"}
                  </Button>
                  {(formData.logoUrl || "").trim() && (
                    <Button type="button" variant="ghost" onClick={() => handleInputChange("logoUrl", "")}>
                      Remover
                    </Button>
                  )}
                </div>

                {(formData.logoUrl || "").trim() ? (
                  <div className="flex items-center gap-3 rounded-md border bg-muted/20 p-3">
                    <img
                      src={formData.logoUrl}
                      alt={`Logo ${formData.nome || "da escola"}`}
                      className="h-12 w-12 rounded-md object-contain bg-background border"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <p className="text-xs text-muted-foreground break-all">{formData.logoUrl}</p>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Opcional: envie um arquivo (recomendado) ou cole uma URL pública da imagem (PNG/JPG/SVG).</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade *</Label>
                <Input id="cidade" value={formData.cidade} onChange={(e) => handleInputChange("cidade", e.target.value)} placeholder="São Paulo" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="uf">UF *</Label>
                <Select value={formData.uf} onValueChange={(v) => handleInputChange("uf", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {UF_OPTIONS.map((uf) => (
                      <SelectItem key={uf} value={uf}>
                        {uf}
                      </SelectItem>
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
                      <SelectItem key={porte} value={porte}>
                        {porte}
                      </SelectItem>
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
                      <SelectItem key={plano} value={plano}>
                        {plano}
                      </SelectItem>
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
                onChange={(e) => handleInputChange("telefoneDiretor", formatPhone(e.target.value))}
                placeholder="(11) 99999-9999"
                maxLength={15}
              />
            </div>

            {/* Módulos para implantação */}
            <Card className="border-dashed border-2 border-rose-200 bg-rose-50/50 dark:bg-rose-950/20">
              <CardContent className="p-4 space-y-3">
                <div>
                  <p className="font-medium text-rose-700 dark:text-rose-400">Módulos da Implantação</p>
                  <p className="text-sm text-rose-600/80 dark:text-rose-400/80">Selecione os módulos que ficarão ativos para esta escola.</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Se nenhum for selecionado, a escola herdará automaticamente os módulos ativos padrão (inclui Importação/Migração).
                  </p>
                </div>
                {(() => {
                  const categorias = [...new Set(MODULOS_OPTIONS.map(m => m.categoria))];
                  return categorias.map((cat) => (
                    <div key={cat} className="space-y-1.5">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{cat}</p>
                      <div className="flex flex-wrap gap-2">
                        {MODULOS_OPTIONS.filter(m => m.categoria === cat).map((m) => {
                          const active = formData.modulos.includes(m.id);
                          return (
                            <Tooltip key={m.id}>
                              <TooltipTrigger asChild>
                                <button type="button" onClick={() => toggleModulo(m.id)} className="focus:outline-none">
                                  <Badge variant={active ? "default" : "secondary"} className={cn(active ? "bg-rose-500 hover:bg-rose-600" : "", "gap-1")}>
                                    {m.label}
                                    {m.planoMinimo && <Sparkles className="h-3 w-3" />}
                                  </Badge>
                                </button>
                              </TooltipTrigger>
                              {m.planoMinimo && (
                                <TooltipContent>
                                  <p>Opcional — requer plano {m.planoMinimo} ou superior</p>
                                </TooltipContent>
                              )}
                            </Tooltip>
                          );
                        })}
                      </div>
                    </div>
                  ));
                })()}
              </CardContent>
            </Card>
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
              <Button type="button" variant="outline" onClick={handleGenerateCredentials} className="border-rose-300 text-rose-600 hover:bg-rose-50">
                <Key className="mr-2 h-4 w-4" />
                Gerar Novas Credenciais
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="loginProvisorio">Login (E-mail do Diretor)</Label>
                <div className="flex gap-2">
                  <Input
                    id="loginProvisorio"
                    value={formData.emailDiretor || formData.loginProvisorio}
                    disabled
                    placeholder="Definido pelo e-mail do diretor"
                    className="flex-1 bg-muted"
                  />
                  <Button type="button" size="icon" variant="outline" onClick={() => copyToClipboard(formData.emailDiretor, "Login")}>
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
                  <Button type="button" size="icon" variant="outline" onClick={() => copyToClipboard(formData.senhaProvisoria, "Senha")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Link de Acesso Preview */}
            {formData.nome && (
              <Card className="border border-primary/20 bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Link2 className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">Link de Acesso da Escola</p>
                      <p className="text-xs text-muted-foreground mb-2">Este link será gerado automaticamente ao finalizar o cadastro.</p>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-muted px-2 py-1 rounded break-all flex-1">
                          {window.location.origin}/login?escola=
                          {formData.nome
                            .toLowerCase()
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "")
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/^-|-$/g, "")}
                          -preview
                        </code>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {formData.emailDiretor && formData.senhaProvisoria && (
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-2">Resumo das credenciais de acesso:</p>
                  <div className="font-mono text-sm bg-background p-3 rounded-md">
                    <p>
                      <strong>E-mail (Login):</strong> {formData.emailDiretor}
                    </p>
                    <p>
                      <strong>Senha:</strong> {showPassword ? formData.senhaProvisoria : "••••••••••••"}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">⚠️ Estas credenciais serão criadas no sistema. O diretor poderá fazer login na página de acesso.</p>
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
                <Input id="dataVencimento" type="date" value={formData.dataVencimento} onChange={(e) => handleInputChange("dataVencimento", e.target.value)} />
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
                        R$ {Number(formData.valorImplantacao).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                      {formData.dataVencimento && (
                        <p className="text-sm text-muted-foreground">Venc: {new Date(formData.dataVencimento + "T00:00:00").toLocaleDateString("pt-BR")}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab: Configuração de Pagamentos */}
          <TabsContent value="pagamento" className="space-y-4">
            <Card className="border-dashed border-2 border-rose-200 bg-rose-50/50 dark:bg-rose-950/20">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-rose-700 dark:text-rose-400">Integração com API de pagamento</p>
                    <p className="text-sm text-rose-600/80 dark:text-rose-400/80">Se preferir, você pode cadastrar a escola sem configurar cobrança/pagamentos agora.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">{formData.integrarPagamentos ? "Ativo" : "Não incluir"}</Label>
                    <Switch checked={formData.integrarPagamentos} onCheckedChange={(v) => handleInputChange("integrarPagamentos", v)} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {formData.integrarPagamentos ? (
              <>
                <Card className="border border-border bg-muted/20">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <Label className="text-sm">Seleção do provedor</Label>
                        <p className="text-sm text-muted-foreground">Selecione o provedor que a escola usará para cobrar os alunos.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-sm">{formData.habilitarSelecaoProvedor ? "Habilitado" : "Desabilitado"}</Label>
                        <Switch checked={formData.habilitarSelecaoProvedor} onCheckedChange={(v) => handleInputChange("habilitarSelecaoProvedor", v)} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-3">
                  <Label>
                    Provedor de Pagamento <span className="text-muted-foreground">(opcional)</span>
                  </Label>
                  <div className={cn("grid grid-cols-2 md:grid-cols-3 gap-3", !formData.habilitarSelecaoProvedor && "opacity-60")}>
                    {paymentProviders.map((provider) => (
                      <button
                        key={provider.id}
                        type="button"
                        disabled={!formData.habilitarSelecaoProvedor}
                        onClick={() => handleInputChange("provedorPagamento", provider.id)}
                        className={cn(
                          "relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
                          !formData.habilitarSelecaoProvedor ? "cursor-not-allowed" : "hover:border-rose-300 hover:bg-rose-50/50 dark:hover:bg-rose-950/20",
                          formData.provedorPagamento === provider.id ? "border-rose-500 bg-rose-50 dark:bg-rose-950/30" : "border-border"
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
                        <span className="font-medium">Configurar API - {paymentProviders.find((p) => p.id === formData.provedorPagamento)?.name}</span>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="apiKey">
                            Chave da API (Public Key) <span className="text-muted-foreground">(opcional)</span>
                          </Label>
                          <Input id="apiKey" value={formData.apiKey} onChange={(e) => handleInputChange("apiKey", e.target.value)} placeholder="pk_live_..." className="font-mono text-sm" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="apiSecret">
                            Chave Secreta (Secret Key) <span className="text-muted-foreground">(opcional)</span>
                          </Label>
                          <div className="relative">
                            <Input
                              id="apiSecret"
                              type={showApiSecret ? "text" : "password"}
                              value={formData.apiSecret}
                              onChange={(e) => handleInputChange("apiSecret", e.target.value)}
                              placeholder="sk_live_..."
                              className="font-mono text-sm pr-10"
                            />
                            <Button type="button" size="icon" variant="ghost" className="absolute right-0 top-0 h-full px-3" onClick={() => setShowApiSecret(!showApiSecret)}>
                              {showApiSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground">Dica: você pode deixar as chaves em branco e configurar depois.</p>

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
                        <Badge variant={formData.ambiente === "producao" ? "default" : "secondary"}>{formData.ambiente === "producao" ? "PRODUÇÃO" : "SANDBOX"}</Badge>
                        <span className="text-sm text-muted-foreground">{formData.ambiente === "producao" ? "As transações serão reais" : "Ambiente de testes - sem cobrança real"}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card className="border border-border bg-muted/30">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Pagamentos não serão configurados no cadastro. Você poderá ativar e configurar depois.</p>
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
            <Button onClick={handleSave} disabled={isCreating} className="bg-rose-500 hover:bg-rose-600 w-full sm:w-auto">
              {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isCreating ? "Criando..." : "Cadastrar Escola"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

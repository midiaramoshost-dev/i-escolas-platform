import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Mail,
  Phone,
  User,
  MapPin,
  FileText,
  CreditCard,
  QrCode,
  Loader2,
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  Lock,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

const UF_LIST = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA",
  "PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

const schoolSchema = z.object({
  escola_nome: z.string().min(3, "Nome da escola deve ter pelo menos 3 caracteres").max(200),
  cnpj: z.string().min(14, "CNPJ inválido").max(18),
  cidade: z.string().min(2, "Cidade obrigatória").max(100),
  uf: z.string().length(2, "Selecione o estado"),
  email_diretor: z.string().email("E-mail inválido").max(255),
  nome_diretor: z.string().min(2, "Nome obrigatório").max(100),
  telefone: z.string().optional(),
});

interface SchoolOnboardingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planId: string;
  planName: string;
  planPrice: number;
}

type Step = "form" | "payment" | "processing" | "pix" | "success";

interface Credentials {
  email: string;
  password: string;
  link_acesso: string;
}

export function SchoolOnboardingDialog({
  open,
  onOpenChange,
  planId,
  planName,
  planPrice,
}: SchoolOnboardingDialogProps) {
  const [step, setStep] = useState<Step>("form");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [pixData, setPixData] = useState<{ qr_code: string; qr_code_base64: string; payment_id: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);

  const [formData, setFormData] = useState({
    escola_nome: "",
    cnpj: "",
    cidade: "",
    uf: "",
    email_diretor: "",
    nome_diretor: "",
    telefone: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const formatCNPJ = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 14);
    return digits
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  const handleSubmitForm = () => {
    const validation = schoolSchema.safeParse(formData);
    if (!validation.success) {
      toast({
        variant: "destructive",
        title: "Dados inválidos",
        description: validation.error.errors[0].message,
      });
      return;
    }
    setStep("payment");
  };

  const handlePayment = async (method: "pix" | "card") => {
    setIsLoading(true);

    try {
      // If plan is free (price = 0), skip payment and go straight to provisioning
      if (planPrice === 0) {
        await provisionSchool(null);
        return;
      }

      const { data, error } = await supabase.functions.invoke("create-mercadopago-payment", {
        body: {
          amount: planPrice,
          description: `Assinatura ${planName} - ${formData.escola_nome}`,
          payer_email: formData.email_diretor,
          payment_method: method,
        },
      });

      if (error) throw error;

      if (method === "pix") {
        setPixData({
          qr_code: data.pix_copy_paste || data.pix_qr_code,
          qr_code_base64: data.pix_qr_code_base64,
          payment_id: data.payment_id,
        });
        setStep("pix");
        setIsLoading(false);
      } else if (method === "card") {
        // Redirect to Mercado Pago checkout
        // Store form data in sessionStorage for after redirect
        sessionStorage.setItem("onboarding_data", JSON.stringify({ ...formData, plano_id: planId }));
        const checkoutUrl = data.init_point || data.sandbox_init_point;
        if (checkoutUrl) {
          window.open(checkoutUrl, "_blank");
          toast({
            title: "Pagamento via cartão",
            description: "Complete o pagamento na janela do Mercado Pago. Após aprovação, retorne aqui.",
          });
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        variant: "destructive",
        title: "Erro no pagamento",
        description: "Não foi possível processar o pagamento. Tente novamente.",
      });
      setIsLoading(false);
    }
  };

  const handleConfirmPixPayment = async () => {
    await provisionSchool(pixData?.payment_id || null);
  };

  const provisionSchool = async (paymentId: string | null) => {
    setStep("processing");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("onboard-school", {
        body: {
          escola_nome: formData.escola_nome,
          cnpj: formData.cnpj.replace(/\D/g, ""),
          cidade: formData.cidade,
          uf: formData.uf,
          email_diretor: formData.email_diretor,
          nome_diretor: formData.nome_diretor,
          telefone: formData.telefone,
          plano_id: planId,
          payment_id: paymentId,
        },
      });

      if (error) throw error;

      if (data.success) {
        setCredentials(data.credentials);
        setStep("success");
      } else {
        throw new Error(data.error || "Erro ao provisionar escola");
      }
    } catch (error) {
      console.error("Provisioning error:", error);
      toast({
        variant: "destructive",
        title: "Erro ao criar conta",
        description: error instanceof Error ? error.message : "Tente novamente.",
      });
      setStep("payment");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCredentials = () => {
    if (!credentials) return;
    const text = `Dados de acesso i ESCOLAS:\nE-mail: ${credentials.email}\nSenha: ${credentials.password}\nLink: ${window.location.origin}${credentials.link_acesso}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Credenciais copiadas!" });
  };

  const handleCopyPix = () => {
    if (!pixData?.qr_code) return;
    navigator.clipboard.writeText(pixData.qr_code);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
    toast({ title: "Código Pix copiado!" });
  };

  const handleClose = () => {
    if (step !== "processing") {
      setStep("form");
      setFormData({ escola_nome: "", cnpj: "", cidade: "", uf: "", email_diretor: "", nome_diretor: "", telefone: "" });
      setCredentials(null);
      setPixData(null);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step === "form" && (
              <>
                <Building2 className="h-5 w-5 text-primary" />
                Cadastrar Escola
              </>
            )}
            {step === "payment" && (
              <>
                <CreditCard className="h-5 w-5 text-primary" />
                Pagamento
              </>
            )}
            {step === "pix" && (
              <>
                <QrCode className="h-5 w-5 text-primary" />
                Pague com Pix
              </>
            )}
            {step === "processing" && "Processando..."}
            {step === "success" && (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Escola Criada!
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {step === "form" && `Plano ${planName} — ${planPrice > 0 ? formatCurrency(planPrice) + "/mês" : "Gratuito"}`}
            {step === "payment" && "Escolha a forma de pagamento"}
            {step === "pix" && "Escaneie o QR Code ou copie o código Pix"}
            {step === "processing" && "Estamos criando sua conta..."}
            {step === "success" && "Anote seus dados de acesso abaixo"}
          </DialogDescription>
        </DialogHeader>

        {/* STEP: FORM */}
        {step === "form" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome da Escola *</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Ex: Colégio São Paulo"
                  className="pl-10"
                  value={formData.escola_nome}
                  onChange={(e) => handleChange("escola_nome", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>CNPJ *</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="00.000.000/0000-00"
                  className="pl-10"
                  value={formData.cnpj}
                  onChange={(e) => handleChange("cnpj", formatCNPJ(e.target.value))}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-2">
                <Label>Cidade *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="São Paulo"
                    className="pl-10"
                    value={formData.cidade}
                    onChange={(e) => handleChange("cidade", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>UF *</Label>
                <Select value={formData.uf} onValueChange={(v) => handleChange("uf", v)}>
                  <SelectTrigger><SelectValue placeholder="UF" /></SelectTrigger>
                  <SelectContent>
                    {UF_LIST.map((uf) => (
                      <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Nome do Diretor(a) *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nome completo"
                  className="pl-10"
                  value={formData.nome_diretor}
                  onChange={(e) => handleChange("nome_diretor", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>E-mail do Diretor(a) *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="diretor@escola.com.br"
                  className="pl-10"
                  value={formData.email_diretor}
                  onChange={(e) => handleChange("email_diretor", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Telefone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="(00) 00000-0000"
                  className="pl-10"
                  value={formData.telefone}
                  onChange={(e) => handleChange("telefone", formatPhone(e.target.value))}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={handleClose}>Cancelar</Button>
              <Button onClick={handleSubmitForm}>
                Continuar <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP: PAYMENT */}
        {step === "payment" && (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Plano</p>
                    <p className="font-semibold">{planName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Valor</p>
                    <p className="text-2xl font-bold text-primary">
                      {planPrice > 0 ? formatCurrency(planPrice) : "Grátis"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-3">
              <Button
                variant="outline"
                className="h-16 justify-start gap-4"
                onClick={() => handlePayment("pix")}
                disabled={isLoading}
              >
                <QrCode className="h-6 w-6 text-primary" />
                <div className="text-left">
                  <p className="font-medium">Pix</p>
                  <p className="text-xs text-muted-foreground">Aprovação instantânea</p>
                </div>
                {isLoading && <Loader2 className="h-4 w-4 animate-spin ml-auto" />}
              </Button>

              <Button
                variant="outline"
                className="h-16 justify-start gap-4"
                onClick={() => handlePayment("card")}
                disabled={isLoading}
              >
                <CreditCard className="h-6 w-6 text-primary" />
                <div className="text-left">
                  <p className="font-medium">Cartão de Crédito</p>
                  <p className="text-xs text-muted-foreground">Até 12x sem juros</p>
                </div>
                {isLoading && <Loader2 className="h-4 w-4 animate-spin ml-auto" />}
              </Button>
            </div>

            <Button variant="ghost" className="w-full" onClick={() => setStep("form")}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
            </Button>
          </div>
        )}

        {/* STEP: PIX */}
        {step === "pix" && pixData && (
          <div className="space-y-4 text-center">
            {pixData.qr_code_base64 && (
              <div className="flex justify-center">
                <img
                  src={`data:image/png;base64,${pixData.qr_code_base64}`}
                  alt="QR Code Pix"
                  className="w-48 h-48 rounded-lg border"
                />
              </div>
            )}

            {pixData.qr_code && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Código Pix (copia e cola)</Label>
                <div className="flex gap-2">
                  <Input
                    value={pixData.qr_code}
                    readOnly
                    className="text-xs font-mono"
                  />
                  <Button size="icon" variant="outline" onClick={handleCopyPix}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                {copiedPix && <p className="text-xs text-green-500">Copiado!</p>}
              </div>
            )}

            <p className="text-sm text-muted-foreground">
              Após o pagamento, clique em "Confirmar Pagamento" para liberar o acesso.
            </p>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setStep("payment")}>
                Voltar
              </Button>
              <Button className="flex-1" onClick={handleConfirmPixPayment} disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirmar Pagamento"}
              </Button>
            </div>
          </div>
        )}

        {/* STEP: PROCESSING */}
        {step === "processing" && (
          <div className="py-12 text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <p className="text-lg font-medium">Criando sua escola...</p>
            <p className="text-sm text-muted-foreground">
              Estamos configurando o painel, criando seu acesso e ativando o plano.
            </p>
          </div>
        )}

        {/* STEP: SUCCESS */}
        {step === "success" && credentials && (
          <div className="space-y-5">
            <div className="text-center">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-3" />
              <p className="text-lg font-semibold text-green-600">Parabéns!</p>
              <p className="text-sm text-muted-foreground">Sua escola foi criada com sucesso.</p>
            </div>

            <Card className="bg-muted/50 border-green-500/30">
              <CardContent className="p-4 space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Dados de Acesso
                </h4>

                <div className="space-y-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">E-mail</Label>
                    <p className="font-mono text-sm">{credentials.email}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Senha</Label>
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-sm">
                        {showPassword ? credentials.password : "••••••••••"}
                      </p>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Link de Acesso</Label>
                    <p className="font-mono text-xs break-all">
                      {window.location.origin}{credentials.link_acesso}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={handleCopyCredentials}>
                <Copy className="h-4 w-4 mr-1" />
                {copied ? "Copiado!" : "Copiar Dados"}
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  handleClose();
                  window.location.href = "/login";
                }}
              >
                Acessar Painel
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              ⚠️ Guarde estas credenciais em local seguro. Você pode alterar a senha após o primeiro acesso.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { School, Mail, Lock, Eye, EyeOff, User, Phone, ArrowLeft, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useReferral } from "@/contexts/ReferralContext";
import { useToast } from "@/hooks/use-toast";

export default function Register() {
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get('ref');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "" as UserRole | "",
    acceptTerms: false,
    referralCode: refCode || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();
  const { applyReferralCode } = useReferral();
  const { toast } = useToast();

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.acceptTerms) {
      toast({
        variant: "destructive",
        title: "Termos obrigatórios",
        description: "Você precisa aceitar os termos de uso para continuar.",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Senhas não conferem",
        description: "A senha e a confirmação precisam ser iguais.",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        variant: "destructive",
        title: "Senha muito curta",
        description: "A senha precisa ter pelo menos 6 caracteres.",
      });
      return;
    }

    if (!formData.role) {
      toast({
        variant: "destructive",
        title: "Perfil obrigatório",
        description: "Selecione um tipo de perfil para continuar.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const success = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role as UserRole,
        phone: formData.phone,
      });

      if (success) {
        // Apply referral code if provided
        if (formData.referralCode) {
          // We need to apply after login, so store the code
          localStorage.setItem('pending_referral_code', formData.referralCode);
        }
        
        toast({
          title: "Conta criada com sucesso!",
          description: formData.referralCode 
            ? "Faça login para ativar sua indicação e benefícios." 
            : "Você já pode fazer login com suas credenciais.",
        });
        navigate("/login");
      } else {
        toast({
          variant: "destructive",
          title: "Erro no cadastro",
          description: "Este e-mail já está cadastrado. Tente outro.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro no cadastro",
        description: "Ocorreu um erro. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/30">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-brand">
            <School className="h-7 w-7 text-white" />
          </div>
          <span className="text-2xl font-bold">i ESCOLAS</span>
        </div>

        <Card className="shadow-soft border-0">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Criar conta</CardTitle>
            <CardDescription>
              Preencha os dados abaixo para se cadastrar
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleRegister}>
            <CardContent className="space-y-4">
              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome completo"
                    className="pl-10"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com.br"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Telefone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone (opcional)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(00) 00000-0000"
                    className="pl-10"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </div>
              </div>

              {/* Código de Indicação */}
              <div className="space-y-2">
                <Label htmlFor="referralCode" className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-primary" />
                  Código de indicação (opcional)
                </Label>
                <Input
                  id="referralCode"
                  type="text"
                  placeholder="IESC-XXXXXX"
                  className="font-mono uppercase"
                  value={formData.referralCode}
                  onChange={(e) => handleChange("referralCode", e.target.value.toUpperCase())}
                />
                {formData.referralCode && (
                  <p className="text-xs text-muted-foreground">
                    Você foi indicado! O código será validado após o cadastro.
                  </p>
                )}
              </div>

              {/* Tipo de Perfil */}
              <div className="space-y-2">
                <Label htmlFor="role">Tipo de perfil</Label>
                <Select value={formData.role} onValueChange={(value) => handleChange("role", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione seu perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="escola">Escola / Direção</SelectItem>
                    <SelectItem value="aluno">Aluno</SelectItem>
                    <SelectItem value="responsavel">Responsável</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 6 caracteres"
                    className="pl-10 pr-10"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Confirmar Senha */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Repita a senha"
                    className="pl-10 pr-10"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Termos */}
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => handleChange("acceptTerms", checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm font-normal leading-relaxed">
                  Li e aceito os{" "}
                  <Link to="/termos" className="text-primary hover:underline">
                    Termos de Uso
                  </Link>{" "}
                  e a{" "}
                  <Link to="/privacidade" className="text-primary hover:underline">
                    Política de Privacidade
                  </Link>
                </Label>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Criando conta..." : "Criar conta"}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Já tem uma conta?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Faça login
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>

        <Button
          variant="ghost"
          className="w-full"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para o início
        </Button>
      </div>
    </div>
  );
}

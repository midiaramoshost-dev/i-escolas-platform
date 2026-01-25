import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { School, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const { toast } = useToast();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Senhas não conferem",
        description: "A senha e a confirmação precisam ser iguais.",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Senha muito curta",
        description: "A senha precisa ter pelo menos 6 caracteres.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const success = await resetPassword(email || "", token || "", password);

      if (success) {
        setResetSuccess(true);
        toast({
          title: "Senha alterada!",
          description: "Sua senha foi redefinida com sucesso.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Link inválido ou expirado",
          description: "Solicite um novo link de recuperação.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/30">
        <div className="w-full max-w-md space-y-6">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-brand">
              <School className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold">i ESCOLAS</span>
          </div>

          <Card className="shadow-soft border-0">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">Link inválido</CardTitle>
              <CardDescription>
                Este link de recuperação é inválido ou expirou.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-col gap-3">
              <Button
                className="w-full"
                onClick={() => navigate("/recuperar-senha")}
              >
                Solicitar novo link
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/login")}
              >
                Voltar ao login
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  if (resetSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/30">
        <div className="w-full max-w-md space-y-6">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-brand">
              <School className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold">i ESCOLAS</span>
          </div>

          <Card className="shadow-soft border-0">
            <CardHeader className="space-y-1 text-center">
              <div className="flex justify-center mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">Senha alterada!</CardTitle>
              <CardDescription className="text-base">
                Sua senha foi redefinida com sucesso. Agora você pode fazer login com a nova senha.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                className="w-full"
                size="lg"
                onClick={() => navigate("/login")}
              >
                Ir para o login
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/30">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-brand">
            <School className="h-7 w-7 text-white" />
          </div>
          <span className="text-2xl font-bold">i ESCOLAS</span>
        </div>

        <Card className="shadow-soft border-0">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Nova senha</CardTitle>
            <CardDescription>
              Digite sua nova senha para a conta:
              <br />
              <span className="font-medium text-foreground">{email}</span>
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleReset}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nova senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 6 caracteres"
                    className="pl-10 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Repita a nova senha"
                    className="pl-10 pr-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Alterando..." : "Alterar senha"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

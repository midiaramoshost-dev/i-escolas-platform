import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { School, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const emailSchema = z.string().email('E-mail inválido');

export default function RecoverPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();
  const { requestPasswordReset } = useAuth();
  const { toast } = useToast();

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    const validation = emailSchema.safeParse(email);
    if (!validation.success) {
      toast({
        variant: "destructive",
        title: "E-mail inválido",
        description: "Digite um endereço de e-mail válido.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const success = await requestPasswordReset(email);

      if (success) {
        setEmailSent(true);
        toast({
          title: "E-mail enviado!",
          description: "Verifique sua caixa de entrada para redefinir a senha.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao enviar",
          description: "Não foi possível enviar o e-mail. Tente novamente.",
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

  if (emailSent) {
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
              <div className="flex justify-center mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">E-mail enviado!</CardTitle>
              <CardDescription className="text-base">
                Enviamos um link de recuperação para:
              </CardDescription>
              <p className="font-medium text-foreground">{email}</p>
            </CardHeader>
            <CardContent className="space-y-4 text-center text-muted-foreground">
              <p className="text-sm">
                Verifique sua caixa de entrada e spam. O link expira em 1 hora.
              </p>
              <div className="bg-muted/50 rounded-lg p-4 text-sm">
                <p className="font-medium text-foreground mb-2">Não recebeu o e-mail?</p>
                <ul className="text-left space-y-1">
                  <li>• Verifique a pasta de spam</li>
                  <li>• Confirme se o e-mail está correto</li>
                  <li>• Aguarde alguns minutos</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setEmailSent(false)}
              >
                Tentar outro e-mail
              </Button>
              <Button
                className="w-full"
                onClick={() => navigate("/login")}
              >
                Voltar para o login
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
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-brand">
            <School className="h-7 w-7 text-white" />
          </div>
          <span className="text-2xl font-bold">i ESCOLAS</span>
        </div>

        <Card className="shadow-soft border-0">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Recuperar senha</CardTitle>
            <CardDescription>
              Digite seu e-mail para receber o link de recuperação
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleRecover}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail cadastrado</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com.br"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Enviando..." : "Enviar link de recuperação"}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Lembrou a senha?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Voltar ao login
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

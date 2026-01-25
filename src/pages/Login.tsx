import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { School, Mail, Lock, Eye, EyeOff, Users, GraduationCap, Shield, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const demoAccounts = [
  { role: 'admin' as UserRole, email: 'admin@iescolas.com', password: 'admin123', label: 'Admin Master', icon: Shield, color: 'from-rose-500 to-red-600' },
  { role: 'escola' as UserRole, email: 'diretor@escola.com', password: 'escola123', label: 'Escola', icon: Building2, color: 'from-blue-500 to-indigo-600' },
  { role: 'aluno' as UserRole, email: 'aluno@escola.com', password: 'aluno123', label: 'Aluno', icon: GraduationCap, color: 'from-emerald-500 to-teal-600' },
  { role: 'responsavel' as UserRole, email: 'responsavel@email.com', password: 'resp123', label: 'Responsável', icon: Users, color: 'from-violet-500 to-purple-600' },
];

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, getRoleRedirectPath } = useAuth();
  const { toast } = useToast();

  const from = location.state?.from?.pathname || null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await login(email, password);
    
    if (success) {
      toast({
        title: "Login realizado com sucesso!",
        description: "Redirecionando para o painel...",
      });
      
      // Get the user role from the mock users to redirect
      const mockUsers: Record<string, UserRole> = {
        'admin@iescolas.com': 'admin',
        'diretor@escola.com': 'escola',
        'aluno@escola.com': 'aluno',
        'responsavel@email.com': 'responsavel',
      };
      
      const userRole = mockUsers[email.toLowerCase()];
      const redirectPath = from || getRoleRedirectPath(userRole);
      navigate(redirectPath, { replace: true });
    } else {
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: "E-mail ou senha incorretos. Tente novamente.",
      });
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    
    const success = await login(demoEmail, demoPassword);
    
    if (success) {
      toast({
        title: "Login demo realizado!",
        description: "Redirecionando...",
      });
      
      const mockUsers: Record<string, UserRole> = {
        'admin@iescolas.com': 'admin',
        'diretor@escola.com': 'escola',
        'aluno@escola.com': 'aluno',
        'responsavel@email.com': 'responsavel',
      };
      
      const userRole = mockUsers[demoEmail.toLowerCase()];
      navigate(getRoleRedirectPath(userRole), { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Brand */}
      <div className="hidden lg:flex lg:w-1/2 gradient-brand relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
              <School className="h-7 w-7" />
            </div>
            <span className="text-2xl font-bold">i ESCOLAS</span>
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl font-bold leading-tight">
              A escola ensina.
              <br />
              <span className="text-white/80">O i ESCOLAS cuida do resto.</span>
            </h1>
            <p className="text-xl text-white/70 max-w-md">
              Plataforma completa de gestão escolar para escolas de educação
              infantil, fundamental e médio.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-8">
              <div>
                <p className="text-3xl font-bold">500+</p>
                <p className="text-white/70">Escolas</p>
              </div>
              <div>
                <p className="text-3xl font-bold">150k+</p>
                <p className="text-white/70">Alunos</p>
              </div>
              <div>
                <p className="text-3xl font-bold">50+</p>
                <p className="text-white/70">Cidades</p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-white/5" />
        <div className="absolute top-20 -right-10 h-40 w-40 rounded-full bg-white/5" />
      </div>

      {/* Right Side - Login Form */}
      <div className="flex flex-1 items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-brand">
              <School className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold">i ESCOLAS</span>
          </div>

          <Card className="shadow-soft border-0">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">
                Bem-vindo de volta
              </CardTitle>
              <CardDescription>
                Entre com suas credenciais para acessar o sistema
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
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
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Senha</Label>
                    <Link
                      to="/recuperar-senha"
                      className="text-sm text-primary hover:underline"
                    >
                      Esqueceu a senha?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
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
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember" className="text-sm font-normal">
                    Lembrar de mim
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
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
                <p className="text-sm text-center text-muted-foreground">
                  Não tem uma conta?{" "}
                  <Link to="/contato" className="text-primary hover:underline">
                    Fale conosco
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>

          {/* Demo Accounts */}
          <Card className="border-dashed">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Acesso Demo
              </CardTitle>
              <CardDescription className="text-xs">
                Clique para entrar com um perfil de demonstração
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              {demoAccounts.map((account) => (
                <Button
                  key={account.role}
                  variant="outline"
                  size="sm"
                  className="h-auto py-2 px-3 justify-start gap-2"
                  onClick={() => handleDemoLogin(account.email, account.password)}
                  disabled={isLoading}
                >
                  <div className={`flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br ${account.color}`}>
                    <account.icon className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-xs font-medium">{account.label}</span>
                </Button>
              ))}
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground">
            Ao entrar, você concorda com nossos{" "}
            <Link to="/termos" className="hover:underline">
              Termos de Uso
            </Link>{" "}
            e{" "}
            <Link to="/privacidade" className="hover:underline">
              Política de Privacidade
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";
import { AuthProvider } from "@/contexts/AuthContext";
import { PlanosProvider } from "@/contexts/PlanosContext";
import { ReferralProvider } from "@/contexts/ReferralContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { MainLayout } from "@/components/layout/MainLayout";
import { AlunoLayout } from "@/components/layout/AlunoLayout";
import { ResponsavelLayout } from "@/components/layout/ResponsavelLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RecoverPassword from "./pages/RecoverPassword";
import ResetPassword from "./pages/ResetPassword";
import Indicacao from "./pages/Indicacao";
import EscolaDashboard from "./pages/escola/Dashboard";
import Turmas from "./pages/escola/Turmas";
import Professores from "./pages/escola/Professores";
import Alunos from "./pages/escola/Alunos";
import Configuracoes from "./pages/escola/Configuracoes";
import DiarioClasse from "./pages/escola/DiarioClasse";
import Notas from "./pages/escola/Notas";
import Frequencia from "./pages/escola/Frequencia";
import Boletins from "./pages/escola/Boletins";
import EscolaFinanceiro from "./pages/escola/Financeiro";
import AlunoDashboard from "./pages/aluno/Dashboard";
import AlunoNotas from "./pages/aluno/Notas";
import AlunoFrequencia from "./pages/aluno/Frequencia";
import AlunoTarefas from "./pages/aluno/Tarefas";
import AlunoComunicados from "./pages/aluno/Comunicados";
import AlunoMateriais from "./pages/aluno/Materiais";
import AlunoPerfil from "./pages/aluno/Perfil";
import ResponsavelDashboard from "./pages/responsavel/Dashboard";
import ResponsavelNotas from "./pages/responsavel/Notas";
import ResponsavelFrequencia from "./pages/responsavel/Frequencia";
import ResponsavelTarefas from "./pages/responsavel/Tarefas";
import ResponsavelComunicados from "./pages/responsavel/Comunicados";
import ResponsavelFinanceiro from "./pages/responsavel/Financeiro";
import ResponsavelPerfil from "./pages/responsavel/Perfil";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminEscolas from "./pages/admin/Escolas";
import AdminPlanos from "./pages/admin/Planos";
import AdminFinanceiro from "./pages/admin/Financeiro";
import AdminMonitoramento from "./pages/admin/Monitoramento";
import AdminUsuarios from "./pages/admin/Usuarios";
import AdminConfiguracoes from "./pages/admin/Configuracoes";
import AdminModulos from "./pages/admin/Modulos";
import AdminLogAtividades from "./pages/admin/LogAtividades";
import NotFound from "./pages/NotFound";
import { ActivityLogProvider } from "./contexts/ActivityLogContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <PlanosProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
            <ActivityLogProvider>
            <ReferralProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Register />} />
              <Route path="/recuperar-senha" element={<RecoverPassword />} />
              <Route path="/redefinir-senha" element={<ResetPassword />} />
              <Route path="/indicacao" element={<Indicacao />} />
              
              {/* Escola Routes - Protected */}
              <Route path="/escola" element={
                <ProtectedRoute allowedRoles={['escola']}>
                  <MainLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/escola/dashboard" replace />} />
                <Route path="dashboard" element={<EscolaDashboard />} />
                <Route path="turmas" element={<Turmas />} />
                <Route path="professores" element={<Professores />} />
                <Route path="alunos" element={<Alunos />} />
                <Route path="diario" element={<DiarioClasse />} />
                <Route path="notas" element={<Notas />} />
                <Route path="frequencia" element={<Frequencia />} />
                <Route path="boletins" element={<Boletins />} />
                <Route path="financeiro" element={<EscolaFinanceiro />} />
                <Route path="configuracoes" element={<Configuracoes />} />
              </Route>

              {/* Portal do Aluno Routes - Protected */}
              <Route path="/aluno" element={
                <ProtectedRoute allowedRoles={['aluno']}>
                  <AlunoLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/aluno/dashboard" replace />} />
                <Route path="dashboard" element={<AlunoDashboard />} />
                <Route path="notas" element={<AlunoNotas />} />
                <Route path="frequencia" element={<AlunoFrequencia />} />
                <Route path="tarefas" element={<AlunoTarefas />} />
                <Route path="comunicados" element={<AlunoComunicados />} />
                <Route path="materiais" element={<AlunoMateriais />} />
                <Route path="perfil" element={<AlunoPerfil />} />
              </Route>

              {/* Portal do Responsável Routes - Protected */}
              <Route path="/responsavel" element={
                <ProtectedRoute allowedRoles={['responsavel']}>
                  <ResponsavelLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/responsavel/dashboard" replace />} />
                <Route path="dashboard" element={<ResponsavelDashboard />} />
                <Route path="notas" element={<ResponsavelNotas />} />
                <Route path="frequencia" element={<ResponsavelFrequencia />} />
                <Route path="tarefas" element={<ResponsavelTarefas />} />
                <Route path="comunicados" element={<ResponsavelComunicados />} />
                <Route path="financeiro" element={<ResponsavelFinanceiro />} />
                <Route path="perfil" element={<ResponsavelPerfil />} />
              </Route>

              {/* Admin Master Routes - Protected */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="escolas" element={<AdminEscolas />} />
                <Route path="planos" element={<AdminPlanos />} />
                <Route path="financeiro" element={<AdminFinanceiro />} />
                <Route path="monitoramento" element={<AdminMonitoramento />} />
                <Route path="usuarios" element={<AdminUsuarios />} />
                <Route path="configuracoes" element={<AdminConfiguracoes />} />
                <Route path="modulos" element={<AdminModulos />} />
                <Route path="log-atividades" element={<AdminLogAtividades />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
            </ReferralProvider>
            </ActivityLogProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </PlanosProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

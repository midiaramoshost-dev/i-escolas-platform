import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";
import { MainLayout } from "@/components/layout/MainLayout";
import { AlunoLayout } from "@/components/layout/AlunoLayout";
import { ResponsavelLayout } from "@/components/layout/ResponsavelLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import EscolaDashboard from "./pages/escola/Dashboard";
import Turmas from "./pages/escola/Turmas";
import Professores from "./pages/escola/Professores";
import Alunos from "./pages/escola/Alunos";
import Configuracoes from "./pages/escola/Configuracoes";
import DiarioClasse from "./pages/escola/DiarioClasse";
import Notas from "./pages/escola/Notas";
import Frequencia from "./pages/escola/Frequencia";
import Boletins from "./pages/escola/Boletins";
import AlunoDashboard from "./pages/aluno/Dashboard";
import AlunoNotas from "./pages/aluno/Notas";
import AlunoFrequencia from "./pages/aluno/Frequencia";
import AlunoTarefas from "./pages/aluno/Tarefas";
import AlunoComunicados from "./pages/aluno/Comunicados";
import ResponsavelDashboard from "./pages/responsavel/Dashboard";
import ResponsavelNotas from "./pages/responsavel/Notas";
import ResponsavelFrequencia from "./pages/responsavel/Frequencia";
import ResponsavelTarefas from "./pages/responsavel/Tarefas";
import ResponsavelComunicados from "./pages/responsavel/Comunicados";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            
            {/* Escola Routes */}
            <Route path="/escola" element={<MainLayout />}>
              <Route index element={<Navigate to="/escola/dashboard" replace />} />
              <Route path="dashboard" element={<EscolaDashboard />} />
              <Route path="turmas" element={<Turmas />} />
              <Route path="professores" element={<Professores />} />
              <Route path="alunos" element={<Alunos />} />
              <Route path="diario" element={<DiarioClasse />} />
              <Route path="notas" element={<Notas />} />
              <Route path="frequencia" element={<Frequencia />} />
              <Route path="boletins" element={<Boletins />} />
              <Route path="configuracoes" element={<Configuracoes />} />
            </Route>

            {/* Portal do Aluno Routes */}
            <Route path="/aluno" element={<AlunoLayout />}>
              <Route index element={<Navigate to="/aluno/dashboard" replace />} />
              <Route path="dashboard" element={<AlunoDashboard />} />
              <Route path="notas" element={<AlunoNotas />} />
              <Route path="frequencia" element={<AlunoFrequencia />} />
              <Route path="tarefas" element={<AlunoTarefas />} />
              <Route path="comunicados" element={<AlunoComunicados />} />
            </Route>

            {/* Portal do Responsável Routes */}
            <Route path="/responsavel" element={<ResponsavelLayout />}>
              <Route index element={<Navigate to="/responsavel/dashboard" replace />} />
              <Route path="dashboard" element={<ResponsavelDashboard />} />
              <Route path="notas" element={<ResponsavelNotas />} />
              <Route path="frequencia" element={<ResponsavelFrequencia />} />
              <Route path="tarefas" element={<ResponsavelTarefas />} />
              <Route path="comunicados" element={<ResponsavelComunicados />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

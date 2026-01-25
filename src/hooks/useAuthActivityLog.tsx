import { useEffect, useRef } from "react";
import { useAuth, User } from "@/contexts/AuthContext";
import { useActivityLog } from "@/contexts/ActivityLogContext";

/**
 * Hook para registrar atividades de login/logout no log de atividades.
 * Deve ser usado em um componente que está dentro de ambos os providers.
 */
export function useAuthActivityLog() {
  const { user, isAuthenticated } = useAuth();
  const { registrarAtividade, logs } = useActivityLog();
  const prevUserRef = useRef<User | null>(null);
  const hasLoggedInRef = useRef(false);

  useEffect(() => {
    const prevUser = prevUserRef.current;
    
    // Detectar login (não tinha usuário, agora tem)
    if (!prevUser && user && isAuthenticated && !hasLoggedInRef.current) {
      // Só registra login para admins
      if (user.role === 'admin') {
        registrarAtividade(
          "login",
          `Login realizado: ${user.name}`,
          `Usuário ${user.email} acessou o painel administrativo`,
          "usuario",
          user.id
        );
      }
      hasLoggedInRef.current = true;
    }
    
    // Detectar logout (tinha usuário, agora não tem mais)
    if (prevUser && !user && hasLoggedInRef.current) {
      // Registrar logout usando os dados do usuário anterior
      // Nota: Como o usuário já foi removido, precisamos usar os dados do prevUser
      // Mas como o registrarAtividade precisa de um usuário autenticado,
      // vamos registrar o logout de forma especial
      if (prevUser.role === 'admin') {
        // Salvar log de logout diretamente no localStorage
        const logoutLog = {
          id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          tipo: "logout" as const,
          descricao: `Logout realizado: ${prevUser.name}`,
          detalhes: `Usuário ${prevUser.email} saiu do painel administrativo`,
          entidade: "usuario",
          entidadeId: prevUser.id,
          usuario: {
            id: prevUser.id,
            nome: prevUser.name,
            email: prevUser.email,
          },
          dataHora: new Date().toISOString(),
        };
        
        // Adicionar ao localStorage diretamente
        try {
          const stored = localStorage.getItem("iescolas_activity_logs");
          const currentLogs = stored ? JSON.parse(stored) : [];
          const updatedLogs = [logoutLog, ...currentLogs].slice(0, 500);
          localStorage.setItem("iescolas_activity_logs", JSON.stringify(updatedLogs));
        } catch (error) {
          console.error("Erro ao registrar logout:", error);
        }
      }
      hasLoggedInRef.current = false;
    }
    
    prevUserRef.current = user;
  }, [user, isAuthenticated, registrarAtividade]);
}

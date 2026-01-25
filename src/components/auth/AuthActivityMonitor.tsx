import { ReactNode } from "react";
import { useAuthActivityLog } from "@/hooks/useAuthActivityLog";

/**
 * Componente que monitora e registra atividades de autenticação.
 * Deve envolver os componentes que precisam de monitoramento de login/logout.
 */
export function AuthActivityMonitor({ children }: { children: ReactNode }) {
  useAuthActivityLog();
  return <>{children}</>;
}

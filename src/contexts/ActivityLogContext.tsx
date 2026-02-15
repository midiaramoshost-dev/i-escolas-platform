import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";

export type ActivityType = 
  | "escola_criada"
  | "escola_editada"
  | "escola_ativada"
  | "escola_desativada"
  | "usuario_criado"
  | "usuario_editado"
  | "usuario_ativado"
  | "usuario_desativado"
  | "usuario_senha_resetada"
  | "usuario_link_gerado"
  | "plano_editado"
  | "modulo_ativado"
  | "modulo_desativado"
  | "configuracao_alterada"
  | "login"
  | "logout"
  | "outro";

export interface ActivityLog {
  id: string;
  tipo: ActivityType;
  descricao: string;
  detalhes?: string;
  entidade?: string;
  entidadeId?: string;
  usuario: {
    id: string;
    nome: string;
    email: string;
  };
  dataHora: string;
  ip?: string;
}

interface ActivityLogContextType {
  logs: ActivityLog[];
  registrarAtividade: (
    tipo: ActivityType,
    descricao: string,
    detalhes?: string,
    entidade?: string,
    entidadeId?: string
  ) => void;
  limparLogs: () => void;
  getLogsPorTipo: (tipo: ActivityType) => ActivityLog[];
  getLogsPorUsuario: (usuarioId: string) => ActivityLog[];
  getLogsPorPeriodo: (inicio: Date, fim: Date) => ActivityLog[];
}

const ActivityLogContext = createContext<ActivityLogContextType | undefined>(undefined);

const STORAGE_KEY = "iescolas_activity_logs";
const MAX_LOGS = 500; // Limite de logs armazenados

export function ActivityLogProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [logs, setLogs] = useState<ActivityLog[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as ActivityLog[];
      }
    } catch (error) {
      console.error("Erro ao carregar logs de atividade:", error);
    }
    return [];
  });

  // Persistir logs no localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    } catch (error) {
      console.error("Erro ao salvar logs de atividade:", error);
    }
  }, [logs]);

  const registrarAtividade = (
    tipo: ActivityType,
    descricao: string,
    detalhes?: string,
    entidade?: string,
    entidadeId?: string
  ) => {
    if (!user) return;

    const novoLog: ActivityLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tipo,
      descricao,
      detalhes,
      entidade,
      entidadeId,
      usuario: {
        id: user.id || "admin",
        nome: user.name || "Administrador",
        email: user.email || "admin@iescolas.com.br",
      },
      dataHora: new Date().toISOString(),
    };

    setLogs(prevLogs => {
      const novosLogs = [novoLog, ...prevLogs];
      // Manter apenas os últimos MAX_LOGS registros
      return novosLogs.slice(0, MAX_LOGS);
    });
  };

  const limparLogs = () => {
    setLogs([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const getLogsPorTipo = (tipo: ActivityType) => {
    return logs.filter(log => log.tipo === tipo);
  };

  const getLogsPorUsuario = (usuarioId: string) => {
    return logs.filter(log => log.usuario.id === usuarioId);
  };

  const getLogsPorPeriodo = (inicio: Date, fim: Date) => {
    return logs.filter(log => {
      const dataLog = new Date(log.dataHora);
      return dataLog >= inicio && dataLog <= fim;
    });
  };

  return (
    <ActivityLogContext.Provider
      value={{
        logs,
        registrarAtividade,
        limparLogs,
        getLogsPorTipo,
        getLogsPorUsuario,
        getLogsPorPeriodo,
      }}
    >
      {children}
    </ActivityLogContext.Provider>
  );
}

export function useActivityLog() {
  const context = useContext(ActivityLogContext);
  if (context === undefined) {
    // Return a no-op fallback instead of throwing, to prevent crashes
    // when components render before the provider is ready
    return {
      logs: [],
      registrarAtividade: () => {},
      limparLogs: () => {},
      getLogsPorTipo: () => [],
      getLogsPorUsuario: () => [],
      getLogsPorPeriodo: () => [],
    } as ActivityLogContextType;
  }
  return context;
}

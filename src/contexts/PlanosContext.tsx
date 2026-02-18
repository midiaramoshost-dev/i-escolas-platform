import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Sparkles, Zap, Star, Crown, LucideIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export interface PlanoRecursos {
  alunos: string;
  professores: string;
  turmas: string;
  armazenamento: string;
  suporte: string;
  relatorios: boolean;
  boletins: boolean;
  frequencia: boolean;
  comunicados: boolean;
  financeiro: boolean;
  api: boolean;
  branding: boolean;
}

export interface Plano {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  precoAluno: number;
  cor: string;
  icon: LucideIcon;
  escolas: number;
  limiteAlunos: number | null;
  popular?: boolean;
  recursos: PlanoRecursos;
}

const iconMap: Record<string, LucideIcon> = {
  Sparkles,
  Zap,
  Star,
  Crown,
};

const planosIniciais: Plano[] = [
  {
    id: "free",
    nome: "Free",
    descricao: "Perfeito para começar",
    preco: 0,
    precoAluno: 0,
    cor: "gray",
    icon: Sparkles,
    escolas: 25,
    limiteAlunos: 50,
    recursos: {
      alunos: "Até 50",
      professores: "Até 5",
      turmas: "Até 3",
      armazenamento: "500 MB",
      suporte: "E-mail",
      relatorios: false,
      boletins: true,
      frequencia: true,
      comunicados: true,
      financeiro: false,
      api: false,
      branding: false,
    },
  },
  {
    id: "start",
    nome: "Start",
    descricao: "Para escolas em crescimento",
    preco: 199,
    precoAluno: 3,
    cor: "blue",
    icon: Zap,
    escolas: 35,
    limiteAlunos: 200,
    recursos: {
      alunos: "Até 200",
      professores: "Até 20",
      turmas: "Até 10",
      armazenamento: "5 GB",
      suporte: "E-mail + Chat",
      relatorios: true,
      boletins: true,
      frequencia: true,
      comunicados: true,
      financeiro: true,
      api: false,
      branding: false,
    },
  },
  {
    id: "pro",
    nome: "Pro",
    descricao: "Para quem busca excelência",
    preco: 399,
    precoAluno: 2,
    cor: "purple",
    icon: Star,
    escolas: 42,
    limiteAlunos: 500,
    popular: true,
    recursos: {
      alunos: "Até 500",
      professores: "Ilimitado",
      turmas: "Ilimitado",
      armazenamento: "25 GB",
      suporte: "Prioritário 24/7",
      relatorios: true,
      boletins: true,
      frequencia: true,
      comunicados: true,
      financeiro: true,
      api: true,
      branding: false,
    },
  },
  {
    id: "premium",
    nome: "Premium",
    descricao: "Para redes de escolas",
    preco: 699,
    precoAluno: 1.5,
    cor: "rose",
    icon: Crown,
    escolas: 25,
    limiteAlunos: null,
    recursos: {
      alunos: "Ilimitado",
      professores: "Ilimitado",
      turmas: "Ilimitado",
      armazenamento: "Ilimitado",
      suporte: "Gerente Dedicado",
      relatorios: true,
      boletins: true,
      frequencia: true,
      comunicados: true,
      financeiro: true,
      api: true,
      branding: true,
    },
  },
];

interface PlanosContextType {
  planos: Plano[];
  updatePlano: (updatedPlano: Plano) => Promise<void>;
  getPlanoById: (id: string) => Plano | undefined;
  isLoading: boolean;
}

const PlanosContext = createContext<PlanosContextType | undefined>(undefined);

const mapDbToPlano = (row: any): Plano => ({
  id: row.id,
  nome: row.nome,
  descricao: row.descricao,
  preco: Number(row.preco),
  precoAluno: Number(row.preco_aluno),
  cor: row.cor,
  icon: iconMap[row.icon_name] || Sparkles,
  escolas: row.escolas,
  limiteAlunos: row.limite_alunos,
  popular: row.popular,
  recursos: row.recursos as PlanoRecursos,
});

export function PlanosProvider({ children }: { children: ReactNode }) {
  const [planos, setPlanos] = useState<Plano[]>(planosIniciais);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlanos = async () => {
      try {
        const { data, error } = await supabase
          .from("planos" as any)
          .select("*")
          .order("preco", { ascending: true });

        if (error) {
          console.error("Erro ao carregar planos:", error);
          return;
        }

        if (data && data.length > 0) {
          setPlanos((data as any[]).map(mapDbToPlano));
        }
      } catch (error) {
        console.error("Erro ao carregar planos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlanos();
  }, []);

  const updatePlano = async (updatedPlano: Plano) => {
    const iconName = Object.entries(iconMap).find(
      ([, icon]) => icon === updatedPlano.icon
    )?.[0] || "Sparkles";

    const { error } = await supabase
      .from("planos" as any)
      .update({
        nome: updatedPlano.nome,
        descricao: updatedPlano.descricao,
        preco: updatedPlano.preco,
        preco_aluno: updatedPlano.precoAluno,
        cor: updatedPlano.cor,
        icon_name: iconName,
        escolas: updatedPlano.escolas,
        limite_alunos: updatedPlano.limiteAlunos,
        popular: updatedPlano.popular || false,
        recursos: updatedPlano.recursos,
      } as any)
      .eq("id", updatedPlano.id);

    if (error) {
      console.error("Erro ao atualizar plano:", error);
      throw error;
    }

    setPlanos((prev) =>
      prev.map((p) => (p.id === updatedPlano.id ? updatedPlano : p))
    );
  };

  const getPlanoById = (id: string) => {
    return planos.find((p) => p.id === id);
  };

  return (
    <PlanosContext.Provider value={{ planos, updatePlano, getPlanoById, isLoading }}>
      {children}
    </PlanosContext.Provider>
  );
}

export function usePlanos() {
  const context = useContext(PlanosContext);
  if (context === undefined) {
    throw new Error("usePlanos deve ser usado dentro de um PlanosProvider");
  }
  return context;
}

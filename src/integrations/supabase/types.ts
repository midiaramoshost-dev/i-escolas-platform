export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_usuarios: {
        Row: {
          created_at: string
          email: string
          id: string
          link_acesso: string | null
          nome: string
          perfil: string
          status: string
          ultimo_acesso: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          link_acesso?: string | null
          nome: string
          perfil?: string
          status?: string
          ultimo_acesso?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          link_acesso?: string | null
          nome?: string
          perfil?: string
          status?: string
          ultimo_acesso?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      anunciantes: {
        Row: {
          ativo: boolean
          categoria: string
          contato_email: string | null
          contato_nome: string | null
          contato_telefone: string | null
          created_at: string
          descricao: string | null
          id: string
          logo_url: string | null
          nome: string
          updated_at: string
          website: string | null
        }
        Insert: {
          ativo?: boolean
          categoria?: string
          contato_email?: string | null
          contato_nome?: string | null
          contato_telefone?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          logo_url?: string | null
          nome: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          ativo?: boolean
          categoria?: string
          contato_email?: string | null
          contato_nome?: string | null
          contato_telefone?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          logo_url?: string | null
          nome?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      campanhas_anuncio: {
        Row: {
          anunciante_id: string
          ativo: boolean
          cliques: number
          created_at: string
          data_fim: string | null
          data_inicio: string
          descricao: string | null
          escola_id: string | null
          id: string
          imagem_url: string | null
          impressoes: number
          link_destino: string | null
          posicao: string
          prioridade: number
          titulo: string
          updated_at: string
        }
        Insert: {
          anunciante_id: string
          ativo?: boolean
          cliques?: number
          created_at?: string
          data_fim?: string | null
          data_inicio?: string
          descricao?: string | null
          escola_id?: string | null
          id?: string
          imagem_url?: string | null
          impressoes?: number
          link_destino?: string | null
          posicao?: string
          prioridade?: number
          titulo: string
          updated_at?: string
        }
        Update: {
          anunciante_id?: string
          ativo?: boolean
          cliques?: number
          created_at?: string
          data_fim?: string | null
          data_inicio?: string
          descricao?: string | null
          escola_id?: string | null
          id?: string
          imagem_url?: string | null
          impressoes?: number
          link_destino?: string | null
          posicao?: string
          prioridade?: number
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campanhas_anuncio_anunciante_id_fkey"
            columns: ["anunciante_id"]
            isOneToOne: false
            referencedRelation: "anunciantes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campanhas_anuncio_escola_id_fkey"
            columns: ["escola_id"]
            isOneToOne: false
            referencedRelation: "escolas"
            referencedColumns: ["id"]
          },
        ]
      }
      centros_custo: {
        Row: {
          ativo: boolean
          codigo: string
          created_at: string
          escola_id: string
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          codigo: string
          created_at?: string
          escola_id: string
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          codigo?: string
          created_at?: string
          escola_id?: string
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "centros_custo_escola_id_fkey"
            columns: ["escola_id"]
            isOneToOne: false
            referencedRelation: "escolas"
            referencedColumns: ["id"]
          },
        ]
      }
      escolas: {
        Row: {
          alunos: number
          cidade: string
          cnpj: string
          created_at: string
          datacadastro: string
          email_diretor: string | null
          id: string
          link_acesso: string | null
          modulos: string[] | null
          nome: string
          plano: string
          porte: string
          professores: number
          status: string
          uf: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          alunos?: number
          cidade: string
          cnpj: string
          created_at?: string
          datacadastro?: string
          email_diretor?: string | null
          id?: string
          link_acesso?: string | null
          modulos?: string[] | null
          nome: string
          plano?: string
          porte?: string
          professores?: number
          status?: string
          uf: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          alunos?: number
          cidade?: string
          cnpj?: string
          created_at?: string
          datacadastro?: string
          email_diretor?: string | null
          id?: string
          link_acesso?: string | null
          modulos?: string[] | null
          nome?: string
          plano?: string
          porte?: string
          professores?: number
          status?: string
          uf?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      lancamento_itens: {
        Row: {
          centro_custo_id: string | null
          conta_id: string
          created_at: string
          historico: string | null
          id: string
          lancamento_id: string
          tipo: string
          valor: number
        }
        Insert: {
          centro_custo_id?: string | null
          conta_id: string
          created_at?: string
          historico?: string | null
          id?: string
          lancamento_id: string
          tipo: string
          valor: number
        }
        Update: {
          centro_custo_id?: string | null
          conta_id?: string
          created_at?: string
          historico?: string | null
          id?: string
          lancamento_id?: string
          tipo?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "lancamento_itens_centro_custo_id_fkey"
            columns: ["centro_custo_id"]
            isOneToOne: false
            referencedRelation: "centros_custo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lancamento_itens_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "plano_contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lancamento_itens_lancamento_id_fkey"
            columns: ["lancamento_id"]
            isOneToOne: false
            referencedRelation: "lancamentos_contabeis"
            referencedColumns: ["id"]
          },
        ]
      }
      lancamentos_contabeis: {
        Row: {
          created_at: string
          data_caixa: string | null
          data_competencia: string
          descricao: string
          escola_id: string
          id: string
          numero: number
          numero_documento: string | null
          status: string
          tipo_documento: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_caixa?: string | null
          data_competencia: string
          descricao: string
          escola_id: string
          id?: string
          numero: number
          numero_documento?: string | null
          status?: string
          tipo_documento?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_caixa?: string | null
          data_competencia?: string
          descricao?: string
          escola_id?: string
          id?: string
          numero?: number
          numero_documento?: string | null
          status?: string
          tipo_documento?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lancamentos_contabeis_escola_id_fkey"
            columns: ["escola_id"]
            isOneToOne: false
            referencedRelation: "escolas"
            referencedColumns: ["id"]
          },
        ]
      }
      materiais_didaticos: {
        Row: {
          arquivo_path: string | null
          created_at: string | null
          descricao: string | null
          disciplina: string
          duracao: string | null
          escola_id: string | null
          id: string
          professor: string
          tamanho: string | null
          tipo: string
          titulo: string
          url_externa: string | null
        }
        Insert: {
          arquivo_path?: string | null
          created_at?: string | null
          descricao?: string | null
          disciplina: string
          duracao?: string | null
          escola_id?: string | null
          id?: string
          professor: string
          tamanho?: string | null
          tipo: string
          titulo: string
          url_externa?: string | null
        }
        Update: {
          arquivo_path?: string | null
          created_at?: string | null
          descricao?: string | null
          disciplina?: string
          duracao?: string | null
          escola_id?: string | null
          id?: string
          professor?: string
          tamanho?: string | null
          tipo?: string
          titulo?: string
          url_externa?: string | null
        }
        Relationships: []
      }
      pagamentos: {
        Row: {
          created_at: string
          data_pagamento: string | null
          data_vencimento: string
          escola_id: string
          id: string
          metodo_pagamento: string | null
          observacoes: string | null
          referencia: string | null
          status: string
          updated_at: string
          valor: number
        }
        Insert: {
          created_at?: string
          data_pagamento?: string | null
          data_vencimento: string
          escola_id: string
          id?: string
          metodo_pagamento?: string | null
          observacoes?: string | null
          referencia?: string | null
          status?: string
          updated_at?: string
          valor?: number
        }
        Update: {
          created_at?: string
          data_pagamento?: string | null
          data_vencimento?: string
          escola_id?: string
          id?: string
          metodo_pagamento?: string | null
          observacoes?: string | null
          referencia?: string | null
          status?: string
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "pagamentos_escola_id_fkey"
            columns: ["escola_id"]
            isOneToOne: false
            referencedRelation: "escolas"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_gateways: {
        Row: {
          api_key: string
          created_at: string
          enabled: boolean
          id: string
          logo: string
          name: string
          sandbox: boolean
          secret_key: string
          updated_at: string
        }
        Insert: {
          api_key?: string
          created_at?: string
          enabled?: boolean
          id: string
          logo?: string
          name: string
          sandbox?: boolean
          secret_key?: string
          updated_at?: string
        }
        Update: {
          api_key?: string
          created_at?: string
          enabled?: boolean
          id?: string
          logo?: string
          name?: string
          sandbox?: boolean
          secret_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      plano_contas: {
        Row: {
          ativo: boolean
          codigo: string
          conta_pai_id: string | null
          created_at: string
          escola_id: string
          grupo: string
          id: string
          natureza: string
          nome: string
          tipo: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          codigo: string
          conta_pai_id?: string | null
          created_at?: string
          escola_id: string
          grupo: string
          id?: string
          natureza: string
          nome: string
          tipo: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          codigo?: string
          conta_pai_id?: string | null
          created_at?: string
          escola_id?: string
          grupo?: string
          id?: string
          natureza?: string
          nome?: string
          tipo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "plano_contas_conta_pai_id_fkey"
            columns: ["conta_pai_id"]
            isOneToOne: false
            referencedRelation: "plano_contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plano_contas_escola_id_fkey"
            columns: ["escola_id"]
            isOneToOne: false
            referencedRelation: "escolas"
            referencedColumns: ["id"]
          },
        ]
      }
      planos: {
        Row: {
          cor: string
          created_at: string
          descricao: string
          escolas: number
          icon_name: string
          id: string
          limite_alunos: number | null
          nome: string
          popular: boolean
          preco: number
          preco_aluno: number
          recursos: Json
          updated_at: string
        }
        Insert: {
          cor?: string
          created_at?: string
          descricao: string
          escolas?: number
          icon_name?: string
          id: string
          limite_alunos?: number | null
          nome: string
          popular?: boolean
          preco?: number
          preco_aluno?: number
          recursos?: Json
          updated_at?: string
        }
        Update: {
          cor?: string
          created_at?: string
          descricao?: string
          escolas?: number
          icon_name?: string
          id?: string
          limite_alunos?: number | null
          nome?: string
          popular?: boolean
          preco?: number
          preco_aluno?: number
          recursos?: Json
          updated_at?: string
        }
        Relationships: []
      }
      platform_settings: {
        Row: {
          cor_primaria: string
          cor_secundaria: string
          created_at: string
          email_suporte: string
          id: string
          logo_url: string | null
          nome_plataforma: string
          telefone_suporte: string
          updated_at: string
          whatsapp_number: string
        }
        Insert: {
          cor_primaria?: string
          cor_secundaria?: string
          created_at?: string
          email_suporte?: string
          id?: string
          logo_url?: string | null
          nome_plataforma?: string
          telefone_suporte?: string
          updated_at?: string
          whatsapp_number?: string
        }
        Update: {
          cor_primaria?: string
          cor_secundaria?: string
          created_at?: string
          email_suporte?: string
          id?: string
          logo_url?: string | null
          nome_plataforma?: string
          telefone_suporte?: string
          updated_at?: string
          whatsapp_number?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          id: string
          name: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "escola" | "aluno" | "responsavel"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "escola", "aluno", "responsavel"],
    },
  },
} as const


-- Tabela para usuários administrativos da plataforma
CREATE TABLE public.admin_usuarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  email text NOT NULL UNIQUE,
  perfil text NOT NULL DEFAULT 'suporte',
  status text NOT NULL DEFAULT 'ativo',
  ultimo_acesso timestamp with time zone,
  link_acesso text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_usuarios ENABLE ROW LEVEL SECURITY;

-- Only admins can manage this table
CREATE POLICY "Admins podem ver usuarios admin"
  ON public.admin_usuarios FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem inserir usuarios admin"
  ON public.admin_usuarios FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem atualizar usuarios admin"
  ON public.admin_usuarios FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem deletar usuarios admin"
  ON public.admin_usuarios FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger para updated_at
CREATE TRIGGER update_admin_usuarios_updated_at
  BEFORE UPDATE ON public.admin_usuarios
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir dados iniciais
INSERT INTO public.admin_usuarios (nome, email, perfil, status, ultimo_acesso, created_at) VALUES
  ('Carlos Administrador', 'carlos@iescolas.com.br', 'admin', 'ativo', '2025-01-25 14:30:00+00', '2023-01-15'),
  ('Ana Suporte', 'ana.suporte@iescolas.com.br', 'suporte', 'ativo', '2025-01-25 10:15:00+00', '2023-03-20'),
  ('Pedro Comercial', 'pedro.comercial@iescolas.com.br', 'comercial', 'ativo', '2025-01-24 16:45:00+00', '2023-06-10'),
  ('Maria Financeiro', 'maria.financeiro@iescolas.com.br', 'financeiro', 'ativo', '2025-01-25 09:00:00+00', '2023-08-05'),
  ('João Suporte', 'joao.suporte@iescolas.com.br', 'suporte', 'inativo', '2025-01-10 11:30:00+00', '2024-01-15');

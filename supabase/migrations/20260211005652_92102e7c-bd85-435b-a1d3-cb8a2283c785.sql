
-- Tabela de escolas cadastradas pelo ADM Master
CREATE TABLE public.escolas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  cnpj TEXT NOT NULL,
  cidade TEXT NOT NULL,
  uf TEXT NOT NULL,
  porte TEXT NOT NULL DEFAULT 'Pequeno',
  plano TEXT NOT NULL DEFAULT 'Free',
  alunos INTEGER NOT NULL DEFAULT 0,
  professores INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'trial',
  datacadastro DATE NOT NULL DEFAULT CURRENT_DATE,
  link_acesso TEXT,
  modulos TEXT[] DEFAULT '{}',
  email_diretor TEXT,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.escolas ENABLE ROW LEVEL SECURITY;

-- Admins podem ver todas as escolas
CREATE POLICY "Admins podem ver todas escolas"
  ON public.escolas FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins podem inserir escolas
CREATE POLICY "Admins podem inserir escolas"
  ON public.escolas FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins podem atualizar escolas
CREATE POLICY "Admins podem atualizar escolas"
  ON public.escolas FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins podem deletar escolas
CREATE POLICY "Admins podem deletar escolas"
  ON public.escolas FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Escola pode ver seus próprios dados
CREATE POLICY "Escola pode ver proprio registro"
  ON public.escolas FOR SELECT
  USING (auth.uid() = user_id);

-- Trigger para updated_at
CREATE TRIGGER update_escolas_updated_at
  BEFORE UPDATE ON public.escolas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

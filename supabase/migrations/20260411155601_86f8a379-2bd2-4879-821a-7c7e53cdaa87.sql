
-- Tabela de anunciantes parceiros
CREATE TABLE public.anunciantes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome text NOT NULL,
  descricao text,
  logo_url text,
  website text,
  contato_nome text,
  contato_email text,
  contato_telefone text,
  categoria text NOT NULL DEFAULT 'geral',
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Tabela de campanhas/banners
CREATE TABLE public.campanhas_anuncio (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  anunciante_id uuid NOT NULL REFERENCES public.anunciantes(id) ON DELETE CASCADE,
  titulo text NOT NULL,
  descricao text,
  imagem_url text,
  link_destino text,
  posicao text NOT NULL DEFAULT 'home',
  prioridade integer NOT NULL DEFAULT 0,
  cliques integer NOT NULL DEFAULT 0,
  impressoes integer NOT NULL DEFAULT 0,
  ativo boolean NOT NULL DEFAULT true,
  data_inicio date NOT NULL DEFAULT CURRENT_DATE,
  data_fim date,
  escola_id uuid REFERENCES public.escolas(id) ON DELETE SET NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.anunciantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campanhas_anuncio ENABLE ROW LEVEL SECURITY;

-- Anunciantes: admins gerenciam, todos leem ativos
CREATE POLICY "Qualquer um pode ver anunciantes ativos" ON public.anunciantes
  FOR SELECT USING (ativo = true OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem inserir anunciantes" ON public.anunciantes
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem atualizar anunciantes" ON public.anunciantes
  FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem deletar anunciantes" ON public.anunciantes
  FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Campanhas: admins gerenciam, todos leem ativas
CREATE POLICY "Qualquer um pode ver campanhas ativas" ON public.campanhas_anuncio
  FOR SELECT USING (ativo = true OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem inserir campanhas" ON public.campanhas_anuncio
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem atualizar campanhas" ON public.campanhas_anuncio
  FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem deletar campanhas" ON public.campanhas_anuncio
  FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Indexes
CREATE INDEX idx_campanhas_anunciante ON public.campanhas_anuncio(anunciante_id);
CREATE INDEX idx_campanhas_posicao_ativo ON public.campanhas_anuncio(posicao, ativo);
CREATE INDEX idx_anunciantes_ativo ON public.anunciantes(ativo);

-- Trigger updated_at
CREATE TRIGGER update_anunciantes_updated_at
  BEFORE UPDATE ON public.anunciantes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_campanhas_updated_at
  BEFORE UPDATE ON public.campanhas_anuncio
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

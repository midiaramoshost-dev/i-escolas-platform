
-- Create planos table
CREATE TABLE public.planos (
  id text NOT NULL PRIMARY KEY,
  nome text NOT NULL,
  descricao text NOT NULL,
  preco numeric NOT NULL DEFAULT 0,
  preco_aluno numeric NOT NULL DEFAULT 0,
  cor text NOT NULL DEFAULT 'gray',
  icon_name text NOT NULL DEFAULT 'Sparkles',
  escolas integer NOT NULL DEFAULT 0,
  limite_alunos integer,
  popular boolean NOT NULL DEFAULT false,
  recursos jsonb NOT NULL DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.planos ENABLE ROW LEVEL SECURITY;

-- Anyone can read plans (needed for landing page)
CREATE POLICY "Qualquer um pode ler planos"
  ON public.planos FOR SELECT
  USING (true);

-- Only admins can modify plans
CREATE POLICY "Admins podem inserir planos"
  ON public.planos FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem atualizar planos"
  ON public.planos FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem deletar planos"
  ON public.planos FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_planos_updated_at
  BEFORE UPDATE ON public.planos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default plans
INSERT INTO public.planos (id, nome, descricao, preco, preco_aluno, cor, icon_name, escolas, limite_alunos, popular, recursos) VALUES
('free', 'Free', 'Perfeito para começar', 0, 0, 'gray', 'Sparkles', 25, 50, false, '{"alunos":"Até 50","professores":"Até 5","turmas":"Até 3","armazenamento":"500 MB","suporte":"E-mail","relatorios":false,"boletins":true,"frequencia":true,"comunicados":true,"financeiro":false,"api":false,"branding":false}'),
('start', 'Start', 'Para escolas em crescimento', 199, 3, 'blue', 'Zap', 35, 200, false, '{"alunos":"Até 200","professores":"Até 20","turmas":"Até 10","armazenamento":"5 GB","suporte":"E-mail + Chat","relatorios":true,"boletins":true,"frequencia":true,"comunicados":true,"financeiro":true,"api":false,"branding":false}'),
('pro', 'Pro', 'Para quem busca excelência', 399, 2, 'purple', 'Star', 42, 500, true, '{"alunos":"Até 500","professores":"Ilimitado","turmas":"Ilimitado","armazenamento":"25 GB","suporte":"Prioritário 24/7","relatorios":true,"boletins":true,"frequencia":true,"comunicados":true,"financeiro":true,"api":true,"branding":false}'),
('premium', 'Premium', 'Para redes de escolas', 699, 1.5, 'rose', 'Crown', 25, null, false, '{"alunos":"Ilimitado","professores":"Ilimitado","turmas":"Ilimitado","armazenamento":"Ilimitado","suporte":"Gerente Dedicado","relatorios":true,"boletins":true,"frequencia":true,"comunicados":true,"financeiro":true,"api":true,"branding":true}');

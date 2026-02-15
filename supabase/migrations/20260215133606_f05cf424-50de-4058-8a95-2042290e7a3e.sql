
-- Tabela de pagamentos das escolas
CREATE TABLE public.pagamentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  escola_id UUID NOT NULL REFERENCES public.escolas(id) ON DELETE CASCADE,
  valor NUMERIC(12,2) NOT NULL DEFAULT 0,
  data_vencimento DATE NOT NULL,
  data_pagamento DATE,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pago', 'pendente', 'atrasado', 'cancelado')),
  metodo_pagamento TEXT,
  referencia TEXT,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pagamentos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para admins
CREATE POLICY "Admins podem ver todos pagamentos"
  ON public.pagamentos FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem inserir pagamentos"
  ON public.pagamentos FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem atualizar pagamentos"
  ON public.pagamentos FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem deletar pagamentos"
  ON public.pagamentos FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Escolas podem ver próprios pagamentos
CREATE POLICY "Escolas podem ver proprios pagamentos"
  ON public.pagamentos FOR SELECT
  USING (escola_id IN (SELECT id FROM public.escolas WHERE user_id = auth.uid()));

-- Trigger para updated_at
CREATE TRIGGER update_pagamentos_updated_at
  BEFORE UPDATE ON public.pagamentos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

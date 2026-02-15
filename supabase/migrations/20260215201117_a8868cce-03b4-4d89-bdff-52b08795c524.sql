
CREATE TABLE public.materiais_didaticos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  disciplina TEXT NOT NULL,
  professor TEXT NOT NULL,
  tipo TEXT NOT NULL,
  descricao TEXT,
  arquivo_path TEXT,
  url_externa TEXT,
  tamanho TEXT,
  duracao TEXT,
  escola_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.materiais_didaticos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios autenticados podem ler materiais"
  ON public.materiais_didaticos FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Escolas podem inserir materiais"
  ON public.materiais_didaticos FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'escola') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Escolas podem atualizar materiais"
  ON public.materiais_didaticos FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'escola') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Escolas podem deletar materiais"
  ON public.materiais_didaticos FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'escola') OR has_role(auth.uid(), 'admin'));

-- Validation trigger for tipo field
CREATE OR REPLACE FUNCTION public.validate_material_tipo()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.tipo NOT IN ('pdf', 'video', 'slides', 'imagem') THEN
    RAISE EXCEPTION 'tipo must be one of: pdf, video, slides, imagem';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_material_tipo_trigger
  BEFORE INSERT OR UPDATE ON public.materiais_didaticos
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_material_tipo();

-- Storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('materiais', 'materiais', true);

CREATE POLICY "Leitura publica materiais"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'materiais');

CREATE POLICY "Escolas podem fazer upload de materiais"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'materiais' AND (has_role(auth.uid(), 'escola') OR has_role(auth.uid(), 'admin')));

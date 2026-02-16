
-- Adicionar colunas de branding à tabela platform_settings
ALTER TABLE public.platform_settings
  ADD COLUMN cor_primaria text NOT NULL DEFAULT '#2563eb',
  ADD COLUMN cor_secundaria text NOT NULL DEFAULT '#7c3aed',
  ADD COLUMN logo_url text DEFAULT NULL;

-- Bucket para assets da plataforma (logo, favicon, etc.)
INSERT INTO storage.buckets (id, name, public)
VALUES ('platform-assets', 'platform-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Qualquer um pode ler os assets (logo público)
CREATE POLICY "Assets da plataforma são publicos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'platform-assets');

-- Apenas admins podem fazer upload
CREATE POLICY "Admins podem fazer upload de assets"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'platform-assets'
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Admins podem atualizar assets
CREATE POLICY "Admins podem atualizar assets"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'platform-assets'
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Admins podem deletar assets
CREATE POLICY "Admins podem deletar assets"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'platform-assets'
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Base mínima para importação/migração (staging + jobs)
-- Objetivo: permitir upload/cole SQL no frontend e processar via Edge Function/Worker depois.

create extension if not exists pgcrypto;

-- Job de importação por escola (rastreio/monitoramento)
create table if not exists public.import_jobs (
  id uuid primary key default gen_random_uuid(),
  escola_id text not null,
  mode text not null check (mode in ('cadastro','historico')),
  source text not null check (source in ('csv','excel','sql')),
  status text not null default 'queued' check (status in ('queued','processing','done','error')),
  file_name text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists import_jobs_escola_id_idx on public.import_jobs (escola_id);
create index if not exists import_jobs_status_idx on public.import_jobs (status);

-- Staging de dados cadastrais (payload bruto em JSON)
create table if not exists public.import_staging_cadastro (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references public.import_jobs(id) on delete cascade,
  escola_id text not null,
  row_number int,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists import_staging_cadastro_job_id_idx on public.import_staging_cadastro (job_id);
create index if not exists import_staging_cadastro_escola_id_idx on public.import_staging_cadastro (escola_id);

-- Staging de histórico (payload bruto em JSON)
create table if not exists public.import_staging_historico (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references public.import_jobs(id) on delete cascade,
  escola_id text not null,
  row_number int,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists import_staging_historico_job_id_idx on public.import_staging_historico (job_id);
create index if not exists import_staging_historico_escola_id_idx on public.import_staging_historico (escola_id);

-- Trigger para updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_import_jobs_updated_at on public.import_jobs;
create trigger trg_import_jobs_updated_at
before update on public.import_jobs
for each row
execute function public.set_updated_at();

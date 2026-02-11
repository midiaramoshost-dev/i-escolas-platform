-- Expansion base (Enterprise SaaS) for ADM MASTER iESCOLAS
-- Minimal schema to enable: analytics snapshots, help desk tickets, RBAC, retention signals, governance.

create extension if not exists pgcrypto;

-- 1) Analytics (SaaS): monthly snapshots (investor-grade KPIs can be derived/filled by jobs)
create table if not exists public.saas_analytics_monthly (
  id uuid primary key default gen_random_uuid(),
  month date not null, -- use first day of month
  currency text not null default 'BRL',
  mrr numeric(14,2) not null default 0,
  arr numeric(14,2) not null default 0,
  ltv numeric(14,2) not null default 0,
  cac numeric(14,2) not null default 0,
  net_revenue numeric(14,2) not null default 0,
  gateway_fees numeric(14,2) not null default 0,
  churn_rate_monthly numeric(8,4) not null default 0,
  churn_rate_annual numeric(8,4) not null default 0,
  avg_ticket_per_school numeric(14,2) not null default 0,
  mom_growth_pct numeric(8,4) not null default 0,
  forecast_6m numeric(14,2) not null default 0,
  forecast_12m numeric(14,2) not null default 0,
  created_at timestamptz not null default now(),
  unique (month)
);

-- 2) Support (Help Desk): tickets + messages (chat) + attachments + CSAT/NPS
create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  school_id uuid null,
  subject text not null,
  description text null,
  priority text not null default 'normal' check (priority in ('baixa','normal','alta','critica')),
  status text not null default 'aberto' check (status in ('aberto','em_andamento','aguardando_escola','resolvido')),
  sla_minutes integer not null default 1440,
  first_response_at timestamptz null,
  resolved_at timestamptz null,
  created_by uuid null,
  assigned_to uuid null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists support_tickets_school_id_idx on public.support_tickets (school_id);
create index if not exists support_tickets_status_idx on public.support_tickets (status);

create table if not exists public.support_ticket_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  sender_user_id uuid null,
  sender_type text not null default 'admin' check (sender_type in ('admin','escola','system')),
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists support_ticket_messages_ticket_id_idx on public.support_ticket_messages (ticket_id);

create table if not exists public.support_ticket_attachments (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  message_id uuid null references public.support_ticket_messages(id) on delete set null,
  file_name text not null,
  mime_type text null,
  file_size bigint null,
  storage_path text not null,
  created_at timestamptz not null default now()
);

create index if not exists support_ticket_attachments_ticket_id_idx on public.support_ticket_attachments (ticket_id);

create table if not exists public.support_ticket_ratings (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  school_id uuid null,
  nps_score integer null check (nps_score between 0 and 10),
  comment text null,
  created_at timestamptz not null default now(),
  unique(ticket_id)
);

-- 3) RBAC granular (admin area)
create table if not exists public.admin_roles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text null,
  hierarchy_level integer not null default 0,
  created_at timestamptz not null default now(),
  unique(name)
);

create table if not exists public.admin_permissions (
  id uuid primary key default gen_random_uuid(),
  module text not null,
  action text not null check (action in ('view','create','edit','delete','export')),
  created_at timestamptz not null default now(),
  unique(module, action)
);

create table if not exists public.admin_role_permissions (
  role_id uuid not null references public.admin_roles(id) on delete cascade,
  permission_id uuid not null references public.admin_permissions(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (role_id, permission_id)
);

create table if not exists public.admin_user_roles (
  user_id uuid not null,
  role_id uuid not null references public.admin_roles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, role_id)
);

-- 4) Retention (Anti-churn): health score + usage signals + alerts
create table if not exists public.school_health_metrics (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null,
  calculated_at timestamptz not null default now(),
  engagement_score numeric(8,4) not null default 0,
  health_score numeric(8,4) not null default 0,
  low_usage boolean not null default false,
  churn_risk_level text not null default 'baixo' check (churn_risk_level in ('baixo','medio','alto','critico')),
  notes text null
);

create index if not exists school_health_metrics_school_id_idx on public.school_health_metrics (school_id);

create table if not exists public.retention_alerts (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null,
  severity text not null default 'medio' check (severity in ('baixo','medio','alto','critico')),
  type text not null, -- e.g., 'low_usage', 'payment_risk', 'nps_drop'
  message text not null,
  acknowledged_at timestamptz null,
  acknowledged_by uuid null,
  created_at timestamptz not null default now()
);

create index if not exists retention_alerts_school_id_idx on public.retention_alerts (school_id);

-- 5) Governance / LGPD
create table if not exists public.school_consents (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null,
  consent_type text not null, -- e.g., 'lgpd_terms', 'marketing'
  version text null,
  granted boolean not null default true,
  granted_at timestamptz not null default now(),
  revoked_at timestamptz null,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists school_consents_school_id_idx on public.school_consents (school_id);

create table if not exists public.sensitive_data_access_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null,
  school_id uuid null,
  resource text not null, -- e.g., 'student_profile', 'billing'
  action text not null,
  ip inet null,
  user_agent text null,
  created_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists sensitive_data_access_logs_school_id_idx on public.sensitive_data_access_logs (school_id);
create index if not exists sensitive_data_access_logs_user_id_idx on public.sensitive_data_access_logs (user_id);

-- Generic audit log (fits RBAC + governance)
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid null,
  school_id uuid null,
  entity text not null,
  entity_id text null,
  action text not null,
  changes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_school_id_idx on public.audit_logs (school_id);
create index if not exists audit_logs_actor_user_id_idx on public.audit_logs (actor_user_id);

-- Updated_at trigger helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'trg_support_tickets_updated_at'
  ) then
    create trigger trg_support_tickets_updated_at
    before update on public.support_tickets
    for each row
    execute function public.set_updated_at();
  end if;
end;
$$;

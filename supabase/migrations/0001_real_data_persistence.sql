-- Phase 7: Real Data + Supabase Persistence
-- Initial schema for football data ingestion, normalized analytics data,
-- AI reports, anomaly alerts, automation logs, and private storage buckets.

create extension if not exists pgcrypto;

create type public.match_venue as enum ('home', 'away', 'neutral');
create type public.match_result as enum ('win', 'draw', 'loss');
create type public.ingestion_status as enum ('pending', 'running', 'completed', 'failed', 'partial');
create type public.report_kind as enum ('weekly', 'match_prep', 'demo_scenario', 'custom');
create type public.alert_severity as enum ('low', 'medium', 'high', 'critical');
create type public.automation_status as enum ('queued', 'running', 'completed', 'failed', 'cancelled');

create table public.teams (
  id uuid primary key default gen_random_uuid(),
  external_id text,
  name text not null,
  short_name text,
  country text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (name)
);

create table public.competitions (
  id uuid primary key default gen_random_uuid(),
  external_id text,
  name text not null,
  country text,
  season text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (name, season)
);

create table public.players (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references public.teams(id) on delete set null,
  external_id text,
  name text not null,
  position text,
  shirt_number integer,
  nationality text,
  date_of_birth date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (team_id, name)
);

create table public.matches (
  id uuid primary key default gen_random_uuid(),
  external_id text,
  competition_id uuid references public.competitions(id) on delete set null,
  team_id uuid not null references public.teams(id) on delete cascade,
  opponent_team_id uuid references public.teams(id) on delete set null,
  opponent_name text not null,
  match_date timestamptz not null,
  venue public.match_venue not null,
  goals_for integer not null default 0,
  goals_against integer not null default 0,
  result public.match_result not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (team_id, match_date, opponent_name)
);

create table public.fixtures (
  id uuid primary key default gen_random_uuid(),
  external_id text,
  competition_id uuid references public.competitions(id) on delete set null,
  team_id uuid not null references public.teams(id) on delete cascade,
  opponent_team_id uuid references public.teams(id) on delete set null,
  opponent_name text not null,
  fixture_date timestamptz not null,
  venue public.match_venue not null,
  match_importance numeric(5,2),
  opponent_form jsonb not null default '{}'::jsonb,
  opponent_strengths text[] not null default '{}',
  opponent_weaknesses text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.team_match_stats (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  xg numeric(6,2),
  xga numeric(6,2),
  shots integer,
  shots_on_target integer,
  possession numeric(5,2),
  pressing_intensity numeric(6,2),
  build_up_quality numeric(6,2),
  chance_creation numeric(6,2),
  defensive_risk numeric(6,2),
  raw_metrics jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (match_id)
);

create table public.player_match_stats (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete cascade,
  minutes integer not null default 0,
  goals integer not null default 0,
  assists integer not null default 0,
  xg numeric(6,2),
  xa numeric(6,2),
  shots integer,
  key_passes integer,
  rating numeric(4,2),
  raw_metrics jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (match_id, player_id)
);

create table public.tactical_match_metrics (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  pressing_intensity numeric(6,2),
  build_up_quality numeric(6,2),
  chance_creation numeric(6,2),
  defensive_risk numeric(6,2),
  transition_risk numeric(6,2),
  set_piece_threat numeric(6,2),
  match_control numeric(6,2),
  notes text,
  raw_metrics jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (match_id)
);

create table public.ingestion_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  source_type text not null,
  base_url text,
  parser_name text,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ingestion_runs (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references public.ingestion_sources(id) on delete set null,
  status public.ingestion_status not null default 'pending',
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  records_seen integer not null default 0,
  records_inserted integer not null default 0,
  records_updated integer not null default 0,
  error_message text,
  workflow_run_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.raw_ingestion_events (
  id uuid primary key default gen_random_uuid(),
  ingestion_run_id uuid references public.ingestion_runs(id) on delete cascade,
  source_id uuid references public.ingestion_sources(id) on delete set null,
  entity_type text not null,
  external_id text,
  source_url text,
  storage_bucket text,
  storage_path text,
  payload jsonb,
  checksum text,
  parsed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table public.ai_reports (
  id uuid primary key default gen_random_uuid(),
  report_kind public.report_kind not null,
  title text not null,
  summary text not null,
  recommendations jsonb not null default '[]'::jsonb,
  trace jsonb not null default '{}'::jsonb,
  data_lineage jsonb not null default '[]'::jsonb,
  quality_checks jsonb not null default '{}'::jsonb,
  exported_storage_bucket text,
  exported_storage_path text,
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ai_insights (
  id uuid primary key default gen_random_uuid(),
  report_id uuid references public.ai_reports(id) on delete set null,
  title text not null,
  body text not null,
  insight_type text not null,
  used_metrics text[] not null default '{}',
  trace jsonb not null default '{}'::jsonb,
  data_lineage jsonb not null default '[]'::jsonb,
  confidence numeric(4,3),
  risk_level text,
  created_at timestamptz not null default now()
);

create table public.anomaly_alerts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  severity public.alert_severity not null default 'medium',
  status text not null default 'open',
  affected_metrics text[] not null default '{}',
  explanation text not null,
  recommendation text,
  trace jsonb not null default '{}'::jsonb,
  data_lineage jsonb not null default '[]'::jsonb,
  detected_at timestamptz not null default now(),
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.automation_runs (
  id uuid primary key default gen_random_uuid(),
  workflow_name text not null,
  workflow_run_id text,
  status public.automation_status not null default 'queued',
  trigger_type text not null,
  input_payload jsonb not null default '{}'::jsonb,
  output_payload jsonb not null default '{}'::jsonb,
  error_message text,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_teams_updated_at before update on public.teams for each row execute function public.set_updated_at();
create trigger set_competitions_updated_at before update on public.competitions for each row execute function public.set_updated_at();
create trigger set_players_updated_at before update on public.players for each row execute function public.set_updated_at();
create trigger set_matches_updated_at before update on public.matches for each row execute function public.set_updated_at();
create trigger set_fixtures_updated_at before update on public.fixtures for each row execute function public.set_updated_at();
create trigger set_team_match_stats_updated_at before update on public.team_match_stats for each row execute function public.set_updated_at();
create trigger set_player_match_stats_updated_at before update on public.player_match_stats for each row execute function public.set_updated_at();
create trigger set_tactical_match_metrics_updated_at before update on public.tactical_match_metrics for each row execute function public.set_updated_at();
create trigger set_ingestion_sources_updated_at before update on public.ingestion_sources for each row execute function public.set_updated_at();
create trigger set_ingestion_runs_updated_at before update on public.ingestion_runs for each row execute function public.set_updated_at();
create trigger set_ai_reports_updated_at before update on public.ai_reports for each row execute function public.set_updated_at();
create trigger set_anomaly_alerts_updated_at before update on public.anomaly_alerts for each row execute function public.set_updated_at();
create trigger set_automation_runs_updated_at before update on public.automation_runs for each row execute function public.set_updated_at();

create index matches_team_date_idx on public.matches (team_id, match_date desc);
create index fixtures_team_date_idx on public.fixtures (team_id, fixture_date asc);
create index players_team_position_idx on public.players (team_id, position);
create index player_match_stats_player_idx on public.player_match_stats (player_id);
create index ingestion_runs_source_status_idx on public.ingestion_runs (source_id, status, started_at desc);
create index raw_ingestion_events_run_idx on public.raw_ingestion_events (ingestion_run_id);
create index raw_ingestion_events_external_idx on public.raw_ingestion_events (entity_type, external_id);
create index ai_reports_kind_created_idx on public.ai_reports (report_kind, created_at desc);
create index anomaly_alerts_status_severity_idx on public.anomaly_alerts (status, severity, detected_at desc);
create index automation_runs_workflow_created_idx on public.automation_runs (workflow_name, created_at desc);

alter table public.teams enable row level security;
alter table public.competitions enable row level security;
alter table public.players enable row level security;
alter table public.matches enable row level security;
alter table public.fixtures enable row level security;
alter table public.team_match_stats enable row level security;
alter table public.player_match_stats enable row level security;
alter table public.tactical_match_metrics enable row level security;
alter table public.ingestion_sources enable row level security;
alter table public.ingestion_runs enable row level security;
alter table public.raw_ingestion_events enable row level security;
alter table public.ai_reports enable row level security;
alter table public.ai_insights enable row level security;
alter table public.anomaly_alerts enable row level security;
alter table public.automation_runs enable row level security;

create policy "Public read teams" on public.teams for select to anon, authenticated using (true);
create policy "Public read competitions" on public.competitions for select to anon, authenticated using (true);
create policy "Public read players" on public.players for select to anon, authenticated using (true);
create policy "Public read matches" on public.matches for select to anon, authenticated using (true);
create policy "Public read fixtures" on public.fixtures for select to anon, authenticated using (true);
create policy "Public read team match stats" on public.team_match_stats for select to anon, authenticated using (true);
create policy "Public read player match stats" on public.player_match_stats for select to anon, authenticated using (true);
create policy "Public read tactical match metrics" on public.tactical_match_metrics for select to anon, authenticated using (true);

insert into storage.buckets (id, name, public)
values
  ('raw-snapshots', 'raw-snapshots', false),
  ('imports', 'imports', false),
  ('exports', 'exports', false)
on conflict (id) do nothing;


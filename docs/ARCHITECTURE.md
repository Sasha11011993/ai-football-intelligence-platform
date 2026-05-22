# Architecture

## System Overview

The platform has four main layers:

```text
Demo Data
  -> Analytics Engine
  -> AI Context Builder
  -> OpenAI-powered Agents
  -> n8n Automation
  -> Reports, Alerts, and Decisions
```

The frontend is a Next.js dashboard. The analytics layer computes derived metrics from local demo data in v1 and Supabase data in a later real-data phase. The AI layer uses OpenAI APIs through server-side routes. n8n orchestrates scheduled, manual, and webhook-triggered automation workflows. Supabase is the planned persistence layer for normalized football data, raw ingestion metadata, AI reports, alerts, and automation logs.

## Primary Components

### Next.js App

Responsibilities:

- render dashboard pages;
- manage filters and selected analysis scope;
- call local metrics and AI API routes;
- display Agent Workflow Trace, Data Lineage, AI Quality, reports, and automation runs;
- provide portfolio-facing Case Study and Demo Scenario flows.
- implement the approved dashboard and Case Study visual direction from `docs/DESIGN_DIRECTION.md`.

Recommended first version:

- App Router
- TypeScript
- Tailwind CSS
- Recharts or a similar lightweight charting library
- Server-side API routes for AI and n8n webhook mediation

### Analytics Layer

Responsibilities:

- normalize demo data;
- calculate team, player, and tactical metrics;
- produce compact metrics contexts for AI;
- provide deterministic outputs for charts, tables, and AI prompts.

The analytics layer should be written as framework-friendly TypeScript modules so it can be tested independently.

### AI Layer

Responsibilities:

- build curated context from current filters and metrics;
- call OpenAI APIs server-side;
- return structured JSON;
- provide AI Analyst Chat, Match Preparation Agent, Weekly Report Agent, and evaluation output;
- never expose API keys to the browser.

AI output should include:

- answer;
- recommendations;
- trace;
- used metrics;
- data lineage;
- confidence;
- risk level;
- quality checks.

### n8n Orchestration

Responsibilities:

- run scheduled weekly reporting;
- run matchday preparation;
- detect or process anomalies;
- orchestrate demo scenarios;
- return structured run/report/alert payloads to the dashboard.

For v1, notification destinations can be mocked or represented as notification-ready payloads. Real Slack, Telegram, email, or Google Drive delivery can be v2.

### Supabase Persistence

Responsibilities:

- store normalized football entities and match statistics in Postgres;
- store ingestion sources, ingestion runs, and raw ingestion event metadata;
- store AI reports, insights, anomaly alerts, and automation run logs;
- store raw parser snapshots, imports, and exports in private Storage buckets;
- provide the future real-data source for dashboard metrics and AI context.

See `docs/SUPABASE_PERSISTENCE.md` and `supabase/migrations/0001_real_data_persistence.sql`.

## Data Flow

```text
Local Demo Dataset
  -> Metrics Calculators
  -> Dashboard Visualizations
  -> AI Context Builder
  -> OpenAI API Route
  -> Structured AI Response
  -> Agent Trace + Recommendations
  -> n8n Workflow
  -> Report / Alert / Automation Hub
```

Future real-data flow:

```text
External Source / Parser / n8n
  -> Supabase Storage + Ingestion Tables
  -> Normalized Supabase Postgres Tables
  -> Metrics Calculators
  -> Dashboard + AI Context Builder
```

## Security and Secrets

- `OPENAI_API_KEY` must be read from server-side environment variables only.
- `N8N_MCP_TOKEN` is used by Codex to manage n8n workflows, not by the browser.
- `SUPABASE_SERVICE_ROLE_KEY` is backend-only and must never be exposed to the browser.
- Dashboard-to-n8n webhook secrets should be added later through env variables if needed.
- No secret values should be committed to the repository.

## v1 Non-Goals

- Real official football API ingestion.
- Production authentication.
- Database persistence in v1.
- Real paid notification delivery.
- Multi-club support.

The architecture should not block those future additions.

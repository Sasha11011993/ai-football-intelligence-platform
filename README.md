# AI Football Intelligence & Automation Platform

Portfolio-ready AI analytics and automation platform for a Manchester United 2025/2026 demo season.

The product shows how football performance data can become decision-ready intelligence through analytics, AI agents, explainability, workflow automation, and report export.

```text
Data -> Metrics -> AI Context -> AI Agent -> Automation -> Report -> Decision
```

## Project Goal

This is not only a sports dashboard. It is a compact AI decision-support platform designed for a recruiter/client demo in a few minutes:

- detect a football performance problem;
- inspect the metrics behind it;
- generate an AI recommendation grounded in demo data;
- trigger an n8n-ready automation/report result;
- review trace, data lineage, and quality checks;
- export a copy-ready Markdown report.

## Features

- Manchester United 2025/2026 analytics dashboard
- Team, player, tactical, and risk analytics
- AI Analyst Chat
- Match Preparation Agent
- Weekly Executive Report
- Anomaly Detection
- Agent Workflow Trace
- Data Lineage
- AI Quality / Evaluation Layer
- n8n Automation Hub with mock/webhook mode
- One-click Demo Scenario
- Markdown report copy/download experience
- Live Case Study portfolio page
- In-app architecture flow
- Ukrainian-first interface with English mode
- Dark/light theme support
- Supabase persistence plan for Phase 7 real data

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Recharts
- lucide-react
- OpenAI API through server-side routes
- n8n webhook contracts and mock fallback
- Planned Supabase Postgres + Storage schema for real data persistence

## Architecture

Current v1 demo flow:

```text
Local Demo Dataset
  -> Analytics Engine
  -> AI Context Builder
  -> OpenAI-backed Agents
  -> Agent Trace + Quality Checks
  -> n8n Automation Contracts
  -> Markdown Report / Alert Payload / Decision View
```

Future Phase 7 real-data flow:

```text
External Sources / Parser / n8n
  -> Supabase Storage + Ingestion Tables
  -> Normalized Supabase Postgres Tables
  -> Metrics Calculators
  -> Dashboard + AI Context Builder
```

Supabase is intentionally not implemented as active persistence in Phase 6. The schema and storage design are documented for the next phase.

## Demo Flow

Open `/demo` and click `Запустити демо` / `Run demo`.

The scenario demonstrates:

1. Problem detection: transition-defense risk in away matches.
2. Metrics analysis: away form, tactical risk, transition risk, defensive stability.
3. AI recommendation: structured answer with prioritized actions.
4. Automation/report result: demo orchestrator returns an n8n-ready payload.
5. Quality/trace summary: confidence, risk, data lineage, and hallucination-risk checks.
6. Export: copy or download a Markdown executive report.

## Screenshots Guidance

Recommended portfolio screenshots:

- Main dashboard in dark mode: `/`
- One-click demo scenario after a run: `/demo`
- Case Study page: `/case-study`
- Automation Hub with a workflow result: `/automation`
- Optional light-mode comparison for dashboard or Case Study

Use `docs/references/dashboard-target.png` and `docs/references/case-study-target.png` as visual direction references only. They should not be embedded as product UI.

## Phase Status

- Phase 0: Documentation Foundation - complete
- Phase 1: App Scaffold + Design System - complete
- Phase 2: Data + Analytics Engine - complete
- Phase 3: AI Core - complete
- Phase 4: Explainability + Quality Layer - complete
- Phase 5: n8n Automation Hub - complete
- Phase 6: Demo Scenario + Portfolio Polish - complete
- Phase 7: Real Data + Supabase Persistence - planned

## Documentation

- `docs/PROJECT_BRIEF.md` - product vision and portfolio goal
- `docs/IMPLEMENTATION_ROADMAP.md` - phased implementation plan
- `docs/ARCHITECTURE.md` - system architecture
- `docs/DATA_MODEL.md` - domain model and analytics metrics
- `docs/DESIGN_DIRECTION.md` - approved dashboard and Case Study visual direction
- `docs/AI_AGENT_SPEC.md` - AI agents, structured outputs, trace, quality checks
- `docs/N8N_WORKFLOWS.md` - automation workflows and contracts
- `docs/SUPABASE_PERSISTENCE.md` - future real-data storage architecture
- `docs/references/` - approved visual target references

## Setup

Install dependencies:

```bash
npm install
```

Run the local development server:

```bash
npm run dev
```

Run lint checks:

```bash
npm run lint
```

Build for production:

```bash
npm run build
```

## Environment

Optional local variables:

- `OPENAI_API_KEY` for OpenAI-backed AI routes
- `N8N_WEBHOOK_WEEKLY_REPORT_URL`
- `N8N_WEBHOOK_MATCHDAY_PREP_URL`
- `N8N_WEBHOOK_ANOMALY_ALERT_URL`
- `N8N_WEBHOOK_DEMO_ORCHESTRATOR_URL`

If n8n webhook URLs are absent, the dashboard returns server-side mock automation payloads using the same AI service contract.

Do not commit secrets. `.env.local` is ignored by Git.

## Portfolio Positioning

The project demonstrates AI automation, data analytics, AI agent development, structured output design, explainability, n8n orchestration, future-ready Supabase architecture, and product-minded full-stack UX.

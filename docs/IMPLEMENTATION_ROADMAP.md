# Implementation Roadmap

## Working Model

This project should be implemented in phases. Each implementation phase should happen in a fresh chat to keep context focused and reduce accidental drift. This repository documentation is the source of truth for product decisions, architecture, interfaces, and acceptance criteria.

Before starting any phase, the implementing agent must read:

- `docs/PROJECT_BRIEF.md`
- `docs/IMPLEMENTATION_ROADMAP.md`
- the relevant phase-specific docs

If implementation decisions change, update the docs in the same phase.

## Phase 0: Documentation Foundation

Goal: create the master documentation needed for independent phase execution.

Deliverables:

- `docs/PROJECT_BRIEF.md`
- `docs/IMPLEMENTATION_ROADMAP.md`
- `docs/ARCHITECTURE.md`
- `docs/DATA_MODEL.md`
- `docs/DESIGN_DIRECTION.md`
- `docs/AI_AGENT_SPEC.md`
- `docs/N8N_WORKFLOWS.md`
- `docs/PHASE_HANDOFF_TEMPLATE.md`
- portfolio-facing `README.md`

Acceptance criteria:

- A new chat can start Phase 1 using only the docs in this repository.
- All major product decisions are captured.
- The roadmap defines phase boundaries and done criteria.

## Phase 1: App Scaffold + Design System

Goal: create the base Next.js application and visual foundation.

Deliverables:

- Next.js app with TypeScript and Tailwind CSS.
- Dashboard-first layout and navigation shell.
- Placeholder pages for Dashboard Overview, Player Analytics, Tactical Analysis, AI Analyst, Automation Hub, Demo Scenario, AI Quality, and Case Study.
- Manchester United-inspired visual system that feels like a professional sports operations tool.
- Ukrainian-first UI copy with a visible `UA | EN` language switcher.
- Dark/light theme switcher, with dark mode as the default demo theme and full light-mode support.
- Approved design direction from `docs/DESIGN_DIRECTION.md`, including red accent rules and Ukrainian UI terminology.
- Visual alignment with `docs/references/dashboard-target.png` and `docs/references/case-study-target.png`.

Acceptance criteria:

- The app runs locally.
- Navigation works between all core pages.
- The layout is responsive enough for desktop and mobile foundations.
- Theme switching works across the application shell and placeholder pages.
- Dashboard and Case Study placeholders visually follow the approved reference images without using them as static screenshots.
- UI foundation is ready for analytics components.

## Phase 2: Data + Analytics Engine

Goal: build the demo dataset and metrics layer.

Deliverables:

- Demo season data for matches, players, fixtures, team trends, and tactical metrics.
- Derived metrics calculators.
- Dashboard KPI cards, charts, tables, and filters.
- Filters for tournament, date range, home/away, and player where relevant.

Acceptance criteria:

- Dashboard works without AI.
- Filters update KPI, charts, and tables consistently.
- Data model is documented and ready for future CSV/API ingestion.

## Phase 3: AI Core

Goal: add OpenAI-backed football intelligence.

Deliverables:

- API routes for insights, chat, match prep, weekly report, and AI evaluation.
- AI context builders that pass curated metrics, not unnecessary raw data.
- AI Analyst Chat.
- Match Preparation Agent.
- Weekly Executive Report generation.
- Language-aware AI responses that default to Ukrainian and support English through the UI language setting.

Acceptance criteria:

- AI responses return structured JSON.
- UI displays answer and recommendations.
- Missing API key and API failure states are handled gracefully.

## Phase 4: Explainability + Quality Layer

Goal: make AI outputs portfolio-grade and auditable.

Deliverables:

- Agent Workflow Trace UI.
- Data Lineage UI.
- AI Quality checks for groundedness, confidence, missing data, and hallucination risk.
- Confidence and risk indicators in AI experiences.

Acceptance criteria:

- Every AI response includes an explainability/audit summary.
- The UI never presents hidden chain-of-thought; it presents professional trace summaries.
- Data used by an insight is visible enough to defend the recommendation.

## Phase 5: n8n Automation

Goal: create orchestration workflows and connect them to the dashboard.

Deliverables:

- n8n workflows:
  - Weekly Football Intelligence Report
  - Matchday Prep Agent
  - Anomaly Alert Workflow
  - Demo Scenario Orchestrator
- Webhook/HTTP contracts between dashboard and n8n.
- Automation Hub integration for manual runs, workflow status, reports, and alerts.

Acceptance criteria:

- Workflows are created in n8n.
- Dashboard can trigger automation through webhooks.
- Automation Hub shows useful run/report/alert summaries.

## Phase 6: Demo Scenario + Portfolio Polish

Goal: make the project ready to show as a finished portfolio case.

Deliverables:

- One-click demo scenario.
- Case Study page.
- Architecture diagram.
- Export report feature.
- Screenshots and final README polish.
- Visual QA across desktop and mobile.
- Case Study sections implemented as live UI, not only a static mockup.

Acceptance criteria:

- The project can be demoed end-to-end in a few minutes.
- README clearly sells the project and the skills demonstrated.
- The final product feels like an AI-powered analytics and automation platform, not only a React dashboard.
- Final screenshots match the approved dashboard and Case Study visual direction.

## Phase 7: Real Data + Supabase Persistence

Goal: add Supabase as the persistence layer for real parsed football data, ingestion runs, AI reports, anomaly alerts, and automation logs.

Deliverables:

- Supabase Postgres schema for normalized football data.
- Supabase Storage buckets for raw snapshots, imports, and exports.
- Ingestion tracking tables for sources, runs, and raw events.
- Security defaults with RLS enabled.
- Documentation for dashboard, n8n, and future parser integration.

Acceptance criteria:

- Schema migration is ready to apply to the selected Supabase project.
- Storage buckets are defined.
- Public read access is limited to normalized demo-safe football tables.
- Ingestion, raw events, AI outputs, and automation logs are private by default.
- Security advisors are run after applying the migration.

## Global Constraints

- Do not expose secrets in chat, logs, or repository files.
- OpenAI API keys must be handled through environment variables or secure setup flow.
- n8n MCP is already connected and can be used in implementation phases.
- Product UI and AI responses are Ukrainian-first, with English available through a visible language switcher.
- Product UI supports dark and light themes; dark mode is the default portfolio demo theme.
- Keep v1 local/demo-friendly: no database is required unless explicitly added later.
- Prefer clear structured data contracts over ad hoc strings.

# Phase Handoff Template

Use this template when starting a new chat for a specific implementation phase.

```text
We are implementing Phase [X]: [Phase Name] of AI Football Intelligence & Automation Platform.

Repository:
D:\Проекти VibeCoding\Dashboard MU

Read first:
- docs/PROJECT_BRIEF.md
- docs/IMPLEMENTATION_ROADMAP.md
- docs/ARCHITECTURE.md
- [add relevant phase docs]

Goal:
[Describe the phase goal in one or two sentences.]

Expected deliverables:
- [deliverable 1]
- [deliverable 2]
- [deliverable 3]

Acceptance criteria:
- [done condition 1]
- [done condition 2]
- [done condition 3]

Constraints:
- Follow the existing documentation and architecture.
- Inspect the repo before implementing.
- Do not skip acceptance criteria.
- Do not expose secrets in code, logs, or chat.
- Update docs if implementation decisions change.

Do not touch:
- [list files or systems that should remain unchanged, if any]

Please inspect the repo first, then implement this phase end-to-end.
```

## Recommended Phase-Specific Starters

### Phase 1 Starter

```text
We are implementing Phase 1: App Scaffold + Design System of AI Football Intelligence & Automation Platform.

Read:
- docs/PROJECT_BRIEF.md
- docs/IMPLEMENTATION_ROADMAP.md
- docs/ARCHITECTURE.md
- docs/DESIGN_DIRECTION.md
- docs/references/README.md

Goal:
Create the base Next.js + TypeScript + Tailwind app with dashboard-first navigation and placeholder pages.

Acceptance criteria:
- App runs locally.
- Navigation works between all core pages.
- UI foundation is ready for analytics.
- Dashboard and Case Study placeholders follow the approved reference images without embedding them as static screenshots.
```

### Phase 2 Starter

```text
We are implementing Phase 2: Data + Analytics Engine.

Read:
- docs/PROJECT_BRIEF.md
- docs/IMPLEMENTATION_ROADMAP.md
- docs/DATA_MODEL.md

Goal:
Create the demo dataset, derived metrics, dashboard KPI, charts, tables, and filters.

Acceptance criteria:
- Dashboard works without AI.
- Filters update KPI, charts, and tables consistently.
```

### Phase 5 Starter

```text
We are implementing Phase 5: n8n Automation.

Read:
- docs/PROJECT_BRIEF.md
- docs/IMPLEMENTATION_ROADMAP.md
- docs/N8N_WORKFLOWS.md

Goal:
Create n8n workflows and connect them to the dashboard Automation Hub.

Acceptance criteria:
- Workflows are created in n8n.
- Dashboard can trigger automation through webhooks.
- Automation Hub shows useful run/report/alert summaries.
```

### Phase 7 Starter

```text
We are implementing Phase 7: Real Data + Supabase Persistence.

Read:
- docs/PROJECT_BRIEF.md
- docs/IMPLEMENTATION_ROADMAP.md
- docs/ARCHITECTURE.md
- docs/DATA_MODEL.md
- docs/SUPABASE_PERSISTENCE.md
- supabase/migrations/0001_real_data_persistence.sql

Goal:
Apply and integrate the Supabase persistence layer for real parsed football data, ingestion logs, AI reports, anomaly alerts, and automation runs.

Acceptance criteria:
- Target Supabase project is confirmed.
- Migration is applied successfully.
- Security/performance advisors are checked.
- Dashboard read flow and n8n ingestion contracts are ready for implementation.
```

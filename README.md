# AI Football Intelligence & Automation Platform

Portfolio-grade AI analytics and automation platform for a Manchester United 2025/2026 demo season.

This project is designed to demonstrate how a modern AI/data product can turn football performance data into decision-ready insights, automated reports, and agent-assisted recommendations.

```text
Data -> Metrics -> AI Context -> AI Agent -> Automation -> Report -> Decision
```

## What This Project Demonstrates

- Data analytics and metric design
- AI agent integration with structured outputs
- Agent explainability through workflow trace and data lineage
- AI quality checks and groundedness evaluation
- n8n workflow orchestration
- Supabase persistence planning for real parsed data
- Product-minded dashboard UX
- Ukrainian-first interface with optional English mode
- Dark/light theme support
- Portfolio-ready technical storytelling

## Core Features

- Manchester United 2025/2026 analytics dashboard
- Team, player, and tactical analytics
- AI Analyst Chat
- Match Preparation Agent
- Weekly Executive Report
- Anomaly Detection
- Agent Workflow Trace
- Data Lineage
- AI Quality / Evaluation Layer
- n8n Automation Hub
- Demo Scenario Mode
- Export Report
- Case Study page
- Future Supabase-backed real data ingestion
- UA/EN language switcher with Ukrainian as the default product language
- Dark/light theme switcher with dark mode as the preferred demo default

## Architecture

```text
Demo Data
  -> Analytics Engine
  -> AI Context Builder
  -> OpenAI API
  -> Agent Trace + Recommendations
  -> n8n Workflows
  -> Reports + Alerts + Decisions
```

## Implementation Plan

The project is implemented in phases:

0. Documentation Foundation
1. App Scaffold + Design System
2. Data + Analytics Engine
3. AI Core
4. Explainability + Quality Layer
5. n8n Automation
6. Demo Scenario + Portfolio Polish
7. Real Data + Supabase Persistence

See `docs/IMPLEMENTATION_ROADMAP.md` for details.

## Documentation

- `docs/PROJECT_BRIEF.md` - product vision and portfolio goal
- `docs/IMPLEMENTATION_ROADMAP.md` - phased implementation plan
- `docs/ARCHITECTURE.md` - system architecture
- `docs/DATA_MODEL.md` - domain model and analytics metrics
- `docs/DESIGN_DIRECTION.md` - approved dashboard and Case Study visual direction
- `docs/AI_AGENT_SPEC.md` - AI agents, structured outputs, trace, quality checks
- `docs/N8N_WORKFLOWS.md` - automation workflows and contracts
- `docs/SUPABASE_PERSISTENCE.md` - future real-data storage architecture
- `docs/PHASE_HANDOFF_TEMPLATE.md` - starter prompts for new implementation chats

## Current Status

Phase 0 documentation foundation is prepared. The application code will be built in later phases.

## Setup

Setup instructions will be added when Phase 1 creates the Next.js application.

Expected future environment variables:

- `OPENAI_API_KEY` for AI routes
- n8n webhook secrets if workflow endpoints need protection

Do not commit secrets to this repository.

## Portfolio Positioning

This is not only a sports dashboard. It is a compact AI decision-support platform that shows how analytics, AI agents, and automation can work together in a realistic operational workflow.

## Language

The product UI is Ukrainian-first and should include a visible `UA | EN` language switcher. AI answers, reports, workflow statuses, and dashboard labels default to Ukrainian, with English available as an alternate mode.

## Theme

The product should support both dark and light themes. Dark mode is the preferred default for portfolio demos, while light mode should remain polished, readable, and fully supported across dashboard, AI, automation, and report views.

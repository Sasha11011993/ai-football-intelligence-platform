# AI Football Intelligence & Automation Platform

## Product Summary

AI Football Intelligence & Automation Platform is a portfolio-grade analytics and automation product built around a Manchester United 2025/2026 demo season. It is not just a sports dashboard. It is designed to demonstrate how data analytics, AI agents, and workflow automation can support football operations decisions.

The core product story is:

```text
Data -> Metrics -> AI Context -> AI Agent -> Automation -> Report -> Decision
```

The first version uses realistic demo data instead of live official football APIs. The architecture should still make future CSV/API data ingestion straightforward.

## Portfolio Goal

The project should position the builder for roles and client work in:

- AI Automation
- Data Analytics
- AI Integrator
- AI Agent Development
- Product-minded full-stack implementation

The final result should be easy to demo to recruiters, clients, or collaborators. It should clearly show the difference between a visual dashboard and an AI-assisted decision-support system.

## Target User

The imagined user is a football performance analyst, coaching staff member, or club operations stakeholder who needs to:

- understand team form and tactical trends;
- identify performance risks;
- prepare for the next match;
- receive weekly AI-generated briefings;
- inspect which data supports each AI insight;
- automate reporting and alerts.

## Main Demo Narrative

The primary demo should show a guided scenario:

1. The system detects a performance issue, such as rising defensive risk or weak away form.
2. The dashboard highlights the relevant metrics and trends.
3. The AI Analyst explains the pattern using grounded football data.
4. Agent Workflow Trace shows selected metrics, detected patterns, confidence, and recommended actions.
5. n8n triggers an automation workflow, such as a weekly report or anomaly alert.
6. The platform produces a decision-ready report.

## Core Feature Set

- Manchester United 2025/2026 analytics dashboard
- Advanced team, player, and tactical analytics
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
- Portfolio Case Study page
- Architecture diagram and strong README
- Approved dashboard and Case Study visual direction documented in `docs/DESIGN_DIRECTION.md`

## Product Principles

- Dashboard-first, not landing-page-first.
- Ukrainian-first interface with a visible UA/EN language switcher.
- Dark/light theme support with dark mode as the preferred portfolio demo default.
- AI outputs should follow the selected product language; default is Ukrainian.
- AI must be grounded in the metrics shown by the product.
- Explainability matters: show audit summaries, data lineage, confidence, and risks.
- Automation should feel real, even if external notifications are mocked in v1.
- The project should be impressive but understandable in a short portfolio demo.

## Language and Localization

The product interface is Ukrainian by default. Core navigation, dashboard labels, AI recommendations, workflow statuses, report summaries, and demo scenario copy should be written in Ukrainian first.

The UI must include a visible language switcher with `UA` and `EN`, where `UA` is active by default. English support is part of the product design, but it should not replace the Ukrainian-first experience.

Portfolio-facing documentation can remain English, because it is intended for international recruiters and clients.

## Theme Support

The product should support both dark and light themes through a visible theme switcher. Dark mode is the preferred default for the portfolio demo because it fits the premium football operations command-center feel.

Light mode must still be treated as a first-class interface state, not an afterthought. Charts, KPI cards, tables, AI panels, Agent Workflow Trace, Automation Hub, and reports should remain readable and polished in both themes.

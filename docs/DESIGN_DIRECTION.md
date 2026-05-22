# Design Direction

## Approved Visual Target

The approved visual direction is a premium dark football operations command center. It should feel like a real product used by analysts, coaches, and technical staff, not a landing page or decorative concept.

The UI should communicate:

```text
AI-powered football analytics + agent explainability + n8n automation + Supabase data pipeline
```

## Dashboard Direction

The main dashboard should stay dense and operational, but with clear visual hierarchy.

Primary emphasis areas:

- `Індекс форми`
- `AI-аналітик`
- `Центр автоматизації`
- `Потік даних`

Secondary cards should remain readable but quieter, so the dashboard does not feel like every panel is competing for attention.

## Red Accent Rules

Use the Manchester United-inspired red as an intentional accent, not as a universal border.

Use red for:

- active navigation;
- important CTAs;
- anomaly/risk states;
- AI attention markers;
- selected or highlighted states.

Avoid using bright red borders on normal cards, because it can make the UI feel like everything is in an error state. Prefer graphite borders for standard panels and subtler red glow or thin accents for selected/high-priority cards.

## Data Flow Language

The data pipeline should be clear to non-technical viewers while still showing integration skill.

Preferred flow label:

```text
Джерела -> Supabase -> Метрики -> AI Agent -> n8n -> Звіт
```

Alternative when parser emphasis is needed:

```text
Парсинг джерел -> Supabase -> Метрики -> AI Agent -> n8n -> Звіт
```

Avoid using only `Парсинг` as a standalone first step, because it is narrower and less clear than `Джерела` or `Парсинг джерел`.

## Ukrainian UI Terminology

The product is Ukrainian-first. Technical terms can stay in English when they are natural labels, but core UI should prefer clean Ukrainian wording.

Preferred labels:

- `Потік роботи AI-агента` instead of `Workflow AI-агента`
- `Supabase: збереження даних` instead of `Supabase persistence`
- `Демо-сценарій` instead of `Demo Scenario`
- `QA-перевірки` instead of `QA checks`
- `Джерела` or `Парсинг джерел` instead of standalone `Парсинг`

Acceptable technical labels:

- `OpenAI Agent`
- `n8n`
- `Supabase`
- `xG`, `xGA`, `PPDA`

## Case Study Page Direction

The Case Study page is a first-class product page, not a static screenshot. It should explain what was built and why it matters.

Required sections:

- `Проблема`
- `Рішення`
- `Архітектура рішення`
- `Демо-сценарій`
- `Потік роботи AI-агента`
- `n8n автоматизації`
- `Supabase: збереження даних`
- `Навички продемонстровано`

Suggested title:

- `Case Study`

Suggested subtitle:

- `AI-аналітика, автоматизація та трасування рішень для футбольного клубу`

If Manchester United 2025/26 is shown on this page, prefer using it as a compact badge or context line rather than making the subtitle too long.

## Theme Requirements

Dark mode is the approved primary demo look. Light mode must still be implemented as a polished, first-class state.

Both themes must preserve:

- chart readability;
- KPI hierarchy;
- AI panel emphasis;
- trace/audit clarity;
- automation status clarity;
- accessible contrast.

## Portfolio Screenshots

The final portfolio should include at least:

- main dashboard screenshot;
- Case Study page screenshot;
- optional light-theme screenshot;
- optional Automation Hub screenshot.


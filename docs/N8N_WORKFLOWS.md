# n8n Workflows

## Current n8n Status

n8n MCP is connected and available to Codex.

Known project:

- Project name: `Олександр MYKHALSKYI <mihal4ik11+24@gmail.com>`
- Project ID: `7lyi7rNly1Va6dXy`

Existing workflow found during setup:

- `My workflow`
- Workflow ID: `JiXG6WfGIqCnHWgt`
- It should not be modified unless explicitly needed.

## Workflow Strategy

n8n is the orchestration layer. It should not replace the dashboard or analytics engine. It should coordinate scheduled, manual, and webhook-driven tasks.

The dashboard should integrate with n8n through webhook/HTTP contracts.

## Required Workflows

### Weekly Football Intelligence Report

Trigger:

- schedule trigger once per week;
- optional manual/webhook trigger for demo.

Flow:

1. Trigger workflow.
2. Call dashboard API for weekly metrics context.
3. Request AI report generation.
4. Return or store structured report payload.
5. Prepare notification-ready output.

Output:

- report title;
- executive summary;
- key risks;
- top recommendations;
- agent trace;
- data lineage;
- quality checks.

### Matchday Prep Agent

Trigger:

- manual or webhook trigger.

Flow:

1. Receive or fetch upcoming fixture.
2. Call dashboard API for match prep context.
3. Generate tactical briefing.
4. Return structured briefing payload.

Output:

- opponent overview;
- tactical priorities;
- key matchups;
- risks;
- recommended actions;
- confidence.

### Anomaly Alert Workflow

Trigger:

- scheduled, manual, or dashboard webhook trigger.

Flow:

1. Fetch latest metrics context.
2. Evaluate anomaly thresholds.
3. If anomaly exists, request AI explanation.
4. Return alert payload.

Output:

- anomaly type;
- severity;
- affected metrics;
- explanation;
- recommendation;
- trace.

### Demo Scenario Orchestrator

Trigger:

- dashboard `Run Demo Scenario` button.

Flow:

1. Receive selected demo scenario.
2. Fetch relevant metrics.
3. Generate AI analysis.
4. Generate report or alert.
5. Return a step-by-step demo payload for the UI.

Output:

- scenario steps;
- detected issue;
- AI recommendation;
- automation result;
- report summary.

## Dashboard Integration Points

Automation Hub should support:

- list recent mock or real automation runs;
- manually run demo workflows;
- show workflow result summaries;
- show agent traces from automation results;
- show report and alert payloads.

## v1 Notification Policy

For v1, real external delivery is optional. Workflow outputs can be:

- webhook responses;
- dashboard-visible payloads;
- notification-ready JSON.

Slack, Telegram, email, and Google Drive delivery can be added in v2.

## Safety

- Do not expose n8n tokens in repo or chat.
- Do not delete existing workflows unless explicitly requested.
- Prefer creating new named workflows for this project.


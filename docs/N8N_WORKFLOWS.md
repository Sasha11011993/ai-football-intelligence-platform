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

## Phase 5 Workflows Created

The Phase 5 workflows were created in n8n project `7lyi7rNly1Va6dXy`.

| Workflow | Workflow ID | Webhook path | Dashboard env var |
| --- | --- | --- | --- |
| Weekly Football Intelligence Report | `HndqoLXJ8bImYk7n` | `mu-weekly-football-intelligence-report` | `N8N_WEBHOOK_WEEKLY_REPORT_URL` |
| Matchday Prep Agent | `IyA2v761ybCtj9yw` | `mu-matchday-prep-agent` | `N8N_WEBHOOK_MATCHDAY_PREP_URL` |
| Anomaly Alert Workflow | `J7iZyiHzPwZlV5Ay` | `mu-anomaly-alert-workflow` | `N8N_WEBHOOK_ANOMALY_ALERT_URL` |
| Demo Scenario Orchestrator | `JnJaW7mesbjlrWHJ` | `mu-demo-scenario-orchestrator` | `N8N_WEBHOOK_DEMO_ORCHESTRATOR_URL` |

The workflows were built through the n8n MCP Workflow SDK flow:

1. Read SDK reference.
2. Searched nodes: Webhook, Schedule Trigger, HTTP Request, Code, Set, If, Respond to Webhook.
3. Loaded exact node type definitions before writing workflow code.
4. Validated all four workflow definitions.
5. Created new named workflows without modifying the existing `My workflow`.

Each HTTP Request node uses a placeholder for the dashboard API URL. For a deployed dashboard, configure these URLs in n8n:

- Weekly report and demo orchestrator: `https://<dashboard-host>/api/ai/report`
- Matchday prep: `https://<dashboard-host>/api/ai/match-prep`
- Anomaly alert: `https://<dashboard-host>/api/ai/insights`

For local demos, the dashboard Automation Hub works in mock mode unless the webhook URL env vars are configured.

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

Implemented dashboard routes:

- `GET /api/automation/status`
  - Returns n8n project metadata, workflow contracts, webhook configuration state, and recent run summaries.
- `POST /api/automation/run`
  - Body:

```json
{
  "workflowKey": "weekly-report",
  "language": "uk",
  "filters": {
    "competition": "all",
    "venue": "all",
    "dateFrom": "2025-08-01",
    "dateTo": "2026-05-31",
    "playerId": "all"
  },
  "fixtureId": "fixture-1",
  "scenarioId": "defensive-risk"
}
```

Supported `workflowKey` values:

- `weekly-report`
- `matchday-prep`
- `anomaly-alert`
- `demo-orchestrator`

If the matching `N8N_WEBHOOK_*_URL` env var is present, the route forwards the request to n8n. If it is absent, the route returns a server-side mock payload using the existing AI agent service.

Response shape:

```json
{
  "workflowKey": "weekly-report",
  "workflowName": "Щотижневий звіт футбольної розвідки",
  "status": "mocked",
  "runId": "weekly-report-labc123",
  "startedAt": "2026-05-23T09:00:00.000Z",
  "finishedAt": "2026-05-23T09:00:02.000Z",
  "summary": "Щотижневий intelligence report сформовано і підготовлено як notification-ready JSON.",
  "report": {
    "title": "Щотижневий звіт футбольної розвідки",
    "executiveSummary": "AI-generated report summary",
    "keyRisks": ["Risk pattern"],
    "topRecommendations": [],
    "qualityChecks": {}
  },
  "alert": {
    "type": "tactical-risk",
    "severity": "medium",
    "affectedMetrics": ["tacticalRiskScore"],
    "explanation": "AI-generated explanation",
    "recommendation": "Recommended action"
  },
  "agentTrace": {
    "selectedMetrics": ["formIndex", "xGD"],
    "detectedPatterns": ["Pattern"],
    "reasoningSummary": "User-safe audit summary",
    "confidence": 0.78,
    "riskLevel": "medium"
  },
  "dataLineage": [],
  "notification": {
    "channel": "mock",
    "ready": true,
    "subject": "Weekly Football Intelligence Report",
    "payload": {}
  }
}
```

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

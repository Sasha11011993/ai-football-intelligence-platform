import { NextResponse } from "next/server";
import { runAiAgent } from "@/lib/ai-service";
import {
  buildRunId,
  getWorkflow,
  normalizeAutomationLanguage,
  type AutomationRunPayload,
  type AutomationRunRequest,
  type AutomationWorkflowKey
} from "@/lib/automation";
import type { AiAgentKind, AiResponse } from "@/lib/ai-types";

const agentByWorkflow: Record<AutomationWorkflowKey, AiAgentKind> = {
  "weekly-report": "report",
  "matchday-prep": "match-prep",
  "anomaly-alert": "insights",
  "demo-orchestrator": "report"
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Partial<AutomationRunRequest>;
  const workflowKey = body.workflowKey;

  if (!workflowKey) {
    return NextResponse.json({ error: "workflowKey is required" }, { status: 400 });
  }

  const workflow = getWorkflow(workflowKey);
  if (!workflow) {
    return NextResponse.json({ error: "Unknown workflowKey" }, { status: 404 });
  }

  const webhookUrl = process.env[workflow.envVar];
  const startedAt = new Date().toISOString();

  if (webhookUrl) {
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflowKey,
          language: normalizeAutomationLanguage(body.language),
          filters: body.filters ?? {},
          fixtureId: body.fixtureId,
          scenarioId: body.scenarioId ?? "defensive-risk"
        })
      });

      const payload = (await response.json()) as AutomationRunPayload;
      return NextResponse.json({
        ...payload,
        status: payload.status ?? "completed",
        startedAt: payload.startedAt ?? startedAt
      });
    } catch {
      const fallback = await buildMockAutomationPayload(workflowKey, body, startedAt, "failed");
      return NextResponse.json(fallback, { status: 200 });
    }
  }

  const payload = await buildMockAutomationPayload(workflowKey, body, startedAt, "mocked");
  return NextResponse.json(payload);
}

async function buildMockAutomationPayload(
  workflowKey: AutomationWorkflowKey,
  body: Partial<AutomationRunRequest>,
  startedAt: string,
  status: AutomationRunPayload["status"]
): Promise<AutomationRunPayload> {
  const workflow = getWorkflow(workflowKey);
  const language = normalizeAutomationLanguage(body.language);
  const ai = await runAiAgent(agentByWorkflow[workflowKey], {
    language,
    filters: body.filters,
    fixtureId: body.fixtureId
  });
  const finishedAt = new Date().toISOString();
  const workflowName = language === "en" ? (workflow?.nameEn ?? workflowKey) : (workflow?.name ?? workflowKey);
  const summary = buildSummary(workflowKey, ai);

  return {
    workflowKey,
    workflowName,
    status,
    runId: buildRunId(workflowKey),
    startedAt,
    finishedAt,
    summary,
    report: workflowKey === "weekly-report" || workflowKey === "demo-orchestrator"
      ? {
          title: workflowName,
          executiveSummary: ai.answer,
          keyRisks: ai.trace.detectedPatterns,
          topRecommendations: ai.recommendations,
          qualityChecks: ai.qualityChecks
        }
      : undefined,
    alert: workflowKey === "anomaly-alert" ? buildAlert(ai) : undefined,
    demo: workflowKey === "demo-orchestrator" ? buildDemo(body.scenarioId, ai) : undefined,
    agentTrace: ai.trace,
    dataLineage: ai.dataLineage,
    notification: {
      channel: status === "mocked" || status === "failed" ? "mock" : "webhook",
      ready: true,
      subject: workflowName,
      payload: ai
    }
  };
}

function buildSummary(workflowKey: AutomationWorkflowKey, ai: AiResponse) {
  if (workflowKey === "anomaly-alert") {
    return ai.trace.riskLevel === "high"
      ? "Виявлено високий ризик, alert payload готовий для відправки."
      : "Критичної аномалії немає, watch-сигнал збережено для штабу.";
  }

  if (workflowKey === "matchday-prep") {
    return "Matchday briefing сформовано з тактичними пріоритетами, ризиками та трасуванням.";
  }

  if (workflowKey === "demo-orchestrator") {
    return "Демо-потік зібрано: issue detection, AI recommendation, automation result і report summary.";
  }

  return "Щотижневий intelligence report сформовано і підготовлено як notification-ready JSON.";
}

function buildAlert(ai: AiResponse): AutomationRunPayload["alert"] {
  const recommendation = ai.recommendations[0];

  return {
    type: "tactical-risk",
    severity: ai.trace.riskLevel,
    affectedMetrics: ai.trace.selectedMetrics,
    explanation: ai.answer,
    recommendation: recommendation ? `${recommendation.title}: ${recommendation.rationale}` : ai.trace.reasoningSummary
  };
}

function buildDemo(scenarioId: string | undefined, ai: AiResponse): AutomationRunPayload["demo"] {
  return {
    scenarioId: scenarioId ?? "defensive-risk",
    detectedIssue: ai.trace.detectedPatterns[0] ?? "Transition risk watch signal",
    automationResult: ai.answer,
    steps: [
      { title: "Metric signal", detail: "Dashboard передав фільтри та поточний risk context.", status: "completed" },
      { title: "AI recommendation", detail: ai.trace.reasoningSummary, status: "completed" },
      { title: "n8n payload", detail: "Workflow підготував report/alert JSON без зовнішньої доставки.", status: "completed" },
      { title: "Decision view", detail: "Automation Hub показує summary, trace, lineage і QA-перевірки.", status: "ready" }
    ]
  };
}

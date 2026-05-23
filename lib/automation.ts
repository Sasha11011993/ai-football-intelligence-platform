import type { AnalyticsFilters } from "@/lib/analytics";
import type { AiLanguage, AiResponse } from "@/lib/ai-types";

export type AutomationWorkflowKey = "weekly-report" | "matchday-prep" | "anomaly-alert" | "demo-orchestrator";

export type AutomationRunStatus = "ready" | "running" | "completed" | "mocked" | "failed";

export type AutomationWorkflow = {
  key: AutomationWorkflowKey;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  trigger: string;
  webhookPath: string;
  envVar: string;
  status: AutomationRunStatus;
};

export type AutomationRunRequest = {
  workflowKey: AutomationWorkflowKey;
  language?: "ua" | AiLanguage;
  filters?: Partial<AnalyticsFilters>;
  fixtureId?: string;
  scenarioId?: string;
};

export type AutomationRunPayload = {
  workflowKey: AutomationWorkflowKey;
  workflowName: string;
  status: AutomationRunStatus;
  runId: string;
  startedAt: string;
  finishedAt: string;
  summary: string;
  report?: {
    title: string;
    executiveSummary: string;
    keyRisks: string[];
    topRecommendations: AiResponse["recommendations"];
    qualityChecks: AiResponse["qualityChecks"];
  };
  alert?: {
    type: string;
    severity: "low" | "medium" | "high";
    affectedMetrics: string[];
    explanation: string;
    recommendation: string;
  };
  demo?: {
    scenarioId: string;
    steps: { title: string; detail: string; status: "completed" | "ready" }[];
    detectedIssue: string;
    automationResult: string;
  };
  agentTrace?: AiResponse["trace"];
  dataLineage?: AiResponse["dataLineage"];
  notification: {
    channel: "mock" | "webhook";
    ready: boolean;
    subject: string;
    payload: unknown;
  };
};

export const automationWorkflows: AutomationWorkflow[] = [
  {
    key: "weekly-report",
    name: "Щотижневий звіт футбольної розвідки",
    nameEn: "Weekly Football Intelligence Report",
    description: "Генерує executive summary, ризики, рекомендації та notification-ready JSON.",
    descriptionEn: "Generates an executive summary, risks, recommendations, and notification-ready JSON.",
    trigger: "Schedule + webhook",
    webhookPath: "mu-weekly-football-intelligence-report",
    envVar: "N8N_WEBHOOK_WEEKLY_REPORT_URL",
    status: "ready"
  },
  {
    key: "matchday-prep",
    name: "Підготовка до матчу",
    nameEn: "Matchday Prep Agent",
    description: "Готує tactical briefing для наступного суперника з трасуванням AI-агента.",
    descriptionEn: "Prepares a tactical briefing for the next opponent with AI agent trace.",
    trigger: "Manual webhook",
    webhookPath: "mu-matchday-prep-agent",
    envVar: "N8N_WEBHOOK_MATCHDAY_PREP_URL",
    status: "ready"
  },
  {
    key: "anomaly-alert",
    name: "Аномалії та ризики",
    nameEn: "Anomaly Alert Workflow",
    description: "Перевіряє threshold-сигнали та повертає alert payload для штабу.",
    descriptionEn: "Checks threshold signals and returns an alert payload for staff.",
    trigger: "Schedule + webhook",
    webhookPath: "mu-anomaly-alert-workflow",
    envVar: "N8N_WEBHOOK_ANOMALY_ALERT_URL",
    status: "ready"
  },
  {
    key: "demo-orchestrator",
    name: "Оркестратор демо-сценарію",
    nameEn: "Demo Scenario Orchestrator",
    description: "Збирає issue detection, AI recommendation, automation result і report summary в один демо-потік.",
    descriptionEn: "Combines issue detection, AI recommendation, automation result, and report summary into one demo flow.",
    trigger: "Dashboard webhook",
    webhookPath: "mu-demo-scenario-orchestrator",
    envVar: "N8N_WEBHOOK_DEMO_ORCHESTRATOR_URL",
    status: "ready"
  }
];

export function getWorkflow(key: AutomationWorkflowKey) {
  return automationWorkflows.find((workflow) => workflow.key === key);
}

export function normalizeAutomationLanguage(language?: "ua" | AiLanguage): AiLanguage {
  return language === "en" ? "en" : "uk";
}

export function buildRunId(key: AutomationWorkflowKey) {
  return `${key}-${Date.now().toString(36)}`;
}

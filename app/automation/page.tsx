"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, BellRing, FileJson2, FileText, GitBranch, Play, RefreshCw, Workflow } from "lucide-react";
import { AgentWorkflowTrace, DataLineagePanel, QualityChecksPanel } from "@/components/ai-explainability";
import { useLocale } from "@/components/providers";
import { Panel, SectionTitle, StatusBadge } from "@/components/ui";
import { defaultFilters } from "@/lib/analytics";
import type { AutomationRunPayload, AutomationWorkflow, AutomationWorkflowKey } from "@/lib/automation";

type AutomationStatus = {
  projectId: string;
  mode: "webhook" | "mock";
  workflows: (AutomationWorkflow & { configured: boolean })[];
  recentRuns: {
    workflowKey: AutomationWorkflowKey;
    status: string;
    summary: string;
    finishedAt: string;
  }[];
};

const copy = {
  ua: {
    title: "Центр автоматизації",
    subtitle: "n8n orchestration layer для звітів, matchday briefing, anomaly alerts і керованого демо-потоку.",
    project: "n8n project",
    modeWebhook: "Webhook mode",
    modeMock: "Mock mode",
    workflows: "Workflow",
    recentRuns: "Останні запуски",
    selectedRun: "Результат запуску",
    run: "Запустити",
    rerun: "Оновити статус",
    configured: "Підключено",
    mock: "Mock JSON",
    trigger: "Тригер",
    webhook: "Webhook path",
    env: "ENV contract",
    noRun: "Запусти workflow, щоб побачити report/alert payload, trace і lineage.",
    report: "Звіт",
    alert: "Alert payload",
    demo: "Демо-потік",
    notification: "Notification-ready JSON",
    trace: "Трасування з automation output",
    lineage: "Походження даних",
    quality: "QA-перевірки",
    status: "Статус",
    summary: "Summary"
  },
  en: {
    title: "Automation Hub",
    subtitle: "n8n orchestration layer for reports, matchday briefings, anomaly alerts, and the guided demo flow.",
    project: "n8n project",
    modeWebhook: "Webhook mode",
    modeMock: "Mock mode",
    workflows: "Workflows",
    recentRuns: "Recent runs",
    selectedRun: "Run result",
    run: "Run",
    rerun: "Refresh status",
    configured: "Configured",
    mock: "Mock JSON",
    trigger: "Trigger",
    webhook: "Webhook path",
    env: "ENV contract",
    noRun: "Run a workflow to see report/alert payload, trace, and lineage.",
    report: "Report",
    alert: "Alert payload",
    demo: "Demo flow",
    notification: "Notification-ready JSON",
    trace: "Trace from automation output",
    lineage: "Data lineage",
    quality: "Quality checks",
    status: "Status",
    summary: "Summary"
  }
} as const;

export default function AutomationPage() {
  const { locale } = useLocale();
  const text = copy[locale];
  const [status, setStatus] = useState<AutomationStatus | null>(null);
  const [activeRun, setActiveRun] = useState<AutomationRunPayload | null>(null);
  const [runningKey, setRunningKey] = useState<AutomationWorkflowKey | null>(null);

  async function loadStatus() {
    const response = await fetch("/api/automation/status");
    setStatus((await response.json()) as AutomationStatus);
  }

  useEffect(() => {
    let cancelled = false;

    async function loadInitialStatus() {
      const response = await fetch("/api/automation/status");
      const payload = (await response.json()) as AutomationStatus;
      if (!cancelled) setStatus(payload);
    }

    void loadInitialStatus();

    return () => {
      cancelled = true;
    };
  }, []);

  const activeWorkflow = useMemo(
    () => status?.workflows.find((workflow) => workflow.key === activeRun?.workflowKey),
    [activeRun?.workflowKey, status?.workflows]
  );

  async function runWorkflow(workflowKey: AutomationWorkflowKey) {
    setRunningKey(workflowKey);
    try {
      const response = await fetch("/api/automation/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflowKey,
          language: locale,
          filters: defaultFilters,
          scenarioId: "defensive-risk"
        })
      });
      setActiveRun((await response.json()) as AutomationRunPayload);
    } finally {
      setRunningKey(null);
    }
  }

  return (
    <div className="space-y-4">
      <Panel accent>
        <div className="grid gap-4 xl:grid-cols-[1fr_420px] xl:items-end">
          <div>
            <div className="flex items-center gap-2 text-united-red">
              <Workflow className="h-5 w-5" />
              <span className="text-sm font-bold uppercase">n8n automation</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold">{text.title}</h1>
            <p className="mt-1 max-w-3xl text-sm text-zinc-400 light:text-zinc-600">{text.subtitle}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <StatusBadge tone="blue">{text.project}: {status?.projectId ?? "7lyi7rNly1Va6dXy"}</StatusBadge>
              <StatusBadge tone={status?.mode === "webhook" ? "green" : "gold"}>
                {status?.mode === "webhook" ? text.modeWebhook : text.modeMock}
              </StatusBadge>
            </div>
          </div>

          <button
            className="flex h-11 items-center justify-center gap-2 rounded-md border border-zinc-700 bg-black/20 px-4 text-sm font-semibold transition hover:border-united-red light:border-zinc-200 light:bg-white"
            onClick={loadStatus}
          >
            <RefreshCw className="h-4 w-4 text-united-red" />
            {text.rerun}
          </button>
        </div>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-[440px_1fr]">
        <div className="space-y-4">
          <Panel>
            <SectionTitle title={text.workflows} />
            <div className="grid gap-3">
              {(status?.workflows ?? []).map((workflow) => (
                <div key={workflow.key} className="rounded-md border border-zinc-800 bg-black/20 p-4 light:border-zinc-200 light:bg-zinc-50">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-semibold">{locale === "en" ? workflow.nameEn : workflow.name}</h2>
                      <p className="mt-1 text-sm leading-5 text-zinc-400 light:text-zinc-600">
                        {locale === "en" ? workflow.descriptionEn : workflow.description}
                      </p>
                    </div>
                    <StatusBadge tone={workflow.configured ? "green" : "gold"}>{workflow.configured ? text.configured : text.mock}</StatusBadge>
                  </div>
                  <div className="mt-4 grid gap-2 text-xs text-zinc-400 light:text-zinc-600">
                    <ContractRow label={text.trigger} value={workflow.trigger} />
                    <ContractRow label={text.webhook} value={workflow.webhookPath} />
                    <ContractRow label={text.env} value={workflow.envVar} />
                  </div>
                  <button
                    className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-md bg-united-red px-4 text-sm font-semibold text-white shadow-glow transition disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={() => runWorkflow(workflow.key)}
                    disabled={runningKey !== null}
                  >
                    <Play className="h-4 w-4" />
                    {runningKey === workflow.key ? "..." : text.run}
                  </button>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <SectionTitle title={text.recentRuns} />
            <div className="space-y-2">
              {(status?.recentRuns ?? []).map((run) => (
                <div key={`${run.workflowKey}-${run.finishedAt}`} className="rounded-md border border-zinc-800 p-3 light:border-zinc-200">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold">{run.workflowKey}</span>
                    <StatusBadge tone={run.status === "completed" ? "green" : "gold"}>{run.status}</StatusBadge>
                  </div>
                  <p className="mt-2 text-sm text-zinc-400 light:text-zinc-600">{run.summary}</p>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <Panel accent className="min-h-[720px]">
          <SectionTitle title={text.selectedRun} />
          {!activeRun && <div className="grid min-h-[520px] place-items-center text-sm text-zinc-400">{text.noRun}</div>}
          {activeRun && (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-3">
                <InfoTile icon={Workflow} label={text.status} value={activeRun.status} tone={activeRun.status === "completed" ? "green" : "gold"} />
                <InfoTile icon={GitBranch} label="Run ID" value={activeRun.runId} tone="blue" />
                <InfoTile icon={BellRing} label={text.notification} value={activeRun.notification.channel} tone="gold" />
              </div>

              <div className="rounded-md border border-zinc-800 bg-black/20 p-4 light:border-zinc-200 light:bg-zinc-50">
                <p className="text-xs font-semibold uppercase text-zinc-500">{text.summary}</p>
                <p className="mt-2 text-sm leading-6 text-zinc-200 light:text-zinc-700">{activeRun.summary}</p>
                {activeWorkflow && <p className="mt-2 text-xs text-zinc-500">{activeWorkflow.webhookPath}</p>}
              </div>

              {activeRun.report && (
                <PayloadPanel icon={FileText} title={text.report}>
                  <h3 className="font-semibold">{activeRun.report.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-300 light:text-zinc-700">{activeRun.report.executiveSummary}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {activeRun.report.topRecommendations.map((item) => (
                      <StatusBadge key={item.title} tone={item.priority === "high" ? "red" : item.priority === "medium" ? "gold" : "green"}>
                        {item.title}
                      </StatusBadge>
                    ))}
                  </div>
                </PayloadPanel>
              )}

              {activeRun.alert && (
                <PayloadPanel icon={AlertTriangle} title={text.alert}>
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge tone={activeRun.alert.severity === "high" ? "red" : activeRun.alert.severity === "medium" ? "gold" : "green"}>
                      {activeRun.alert.type}
                    </StatusBadge>
                    {activeRun.alert.affectedMetrics.map((metric) => <StatusBadge key={metric} tone="blue">{metric}</StatusBadge>)}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-zinc-300 light:text-zinc-700">{activeRun.alert.explanation}</p>
                </PayloadPanel>
              )}

              {activeRun.demo && (
                <PayloadPanel icon={FileJson2} title={text.demo}>
                  <div className="grid gap-2">
                    {activeRun.demo.steps.map((step) => (
                      <div key={step.title} className="rounded-md border border-zinc-800 p-3 light:border-zinc-200">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="font-semibold">{step.title}</h3>
                          <StatusBadge tone={step.status === "completed" ? "green" : "blue"}>{step.status}</StatusBadge>
                        </div>
                        <p className="mt-1 text-sm text-zinc-400 light:text-zinc-600">{step.detail}</p>
                      </div>
                    ))}
                  </div>
                </PayloadPanel>
              )}

              {activeRun.agentTrace && (
                <div className="space-y-3">
                  <SectionTitle title={text.trace} />
                  <AgentWorkflowTrace response={responseFromRun(activeRun)} />
                </div>
              )}

              {activeRun.dataLineage && (
                <div className="grid gap-3 xl:grid-cols-2">
                  <div>
                    <SectionTitle title={text.lineage} />
                    <DataLineagePanel response={responseFromRun(activeRun)} />
                  </div>
                  <div>
                    <SectionTitle title={text.quality} />
                    <QualityChecksPanel response={responseFromRun(activeRun)} />
                  </div>
                </div>
              )}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}

function ContractRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span>{label}</span>
      <code className="max-w-[240px] truncate rounded bg-zinc-900 px-2 py-1 text-zinc-200 light:bg-white light:text-zinc-700">{value}</code>
    </div>
  );
}

function InfoTile({
  icon: Icon,
  label,
  value,
  tone
}: {
  icon: typeof Workflow;
  label: string;
  value: string;
  tone: "green" | "blue" | "gold" | "red";
}) {
  return (
    <div className="rounded-md border border-zinc-800 bg-black/20 p-3 light:border-zinc-200 light:bg-zinc-50">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase text-zinc-500">
        <Icon className="h-4 w-4 text-united-red" />
        {label}
      </div>
      <StatusBadge tone={tone}>{value}</StatusBadge>
    </div>
  );
}

function PayloadPanel({ icon: Icon, title, children }: { icon: typeof FileText; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-zinc-800 bg-black/20 p-4 light:border-zinc-200 light:bg-zinc-50">
      <div className="mb-3 flex items-center gap-2 font-semibold">
        <Icon className="h-4 w-4 text-united-red" />
        {title}
      </div>
      {children}
    </div>
  );
}

function responseFromRun(run: AutomationRunPayload) {
  return {
    language: "uk" as const,
    answer: run.summary,
    recommendations: run.report?.topRecommendations ?? [],
    trace: run.agentTrace ?? {
      selectedMetrics: [],
      detectedPatterns: [],
      reasoningSummary: run.summary,
      confidence: 0.72,
      riskLevel: "medium" as const
    },
    usedMetrics: run.agentTrace?.selectedMetrics ?? [],
    dataLineage: run.dataLineage ?? [],
    qualityChecks: run.report?.qualityChecks ?? {
      groundedInData: true,
      missingDataWarnings: [],
      hallucinationRisk: "low" as const
    }
  };
}

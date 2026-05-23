"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clipboard,
  Download,
  FileText,
  Gauge,
  GitBranch,
  Loader2,
  Play,
  RadioTower,
  ShieldCheck,
  Workflow,
  type LucideIcon
} from "lucide-react";
import { AgentWorkflowTrace, ConfidenceRiskStrip, DataLineagePanel, QualityChecksPanel } from "@/components/ai-explainability";
import { useLocale } from "@/components/providers";
import { Panel, SectionTitle, StatusBadge } from "@/components/ui";
import { calculateTacticalMetrics, calculateTeamMetrics, defaultFilters, filterMatches } from "@/lib/analytics";
import type { AutomationRunPayload } from "@/lib/automation";
import type { AiResponse } from "@/lib/ai-types";

const scenarioFilters = {
  ...defaultFilters,
  venue: "away" as const,
  dateFrom: "2025-10-01",
  dateTo: "2026-02-28"
};

const copy = {
  ua: {
    eyebrow: "Guided portfolio demo",
    title: "Демо-сценарій",
    subtitle:
      "Один клік показує повний шлях: система знаходить ризик, пояснює метрики, формує AI-рекомендацію, запускає automation payload і відкриває trace/QA для перевірки.",
    run: "Запустити демо",
    rerun: "Запустити повторно",
    running: "Демо виконується...",
    scenario: "Сценарій",
    scenarioName: "Ризик перехідної оборони у виїзних матчах",
    issue: "Виявлена проблема",
    issueText:
      "У виїзній вибірці зростає transition risk, а defensive stability падає нижче безпечної зони. Це ранній сигнал для штабу перед наступним матчем.",
    metrics: "Аналіз метрик",
    ai: "AI-рекомендація",
    automation: "Automation/report result",
    trace: "Trace і якість",
    report: "Експорт звіту",
    executive: "Executive summary",
    copy: "Копіювати",
    copied: "Скопійовано",
    markdown: "Markdown",
    download: "Завантажити .md",
    noRun: "Запустіть сценарій, щоб отримати report payload, рекомендації, lineage і QA-перевірки.",
    confidence: "Рівень впевненості",
    demoMode: "mock або webhook-ready",
    source: "Джерело: demo dataset Manchester United 2025/26",
    steps: [
      "Problem detection",
      "Metrics analysis",
      "AI recommendation",
      "Automation result",
      "Quality summary"
    ],
    metricCards: {
      awayForm: "Індекс виїзної форми",
      tacticalRisk: "Тактичний ризик",
      transitionRisk: "Transition risk",
      defensiveStability: "Стабільність захисту"
    }
  },
  en: {
    eyebrow: "Guided portfolio demo",
    title: "Demo Scenario",
    subtitle:
      "One click shows the full path: issue detection, metric analysis, AI recommendation, automation payload, and trace/QA for audit.",
    run: "Run demo",
    rerun: "Run again",
    running: "Demo is running...",
    scenario: "Scenario",
    scenarioName: "Transition-defense risk in away matches",
    issue: "Detected issue",
    issueText:
      "The away-match scope shows rising transition risk while defensive stability drops below the safe zone. This is an early signal for staff before the next match.",
    metrics: "Metrics analysis",
    ai: "AI recommendation",
    automation: "Automation/report result",
    trace: "Trace and quality",
    report: "Report export",
    executive: "Executive summary",
    copy: "Copy",
    copied: "Copied",
    markdown: "Markdown",
    download: "Download .md",
    noRun: "Run the scenario to generate the report payload, recommendations, lineage, and QA checks.",
    confidence: "Confidence level",
    demoMode: "mock or webhook-ready",
    source: "Source: Manchester United 2025/26 demo dataset",
    steps: [
      "Problem detection",
      "Metrics analysis",
      "AI recommendation",
      "Automation result",
      "Quality summary"
    ],
    metricCards: {
      awayForm: "Away form index",
      tacticalRisk: "Tactical risk",
      transitionRisk: "Transition risk",
      defensiveStability: "Defensive stability"
    }
  }
} as const;

export default function DemoPage() {
  const { locale } = useLocale();
  const text = copy[locale];
  const [activeRun, setActiveRun] = useState<AutomationRunPayload | null>(null);
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const matches = useMemo(() => filterMatches(scenarioFilters), []);
  const teamMetrics = useMemo(() => calculateTeamMetrics(matches), [matches]);
  const tacticalMetrics = useMemo(() => calculateTacticalMetrics(matches), [matches]);
  const response = activeRun ? responseFromRun(activeRun, locale) : null;
  const markdown = useMemo(() => buildMarkdownReport(activeRun, response, locale), [activeRun, response, locale]);

  async function runDemo() {
    setRunning(true);
    setCopied(false);

    try {
      const result = await fetch("/api/automation/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflowKey: "demo-orchestrator",
          language: locale,
          filters: scenarioFilters,
          scenarioId: "defensive-risk"
        })
      });
      setActiveRun((await result.json()) as AutomationRunPayload);
    } finally {
      setRunning(false);
    }
  }

  async function copyReport() {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
  }

  function downloadReport() {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = locale === "en" ? "mu-demo-intelligence-report.md" : "mu-demo-zvit.md";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <Panel accent>
        <div className="grid gap-5 xl:grid-cols-[1fr_360px] xl:items-end">
          <div>
            <div className="flex items-center gap-2 text-united-red">
              <RadioTower className="h-5 w-5" />
              <span className="text-sm font-bold uppercase">{text.eyebrow}</span>
            </div>
            <h1 className="mt-2 text-3xl font-bold">{text.title}</h1>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-zinc-400 light:text-zinc-600">{text.subtitle}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <StatusBadge tone="red">{text.scenarioName}</StatusBadge>
              <StatusBadge tone="blue">{text.demoMode}</StatusBadge>
              <StatusBadge tone="gold">{text.source}</StatusBadge>
            </div>
          </div>
          <button
            className="flex h-12 items-center justify-center gap-2 rounded-md bg-united-red px-4 text-sm font-bold text-white shadow-glow transition disabled:cursor-not-allowed disabled:opacity-70"
            onClick={runDemo}
            disabled={running}
          >
            {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            {running ? text.running : activeRun ? text.rerun : text.run}
          </button>
        </div>
      </Panel>

      <div className="grid gap-3 md:grid-cols-5">
        {text.steps.map((step, index) => (
          <ScenarioStep key={step} number={index + 1} title={step} done={Boolean(activeRun) || running} active={running && index === 0} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.75fr_1.25fr]">
        <div className="space-y-4">
          <Panel>
            <SectionTitle title={text.issue} />
            <p className="text-sm leading-6 text-zinc-300 light:text-zinc-700">{text.issueText}</p>
            <div className="mt-4 grid gap-2">
              {(response?.trace.detectedPatterns ?? []).map((pattern) => (
                <div key={pattern} className="flex gap-2 rounded-md border border-united-red/40 bg-united-red/10 p-3 text-sm">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-united-red" />
                  <span>{pattern}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <SectionTitle title={text.metrics} />
            <div className="grid gap-3 sm:grid-cols-2">
              <MetricTile icon={Activity} label={text.metricCards.awayForm} value={String(teamMetrics.awayFormIndex)} tone="gold" />
              <MetricTile icon={Gauge} label={text.metricCards.tacticalRisk} value={`${Math.round(tacticalMetrics.tacticalRiskScore)}/100`} tone="red" />
              <MetricTile icon={GitBranch} label={text.metricCards.transitionRisk} value={`${Math.round(tacticalMetrics.transitionRisk)}/100`} tone="red" />
              <MetricTile icon={ShieldCheck} label={text.metricCards.defensiveStability} value={String(teamMetrics.defensiveStability)} tone="gold" />
            </div>
          </Panel>

          <Panel>
            <SectionTitle title={text.automation} />
            {!activeRun && <p className="text-sm text-zinc-400 light:text-zinc-600">{text.noRun}</p>}
            {activeRun && (
              <div className="space-y-3">
                <div className="grid gap-2">
                  {(activeRun.demo?.steps ?? []).map((step) => (
                    <div key={step.title} className="rounded-md border border-zinc-800 p-3 light:border-zinc-200">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-sm font-semibold">{step.title}</h3>
                        <StatusBadge tone={step.status === "completed" ? "green" : "blue"}>{step.status}</StatusBadge>
                      </div>
                      <p className="mt-2 text-sm leading-5 text-zinc-400 light:text-zinc-600">{step.detail}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-md border border-zinc-800 bg-black/20 p-3 text-sm light:border-zinc-200 light:bg-zinc-50">
                  <p className="font-semibold">{activeRun.workflowName}</p>
                  <p className="mt-2 text-zinc-400 light:text-zinc-600">{activeRun.summary}</p>
                </div>
              </div>
            )}
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel accent>
            <SectionTitle title={text.ai} />
            {!response && <div className="grid min-h-[220px] place-items-center text-sm text-zinc-400">{text.noRun}</div>}
            {response && (
              <div className="space-y-4">
                <p className="text-sm leading-6 text-zinc-200 light:text-zinc-700">{response.answer}</p>
                <div className="grid gap-2">
                  {response.recommendations.map((item) => (
                    <div key={item.title} className="rounded-md border border-zinc-800 p-3 light:border-zinc-200">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-semibold">{item.title}</h3>
                        <StatusBadge tone={item.priority === "high" ? "red" : item.priority === "medium" ? "gold" : "green"}>{item.priority}</StatusBadge>
                      </div>
                      <p className="mt-2 text-sm text-zinc-400 light:text-zinc-600">{item.rationale}</p>
                    </div>
                  ))}
                </div>
                <ConfidenceRiskStrip response={response} />
              </div>
            )}
          </Panel>

          {response && (
            <div className="grid gap-4 xl:grid-cols-2">
              <Panel>
                <SectionTitle title={text.trace} />
                <AgentWorkflowTrace response={response} />
              </Panel>
              <Panel>
                <SectionTitle title="Lineage / QA" />
                <div className="space-y-3">
                  <DataLineagePanel response={response} />
                  <QualityChecksPanel response={response} />
                </div>
              </Panel>
            </div>
          )}

          <Panel>
            <SectionTitle title={text.report} />
            <div className="grid gap-3 lg:grid-cols-[1fr_180px]">
              <div className="min-h-[260px] rounded-md border border-zinc-800 bg-black/20 p-4 light:border-zinc-200 light:bg-zinc-50">
                <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <FileText className="h-4 w-4 text-united-red" />
                  {text.markdown}
                </p>
                <pre className="max-h-[360px] overflow-auto whitespace-pre-wrap text-xs leading-5 text-zinc-300 light:text-zinc-700">{markdown}</pre>
              </div>
              <div className="grid content-start gap-2">
                <button
                  className="flex h-10 items-center justify-center gap-2 rounded-md border border-zinc-700 px-3 text-sm font-semibold light:border-zinc-200"
                  onClick={copyReport}
                  disabled={!activeRun}
                >
                  <Clipboard className="h-4 w-4 text-united-red" />
                  {copied ? text.copied : text.copy}
                </button>
                <button
                  className="flex h-10 items-center justify-center gap-2 rounded-md border border-zinc-700 px-3 text-sm font-semibold light:border-zinc-200"
                  onClick={downloadReport}
                  disabled={!activeRun}
                >
                  <Download className="h-4 w-4 text-united-red" />
                  {text.download}
                </button>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function ScenarioStep({ number, title, done, active }: { number: number; title: string; done: boolean; active: boolean }) {
  return (
    <div className="rounded-md border border-zinc-800 bg-black/20 p-3 light:border-zinc-200 light:bg-white">
      <div className="flex items-center justify-between gap-3">
        <div className="grid h-8 w-8 place-items-center rounded-full bg-united-red text-sm font-bold text-white">{number}</div>
        {active ? <Loader2 className="h-4 w-4 animate-spin text-united-gold" /> : done ? <CheckCircle2 className="h-4 w-4 text-green-400" /> : <Workflow className="h-4 w-4 text-zinc-500" />}
      </div>
      <h2 className="mt-3 text-sm font-semibold">{title}</h2>
    </div>
  );
}

function MetricTile({ icon: Icon, label, value, tone }: { icon: LucideIcon; label: string; value: string; tone: "red" | "gold" }) {
  return (
    <div className="rounded-md border border-zinc-800 bg-black/20 p-3 light:border-zinc-200 light:bg-zinc-50">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase text-zinc-500">
        <Icon className={tone === "red" ? "h-4 w-4 text-united-red" : "h-4 w-4 text-united-gold"} />
        {label}
      </div>
      <div className="mt-3 text-2xl font-bold">{value}</div>
    </div>
  );
}

function responseFromRun(run: AutomationRunPayload, locale: "ua" | "en"): AiResponse {
  return {
    language: locale === "en" ? "en" : "uk",
    answer: run.report?.executiveSummary ?? run.summary,
    recommendations: run.report?.topRecommendations ?? [],
    trace: run.agentTrace ?? {
      selectedMetrics: [],
      detectedPatterns: [],
      reasoningSummary: run.summary,
      confidence: 0.72,
      riskLevel: "medium"
    },
    usedMetrics: run.agentTrace?.selectedMetrics ?? [],
    dataLineage: run.dataLineage ?? [],
    qualityChecks: run.report?.qualityChecks ?? {
      groundedInData: true,
      missingDataWarnings: [],
      hallucinationRisk: "low"
    }
  };
}

function buildMarkdownReport(run: AutomationRunPayload | null, response: AiResponse | null, locale: "ua" | "en") {
  if (!run || !response) {
    return locale === "en"
      ? "# Demo Intelligence Report\n\nRun the demo scenario to generate a copy-ready executive summary."
      : "# Демо-звіт футбольної розвідки\n\nЗапустіть демо-сценарій, щоб сформувати copy-ready executive summary.";
  }

  const title = locale === "en" ? "# Demo Intelligence Report" : "# Демо-звіт футбольної розвідки";
  const recommendations = response.recommendations
    .map((item) => `- **${item.title}** (${item.priority}): ${item.rationale}`)
    .join("\n");
  const lineage = response.dataLineage
    .map((item) => `- ${item.source}: ${item.metrics.join(", ")} (${item.impact})`)
    .join("\n");

  return [
    title,
    "",
    `**Run ID:** ${run.runId}`,
    `**Workflow:** ${run.workflowName}`,
    `**Status:** ${run.status}`,
    "",
    locale === "en" ? "## Executive Summary" : "## Executive summary",
    response.answer,
    "",
    locale === "en" ? "## Recommendations" : "## Рекомендації",
    recommendations || "-",
    "",
    locale === "en" ? "## Trace Summary" : "## Trace summary",
    response.trace.reasoningSummary,
    "",
    locale === "en" ? "## Data Lineage" : "## Походження даних",
    lineage || "-",
    "",
    locale === "en" ? "## Quality" : "## Якість",
    `- Grounded in data: ${response.qualityChecks.groundedInData ? "yes" : "no"}`,
    `- Hallucination risk: ${response.qualityChecks.hallucinationRisk}`,
    `- Confidence: ${Math.round(response.trace.confidence * 100)}%`
  ].join("\n");
}

"use client";

import { useEffect, useState, type ComponentType } from "react";
import { Activity, AlertTriangle, CheckCircle2, Gauge, ShieldCheck, type LucideProps } from "lucide-react";
import { ConfidenceRiskStrip, DataLineagePanel, QualityChecksPanel } from "@/components/ai-explainability";
import { AiResponsePanel } from "@/components/ai-response-panel";
import { useLocale } from "@/components/providers";
import { Panel, SectionTitle, StatusBadge } from "@/components/ui";
import { defaultFilters } from "@/lib/analytics";
import type { AiResponse } from "@/lib/ai-types";

const copy = {
  ua: {
    title: "Якість AI",
    subtitle: "Evaluation endpoint перевіряє groundedness, missing data, confidence і hallucination risk для AI-висновків.",
    run: "Запустити AI evaluation",
    response: "Оцінка якості",
    empty: "Запусти evaluation, щоб побачити structured quality response.",
    checks: "QA-перевірки",
    grounded: "Grounded у наданих метриках",
    confidence: "Рівень впевненості",
    hallucination: "Ризик галюцинацій",
    missing: "Попередження",
    audit: "Аудит AI-відповіді"
  },
  en: {
    title: "AI Quality",
    subtitle: "The evaluation endpoint checks groundedness, missing data, confidence, and hallucination risk for AI outputs.",
    run: "Run AI evaluation",
    response: "Quality evaluation",
    empty: "Run evaluation to see a structured quality response.",
    checks: "QA checks",
    grounded: "Grounded in supplied metrics",
    confidence: "Confidence level",
    hallucination: "Hallucination risk",
    missing: "Warnings",
    audit: "AI response audit"
  }
} as const;

export default function QualityPage() {
  const { locale } = useLocale();
  const text = copy[locale];
  const [response, setResponse] = useState<AiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void runEvaluation();
    // The evaluation should refresh when the product language changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  async function runEvaluation() {
    setLoading(true);
    try {
      const insightResult = await fetch("/api/ai/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: locale, filters: defaultFilters })
      });
      const previousResponse = (await insightResult.json()) as AiResponse;
      const result = await fetch("/api/ai/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: locale, filters: defaultFilters, previousResponse })
      });
      setResponse((await result.json()) as AiResponse);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <Panel accent>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-united-red">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-sm font-bold uppercase">AI evaluation</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold">{text.title}</h1>
            <p className="mt-1 max-w-3xl text-sm text-zinc-400 light:text-zinc-600">{text.subtitle}</p>
          </div>
          <button
            className="flex h-11 items-center justify-center gap-2 rounded-md bg-united-red px-4 text-sm font-bold text-white shadow-glow"
            onClick={runEvaluation}
            disabled={loading}
          >
            <Activity className="h-4 w-4" />
            {text.run}
          </button>
        </div>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-[360px_1fr]">
        <Panel>
          <SectionTitle title={text.checks} />
          <div className="space-y-3">
            <QualityMetric
              icon={CheckCircle2}
              label={text.grounded}
              value={response?.qualityChecks.groundedInData ? "pass" : response ? "fail" : "pending"}
              tone={response?.qualityChecks.groundedInData ? "green" : response ? "red" : "gold"}
            />
            <QualityMetric
              icon={Gauge}
              label={text.confidence}
              value={response ? `${Math.round(response.trace.confidence * 100)}%` : "pending"}
              tone={response && response.trace.confidence >= 0.75 ? "green" : response && response.trace.confidence >= 0.55 ? "gold" : response ? "red" : "gold"}
            />
            <QualityMetric
              icon={ShieldCheck}
              label={text.hallucination}
              value={response?.qualityChecks.hallucinationRisk ?? "pending"}
              tone={response?.qualityChecks.hallucinationRisk === "high" ? "red" : response?.qualityChecks.hallucinationRisk === "medium" ? "gold" : response ? "green" : "gold"}
            />
            <QualityMetric
              icon={AlertTriangle}
              label={text.missing}
              value={response ? String(response.qualityChecks.missingDataWarnings.length) : "pending"}
              tone={response && response.qualityChecks.missingDataWarnings.length > 1 ? "gold" : "green"}
            />
          </div>
        </Panel>
        <AiResponsePanel response={response} loading={loading} title={text.response} emptyText={text.empty} />
      </div>

      {response && (
        <div className="grid gap-4 xl:grid-cols-[0.8fr_1fr_1fr]">
          <Panel accent>
            <SectionTitle title={text.audit} />
            <ConfidenceRiskStrip response={response} />
          </Panel>
          <DataLineagePanel response={response} panel />
          <QualityChecksPanel response={response} panel />
        </div>
      )}
    </div>
  );
}

function QualityMetric({
  icon: Icon,
  label,
  value,
  tone
}: {
  icon: ComponentType<LucideProps>;
  label: string;
  value: string;
  tone: "green" | "blue" | "gold" | "red";
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-zinc-800 p-3 text-sm light:border-zinc-200">
      <span className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-united-red" />
        {label}
      </span>
      <StatusBadge tone={tone}>{value}</StatusBadge>
    </div>
  );
}

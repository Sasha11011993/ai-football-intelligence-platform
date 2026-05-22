"use client";

import { useState } from "react";
import { Activity, CheckCircle2, ShieldCheck } from "lucide-react";
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
    grounded: "Grounded in supplied metrics",
    lineage: "Data lineage present",
    warnings: "Missing-data warnings returned"
  },
  en: {
    title: "AI Quality",
    subtitle: "The evaluation endpoint checks groundedness, missing data, confidence, and hallucination risk for AI outputs.",
    run: "Run AI evaluation",
    response: "Quality evaluation",
    empty: "Run evaluation to see a structured quality response.",
    checks: "QA checks",
    grounded: "Grounded in supplied metrics",
    lineage: "Data lineage present",
    warnings: "Missing-data warnings returned"
  }
} as const;

export default function QualityPage() {
  const { locale } = useLocale();
  const text = copy[locale];
  const [response, setResponse] = useState<AiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function runEvaluation() {
    setLoading(true);
    try {
      const result = await fetch("/api/ai/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: locale, filters: defaultFilters })
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
            {[text.grounded, text.lineage, text.warnings].map((item, index) => (
              <div key={item} className="flex items-center justify-between gap-3 rounded-md border border-zinc-800 p-3 text-sm light:border-zinc-200">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  {item}
                </span>
                <StatusBadge tone={index === 2 ? "gold" : "green"}>{index === 2 ? "warn" : "pass"}</StatusBadge>
              </div>
            ))}
          </div>
        </Panel>
        <AiResponsePanel response={response} loading={loading} title={text.response} emptyText={text.empty} />
      </div>
    </div>
  );
}

"use client";

import { ListChecks } from "lucide-react";
import { ConfidenceRiskStrip, AiExplainabilityGrid } from "@/components/ai-explainability";
import { Panel, SectionTitle, StatusBadge } from "@/components/ui";
import type { AiResponse } from "@/lib/ai-types";

export function AiResponsePanel({
  response,
  loading,
  title,
  emptyText
}: {
  response: AiResponse | null;
  loading?: boolean;
  title: string;
  emptyText: string;
}) {
  const text = response?.language === "en"
    ? { loading: "AI analysis is running...", recommendations: "Recommendations" }
    : { loading: "AI-аналіз виконується...", recommendations: "Рекомендації" };

  return (
    <Panel accent className="min-h-[360px]">
      <SectionTitle title={title} />
      {loading && <div className="grid min-h-[260px] place-items-center text-sm text-zinc-400">{text.loading}</div>}
      {!loading && !response && <div className="grid min-h-[260px] place-items-center text-sm text-zinc-400">{emptyText}</div>}
      {!loading && response && (
        <div className="space-y-5">
          <div>
            <div className="mb-3">
              <ConfidenceRiskStrip response={response} compact />
            </div>
            <p className="text-sm leading-6 text-zinc-200 light:text-zinc-700">{response.answer}</p>
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <ListChecks className="h-4 w-4 text-united-red" />
              {text.recommendations}
            </div>
            <div className="grid gap-2">
              {response.recommendations.map((item) => (
                <div key={`${item.title}-${item.priority}`} className="rounded-md border border-zinc-800 bg-black/20 p-3 light:border-zinc-200 light:bg-zinc-50">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold">{item.title}</h3>
                    <StatusBadge tone={item.priority === "high" ? "red" : item.priority === "medium" ? "gold" : "green"}>{item.priority}</StatusBadge>
                  </div>
                  <p className="mt-2 text-sm text-zinc-400 light:text-zinc-600">{item.rationale}</p>
                </div>
              ))}
            </div>
          </div>

          <AiExplainabilityGrid response={response} />
        </div>
      )}
    </Panel>
  );
}

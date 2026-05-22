"use client";

import { AlertTriangle, CheckCircle2, Database, ListChecks, ShieldCheck, type LucideIcon } from "lucide-react";
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
  return (
    <Panel accent className="min-h-[360px]">
      <SectionTitle title={title} />
      {loading && <div className="grid min-h-[260px] place-items-center text-sm text-zinc-400">AI analysis is running...</div>}
      {!loading && !response && <div className="grid min-h-[260px] place-items-center text-sm text-zinc-400">{emptyText}</div>}
      {!loading && response && (
        <div className="space-y-5">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <StatusBadge tone={response.trace.riskLevel === "high" ? "red" : response.trace.riskLevel === "medium" ? "gold" : "green"}>
                {response.trace.riskLevel}
              </StatusBadge>
              <StatusBadge tone={response.qualityChecks.groundedInData ? "green" : "red"}>
                grounded
              </StatusBadge>
              <span className="text-xs text-zinc-400">Confidence {Math.round(response.trace.confidence * 100)}%</span>
            </div>
            <p className="text-sm leading-6 text-zinc-200 light:text-zinc-700">{response.answer}</p>
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <ListChecks className="h-4 w-4 text-united-red" />
              Recommendations
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

          <div className="grid gap-3 xl:grid-cols-2">
            <AuditBlock icon={ShieldCheck} title="Trace">
              <p>{response.trace.reasoningSummary}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {response.trace.selectedMetrics.map((metric) => (
                  <span key={metric} className="rounded-md border border-zinc-800 px-2 py-1 text-xs text-zinc-300 light:border-zinc-200 light:text-zinc-600">
                    {metric}
                  </span>
                ))}
              </div>
            </AuditBlock>
            <AuditBlock icon={Database} title="Data lineage">
              <div className="space-y-2">
                {response.dataLineage.slice(0, 4).map((item) => (
                  <div key={`${item.source}-${item.filter}`} className="text-xs">
                    <span className="font-semibold text-zinc-200 light:text-zinc-700">{item.source}</span>
                    <span className="text-zinc-500"> / {item.impact}</span>
                    <p className="mt-1 text-zinc-400 light:text-zinc-600">{item.filter}</p>
                  </div>
                ))}
              </div>
            </AuditBlock>
          </div>

          {response.qualityChecks.missingDataWarnings.length > 0 && (
            <div className="rounded-md border border-yellow-500/40 bg-yellow-500/10 p-3 text-sm text-yellow-200 light:text-yellow-800">
              <div className="mb-2 flex items-center gap-2 font-semibold">
                <AlertTriangle className="h-4 w-4" />
                Quality notes
              </div>
              <ul className="space-y-1">
                {response.qualityChecks.missingDataWarnings.map((warning) => (
                  <li key={warning} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </Panel>
  );
}

function AuditBlock({
  icon: Icon,
  title,
  children
}: {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-zinc-800 bg-black/20 p-3 text-sm light:border-zinc-200 light:bg-zinc-50">
      <div className="mb-2 flex items-center gap-2 font-semibold">
        <Icon className="h-4 w-4 text-united-red" />
        {title}
      </div>
      <div className="text-zinc-400 light:text-zinc-600">{children}</div>
    </div>
  );
}

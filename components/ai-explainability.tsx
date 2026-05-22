"use client";

import { AlertTriangle, CheckCircle2, Database, GitBranch, Gauge, ListChecks, ShieldCheck, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Panel, SectionTitle, StatusBadge } from "@/components/ui";
import type { AiDataLineage, AiResponse } from "@/lib/ai-types";

const labels = {
  uk: {
    trace: "Потік роботи AI-агента",
    selectedMetrics: "Обрані метрики",
    detectedPatterns: "Виявлені патерни",
    auditSummary: "Аудит-висновок",
    recommendations: "Рекомендації",
    dataLineage: "Походження даних",
    source: "Джерело",
    filter: "Фільтр",
    dateRange: "Діапазон",
    metrics: "Метрики",
    impact: "Вплив",
    quality: "QA-перевірки",
    grounded: "Grounded у даних",
    hallucinationRisk: "Ризик галюцинацій",
    missingData: "Обмеження даних",
    noWarnings: "Критичних прогалин у поточному контексті не виявлено.",
    confidence: "Впевненість",
    risk: "Ризик",
    primary: "Основний",
    supporting: "Підтримуючий",
    low: "Низький",
    medium: "Середній",
    high: "Високий",
    yes: "Так",
    no: "Ні",
    match_data: "Матчі",
    derived_metrics: "Похідні метрики",
    player_data: "Гравці",
    fixture_data: "Календар",
    ai_evaluation: "AI-оцінка"
  },
  en: {
    trace: "AI agent workflow trace",
    selectedMetrics: "Selected metrics",
    detectedPatterns: "Detected patterns",
    auditSummary: "Audit summary",
    recommendations: "Recommendations",
    dataLineage: "Data lineage",
    source: "Source",
    filter: "Filter",
    dateRange: "Date range",
    metrics: "Metrics",
    impact: "Impact",
    quality: "Quality checks",
    grounded: "Grounded in data",
    hallucinationRisk: "Hallucination risk",
    missingData: "Data limitations",
    noWarnings: "No critical gaps detected in the current context.",
    confidence: "Confidence",
    risk: "Risk",
    primary: "Primary",
    supporting: "Supporting",
    low: "Low",
    medium: "Medium",
    high: "High",
    yes: "Yes",
    no: "No",
    match_data: "Matches",
    derived_metrics: "Derived metrics",
    player_data: "Players",
    fixture_data: "Fixtures",
    ai_evaluation: "AI evaluation"
  }
} as const;

type UiLanguage = "uk" | "en";

export function ConfidenceRiskStrip({ response, compact = false }: { response: AiResponse; compact?: boolean }) {
  const text = labels[response.language];
  const confidence = Math.round(response.trace.confidence * 100);
  const riskTone = riskBadgeTone(response.trace.riskLevel);

  return (
    <div className={cn("grid gap-3", compact ? "md:grid-cols-2" : "md:grid-cols-[1fr_160px_160px]")}>
      <div className="rounded-md border border-zinc-800 bg-black/20 p-3 light:border-zinc-200 light:bg-zinc-50">
        <div className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold text-zinc-400">
          <span className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-united-red" />
            {text.confidence}
          </span>
          <span className="text-zinc-100 light:text-zinc-900">{confidence}%</span>
        </div>
        <div className="h-2 rounded-full bg-zinc-800 light:bg-zinc-200">
          <div className={cn("h-2 rounded-full", confidence >= 75 ? "bg-green-500" : confidence >= 55 ? "bg-united-gold" : "bg-united-red")} style={{ width: `${confidence}%` }} />
        </div>
      </div>
      <SignalTile label={text.risk} value={text[response.trace.riskLevel]} tone={riskTone} />
      <SignalTile label={text.grounded} value={response.qualityChecks.groundedInData ? text.yes : text.no} tone={response.qualityChecks.groundedInData ? "green" : "red"} />
    </div>
  );
}

export function AiExplainabilityGrid({ response }: { response: AiResponse }) {
  return (
    <div className="grid gap-3 xl:grid-cols-3">
      <AgentWorkflowTrace response={response} />
      <DataLineagePanel response={response} />
      <QualityChecksPanel response={response} />
    </div>
  );
}

export function AgentWorkflowTrace({ response, panel = false }: { response: AiResponse; panel?: boolean }) {
  const text = labels[response.language];
  const content = (
    <AuditShell icon={GitBranch} title={text.trace}>
      <div className="space-y-3">
        <AuditRow label={text.auditSummary}>{response.trace.reasoningSummary}</AuditRow>
        <AuditRow label={text.detectedPatterns}>
          <ul className="space-y-1">
            {response.trace.detectedPatterns.map((pattern) => (
              <li key={pattern} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
                <span>{pattern}</span>
              </li>
            ))}
          </ul>
        </AuditRow>
        <ChipGroup label={text.selectedMetrics} items={response.trace.selectedMetrics} />
        <ChipGroup label={text.metrics} items={response.usedMetrics} />
      </div>
    </AuditShell>
  );

  return panel ? <Panel>{content}</Panel> : content;
}

export function DataLineagePanel({ response, panel = false }: { response: AiResponse; panel?: boolean }) {
  const text = labels[response.language];
  const content = (
    <AuditShell icon={Database} title={text.dataLineage}>
      <div className="space-y-3">
        {response.dataLineage.map((item) => (
          <LineageItem key={`${item.source}-${item.filter}-${item.impact}`} item={item} language={response.language} />
        ))}
      </div>
    </AuditShell>
  );

  return panel ? <Panel>{content}</Panel> : content;
}

export function QualityChecksPanel({ response, panel = false }: { response: AiResponse; panel?: boolean }) {
  const text = labels[response.language];
  const warningTone = response.qualityChecks.hallucinationRisk === "high" ? "red" : response.qualityChecks.hallucinationRisk === "medium" ? "gold" : "green";
  const content = (
    <AuditShell icon={ShieldCheck} title={text.quality}>
      <div className="grid gap-2">
        <QualityRow label={text.grounded} value={response.qualityChecks.groundedInData ? text.yes : text.no} tone={response.qualityChecks.groundedInData ? "green" : "red"} />
        <QualityRow label={text.hallucinationRisk} value={text[response.qualityChecks.hallucinationRisk]} tone={warningTone} />
        <div className="rounded-md border border-zinc-800 p-3 light:border-zinc-200">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
            <AlertTriangle className="h-4 w-4 text-united-gold" />
            {text.missingData}
          </div>
          {response.qualityChecks.missingDataWarnings.length ? (
            <ul className="space-y-2 text-sm text-zinc-400 light:text-zinc-600">
              {response.qualityChecks.missingDataWarnings.map((warning) => (
                <li key={warning} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-united-gold" />
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-zinc-400 light:text-zinc-600">{text.noWarnings}</p>
          )}
        </div>
      </div>
    </AuditShell>
  );

  return panel ? <Panel>{content}</Panel> : content;
}

export function ExplainabilitySection({ response, title }: { response: AiResponse; title?: string }) {
  return (
    <div className="space-y-3">
      {title && <SectionTitle title={title} />}
      <ConfidenceRiskStrip response={response} />
      <AiExplainabilityGrid response={response} />
    </div>
  );
}

function AuditShell({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: React.ReactNode }) {
  return (
    <div className="h-full rounded-md border border-zinc-800 bg-black/20 p-3 light:border-zinc-200 light:bg-zinc-50">
      <div className="mb-3 flex items-center gap-2 font-semibold">
        <Icon className="h-4 w-4 text-united-red" />
        {title}
      </div>
      {children}
    </div>
  );
}

function AuditRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase text-zinc-500">{label}</p>
      <div className="text-sm leading-6 text-zinc-300 light:text-zinc-700">{children}</div>
    </div>
  );
}

function ChipGroup({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase text-zinc-500">{label}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((metric) => (
          <span key={metric} className="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-300 light:border-zinc-300 light:text-zinc-700">
            {metric}
          </span>
        ))}
      </div>
    </div>
  );
}

function LineageItem({ item, language }: { item: AiDataLineage; language: UiLanguage }) {
  const text = labels[language];
  return (
    <div className="rounded-md border border-zinc-800 p-3 light:border-zinc-200">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-semibold">{item.source}</p>
          <p className="text-xs text-zinc-500">{text[item.sourceCategory]}</p>
        </div>
        <StatusBadge tone={item.impact === "primary" ? "blue" : "gold"}>{item.impact === "primary" ? text.primary : text.supporting}</StatusBadge>
      </div>
      <div className="grid gap-2 text-xs text-zinc-400 light:text-zinc-600">
        <span><strong className="text-zinc-300 light:text-zinc-700">{text.filter}:</strong> {item.filter}</span>
        <span><strong className="text-zinc-300 light:text-zinc-700">{text.dateRange}:</strong> {item.dateRange}</span>
        <span><strong className="text-zinc-300 light:text-zinc-700">{text.metrics}:</strong> {item.metrics.join(", ")}</span>
      </div>
    </div>
  );
}

function SignalTile({ label, value, tone }: { label: string; value: string; tone: "green" | "blue" | "gold" | "red" }) {
  return (
    <div className="rounded-md border border-zinc-800 bg-black/20 p-3 light:border-zinc-200 light:bg-zinc-50">
      <p className="mb-2 text-xs font-semibold uppercase text-zinc-500">{label}</p>
      <StatusBadge tone={tone}>{value}</StatusBadge>
    </div>
  );
}

function QualityRow({ label, value, tone }: { label: string; value: string; tone: "green" | "blue" | "gold" | "red" }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-zinc-800 p-3 text-sm light:border-zinc-200">
      <span className="flex items-center gap-2">
        <ListChecks className="h-4 w-4 text-united-red" />
        {label}
      </span>
      <StatusBadge tone={tone}>{value}</StatusBadge>
    </div>
  );
}

function riskBadgeTone(risk: AiResponse["trace"]["riskLevel"]) {
  if (risk === "high") return "red";
  if (risk === "medium") return "gold";
  return "green";
}

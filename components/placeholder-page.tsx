"use client";

import { Activity, Bot, Database, ShieldCheck, Workflow, type LucideIcon } from "lucide-react";
import { Panel, RiskBadge, SectionTitle, StatusBadge } from "@/components/ui";

export function PlaceholderPage({
  title,
  subtitle,
  focus
}: {
  title: string;
  subtitle: string;
  focus: string;
}) {
  return (
    <div className="space-y-4">
      <div>
        <p className="metric-label">Phase 1 placeholder</p>
        <h1 className="mt-2 text-3xl font-bold">{title}</h1>
        <p className="mt-2 max-w-3xl text-zinc-400 light:text-zinc-600">{subtitle}</p>
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel accent>
          <SectionTitle title={focus} action="Відкрити повний модуль" />
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Форма", "72", "+6 за 5 матчів"],
              ["xG диференціал", "+0.38", "+0.27"],
              ["Рівень ризику", "Середній", "Моніторинг"]
            ].map((item) => (
              <div key={item[0]} className="rounded-md border border-zinc-800 bg-black/20 p-4 light:border-zinc-200 light:bg-zinc-50">
                <p className="text-sm text-zinc-400">{item[0]}</p>
                <p className="mt-3 text-3xl font-bold">{item[1]}</p>
                <p className="mt-2 text-sm text-green-400">{item[2]}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <RiskBadge label="Плейсхолдер готовий для підключення даних у Phase 2" />
            <RiskBadge label="AI та автоматизація залишаються mock-only у Phase 1" />
          </div>
        </Panel>
        <Panel>
          <SectionTitle title="Готовність інтеграцій" />
          <div className="space-y-3">
            {([
              [Database, "Supabase: збереження даних", "заплановано"],
              [Bot, "OpenAI Agent", "Phase 3"],
              [Workflow, "n8n автоматизації", "Phase 5"],
              [ShieldCheck, "QA-перевірки", "Phase 4"]
            ] as [LucideIcon, string, string][]).map(([Icon, label, status]) => (
              <div key={String(label)} className="flex items-center justify-between gap-3 rounded-md border border-zinc-800 p-3 light:border-zinc-200">
                <Icon className="h-5 w-5 text-united-red" />
                <span className="min-w-0 flex-1 text-sm">{label}</span>
                <StatusBadge tone="gold">{status}</StatusBadge>
              </div>
            ))}
          </div>
        </Panel>
      </div>
      <Panel>
        <SectionTitle title="Потік даних" />
        <div className="grid gap-3 md:grid-cols-6">
          {["Джерела", "Supabase", "Метрики", "AI Agent", "n8n", "Звіт"].map((step) => (
            <div key={step} className="flex min-h-[86px] items-center justify-center rounded-md border border-zinc-800 bg-black/20 text-center font-semibold light:border-zinc-200 light:bg-zinc-50">
              <Activity className="mr-2 h-5 w-5 text-united-red" />
              {step}
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { Bot, FileText, MessageSquareText, ShieldCheck, Sparkles, Swords } from "lucide-react";
import { AiResponsePanel } from "@/components/ai-response-panel";
import { useLocale } from "@/components/providers";
import { Panel, SectionTitle, StatusBadge } from "@/components/ui";
import { defaultFilters, type AnalyticsFilters } from "@/lib/analytics";
import { competitions, demoFixtures, type Venue } from "@/lib/mock-data";
import type { AiResponse } from "@/lib/ai-types";

const copy = {
  ua: {
    title: "AI-аналітик",
    subtitle: "OpenAI-backed football intelligence assistant, grounded in demo analytics metrics and returned as structured JSON.",
    question: "Питання до аналітика",
    ask: "Запитати",
    refresh: "Оновити insight",
    matchPrep: "Підготовка до матчу",
    weeklyReport: "Weekly report",
    evaluation: "AI evaluation",
    response: "Відповідь AI",
    empty: "Запусти insight або постав питання, щоб побачити структуровану відповідь.",
    filters: "Контекст метрик",
    competition: "Турнір",
    venue: "Місце",
    all: "Усі",
    home: "Дім",
    away: "Виїзд",
    neutral: "Нейтрально",
    from: "Від",
    to: "До",
    prompt: "Чому away form просідає і що тренерському штабу варто моніторити?",
    api: "Server-side OpenAI route",
    structured: "Structured JSON",
    grounded: "Metrics-grounded"
  },
  en: {
    title: "AI Analyst",
    subtitle: "OpenAI-backed football intelligence assistant, grounded in demo analytics metrics and returned as structured JSON.",
    question: "Question for the analyst",
    ask: "Ask",
    refresh: "Refresh insight",
    matchPrep: "Match prep",
    weeklyReport: "Weekly report",
    evaluation: "AI evaluation",
    response: "AI response",
    empty: "Run an insight or ask a question to see a structured response.",
    filters: "Metrics context",
    competition: "Competition",
    venue: "Venue",
    all: "All",
    home: "Home",
    away: "Away",
    neutral: "Neutral",
    from: "From",
    to: "To",
    prompt: "Why has away form dipped and what should the coaching staff monitor?",
    api: "Server-side OpenAI route",
    structured: "Structured JSON",
    grounded: "Metrics-grounded"
  }
} as const;

export default function AiAnalystPage() {
  const { locale } = useLocale();
  const text = copy[locale];
  const [filters, setFilters] = useState<AnalyticsFilters>(defaultFilters);
  const [question, setQuestion] = useState<string>(text.prompt);
  const [response, setResponse] = useState<AiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeRoute, setActiveRoute] = useState("/api/ai/insights");

  useEffect(() => {
    let cancelled = false;
    async function loadInitialInsight() {
      setLoading(true);
      setActiveRoute("/api/ai/insights");
      try {
        const result = await fetch("/api/ai/insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ language: locale, filters })
        });
        const insight = (await result.json()) as AiResponse;
        if (!cancelled) setResponse(insight);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadInitialInsight();

    return () => {
      cancelled = true;
    };
  }, [filters, locale]);

  const actions = useMemo(
    () => [
      { label: text.refresh, route: "/api/ai/insights", icon: Sparkles, body: {} },
      { label: text.ask, route: "/api/ai/chat", icon: MessageSquareText, body: { question } },
      { label: text.matchPrep, route: "/api/ai/match-prep", icon: Swords, body: { fixtureId: demoFixtures[0]?.id } },
      { label: text.weeklyReport, route: "/api/ai/report", icon: FileText, body: {} },
      { label: text.evaluation, route: "/api/ai/evaluate", icon: ShieldCheck, body: { previousResponse: response ?? undefined } }
    ],
    [question, response, text.ask, text.evaluation, text.matchPrep, text.refresh, text.weeklyReport]
  );

  async function run(route: string, extraBody: object) {
    setLoading(true);
    setActiveRoute(route);
    try {
      const result = await fetch(route, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: locale,
          filters,
          ...extraBody
        })
      });
      setResponse((await result.json()) as AiResponse);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <Panel accent>
        <div className="grid gap-4 xl:grid-cols-[1fr_520px] xl:items-end">
          <div>
            <div className="flex items-center gap-2 text-united-red">
              <Bot className="h-5 w-5" />
              <span className="text-sm font-bold uppercase">Manchester United 2025/26</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold">{text.title}</h1>
            <p className="mt-1 max-w-3xl text-sm text-zinc-400 light:text-zinc-600">{text.subtitle}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <StatusBadge tone="green">{text.api}</StatusBadge>
              <StatusBadge tone="blue">{text.structured}</StatusBadge>
              <StatusBadge tone="gold">{text.grounded}</StatusBadge>
            </div>
          </div>

          <div className="grid gap-2">
            <label className="grid gap-1 text-xs text-zinc-400">
              {text.question}
              <textarea
                className="min-h-[96px] resize-none rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 light:border-zinc-200 light:bg-white light:text-zinc-950"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
              />
            </label>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
              {actions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.route}
                    className="flex min-h-[42px] items-center justify-center gap-2 rounded-md border border-zinc-700 bg-black/20 px-3 text-xs font-semibold text-zinc-100 transition hover:border-united-red hover:text-white light:border-zinc-200 light:bg-white light:text-zinc-800"
                    onClick={() => run(action.route, action.body)}
                    disabled={loading}
                  >
                    <Icon className="h-4 w-4 text-united-red" />
                    {action.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-[360px_1fr]">
        <Panel>
          <SectionTitle title={text.filters} />
          <div className="grid gap-3">
            <SelectField label={text.competition} value={filters.competition} onChange={(competition) => setFilters({ ...filters, competition: competition as AnalyticsFilters["competition"] })}>
              <option value="all">{text.all}</option>
              {competitions.map((competition) => <option key={competition} value={competition}>{competition}</option>)}
            </SelectField>
            <SelectField label={text.venue} value={filters.venue} onChange={(venue) => setFilters({ ...filters, venue: venue as AnalyticsFilters["venue"] })}>
              <option value="all">{text.all}</option>
              {(["home", "away", "neutral"] as Venue[]).map((venue) => <option key={venue} value={venue}>{text[venue]}</option>)}
            </SelectField>
            <InputField label={text.from} value={filters.dateFrom} onChange={(dateFrom) => setFilters({ ...filters, dateFrom })} />
            <InputField label={text.to} value={filters.dateTo} onChange={(dateTo) => setFilters({ ...filters, dateTo })} />
            <div className="rounded-md border border-zinc-800 bg-black/20 p-3 text-xs text-zinc-400 light:border-zinc-200 light:bg-zinc-50">
              Active route: <span className="font-semibold text-zinc-200 light:text-zinc-700">{activeRoute}</span>
            </div>
          </div>
        </Panel>

        <AiResponsePanel response={response} loading={loading} title={text.response} emptyText={text.empty} />
      </div>
    </div>
  );
}

function SelectField({ label, value, onChange, children }: { label: string; value: string; onChange: (value: string) => void; children: React.ReactNode }) {
  return (
    <label className="grid gap-1 text-xs text-zinc-400">
      {label}
      <select className="h-10 rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-100 light:border-zinc-200 light:bg-white light:text-zinc-950" value={value} onChange={(event) => onChange(event.target.value)}>
        {children}
      </select>
    </label>
  );
}

function InputField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-1 text-xs text-zinc-400">
      {label}
      <input className="h-10 rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-100 light:border-zinc-200 light:bg-white light:text-zinc-950" type="date" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

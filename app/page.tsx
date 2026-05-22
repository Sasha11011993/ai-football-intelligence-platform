"use client";

import { useEffect, useMemo, useState } from "react";
import type { ComponentProps } from "react";
import { Brain, Database, FileText, GitBranch, Network, SlidersHorizontal, Zap, type LucideIcon } from "lucide-react";
import { AgentWorkflowTrace, ConfidenceRiskStrip, DataLineagePanel, QualityChecksPanel } from "@/components/ai-explainability";
import { CompetitionBarChart, MiniResultBars, RiskMatrix, TacticalRadarChart } from "@/components/analytics-charts";
import { TrendChart } from "@/components/trend-chart";
import { AutomationCard, KpiCard, Panel, RiskBadge, SectionTitle, StatusBadge } from "@/components/ui";
import { useLocale } from "@/components/providers";
import {
  buildCompetitionSplit,
  buildTrendData,
  calculateDeltas,
  calculatePlayerImpact,
  calculateTacticalMetrics,
  calculateTeamMetrics,
  defaultFilters,
  filterMatches,
  resultLabel,
  selectedPlayer,
  shortDate,
  venueLabel,
  type AnalyticsFilters
} from "@/lib/analytics";
import { automationCards, competitions, demoFixtures, demoMatches, demoPlayers, type Venue } from "@/lib/mock-data";
import type { AiResponse } from "@/lib/ai-types";

const copy = {
  ua: {
    filters: "Фільтри аналітики",
    competition: "Турнір",
    venue: "Місце",
    from: "Від",
    to: "До",
    player: "Гравець",
    all: "Усі",
    allPlayers: "Усі гравці",
    home: "Дім",
    away: "Виїзд",
    neutral: "Нейтрально",
    formIndex: "Індекс форми",
    xgd: "xG диференціал",
    defense: "Стабільність захисту",
    impact: "Вплив гравця",
    nextMatch: "Наступний матч",
    anomalyRisk: "Ризик аномалій",
    medium: "Середній",
    monitor: "Моніторинг ключових зон",
    trend: "Тренд xG та xGA",
    split: "Розріз за турнірами",
    recent: "Матчі у вибірці",
    analyst: "AI-аналітик",
    leaders: "Лідери впливу",
    risk: "Матриця ризиків",
    trace: "Потік роботи AI-агента",
    automation: "Центр автоматизації",
    flow: "Потік даних",
    systems: "Усі системи працюють у демо-режимі",
    metrics: "Обрані метрики",
    pattern: "Виявлений патерн",
    confidence: "Рівень впевненості",
    riskLevel: "Рівень ризику",
    fullAnalysis: "Переглянути повний аналіз",
    viewAll: "Переглянути всі",
    date: "Дата",
    opponent: "Суперник",
    score: "Рахунок",
    result: "Рез.",
    control: "Контроль",
    selectedPlayer: "Обраний гравець",
    noMatches: "Немає матчів для обраних фільтрів"
  },
  en: {
    filters: "Analytics filters",
    competition: "Competition",
    venue: "Venue",
    from: "From",
    to: "To",
    player: "Player",
    all: "All",
    allPlayers: "All players",
    home: "Home",
    away: "Away",
    neutral: "Neutral",
    formIndex: "Form index",
    xgd: "xG differential",
    defense: "Defensive stability",
    impact: "Player impact",
    nextMatch: "Next match",
    anomalyRisk: "Anomaly risk",
    medium: "Medium",
    monitor: "Monitoring key zones",
    trend: "xG and xGA trend",
    split: "Competition split",
    recent: "Matches in scope",
    analyst: "AI analyst",
    leaders: "Impact leaders",
    risk: "Risk matrix",
    trace: "AI agent workflow",
    automation: "Automation hub",
    flow: "Data flow",
    systems: "All systems are running in demo mode",
    metrics: "Selected metrics",
    pattern: "Detected pattern",
    confidence: "Confidence level",
    riskLevel: "Risk level",
    fullAnalysis: "View full analysis",
    viewAll: "View all",
    date: "Date",
    opponent: "Opponent",
    score: "Score",
    result: "Res.",
    control: "Control",
    selectedPlayer: "Selected player",
    noMatches: "No matches for selected filters"
  }
} as const;

export default function OverviewPage() {
  const { locale } = useLocale();
  const text = copy[locale];
  const [filters, setFilters] = useState<AnalyticsFilters>(defaultFilters);
  const [aiInsight, setAiInsight] = useState<AiResponse | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const scopedMatches = useMemo(() => filterMatches(filters), [filters]);
  const teamMetrics = useMemo(() => calculateTeamMetrics(scopedMatches), [scopedMatches]);
  const tacticalMetrics = useMemo(() => calculateTacticalMetrics(scopedMatches), [scopedMatches]);
  const deltas = useMemo(() => calculateDeltas(scopedMatches), [scopedMatches]);
  const players = useMemo(() => calculatePlayerImpact(), []);
  const selected = selectedPlayer(filters);
  const trendData = useMemo(() => buildTrendData(scopedMatches), [scopedMatches]);
  const splitData = useMemo(() => buildCompetitionSplit(scopedMatches), [scopedMatches]);
  const nextFixture = demoFixtures[0];

  const kpiBars = scopedMatches.slice(-10).map((match) => 10 + match.xG * 11);

  useEffect(() => {
    let cancelled = false;
    async function loadInsight() {
      setAiLoading(true);
      try {
        const result = await fetch("/api/ai/insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ language: locale, filters })
        });
        const insight = (await result.json()) as AiResponse;
        if (!cancelled) setAiInsight(insight);
      } catch {
        if (!cancelled) setAiInsight(null);
      } finally {
        if (!cancelled) setAiLoading(false);
      }
    }

    void loadInsight();

    return () => {
      cancelled = true;
    };
  }, [filters, locale]);

  return (
    <div className="space-y-4">
      <AnalyticsFiltersPanel filters={filters} setFilters={setFilters} text={text} />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        <KpiCard accent label={text.formIndex} value={String(teamMetrics.formIndex)} delta={formatDelta(deltas.formIndex, locale)} />
        <KpiCard label={text.xgd} value={signed(teamMetrics.xGD)} delta={formatDelta(deltas.xGD, locale)} />
        <KpiCard label={text.defense} value={String(teamMetrics.defensiveStability)} delta={formatDelta(deltas.defensiveStability, locale)} tone={teamMetrics.defensiveStability < 58 ? "gold" : "green"} />
        <KpiCard label={text.impact} value={String(selected?.impactScore ?? players[0]?.impactScore ?? 0)} delta={selected ? selected.name : players[0]?.name ?? "-"} />
        <Panel className="min-h-[138px]">
          <p className="text-center text-sm text-zinc-300 light:text-zinc-600">{text.nextMatch}</p>
          <div className="mt-4 flex items-center justify-center gap-4">
            <div className="rounded-md border border-united-red bg-black/30 px-4 py-2 text-center light:bg-zinc-50">
              <p className="text-xs font-bold text-united-red">{shortDate(nextFixture.date).split(" ")[1]}</p>
              <p className="text-3xl font-bold">{new Date(nextFixture.date).getDate()}</p>
            </div>
            <div>
              <p className="font-bold">{nextFixture.opponent} ({venueLabel(nextFixture.venue, locale)})</p>
              <p className="mt-1 text-xs text-zinc-400">{nextFixture.competition}</p>
              <p className="text-xs text-zinc-400">16:30 BST</p>
            </div>
          </div>
        </Panel>
        <Panel>
          <p className="text-center text-sm text-zinc-300 light:text-zinc-600">{text.anomalyRisk}</p>
          <div className="mt-4 text-center text-4xl font-bold text-united-gold">{riskLabel(tacticalMetrics.tacticalRiskScore, locale)}</div>
          <p className="mt-3 text-center text-sm text-zinc-400">{text.monitor}: {Math.round(tacticalMetrics.tacticalRiskScore)}/100</p>
          <div className="mt-4 h-2 rounded-full bg-zinc-800 light:bg-zinc-200">
            <div className="h-2 rounded-full bg-united-gold" style={{ width: `${tacticalMetrics.tacticalRiskScore}%` }} />
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_0.8fr_0.9fr]">
        <Panel>
          <SectionTitle title={`${text.trend} (${teamMetrics.matches})`} />
          {trendData.length ? <TrendChart data={trendData} /> : <EmptyState text={text.noMatches} />}
        </Panel>
        <Panel>
          <SectionTitle title={text.split} />
          {splitData.length ? <CompetitionBarChart data={splitData} /> : <EmptyState text={text.noMatches} />}
        </Panel>
        <Panel accent>
          <SectionTitle title={text.analyst} action={text.fullAnalysis} />
          {aiLoading && <div className="grid min-h-[170px] place-items-center text-sm text-zinc-400">AI analysis is running...</div>}
          {!aiLoading && aiInsight ? (
            <div className="space-y-3">
              <p className="line-clamp-4 text-sm leading-6 text-zinc-200 light:text-zinc-700">{aiInsight.answer}</p>
              {aiInsight.recommendations.slice(0, 3).map((item) => (
                <RiskBadge key={item.title} label={`${item.title}: ${item.rationale}`} />
              ))}
              <ConfidenceRiskStrip response={aiInsight} compact />
            </div>
          ) : (
            <div className="space-y-3">
              <RiskBadge label={locale === "ua" ? `Гостьовий індекс форми: ${teamMetrics.awayFormIndex}. Потрібна компактність після втрат.` : `Away form index: ${teamMetrics.awayFormIndex}. Compactness after turnovers needs attention.`} />
              <RiskBadge label={locale === "ua" ? `Тактичний ризик ${Math.round(tacticalMetrics.tacticalRiskScore)}/100, головний драйвер - перехідна оборона.` : `Tactical risk is ${Math.round(tacticalMetrics.tacticalRiskScore)}/100, driven mostly by transition defense.`} />
              <RiskBadge label={locale === "ua" ? `Найсильніший вплив у вибірці: ${players[0]?.name} (${players[0]?.impactScore}).` : `Top player impact in scope: ${players[0]?.name} (${players[0]?.impactScore}).`} />
            </div>
          )}
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_0.95fr_1.1fr]">
        <Panel>
          <SectionTitle title={text.leaders} action={text.viewAll} />
          <div className="space-y-2">
            {players.slice(0, 6).map((player, index) => (
              <div key={player.id} className="grid grid-cols-[32px_1fr_54px_80px] items-center gap-3 rounded-md border border-zinc-800 px-3 py-2 light:border-zinc-200">
                <span className="text-zinc-500">{index + 1}</span>
                <span className="min-w-0 truncate font-medium">{player.name}</span>
                <span>{player.impactScore}</span>
                <span className={player.formTrend === "down" ? "text-united-red" : player.formTrend === "flat" ? "text-united-gold" : "text-green-400"}>
                  {player.formTrend === "flat" ? "—" : "● ● ●"}
                </span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel>
          <SectionTitle title={text.risk} />
          <RiskMatrix metrics={tacticalMetrics} />
        </Panel>
        <Panel accent>
          <SectionTitle title={text.trace} action={text.fullAnalysis} />
          {aiInsight ? (
            <div className="space-y-3">
              <ConfidenceRiskStrip response={aiInsight} compact />
              <AgentWorkflowTrace response={aiInsight} />
            </div>
          ) : (
            <div className="grid gap-2 text-sm">
              {[
                [text.metrics, `xG ${teamMetrics.xG}, xGA ${teamMetrics.xGA}, ${text.control} ${Math.round(tacticalMetrics.matchControl)}`],
                [text.pattern, tacticalMetrics.transitionRisk > 60 ? (locale === "ua" ? "Ризик швидких атак після втрат" : "Counter-attack risk after turnovers") : (locale === "ua" ? "Контроль матчу стабільний" : "Match control is stable")],
                [text.confidence, `${Math.min(92, 70 + teamMetrics.matches)}%`],
                [text.riskLevel, riskLabel(tacticalMetrics.tacticalRiskScore, locale)]
              ].map(([label, value]) => (
                <div key={label} className="grid grid-cols-[145px_1fr] gap-3 rounded-md border border-zinc-800 p-3 light:border-zinc-200">
                  <span className="text-zinc-400">{label}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>

      {aiInsight && (
        <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
          <DataLineagePanel response={aiInsight} panel />
          <QualityChecksPanel response={aiInsight} panel />
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-[1fr_0.75fr]">
        <Panel>
          <SectionTitle title={text.recent} />
          <MatchesTable matches={scopedMatches} locale={locale} text={text} />
        </Panel>
        <Panel>
          <SectionTitle title={locale === "ua" ? "Тактичний профіль" : "Tactical profile"} />
          <TacticalRadarChart metrics={tacticalMetrics} />
          <MiniResultBars values={kpiBars} />
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Panel accent>
          <SectionTitle title={text.automation} />
          <div className="grid gap-3 md:grid-cols-4">
            {automationCards.map(([title, status, meta]) => (
              <AutomationCard key={title} title={title} status={status} meta={meta} />
            ))}
          </div>
        </Panel>
        <Panel accent>
          <SectionTitle title={text.flow} />
          <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
            {([
              [FileText, locale === "ua" ? "Джерела" : "Sources"],
              [Database, "Supabase"],
              [BarIcon, locale === "ua" ? "Метрики" : "Metrics"],
              [Brain, "AI Agent"],
              [GitBranch, "n8n"],
              [Network, locale === "ua" ? "Звіт" : "Report"]
            ] as [LucideIcon, string][]).map(([Icon, label]) => (
              <div key={label} className="flex min-h-[92px] flex-col items-center justify-center rounded-md border border-zinc-800 bg-black/20 p-3 text-center text-sm light:border-zinc-200 light:bg-zinc-50">
                <Icon className="mb-2 h-7 w-7 text-zinc-200 light:text-zinc-700" />
                {label}
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between rounded-md border border-zinc-800 p-3 text-sm light:border-zinc-200">
            <span className="flex items-center gap-2 text-green-400"><span className="h-2 w-2 rounded-full bg-green-500" /> {text.systems}</span>
            <StatusBadge tone="green">mock</StatusBadge>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function AnalyticsFiltersPanel({
  filters,
  setFilters,
  text
}: {
  filters: AnalyticsFilters;
  setFilters: (filters: AnalyticsFilters) => void;
  text: (typeof copy)["ua"] | (typeof copy)["en"];
}) {
  return (
    <Panel className="p-3">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.2fr_1fr_1fr_1fr_1fr_1.35fr]">
        <div className="flex items-center gap-2 font-semibold">
          <SlidersHorizontal className="h-5 w-5 text-united-red" />
          {text.filters}
        </div>
        <SelectField label={text.competition} value={filters.competition} onChange={(competition) => setFilters({ ...filters, competition: competition as AnalyticsFilters["competition"] })}>
          <option value="all">{text.all}</option>
          {competitions.map((competition) => <option key={competition} value={competition}>{competition}</option>)}
        </SelectField>
        <SelectField label={text.venue} value={filters.venue} onChange={(venue) => setFilters({ ...filters, venue: venue as AnalyticsFilters["venue"] })}>
          <option value="all">{text.all}</option>
          {(["home", "away", "neutral"] as Venue[]).map((venue) => <option key={venue} value={venue}>{text[venue]}</option>)}
        </SelectField>
        <InputField label={text.from} type="date" value={filters.dateFrom} onChange={(dateFrom) => setFilters({ ...filters, dateFrom })} />
        <InputField label={text.to} type="date" value={filters.dateTo} onChange={(dateTo) => setFilters({ ...filters, dateTo })} />
        <SelectField label={text.player} value={filters.playerId} onChange={(playerId) => setFilters({ ...filters, playerId })}>
          <option value="all">{text.allPlayers}</option>
          {demoPlayers.map((player) => <option key={player.id} value={player.id}>{player.name}</option>)}
        </SelectField>
      </div>
    </Panel>
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

function InputField({ label, type, value, onChange }: { label: string; type: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-1 text-xs text-zinc-400">
      {label}
      <input className="h-10 rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-100 light:border-zinc-200 light:bg-white light:text-zinc-950" type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function MatchesTable({ matches, locale, text }: { matches: typeof demoMatches; locale: "ua" | "en"; text: (typeof copy)["ua"] | (typeof copy)["en"] }) {
  if (!matches.length) return <EmptyState text={text.noMatches} />;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-sm">
        <thead className="text-left text-zinc-400">
          <tr>{[text.date, text.opponent, text.competition, text.venue, text.score, text.result, "xG", "xGA", text.control].map((h) => <th key={h} className="border-b border-zinc-800 pb-2 font-medium light:border-zinc-200">{h}</th>)}</tr>
        </thead>
        <tbody>
          {matches.slice().reverse().map((match) => (
            <tr key={match.id} className="border-b border-zinc-900/80 light:border-zinc-100">
              <td className="py-2.5 text-zinc-300 light:text-zinc-700">{shortDate(match.date)}</td>
              <td className="py-2.5 font-medium">{match.opponent}</td>
              <td className="py-2.5 text-zinc-300 light:text-zinc-700">{match.competition}</td>
              <td className="py-2.5 text-zinc-300 light:text-zinc-700">{venueLabel(match.venue, locale)}</td>
              <td className="py-2.5">{match.goalsFor} - {match.goalsAgainst}</td>
              <td className="py-2.5"><StatusBadge tone={match.result === "win" ? "green" : match.result === "draw" ? "gold" : "red"}>{resultLabel(match.result, locale)}</StatusBadge></td>
              <td className="py-2.5 text-zinc-300 light:text-zinc-700">{match.xG.toFixed(2)}</td>
              <td className="py-2.5 text-zinc-300 light:text-zinc-700">{match.xGA.toFixed(2)}</td>
              <td className="py-2.5 text-zinc-300 light:text-zinc-700">{match.matchControl}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="grid min-h-[180px] place-items-center rounded-md border border-dashed border-zinc-800 text-sm text-zinc-400 light:border-zinc-200">{text}</div>;
}

function signed(value: number) {
  return value > 0 ? `+${value}` : String(value);
}

function formatDelta(value: number, locale: "ua" | "en") {
  const prefix = value >= 0 ? "↑" : "↓";
  const suffix = locale === "ua" ? " проти сезону" : " vs season";
  return `${prefix} ${Math.abs(value)}${suffix}`;
}

function riskLabel(value: number, locale: "ua" | "en") {
  if (value >= 68) return locale === "ua" ? "Високий" : "High";
  if (value >= 48) return locale === "ua" ? "Середній" : "Medium";
  return locale === "ua" ? "Низький" : "Low";
}

function BarIcon(props: ComponentProps<typeof Zap>) {
  return <Zap {...props} />;
}

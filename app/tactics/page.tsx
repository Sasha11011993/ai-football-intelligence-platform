"use client";

import { useMemo, useState } from "react";
import { Gauge, SlidersHorizontal } from "lucide-react";
import { RiskMatrix, TacticalRadarChart } from "@/components/analytics-charts";
import { Panel, SectionTitle, StatusBadge } from "@/components/ui";
import { useLocale } from "@/components/providers";
import { calculateTacticalMetrics, defaultFilters, filterMatches, shortDate, venueLabel, type AnalyticsFilters } from "@/lib/analytics";
import { competitions, type Venue } from "@/lib/mock-data";

const copy = {
  ua: {
    title: "Тактичний аналіз",
    subtitle: "Пресинг, контроль матчу, перехідна оборона, ризик зон і стабільність моделі гри.",
    filters: "Фільтри",
    competition: "Турнір",
    venue: "Місце",
    all: "Усі",
    home: "Дім",
    away: "Виїзд",
    neutral: "Нейтрально",
    profile: "Тактичний профіль",
    risk: "Матриця ризиків",
    matches: "Матчі та тактичні сигнали",
    pressing: "Інтенсивність пресингу",
    buildup: "Якість розіграшу",
    chances: "Створення моментів",
    defensive: "Захисний ризик",
    transition: "Перехідний ризик",
    control: "Контроль матчу",
    riskScore: "Тактичний ризик",
    high: "високий",
    medium: "середній",
    low: "низький"
  },
  en: {
    title: "Tactical Analysis",
    subtitle: "Pressing, match control, transition defense, zone risk, and stability of the game model.",
    filters: "Filters",
    competition: "Competition",
    venue: "Venue",
    all: "All",
    home: "Home",
    away: "Away",
    neutral: "Neutral",
    profile: "Tactical profile",
    risk: "Risk matrix",
    matches: "Matches and tactical signals",
    pressing: "Pressing intensity",
    buildup: "Build-up quality",
    chances: "Chance creation",
    defensive: "Defensive risk",
    transition: "Transition risk",
    control: "Match control",
    riskScore: "Tactical risk",
    high: "high",
    medium: "medium",
    low: "low"
  }
} as const;

export default function TacticsPage() {
  const { locale } = useLocale();
  const text = copy[locale];
  const [filters, setFilters] = useState<AnalyticsFilters>(defaultFilters);
  const matches = useMemo(() => filterMatches(filters), [filters]);
  const metrics = useMemo(() => calculateTacticalMetrics(matches), [matches]);

  return (
    <div className="space-y-4">
      <Panel accent>
        <div className="grid gap-4 xl:grid-cols-[1fr_460px] xl:items-end">
          <div>
            <div className="flex items-center gap-2 text-united-red">
              <Gauge className="h-5 w-5" />
              <span className="text-sm font-bold uppercase">Manchester United 2025/26</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold">{text.title}</h1>
            <p className="mt-1 max-w-3xl text-sm text-zinc-400 light:text-zinc-600">{text.subtitle}</p>
          </div>
          <div className="grid gap-3 md:grid-cols-[1fr_1fr]">
            <label className="grid gap-1 text-xs text-zinc-400">
              <span className="flex items-center gap-2"><SlidersHorizontal className="h-4 w-4" /> {text.competition}</span>
              <select className="h-10 rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-100 light:border-zinc-200 light:bg-white light:text-zinc-950" value={filters.competition} onChange={(event) => setFilters({ ...filters, competition: event.target.value as AnalyticsFilters["competition"] })}>
                <option value="all">{text.all}</option>
                {competitions.map((competition) => <option key={competition} value={competition}>{competition}</option>)}
              </select>
            </label>
            <label className="grid gap-1 text-xs text-zinc-400">
              {text.venue}
              <select className="h-10 rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-100 light:border-zinc-200 light:bg-white light:text-zinc-950" value={filters.venue} onChange={(event) => setFilters({ ...filters, venue: event.target.value as AnalyticsFilters["venue"] })}>
                <option value="all">{text.all}</option>
                {(["home", "away", "neutral"] as Venue[]).map((venue) => <option key={venue} value={venue}>{text[venue]}</option>)}
              </select>
            </label>
          </div>
        </div>
      </Panel>

      <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
        <Metric label={text.pressing} value={metrics.pressingIntensity} />
        <Metric label={text.buildup} value={metrics.buildUpQuality} />
        <Metric label={text.chances} value={metrics.chanceCreation} />
        <Metric label={text.defensive} value={metrics.defensiveRisk} risk />
        <Metric label={text.transition} value={metrics.transitionRisk} risk />
        <Metric label={text.control} value={metrics.matchControl} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.85fr_1fr_0.85fr]">
        <Panel>
          <SectionTitle title={text.profile} />
          <TacticalRadarChart metrics={metrics} />
        </Panel>
        <Panel>
          <SectionTitle title={text.matches} />
          <div className="space-y-2">
            {matches.slice().reverse().slice(0, 9).map((match) => (
              <div key={match.id} className="grid grid-cols-[70px_1fr_70px_80px_80px] items-center gap-3 rounded-md border border-zinc-800 px-3 py-2 text-sm light:border-zinc-200">
                <span className="text-zinc-400">{shortDate(match.date)}</span>
                <span className="min-w-0 truncate font-medium">{match.opponent}</span>
                <span className="text-zinc-400">{venueLabel(match.venue, locale)}</span>
                <span>{match.matchControl}</span>
                <StatusBadge tone={match.defensiveRisk > 66 ? "red" : match.defensiveRisk > 48 ? "gold" : "green"}>{match.defensiveRisk}</StatusBadge>
              </div>
            ))}
          </div>
        </Panel>
        <Panel accent>
          <SectionTitle title={text.riskScore} />
          <div className="text-center">
            <div className="text-6xl font-bold text-united-gold">{Math.round(metrics.tacticalRiskScore)}</div>
            <p className="mt-2 text-sm text-zinc-400">{riskLabel(metrics.tacticalRiskScore, text)}</p>
          </div>
          <div className="mt-6">
            <RiskMatrix metrics={metrics} />
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Metric({ label, value, risk }: { label: string; value: number; risk?: boolean }) {
  const tone = risk ? (value > 66 ? "text-united-red" : value > 48 ? "text-united-gold" : "text-green-400") : "text-zinc-100 light:text-zinc-950";
  return (
    <Panel>
      <p className="text-center text-sm text-zinc-400">{label}</p>
      <p className={`mt-3 text-center text-4xl font-bold ${tone}`}>{Math.round(value)}</p>
      <div className="mt-4 h-2 rounded-full bg-zinc-800 light:bg-zinc-200">
        <div className="h-2 rounded-full bg-united-red" style={{ width: `${Math.min(100, value)}%` }} />
      </div>
    </Panel>
  );
}

function riskLabel(value: number, text: (typeof copy)["ua"] | (typeof copy)["en"]) {
  if (value >= 68) return text.high;
  if (value >= 48) return text.medium;
  return text.low;
}

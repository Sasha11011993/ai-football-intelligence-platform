import {
  buildCompetitionSplit,
  buildTrendData,
  calculateDeltas,
  calculatePlayerImpact,
  calculateTacticalMetrics,
  calculateTeamMetrics,
  defaultFilters,
  filterMatches,
  type AnalyticsFilters
} from "@/lib/analytics";
import { demoFixtures } from "@/lib/mock-data";
import type { AiDataLineage, AiLanguage, AiQualityChecks } from "@/lib/ai-types";

export type AiMetricsContext = ReturnType<typeof buildAiContext>;

export function normalizeLanguage(language?: "ua" | AiLanguage): AiLanguage {
  return language === "en" ? "en" : "uk";
}

export function normalizeFilters(filters?: Partial<AnalyticsFilters>): AnalyticsFilters {
  return {
    ...defaultFilters,
    ...filters
  };
}

export function buildAiContext(input?: {
  filters?: Partial<AnalyticsFilters>;
  fixtureId?: string;
}) {
  const filters = normalizeFilters(input?.filters);
  const matches = filterMatches(filters);
  const teamMetrics = calculateTeamMetrics(matches);
  const tacticalMetrics = calculateTacticalMetrics(matches);
  const deltas = calculateDeltas(matches);
  const players = calculatePlayerImpact();
  const fixture = demoFixtures.find((item) => item.id === input?.fixtureId) ?? demoFixtures[0];
  const trend = buildTrendData(matches);
  const competitionSplit = buildCompetitionSplit(matches);
  const recentMatches = matches
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5)
    .map((match) => ({
      date: match.date,
      opponent: match.opponent,
      competition: match.competition,
      venue: match.venue,
      score: `${match.goalsFor}-${match.goalsAgainst}`,
      result: match.result,
      xG: match.xG,
      xGA: match.xGA,
      matchControl: match.matchControl,
      defensiveRisk: match.defensiveRisk,
      transitionRisk: match.transitionRisk
    }));

  const topPlayers = players.slice(0, 5).map((player) => ({
    name: player.name,
    position: player.position,
    impactScore: player.impactScore,
    goals: player.goals,
    assists: player.assists,
    xG: player.xG,
    xA: player.xA,
    formTrend: player.formTrend,
    injuryStatus: player.injuryStatus
  }));

  const trendSummary = {
    firstMatch: trend[0] ?? null,
    lastMatch: trend.at(-1) ?? null,
    recentXG: roundAverage(trend.slice(-5).map((item) => item.xG)),
    recentXGA: roundAverage(trend.slice(-5).map((item) => item.xGA)),
    recentControl: roundAverage(trend.slice(-5).map((item) => item.control)),
    recentRisk: roundAverage(trend.slice(-5).map((item) => item.risk))
  };

  const missingDataWarnings = [
    "Demo dataset is local and not official live football data.",
    matches.length < 5 ? "Selected filter has fewer than five matches, so confidence is reduced." : ""
  ].filter(Boolean);

  const dataLineage: AiDataLineage[] = [
    {
      source: "matches",
      filter: describeFilters(filters),
      impact: "primary"
    },
    {
      source: "derived_metrics",
      filter: "team, tactical, form, competition split, trend summaries",
      impact: "primary"
    },
    {
      source: "players",
      filter: "top five player impact profiles",
      impact: "supporting"
    },
    {
      source: "fixtures",
      filter: fixture ? `next fixture: ${fixture.opponent}` : "no fixture selected",
      impact: "supporting"
    }
  ];

  const qualityChecks: AiQualityChecks = {
    groundedInData: true,
    missingDataWarnings,
    hallucinationRisk: matches.length < 5 ? "medium" : "low"
  };

  return {
    filters,
    sampleSize: {
      matches: matches.length,
      players: topPlayers.length,
      fixtures: demoFixtures.length
    },
    teamMetrics,
    tacticalMetrics,
    deltas,
    topPlayers,
    nextFixture: fixture,
    recentMatches,
    trendSummary,
    competitionSplit,
    riskSignals: buildRiskSignals(teamMetrics, tacticalMetrics),
    dataLineage,
    qualityChecks
  };
}

export function describeFilters(filters: AnalyticsFilters) {
  return [
    `competition=${filters.competition}`,
    `venue=${filters.venue}`,
    `date=${filters.dateFrom}..${filters.dateTo}`,
    `player=${filters.playerId}`
  ].join("; ");
}

function buildRiskSignals(
  teamMetrics: ReturnType<typeof calculateTeamMetrics>,
  tacticalMetrics: ReturnType<typeof calculateTacticalMetrics>
) {
  return [
    {
      metric: "awayFormIndex",
      value: teamMetrics.awayFormIndex,
      status: teamMetrics.awayFormIndex < 45 ? "risk" : "watch"
    },
    {
      metric: "tacticalRiskScore",
      value: tacticalMetrics.tacticalRiskScore,
      status: tacticalMetrics.tacticalRiskScore > 68 ? "risk" : tacticalMetrics.tacticalRiskScore > 48 ? "watch" : "stable"
    },
    {
      metric: "transitionRisk",
      value: tacticalMetrics.transitionRisk,
      status: tacticalMetrics.transitionRisk > 62 ? "risk" : "watch"
    },
    {
      metric: "defensiveStability",
      value: teamMetrics.defensiveStability,
      status: teamMetrics.defensiveStability < 58 ? "risk" : "stable"
    }
  ];
}

function roundAverage(values: number[]) {
  if (!values.length) return 0;
  const sum = values.reduce((acc, value) => acc + value, 0);
  return Math.round((sum / values.length) * 10) / 10;
}


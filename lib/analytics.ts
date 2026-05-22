import { demoMatches, demoPlayers, type Competition, type Match, type PlayerStat, type Venue } from "@/lib/mock-data";

export type AnalyticsFilters = {
  competition: "all" | Competition;
  venue: "all" | Venue;
  dateFrom: string;
  dateTo: string;
  playerId: "all" | string;
};

export type TeamMetric = {
  matches: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  xG: number;
  xGA: number;
  xGD: number;
  cleanSheets: number;
  conversionRate: number;
  formIndex: number;
  awayFormIndex: number;
  defensiveStability: number;
};

export type TacticalMetric = {
  pressingIntensity: number;
  buildUpQuality: number;
  chanceCreation: number;
  defensiveRisk: number;
  transitionRisk: number;
  setPieceThreat: number;
  matchControl: number;
  tacticalRiskScore: number;
};

export type PlayerWithImpact = PlayerStat & {
  impactScore: number;
  minutesShare: number;
  goalContribution: number;
};

export const defaultFilters: AnalyticsFilters = {
  competition: "all",
  venue: "all",
  dateFrom: "2025-08-01",
  dateTo: "2026-02-28",
  playerId: "all"
};

const resultPoints = {
  win: 3,
  draw: 1,
  loss: 0
} as const;

export function filterMatches(filters: AnalyticsFilters, matches = demoMatches) {
  return matches.filter((match) => {
    const byCompetition = filters.competition === "all" || match.competition === filters.competition;
    const byVenue = filters.venue === "all" || match.venue === filters.venue;
    const byDate = match.date >= filters.dateFrom && match.date <= filters.dateTo;
    return byCompetition && byVenue && byDate;
  });
}

export function calculateTeamMetrics(matches: Match[]): TeamMetric {
  const count = matches.length || 1;
  const totals = matches.reduce(
    (acc, match) => {
      acc.goalsFor += match.goalsFor;
      acc.goalsAgainst += match.goalsAgainst;
      acc.xG += match.xG;
      acc.xGA += match.xGA;
      acc.shots += match.shots;
      acc.points += resultPoints[match.result];
      acc.cleanSheets += match.goalsAgainst === 0 ? 1 : 0;
      acc.wins += match.result === "win" ? 1 : 0;
      acc.draws += match.result === "draw" ? 1 : 0;
      acc.losses += match.result === "loss" ? 1 : 0;
      return acc;
    },
    {
      goalsFor: 0,
      goalsAgainst: 0,
      xG: 0,
      xGA: 0,
      shots: 0,
      points: 0,
      cleanSheets: 0,
      wins: 0,
      draws: 0,
      losses: 0
    }
  );

  const avgGoalsAgainst = totals.goalsAgainst / count;
  const avgXGA = totals.xGA / count;
  const avgDefensiveRisk = average(matches, "defensiveRisk");

  return {
    matches: matches.length,
    wins: totals.wins,
    draws: totals.draws,
    losses: totals.losses,
    goalsFor: totals.goalsFor,
    goalsAgainst: totals.goalsAgainst,
    points: totals.points,
    xG: round(totals.xG),
    xGA: round(totals.xGA),
    xGD: round(totals.xG - totals.xGA),
    cleanSheets: totals.cleanSheets,
    conversionRate: round((totals.goalsFor / Math.max(totals.shots, 1)) * 100, 1),
    formIndex: calculateFormIndex(matches),
    awayFormIndex: calculateFormIndex(matches.filter((match) => match.venue === "away")),
    defensiveStability: clamp(100 - (avgGoalsAgainst * 16 + avgXGA * 14 + avgDefensiveRisk * 0.68))
  };
}

export function calculateTacticalMetrics(matches: Match[]): TacticalMetric {
  const defensiveRisk = average(matches, "defensiveRisk");
  const transitionRisk = average(matches, "transitionRisk");
  const matchControl = average(matches, "matchControl");

  return {
    pressingIntensity: round(average(matches, "pressingIntensity"), 1),
    buildUpQuality: round(average(matches, "buildUpQuality"), 1),
    chanceCreation: round(average(matches, "chanceCreation"), 1),
    defensiveRisk: round(defensiveRisk, 1),
    transitionRisk: round(transitionRisk, 1),
    setPieceThreat: round(average(matches, "setPieceThreat"), 1),
    matchControl: round(matchControl, 1),
    tacticalRiskScore: clamp(defensiveRisk * 0.44 + transitionRisk * 0.38 + (100 - matchControl) * 0.18)
  };
}

export function calculatePlayerImpact(players = demoPlayers): PlayerWithImpact[] {
  const maxMinutes = Math.max(...players.map((player) => player.minutes), 1);
  return players
    .map((player) => {
      const impactScore =
        player.goals * 0.95 +
        player.assists * 0.82 +
        player.xG * 0.48 +
        player.xA * 0.5 +
        player.rating * 1.8 +
        (player.minutes / maxMinutes) * 7 +
        player.recoveries * 0.018 +
        player.pressingActions * 0.014;
      return {
        ...player,
        impactScore: round(impactScore, 1),
        minutesShare: round((player.minutes / maxMinutes) * 100, 1),
        goalContribution: player.goals + player.assists
      };
    })
    .sort((a, b) => b.impactScore - a.impactScore);
}

export function buildTrendData(matches: Match[]) {
  return matches.map((match, index) => ({
    match: `${index + 1}`,
    label: shortDate(match.date),
    opponent: match.opponent,
    xG: match.xG,
    xGA: match.xGA,
    control: match.matchControl,
    risk: match.defensiveRisk
  }));
}

export function buildCompetitionSplit(matches: Match[]) {
  const grouped = new Map<string, { competition: string; matches: number; points: number; xGD: number }>();
  for (const match of matches) {
    const current = grouped.get(match.competition) ?? {
      competition: match.competition,
      matches: 0,
      points: 0,
      xGD: 0
    };
    current.matches += 1;
    current.points += resultPoints[match.result];
    current.xGD += match.xG - match.xGA;
    grouped.set(match.competition, current);
  }
  return Array.from(grouped.values()).map((item) => ({ ...item, xGD: round(item.xGD, 1) }));
}

export function calculateFormIndex(matches: Match[]) {
  if (!matches.length) return 0;
  const recent = [...matches].sort((a, b) => a.date.localeCompare(b.date)).slice(-6);
  const weighted = recent.reduce((acc, match, index) => {
    const weight = index + 1;
    return acc + (resultPoints[match.result] / 3) * 100 * weight;
  }, 0);
  const max = recent.reduce((acc, _match, index) => acc + (index + 1) * 100, 0);
  return round((weighted / Math.max(max, 1)) * 100, 1);
}

export function calculateDeltas(current: Match[], baseline: Match[] = demoMatches) {
  const currentMetrics = calculateTeamMetrics(current);
  const baselineMetrics = calculateTeamMetrics(baseline);
  const currentTactical = calculateTacticalMetrics(current);
  const baselineTactical = calculateTacticalMetrics(baseline);

  return {
    formIndex: round(currentMetrics.formIndex - baselineMetrics.formIndex, 1),
    xGD: round(currentMetrics.xGD / Math.max(currentMetrics.matches, 1) - baselineMetrics.xGD / baselineMetrics.matches, 2),
    defensiveStability: round(currentMetrics.defensiveStability - baselineMetrics.defensiveStability, 1),
    tacticalRiskScore: round(currentTactical.tacticalRiskScore - baselineTactical.tacticalRiskScore, 1)
  };
}

export function selectedPlayer(filters: AnalyticsFilters) {
  return calculatePlayerImpact().find((player) => player.id === filters.playerId);
}

export function venueLabel(venue: Venue, locale: "ua" | "en") {
  const labels = {
    ua: { home: "Дім", away: "Виїзд", neutral: "Нейтр." },
    en: { home: "Home", away: "Away", neutral: "Neutral" }
  };
  return labels[locale][venue];
}

export function resultLabel(result: Match["result"], locale: "ua" | "en") {
  const labels = {
    ua: { win: "П", draw: "Н", loss: "ПР" },
    en: { win: "W", draw: "D", loss: "L" }
  };
  return labels[locale][result];
}

export function shortDate(value: string) {
  return new Intl.DateTimeFormat("uk-UA", { day: "2-digit", month: "short" }).format(new Date(value));
}

function average<T extends keyof Match>(matches: Match[], key: T) {
  if (!matches.length) return 0;
  return matches.reduce((acc, match) => acc + Number(match[key]), 0) / matches.length;
}

export function round(value: number, decimals = 0) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function clamp(value: number, min = 0, max = 100) {
  return round(Math.min(max, Math.max(min, value)), 1);
}
